-- ============================================
-- IMPLEMENTAÇÃO: VIEW ÚNICA MASTER SIENGE
-- Fonte Definitiva para API REST e Looker Studio
-- ============================================

-- 🎯 OBJETIVO:
-- Criar view materializada única que unifique todos os domínios
-- (Contratos, Financeiro, Movimentos) com grupos semânticos limpos

-- =====================================
-- 🗑️ LIMPEZA (caso já exista)
-- =====================================
DROP MATERIALIZED VIEW IF EXISTS rpt_sienge_master_wide CASCADE;

-- =====================================
-- 📊 CRIAÇÃO DA VIEW ÚNICA MASTER
-- =====================================
CREATE MATERIALIZED VIEW rpt_sienge_master_wide AS

WITH base_dados AS (
  -- =====================================
  -- 📋 DOMÍNIO: CONTRATOS DE VENDA
  -- =====================================
  SELECT
    gen_random_uuid() as row_id,
    'contratos'::text as domain_type,
    'contratos_venda'::text as source_table,
    cv.id as source_id,

    -- =====================================
    -- 📅 DATA (group='Data')
    -- =====================================
    cv."contractDate"::date as data_principal,
    EXTRACT(YEAR FROM cv."contractDate")::integer as ano,
    EXTRACT(QUARTER FROM cv."contractDate")::integer as trimestre,
    EXTRACT(MONTH FROM cv."contractDate")::integer as mes,
    TO_CHAR(cv."contractDate", 'YYYY-MM') as ano_mes,
    TO_CHAR(cv."contractDate", 'TMMonth') as nome_mes,

    -- =====================================
    -- 🏢 EMPRESAS (group='Empresas')
    -- =====================================
    COALESCE(emp."nomeEmpresa", cv."companyName", 'Não informado') as empresa_nome,
    COALESCE(emp.cidade, 'Não informado') as empresa_cidade,
    COALESCE(emp.estado, 'Não informado') as empresa_estado,
    CASE
      WHEN emp.estado IN ('SP', 'RJ', 'MG', 'ES') THEN 'Sudeste'
      WHEN emp.estado IN ('PR', 'SC', 'RS') THEN 'Sul'
      WHEN emp.estado IN ('GO', 'MT', 'MS', 'DF') THEN 'Centro-Oeste'
      WHEN emp.estado IN ('BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA') THEN 'Nordeste'
      WHEN emp.estado IN ('AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO') THEN 'Norte'
      ELSE 'Não informado'
    END as empresa_regiao,
    emp.cnpj as empresa_cnpj,

    -- =====================================
    -- 📋 CONTRATOS (group='Contratos')
    -- =====================================
    COALESCE(cv.value, 0) as valor_contrato,
    COALESCE(cv.situation, cv."contractStatus", 'Não informado') as status_contrato,
    COALESCE(cv."contractType", 'Padrão') as tipo_contrato,
    cv.number as numero_contrato,
    CASE WHEN LOWER(COALESCE(cv.situation, cv."contractStatus", '')) IN ('ativo', 'assinado', 'vigente')
         THEN true ELSE false END as contratos_ativos,
    CASE WHEN cv."keysDeliveredAt" IS NOT NULL THEN true ELSE false END as chaves_entregues,
    CASE WHEN cv."contractDate" IS NOT NULL THEN true ELSE false END as contratos_assinados,

    -- =====================================
    -- 💰 FINANCEIRO (group='Financeiro')
    -- =====================================
    NULL::numeric as valor_original,
    NULL::numeric as valor_pago,
    COALESCE(cv."remainingBalance", 0) as saldo_devedor,
    NULL::numeric as taxa_inadimplencia,
    NULL::integer as dias_atraso,
    CASE
      WHEN cv."paymentMethod" IS NOT NULL THEN cv."paymentMethod"
      WHEN cv."interestType" IS NOT NULL THEN 'Financiado'
      WHEN cv."installmentPlan" IS NOT NULL THEN 'Parcelado'
      ELSE 'À Vista'
    END as forma_pagamento,
    COALESCE(cv."interestPercentage", 0) as taxa_juros,
    NULL::numeric as aging_0_30,
    NULL::numeric as aging_31_60,
    NULL::numeric as aging_61_90,
    NULL::numeric as aging_90_plus,

    -- =====================================
    -- 📊 PERFORMANCE (group='Performance')
    -- =====================================
    CASE
      WHEN cv."totalSellingValue" > 0 AND cv.value > 0
      THEN ROUND(((cv."totalSellingValue" - cv.value) / cv."totalSellingValue" * 100)::numeric, 2)
      ELSE NULL
    END as margem_bruta,
    CASE
      WHEN empr."dataCadastro" IS NOT NULL AND cv."contractDate" IS NOT NULL
      THEN EXTRACT(DAY FROM cv."contractDate" - empr."dataCadastro")::integer
      ELSE NULL
    END as tempo_venda,
    CASE
      WHEN uni."areaPrivativa" > 0 AND cv.value > 0
      THEN ROUND((cv.value / uni."areaPrivativa")::numeric, 2)
      ELSE NULL
    END as valor_por_m2,
    NULL::numeric as eficiencia_cobranca,

    -- =====================================
    -- 👤 CLIENTES (group='Clientes')
    -- =====================================
    NULL as cliente_nome,
    CASE
      WHEN jsonb_array_length(COALESCE(cv."salesContractCustomers", '[]'::jsonb)) > 0 THEN
        COALESCE(
          cv."salesContractCustomers"->0->>'customerName',
          cv."salesContractCustomers"->0->>'name',
          'Cliente do contrato ' || cv.id::text
        )
      ELSE 'Cliente não identificado'
    END as cliente_principal,
    NULL as cliente_tipo,

    -- =====================================
    -- 🏗️ EMPREENDIMENTOS (group='Empreendimentos')
    -- =====================================
    COALESCE(empr.nome, cv."enterpriseName", 'Não informado') as empreendimento_nome,
    COALESCE(empr.tipo, 'Não informado') as empreendimento_tipo,
    COALESCE(uni."tipoImovel", 'Não informado') as unidade_tipo,
    uni."areaPrivativa" as unidade_area,
    CASE
      WHEN uni."areaPrivativa" IS NULL THEN 'Não informado'
      WHEN uni."areaPrivativa" < 50 THEN 'Até 50m²'
      WHEN uni."areaPrivativa" BETWEEN 50 AND 100 THEN '50-100m²'
      WHEN uni."areaPrivativa" BETWEEN 100 AND 150 THEN '100-150m²'
      WHEN uni."areaPrivativa" > 150 THEN 'Acima 150m²'
      ELSE 'Não informado'
    END as faixa_area,

    -- =====================================
    -- ✅ CONVERSÕES (group='Conversoes')
    -- =====================================
    CASE WHEN LOWER(COALESCE(cv.situation, cv."contractStatus", '')) IN ('cancelado', 'rescindido')
         THEN true ELSE false END as contratos_cancelados,
    false as titulos_pagos,
    false as titulos_vencidos

  FROM "contratos_venda" cv
  LEFT JOIN empresas emp ON emp."idEmpresa" = cv."companyId"
  LEFT JOIN empreendimentos empr ON empr.id = cv."enterpriseId"
  LEFT JOIN unidades uni ON uni."idContrato" = cv.id
  WHERE cv."contractDate" IS NOT NULL
    AND cv."contractDate" >= '2020-01-01'
    AND COALESCE(cv.value, 0) > 0

  UNION ALL

  -- =====================================
  -- 💰 DOMÍNIO: TÍTULOS A RECEBER
  -- =====================================
  SELECT
    gen_random_uuid() as row_id,
    'financeiro'::text as domain_type,
    'titulos_receber'::text as source_table,
    tr."idTituloReceber" as source_id,

    -- =====================================
    -- 📅 DATA (group='Data')
    -- =====================================
    tr."dataVencimento"::date as data_principal,
    EXTRACT(YEAR FROM tr."dataVencimento")::integer as ano,
    EXTRACT(QUARTER FROM tr."dataVencimento")::integer as trimestre,
    EXTRACT(MONTH FROM tr."dataVencimento")::integer as mes,
    TO_CHAR(tr."dataVencimento", 'YYYY-MM') as ano_mes,
    TO_CHAR(tr."dataVencimento", 'TMMonth') as nome_mes,

    -- =====================================
    -- 🏢 EMPRESAS (group='Empresas')
    -- =====================================
    COALESCE(emp."nomeEmpresa", 'Não informado') as empresa_nome,
    COALESCE(emp.cidade, 'Não informado') as empresa_cidade,
    COALESCE(emp.estado, 'Não informado') as empresa_estado,
    CASE
      WHEN emp.estado IN ('SP', 'RJ', 'MG', 'ES') THEN 'Sudeste'
      WHEN emp.estado IN ('PR', 'SC', 'RS') THEN 'Sul'
      WHEN emp.estado IN ('GO', 'MT', 'MS', 'DF') THEN 'Centro-Oeste'
      WHEN emp.estado IN ('BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA') THEN 'Nordeste'
      WHEN emp.estado IN ('AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO') THEN 'Norte'
      ELSE 'Não informado'
    END as empresa_regiao,
    emp.cnpj as empresa_cnpj,

    -- =====================================
    -- 📋 CONTRATOS (group='Contratos')
    -- =====================================
    NULL as valor_contrato,
    tr.status as status_contrato,
    NULL as tipo_contrato,
    tr."numeroDocumento" as numero_contrato,
    CASE WHEN LOWER(tr.status) IN ('ativo', 'aberto') THEN true ELSE false END as contratos_ativos,
    false as chaves_entregues,
    true as contratos_assinados, -- Se existe título, contrato foi assinado

    -- =====================================
    -- 💰 FINANCEIRO (group='Financeiro')
    -- =====================================
    tr."valorOriginal" as valor_original,
    COALESCE(tr."valorPago", 0) as valor_pago,
    (tr."valorOriginal" - COALESCE(tr."valorPago", 0)) as saldo_devedor,
    -- Taxa de inadimplência calculada por empresa (será implementada via window function)
    NULL::numeric as taxa_inadimplencia,
    GREATEST(0, EXTRACT(DAY FROM CURRENT_DATE - tr."dataVencimento"))::integer as dias_atraso,
    'Boleto/Transferência' as forma_pagamento, -- Padrão para títulos
    COALESCE(tr.juros, 0) as taxa_juros,

    -- AGING calculado
    CASE WHEN EXTRACT(DAY FROM CURRENT_DATE - tr."dataVencimento") BETWEEN 0 AND 30
         THEN (tr."valorOriginal" - COALESCE(tr."valorPago", 0)) ELSE 0 END as aging_0_30,
    CASE WHEN EXTRACT(DAY FROM CURRENT_DATE - tr."dataVencimento") BETWEEN 31 AND 60
         THEN (tr."valorOriginal" - COALESCE(tr."valorPago", 0)) ELSE 0 END as aging_31_60,
    CASE WHEN EXTRACT(DAY FROM CURRENT_DATE - tr."dataVencimento") BETWEEN 61 AND 90
         THEN (tr."valorOriginal" - COALESCE(tr."valorPago", 0)) ELSE 0 END as aging_61_90,
    CASE WHEN EXTRACT(DAY FROM CURRENT_DATE - tr."dataVencimento") > 90
         THEN (tr."valorOriginal" - COALESCE(tr."valorPago", 0)) ELSE 0 END as aging_90_plus,

    -- =====================================
    -- 📊 PERFORMANCE (group='Performance')
    -- =====================================
    NULL as margem_bruta,
    NULL as tempo_venda,
    NULL as valor_por_m2,
    -- Eficiência de cobrança: percentual pago do valor original
    CASE WHEN tr."valorOriginal" > 0
         THEN ROUND((COALESCE(tr."valorPago", 0) / tr."valorOriginal" * 100)::numeric, 2)
         ELSE NULL END as eficiencia_cobranca,

    -- =====================================
    -- 👤 CLIENTES (group='Clientes')
    -- =====================================
    cli."nomeCompleto" as cliente_nome,
    cli."nomeCompleto" as cliente_principal,
    cli."personType" as cliente_tipo,

    -- =====================================
    -- 🏗️ EMPREENDIMENTOS (group='Empreendimentos')
    -- =====================================
    NULL as empreendimento_nome,
    NULL as empreendimento_tipo,
    NULL as unidade_tipo,
    NULL as unidade_area,
    NULL as faixa_area,

    -- =====================================
    -- ✅ CONVERSÕES (group='Conversoes')
    -- =====================================
    CASE WHEN LOWER(tr.status) IN ('cancelado', 'baixado') THEN true ELSE false END as contratos_cancelados,
    CASE WHEN COALESCE(tr."valorPago", 0) > 0 THEN true ELSE false END as titulos_pagos,
    CASE WHEN tr."dataVencimento" < CURRENT_DATE AND COALESCE(tr."valorPago", 0) = 0
         THEN true ELSE false END as titulos_vencidos

  FROM "titulos_receber" tr
  LEFT JOIN empresas emp ON emp."idEmpresa" = tr."idEmpresa"
  LEFT JOIN clientes cli ON cli."idCliente" = tr."idCliente"
  WHERE tr."dataVencimento" IS NOT NULL
    AND tr."dataVencimento" >= '2020-01-01'
    AND tr."valorOriginal" > 0

  UNION ALL

  -- =====================================
  -- 🏦 DOMÍNIO: MOVIMENTOS BANCÁRIOS
  -- =====================================
  SELECT
    gen_random_uuid() as row_id,
    'movimentos'::text as domain_type,
    'movimentos_bancarios'::text as source_table,
    mb."bankMovementId" as source_id,

    -- =====================================
    -- 📅 DATA (group='Data')
    -- =====================================
    mb."bankMovementDate"::date as data_principal,
    EXTRACT(YEAR FROM mb."bankMovementDate")::integer as ano,
    EXTRACT(QUARTER FROM mb."bankMovementDate")::integer as trimestre,
    EXTRACT(MONTH FROM mb."bankMovementDate")::integer as mes,
    TO_CHAR(mb."bankMovementDate", 'YYYY-MM') as ano_mes,
    TO_CHAR(mb."bankMovementDate", 'TMMonth') as nome_mes,

    -- =====================================
    -- 🏢 EMPRESAS (group='Empresas')
    -- =====================================
    COALESCE(mb."companyName", 'Não informado') as empresa_nome,
    NULL as empresa_cidade,
    NULL as empresa_estado,
    NULL as empresa_regiao,
    NULL as empresa_cnpj,

    -- =====================================
    -- 📋 CONTRATOS (group='Contratos')
    -- =====================================
    NULL as valor_contrato,
    NULL as status_contrato,
    NULL as tipo_contrato,
    mb."documentIdentificationNumber" as numero_contrato,
    false as contratos_ativos,
    false as chaves_entregues,
    false as contratos_assinados,

    -- =====================================
    -- 💰 FINANCEIRO (group='Financeiro')
    -- =====================================
    mb."bankMovementAmount" as valor_original,
    CASE WHEN mb."bankMovementOperationType" = 'C' -- Crédito
         THEN mb."bankMovementAmount" ELSE 0 END as valor_pago,
    CASE WHEN mb."bankMovementOperationType" = 'D' -- Débito
         THEN mb."bankMovementAmount" ELSE 0 END as saldo_devedor,
    NULL as taxa_inadimplencia,
    NULL as dias_atraso,
    mb."bankMovementHistoricName" as forma_pagamento,
    NULL as taxa_juros,
    NULL as aging_0_30,
    NULL as aging_31_60,
    NULL as aging_61_90,
    NULL as aging_90_plus,

    -- =====================================
    -- 📊 PERFORMANCE (group='Performance')
    -- =====================================
    NULL as margem_bruta,
    NULL as tempo_venda,
    NULL as valor_por_m2,
    NULL as eficiencia_cobranca,

    -- =====================================
    -- 👤 CLIENTES (group='Clientes')
    -- =====================================
    mb."clientName" as cliente_nome,
    mb."clientName" as cliente_principal,
    NULL as cliente_tipo,

    -- =====================================
    -- 🏗️ EMPREENDIMENTOS (group='Empreendimentos')
    -- =====================================
    NULL as empreendimento_nome,
    NULL as empreendimento_tipo,
    NULL as unidade_tipo,
    NULL as unidade_area,
    NULL as faixa_area,

    -- =====================================
    -- ✅ CONVERSÕES (group='Conversoes')
    -- =====================================
    false as contratos_cancelados,
    CASE WHEN mb."bankMovementOperationType" = 'C' THEN true ELSE false END as titulos_pagos,
    false as titulos_vencidos

  FROM "movimentos_bancarios" mb
  WHERE mb."bankMovementDate" IS NOT NULL
    AND mb."bankMovementDate" >= '2020-01-01'
    AND mb."bankMovementAmount" > 0
)

