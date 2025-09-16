-- ============================================
-- EXEMPLO PRÁTICO: VIEW MATERIALIZADA PARA LOOKER STUDIO
-- Dashboard Comercial - Sienge Analytics
-- ============================================

-- 🎯 OBJETIVO:
-- Criar uma view "larga" otimizada para o Looker Studio
-- com todas as dimensões e métricas organizadas por categorias

-- 📊 RPT_VENDAS_WIDE - Dashboard Comercial Completo
DROP MATERIALIZED VIEW IF EXISTS rpt_vendas_wide;

CREATE MATERIALIZED VIEW rpt_vendas_wide AS
SELECT
  -- =====================================
  -- 📅 DIMENSÕES DE TEMPO
  -- =====================================
  cv.contractDate::date                           AS data_contrato,
  EXTRACT(YEAR FROM cv.contractDate)              AS ano,
  EXTRACT(QUARTER FROM cv.contractDate)           AS trimestre,
  EXTRACT(MONTH FROM cv.contractDate)             AS mes,
  TO_CHAR(cv.contractDate, 'YYYY-MM')            AS ano_mes,
  TO_CHAR(cv.contractDate, 'Month')               AS nome_mes,
  EXTRACT(DOW FROM cv.contractDate)               AS dia_semana,
  TO_CHAR(cv.contractDate, 'Day')                 AS nome_dia,

  -- =====================================
  -- 🏢 DIMENSÕES DE EMPRESA
  -- =====================================
  emp.nomeEmpresa                                 AS empresa_nome,
  emp.cidade                                      AS empresa_cidade,
  emp.estado                                      AS empresa_estado,
  CASE
    WHEN emp.estado IN ('SP', 'RJ', 'MG', 'ES') THEN 'Sudeste'
    WHEN emp.estado IN ('PR', 'SC', 'RS') THEN 'Sul'
    WHEN emp.estado IN ('GO', 'MT', 'MS', 'DF') THEN 'Centro-Oeste'
    WHEN emp.estado IN ('BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA') THEN 'Nordeste'
    WHEN emp.estado IN ('AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO') THEN 'Norte'
    ELSE 'Outros'
  END                                             AS empresa_regiao,

  -- =====================================
  -- 👤 DIMENSÕES DE CLIENTE
  -- =====================================
  cli.nomeCompleto                                AS cliente_nome,
  cli.personType                                  AS cliente_tipo_pessoa,
  cli.sex                                         AS cliente_sexo,
  cli.estadoCivilStr                              AS cliente_estado_civil,
  CASE
    WHEN cli.dataNascimento IS NULL THEN 'Não informado'
    WHEN EXTRACT(YEAR FROM AGE(cli.dataNascimento)) BETWEEN 18 AND 25 THEN '18-25'
    WHEN EXTRACT(YEAR FROM AGE(cli.dataNascimento)) BETWEEN 26 AND 35 THEN '26-35'
    WHEN EXTRACT(YEAR FROM AGE(cli.dataNascimento)) BETWEEN 36 AND 45 THEN '36-45'
    WHEN EXTRACT(YEAR FROM AGE(cli.dataNascimento)) BETWEEN 46 AND 55 THEN '46-55'
    WHEN EXTRACT(YEAR FROM AGE(cli.dataNascimento)) >= 56 THEN '56+'
    ELSE 'Não informado'
  END                                             AS cliente_faixa_etaria,

  -- =====================================
  -- 🏗️ DIMENSÕES DE EMPREENDIMENTO
  -- =====================================
  empr.nome                                       AS empreendimento_nome,
  empr.nomeComercial                             AS empreendimento_nome_comercial,
  empr.tipo                                       AS empreendimento_tipo,
  COALESCE(empr.nomeEmpresa, emp.nomeEmpresa)    AS empreendimento_empresa,

  -- =====================================
  -- 🏠 DIMENSÕES DE UNIDADE
  -- =====================================
  uni.nome                                        AS unidade_nome,
  uni.tipoImovel                                  AS unidade_tipo,
  CASE
    WHEN uni.areaPrivativa < 50 THEN 'Até 50m²'
    WHEN uni.areaPrivativa BETWEEN 50 AND 100 THEN '50-100m²'
    WHEN uni.areaPrivativa BETWEEN 100 AND 150 THEN '100-150m²'
    WHEN uni.areaPrivativa > 150 THEN 'Acima 150m²'
    ELSE 'Não informado'
  END                                             AS unidade_faixa_area,
  uni.areaPrivativa                               AS unidade_area_privativa,
  uni.pavimento                                   AS unidade_pavimento,

  -- =====================================
  -- 📊 PERFORMANCE - Valores e Volumes
  -- =====================================
  cv.value                                        AS "Performance — Valor Contrato",
  cv.totalSellingValue                           AS "Performance — Valor Venda Total",

  -- Calcular valor por m² se área disponível
  CASE
    WHEN uni.areaPrivativa > 0 THEN ROUND(cv.value / uni.areaPrivativa, 2)
    ELSE NULL
  END                                             AS "Performance — Valor por M²",

  -- Margem (simplificada - pode ser refinada com dados de custo)
  CASE
    WHEN cv.totalSellingValue > 0
    THEN ROUND(((cv.totalSellingValue - cv.value) / cv.totalSellingValue * 100), 2)
    ELSE NULL
  END                                             AS "Performance — Margem Bruta (%)",

  -- =====================================
  -- 💰 CONVERSIONS - Status e Resultados
  -- =====================================
  cv.situation                                    AS "Conversions — Status Contrato",

  -- Flags de conversão
  CASE WHEN cv.situation = 'Ativo' THEN 1 ELSE 0 END AS "Conversions — Contratos Ativos",
  CASE WHEN cv.situation = 'Cancelado' THEN 1 ELSE 0 END AS "Conversions — Contratos Cancelados",
  CASE WHEN cv.keysDeliveredAt IS NOT NULL THEN 1 ELSE 0 END AS "Conversions — Chaves Entregues",

  -- Tempo de venda (dias desde lançamento do empreendimento até contrato)
  CASE
    WHEN empr.dataCadastro IS NOT NULL AND cv.contractDate IS NOT NULL
    THEN EXTRACT(DAY FROM cv.contractDate - empr.dataCadastro)
    ELSE NULL
  END                                             AS "Conversions — Tempo Venda (dias)",

  -- =====================================
  -- 💳 FINANCIAL - Aspectos Financeiros
  -- =====================================
  cv.discountPercentage                          AS "Financial — Desconto (%)",
  cv.discountPercentage * cv.value / 100         AS "Financial — Valor Desconto",

  -- Forma de pagamento (derivada de campos existentes)
  CASE
    WHEN cv.interestType IS NOT NULL THEN 'Financiado'
    WHEN cv.value = cv.totalSellingValue THEN 'À Vista'
    ELSE 'Misto'
  END                                             AS "Financial — Forma Pagamento",

  cv.interestPercentage                          AS "Financial — Taxa Juros (%)",
  cv.fineRate                                    AS "Financial — Taxa Multa (%)",

  -- =====================================
  -- 🎯 SEGMENTAÇÃO E ANÁLISE
  -- =====================================

  -- Segmentação por valor
  CASE
    WHEN cv.value < 200000 THEN 'Econômico'
    WHEN cv.value BETWEEN 200000 AND 500000 THEN 'Médio'
    WHEN cv.value BETWEEN 500000 AND 1000000 THEN 'Médio-Alto'
    WHEN cv.value > 1000000 THEN 'Alto Padrão'
    ELSE 'Não classificado'
  END                                             AS "Segmentation — Faixa Valor",

  -- Canal de venda (pode ser expandido com dados reais)
  CASE
    WHEN cv.salesRepresentative IS NOT NULL THEN 'Corretor'
    ELSE 'Direto'
  END                                             AS "Segmentation — Canal Venda",

  -- =====================================
  -- 🔢 IDs TÉCNICOS (para drill-through)
  -- =====================================
  cv.id                                           AS contrato_id,
  cv.companyId                                    AS empresa_id,
  cv.enterpriseId                                 AS empreendimento_id,
  cli.idCliente                                   AS cliente_id

