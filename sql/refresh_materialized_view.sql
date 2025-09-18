-- ================================================
-- SCRIPT DE REFRESH PARA VIEW MATERIALIZADA
-- Executar diariamente às 6h da manhã
-- ================================================

-- Refresh CONCORRENTEMENTE para não bloquear leituras durante o refresh
REFRESH MATERIALIZED VIEW CONCURRENTLY rpt_sienge_master_wide;

-- Atualizar estatísticas após refresh
ANALYZE rpt_sienge_master_wide;

-- Verificar tamanho e performance
SELECT
  pg_size_pretty(pg_total_relation_size('rpt_sienge_master_wide')) as tamanho_total,
  COUNT(*) as total_registros,
  NOW() as data_refresh
FROM rpt_sienge_master_wide;