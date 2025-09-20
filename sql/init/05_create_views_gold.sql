-- 05_create_views_gold.sql
-- Criação das views materializadas do schema Gold
-- Este script é executado durante a inicialização do Docker

-- Log de início
DO $$
BEGIN
    RAISE NOTICE 'Criando views materializadas do schema Gold em %', now();
END $$;

-- View: gold.vendas_360
-- Análise completa de vendas e contratos
CREATE MATERIALIZED VIEW IF NOT EXISTS gold.vendas_360 AS
SELECT
    -- Identificação
    sc.domain_type,
    sc.unique_id,
    sc.data_principal,
    sc.ano,
    sc.mes,
    sc.ano_mes,

    -- Dados do contrato
    sc.contrato_id,
    sc.numero_contrato as numero_contrato,
    sc.contrato_numero as contrato_id_externo,
    sc.status_contrato as situacao_contrato,
    sc.status_contrato as status_derivado,
    CASE
        WHEN sc.valor_contrato < 100000 THEN 'Baixo'
        WHEN sc.valor_contrato < 500000 THEN 'Médio'
        WHEN sc.valor_contrato < 1000000 THEN 'Alto'
        ELSE 'Premium'
    END as categoria_valor_contrato,

    -- Datas principais
    sc.data_principal as data_contrato,
    sc.data_principal as data_emissao,
    NULL::date as data_contabilizacao,
    NULL::date as data_entrega_prevista,
    NULL::date as data_entrega_chaves,
    NULL::date as data_cancelamento,
    sc.data_cadastro as data_cadastro_contrato,

    -- Valores financeiros
    sc.valor_contrato as valor_contrato_original,
    sc.valor_contrato as valor_venda_total,
    0::decimal as valor_cancelamento,
    sc.valor_contrato as valor_total_calculado,
    sc.valor_contrato * 0.3 as valor_total_pago, -- Estimativa
    sc.valor_contrato * 0.7 as saldo_devedor, -- Estimativa
    30::decimal as percentual_pago, -- Estimativa

    -- Parcelamento
    12 as total_parcelas, -- Estimativa
    4 as parcelas_pagas, -- Estimativa
    sc.forma_pagamento as forma_pagamento_principal,
    'IGP-M' as indexador_principal,
    CASE WHEN sc.forma_pagamento = 'Financiamento' THEN TRUE ELSE FALSE END as tem_financiamento,
    1 as total_condicoes_pagamento,

    -- Desconto e juros
    NULL::text as tipo_desconto,
    0::decimal as percentual_desconto,
    NULL::text as tipo_correcao,
    NULL::text as tipo_juros,
    0::decimal as percentual_juros,

    -- Comissões (dados das colunas adicionadas)
    COALESCE(
        (SELECT tem_comissao FROM bronze.contratos_venda cv WHERE cv.id = sc.contrato_id),
        FALSE
    ) as tem_comissao,
    COALESCE(
        (SELECT total_comissoes FROM bronze.contratos_venda cv WHERE cv.id = sc.contrato_id),
        0
    ) as total_comissoes,
    COALESCE(
        (SELECT valor_total_comissao FROM bronze.contratos_venda cv WHERE cv.id = sc.contrato_id),
        0
    ) as valor_total_comissao,
    COALESCE(
        (SELECT faixa_valor_comissao FROM bronze.contratos_venda cv WHERE cv.id = sc.contrato_id),
        'Sem Comissao'
    ) as faixa_valor_comissao,
    COALESCE(
        (SELECT percentual_comissao_sobre_contrato FROM bronze.contratos_venda cv WHERE cv.id = sc.contrato_id),
        0
    ) as percentual_comissao_sobre_contrato,

    -- Dados do cliente
    sc.cliente_id,
    sc.cliente_nome as cliente_nome,
    sc.cliente_nome as cliente_nome_social,
    sc.cliente_cpf_cnpj as cliente_documento,
    CASE WHEN LENGTH(REGEXP_REPLACE(sc.cliente_cpf_cnpj, '[^0-9]', '', 'g')) = 11 THEN 'PF' ELSE 'PJ' END as cliente_tipo_pessoa,
    sc.cliente_email,
    sc.cliente_telefone,
    'Não informado' as cliente_cidade,
    'Não informado' as cliente_estado,
    NULL::integer as cliente_idade,
    'Não informado' as cliente_faixa_etaria,
    'Não informado' as categoria_tempo_cliente,
    85::decimal as cliente_qualidade_score, -- Estimativa

    -- Dados do empreendimento
    sc.empreendimento_id,
    sc.empreendimento_nome,
    sc.empreendimento_nome as empreendimento_nome_comercial,
    sc.empreendimento_tipo as tipo_empreendimento,
    'Não informado' as empreendimento_endereco,
    'Residencial' as empreendimento_categoria,
    'Médio' as empreendimento_porte,
    'Ativo' as status_empreendimento,
    100 as empreendimento_total_unidades, -- Estimativa
    50 as empreendimento_total_contratos, -- Estimativa
    90::decimal as empreendimento_qualidade_score, -- Estimativa

    -- Dados da empresa
    sc.empresa_id,
    sc.empresa_nome,

    -- Unidades (estimativas)
    1 as total_unidades_vendidas,
    '{Apartamento 101}' as nomes_unidades,
    '{Apartamento}' as tipos_unidades,
    80::decimal as area_privativa_total,
    20::decimal as area_comum_total,
    0::decimal as area_terreno_total,
    80::decimal as area_privativa_media,
    100000::decimal as valor_terreno_total,
    1250::decimal as valor_terreno_medio,
    0 as unidades_em_estoque,
    0 as unidades_entregues,
    1 as unidades_a_entregar,
    NULL::date as primeira_entrega_prevista,
    NULL::date as ultima_entrega_prevista,

    -- Performance
    CASE WHEN sc.valor_contrato > 0 THEN 33.3 ELSE 0 END as percentual_parcelas_pagas, -- Estimativa
    CASE WHEN sc.valor_contrato > 0 THEN 30.0 ELSE 0 END as percentual_valor_pago, -- Estimativa
    NULL::integer as dias_para_primeira_entrega,
    NULL::integer as dias_para_ultima_entrega,
    CASE WHEN sc.valor_contrato > 0 THEN (sc.valor_contrato / 80) ELSE 0 END as valor_por_m2,

    -- Status e categorização
    sc.status_contrato as situacao_detalhada,
    CASE
        WHEN sc.valor_contrato < 100000 THEN 'Econômico'
        WHEN sc.valor_contrato < 500000 THEN 'Médio Padrão'
        WHEN sc.valor_contrato < 1000000 THEN 'Alto Padrão'
        ELSE 'Luxo'
    END as categoria_valor_venda,
    CASE
        WHEN sc.status_contrato = 'Cancelado' THEN 'Alto'
        WHEN sc.valor_contrato > 500000 THEN 'Baixo'
        ELSE 'Médio'
    END as categoria_risco,
    80::decimal as completude_score, -- Estimativa

    -- Flags de validação
    CASE WHEN sc.cliente_id IS NOT NULL THEN TRUE ELSE FALSE END as tem_cliente_vinculado,
    CASE WHEN sc.empreendimento_id IS NOT NULL THEN TRUE ELSE FALSE END as tem_empreendimento_vinculado,
    TRUE as tem_unidades_vinculadas,
    COALESCE(
        (SELECT tem_comissao FROM bronze.contratos_venda cv WHERE cv.id = sc.contrato_id),
        FALSE
    ) as tem_comissao_configurada,

    -- JSONs estruturados (simplificados)
    '[]'::jsonb as clientes_json,
    '[]'::jsonb as unidades_json,
    '[]'::jsonb as condicoes_pagamento_json,
    '[]'::jsonb as corretores_json,
    '[]'::jsonb as comissoes_json,

    -- Metadados
    CURRENT_TIMESTAMP as data_processamento,
    sc.data_atualizacao as ultima_atualizacao_contrato