FROM contratos_venda cv
-- JOINs com as tabelas relacionadas
LEFT JOIN empresas emp ON emp.idEmpresa = cv.companyId
LEFT JOIN clientes cli ON cli.idCliente = ANY(
  SELECT jsonb_array_elements_text(cv.salesContractCustomers::jsonb -> 'customers')::int
  UNION
  SELECT (cv.salesContractCustomers->>'customerId')::int WHERE cv.salesContractCustomers->>'customerId' IS NOT NULL
)
LEFT JOIN empreendimentos empr ON empr.id = cv.enterpriseId
LEFT JOIN unidades uni ON uni.idContrato = cv.id

-- Filtros básicos
WHERE cv.contractDate IS NOT NULL
  AND cv.value > 0;

-- =====================================
-- 🚀 ÍNDICES PARA PERFORMANCE
-- =====================================
CREATE INDEX ON rpt_vendas_wide (data_contrato);
CREATE INDEX ON rpt_vendas_wide (ano, mes);
CREATE INDEX ON rpt_vendas_wide (empresa_regiao, empresa_estado);
CREATE INDEX ON rpt_vendas_wide (empreendimento_nome);
CREATE INDEX ON rpt_vendas_wide ("Conversions — Status Contrato");
CREATE INDEX ON rpt_vendas_wide ("Performance — Valor Contrato");

