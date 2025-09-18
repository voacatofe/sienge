-- ================================================
-- VIEW MATERIALIZADA PARA LOOKER STUDIO CONNECTOR
-- Versão 3.0 - Incluindo novos campos normalizados
-- ================================================

DROP MATERIALIZED VIEW IF EXISTS rpt_sienge_master_wide CASCADE;

CREATE MATERIALIZED VIEW rpt_sienge_master_wide AS
WITH
-- CTE para contratos com campos calculados
contratos_base AS (
  SELECT
    cv.id,
    cv."contractDate" as data_contrato,
    cv.number as numero_contrato,
    cv.situation as situacao_contrato,

    -- IDs e referências
    cv."enterpriseId" as id_empreendimento,
    cv."enterpriseName" as nome_empreendimento,
    cv."companyId" as id_empresa,
    cv."companyName" as nome_empresa,

    -- Valores financeiros principais
    COALESCE(cv.valor_total_contrato, cv.value, 0) as valor_contrato,
    COALESCE(cv.saldo_devedor_total, 0) as saldo_devedor,
    COALESCE(cv.valor_total_pago, 0) as valor_pago,
    COALESCE(cv.percentual_pago, 0) as percentual_pago,

    -- Comissões (novos campos)
    COALESCE(cv.tem_comissao, false) as tem_comissao,
    COALESCE(cv.valor_total_comissao, 0) as valor_comissao,
    cv.faixa_valor_comissao,
    COALESCE(cv.percentual_comissao_sobre_contrato, 0) as percentual_comissao,

    -- Parcelas e pagamento
    COALESCE(cv.total_parcelas_contrato, 0) as total_parcelas,
    COALESCE(cv.parcelas_pagas_contrato, 0) as parcelas_pagas,
    cv.forma_pagamento_principal as forma_pagamento,
    COALESCE(cv.tem_financiamento, false) as tem_financiamento,

    -- Juros e correção
    cv."correctionType" as tipo_correcao,
    cv."interestType" as tipo_juros,
    COALESCE(cv."interestPercentage", 0) as taxa_juros,
    COALESCE(cv."discountPercentage", 0) as percentual_desconto,

    -- Datas importantes
    cv."issueDate" as data_emissao,
    cv."accountingDate" as data_contabil,
    cv."expectedDeliveryDate" as data_entrega_prevista,
    cv."keysDeliveredAt" as data_entrega_chaves,
    cv."cancellationDate" as data_cancelamento,
    cv."cancellationReason" as motivo_cancelamento,
    COALESCE(cv."totalCancellationAmount", 0) as valor_cancelamento,

    -- Cliente principal
    cv.cliente_principal_nome,
    cv.cliente_principal_id,
    COALESCE(cv.total_clientes, 1) as total_clientes,

    -- Tipo e classificação
    cv.tipo_contrato_cliente,
    cv.indexador_principal,

    -- Timestamps
    cv.data_criacao_sienge,
    cv.data_ultima_atualizacao_sienge,
    cv."dataCadastro" as data_cadastro_sistema,
    cv."dataAtualizacao" as data_atualizacao_sistema,

    -- Status derivados
    CASE
      WHEN cv."cancellationDate" IS NOT NULL THEN false
      WHEN cv.situation IN ('Ativo', 'Active', 'ATIVO') THEN true
      ELSE false
    END as contrato_ativo,

    CASE
      WHEN cv."keysDeliveredAt" IS NOT NULL THEN true
      ELSE false
    END as chaves_entregues,

    CASE
      WHEN cv."contractDate" IS NOT NULL AND cv.situation NOT IN ('Cancelado', 'Cancelled', 'CANCELADO') THEN true
      ELSE false
    END as contrato_assinado,

    CASE
      WHEN cv."cancellationDate" IS NOT NULL THEN true
      ELSE false
    END as contrato_cancelado

  FROM contratos_venda cv
),