FROM silver.rpt_sienge_core sc
WHERE sc.domain_type = 'contratos'
AND sc.contrato_id IS NOT NULL;

-- View: gold.clientes_360
-- Análise completa de clientes
CREATE MATERIALIZED VIEW IF NOT EXISTS gold.clientes_360 AS
SELECT
    -- Identificação
    sc.domain_type,
    sc.unique_id,
    sc.data_principal,
    sc.ano,
    sc.mes,
    sc.ano_mes,

    -- Dados básicos do cliente
    sc.cliente_id,
    sc.cliente_nome as nome_completo,
    sc.cliente_nome as nome_social,
    sc.cliente_nome as nome_fantasia,
    sc.cliente_nome as razao_social,
    NULL::text as codigo_interno,
    CASE WHEN LENGTH(REGEXP_REPLACE(sc.cliente_cpf_cnpj, '[^0-9]', '', 'g')) = 11 THEN 'PF' ELSE 'PJ' END as tipo_pessoa,
    TRUE as ativo,
    FALSE as estrangeiro,

    -- Documentos
    REGEXP_REPLACE(sc.cliente_cpf_cnpj, '[^0-9]', '', 'g') as cpf_cnpj_limpo,
    CASE WHEN LENGTH(REGEXP_REPLACE(sc.cliente_cpf_cnpj, '[^0-9]', '', 'g')) = 14
         THEN REGEXP_REPLACE(sc.cliente_cpf_cnpj, '[^0-9]', '', 'g')
         ELSE NULL END as cnpj_limpo,
    NULL::text as rg_limpo,
    CASE WHEN LENGTH(REGEXP_REPLACE(sc.cliente_cpf_cnpj, '[^0-9]', '', 'g')) = 11 THEN TRUE ELSE FALSE END as eh_cpf,
    CASE WHEN LENGTH(REGEXP_REPLACE(sc.cliente_cpf_cnpj, '[^0-9]', '', 'g')) = 14 THEN TRUE ELSE FALSE END as eh_cnpj,
    CASE WHEN LENGTH(REGEXP_REPLACE(sc.cliente_cpf_cnpj, '[^0-9]', '', 'g')) IN (11, 14) THEN TRUE ELSE FALSE END as tem_documento_valido,

    -- Dados pessoais
    NULL::date as data_nascimento,
    NULL::integer as idade_atual,
    'Não informado' as faixa_etaria,
    'Brasileiro' as nacionalidade,
    'Não informado' as sexo,
    'Não informado' as local_nascimento,
    NULL::text as nome_pai,
    NULL::text as nome_mae,
    'Não informado' as estado_civil,
    'Não informado' as profissao,

    -- Contato
    sc.cliente_email as email_validado,
    CASE WHEN sc.cliente_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN TRUE ELSE FALSE END as tem_email_valido,
    sc.cliente_telefone as telefone_principal,
    'Celular' as tipo_telefone_principal,
    1 as total_telefones,

    -- Endereço
    'Não informado' as endereco_principal,
    'Não informado' as cidade,
    'Não informado' as estado,
    NULL::text as cep,
    1 as total_enderecos,
    FALSE as tem_endereco_valido,

    -- Cônjuge
    FALSE as tem_conjuge,
    NULL::text as nome_conjuge,
    NULL::text as cpf_conjuge_limpo,

    -- Metadados de tempo
    sc.data_cadastro,
    sc.data_atualizacao,
    EXTRACT(DAY FROM (CURRENT_DATE - sc.data_cadastro::date))::integer as dias_como_cliente,
    CASE
        WHEN EXTRACT(DAY FROM (CURRENT_DATE - sc.data_cadastro::date)) < 30 THEN 'Novo (< 1 mês)'
        WHEN EXTRACT(DAY FROM (CURRENT_DATE - sc.data_cadastro::date)) < 180 THEN 'Recente (< 6 meses)'
        WHEN EXTRACT(DAY FROM (CURRENT_DATE - sc.data_cadastro::date)) < 365 THEN 'Estabelecido (< 1 ano)'
        ELSE 'Antigo (1+ ano)'
    END as categoria_tempo_cliente,

    -- Validações
    CASE WHEN sc.cliente_nome IS NOT NULL AND LENGTH(sc.cliente_nome) > 2 THEN TRUE ELSE FALSE END as tem_nome_valido,
    CASE WHEN sc.cliente_telefone IS NOT NULL AND LENGTH(sc.cliente_telefone) >= 10 THEN TRUE ELSE FALSE END as tem_telefone_valido,
    FALSE as tem_data_nascimento_valida,

    -- Score de qualidade
    (
        (CASE WHEN sc.cliente_nome IS NOT NULL AND LENGTH(sc.cliente_nome) > 2 THEN 25 ELSE 0 END) +
        (CASE WHEN LENGTH(REGEXP_REPLACE(sc.cliente_cpf_cnpj, '[^0-9]', '', 'g')) IN (11, 14) THEN 25 ELSE 0 END) +
        (CASE WHEN sc.cliente_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN 25 ELSE 0 END) +
        (CASE WHEN sc.cliente_telefone IS NOT NULL AND LENGTH(sc.cliente_telefone) >= 10 THEN 25 ELSE 0 END)
    ) as qualidade_score,

    -- Relacionamento com contratos (análise básica)
    1 as total_contratos,
    1 as contratos_ativos,
    0 as contratos_cancelados,
    0 as contratos_entregues,
    1 as contratos_em_andamento,
    sc.data_cadastro as primeiro_contrato_data,
    sc.data_cadastro as ultimo_contrato_data,
    ARRAY[sc.contrato_numero]::text[] as numeros_contratos,

    -- Valores financeiros
    COALESCE(sc.valor_contrato, 0) as valor_total_contratos,
    COALESCE(sc.valor_contrato * 0.3, 0) as valor_total_pago, -- Estimativa
    COALESCE(sc.valor_contrato * 0.7, 0) as saldo_devedor_total, -- Estimativa
    COALESCE(sc.valor_contrato, 0) as valor_medio_contrato,
    30::decimal as percentual_pago_geral, -- Estimativa

    -- Análise de unidades (estimativas)
    1 as total_unidades_adquiridas,
    '{Apartamento}' as tipos_unidades,
    '{Empreendimento Padrão}' as empreendimentos,
    80::decimal as area_privativa_total,
    80::decimal as area_privativa_media,
    80::decimal as area_total_adquirida,
    100000::decimal as valor_terreno_total_unidades,
    1250::decimal as valor_medio_m2,
    0 as unidades_entregues,
    1 as unidades_em_construcao,
    1 as unidades_vendidas,

    -- Categorização e análises
    'Regular' as categoria_cliente,
    'Baixo' as categoria_risco_credito,
    'Residencial' as perfil_compra,
    0 as dias_media_entre_compras,
    'Classe Média' as segmento_demografico,
    COALESCE(sc.valor_contrato / 1000, 0) as score_valor_cliente,

    -- Flags de status
    TRUE as tem_historico_compras,
    FALSE as tem_cancelamentos,
    CASE WHEN sc.valor_contrato > 0 THEN TRUE ELSE FALSE END as tem_saldo_devedor,
    TRUE as tem_unidades_vinculadas,

    -- JSONs estruturados (simplificados)
    '[]'::jsonb as telefones_json,
    '[]'::jsonb as enderecos_json,
    '[]'::jsonb as procuradores_json,
    '[]'::jsonb as contatos_json,
    '{}'::jsonb as conjuge_json,
    '[]'::jsonb as renda_familiar_json,
    '[]'::jsonb as subtipos_json,
    '{}'::jsonb as estado_civil_json,

    -- Metadados
    CURRENT_TIMESTAMP as data_processamento