-- =====================================
-- 📊 SELEÇÃO FINAL COM WINDOW FUNCTIONS
-- =====================================
SELECT
  row_id,
  domain_type,
  source_table,
  source_id,

  -- Campos temporais
  data_principal,
  ano,
  trimestre,
  mes,
  ano_mes,
  nome_mes,

  -- Campos de empresa
  empresa_nome,
  empresa_cidade,
  empresa_estado,
  empresa_regiao,
  empresa_cnpj,

  -- Campos de contratos
  valor_contrato,
  status_contrato,
  tipo_contrato,
  numero_contrato,
  contratos_ativos,
  chaves_entregues,
  contratos_assinados,

  -- Campos financeiros
  valor_original,
  valor_pago,
  saldo_devedor,
  -- Taxa de inadimplência calculada por empresa usando window function
  CASE WHEN domain_type = 'financeiro' THEN
    ROUND((SUM(CASE WHEN titulos_vencidos THEN saldo_devedor ELSE 0 END) OVER (PARTITION BY empresa_nome) /
           NULLIF(SUM(valor_original) OVER (PARTITION BY empresa_nome), 0) * 100)::numeric, 2)
  ELSE NULL END as taxa_inadimplencia,
  dias_atraso,
  forma_pagamento,
  taxa_juros,
  aging_0_30,
  aging_31_60,
  aging_61_90,
  aging_90_plus,

  -- Campos de performance
  margem_bruta,
  tempo_venda,
  valor_por_m2,
  eficiencia_cobranca,

  -- Campos de clientes
  cliente_nome,
  cliente_principal,
  cliente_tipo,

  -- Campos de empreendimentos
  empreendimento_nome,
  empreendimento_tipo,
  unidade_tipo,
  unidade_area,
  faixa_area,

  -- Campos de conversões
  contratos_cancelados,
  titulos_pagos,
  titulos_vencidos

