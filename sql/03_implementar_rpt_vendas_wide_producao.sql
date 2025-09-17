-- ============================================
-- IMPLEMENTAÇÃO PRODUÇÃO: VIEW MATERIALIZADA VENDAS
-- Dashboard Comercial - Sienge Analytics (AMBIENTE REAL)
-- ============================================

-- Dropar view se existir
DROP MATERIALIZED VIEW IF EXISTS rpt_vendas_wide CASCADE;

-- Criar view materializada otimizada para o ambiente de produção
CREATE MATERIALIZED VIEW rpt_vendas_wide AS
SELECT
  -- =====================================
  -- 📅 DIMENSÕES DE TEMPO
  -- =====================================
  cv."contractDate"::date                         AS data_contrato,
  EXTRACT(YEAR FROM cv."contractDate")            AS ano,
  EXTRACT(QUARTER FROM cv."contractDate")         AS trimestre,
  EXTRACT(MONTH FROM cv."contractDate")           AS mes,
  TO_CHAR(cv."contractDate", 'YYYY-MM')          AS ano_mes,
  TO_CHAR(cv."contractDate", 'TMMonth')          AS nome_mes,
  EXTRACT(DOW FROM cv."contractDate")             AS dia_semana,
  TO_CHAR(cv."contractDate", 'TMDay')            AS nome_dia,
  EXTRACT(WEEK FROM cv."contractDate")            AS semana_ano,

  -- =====================================
  -- 🏢 DIMENSÕES DE EMPRESA
  -- =====================================
  COALESCE(emp."nomeEmpresa", cv."companyName", 'Não informado') AS empresa_nome,
  COALESCE(emp.cidade, 'Não informado')          AS empresa_cidade,
  COALESCE(emp.estado, 'Não informado')          AS empresa_estado,

  -- Região derivada do estado
  CASE
    WHEN emp.estado IN ('SP', 'RJ', 'MG', 'ES') THEN 'Sudeste'
    WHEN emp.estado IN ('PR', 'SC', 'RS') THEN 'Sul'
    WHEN emp.estado IN ('GO', 'MT', 'MS', 'DF') THEN 'Centro-Oeste'
    WHEN emp.estado IN ('BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA') THEN 'Nordeste'
    WHEN emp.estado IN ('AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO') THEN 'Norte'
    ELSE 'Não informado'
  END                                             AS empresa_regiao,

  -- =====================================
  -- 🏗️ DIMENSÕES DE EMPREENDIMENTO
  -- =====================================
  COALESCE(empr.nome, cv."enterpriseName", 'Não informado') AS empreendimento_nome,
  COALESCE(empr."nomeComercial", empr.nome, 'Não informado') AS empreendimento_nome_comercial,
  COALESCE(empr.tipo, 'Não informado')           AS empreendimento_tipo,

  -- =====================================
  -- 🏠 DIMENSÕES DE UNIDADE
  -- =====================================
  COALESCE(uni.nome, 'Unidade ' || cv.id::text) AS unidade_nome,
  COALESCE(uni."tipoImovel", 'Não informado')    AS unidade_tipo,

  -- Faixa de área
  CASE
    WHEN uni."areaPrivativa" IS NULL THEN 'Não informado'
    WHEN uni."areaPrivativa" < 50 THEN 'Até 50m²'
    WHEN uni."areaPrivativa" BETWEEN 50 AND 100 THEN '50-100m²'
    WHEN uni."areaPrivativa" BETWEEN 100 AND 150 THEN '100-150m²'
    WHEN uni."areaPrivativa" > 150 THEN 'Acima 150m²'
    ELSE 'Não informado'
  END                                             AS unidade_faixa_area,

  uni."areaPrivativa"                             AS unidade_area_privativa,
  COALESCE(uni.pavimento, 'Não informado')       AS unidade_pavimento,

  -- =====================================
  -- 👤 INFORMAÇÕES DE CLIENTE (simplificadas)
  -- =====================================
  CASE
    WHEN cv."salesContractCustomers" IS NOT NULL AND jsonb_array_length(cv."salesContractCustomers") > 0 THEN
      COALESCE(
        cv."salesContractCustomers"->0->>'customerName',
        cv."salesContractCustomers"->0->>'name',
        'Cliente do contrato ' || cv.id::text
      )
    ELSE 'Cliente não identificado'
  END                                             AS cliente_principal,

  -- =====================================
  -- 📊 PERFORMANCE - Valores e Volumes
  -- =====================================
  COALESCE(cv.value, 0)                          AS "Performance — Valor Contrato",
  COALESCE(cv."totalSellingValue", cv.value, 0)  AS "Performance — Valor Venda Total",

  -- Calcular valor por m² se área disponível
  CASE
    WHEN uni."areaPrivativa" > 0 AND cv.value > 0
    THEN ROUND((cv.value / uni."areaPrivativa")::numeric, 2)
    ELSE NULL
  END                                             AS "Performance — Valor por M²",

  -- Margem simplificada
  CASE
    WHEN cv."totalSellingValue" > 0 AND cv.value > 0
    THEN ROUND(((cv."totalSellingValue" - cv.value) / cv."totalSellingValue" * 100)::numeric, 2)
    ELSE NULL
  END                                             AS "Performance — Margem Bruta (%)",

  -- Tempo desde cadastro do empreendimento
  CASE
    WHEN empr."dataCadastro" IS NOT NULL AND cv."contractDate" IS NOT NULL
    THEN EXTRACT(DAY FROM cv."contractDate" - empr."dataCadastro")::int
    ELSE NULL
  END                                             AS "Performance — Tempo Venda (dias)",

  -- =====================================
  -- 💰 CONVERSIONS - Status e Resultados
  -- =====================================
  COALESCE(cv.situation, cv."contractStatus", 'Não informado') AS "Conversions — Status Contrato",

  -- Flags de conversão
  CASE WHEN LOWER(COALESCE(cv.situation, cv."contractStatus", '')) IN ('ativo', 'assinado', 'vigente') THEN 1 ELSE 0 END AS "Conversions — Contratos Ativos",
  CASE WHEN LOWER(COALESCE(cv.situation, cv."contractStatus", '')) IN ('cancelado', 'rescindido') THEN 1 ELSE 0 END AS "Conversions — Contratos Cancelados",
  CASE WHEN cv."keysDeliveredAt" IS NOT NULL THEN 1 ELSE 0 END AS "Conversions — Chaves Entregues",
  CASE WHEN cv."contractDate" IS NOT NULL THEN 1 ELSE 0 END AS "Conversions — Contratos Assinados",

  -- Data de entrega das chaves
  cv."keysDeliveredAt"::date                      AS "Conversions — Data Entrega Chaves",

  -- =====================================
  -- 💳 FINANCIAL - Aspectos Financeiros
  -- =====================================
  COALESCE(cv."discountPercentage", 0)           AS "Financial — Desconto (%)",

  -- Valor do desconto calculado
  CASE
    WHEN cv."discountPercentage" > 0 AND cv.value > 0
    THEN ROUND((cv."discountPercentage" * cv.value / 100)::numeric, 2)
    ELSE 0
  END                                             AS "Financial — Valor Desconto",

  -- Forma de pagamento derivada
  CASE
    WHEN cv."paymentMethod" IS NOT NULL THEN cv."paymentMethod"
    WHEN cv."interestType" IS NOT NULL THEN 'Financiado'
    WHEN cv."installmentPlan" IS NOT NULL THEN 'Parcelado'
    ELSE 'À Vista'
  END                                             AS "Financial — Forma Pagamento",

  COALESCE(cv."interestPercentage", 0)           AS "Financial — Taxa Juros (%)",
  COALESCE(cv."fineRate", 0)                     AS "Financial — Taxa Multa (%)",

  -- Parcelas
  COALESCE(cv."totalInstallments", 0)            AS "Financial — Total Parcelas",
  COALESCE(cv."paidInstallments", 0)             AS "Financial — Parcelas Pagas",
  COALESCE(cv."remainingBalance", 0)             AS "Financial — Saldo Devedor",

  -- =====================================
  -- 🎯 SEGMENTAÇÃO E ANÁLISE
  -- =====================================

  -- Segmentação por valor
  CASE
    WHEN cv.value IS NULL THEN 'Não classificado'
    WHEN cv.value < 200000 THEN 'Econômico'
    WHEN cv.value BETWEEN 200000 AND 500000 THEN 'Médio'
    WHEN cv.value BETWEEN 500000 AND 1000000 THEN 'Médio-Alto'
    WHEN cv.value > 1000000 THEN 'Alto Padrão'
    ELSE 'Não classificado'
  END                                             AS "Segmentation — Faixa Valor",

  -- Canal de venda
  CASE
    WHEN cv."salesRepresentative" IS NOT NULL AND cv."salesRepresentative" != '' THEN 'Corretor'
    ELSE 'Direto'
  END                                             AS "Segmentation — Canal Venda",

  -- Tipo de contrato
  COALESCE(cv."contractType", 'Padrão')          AS "Segmentation — Tipo Contrato",

  -- =====================================
  -- 📅 DATAS IMPORTANTES
  -- =====================================
  cv."issueDate"::date                           AS "Dates — Data Emissão",
  cv."accountingDate"::date                      AS "Dates — Data Contabilização",
  cv."expectedDeliveryDate"::date                AS "Dates — Previsão Entrega",
  cv."lastPaymentDate"::date                     AS "Dates — Último Pagamento",
  cv."nextPaymentDate"::date                     AS "Dates — Próximo Pagamento",

  -- =====================================
  -- 🔢 IDS TÉCNICOS (para drill-through)
  -- =====================================
  cv.id                                           AS contrato_id,
  cv."companyId"                                  AS empresa_id,
  cv."enterpriseId"                               AS empreendimento_id,
  cv.number                                       AS numero_contrato,
  cv."externalId"                                 AS id_externo