-- CTE para clientes
clientes_base AS (
  SELECT
    c."idCliente" as id_cliente,
    c."nomeCompleto" as nome_cliente,
    c."cpfCnpj" as cpf_cnpj,
    c.email as email_cliente,
    c."dataNascimento" as data_nascimento,
    c.nacionalidade,
    c."estadoCivilStr" as estado_civil,
    c."profissaoStr" as profissao,
    c."personType" as tipo_pessoa,
    c."clientType" as tipo_cliente,
    c."idEmpresa" as id_empresa_cliente,
    c.telefone_principal,
    c.telefone_principal_tipo,
    c.ativo as cliente_ativo,
    c."dataCadastro" as data_cadastro_cliente
  FROM clientes c
),

-- CTE para empreendimentos
empreendimentos_base AS (
  SELECT
    e.id as id_empreendimento,
    e.nome as nome_empreendimento,
    e."nomeComercial" as nome_comercial_empreendimento,
    e.tipo as tipo_empreendimento,
    e.endereco as endereco_empreendimento,
    e.cnpj as cnpj_empreendimento,
    e."idEmpresa" as id_empresa_empreendimento,
    e."nomeEmpresa" as nome_empresa_empreendimento,
    e."descricaoTipoObra" as tipo_obra,
    e."dataCadastro" as data_cadastro_empreendimento
  FROM empreendimentos e
),

-- CTE para unidades
unidades_base AS (
  SELECT
    u.id as id_unidade,
    u."idEmpreendimento" as id_empreendimento_unidade,
    u.nome as nome_unidade,
    u."tipoImovel" as tipo_imovel,
    u."estoqueComercial" as estoque_comercial,
    u."areaPrivativa" as area_privativa,
    u."areaComum" as area_comum,
    u."areaUtil" as area_util,
    u."areaTerreno" as area_terreno,
    COALESCE(u."areaPrivativa", u."areaUtil", 0) as area_unidade,
    u.pavimento,
    u."dataEntrega" as data_entrega_unidade,
    u."valorTerreno" as valor_terreno,
    u."valorIPTU" as valor_iptu,
    u."numeroContrato" as numero_contrato_unidade,
    u.total_unidades_filhas,
    u.principal_unidade_filha,
    u.total_agrupamentos,

    -- Faixa de área para análise
    CASE
      WHEN COALESCE(u."areaPrivativa", u."areaUtil", 0) = 0 THEN 'Sem área'
      WHEN COALESCE(u."areaPrivativa", u."areaUtil", 0) < 50 THEN 'Até 50m²'
      WHEN COALESCE(u."areaPrivativa", u."areaUtil", 0) < 100 THEN '50-100m²'
      WHEN COALESCE(u."areaPrivativa", u."areaUtil", 0) < 200 THEN '100-200m²'
      WHEN COALESCE(u."areaPrivativa", u."areaUtil", 0) < 500 THEN '200-500m²'
      ELSE 'Acima de 500m²'
    END as faixa_area
  FROM unidades u
),

-- CTE para empresas
empresas_base AS (
  SELECT
    e."idEmpresa" as id_empresa,
    e."nomeEmpresa" as nome_empresa,
    e.cnpj as cnpj_empresa,
    e.cidade as cidade_empresa,
    e.estado as estado_empresa,
    CASE
      WHEN e.estado IN ('SP', 'RJ', 'ES', 'MG') THEN 'Sudeste'
      WHEN e.estado IN ('RS', 'SC', 'PR') THEN 'Sul'
      WHEN e.estado IN ('BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA') THEN 'Nordeste'
      WHEN e.estado IN ('GO', 'MT', 'MS', 'DF') THEN 'Centro-Oeste'
      WHEN e.estado IN ('AC', 'RO', 'AM', 'RR', 'PA', 'AP', 'TO') THEN 'Norte'
      ELSE 'Não informado'
    END as regiao_empresa,
    e.ativo as empresa_ativa
  FROM empresas e
)