FROM base_dados
ORDER BY data_principal DESC, domain_type, source_id;

-- =====================================
-- 🚀 ÍNDICES PARA PERFORMANCE
-- =====================================

-- Índices principais para queries da API
CREATE INDEX idx_master_wide_data_principal ON rpt_sienge_master_wide (data_principal);
CREATE INDEX idx_master_wide_domain_type ON rpt_sienge_master_wide (domain_type);
CREATE INDEX idx_master_wide_empresa ON rpt_sienge_master_wide (empresa_nome);

-- Índice composto para query principal da API (últimos 12 meses)
CREATE INDEX idx_master_wide_api_query ON rpt_sienge_master_wide (data_principal DESC, domain_type)
WHERE data_principal >= CURRENT_DATE - INTERVAL '12 months';

-- Índices para filtros específicos
CREATE INDEX idx_master_wide_ano_mes ON rpt_sienge_master_wide (ano, mes);
CREATE INDEX idx_master_wide_status ON rpt_sienge_master_wide (status_contrato)
WHERE status_contrato IS NOT NULL;
CREATE INDEX idx_master_wide_aging ON rpt_sienge_master_wide (dias_atraso)
WHERE dias_atraso IS NOT NULL AND dias_atraso > 0;

-- Índice para análises por região
CREATE INDEX idx_master_wide_regiao ON rpt_sienge_master_wide (empresa_regiao, empresa_estado);

