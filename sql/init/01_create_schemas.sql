-- 01_create_schemas.sql
-- Criação dos schemas do Data Warehouse
-- Este script é executado durante a inicialização do Docker

-- Criar schemas se não existirem
CREATE SCHEMA IF NOT EXISTS bronze;
CREATE SCHEMA IF NOT EXISTS silver;
CREATE SCHEMA IF NOT EXISTS gold;
CREATE SCHEMA IF NOT EXISTS staging;
CREATE SCHEMA IF NOT EXISTS system;

-- Comentários dos schemas
COMMENT ON SCHEMA bronze IS 'Schema Bronze - Dados brutos da API Sienge (Data Lake)';
COMMENT ON SCHEMA silver IS 'Schema Silver - Dados limpos, validados e conformados';
COMMENT ON SCHEMA gold IS 'Schema Gold - Dados prontos para análise e BI';
COMMENT ON SCHEMA staging IS 'Schema Staging - Área temporária para processamento ETL';
COMMENT ON SCHEMA system IS 'Schema System - Configurações e controle do sistema';

-- Log de execução
DO $$
BEGIN
    RAISE NOTICE 'Schemas do Data Warehouse criados com sucesso em %', now();
END $$;