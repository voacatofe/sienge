-- =====================================
-- VERIFICAÇÃO DA ESTRUTURA DO BANCO
-- Execute este arquivo para validar dados antes da view única
-- =====================================

-- 1. Verificar tabelas existentes
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('contratos_venda', 'titulos_receber', 'movimentos_bancarios', 'empresas', 'clientes', 'empreendimentos', 'unidades')
ORDER BY table_name;

-- 2. Verificar estrutura da tabela contratos_venda
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contratos_venda'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar estrutura da tabela titulos_receber
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'titulos_receber'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Verificar estrutura da tabela movimentos_bancarios
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'movimentos_bancarios'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Contar registros por tabela
SELECT
  'contratos_venda' as tabela, COUNT(*) as total
FROM contratos_venda
UNION ALL
SELECT
  'titulos_receber', COUNT(*)
FROM titulos_receber
UNION ALL
SELECT
  'movimentos_bancarios', COUNT(*)
FROM movimentos_bancarios
UNION ALL
SELECT
  'empresas', COUNT(*)
FROM empresas;

-- 6. Verificar dados recentes
SELECT 'contratos_venda' as tabela, MIN("contractDate") as data_min, MAX("contractDate") as data_max
FROM contratos_venda
WHERE "contractDate" IS NOT NULL
UNION ALL
SELECT 'titulos_receber', MIN("dataVencimento"), MAX("dataVencimento")
FROM titulos_receber
WHERE "dataVencimento" IS NOT NULL
UNION ALL
SELECT 'movimentos_bancarios', MIN("bankMovementDate"), MAX("bankMovementDate")
FROM movimentos_bancarios
WHERE "bankMovementDate" IS NOT NULL;