-- QUERY PRINCIPAL - União de todos os domínios
SELECT
  -- Identificador único e tipo de domínio
  'contratos' as domain_type,
  cb.id::text as unique_id,

  -- Dimensões temporais universais
  COALESCE(cb.data_contrato, cb.data_emissao, cb.data_cadastro_sistema) as data_principal,
  EXTRACT(YEAR FROM COALESCE(cb.data_contrato, cb.data_emissao, cb.data_cadastro_sistema))::text as ano,
  EXTRACT(QUARTER FROM COALESCE(cb.data_contrato, cb.data_emissao, cb.data_cadastro_sistema))::integer as trimestre,
  EXTRACT(MONTH FROM COALESCE(cb.data_contrato, cb.data_emissao, cb.data_cadastro_sistema))::text as mes,
  TO_CHAR(COALESCE(cb.data_contrato, cb.data_emissao, cb.data_cadastro_sistema), 'YYYY-MM') as ano_mes,
  TO_CHAR(COALESCE(cb.data_contrato, cb.data_emissao, cb.data_cadastro_sistema), 'Month') as nome_mes,

  -- Dados da empresa
  COALESCE(emp.nome_empresa, cb.nome_empresa, 'Não informado') as empresa_nome,
  COALESCE(emp.cidade_empresa, 'Não informado') as empresa_cidade,
  COALESCE(emp.estado_empresa, 'Não informado') as empresa_estado,
  COALESCE(emp.regiao_empresa, 'Não informado') as empresa_regiao,
  emp.cnpj_empresa as empresa_cnpj,

  -- Dados do contrato
  cb.valor_contrato,
  cb.situacao_contrato as status_contrato,
  COALESCE(cb.tipo_contrato_cliente, 'Venda') as tipo_contrato,
  cb.numero_contrato,
  cb.contrato_ativo as contratos_ativos,
  cb.chaves_entregues,
  cb.contrato_assinado as contratos_assinados,
  cb.contrato_cancelado as contratos_cancelados,

  -- Dados financeiros
  cb.saldo_devedor,
  COALESCE(cb.forma_pagamento, 'À vista') as forma_pagamento,
  cb.taxa_juros,
  cb.total_parcelas,
  cb.parcelas_pagas,
  cb.percentual_pago,
  cb.tem_financiamento,

  -- Comissões
  cb.tem_comissao,
  cb.valor_comissao,
  COALESCE(cb.faixa_valor_comissao, 'Sem Comissão') as faixa_valor_comissao,
  cb.percentual_comissao,

  -- Performance (margem calculada)
  CASE
    WHEN cb.valor_contrato > 0 THEN
      ((cb.valor_contrato - COALESCE(cb.valor_comissao, 0)) / cb.valor_contrato * 100)
    ELSE 0
  END as margem_bruta,

  -- Cliente principal
  COALESCE(cb.cliente_principal_nome, cli.nome_cliente, 'Cliente não identificado') as cliente_principal,
  cb.total_clientes as quantidade_clientes,

  -- Empreendimento
  COALESCE(emp_info.nome_empreendimento, cb.nome_empreendimento, 'Não informado') as empreendimento_nome,
  COALESCE(emp_info.tipo_empreendimento, 'Residencial') as empreendimento_tipo,

  -- Unidade (quando disponível via join)
  'N/A' as unidade_tipo,
  0::numeric as unidade_area,
  'N/A' as faixa_area,

  -- Datas adicionais para análise
  cb.data_contrato,
  cb.data_emissao,
  cb.data_entrega_prevista,
  cb.data_entrega_chaves,
  cb.data_cancelamento,
  cb.data_criacao_sienge,
  cb.data_ultima_atualizacao_sienge,

  -- Indicadores calculados
  CASE
    WHEN cb.data_entrega_chaves IS NOT NULL AND cb.data_entrega_prevista IS NOT NULL THEN
      EXTRACT(DAY FROM (cb.data_entrega_chaves - cb.data_entrega_prevista))::integer
    ELSE NULL
  END as dias_atraso_entrega,

  CASE
    WHEN cb.data_contrato IS NOT NULL THEN
      (CURRENT_DATE - cb.data_contrato::date)::integer
    ELSE NULL
  END as dias_desde_contrato,

  -- Classificações para análise
  CASE
    WHEN cb.valor_contrato = 0 THEN 'Sem valor'
    WHEN cb.valor_contrato < 100000 THEN 'Até 100k'
    WHEN cb.valor_contrato < 300000 THEN '100k-300k'
    WHEN cb.valor_contrato < 500000 THEN '300k-500k'
    WHEN cb.valor_contrato < 1000000 THEN '500k-1M'
    ELSE 'Acima de 1M'
  END as faixa_valor_contrato,

  CASE
    WHEN cb.percentual_pago = 0 THEN 'Não iniciado'
    WHEN cb.percentual_pago < 25 THEN 'Inicial (0-25%)'
    WHEN cb.percentual_pago < 50 THEN 'Em andamento (25-50%)'
    WHEN cb.percentual_pago < 75 THEN 'Avançado (50-75%)'
    WHEN cb.percentual_pago < 100 THEN 'Final (75-99%)'
    ELSE 'Quitado'
  END as status_pagamento