FROM contratos_venda cv
-- JOINs com as tabelas relacionadas
LEFT JOIN empresas emp ON emp."idEmpresa" = cv."companyId"
LEFT JOIN empreendimentos empr ON empr.id = cv."enterpriseId"
LEFT JOIN unidades uni ON uni."idContrato" = cv.id

-- Filtros básicos para dados válidos
WHERE cv."contractDate" IS NOT NULL
  AND cv."contractDate" >= '2020-01-01'  -- Filtrar dados muito antigos
  AND COALESCE(cv.value, 0) > 0;         -- Apenas contratos com valor

-- =====================================
-- 🚀 ÍNDICES PARA PERFORMANCE
-- =====================================
CREATE INDEX idx_rpt_vendas_data_contrato ON rpt_vendas_wide (data_contrato);
CREATE INDEX idx_rpt_vendas_ano_mes ON rpt_vendas_wide (ano, mes);
CREATE INDEX idx_rpt_vendas_empresa ON rpt_vendas_wide (empresa_regiao, empresa_estado);
CREATE INDEX idx_rpt_vendas_empreendimento ON rpt_vendas_wide (empreendimento_nome);
CREATE INDEX idx_rpt_vendas_status ON rpt_vendas_wide ("Conversions — Status Contrato");
CREATE INDEX idx_rpt_vendas_valor ON rpt_vendas_wide ("Performance — Valor Contrato");
CREATE INDEX idx_rpt_vendas_faixa_valor ON rpt_vendas_wide ("Segmentation — Faixa Valor");

-- =====================================
-- 📝 COMENTÁRIOS E METADADOS
-- =====================================
COMMENT ON MATERIALIZED VIEW rpt_vendas_wide IS
'View materializada para Dashboard Comercial - Looker Studio (PRODUÇÃO)
Grão: Contrato de Venda
Métricas: Performance, Conversions, Financial, Segmentation';

-- =====================================
-- ✅ VERIFICAÇÃO DOS DADOS
-- =====================================
SELECT
  COUNT(*) as total_contratos,
  MIN(data_contrato) as data_mais_antiga,
  MAX(data_contrato) as data_mais_recente,
  COUNT(DISTINCT empresa_nome) as total_empresas,
  COUNT(DISTINCT empreendimento_nome) as total_empreendimentos,
  ROUND(SUM("Performance — Valor Contrato")::numeric, 2) as valor_total_contratos
FROM rpt_vendas_wide;