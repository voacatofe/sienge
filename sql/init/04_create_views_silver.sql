-- 04_create_views_silver.sql
-- Criação das views materializadas do schema Silver
-- Este script é executado durante a inicialização do Docker

-- Log de início
DO $$
BEGIN
    RAISE NOTICE 'Criando views materializadas do schema Silver em %', now();
END $$;

-- View: silver.rpt_sienge_core
-- Unificação de dados básicos de todos os domínios
CREATE MATERIALIZED VIEW IF NOT EXISTS silver.rpt_sienge_core AS
SELECT
    -- Campos comuns temporais
    'contratos'::text as domain_type,
    'CV-' || cv.id::text as unique_id,
    COALESCE(cv."contractDate", cv."issueDate", cv."createdAt") as data_principal,
    EXTRACT(YEAR FROM COALESCE(cv."contractDate", cv."issueDate", cv."createdAt"))::integer as ano,
    EXTRACT(MONTH FROM COALESCE(cv."contractDate", cv."issueDate", cv."createdAt"))::integer as mes,
    TO_CHAR(COALESCE(cv."contractDate", cv."issueDate", cv."createdAt"), 'YYYY-MM') as ano_mes,

    -- Dados do cliente
    cv."clientId" as cliente_id,
    COALESCE(cl.name, cl."corporateName") as cliente_nome,
    cl."identificationNumber" as cliente_cpf_cnpj,
    cl.email as cliente_email,
    cl."primaryPhone" as cliente_telefone,

    -- Dados da empresa
    cv."companyId" as empresa_id,
    emp.name as empresa_nome,
    emp."nationalIdentifier" as empresa_cnpj,

    -- Dados do empreendimento
    cv."enterpriseId" as empreendimento_id,
    empr.name as empreendimento_nome,
    empr."enterpriseType" as empreendimento_tipo,

    -- Dados do contrato
    cv.id as contrato_id,
    cv.number as contrato_numero,
    cv."totalValue" as valor_contrato,
    cv.situation as status_contrato,

    -- Dados da unidade (se houver)
    NULL::integer as unidade_id,
    NULL::text as unidade_nome,
    NULL::text as unidade_codigo,
    NULL::text as unidade_tipo,

    -- Dados financeiros
    NULL::integer as titulo_id,
    NULL::decimal as valor_titulo,
    NULL::text as status_pagamento,
    cv."paymentMethod" as forma_pagamento,
    NULL::text as tipo_titulo,

    -- Metadados
    cv."createdAt" as data_cadastro,
    cv."updatedAt" as data_atualizacao

FROM bronze.contratos_venda cv
LEFT JOIN bronze.clientes cl ON cv."clientId" = cl.id
LEFT JOIN bronze.empresas emp ON cv."companyId" = emp.id
LEFT JOIN bronze.empreendimentos empr ON cv."enterpriseId" = empr.id

UNION ALL

SELECT
    -- Campos para clientes
    'clientes'::text as domain_type,
    'CL-' || cl.id::text as unique_id,
    COALESCE(cl."createdAt") as data_principal,
    EXTRACT(YEAR FROM COALESCE(cl."createdAt"))::integer as ano,
    EXTRACT(MONTH FROM COALESCE(cl."createdAt"))::integer as mes,
    TO_CHAR(COALESCE(cl."createdAt"), 'YYYY-MM') as ano_mes,

    -- Dados do cliente
    cl.id as cliente_id,
    COALESCE(cl.name, cl."corporateName") as cliente_nome,
    cl."identificationNumber" as cliente_cpf_cnpj,
    cl.email as cliente_email,
    cl."primaryPhone" as cliente_telefone,

    -- Outros campos nulos para clientes
    NULL::integer as empresa_id,
    NULL::text as empresa_nome,
    NULL::text as empresa_cnpj,
    NULL::integer as empreendimento_id,
    NULL::text as empreendimento_nome,
    NULL::text as empreendimento_tipo,
    NULL::integer as contrato_id,
    NULL::text as contrato_numero,
    NULL::decimal as valor_contrato,
    NULL::text as status_contrato,
    NULL::integer as unidade_id,
    NULL::text as unidade_nome,
    NULL::text as unidade_codigo,
    NULL::text as unidade_tipo,
    NULL::integer as titulo_id,
    NULL::decimal as valor_titulo,
    NULL::text as status_pagamento,
    NULL::text as forma_pagamento,
    NULL::text as tipo_titulo,

    -- Metadados
    cl."createdAt" as data_cadastro,
    cl."updatedAt" as data_atualizacao

