-- 03_add_custom_columns.sql
-- Adiciona colunas customizadas nas tabelas
-- Este script é executado durante a inicialização do Docker

-- Log de início
DO $$
BEGIN
    RAISE NOTICE 'Adicionando colunas customizadas em %', now();
END $$;

-- Adicionar colunas de comissão em contratos_venda
DO $$
BEGIN
    -- Verificar se a tabela existe no schema bronze
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'bronze'
        AND table_name = 'contratos_venda'
    ) THEN
        -- Adicionar coluna tem_comissao
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'bronze'
            AND table_name = 'contratos_venda'
            AND column_name = 'tem_comissao'
        ) THEN
            ALTER TABLE bronze.contratos_venda
            ADD COLUMN tem_comissao BOOLEAN DEFAULT FALSE;
            RAISE NOTICE 'Coluna tem_comissao adicionada';
        END IF;

        -- Adicionar coluna id_contrato_comissao
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'bronze'
            AND table_name = 'contratos_venda'
            AND column_name = 'id_contrato_comissao'
        ) THEN
            ALTER TABLE bronze.contratos_venda
            ADD COLUMN id_contrato_comissao INTEGER;
            RAISE NOTICE 'Coluna id_contrato_comissao adicionada';
        END IF;

        -- Adicionar coluna total_comissoes
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'bronze'
            AND table_name = 'contratos_venda'
            AND column_name = 'total_comissoes'
        ) THEN
            ALTER TABLE bronze.contratos_venda
            ADD COLUMN total_comissoes INTEGER DEFAULT 0;
            RAISE NOTICE 'Coluna total_comissoes adicionada';
        END IF;

        -- Adicionar coluna valor_total_comissao
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'bronze'
            AND table_name = 'contratos_venda'
            AND column_name = 'valor_total_comissao'
        ) THEN
            ALTER TABLE bronze.contratos_venda
            ADD COLUMN valor_total_comissao DECIMAL(15,2) DEFAULT 0.00;
            RAISE NOTICE 'Coluna valor_total_comissao adicionada';
        END IF;

        -- Adicionar coluna faixa_valor_comissao
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'bronze'
            AND table_name = 'contratos_venda'
            AND column_name = 'faixa_valor_comissao'
        ) THEN
            ALTER TABLE bronze.contratos_venda
            ADD COLUMN faixa_valor_comissao TEXT;
            RAISE NOTICE 'Coluna faixa_valor_comissao adicionada';
        END IF;

        -- Adicionar coluna percentual_comissao_sobre_contrato
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'bronze'
            AND table_name = 'contratos_venda'
            AND column_name = 'percentual_comissao_sobre_contrato'
        ) THEN
            ALTER TABLE bronze.contratos_venda
            ADD COLUMN percentual_comissao_sobre_contrato DECIMAL(5,2) DEFAULT 0.00;
            RAISE NOTICE 'Coluna percentual_comissao_sobre_contrato adicionada';
        END IF;

        RAISE NOTICE 'Todas as colunas de comissão foram verificadas/adicionadas';
    ELSE
        RAISE WARNING 'Tabela contratos_venda não encontrada no schema bronze';
    END IF;
END $$;

-- Atualizar valores das novas colunas baseado nos dados existentes
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'bronze'
        AND table_name = 'contratos_venda'
    ) THEN
        -- Atualizar tem_comissao baseado em linkedCommissions
        UPDATE bronze.contratos_venda
        SET tem_comissao = CASE
            WHEN "linkedCommissions" IS NOT NULL
            AND "linkedCommissions" != 'null'::jsonb
            AND jsonb_array_length("linkedCommissions") > 0 THEN TRUE
            ELSE FALSE
        END
        WHERE tem_comissao IS NULL;

        -- Calcular valor_total_comissao e total_comissoes
        UPDATE bronze.contratos_venda
        SET
            total_comissoes = CASE
                WHEN "linkedCommissions" IS NOT NULL
                AND jsonb_typeof("linkedCommissions") = 'array'
                THEN jsonb_array_length("linkedCommissions")
                ELSE 0
            END,
            valor_total_comissao = CASE
                WHEN "linkedCommissions" IS NOT NULL
                AND jsonb_typeof("linkedCommissions") = 'array'
                THEN COALESCE((
                    SELECT SUM((elem->>'commissionValue')::decimal)
                    FROM jsonb_array_elements("linkedCommissions") AS elem
                    WHERE elem->>'commissionValue' IS NOT NULL
                ), 0)
                ELSE 0
            END
        WHERE total_comissoes IS NULL OR valor_total_comissao IS NULL;

        -- Calcular percentual_comissao_sobre_contrato
        UPDATE bronze.contratos_venda
        SET percentual_comissao_sobre_contrato = CASE
            WHEN "totalValue" > 0 AND valor_total_comissao > 0
            THEN ROUND((valor_total_comissao / "totalValue") * 100, 2)
            ELSE 0
        END
        WHERE percentual_comissao_sobre_contrato IS NULL;

        -- Definir faixa_valor_comissao
        UPDATE bronze.contratos_venda
        SET faixa_valor_comissao = CASE
            WHEN valor_total_comissao IS NULL OR valor_total_comissao = 0 THEN 'Sem Comissao'
            WHEN valor_total_comissao < 100 THEN 'Muito Baixo'
            WHEN valor_total_comissao < 1000 THEN 'Baixo'
            WHEN valor_total_comissao < 10000 THEN 'Medio'
            WHEN valor_total_comissao < 50000 THEN 'Alto'
            ELSE 'Muito Alto'
        END
        WHERE faixa_valor_comissao IS NULL;

        RAISE NOTICE 'Valores das colunas de comissão atualizados';
    END IF;
END $$;

-- Log de conclusão
DO $$
BEGIN
    RAISE NOTICE 'Adição de colunas customizadas concluída em %', now();
END $$;