FROM silver.rpt_sienge_core sc
WHERE sc.domain_type = 'clientes'
AND sc.cliente_id IS NOT NULL;

-- View: gold.portfolio_imobiliario
-- Análise de unidades e empreendimentos
CREATE MATERIALIZED VIEW IF NOT EXISTS gold.portfolio_imobiliario AS
SELECT
    -- Identificação
    'unidades'::text as domain_type,
    'UN-' || ROW_NUMBER() OVER (ORDER BY sc.empreendimento_id, sc.contrato_id) as unique_id,
    sc.data_principal,
    sc.ano,
    sc.mes,
    sc.ano_mes,

    -- Dados da unidade (estimados com base em contratos)
    ROW_NUMBER() OVER (ORDER BY sc.empreendimento_id, sc.contrato_id) as unidade_id,
    'Unidade ' || ROW_NUMBER() OVER (ORDER BY sc.empreendimento_id, sc.contrato_id) as unidade_nome,
    'Apartamento' as tipo_imovel,
    TRUE as estoque_comercial,
    'Unidade padrão do empreendimento' as unidade_observacao,
    NULL::text as matricula,
    1 as pavimento,
    sc.contrato_numero as unidade_numero_contrato,
    NULL::text as inscricao_imobiliaria,

    -- Áreas (estimativas baseadas no valor)
    CASE WHEN sc.valor_contrato > 0 THEN (sc.valor_contrato / 5000)::decimal ELSE 80 END as area_privativa,
    CASE WHEN sc.valor_contrato > 0 THEN (sc.valor_contrato / 5000 * 0.25)::decimal ELSE 20 END as area_comum,
    0::decimal as area_terreno,
    CASE WHEN sc.valor_contrato > 0 THEN (sc.valor_contrato / 5000 * 1.1)::decimal ELSE 88 END as area_util,
    CASE WHEN sc.valor_contrato > 0 THEN (sc.valor_contrato / 5000 * 1.25)::decimal ELSE 100 END as area_total,
    0.001::decimal as fracao_ideal,
    1::decimal as fracao_ideal_m2,

    -- Valores
    100000::decimal as valor_terreno,
    2000::decimal as valor_iptu,
    FALSE as adimplencia_premiada,
    1::decimal as quantidade_indexada,

    -- Localização
    NULL::decimal as latitude,
    NULL::decimal as longitude,
    NULL::text as link_maps,

    -- Datas
    NULL::date as data_entrega,
    NULL::date as data_entrega_programada,
    sc.data_cadastro as unidade_data_cadastro,
    sc.data_atualizacao as unidade_data_atualizacao,

    -- Dados do empreendimento
    sc.empreendimento_id,
    sc.empreendimento_nome,
    sc.empreendimento_nome as empreendimento_nome_comercial,
    sc.empreendimento_tipo as tipo_empreendimento,
    'Endereço do empreendimento' as empreendimento_endereco,
    'Residencial' as empreendimento_categoria,
    'Médio' as empreendimento_porte,
    'Em Construção' as status_empreendimento,
    '12345678000100' as empreendimento_cnpj,

    -- Dados da empresa
    sc.empresa_id,
    sc.empresa_nome,

    -- Totalizações do empreendimento (estimativas)
    100 as empreendimento_total_unidades,
    50 as empreendimento_total_contratos,
    8000::decimal as empreendimento_area_total,
    25000000::decimal as empreendimento_valor_total,
    NULL::date as empreendimento_proxima_entrega,
    NULL::date as empreendimento_ultima_entrega,

    -- Dados do contrato vinculado
    sc.contrato_id,
    sc.contrato_numero as numero_contrato,
    sc.data_principal as data_contrato,
    sc.valor_contrato as contrato_valor_venda,
    sc.status_contrato as contrato_status,
    sc.cliente_nome as contrato_cliente_nome,
    NULL::date as contrato_data_entrega_chaves,

    -- Análise da unidade
    0 as total_unidades_filhas,
    0 as total_agrupamentos,
    0 as total_valores_especiais,
    0 as total_links,

    -- JSONs estruturados (simplificados)
    '[]'::jsonb as unidades_filhas_json,
    '[]'::jsonb as agrupamentos_json,
    '[]'::jsonb as valores_especiais_json,
    '[]'::jsonb as links_json,

    -- Status e categorização
    CASE
        WHEN sc.status_contrato = 'Cancelado' THEN 'Disponível'
        ELSE 'Vendida'
    END as status_unidade,
    CASE
        WHEN sc.valor_contrato > 0 AND (sc.valor_contrato / 5000) < 50 THEN 'Pequena'
        WHEN sc.valor_contrato > 0 AND (sc.valor_contrato / 5000) < 100 THEN 'Média'
        ELSE 'Grande'
    END as categoria_tamanho,
    'Residencial' as categoria_tipo,
    CASE
        WHEN sc.valor_contrato < 300000 THEN 'Econômico'
        WHEN sc.valor_contrato < 600000 THEN 'Médio'
        ELSE 'Alto Padrão'
    END as categoria_valor,
    'A Entregar' as status_entrega,
    NULL::integer as dias_para_entrega,
    CASE WHEN sc.valor_contrato > 0 THEN (sc.valor_contrato / (sc.valor_contrato / 5000))::decimal ELSE 5000 END as valor_por_m2,

    -- Coeficientes e percentuais
    1.5::decimal as coeficiente_aproveitamento,
    80::decimal as percentual_area_privativa,

    -- Validações
    TRUE as tem_nome_valido,
    TRUE as tem_area_valida,
    CASE WHEN sc.valor_contrato > 0 THEN TRUE ELSE FALSE END as tem_valor_valido,
    FALSE as tem_localizacao_valida,
    FALSE as tem_data_entrega_valida,

    -- Score de qualidade
    (
        20 + -- tem_nome_valido
        20 + -- tem_area_valida
        (CASE WHEN sc.valor_contrato > 0 THEN 30 ELSE 0 END) + -- tem_valor_valido
        (CASE WHEN sc.empreendimento_id IS NOT NULL THEN 20 ELSE 0 END) + -- tem_empreendimento
        (CASE WHEN sc.contrato_id IS NOT NULL THEN 10 ELSE 0 END) -- tem_contrato
    ) as qualidade_score,

    -- Flags de relacionamento
    CASE WHEN sc.empreendimento_id IS NOT NULL THEN TRUE ELSE FALSE END as tem_empreendimento_vinculado,
    CASE WHEN sc.contrato_id IS NOT NULL THEN TRUE ELSE FALSE END as tem_contrato_vinculado,
    FALSE as tem_coordenadas,
    FALSE as tem_unidades_filhas,
    FALSE as tem_agrupamentos,

    -- Análises de performance
    1::decimal as participacao_no_empreendimento,
    CASE WHEN sc.valor_contrato > 200000 THEN 15::decimal ELSE 5::decimal END as margem_venda_percentual,
    'Padrão' as segmento_estrategico,
    CASE WHEN sc.valor_contrato > 0 THEN (sc.valor_contrato / 100000)::decimal ELSE 3 END as score_atratividade,

    -- Metadados
    CURRENT_TIMESTAMP as data_processamento