FROM contratos_base cb
LEFT JOIN clientes_base cli ON cb.cliente_principal_id = cli.id_cliente
LEFT JOIN empreendimentos_base emp_info ON cb.id_empreendimento = emp_info.id_empreendimento
LEFT JOIN empresas_base emp ON cb.id_empresa = emp.id_empresa

UNION ALL

-- CLIENTES como domínio separado
SELECT
  'clientes' as domain_type,
  c.id_cliente::text as unique_id,

  -- Dimensões temporais
  c.data_cadastro_cliente as data_principal,
  EXTRACT(YEAR FROM c.data_cadastro_cliente)::text as ano,
  EXTRACT(QUARTER FROM c.data_cadastro_cliente)::integer as trimestre,
  EXTRACT(MONTH FROM c.data_cadastro_cliente)::text as mes,
  TO_CHAR(c.data_cadastro_cliente, 'YYYY-MM') as ano_mes,
  TO_CHAR(c.data_cadastro_cliente, 'Month') as nome_mes,

  -- Empresa (via relacionamento)
  COALESCE(emp.nome_empresa, 'Não informado') as empresa_nome,
  COALESCE(emp.cidade_empresa, 'Não informado') as empresa_cidade,
  COALESCE(emp.estado_empresa, 'Não informado') as empresa_estado,
  COALESCE(emp.regiao_empresa, 'Não informado') as empresa_regiao,
  emp.cnpj_empresa as empresa_cnpj,

  -- Campos vazios para contratos (não aplicável neste domínio)
  0 as valor_contrato,
  'N/A' as status_contrato,
  'N/A' as tipo_contrato,
  'N/A' as numero_contrato,
  false as contratos_ativos,
  false as chaves_entregues,
  false as contratos_assinados,
  false as contratos_cancelados,

  -- Campos financeiros vazios
  0 as saldo_devedor,
  'N/A' as forma_pagamento,
  0 as taxa_juros,
  0 as total_parcelas,
  0 as parcelas_pagas,
  0 as percentual_pago,
  false as tem_financiamento,

  -- Comissões vazias
  false as tem_comissao,
  0 as valor_comissao,
  'N/A' as faixa_valor_comissao,
  0 as percentual_comissao,

  0 as margem_bruta,

  -- Cliente
  c.nome_cliente as cliente_principal,
  1 as quantidade_clientes,

  -- Empreendimento vazio
  'N/A' as empreendimento_nome,
  'N/A' as empreendimento_tipo,

  -- Unidade vazia
  'N/A' as unidade_tipo,
  0 as unidade_area,
  'N/A' as faixa_area,

  -- Datas
  c.data_cadastro_cliente as data_contrato,
  NULL::timestamp as data_emissao,
  NULL::timestamp as data_entrega_prevista,
  NULL::timestamp as data_entrega_chaves,
  NULL::timestamp as data_cancelamento,
  c.data_cadastro_cliente as data_criacao_sienge,
  c.data_cadastro_cliente as data_ultima_atualizacao_sienge,

  -- Indicadores
  NULL::integer as dias_atraso_entrega,
  (CURRENT_DATE - c.data_cadastro_cliente::date)::integer as dias_desde_contrato,

  'N/A' as faixa_valor_contrato,
  'N/A' as status_pagamento

