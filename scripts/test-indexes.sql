-- Script para testar a performance dos índices criados
-- Este script executa EXPLAIN ANALYZE em consultas comuns para verificar se os índices estão sendo utilizados

-- Teste 1: Busca por nome de cliente (deve usar índice clientes_nomeCompleto_idx)
EXPLAIN ANALYZE 
SELECT * FROM clientes 
WHERE nomeCompleto ILIKE '%João%' 
LIMIT 10;

-- Teste 2: Busca por clientes ativos (deve usar índice clientes_ativo_idx)
EXPLAIN ANALYZE 
SELECT * FROM clientes 
WHERE ativo = true 
LIMIT 10;

-- Teste 3: Busca por cliente ativo de uma empresa específica (deve usar índice composto)
EXPLAIN ANALYZE 
SELECT * FROM clientes 
WHERE idEmpresa = 1 AND ativo = true 
LIMIT 10;

-- Teste 4: Busca por nome de credor (deve usar índice credores_nomeCredor_idx)
EXPLAIN ANALYZE 
SELECT * FROM credores 
WHERE nomeCredor ILIKE '%Fornecedor%' 
LIMIT 10;

-- Teste 5: Busca por credores ativos (deve usar índice credores_ativo_idx)
EXPLAIN ANALYZE 
SELECT * FROM credores 
WHERE ativo = true 
LIMIT 10;

-- Teste 6: Busca por logs de sincronização por tipo (deve usar índice sync_logs_entityType_idx)
EXPLAIN ANALYZE 
SELECT * FROM sync_logs 
WHERE entityType = 'Cliente' 
ORDER BY syncStartedAt DESC 
LIMIT 10;

-- Teste 7: Busca por logs de sincronização por status (deve usar índice sync_logs_status_idx)
EXPLAIN ANALYZE 
SELECT * FROM sync_logs 
WHERE status = 'completed' 
ORDER BY syncStartedAt DESC 
LIMIT 10;

-- Teste 8: Busca por logs de sincronização por tipo e status (deve usar índice composto)
EXPLAIN ANALYZE 
SELECT * FROM sync_logs 
WHERE entityType = 'Cliente' AND status = 'completed' 
ORDER BY syncStartedAt DESC 
LIMIT 10;

-- Teste 9: Busca por empresas ativas (deve usar índice empresas_ativo_idx)
EXPLAIN ANALYZE 
SELECT * FROM empresas 
WHERE ativo = true 
LIMIT 10;

-- Teste 10: Busca por municípios por UF (deve usar índice municipios_uf_idx)
EXPLAIN ANALYZE 
SELECT * FROM municipios 
WHERE uf = 'SP' 
LIMIT 10;

-- Verificar estatísticas dos índices
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as "Index Scans",
    idx_tup_read as "Tuples Read",
    idx_tup_fetch as "Tuples Fetched"
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