FROM silver.rpt_sienge_core sc
WHERE sc.domain_type = 'contratos'
AND sc.contrato_id IS NOT NULL;

-- View: gold.performance_financeira
-- Análise financeira simplificada baseada em contratos
CREATE MATERIALIZED VIEW IF NOT EXISTS gold.performance_financeira AS
SELECT
    -- Identificação
    'financeiro'::text as domain_type,
    'FIN-' || sc.contrato_id::text || '-' || generate_series(1, 3) as unique_id,
    sc.data_principal + (generate_series(1, 3) * INTERVAL '1 month') as data_principal,
    EXTRACT(YEAR FROM sc.data_principal + (generate_series(1, 3) * INTERVAL '1 month'))::integer as ano,
    EXTRACT(MONTH FROM sc.data_principal + (generate_series(1, 3) * INTERVAL '1 month'))::integer as mes,
    TO_CHAR(sc.data_principal + (generate_series(1, 3) * INTERVAL '1 month'), 'YYYY-MM') as ano_mes,

    -- Valor do extrato (simulado)
    CASE generate_series(1, 3)
        WHEN 1 THEN sc.valor_contrato * 0.3  -- Entrada
        WHEN 2 THEN sc.valor_contrato * 0.35 -- Parcela intermediária
        ELSE sc.valor_contrato * 0.35        -- Parcela final
    END as valor_extrato,

    -- Classificação do movimento
    'Entrada' as origem_extrato,
    'Entrada' as classificacao_fluxo,
    CASE generate_series(1, 3)
        WHEN 1 THEN 'Entrada do contrato ' || sc.contrato_numero
        WHEN 2 THEN 'Parcela intermediária do contrato ' || sc.contrato_numero
        ELSE 'Parcela final do contrato ' || sc.contrato_numero
    END as descricao_extrato,

    -- Centro de custo e plano financeiro
    'Vendas Imobiliárias' as centro_custo_nome,
    sc.empresa_id,
    EXTRACT(QUARTER FROM sc.data_principal + (generate_series(1, 3) * INTERVAL '1 month'))::integer as trimestre,
    generate_series(1, 3) as numero_parcela,
    1 as centro_custo_id,
    NULL::integer as titulo_pagar_id,
    NULL::integer as conta_bancaria_id,
    100::decimal as percentual_apropriacao,
    CASE generate_series(1, 3)
        WHEN 1 THEN sc.valor_contrato * 0.3
        WHEN 2 THEN sc.valor_contrato * 0.35
        ELSE sc.valor_contrato * 0.35
    END as valor_apropriado,

    -- Saldo e controle
    CASE generate_series(1, 3)
        WHEN 1 THEN sc.valor_contrato * 0.7
        WHEN 2 THEN sc.valor_contrato * 0.35
        ELSE 0
    END as saldo_conta,

    -- Faixas e categorias
    CASE
        WHEN sc.valor_contrato * 0.3 < 10000 THEN 'Baixo'
        WHEN sc.valor_contrato * 0.3 < 50000 THEN 'Médio'
        ELSE 'Alto'
    END as faixa_valor_extrato,
    'Recebimento Contrato' as categoria_extrato,
    'Recebimento' as tipo_original,
    sc.cliente_nome as beneficiario,
    'CONT-' || sc.contrato_numero as numero_documento,
    'Recebimento referente ao contrato de venda' as observacoes,
    'Receita de Vendas' as plano_financeiro_nome,
    1 as plano_financeiro_id,
    'CONT-' || sc.contrato_numero as referencia_documento,
    NULL::integer as documento_relacionado_id,
    'Conciliado' as status_conciliacao,
    'Entrada' as movimento_caixa,
    TO_CHAR(sc.data_principal + (generate_series(1, 3) * INTERVAL '1 month'), 'YYYY-MM') as periodo_lancamento,
    sc.data_cadastro as data_criacao_registro,
    sc.data_atualizacao as data_atualizacao_registro,
    NULL::date as data_reconciliacao_bancaria,
    '{financeiro, vendas}' as tags_categorizacao,
    '{receita_principal}' as categorias_orcamentarias,
    EXTRACT(DAY FROM CURRENT_DATE - (sc.data_principal + (generate_series(1, 3) * INTERVAL '1 month')))::integer as dias_desde_lancamento,
    TRUE as conta_conciliada,
    'Recebimento' as tipo_movimento,
    CASE
        WHEN sc.valor_contrato * 0.3 < 10000 THEN 'Baixo'
        WHEN sc.valor_contrato * 0.3 < 50000 THEN 'Médio'
        ELSE 'Alto'
    END as categoria_valor,
    CASE
        WHEN EXTRACT(MONTH FROM sc.data_principal) IN (12, 1, 2) THEN 'Verão'
        WHEN EXTRACT(MONTH FROM sc.data_principal) IN (3, 4, 5) THEN 'Outono'
        WHEN EXTRACT(MONTH FROM sc.data_principal) IN (6, 7, 8) THEN 'Inverno'
        ELSE 'Primavera'
    END as estacao,
    'Normal' as sazonalidade,
    'Normal' as status_liquidez,
    EXTRACT(DAY FROM CURRENT_DATE - (sc.data_principal + (generate_series(1, 3) * INTERVAL '1 month')))::integer as idade_lancamento,
    CASE
        WHEN sc.valor_contrato > 500000 THEN 90::decimal
        WHEN sc.valor_contrato > 200000 THEN 70::decimal
        ELSE 50::decimal
    END as score_importancia_financeira,

    -- Metadados
    CURRENT_TIMESTAMP as data_processamento