FROM clientes_base c
LEFT JOIN empresas_base emp ON c.id_empresa_cliente = emp.id_empresa

UNION ALL

-- UNIDADES como domínio separado
SELECT
  'unidades' as domain_type,
  u.id_unidade::text as unique_id,

  -- Dimensões temporais
  COALESCE(u.data_entrega_unidade, CURRENT_DATE) as data_principal,
  EXTRACT(YEAR FROM COALESCE(u.data_entrega_unidade, CURRENT_DATE))::text as ano,
  EXTRACT(QUARTER FROM COALESCE(u.data_entrega_unidade, CURRENT_DATE))::integer as trimestre,
  EXTRACT(MONTH FROM COALESCE(u.data_entrega_unidade, CURRENT_DATE))::text as mes,
  TO_CHAR(COALESCE(u.data_entrega_unidade, CURRENT_DATE), 'YYYY-MM') as ano_mes,
  TO_CHAR(COALESCE(u.data_entrega_unidade, CURRENT_DATE), 'Month') as nome_mes,

  -- Empresa (via empreendimento)
  COALESCE(emp.nome_empresa, e.nome_empresa_empreendimento, 'Não informado') as empresa_nome,
  COALESCE(emp.cidade_empresa, 'Não informado') as empresa_cidade,
  COALESCE(emp.estado_empresa, 'Não informado') as empresa_estado,
  COALESCE(emp.regiao_empresa, 'Não informado') as empresa_regiao,
  emp.cnpj_empresa as empresa_cnpj,

  -- Campos de contrato vazios
  COALESCE(u.valor_terreno, 0) as valor_contrato,
  COALESCE(u.estoque_comercial, 'Disponível') as status_contrato,
  'Unidade' as tipo_contrato,
  COALESCE(u.numero_contrato_unidade, '') as numero_contrato,
  false as contratos_ativos,
  false as chaves_entregues,
  false as contratos_assinados,
  false as contratos_cancelados,

  -- Campos financeiros vazios
  0 as saldo_devedor,
  'N/A' as forma_pagamento,
  0 as taxa_juros,
  0 as total_parcelas,
  0 as parcelas_pagas,
  0 as percentual_pago,
  false as tem_financiamento,

  -- Comissões vazias
  false as tem_comissao,
  0 as valor_comissao,
  'N/A' as faixa_valor_comissao,
  0 as percentual_comissao,

  0 as margem_bruta,

  -- Cliente vazio
  'N/A' as cliente_principal,
  0 as quantidade_clientes,

  -- Empreendimento
  COALESCE(e.nome_empreendimento, 'Não informado') as empreendimento_nome,
  COALESCE(e.tipo_empreendimento, 'Residencial') as empreendimento_tipo,

  -- Unidade
  COALESCE(u.tipo_imovel, 'Apartamento') as unidade_tipo,
  u.area_unidade as unidade_area,
  u.faixa_area,

  -- Datas
  NULL::timestamp as data_contrato,
  NULL::timestamp as data_emissao,
  u.data_entrega_unidade as data_entrega_prevista,
  NULL::timestamp as data_entrega_chaves,
  NULL::timestamp as data_cancelamento,
  CURRENT_DATE as data_criacao_sienge,
  CURRENT_DATE as data_ultima_atualizacao_sienge,

  -- Indicadores
  NULL::integer as dias_atraso_entrega,
  NULL::integer as dias_desde_contrato,

  'N/A' as faixa_valor_contrato,
  'N/A' as status_pagamento

FROM unidades_base u
LEFT JOIN empreendimentos_base e ON u.id_empreendimento_unidade = e.id_empreendimento
LEFT JOIN empresas_base emp ON e.id_empresa_empreendimento = emp.id_empresa

UNION ALL