-- Índice para análises financeiras
CREATE INDEX idx_master_wide_financeiro ON rpt_sienge_master_wide (domain_type, valor_original)
WHERE domain_type = 'financeiro';

-- Índice para análises de contratos
CREATE INDEX idx_master_wide_contratos ON rpt_sienge_master_wide (domain_type, valor_contrato)
WHERE domain_type = 'contratos';

-- =====================================
-- 📝 COMENTÁRIOS E METADADOS
-- =====================================
COMMENT ON MATERIALIZED VIEW rpt_sienge_master_wide IS
'View materializada única que unifica todos os domínios do Sienge
Última atualização: ' || NOW()::text || '
Grão: Transação (Contrato, Título ou Movimento)
Domínios: contratos, financeiro, movimentos
Grupos Semânticos: Data, Empresas, Contratos, Financeiro, Performance, Clientes, Empreendimentos, Conversoes
Dados desde: 2020-01-01';

-- =====================================
-- ✅ VERIFICAÇÃO DOS DADOS
-- =====================================

-- Verificar distribuição por domínio
SELECT
  domain_type,
  COUNT(*) as total_records,
  MIN(data_principal) as data_inicio,
  MAX(data_principal) as data_fim,
  COUNT(DISTINCT empresa_nome) as empresas_distintas,
  SUM(COALESCE(valor_contrato, valor_original, 0)) as valor_total