FROM bronze.clientes cl;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_silver_core_domain_type ON silver.rpt_sienge_core(domain_type);
CREATE INDEX IF NOT EXISTS idx_silver_core_data_principal ON silver.rpt_sienge_core(data_principal);
CREATE INDEX IF NOT EXISTS idx_silver_core_ano_mes ON silver.rpt_sienge_core(ano_mes);
CREATE INDEX IF NOT EXISTS idx_silver_core_cliente_id ON silver.rpt_sienge_core(cliente_id);
CREATE INDEX IF NOT EXISTS idx_silver_core_contrato_id ON silver.rpt_sienge_core(contrato_id);

-- View: silver.rpt_sienge_contratos
-- Dados detalhados de contratos com validações
CREATE MATERIALIZED VIEW IF NOT EXISTS silver.rpt_sienge_contratos AS
SELECT
    -- Identificação
    'contratos'::text as domain_type,
    'CV-' || cv.id::text as unique_id,
    COALESCE(cv."contractDate", cv."issueDate") as data_principal,
    EXTRACT(YEAR FROM COALESCE(cv."contractDate", cv."issueDate"))::integer as ano,
    EXTRACT(MONTH FROM COALESCE(cv."contractDate", cv."issueDate"))::integer as mes,
    TO_CHAR(COALESCE(cv."contractDate", cv."issueDate"), 'YYYY-MM') as ano_mes,

    -- Dados do contrato
    cv.id as contrato_id,
    cv.number as numero_contrato,
    cv."externalId" as id_externo,
    cv.situation as situacao,
    cv."companyId" as empresa_id,
    cv."internalCompanyId" as empresa_interna_id,
    emp.name as empresa_nome,
    cv."enterpriseId" as empreendimento_id,
    cv."internalEnterpriseId" as empreendimento_interno_id,
    empr.name as empreendimento_nome,

    -- Datas
    cv."contractDate" as data_contrato,
    cv."issueDate" as data_emissao,
    cv."accountingDate" as data_contabilizacao,
    cv."deliveryDate" as data_entrega_prevista,
    cv."keyDeliveryDate" as data_entrega_chaves,
    cv."cancellationDate" as data_cancelamento,

    -- Valores
    cv."totalValue" as valor_contrato,
    cv."saleValue" as valor_venda_total,
    cv."cancellationValue" as valor_cancelamento,
    cv."correctionType" as tipo_correcao,
    cv."discountType" as tipo_desconto,
    cv."discountPercentage" as percentual_desconto,
    cv."interestType" as tipo_juros,
    cv."interestPercentage" as percentual_juros,
    cv."penaltyRate" as taxa_multa,

    -- Cliente principal
    cv."clientId" as cliente_principal_id,
    COALESCE(cl.name, cl."corporateName") as cliente_principal_nome,

    -- Comissões (campos adicionados)
    cv.tem_comissao,
    cv.id_contrato_comissao,
    cv.total_comissoes,
    cv.valor_total_comissao,
    cv.faixa_valor_comissao,
    cv.percentual_comissao_sobre_contrato,

    -- JSONs para dados complexos
    cv."linkedCommissions" as comissoes_json,
    cv."linkedClients" as clientes_json,
    cv."linkedUnits" as unidades_json,
    cv."paymentConditions" as condicoes_pagamento_json,
    cv."linkedBrokers" as corretores_json,
    cv."specialClause" as clausula_especial,

    -- Validações
    CASE WHEN cv.number IS NOT NULL AND LENGTH(cv.number) > 0 THEN TRUE ELSE FALSE END as tem_numero_valido,
    CASE WHEN cv."contractDate" IS NOT NULL THEN TRUE ELSE FALSE END as tem_data_contrato,
    CASE WHEN cv."totalValue" > 0 THEN TRUE ELSE FALSE END as tem_valor_valido,
    CASE WHEN emp.id IS NOT NULL THEN TRUE ELSE FALSE END as tem_empresa_valida,
    CASE WHEN empr.id IS NOT NULL THEN TRUE ELSE FALSE END as tem_empreendimento_valido,
    CASE WHEN cl.id IS NOT NULL THEN TRUE ELSE FALSE END as tem_cliente_principal,

    -- Status derivado
    CASE
        WHEN cv.situation = 'CANCELLED' THEN 'Cancelado'
        WHEN cv."keyDeliveryDate" IS NOT NULL AND cv."keyDeliveryDate" <= CURRENT_DATE THEN 'Entregue'
        WHEN cv."deliveryDate" IS NOT NULL AND cv."deliveryDate" < CURRENT_DATE THEN 'Atrasado'
        ELSE 'Em Andamento'
    END as status_contrato,

    -- Categoria de valor
    CASE
        WHEN cv."totalValue" < 100000 THEN 'Baixo'
        WHEN cv."totalValue" < 500000 THEN 'Médio'
        WHEN cv."totalValue" < 1000000 THEN 'Alto'
        ELSE 'Premium'
    END as categoria_valor,

    -- Score de qualidade
    (
        (CASE WHEN cv.number IS NOT NULL AND LENGTH(cv.number) > 0 THEN 20 ELSE 0 END) +
        (CASE WHEN cv."contractDate" IS NOT NULL THEN 20 ELSE 0 END) +
        (CASE WHEN cv."totalValue" > 0 THEN 20 ELSE 0 END) +
        (CASE WHEN emp.id IS NOT NULL THEN 20 ELSE 0 END) +
        (CASE WHEN cl.id IS NOT NULL THEN 20 ELSE 0 END)
    ) as qualidade_score,

    -- Metadados
    cv."createdAt" as data_cadastro,
    cv."updatedAt" as data_atualizacao,
    cv."createdAt" as data_criacao_sienge,
    cv."updatedAt" as data_ultima_atualizacao_sienge