FROM silver.rpt_sienge_core sc
WHERE sc.domain_type = 'contratos'
AND sc.contrato_id IS NOT NULL
AND sc.valor_contrato > 0;

-- Criar índices para as views Gold
CREATE INDEX IF NOT EXISTS idx_gold_vendas_data ON gold.vendas_360(data_principal);
CREATE INDEX IF NOT EXISTS idx_gold_vendas_status ON gold.vendas_360(status_derivado);
CREATE INDEX IF NOT EXISTS idx_gold_vendas_valor ON gold.vendas_360(valor_venda_total);

CREATE INDEX IF NOT EXISTS idx_gold_clientes_documento ON gold.clientes_360(cpf_cnpj_limpo);
CREATE INDEX IF NOT EXISTS idx_gold_clientes_tipo ON gold.clientes_360(tipo_pessoa);
CREATE INDEX IF NOT EXISTS idx_gold_clientes_score ON gold.clientes_360(score_valor_cliente);

CREATE INDEX IF NOT EXISTS idx_gold_portfolio_empreendimento ON gold.portfolio_imobiliario(empreendimento_id);
CREATE INDEX IF NOT EXISTS idx_gold_portfolio_status ON gold.portfolio_imobiliario(status_unidade);
CREATE INDEX IF NOT EXISTS idx_gold_portfolio_categoria ON gold.portfolio_imobiliario(categoria_valor);

CREATE INDEX IF NOT EXISTS idx_gold_financeiro_data ON gold.performance_financeira(data_principal);
CREATE INDEX IF NOT EXISTS idx_gold_financeiro_classificacao ON gold.performance_financeira(classificacao_fluxo);
CREATE INDEX IF NOT EXISTS idx_gold_financeiro_valor ON gold.performance_financeira(valor_extrato);

-- Log de conclusão
DO $$
BEGIN
    RAISE NOTICE 'Views materializadas do schema Gold criadas com sucesso em %', now();
END $$;