-- =====================================
-- 📝 COMENTÁRIOS E METADADOS
-- =====================================
COMMENT ON MATERIALIZED VIEW rpt_vendas_wide IS
'View materializada otimizada para Looker Studio - Dashboard Comercial
Atualização: Diária às 6h
Grão: Contrato de Venda
Métricas organizadas por categorias: Performance, Conversions, Financial, Segmentation';

-- =====================================
-- 🔄 SCRIPT DE REFRESH (para agendamento)
-- =====================================
-- Para executar diariamente:
-- REFRESH MATERIALIZED VIEW CONCURRENTLY rpt_vendas_wide;


-- =====================================
-- 📊 EXEMPLO DE QUERY PARA LOOKER STUDIO
-- =====================================
/*
-- No Looker Studio, usar Custom Query:

SELECT * FROM rpt_vendas_wide
WHERE data_contrato BETWEEN @DS_START_DATE AND @DS_END_DATE
ORDER BY data_contrato DESC;

-- O Looker Studio automaticamente aplicará:
-- - Filtros de data via @DS_START_DATE e @DS_END_DATE
-- - Agregações baseadas nas dimensões selecionadas
-- - Cache inteligente para performance
*/

-- =====================================
-- 🎨 ORGANIZAÇÃO NO LOOKER STUDIO
-- =====================================
/*
📊 Campos organizados por prefixo aparecem agrupados:

Performance
├── Performance — Valor Contrato
├── Performance — Valor Venda Total
├── Performance — Valor por M²
└── Performance — Margem Bruta (%)

💰 Conversions
├── Conversions — Status Contrato
├── Conversions — Contratos Ativos
├── Conversions — Contratos Cancelados
├── Conversions — Chaves Entregues
└── Conversions — Tempo Venda (dias)

💳 Financial
├── Financial — Desconto (%)
├── Financial — Valor Desconto
├── Financial — Forma Pagamento
├── Financial — Taxa Juros (%)
└── Financial — Taxa Multa (%)

🎯 Segmentation
├── Segmentation — Faixa Valor
└── Segmentation — Canal Venda
*/