-- ============================================
-- SCRIPT DE REFRESH - VIEWS MATERIALIZADAS
-- Atualização automática dos dados do Data Warehouse
-- ============================================

-- 🎯 OBJETIVO:
-- Script para atualizar todas as views materializadas
-- Pode ser executado manualmente ou via cron job

-- =====================================
-- 📊 FUNÇÃO DE REFRESH COM LOG
-- =====================================
CREATE OR REPLACE FUNCTION refresh_datawarehouse_views()
RETURNS TABLE(
  view_name text,
  status text,
  start_time timestamp,
  end_time timestamp,
  duration interval,
  row_count bigint
) AS $$
DECLARE
  view_record record;
  start_ts timestamp;
  end_ts timestamp;
  row_cnt bigint;
BEGIN
  -- Lista de views materializadas para refresh
  FOR view_record IN
    SELECT matviewname
    FROM pg_matviews
    WHERE matviewname LIKE 'rpt_%'
    ORDER BY matviewname
  LOOP
    start_ts := clock_timestamp();

    BEGIN
      -- Fazer refresh da view
      EXECUTE format('REFRESH MATERIALIZED VIEW CONCURRENTLY %I', view_record.matviewname);

      -- Contar registros
      EXECUTE format('SELECT COUNT(*) FROM %I', view_record.matviewname) INTO row_cnt;

      end_ts := clock_timestamp();

      -- Retornar resultado de sucesso
      view_name := view_record.matviewname;
      status := 'SUCCESS';
      start_time := start_ts;
      end_time := end_ts;
      duration := end_ts - start_ts;
      row_count := row_cnt;

      RETURN NEXT;

      -- Log do sucesso
      RAISE NOTICE 'SUCCESS: % refreshed in %, % rows', view_record.matviewname, (end_ts - start_ts), row_cnt;

    EXCEPTION WHEN OTHERS THEN
      end_ts := clock_timestamp();

      -- Retornar resultado de erro
      view_name := view_record.matviewname;
      status := 'ERROR: ' || SQLERRM;
      start_time := start_ts;
      end_time := end_ts;
      duration := end_ts - start_ts;
      row_count := 0;

      RETURN NEXT;

      -- Log do erro
      RAISE WARNING 'ERROR: % failed - %', view_record.matviewname, SQLERRM;
    END;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================
-- 🔄 EXECUTAR REFRESH DE TODAS AS VIEWS
-- =====================================
-- Executar e mostrar resultados
SELECT * FROM refresh_datawarehouse_views();

-- =====================================
-- 📈 ESTATÍSTICAS PÓS-REFRESH
-- =====================================
-- Verificar estatísticas de todas as views
SELECT
  schemaname,
  matviewname as view_name,
  hasindexes,
  ispopulated,
  pg_size_pretty(pg_total_relation_size(matviewname::regclass)) as size,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = matviewname) as exists_check
FROM pg_matviews
WHERE matviewname LIKE 'rpt_%'
ORDER BY matviewname;

-- =====================================
-- 🕐 SCRIPT PARA CRON JOB
-- =====================================
/*
Para agendar atualização diária às 6h da manhã, adicionar ao crontab:

# Refresh das views materializadas do Data Warehouse - Sienge
0 6 * * * psql "$DATABASE_URL" -c "SELECT refresh_datawarehouse_views();" >> /app/logs/dw_refresh.log 2>&1

Ou criar script bash:
*/

-- =====================================
-- 📊 REFRESH INDIVIDUAL (se necessário)
-- =====================================
-- Para refresh manual de uma view específica:
-- REFRESH MATERIALIZED VIEW CONCURRENTLY rpt_vendas_wide;

-- Para refresh forçado (sem CONCURRENTLY):
-- REFRESH MATERIALIZED VIEW rpt_vendas_wide;

-- =====================================
-- 🎯 MONITORAMENTO DE PERFORMANCE
-- =====================================
-- Query para monitorar performance das views
SELECT
  matviewname,
  pg_size_pretty(pg_total_relation_size(matviewname::regclass)) as size,
  (
    SELECT COUNT(*)
    FROM pg_stat_user_tables
    WHERE relname = matviewname
  ) as access_count
FROM pg_matviews
WHERE matviewname LIKE 'rpt_%'
ORDER BY pg_total_relation_size(matviewname::regclass) DESC;

-- =====================================
-- 🧹 LIMPEZA E MANUTENÇÃO
-- =====================================
-- Comando para analisar estatísticas após refresh
ANALYZE;

-- Verificar fragmentação e recomendar REINDEX se necessário
SELECT
  schemaname,
  tablename as view_name,
  attname as column_name,
  n_distinct,
  correlation
FROM pg_stats
WHERE tablename LIKE 'rpt_%'
  AND n_distinct > 100
ORDER BY tablename, attname;

-- =====================================
-- ✅ REFRESH CONCLUÍDO
-- =====================================
SELECT
  'Data Warehouse refresh completed at ' || NOW()::text as status,
  COUNT(*) as views_refreshed
FROM pg_matviews
WHERE matviewname LIKE 'rpt_%';