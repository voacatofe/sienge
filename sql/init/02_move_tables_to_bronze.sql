-- 02_move_tables_to_bronze.sql
-- Move tabelas do schema public para o schema bronze
-- Este script é executado durante a inicialização do Docker

-- Log de início
DO $$
BEGIN
    RAISE NOTICE 'Movendo tabelas para schema bronze em %', now();
END $$;

-- Mover tabela contratos_venda para bronze se existir no public
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'contratos_venda'
    ) THEN
        -- Mover a tabela
        ALTER TABLE public.contratos_venda SET SCHEMA bronze;
        RAISE NOTICE 'Tabela contratos_venda movida para schema bronze';
    ELSE
        RAISE NOTICE 'Tabela contratos_venda não encontrada em public ou já está em bronze';
    END IF;
END $$;

-- Mover outras tabelas principais se necessário
DO $$
DECLARE
    table_to_move TEXT;
    tables_to_move TEXT[] := ARRAY[
        'clientes',
        'empresas',
        'empreendimentos',
        'unidades',
        'titulo_receber',
        'contas_receber',
        'extrato_contas',
        'cliente_telefones',
        'cliente_enderecos',
        'cliente_procuradores',
        'cliente_contatos',
        'cliente_subtipos',
        'cliente_renda_familiar',
        'contrato_clientes',
        'contrato_unidades',
        'contrato_condicoes_pagamento',
        'unidade_filhas',
        'unidade_agrupamentos',
        'unidade_valores_especiais',
        'unidade_links'
    ];
BEGIN
    FOREACH table_to_move IN ARRAY tables_to_move
    LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = table_to_move
        ) THEN
            EXECUTE format('ALTER TABLE public.%I SET SCHEMA bronze', table_to_move);
            RAISE NOTICE 'Tabela % movida para schema bronze', table_to_move;
        END IF;
    END LOOP;
END $$;

-- Log de conclusão
DO $$
BEGIN
    RAISE NOTICE 'Movimentação de tabelas para bronze concluída em %', now();
END $$;