-- EMPREENDIMENTOS como domínio separado
SELECT
  'empreendimentos' as domain_type,
  e.id_empreendimento::text as unique_id,

  -- Dimensões temporais
  e.data_cadastro_empreendimento as data_principal,
  EXTRACT(YEAR FROM e.data_cadastro_empreendimento)::text as ano,
  EXTRACT(QUARTER FROM e.data_cadastro_empreendimento)::integer as trimestre,
  EXTRACT(MONTH FROM e.data_cadastro_empreendimento)::text as mes,
  TO_CHAR(e.data_cadastro_empreendimento, 'YYYY-MM') as ano_mes,
  TO_CHAR(e.data_cadastro_empreendimento, 'Month') as nome_mes,

  -- Empresa
  COALESCE(emp.nome_empresa, e.nome_empresa_empreendimento, 'Não informado') as empresa_nome,
  COALESCE(emp.cidade_empresa, 'Não informado') as empresa_cidade,
  COALESCE(emp.estado_empresa, 'Não informado') as empresa_estado,
  COALESCE(emp.regiao_empresa, 'Não informado') as empresa_regiao,
  emp.cnpj_empresa as empresa_cnpj,

  -- Campos vazios
  0 as valor_contrato,
  'Ativo' as status_contrato,
  'Empreendimento' as tipo_contrato,
  '' as numero_contrato,
  false as contratos_ativos,
  false as chaves_entregues,
  false as contratos_assinados,
  false as contratos_cancelados,

  0 as saldo_devedor,
  'N/A' as forma_pagamento,
  0 as taxa_juros,
  0 as total_parcelas,
  0 as parcelas_pagas,
  0 as percentual_pago,
  false as tem_financiamento,

  false as tem_comissao,
  0 as valor_comissao,
  'N/A' as faixa_valor_comissao,
  0 as percentual_comissao,

  0 as margem_bruta,

  'N/A' as cliente_principal,
  0 as quantidade_clientes,

  -- Empreendimento
  e.nome_empreendimento as empreendimento_nome,
  COALESCE(e.tipo_empreendimento, 'Residencial') as empreendimento_tipo,

  -- Unidade vazia
  'N/A' as unidade_tipo,
  0 as unidade_area,
  'N/A' as faixa_area,

  -- Datas
  e.data_cadastro_empreendimento as data_contrato,
  NULL::timestamp as data_emissao,
  NULL::timestamp as data_entrega_prevista,
  NULL::timestamp as data_entrega_chaves,
  NULL::timestamp as data_cancelamento,
  e.data_cadastro_empreendimento as data_criacao_sienge,
  e.data_cadastro_empreendimento as data_ultima_atualizacao_sienge,

  -- Indicadores
  NULL::integer as dias_atraso_entrega,
  (CURRENT_DATE - e.data_cadastro_empreendimento::date)::integer as dias_desde_contrato,

  'N/A' as faixa_valor_contrato,
  'N/A' as status_pagamento

FROM empreendimentos_base e
LEFT JOIN empresas_base emp ON e.id_empresa_empreendimento = emp.id_empresa;

-- Criar índices para performance
CREATE INDEX idx_rpt_master_domain ON rpt_sienge_master_wide (domain_type);
CREATE INDEX idx_rpt_master_data ON rpt_sienge_master_wide (data_principal);
CREATE INDEX idx_rpt_master_empresa ON rpt_sienge_master_wide (empresa_nome);
CREATE INDEX idx_rpt_master_ano_mes ON rpt_sienge_master_wide (ano_mes);
CREATE INDEX idx_rpt_master_unique ON rpt_sienge_master_wide (unique_id);
CREATE INDEX idx_rpt_master_composite ON rpt_sienge_master_wide (domain_type, data_principal, empresa_nome);

-- Comentários explicativos
COMMENT ON MATERIALIZED VIEW rpt_sienge_master_wide IS 'View materializada unificada para Looker Studio - Versão 3.0 com campos normalizados';

-- Estatísticas da view após criação
ANALYZE rpt_sienge_master_wide;