FROM bronze.contratos_venda cv
LEFT JOIN bronze.empresas emp ON cv."companyId" = emp.id
LEFT JOIN bronze.empreendimentos empr ON cv."enterpriseId" = empr.id
LEFT JOIN bronze.clientes cl ON cv."clientId" = cl.id;

-- Criar índices para views de contratos
CREATE INDEX IF NOT EXISTS idx_silver_contratos_data ON silver.rpt_sienge_contratos(data_principal);
CREATE INDEX IF NOT EXISTS idx_silver_contratos_empresa ON silver.rpt_sienge_contratos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_silver_contratos_empreendimento ON silver.rpt_sienge_contratos(empreendimento_id);
CREATE INDEX IF NOT EXISTS idx_silver_contratos_status ON silver.rpt_sienge_contratos(status_contrato);
CREATE INDEX IF NOT EXISTS idx_silver_contratos_comissao ON silver.rpt_sienge_contratos(tem_comissao);

-- View: silver.rpt_sienge_clientes
-- Dados detalhados de clientes com validações
CREATE MATERIALIZED VIEW IF NOT EXISTS silver.rpt_sienge_clientes AS
SELECT
    -- Identificação
    'clientes'::text as domain_type,
    'CL-' || cl.id::text as unique_id,
    cl."createdAt" as data_principal,
    EXTRACT(YEAR FROM cl."createdAt")::integer as ano,
    EXTRACT(MONTH FROM cl."createdAt")::integer as mes,
    TO_CHAR(cl."createdAt", 'YYYY-MM') as ano_mes,

    -- Dados básicos
    cl.id as cliente_id,
    COALESCE(cl.name, cl."corporateName") as nome_completo,
    cl."socialName" as nome_social,
    cl."fantasyName" as nome_fantasia,
    cl."corporateName" as razao_social,
    cl."internalCode" as codigo_interno,

    -- Documentos limpos
    REGEXP_REPLACE(cl."identificationNumber", '[^0-9]', '', 'g') as cpf_cnpj_limpo,
    CASE
        WHEN cl."personType" = 'COMPANY' THEN REGEXP_REPLACE(cl."identificationNumber", '[^0-9]', '', 'g')
        ELSE NULL
    END as cnpj_limpo,
    REGEXP_REPLACE(COALESCE(cl."rgNumber", ''), '[^0-9]', '', 'g') as rg_limpo,

    -- Tipo de pessoa
    cl."personType" as tipo_pessoa,

    -- Documentos válidos
    CASE
        WHEN cl."personType" = 'INDIVIDUAL' AND LENGTH(REGEXP_REPLACE(cl."identificationNumber", '[^0-9]', '', 'g')) = 11 THEN TRUE
        WHEN cl."personType" = 'COMPANY' AND LENGTH(REGEXP_REPLACE(cl."identificationNumber", '[^0-9]', '', 'g')) = 14 THEN TRUE
        ELSE FALSE
    END as tem_documento_valido,

    -- Dados pessoais
    cl."birthDate" as data_nascimento,
    CASE
        WHEN cl."birthDate" IS NOT NULL THEN
            EXTRACT(YEAR FROM AGE(CURRENT_DATE, cl."birthDate"))::integer
        ELSE NULL
    END as idade_atual,
    CASE
        WHEN cl."birthDate" IS NOT NULL THEN
            CASE
                WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, cl."birthDate")) < 25 THEN 'Até 24 anos'
                WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, cl."birthDate")) < 35 THEN '25-34 anos'
                WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, cl."birthDate")) < 45 THEN '35-44 anos'
                WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, cl."birthDate")) < 55 THEN '45-54 anos'
                WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, cl."birthDate")) < 65 THEN '55-64 anos'
                ELSE '65+ anos'
            END
        ELSE 'Não informado'
    END as faixa_etaria,

    cl.nationality as nacionalidade,
    cl.gender as sexo,
    cl."birthPlace" as local_nascimento,
    cl."fatherName" as nome_pai,
    cl."motherName" as nome_mae,
    cl."maritalStatus" as estado_civil,
    cl.profession as profissao,

    -- Contato
    cl.email as email_validado,
    CASE WHEN cl.email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN TRUE ELSE FALSE END as tem_email_valido,
    cl."primaryPhone" as telefone_principal,
    cl."phoneType" as tipo_telefone_principal,
    1 as total_telefones, -- Simplificado

    -- Endereço principal
    cl."primaryAddress" as endereco_principal,
    cl.city as cidade,
    cl.state as estado,
    cl."zipCode" as cep,
    1 as total_enderecos, -- Simplificado
    CASE WHEN cl."primaryAddress" IS NOT NULL AND LENGTH(cl."primaryAddress") > 5 THEN TRUE ELSE FALSE END as tem_endereco_valido,

    -- Status
    cl.active as ativo,
    cl.foreigner as estrangeiro,

    -- Cônjuge
    CASE WHEN cl."spouseName" IS NOT NULL THEN TRUE ELSE FALSE END as tem_conjuge,
    cl."spouseName" as nome_conjuge,
    REGEXP_REPLACE(COALESCE(cl."spouseIdentificationNumber", ''), '[^0-9]', '', 'g') as cpf_conjuge_limpo,

    -- Validações
    CASE WHEN COALESCE(cl.name, cl."corporateName") IS NOT NULL AND LENGTH(COALESCE(cl.name, cl."corporateName")) > 2 THEN TRUE ELSE FALSE END as tem_nome_valido,
    CASE WHEN cl."primaryPhone" IS NOT NULL AND LENGTH(cl."primaryPhone") >= 10 THEN TRUE ELSE FALSE END as tem_telefone_valido,
    CASE WHEN cl."birthDate" IS NOT NULL AND cl."birthDate" <= CURRENT_DATE - INTERVAL '16 years' THEN TRUE ELSE FALSE END as tem_data_nascimento_valida,

    -- Tipo de documento
    CASE WHEN cl."personType" = 'INDIVIDUAL' THEN TRUE ELSE FALSE END as eh_cpf,
    CASE WHEN cl."personType" = 'COMPANY' THEN TRUE ELSE FALSE END as eh_cnpj,

    -- Score de qualidade
    (
        (CASE WHEN COALESCE(cl.name, cl."corporateName") IS NOT NULL AND LENGTH(COALESCE(cl.name, cl."corporateName")) > 2 THEN 15 ELSE 0 END) +
        (CASE WHEN cl."identificationNumber" IS NOT NULL AND LENGTH(REGEXP_REPLACE(cl."identificationNumber", '[^0-9]', '', 'g')) >= 11 THEN 20 ELSE 0 END) +
        (CASE WHEN cl.email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN 15 ELSE 0 END) +
        (CASE WHEN cl."primaryPhone" IS NOT NULL AND LENGTH(cl."primaryPhone") >= 10 THEN 15 ELSE 0 END) +
        (CASE WHEN cl."primaryAddress" IS NOT NULL AND LENGTH(cl."primaryAddress") > 5 THEN 15 ELSE 0 END) +
        (CASE WHEN cl."birthDate" IS NOT NULL THEN 10 ELSE 0 END) +
        (CASE WHEN cl.city IS NOT NULL THEN 10 ELSE 0 END)
    ) as qualidade_score,

    -- Tempo como cliente
    EXTRACT(DAY FROM (CURRENT_DATE - cl."createdAt"::date))::integer as dias_como_cliente,
    CASE
        WHEN EXTRACT(DAY FROM (CURRENT_DATE - cl."createdAt"::date)) < 30 THEN 'Novo (< 1 mês)'
        WHEN EXTRACT(DAY FROM (CURRENT_DATE - cl."createdAt"::date)) < 180 THEN 'Recente (< 6 meses)'
        WHEN EXTRACT(DAY FROM (CURRENT_DATE - cl."createdAt"::date)) < 365 THEN 'Estabelecido (< 1 ano)'
        ELSE 'Antigo (1+ ano)'
    END as categoria_tempo_cliente,

    -- Metadados
    cl."createdAt" as data_cadastro,
    cl."updatedAt" as data_atualizacao

FROM bronze.clientes cl;

-- Criar índices para clientes
CREATE INDEX IF NOT EXISTS idx_silver_clientes_cpf_cnpj ON silver.rpt_sienge_clientes(cpf_cnpj_limpo);
CREATE INDEX IF NOT EXISTS idx_silver_clientes_tipo_pessoa ON silver.rpt_sienge_clientes(tipo_pessoa);
CREATE INDEX IF NOT EXISTS idx_silver_clientes_cidade ON silver.rpt_sienge_clientes(cidade);
CREATE INDEX IF NOT EXISTS idx_silver_clientes_qualidade ON silver.rpt_sienge_clientes(qualidade_score);

-- Log de conclusão
DO $$
BEGIN
    RAISE NOTICE 'Views materializadas do schema Silver criadas com sucesso em %', now();
END $$;