FROM rpt_sienge_master_wide
GROUP BY domain_type
ORDER BY total_records DESC;

-- Verificar distribuição temporal dos últimos 12 meses
SELECT
  ano_mes,
  domain_type,
  COUNT(*) as registros,
  SUM(COALESCE(valor_contrato, valor_original, 0)) as valor_total
FROM rpt_sienge_master_wide
WHERE data_principal >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY ano_mes, domain_type
ORDER BY ano_mes DESC, domain_type;

-- Verificar dados de aging (apenas financeiro)
SELECT
  COUNT(*) as total_titulos,
  SUM(aging_0_30) as aging_0_30_total,
  SUM(aging_31_60) as aging_31_60_total,
  SUM(aging_61_90) as aging_61_90_total,
  SUM(aging_90_plus) as aging_90_plus_total,
  AVG(taxa_inadimplencia) as taxa_inadimplencia_media
FROM rpt_sienge_master_wide
WHERE domain_type = 'financeiro'
  AND data_principal >= CURRENT_DATE - INTERVAL '12 months';

-- Verificar performance da view
SELECT
  pg_size_pretty(pg_total_relation_size('rpt_sienge_master_wide')) as tamanho_total,
  pg_size_pretty(pg_relation_size('rpt_sienge_master_wide')) as tamanho_dados,
  (SELECT COUNT(*) FROM rpt_sienge_master_wide) as total_registros;

-- Verificar índices criados
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'rpt_sienge_master_wide'
ORDER BY indexname;

-- =====================================
-- 🎯 QUERY EXEMPLO PARA API
-- =====================================
/*
-- Esta query será usada pela API /api/datawarehouse/vendas:

SELECT * FROM rpt_sienge_master_wide
WHERE data_principal >= CURRENT_DATE - INTERVAL '12 months'
ORDER BY data_principal DESC
LIMIT 10000;

-- Para filtrar apenas contratos:
SELECT * FROM rpt_sienge_master_wide
WHERE domain_type = 'contratos'
  AND data_principal >= CURRENT_DATE - INTERVAL '12 months'
ORDER BY data_principal DESC;

-- Para análises cross-domain:
SELECT
  domain_type,
  empresa_nome,
  COUNT(*) as transacoes,
  SUM(COALESCE(valor_contrato, valor_original, 0)) as valor_total
FROM rpt_sienge_master_wide
WHERE data_principal >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY domain_type, empresa_nome
ORDER BY valor_total DESC;
*/

-- =====================================
-- ✅ IMPLEMENTAÇÃO CONCLUÍDA
-- =====================================
SELECT
  'rpt_sienge_master_wide criada com sucesso! 🎉' as status,
  COUNT(*) as total_registros,
  COUNT(DISTINCT domain_type) as dominios,
  COUNT(DISTINCT empresa_nome) as empresas
FROM rpt_sienge_master_wide;