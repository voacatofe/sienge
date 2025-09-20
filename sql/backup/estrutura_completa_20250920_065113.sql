--
-- PostgreSQL database dump
--

\restrict 87aM7O1rqn3qnw3ZHhIeVUTjfJ2YSwauBCQNqyaoPQrbs9aHyQSXtKUboJPRUlZ

-- Dumped from database version 15.14
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: bronze; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA bronze;


--
-- Name: gold; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA gold;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: silver; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA silver;


--
-- Name: staging; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA staging;


--
-- Name: system; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA system;


--
-- Name: analyze_index_usage(); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.analyze_index_usage() RETURNS TABLE(schema_name text, table_name text, index_name text, table_size_mb numeric, index_size_mb numeric, index_scans bigint, tuples_read bigint, tuples_fetched bigint, efficiency_ratio numeric, recommendation text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        schemaname::TEXT,
        relname::TEXT,
        indexrelname::TEXT,
        ROUND(pg_total_relation_size(relid) / (1024.0 * 1024.0), 2) as table_size_mb,
        ROUND(pg_total_relation_size(indexrelid) / (1024.0 * 1024.0), 2) as index_size_mb,
        idx_scan,
        idx_tup_read,
        idx_tup_fetch,
        CASE
            WHEN idx_scan = 0 OR idx_tup_read = 0 THEN 0
            ELSE ROUND((idx_tup_fetch::NUMERIC / NULLIF(idx_tup_read, 0)::NUMERIC) * 100, 2)
        END as efficiency_ratio,
        CASE
            WHEN idx_scan = 0 THEN 'ÍNDICE NUNCA USADO - Considere remover'
            WHEN idx_scan < 10 THEN 'BAIXO USO - Monitore por mais tempo'
            WHEN (idx_tup_fetch::NUMERIC / NULLIF(idx_tup_read, 0)::NUMERIC) < 0.1 THEN 'BAIXA EFICIÊNCIA - Revisar'
            ELSE 'BOM DESEMPENHO'
        END as recommendation
    FROM pg_stat_user_indexes
    WHERE schemaname IN ('bronze', 'silver', 'gold', 'system')
    ORDER BY idx_scan DESC, table_size_mb DESC;
END;
$$;


--
-- Name: FUNCTION analyze_index_usage(); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.analyze_index_usage() IS 'Analisa uso e eficiência dos índices no Data Warehouse';


--
-- Name: backup_full_datawarehouse(text); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.backup_full_datawarehouse(backup_path text DEFAULT '/tmp/backup'::text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    result TEXT := '';
    schema_result TEXT;
    backup_date TEXT;
BEGIN
    backup_date := TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD_HH24-MI-SS');

    result := format(
        'BACKUP COMPLETO DO DATA WAREHOUSE - %s%s' ||
        '======================================================================%s%s',
        backup_date, E'\n',
        E'\n', E'\n'
    );

    -- Backup do schema BRONZE
    SELECT backup_schema('bronze', backup_path) INTO schema_result;
    result := result || 'BRONZE SCHEMA:' || E'\n' || schema_result || E'\n';

    -- Backup do schema SILVER
    SELECT backup_schema('silver', backup_path) INTO schema_result;
    result := result || 'SILVER SCHEMA:' || E'\n' || schema_result || E'\n';

    -- Backup do schema GOLD
    SELECT backup_schema('gold', backup_path) INTO schema_result;
    result := result || 'GOLD SCHEMA:' || E'\n' || schema_result || E'\n';

    -- Backup do schema SYSTEM
    SELECT backup_schema('system', backup_path) INTO schema_result;
    result := result || 'SYSTEM SCHEMA:' || E'\n' || schema_result || E'\n';

    result := result || format(
        '======================================================================%s' ||
        'BACKUP COMPLETO PREPARADO%s' ||
        'Execute os comandos pg_dump listados acima para realizar os backups.%s' ||
        'Recomenda-se executar em paralelo para otimizar o tempo.%s',
        E'\n',
        E'\n',
        E'\n',
        E'\n'
    );

    RETURN result;
END;
$$;


--
-- Name: FUNCTION backup_full_datawarehouse(backup_path text); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.backup_full_datawarehouse(backup_path text) IS 'Gera comandos de backup para todos os schemas do Data Warehouse';


--
-- Name: backup_schema(text, text, boolean); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.backup_schema(schema_name text, backup_path text DEFAULT '/tmp/backup'::text, include_data boolean DEFAULT true) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    backup_file TEXT;
    cmd TEXT;
    result TEXT;
    table_count INTEGER;
    view_count INTEGER;
    total_size_mb NUMERIC;
BEGIN
    -- Valida se o schema existe
    IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = schema_name) THEN
        RETURN 'ERRO: Schema ' || schema_name || ' não existe';
    END IF;

    -- Gera nome do arquivo de backup
    backup_file := backup_path || '/backup_' || schema_name || '_' ||
                   TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD_HH24-MI-SS') || '.sql';

    -- Conta objetos no schema
    SELECT
        COUNT(CASE WHEN relkind IN ('r', 'm') THEN 1 END),
        COUNT(CASE WHEN relkind = 'v' THEN 1 END),
        ROUND(SUM(pg_total_relation_size(c.oid)) / (1024.0 * 1024.0), 2)
    INTO table_count, view_count, total_size_mb
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = schema_name;

    -- Prepara comando de backup
    IF include_data THEN
        cmd := format('pg_dump -h %s -p %s -U %s -d %s --schema=%s --verbose --file=%s',
                     '147.93.15.121', '5434', 'sienge_app', 'sienge_data', schema_name, backup_file);
    ELSE
        cmd := format('pg_dump -h %s -p %s -U %s -d %s --schema=%s --schema-only --verbose --file=%s',
                     '147.93.15.121', '5434', 'sienge_app', 'sienge_data', schema_name, backup_file);
    END IF;

    -- Log início do backup
    RAISE NOTICE 'Iniciando backup do schema %', schema_name;
    RAISE NOTICE 'Objetos: % tabelas/views materializadas, % views, %.2f MB',
                 table_count, view_count, total_size_mb;
    RAISE NOTICE 'Comando: %', cmd;

    -- Registra no log de sistema
    BEGIN
        INSERT INTO system.sync_logs (
            "entityType",
            "syncStartedAt",
            "recordsProcessed",
            "status"
        ) VALUES (
            'BACKUP_SCHEMA_' || schema_name,
            CURRENT_TIMESTAMP,
            table_count + view_count,
            'in_progress'
        );
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'Aviso: Não foi possível inserir log de backup';
    END;

    -- Monta resultado
    result := format(
        'Backup do schema %s preparado:%s' ||
        'Arquivo: %s%s' ||
        'Objetos: %s tabelas/views mat, %s views%s' ||
        'Tamanho: %.2f MB%s' ||
        'Comando: %s%s%s' ||
        'IMPORTANTE: Execute o comando acima no terminal para realizar o backup.',
        schema_name, E'\n',
        backup_file, E'\n',
        table_count, view_count, E'\n',
        total_size_mb, E'\n',
        cmd, E'\n', E'\n'
    );

    RETURN result;

EXCEPTION WHEN others THEN
    -- Log erro
    BEGIN
        UPDATE system.sync_logs
        SET status = 'error',
            "errorMessage" = SQLERRM,
            "syncCompletedAt" = CURRENT_TIMESTAMP
        WHERE "entityType" = 'BACKUP_SCHEMA_' || schema_name
        AND status = 'in_progress';
    EXCEPTION WHEN others THEN
        NULL;
    END;

    RETURN 'ERRO: ' || SQLERRM;
END;
$$;


--
-- Name: FUNCTION backup_schema(schema_name text, backup_path text, include_data boolean); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.backup_schema(schema_name text, backup_path text, include_data boolean) IS 'Gera comando de backup para um schema específico com opção de incluir dados';


--
-- Name: check_materialized_views_status(); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.check_materialized_views_status() RETURNS TABLE(schema_name text, view_name text, size_mb numeric, row_count bigint, last_refresh timestamp without time zone, is_populated boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        mv.schemaname::TEXT,
        mv.matviewname::TEXT,
        ROUND(pg_total_relation_size(mv.schemaname||'.'||mv.matviewname) / (1024.0 * 1024.0), 2) as size_mb,
        CASE
            WHEN mv.ispopulated THEN
                (SELECT count(*) FROM pg_stat_user_tables
                 WHERE schemaname = mv.schemaname AND relname = mv.matviewname)
            ELSE 0
        END as row_count,
        COALESCE(
            (SELECT max("syncCompletedAt")
             FROM system.sync_logs
             WHERE "entityType" = 'REFRESH_VIEW_' || mv.schemaname||'.'||mv.matviewname
             AND status = 'success'),
            '1970-01-01'::timestamp
        ) as last_refresh,
        mv.ispopulated
    FROM pg_matviews mv
    WHERE mv.schemaname IN ('silver', 'gold')
    ORDER BY mv.schemaname, mv.matviewname;
END;
$$;


--
-- Name: FUNCTION check_materialized_views_status(); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.check_materialized_views_status() IS 'Retorna informações sobre tamanho, registros e última atualização das views materializadas';


--
-- Name: check_performance_alerts(); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.check_performance_alerts() RETURNS TABLE(alert_level text, alert_type text, message text, action_required text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    rec RECORD;
BEGIN
    -- Verifica queries muito lentas (> 5 segundos)
    FOR rec IN
        SELECT * FROM monitor_slow_queries(5.0)
    LOOP
        SELECT 'CRITICAL'::TEXT, 'SLOW_QUERY'::TEXT,
               'Query com média de ' || rec.avg_time_ms || 'ms detectada',
               'Otimizar query: ' || LEFT(rec.query_text, 100)
        INTO alert_level, alert_type, message, action_required;
        RETURN NEXT;
    END LOOP;

    -- Verifica views não atualizadas há mais de 48h
    FOR rec IN
        SELECT * FROM check_materialized_views_status()
        WHERE last_refresh < CURRENT_TIMESTAMP - INTERVAL '48 hours'
    LOOP
        SELECT 'WARNING'::TEXT, 'STALE_VIEW'::TEXT,
               'View ' || rec.schema_name || '.' || rec.view_name || ' não atualizada há ' ||
               EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - rec.last_refresh)) || ' horas',
               'Executar refresh da view'
        INTO alert_level, alert_type, message, action_required;
        RETURN NEXT;
    END LOOP;

    -- Verifica crescimento excessivo de dados
    FOR rec IN
        SELECT * FROM monitor_data_growth()
        WHERE size_mb > 1000
    LOOP
        SELECT 'INFO'::TEXT, 'LARGE_OBJECT'::TEXT,
               rec.object_name || ' tem ' || rec.size_mb || 'MB',
               'Monitorar crescimento e considerar particionamento'
        INTO alert_level, alert_type, message, action_required;
        RETURN NEXT;
    END LOOP;

END;
$$;


--
-- Name: FUNCTION check_performance_alerts(); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.check_performance_alerts() IS 'Verifica alertas automáticos baseados em thresholds de performance';


--
-- Name: datawarehouse_health_check(); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.datawarehouse_health_check() RETURNS TABLE(category text, component text, status text, value text, recommendation text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    total_size_mb NUMERIC;
    view_count INTEGER;
    slow_query_count INTEGER;
    unused_index_count INTEGER;
BEGIN
    -- Verifica tamanho total do DW
    SELECT SUM(pg_total_relation_size(c.oid) / (1024.0 * 1024.0))
    INTO total_size_mb
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname IN ('bronze', 'silver', 'gold');

    -- Conta views materializadas
    SELECT COUNT(*)
    INTO view_count
    FROM pg_matviews
    WHERE schemaname IN ('silver', 'gold');

    -- Conta queries em execução (substituto para queries lentas)
    SELECT COUNT(*)
    INTO slow_query_count
    FROM pg_stat_activity
    WHERE state != 'idle'
        AND EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - query_start)) > 1;

    -- Conta índices não utilizados
    SELECT COUNT(*)
    INTO unused_index_count
    FROM pg_stat_user_indexes
    WHERE idx_scan = 0 AND schemaname IN ('bronze', 'silver', 'gold');

    -- RETORNA RESULTADOS

    -- Tamanho total
    SELECT 'STORAGE'::TEXT, 'Total Size'::TEXT,
           CASE WHEN total_size_mb < 1000 THEN 'GOOD'
                WHEN total_size_mb < 5000 THEN 'WARNING'
                ELSE 'CRITICAL' END,
           total_size_mb::TEXT || ' MB',
           CASE WHEN total_size_mb > 5000 THEN 'Considere archiving de dados antigos'
                ELSE 'Tamanho adequado' END
    INTO category, component, status, value, recommendation;
    RETURN NEXT;

    -- Views materializadas
    SELECT 'VIEWS'::TEXT, 'Materialized Views'::TEXT,
           CASE WHEN view_count >= 4 THEN 'GOOD'
                WHEN view_count >= 2 THEN 'WARNING'
                ELSE 'CRITICAL' END,
           view_count::TEXT || ' views',
           CASE WHEN view_count < 4 THEN 'Implementar views em falta'
                ELSE 'Estrutura completa' END
    INTO category, component, status, value, recommendation;
    RETURN NEXT;

    -- Performance
    SELECT 'PERFORMANCE'::TEXT, 'Slow Queries'::TEXT,
           CASE WHEN slow_query_count = 0 THEN 'GOOD'
                WHEN slow_query_count < 5 THEN 'WARNING'
                ELSE 'CRITICAL' END,
           slow_query_count::TEXT || ' queries > 1s',
           CASE WHEN slow_query_count > 5 THEN 'Otimizar queries lentas'
                WHEN slow_query_count > 0 THEN 'Monitorar performance'
                ELSE 'Performance adequada' END
    INTO category, component, status, value, recommendation;
    RETURN NEXT;

    -- Índices
    SELECT 'INDEXES'::TEXT, 'Unused Indexes'::TEXT,
           CASE WHEN unused_index_count = 0 THEN 'GOOD'
                WHEN unused_index_count < 3 THEN 'WARNING'
                ELSE 'CRITICAL' END,
           unused_index_count::TEXT || ' unused',
           CASE WHEN unused_index_count > 3 THEN 'Remover índices não utilizados'
                WHEN unused_index_count > 0 THEN 'Avaliar necessidade dos índices'
                ELSE 'Índices bem utilizados' END
    INTO category, component, status, value, recommendation;
    RETURN NEXT;

END;
$$;


--
-- Name: FUNCTION datawarehouse_health_check(); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.datawarehouse_health_check() IS 'Executa verificação completa de saúde do Data Warehouse';


--
-- Name: generate_restore_script(text, text, boolean); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.generate_restore_script(schema_name text, backup_file text, drop_existing boolean DEFAULT false) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    restore_script TEXT := '';
BEGIN
    restore_script := format(
        '-- ==================================================================%s' ||
        '-- SCRIPT DE RESTORE PARA SCHEMA: %s%s' ||
        '-- Arquivo de backup: %s%s' ||
        '-- Gerado em: %s%s' ||
        '-- ==================================================================%s%s',
        E'\n', schema_name, E'\n',
        backup_file, E'\n',
        CURRENT_TIMESTAMP, E'\n',
        E'\n', E'\n'
    );

    IF drop_existing THEN
        restore_script := restore_script || format(
            '-- ATENÇÃO: Este script irá REMOVER o schema existente!%s' ||
            '-- Fazer backup antes de executar se necessário%s%s' ||
            'DROP SCHEMA IF EXISTS %s CASCADE;%s%s',
            E'\n', E'\n', E'\n',
            schema_name, E'\n', E'\n'
        );
    END IF;

    restore_script := restore_script || format(
        '-- Comando de restore:%s' ||
        'psql -h 147.93.15.121 -p 5434 -U sienge_app -d sienge_data -f %s%s%s' ||
        '-- Ou usando pg_restore se for formato custom:%s' ||
        '-- pg_restore -h 147.93.15.121 -p 5434 -U sienge_app -d sienge_data %s%s%s' ||
        '-- Após o restore, execute:%s' ||
        'SELECT ''Restore do schema %s completado em'' || CURRENT_TIMESTAMP;%s%s' ||
        '-- Verificar integridade:%s' ||
        'SELECT check_materialized_views_status();%s%s' ||
        '-- Refresh das views materializadas se necessário:%s' ||
        'SELECT refresh_all_datawarehouse_views();%s',
        E'\n',
        backup_file, E'\n', E'\n',
        E'\n',
        backup_file, E'\n', E'\n',
        E'\n',
        schema_name, E'\n', E'\n',
        E'\n',
        E'\n', E'\n',
        E'\n',
        E'\n'
    );

    RETURN restore_script;
END;
$$;


--
-- Name: FUNCTION generate_restore_script(schema_name text, backup_file text, drop_existing boolean); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.generate_restore_script(schema_name text, backup_file text, drop_existing boolean) IS 'Gera script de restore completo para um schema específico';


--
-- Name: list_available_backups(text); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.list_available_backups(backup_path text DEFAULT '/tmp/backup'::text) RETURNS TABLE(backup_file text, schema_name text, backup_date timestamp without time zone, estimated_size text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Esta função retorna informações dos backups baseado nos logs
    -- Nota: Não consegue listar arquivos reais do sistema de arquivos

    RETURN QUERY
    SELECT
        'backup_' || REPLACE("entityType", 'BACKUP_SCHEMA_', '') || '_' ||
        TO_CHAR("syncStartedAt", 'YYYY-MM-DD_HH24-MI-SS') || '.sql' as backup_file,
        REPLACE("entityType", 'BACKUP_SCHEMA_', '') as schema_name,
        "syncStartedAt" as backup_date,
        "recordsProcessed"::TEXT || ' objetos' as estimated_size
    FROM system.sync_logs
    WHERE "entityType" LIKE 'BACKUP_SCHEMA_%'
        AND status = 'success'
    ORDER BY "syncStartedAt" DESC;
END;
$$;


--
-- Name: FUNCTION list_available_backups(backup_path text); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.list_available_backups(backup_path text) IS 'Lista backups disponíveis baseado nos logs de sistema';


--
-- Name: monitor_data_growth(); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.monitor_data_growth() RETURNS TABLE(schema_name text, object_name text, object_type text, size_mb numeric, estimated_rows bigint, avg_row_size_bytes integer, last_vacuum timestamp without time zone, last_analyze timestamp without time zone, bloat_ratio numeric, recommendation text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        n.nspname::TEXT as schema_name,
        c.relname::TEXT as object_name,
        CASE c.relkind
            WHEN 'r' THEN 'TABLE'
            WHEN 'm' THEN 'MATERIALIZED_VIEW'
            WHEN 'v' THEN 'VIEW'
        END as object_type,
        ROUND(pg_total_relation_size(c.oid) / (1024.0 * 1024.0), 2) as size_mb,
        s.n_tup_ins + s.n_tup_upd + s.n_tup_del as estimated_rows,
        CASE
            WHEN s.n_tup_ins + s.n_tup_upd + s.n_tup_del > 0
            THEN (pg_total_relation_size(c.oid) / (s.n_tup_ins + s.n_tup_upd + s.n_tup_del))::INTEGER
            ELSE 0
        END as avg_row_size_bytes,
        s.last_vacuum,
        s.last_analyze,
        CASE
            WHEN s.n_tup_ins + s.n_tup_upd + s.n_tup_del > 0
            THEN ROUND((s.n_dead_tup::NUMERIC / (s.n_tup_ins + s.n_tup_upd + s.n_tup_del)::NUMERIC) * 100, 2)
            ELSE 0
        END as bloat_ratio,
        CASE
            WHEN s.last_analyze < CURRENT_TIMESTAMP - INTERVAL '7 days' THEN 'PRECISA ANALYZE'
            WHEN s.last_vacuum < CURRENT_TIMESTAMP - INTERVAL '7 days' THEN 'PRECISA VACUUM'
            WHEN (s.n_dead_tup::NUMERIC / NULLIF(s.n_tup_ins + s.n_tup_upd + s.n_tup_del, 0)::NUMERIC) > 0.1 THEN 'ALTO BLOAT'
            ELSE 'OK'
        END as recommendation
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    LEFT JOIN pg_stat_user_tables s ON s.relid = c.oid
    WHERE n.nspname IN ('bronze', 'silver', 'gold', 'system')
        AND c.relkind IN ('r', 'm')
    ORDER BY size_mb DESC;
END;
$$;


--
-- Name: FUNCTION monitor_data_growth(); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.monitor_data_growth() IS 'Monitora crescimento de tabelas e views materializadas';


--
-- Name: monitor_slow_queries(numeric); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.monitor_slow_queries(min_duration_seconds numeric DEFAULT 1.0) RETURNS TABLE(query_text text, state text, duration_seconds numeric, rows_affected bigint, client_info text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Versão alternativa usando pg_stat_activity para queries em execução
    RETURN QUERY
    SELECT
        LEFT(a.query, 200) as query_text,
        a.state,
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - a.query_start)) as duration_seconds,
        0::BIGINT as rows_affected, -- Não disponível sem pg_stat_statements
        a.application_name || ' (' || a.client_addr || ')' as client_info
    FROM pg_stat_activity a
    WHERE a.state != 'idle'
        AND a.query IS NOT NULL
        AND a.query NOT LIKE '%pg_stat_%'
        AND a.query NOT LIKE '%monitor_%'
        AND EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - a.query_start)) >= min_duration_seconds
    ORDER BY duration_seconds DESC;
END;
$$;


--
-- Name: FUNCTION monitor_slow_queries(min_duration_seconds numeric); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.monitor_slow_queries(min_duration_seconds numeric) IS 'Identifica queries que executam acima do tempo especificado (padrão: 1 segundo)';


--
-- Name: refresh_all_datawarehouse_views(); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.refresh_all_datawarehouse_views() RETURNS TABLE(view_name text, result text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    view_record RECORD;
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    total_duration INTERVAL;
BEGIN
    start_time := clock_timestamp();

    RAISE NOTICE '=== Iniciando refresh completo do Data Warehouse ===';

    -- Refresh em ordem de dependência:
    -- 1. SILVER (core)
    -- 2. SILVER (outras views)
    -- 3. GOLD (views especializadas)

    -- FASE 1: Views SILVER
    RAISE NOTICE 'FASE 1: Atualizando views SILVER...';

    SELECT 'silver.rpt_sienge_core' as name, refresh_materialized_view('silver', 'rpt_sienge_core') as result
    INTO view_name, result;
    RETURN NEXT;

    SELECT 'silver.rpt_sienge_financeiro' as name, refresh_materialized_view('silver', 'rpt_sienge_financeiro') as result
    INTO view_name, result;
    RETURN NEXT;

    SELECT 'silver.rpt_sienge_clientes' as name, refresh_materialized_view('silver', 'rpt_sienge_clientes') as result
    INTO view_name, result;
    RETURN NEXT;

    SELECT 'silver.rpt_sienge_contratos' as name, refresh_materialized_view('silver', 'rpt_sienge_contratos') as result
    INTO view_name, result;
    RETURN NEXT;

    SELECT 'silver.rpt_sienge_empreendimentos' as name, refresh_materialized_view('silver', 'rpt_sienge_empreendimentos') as result
    INTO view_name, result;
    RETURN NEXT;

    SELECT 'silver.rpt_sienge_unidades' as name, refresh_materialized_view('silver', 'rpt_sienge_unidades') as result
    INTO view_name, result;
    RETURN NEXT;

    -- FASE 2: Views GOLD (dependem das SILVER)
    RAISE NOTICE 'FASE 2: Atualizando views GOLD...';

    SELECT 'gold.vendas_360' as name, refresh_materialized_view('gold', 'vendas_360') as result
    INTO view_name, result;
    RETURN NEXT;

    SELECT 'gold.clientes_360' as name, refresh_materialized_view('gold', 'clientes_360') as result
    INTO view_name, result;
    RETURN NEXT;

    SELECT 'gold.portfolio_imobiliario' as name, refresh_materialized_view('gold', 'portfolio_imobiliario') as result
    INTO view_name, result;
    RETURN NEXT;

    SELECT 'gold.performance_financeira' as name, refresh_materialized_view('gold', 'performance_financeira') as result
    INTO view_name, result;
    RETURN NEXT;

    -- Calcula duração total
    end_time := clock_timestamp();
    total_duration := end_time - start_time;

    RAISE NOTICE '=== Refresh completo finalizado em % ===', total_duration;

    -- Retorna resumo final
    SELECT 'RESUMO_FINAL' as name,
           format('Refresh completo executado em %s', total_duration) as result
    INTO view_name, result;
    RETURN NEXT;

END;
$$;


--
-- Name: FUNCTION refresh_all_datawarehouse_views(); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.refresh_all_datawarehouse_views() IS 'Atualiza todas as views materializadas do Data Warehouse na ordem correta de dependências';


--
-- Name: refresh_materialized_view(text, text); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.refresh_materialized_view(schema_name text, view_name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    duration INTERVAL;
    rows_affected BIGINT;
    result_message TEXT;
    full_view_name TEXT;
BEGIN
    start_time := clock_timestamp();
    full_view_name := schema_name || '.' || view_name;

    -- Log início do refresh
    RAISE NOTICE 'Iniciando refresh da view: %', full_view_name;

    -- Tenta refresh concorrente primeiro, depois normal se falhar
    BEGIN
        EXECUTE format('REFRESH MATERIALIZED VIEW CONCURRENTLY %I.%I', schema_name, view_name);
        RAISE NOTICE 'Refresh CONCORRENTE executado com sucesso para %', full_view_name;
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'Refresh concorrente falhou, tentando refresh normal para %', full_view_name;
        EXECUTE format('REFRESH MATERIALIZED VIEW %I.%I', schema_name, view_name);
        RAISE NOTICE 'Refresh NORMAL executado com sucesso para %', full_view_name;
    END;

    -- Calcula métricas
    end_time := clock_timestamp();
    duration := end_time - start_time;

    -- Conta registros na view
    EXECUTE format('SELECT count(*) FROM %I.%I', schema_name, view_name) INTO rows_affected;

    result_message := format(
        'View %s atualizada com sucesso. Duração: %s, Registros: %s',
        full_view_name,
        duration,
        rows_affected
    );

    -- Log resultado
    RAISE NOTICE '%', result_message;

    -- Insere log na tabela de sistema (se existir)
    BEGIN
        INSERT INTO system.sync_logs (
            "entityType",
            "syncStartedAt",
            "syncCompletedAt",
            "recordsProcessed",
            "status"
        ) VALUES (
            'REFRESH_VIEW_' || full_view_name,
            start_time,
            end_time,
            rows_affected::INTEGER,
            'success'
        );
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'Aviso: Não foi possível inserir log em system.sync_logs';
    END;

    RETURN result_message;

EXCEPTION WHEN others THEN
    end_time := clock_timestamp();
    duration := end_time - start_time;

    result_message := format(
        'Erro ao atualizar view %s: %s (Duração: %s)',
        full_view_name,
        SQLERRM,
        duration
    );

    -- Log erro
    RAISE NOTICE '%', result_message;

    -- Insere log de erro (se possível)
    BEGIN
        INSERT INTO system.sync_logs (
            "entityType",
            "syncStartedAt",
            "syncCompletedAt",
            "recordsProcessed",
            "status",
            "errorMessage"
        ) VALUES (
            'REFRESH_VIEW_' || full_view_name,
            start_time,
            end_time,
            0,
            'error',
            SQLERRM
        );
    EXCEPTION WHEN others THEN
        -- Ignora erro de log
        NULL;
    END;

    RETURN result_message;
END;
$$;


--
-- Name: FUNCTION refresh_materialized_view(schema_name text, view_name text); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.refresh_materialized_view(schema_name text, view_name text) IS 'Atualiza uma view materializada específica com logging detalhado';


--
-- Name: smart_refresh_views(integer); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.smart_refresh_views(max_age_hours integer DEFAULT 24) RETURNS TABLE(view_name text, action text, reason text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    view_record RECORD;
    needs_refresh BOOLEAN;
    age_hours NUMERIC;
BEGIN
    RAISE NOTICE 'Verificando quais views precisam de refresh (max age: % horas)', max_age_hours;

    FOR view_record IN
        SELECT * FROM check_materialized_views_status()
    LOOP
        needs_refresh := FALSE;

        -- Calcula idade em horas
        age_hours := EXTRACT(EPOCH FROM (now() - view_record.last_refresh)) / 3600.0;

        -- Verifica condições para refresh
        IF NOT view_record.is_populated THEN
            needs_refresh := TRUE;
            SELECT view_record.schema_name||'.'||view_record.view_name as name,
                   'REFRESH' as act,
                   'View não está populada' as reas
            INTO view_name, action, reason;

        ELSIF age_hours > max_age_hours THEN
            needs_refresh := TRUE;
            SELECT view_record.schema_name||'.'||view_record.view_name as name,
                   'REFRESH' as act,
                   format('View com %s horas (limite: %s)', ROUND(age_hours, 1), max_age_hours) as reas
            INTO view_name, action, reason;

        ELSE
            SELECT view_record.schema_name||'.'||view_record.view_name as name,
                   'SKIP' as act,
                   format('View atualizada há %s horas', ROUND(age_hours, 1)) as reas
            INTO view_name, action, reason;
        END IF;

        RETURN NEXT;

        -- Executa refresh se necessário
        IF needs_refresh THEN
            PERFORM refresh_materialized_view(view_record.schema_name, view_record.view_name);
        END IF;

    END LOOP;
END;
$$;


--
-- Name: FUNCTION smart_refresh_views(max_age_hours integer); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.smart_refresh_views(max_age_hours integer) IS 'Executa refresh inteligente apenas das views que estão desatualizadas além do limite especificado';


--
-- Name: verify_restore_integrity(); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.verify_restore_integrity() RETURNS TABLE(check_type text, schema_name text, object_name text, status text, details text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    rec RECORD;
    row_count BIGINT;
BEGIN
    -- Verifica se todos os schemas existem
    FOR rec IN
        SELECT unnest(ARRAY['bronze', 'silver', 'gold', 'system', 'staging']) as schema
    LOOP
        IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = rec.schema) THEN
            SELECT 'SCHEMA_EXISTS', rec.schema, '', 'OK', 'Schema presente'
            INTO check_type, schema_name, object_name, status, details;
        ELSE
            SELECT 'SCHEMA_EXISTS', rec.schema, '', 'ERROR', 'Schema ausente'
            INTO check_type, schema_name, object_name, status, details;
        END IF;
        RETURN NEXT;
    END LOOP;

    -- Verifica views materializadas
    FOR rec IN
        SELECT schemaname, matviewname, ispopulated
        FROM pg_matviews
        WHERE schemaname IN ('silver', 'gold')
    LOOP
        IF rec.ispopulated THEN
            SELECT 'MATVIEW_STATUS', rec.schemaname, rec.matviewname, 'OK', 'View populada'
            INTO check_type, schema_name, object_name, status, details;
        ELSE
            SELECT 'MATVIEW_STATUS', rec.schemaname, rec.matviewname, 'WARNING', 'View não populada'
            INTO check_type, schema_name, object_name, status, details;
        END IF;
        RETURN NEXT;
    END LOOP;

    -- Verifica contagem de registros nas tabelas principais
    FOR rec IN
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname = 'bronze'
        AND tablename IN ('clientes', 'contratos_venda', 'unidades', 'empreendimentos')
    LOOP
        EXECUTE format('SELECT count(*) FROM %I.%I', rec.schemaname, rec.tablename) INTO row_count;

        IF row_count > 0 THEN
            SELECT 'TABLE_DATA', rec.schemaname, rec.tablename, 'OK', row_count::TEXT || ' registros'
            INTO check_type, schema_name, object_name, status, details;
        ELSE
            SELECT 'TABLE_DATA', rec.schemaname, rec.tablename, 'WARNING', 'Tabela vazia'
            INTO check_type, schema_name, object_name, status, details;
        END IF;
        RETURN NEXT;
    END LOOP;

    -- Verifica functions essenciais
    FOR rec IN
        SELECT 'refresh_materialized_view' as func_name
        UNION SELECT 'datawarehouse_health_check'
        UNION SELECT 'check_materialized_views_status'
    LOOP
        IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = rec.func_name) THEN
            SELECT 'FUNCTION_EXISTS', 'public', rec.func_name, 'OK', 'Function disponível'
            INTO check_type, schema_name, object_name, status, details;
        ELSE
            SELECT 'FUNCTION_EXISTS', 'public', rec.func_name, 'ERROR', 'Function ausente'
            INTO check_type, schema_name, object_name, status, details;
        END IF;
        RETURN NEXT;
    END LOOP;

END;
$$;


--
-- Name: FUNCTION verify_restore_integrity(); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.verify_restore_integrity() IS 'Verifica integridade após processo de restore, validando schemas, views e dados';


--
-- Name: weekly_performance_report(); Type: FUNCTION; Schema: bronze; Owner: -
--

CREATE FUNCTION bronze.weekly_performance_report() RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    report TEXT := '';
    rec RECORD;
    total_views INTEGER;
    avg_size_mb NUMERIC;
    total_refreshes INTEGER;
BEGIN
    report := E'=== RELATÓRIO SEMANAL DE PERFORMANCE ===\n';
    report := report || 'Data: ' || CURRENT_TIMESTAMP || E'\n\n';

    -- Estatísticas gerais
    SELECT COUNT(*), AVG(size_mb)
    INTO total_views, avg_size_mb
    FROM check_materialized_views_status();

    SELECT COUNT(*)
    INTO total_refreshes
    FROM system.sync_logs
    WHERE "entityType" LIKE 'REFRESH_VIEW_%'
        AND "syncStartedAt" >= CURRENT_TIMESTAMP - INTERVAL '7 days';

    report := report || 'ESTATÍSTICAS GERAIS:' || E'\n';
    report := report || '- Views Materializadas: ' || total_views || E'\n';
    report := report || '- Tamanho Médio: ' || ROUND(avg_size_mb, 2) || ' MB' || E'\n';
    report := report || '- Refreshes na Semana: ' || total_refreshes || E'\n\n';

    -- Health Check
    report := report || 'HEALTH CHECK:' || E'\n';
    FOR rec IN SELECT * FROM datawarehouse_health_check() LOOP
        report := report || '- ' || rec.component || ': ' || rec.status || ' (' || rec.value || ')' || E'\n';
    END LOOP;

    report := report || E'\n';

    -- Top queries lentas
    report := report || 'TOP 5 QUERIES LENTAS:' || E'\n';
    FOR rec IN
        SELECT * FROM monitor_slow_queries(0.5) LIMIT 5
    LOOP
        report := report || '- ' || ROUND(rec.avg_time_ms, 2) || 'ms: ' || LEFT(rec.query_text, 80) || E'\n';
    END LOOP;

    report := report || E'\n=== FIM DO RELATÓRIO ===';

    RETURN report;
END;
$$;


--
-- Name: FUNCTION weekly_performance_report(); Type: COMMENT; Schema: bronze; Owner: -
--

COMMENT ON FUNCTION bronze.weekly_performance_report() IS 'Gera relatório semanal de performance em formato texto';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: centro_custos; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.centro_custos (
    id integer NOT NULL,
    nome text NOT NULL,
    cnpj text,
    empresa_id integer,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    building_sectors jsonb,
    available_accounts jsonb
);


--
-- Name: cliente_contatos; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.cliente_contatos (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    ordem_contato integer NOT NULL,
    nome text,
    telefone text,
    email text,
    tipo text,
    observacao text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: cliente_contatos_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.cliente_contatos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cliente_contatos_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.cliente_contatos_id_seq OWNED BY bronze.cliente_contatos.id;


--
-- Name: cliente_enderecos; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.cliente_enderecos (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    ordem_endereco integer NOT NULL,
    tipo text,
    logradouro text,
    numero text,
    complemento text,
    bairro text,
    cidade text,
    estado text,
    cep text,
    codigo_cidade integer,
    endereco_correspondencia boolean DEFAULT false,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: cliente_enderecos_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.cliente_enderecos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cliente_enderecos_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.cliente_enderecos_id_seq OWNED BY bronze.cliente_enderecos.id;


--
-- Name: cliente_procuradores; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.cliente_procuradores (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    ordem_procurador integer NOT NULL,
    nome text,
    cpf text,
    tipo text,
    observacao text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: cliente_procuradores_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.cliente_procuradores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cliente_procuradores_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.cliente_procuradores_id_seq OWNED BY bronze.cliente_procuradores.id;


--
-- Name: cliente_renda_familiar; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.cliente_renda_familiar (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    ordem_renda integer NOT NULL,
    nome_parente text,
    parentesco text,
    valor_renda numeric(65,30),
    observacao text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: cliente_renda_familiar_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.cliente_renda_familiar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cliente_renda_familiar_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.cliente_renda_familiar_id_seq OWNED BY bronze.cliente_renda_familiar.id;


--
-- Name: cliente_subtipos; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.cliente_subtipos (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    ordem_subtipo integer NOT NULL,
    subtipo text,
    descricao text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: cliente_subtipos_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.cliente_subtipos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cliente_subtipos_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.cliente_subtipos_id_seq OWNED BY bronze.cliente_subtipos.id;


--
-- Name: cliente_telefones; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.cliente_telefones (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    ordem_telefone integer NOT NULL,
    tipo text,
    numero text,
    codigo_pais text,
    principal boolean DEFAULT false,
    observacao text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: cliente_telefones_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.cliente_telefones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cliente_telefones_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.cliente_telefones_id_seq OWNED BY bronze.cliente_telefones.id;


--
-- Name: clientes; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.clientes (
    "idCliente" integer NOT NULL,
    name text NOT NULL,
    "nomeSocial" text,
    "cpfCnpj" text,
    rg text,
    "dataNascimento" timestamp(3) without time zone,
    nacionalidade text,
    email text,
    ativo boolean DEFAULT true NOT NULL,
    "dataCadastro" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    foreigner text,
    sex text,
    "birthPlace" text,
    "dataAtualizacao" timestamp(3) without time zone,
    "fatherName" text,
    "motherName" text,
    "personType" text,
    phones jsonb,
    addresses jsonb,
    telefone_principal text,
    telefone_principal_tipo text,
    total_telefones integer DEFAULT 0,
    endereco_principal text,
    cidade_principal text,
    estado_principal text,
    cep_principal text,
    total_enderecos integer DEFAULT 0,
    tem_conjuge boolean DEFAULT false,
    nome_conjuge text,
    cpf_conjuge text,
    procurators jsonb,
    contacts jsonb,
    spouse jsonb,
    "familyIncome" jsonb,
    "subTypes" jsonb,
    "tradingName" text,
    "corporateName" text,
    "internalCode" text,
    cnpj text,
    "civilStatus" text,
    profession text,
    "maritalStatus" jsonb
);


--
-- Name: contrato_clientes; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.contrato_clientes (
    id integer NOT NULL,
    contrato_id integer NOT NULL,
    cliente_sienge_id integer NOT NULL,
    nome text NOT NULL,
    is_main boolean DEFAULT false NOT NULL,
    is_spouse boolean DEFAULT false NOT NULL,
    participacao_percentual numeric(65,30),
    ordem_no_contrato integer DEFAULT 1 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: contrato_clientes_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.contrato_clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contrato_clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.contrato_clientes_id_seq OWNED BY bronze.contrato_clientes.id;


--
-- Name: contrato_condicoes_pagamento; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.contrato_condicoes_pagamento (
    id integer NOT NULL,
    contrato_id integer NOT NULL,
    ordem_condicao integer NOT NULL,
    tipo_condicao_id text,
    tipo_condicao_nome text,
    sequence_id integer,
    order_number integer,
    indexador_id integer,
    indexador_nome text,
    valor_total numeric(65,30),
    valor_pago numeric(65,30),
    saldo_devedor numeric(65,30),
    valor_total_juros numeric(65,30),
    numero_parcelas integer,
    parcelas_abertas integer,
    data_primeiro_pagamento timestamp(3) without time zone,
    data_base timestamp(3) without time zone,
    data_base_juros timestamp(3) without time zone,
    percentual_juros numeric(65,30),
    tipo_juros text,
    periodo_carencia_meses integer,
    status text,
    status_condicao text,
    pago_antes_aditivo boolean,
    portador_id integer,
    portador_nome text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: contrato_condicoes_pagamento_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.contrato_condicoes_pagamento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contrato_condicoes_pagamento_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.contrato_condicoes_pagamento_id_seq OWNED BY bronze.contrato_condicoes_pagamento.id;


--
-- Name: contrato_unidades; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.contrato_unidades (
    id integer NOT NULL,
    contrato_id integer NOT NULL,
    unidade_sienge_id integer NOT NULL,
    nome text NOT NULL,
    is_main boolean DEFAULT false NOT NULL,
    participacao_percentual numeric(65,30),
    tipo_unidade text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: contrato_unidades_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.contrato_unidades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contrato_unidades_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.contrato_unidades_id_seq OWNED BY bronze.contrato_unidades.id;


--
-- Name: contratos_suprimento; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.contratos_suprimento (
    id integer NOT NULL,
    documento_id text,
    numero_contrato text NOT NULL,
    fornecedor_id integer,
    cliente_id integer,
    empresa_id integer,
    empresa_nome text,
    responsavel_id text,
    responsavel_nome text,
    status text,
    status_id text,
    status_aprovacao text,
    autorizado boolean DEFAULT false NOT NULL,
    data_contrato timestamp(3) without time zone,
    data_inicio timestamp(3) without time zone,
    data_fim timestamp(3) without time zone,
    objeto text,
    observacoes_internas text,
    tipo_contrato text,
    tipo_registro text,
    tipo_item text,
    valor_total_mao_obra numeric(15,2),
    valor_total_material numeric(15,2),
    consistente boolean DEFAULT true NOT NULL,
    edificios jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: contratos_suprimento_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.contratos_suprimento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contratos_suprimento_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.contratos_suprimento_id_seq OWNED BY bronze.contratos_suprimento.id;


--
-- Name: contratos_venda; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.contratos_venda (
    id integer NOT NULL,
    "companyId" integer,
    "internalCompanyId" integer,
    "companyName" text,
    "enterpriseId" integer,
    "internalEnterpriseId" integer,
    "enterpriseName" text,
    "receivableBillId" integer,
    "cancellationPayableBillId" integer,
    "contractDate" timestamp(3) without time zone,
    "issueDate" timestamp(3) without time zone,
    "accountingDate" timestamp(3) without time zone,
    "expectedDeliveryDate" timestamp(3) without time zone,
    "keysDeliveredAt" timestamp(3) without time zone,
    number text,
    "externalId" text,
    "correctionType" text,
    situation text,
    "discountType" text,
    "discountPercentage" numeric(65,30),
    value numeric(65,30),
    "totalSellingValue" numeric(65,30),
    "cancellationDate" timestamp(3) without time zone,
    "totalCancellationAmount" numeric(65,30),
    "cancellationReason" text,
    "financialInstitutionNumber" text,
    "financialInstitutionDate" timestamp(3) without time zone,
    "proRataIndexer" integer,
    "interestType" text,
    "interestPercentage" numeric(65,30),
    "fineRate" numeric(65,30),
    "lateInterestCalculationType" text,
    "dailyLateInterestValue" numeric(65,30),
    "containsRemadeInstallments" boolean,
    "specialClause" text,
    "salesContractCustomers" jsonb,
    "salesContractUnits" jsonb,
    "paymentConditions" jsonb,
    brokers jsonb,
    "linkedCommissions" jsonb,
    links jsonb,
    "dataCadastro" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dataAtualizacao" timestamp(3) without time zone,
    cliente_principal_nome text,
    cliente_principal_id integer,
    total_clientes integer,
    cliente_principal_participacao numeric(65,30),
    tipo_contrato_cliente text,
    valor_total_contrato numeric(65,30),
    valor_total_pago numeric(65,30),
    saldo_devedor_total numeric(65,30),
    total_condicoes_pagamento integer,
    total_parcelas_contrato integer,
    parcelas_pagas_contrato integer,
    forma_pagamento_principal text,
    indexador_principal text,
    tem_financiamento boolean,
    percentual_pago numeric(65,30),
    tem_comissao boolean,
    id_contrato_comissao integer,
    total_comissoes integer,
    valor_total_comissao numeric(65,30),
    faixa_valor_comissao text,
    percentual_comissao_sobre_contrato numeric(65,30),
    data_criacao_sienge timestamp(3) without time zone,
    data_ultima_atualizacao_sienge timestamp(3) without time zone
);


--
-- Name: credores; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.credores (
    id integer NOT NULL,
    nome text NOT NULL,
    nome_fantasia text,
    cpf text,
    cnpj text,
    fornecedor text,
    corretor text,
    funcionario text,
    ativo boolean DEFAULT true NOT NULL,
    inscricao_estadual text,
    tipo_inscricao_estadual text,
    tipo_pagamento_id integer,
    endereco_cidade_id integer,
    endereco_cidade_nome text,
    endereco_rua text,
    endereco_numero text,
    endereco_complemento text,
    endereco_bairro text,
    endereco_estado text,
    endereco_cep text,
    telefones jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: empreendimentos; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.empreendimentos (
    id integer NOT NULL,
    nome text NOT NULL,
    "nomeComercial" text,
    "observacaoEmpreendimento" text,
    cnpj text,
    tipo text,
    endereco text,
    "dataCadastro" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dataAtualizacao" timestamp(3) without time zone,
    "criadoPor" text,
    "modificadoPor" text,
    "idEmpresa" integer,
    "nomeEmpresa" text,
    "idBaseCustos" integer,
    "descricaoBaseCustos" text,
    "idTipoObra" integer,
    "descricaoTipoObra" text
);


--
-- Name: empresas; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.empresas (
    "idEmpresa" integer NOT NULL,
    "nomeEmpresa" text NOT NULL,
    cnpj text
);


--
-- Name: extrato_apropriacoes; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.extrato_apropriacoes (
    id integer NOT NULL,
    extrato_conta_id integer NOT NULL,
    centro_custo_id integer,
    plano_financeiro_id text,
    percentual numeric(5,2),
    valor_apropriado numeric(15,2),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: extrato_apropriacoes_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.extrato_apropriacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: extrato_apropriacoes_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.extrato_apropriacoes_id_seq OWNED BY bronze.extrato_apropriacoes.id;


--
-- Name: extrato_contas; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.extrato_contas (
    id integer NOT NULL,
    valor numeric(15,2),
    data timestamp(3) without time zone NOT NULL,
    numero_documento text,
    descricao text,
    documento_id text,
    tipo text,
    data_reconciliacao timestamp(3) without time zone,
    titulo_id integer,
    numero_parcela integer,
    origem_extrato text,
    tipo_extrato text,
    observacoes_extrato text,
    categorias_orcamentarias jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    empresa_id integer,
    conta_id integer,
    centro_custo_id integer,
    plano_financeiro_id text,
    saldo numeric(15,2),
    conciliado boolean DEFAULT false NOT NULL,
    referencia text,
    beneficiario text,
    tags jsonb
);


--
-- Name: planos_financeiros; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.planos_financeiros (
    id text NOT NULL,
    nome text NOT NULL,
    tipo_conta text,
    fl_redutora text,
    fl_ativa text,
    fl_adiantamento text,
    fl_imposto text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    CONSTRAINT planos_financeiros_fl_adiantamento_check CHECK ((fl_adiantamento = ANY ((ARRAY['S'::bpchar, 'N'::bpchar])::text[]))),
    CONSTRAINT planos_financeiros_fl_ativa_check CHECK ((fl_ativa = ANY ((ARRAY['S'::bpchar, 'N'::bpchar])::text[]))),
    CONSTRAINT planos_financeiros_fl_imposto_check CHECK ((fl_imposto = ANY ((ARRAY['S'::bpchar, 'N'::bpchar])::text[]))),
    CONSTRAINT planos_financeiros_fl_redutora_check CHECK ((fl_redutora = ANY ((ARRAY['S'::bpchar, 'N'::bpchar])::text[]))),
    CONSTRAINT planos_financeiros_tipo_conta_check CHECK ((tipo_conta = ANY (ARRAY[('T'::bpchar)::text, ('R'::bpchar)::text, ('M'::bpchar)::text])))
);


--
-- Name: portadores; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.portadores (
    id integer NOT NULL,
    nome text NOT NULL
);


--
-- Name: titulos_pagar; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.titulos_pagar (
    id integer NOT NULL,
    devedor_id integer,
    credor_id integer,
    documento_identificacao_id text,
    numero_documento text,
    data_emissao timestamp(3) without time zone,
    numero_parcelas integer,
    valor_total_nota numeric(15,2),
    observacoes text,
    desconto numeric(15,2),
    status text,
    origem_id text,
    usuario_cadastro_id text,
    usuario_cadastro_nome text,
    data_cadastro timestamp(3) without time zone,
    usuario_alteracao_id text,
    usuario_alteracao_nome text,
    data_alteracao timestamp(3) without time zone,
    numero_chave_acesso text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: unidade_agrupamentos; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.unidade_agrupamentos (
    id integer NOT NULL,
    unidade_id integer NOT NULL,
    ordem_agrupamento integer NOT NULL,
    tipo_agrupamento text,
    nome_agrupamento text,
    descricao_agrupamento text,
    codigo_agrupamento text,
    nivel_hierarquia integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: unidade_agrupamentos_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.unidade_agrupamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unidade_agrupamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.unidade_agrupamentos_id_seq OWNED BY bronze.unidade_agrupamentos.id;


--
-- Name: unidade_filhas; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.unidade_filhas (
    id integer NOT NULL,
    unidade_pai_id integer NOT NULL,
    ordem_filha integer NOT NULL,
    unidade_filha_id integer,
    nome_unidade_filha text,
    tipo_unidade_filha text,
    area_unidade_filha numeric(65,30),
    status_unidade_filha text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: unidade_filhas_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.unidade_filhas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unidade_filhas_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.unidade_filhas_id_seq OWNED BY bronze.unidade_filhas.id;


--
-- Name: unidade_links; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.unidade_links (
    id integer NOT NULL,
    unidade_id integer NOT NULL,
    ordem_link integer NOT NULL,
    rel text,
    href text,
    tipo_link text,
    descricao_link text,
    ativo boolean DEFAULT true,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: unidade_links_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.unidade_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unidade_links_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.unidade_links_id_seq OWNED BY bronze.unidade_links.id;


--
-- Name: unidade_valores_especiais; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.unidade_valores_especiais (
    id integer NOT NULL,
    unidade_id integer NOT NULL,
    ordem_valor integer NOT NULL,
    tipo_valor text,
    nome_valor text,
    valor_monetario numeric(65,30),
    moeda text DEFAULT 'BRL'::character varying,
    descricao_valor text,
    data_referencia timestamp(3) without time zone,
    status_valor text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: unidade_valores_especiais_id_seq; Type: SEQUENCE; Schema: bronze; Owner: -
--

CREATE SEQUENCE bronze.unidade_valores_especiais_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unidade_valores_especiais_id_seq; Type: SEQUENCE OWNED BY; Schema: bronze; Owner: -
--

ALTER SEQUENCE bronze.unidade_valores_especiais_id_seq OWNED BY bronze.unidade_valores_especiais.id;


--
-- Name: unidades; Type: TABLE; Schema: bronze; Owner: -
--

CREATE TABLE bronze.unidades (
    id integer NOT NULL,
    "idEmpreendimento" integer,
    "idContrato" integer,
    "idIndexador" integer,
    nome text NOT NULL,
    "tipoImovel" text,
    observacao text,
    "estoqueComercial" text,
    latitude text,
    longitude text,
    matricula text,
    "dataEntrega" timestamp(3) without time zone,
    "areaPrivativa" numeric(65,30),
    "areaComum" numeric(65,30),
    "areaTerreno" numeric(65,30),
    "areaComumNaoProporcional" numeric(65,30),
    "fracaoIdeal" numeric(65,30),
    "fracaoIdealM2" numeric(65,30),
    "fracaoVGV" numeric(65,30),
    "quantidadeIndexada" numeric(65,30),
    "adimplenciaPremiada" numeric(65,30),
    "valorTerreno" numeric(65,30),
    pavimento text,
    "numeroContrato" text,
    "areaUtil" numeric(65,30),
    "valorIPTU" numeric(65,30),
    "inscricaoImobiliaria" text,
    "dataCadastro" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dataAtualizacao" timestamp(3) without time zone,
    childunits jsonb,
    groupings jsonb,
    specialvalues jsonb,
    links jsonb,
    total_unidades_filhas integer DEFAULT 0,
    principal_unidade_filha text,
    principal_unidade_filha_id integer,
    total_agrupamentos integer DEFAULT 0,
    agrupamento_principal text,
    tipo_agrupamento_principal text,
    total_valores_especiais integer DEFAULT 0,
    valor_especial_total numeric(65,30) DEFAULT 0,
    tipo_valor_especial_principal text,
    total_links integer DEFAULT 0,
    link_principal_tipo text,
    link_principal_url text,
    "scheduledDeliveryDate" timestamp(3) without time zone
);


--
-- Name: rpt_sienge_contratos; Type: MATERIALIZED VIEW; Schema: silver; Owner: -
--

CREATE MATERIALIZED VIEW silver.rpt_sienge_contratos AS
 SELECT 'contratos'::text AS domain_type,
    (cv.id)::text AS unique_id,
    COALESCE(cv."contractDate", cv."issueDate") AS data_principal,
    EXTRACT(year FROM COALESCE(cv."contractDate", cv."issueDate")) AS ano,
    EXTRACT(month FROM COALESCE(cv."contractDate", cv."issueDate")) AS mes,
    to_char(COALESCE(cv."contractDate", cv."issueDate"), 'YYYY-MM'::text) AS ano_mes,
    cv.id AS contrato_id,
    TRIM(BOTH FROM COALESCE(cv.number, ''::text)) AS numero_contrato,
    TRIM(BOTH FROM COALESCE(cv."externalId", ''::text)) AS id_externo,
    TRIM(BOTH FROM COALESCE(cv.situation, ''::text)) AS situacao,
    cv."companyId" AS empresa_id,
    cv."internalCompanyId" AS empresa_interna_id,
    TRIM(BOTH FROM COALESCE(cv."companyName", ''::text)) AS empresa_nome,
    cv."enterpriseId" AS empreendimento_id,
    cv."internalEnterpriseId" AS empreendimento_interno_id,
    TRIM(BOTH FROM COALESCE(cv."enterpriseName", ''::text)) AS empreendimento_nome,
        CASE
            WHEN ((cv."contractDate" IS NULL) OR (cv."contractDate" < '1900-01-01'::date)) THEN NULL::timestamp without time zone
            ELSE cv."contractDate"
        END AS data_contrato,
        CASE
            WHEN ((cv."issueDate" IS NULL) OR (cv."issueDate" < '1900-01-01'::date)) THEN NULL::timestamp without time zone
            ELSE cv."issueDate"
        END AS data_emissao,
        CASE
            WHEN ((cv."accountingDate" IS NULL) OR (cv."accountingDate" < '1900-01-01'::date)) THEN NULL::timestamp without time zone
            ELSE cv."accountingDate"
        END AS data_contabilizacao,
        CASE
            WHEN ((cv."expectedDeliveryDate" IS NULL) OR (cv."expectedDeliveryDate" < '1900-01-01'::date)) THEN NULL::timestamp without time zone
            ELSE cv."expectedDeliveryDate"
        END AS data_entrega_prevista,
        CASE
            WHEN ((cv."keysDeliveredAt" IS NULL) OR (cv."keysDeliveredAt" < '1900-01-01'::date)) THEN NULL::timestamp without time zone
            ELSE cv."keysDeliveredAt"
        END AS data_entrega_chaves,
        CASE
            WHEN ((cv."cancellationDate" IS NULL) OR (cv."cancellationDate" < '1900-01-01'::date)) THEN NULL::timestamp without time zone
            ELSE cv."cancellationDate"
        END AS data_cancelamento,
        CASE
            WHEN ((cv.value IS NULL) OR (cv.value < (0)::numeric)) THEN NULL::numeric
            ELSE cv.value
        END AS valor_contrato,
        CASE
            WHEN ((cv."totalSellingValue" IS NULL) OR (cv."totalSellingValue" < (0)::numeric)) THEN NULL::numeric
            ELSE cv."totalSellingValue"
        END AS valor_venda_total,
        CASE
            WHEN ((cv."totalCancellationAmount" IS NULL) OR (cv."totalCancellationAmount" < (0)::numeric)) THEN NULL::numeric
            ELSE cv."totalCancellationAmount"
        END AS valor_cancelamento,
    TRIM(BOTH FROM COALESCE(cv."correctionType", ''::text)) AS tipo_correcao,
    TRIM(BOTH FROM COALESCE(cv."discountType", ''::text)) AS tipo_desconto,
        CASE
            WHEN ((cv."discountPercentage" IS NULL) OR (cv."discountPercentage" < (0)::numeric) OR (cv."discountPercentage" > (100)::numeric)) THEN NULL::numeric
            ELSE cv."discountPercentage"
        END AS percentual_desconto,
    TRIM(BOTH FROM COALESCE(cv."interestType", ''::text)) AS tipo_juros,
        CASE
            WHEN ((cv."interestPercentage" IS NULL) OR (cv."interestPercentage" < (0)::numeric)) THEN NULL::numeric
            ELSE cv."interestPercentage"
        END AS percentual_juros,
        CASE
            WHEN ((cv."fineRate" IS NULL) OR (cv."fineRate" < (0)::numeric)) THEN NULL::numeric
            ELSE cv."fineRate"
        END AS taxa_multa,
    TRIM(BOTH FROM COALESCE(cv."financialInstitutionNumber", ''::text)) AS numero_instituicao_financeira,
        CASE
            WHEN ((cv."financialInstitutionDate" IS NULL) OR (cv."financialInstitutionDate" < '1900-01-01'::date)) THEN NULL::timestamp without time zone
            ELSE cv."financialInstitutionDate"
        END AS data_instituicao_financeira,
    cv."proRataIndexer" AS indexador_pro_rata,
    COALESCE(cv."containsRemadeInstallments", false) AS contem_parcelas_refeitas,
    TRIM(BOTH FROM COALESCE(cv."cancellationReason", ''::text)) AS motivo_cancelamento,
    TRIM(BOTH FROM COALESCE(cv."specialClause", ''::text)) AS clausula_especial,
    TRIM(BOTH FROM COALESCE(cv."lateInterestCalculationType", ''::text)) AS tipo_calculo_juros_atraso,
        CASE
            WHEN ((cv."dailyLateInterestValue" IS NULL) OR (cv."dailyLateInterestValue" < (0)::numeric)) THEN NULL::numeric
            ELSE cv."dailyLateInterestValue"
        END AS valor_juros_diario_atraso,
    TRIM(BOTH FROM COALESCE(cv.cliente_principal_nome, ''::text)) AS cliente_principal_nome,
    cv.cliente_principal_id,
    COALESCE(cv.total_clientes, 0) AS total_clientes,
    cv.cliente_principal_participacao AS participacao_cliente_principal,
    TRIM(BOTH FROM COALESCE(cv.tipo_contrato_cliente, ''::text)) AS tipo_contrato_cliente,
        CASE
            WHEN ((cv.valor_total_contrato IS NULL) OR (cv.valor_total_contrato < (0)::numeric)) THEN NULL::numeric
            ELSE cv.valor_total_contrato
        END AS valor_total_calculado,
        CASE
            WHEN ((cv.valor_total_pago IS NULL) OR (cv.valor_total_pago < (0)::numeric)) THEN NULL::numeric
            ELSE cv.valor_total_pago
        END AS valor_total_pago,
        CASE
            WHEN ((cv.saldo_devedor_total IS NULL) OR (cv.saldo_devedor_total < (0)::numeric)) THEN NULL::numeric
            ELSE cv.saldo_devedor_total
        END AS saldo_devedor,
    COALESCE(cv.total_condicoes_pagamento, 0) AS total_condicoes_pagamento,
    COALESCE(cv.total_parcelas_contrato, 0) AS total_parcelas,
    COALESCE(cv.parcelas_pagas_contrato, 0) AS parcelas_pagas,
    TRIM(BOTH FROM COALESCE(cv.forma_pagamento_principal, ''::text)) AS forma_pagamento_principal,
    TRIM(BOTH FROM COALESCE(cv.indexador_principal, ''::text)) AS indexador_principal,
    COALESCE(cv.tem_financiamento, false) AS tem_financiamento,
        CASE
            WHEN ((cv.percentual_pago IS NULL) OR (cv.percentual_pago < (0)::numeric) OR (cv.percentual_pago > (100)::numeric)) THEN NULL::numeric
            ELSE cv.percentual_pago
        END AS percentual_pago,
    COALESCE(cv.tem_comissao, false) AS tem_comissao,
    cv.id_contrato_comissao,
    COALESCE(cv.total_comissoes, 0) AS total_comissoes,
        CASE
            WHEN ((cv.valor_total_comissao IS NULL) OR (cv.valor_total_comissao < (0)::numeric)) THEN NULL::numeric
            ELSE cv.valor_total_comissao
        END AS valor_total_comissao,
    TRIM(BOTH FROM COALESCE(cv.faixa_valor_comissao, ''::text)) AS faixa_valor_comissao,
        CASE
            WHEN ((cv.percentual_comissao_sobre_contrato IS NULL) OR (cv.percentual_comissao_sobre_contrato < (0)::numeric)) THEN NULL::numeric
            ELSE cv.percentual_comissao_sobre_contrato
        END AS percentual_comissao_sobre_contrato,
        CASE
            WHEN ((cv."salesContractCustomers" IS NULL) OR (jsonb_typeof(cv."salesContractCustomers") <> 'array'::text)) THEN '[]'::jsonb
            ELSE cv."salesContractCustomers"
        END AS clientes_json,
        CASE
            WHEN ((cv."salesContractUnits" IS NULL) OR (jsonb_typeof(cv."salesContractUnits") <> 'array'::text)) THEN '[]'::jsonb
            ELSE cv."salesContractUnits"
        END AS unidades_json,
        CASE
            WHEN ((cv."paymentConditions" IS NULL) OR (jsonb_typeof(cv."paymentConditions") <> 'array'::text)) THEN '[]'::jsonb
            ELSE cv."paymentConditions"
        END AS condicoes_pagamento_json,
        CASE
            WHEN ((cv.brokers IS NULL) OR (jsonb_typeof(cv.brokers) <> 'array'::text)) THEN '[]'::jsonb
            ELSE cv.brokers
        END AS corretores_json,
        CASE
            WHEN ((cv."linkedCommissions" IS NULL) OR (jsonb_typeof(cv."linkedCommissions") <> 'array'::text)) THEN '[]'::jsonb
            ELSE cv."linkedCommissions"
        END AS comissoes_json,
        CASE
            WHEN ((cv.links IS NULL) OR (jsonb_typeof(cv.links) <> 'array'::text)) THEN '[]'::jsonb
            ELSE cv.links
        END AS links_json,
    cv."dataCadastro" AS data_cadastro,
    cv."dataAtualizacao" AS data_atualizacao,
    cv.data_criacao_sienge,
    cv.data_ultima_atualizacao_sienge,
        CASE
            WHEN ((cv.number IS NULL) OR (TRIM(BOTH FROM cv.number) = ''::text)) THEN false
            ELSE true
        END AS tem_numero_valido,
        CASE
            WHEN (cv."contractDate" IS NULL) THEN false
            ELSE true
        END AS tem_data_contrato,
        CASE
            WHEN ((cv.value IS NULL) OR (cv.value <= (0)::numeric)) THEN false
            ELSE true
        END AS tem_valor_valido,
        CASE
            WHEN (cv."companyId" IS NULL) THEN false
            ELSE true
        END AS tem_empresa_valida,
        CASE
            WHEN (cv."enterpriseId" IS NULL) THEN false
            ELSE true
        END AS tem_empreendimento_valido,
        CASE
            WHEN (cv.cliente_principal_id IS NULL) THEN false
            ELSE true
        END AS tem_cliente_principal,
        CASE
            WHEN (cv."cancellationDate" IS NOT NULL) THEN 'Cancelado'::text
            WHEN (cv."keysDeliveredAt" IS NOT NULL) THEN 'Entregue'::text
            WHEN ((cv."expectedDeliveryDate" IS NOT NULL) AND (cv."expectedDeliveryDate" < CURRENT_DATE)) THEN 'Atrasado'::text
            WHEN ((cv."expectedDeliveryDate" IS NOT NULL) AND (cv."expectedDeliveryDate" >= CURRENT_DATE)) THEN 'Em Andamento'::text
            ELSE 'Em Análise'::text
        END AS status_contrato,
        CASE
            WHEN ((cv.value IS NULL) OR (cv.value <= (0)::numeric)) THEN 'Sem Valor'::text
            WHEN (cv.value < (100000)::numeric) THEN 'Baixo'::text
            WHEN (cv.value < (500000)::numeric) THEN 'Médio'::text
            WHEN (cv.value < (1000000)::numeric) THEN 'Alto'::text
            ELSE 'Premium'::text
        END AS categoria_valor,
    (((((((((
        CASE
            WHEN ((cv.number IS NOT NULL) AND (TRIM(BOTH FROM cv.number) <> ''::text)) THEN 1
            ELSE 0
        END +
        CASE
            WHEN (cv."contractDate" IS NOT NULL) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((cv.value IS NOT NULL) AND (cv.value > (0)::numeric)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (cv."companyId" IS NOT NULL) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (cv."enterpriseId" IS NOT NULL) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (cv.cliente_principal_id IS NOT NULL) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (cv."expectedDeliveryDate" IS NOT NULL) THEN 1
            ELSE 0
        END))::numeric * 100.0) / (7)::numeric) AS qualidade_score
   FROM bronze.contratos_venda cv
  ORDER BY COALESCE(cv."contractDate", cv."issueDate") DESC, cv.id
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW rpt_sienge_contratos; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON MATERIALIZED VIEW silver.rpt_sienge_contratos IS 'View Silver de contratos: dados limpos, validados e categorizados com indicadores de qualidade e status';


--
-- Name: COLUMN rpt_sienge_contratos.status_contrato; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_contratos.status_contrato IS 'Status calculado: Cancelado, Entregue, Atrasado, Em Andamento, Em Análise';


--
-- Name: COLUMN rpt_sienge_contratos.categoria_valor; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_contratos.categoria_valor IS 'Categoria por valor: Sem Valor, Baixo (<100k), Médio (100-500k), Alto (500k-1M), Premium (>1M)';


--
-- Name: COLUMN rpt_sienge_contratos.qualidade_score; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_contratos.qualidade_score IS 'Score de qualidade baseado em 7 critérios: número, data, valor, empresa, empreendimento, cliente, entrega (0-100)';


--
-- Name: rpt_sienge_empreendimentos; Type: MATERIALIZED VIEW; Schema: silver; Owner: -
--

CREATE MATERIALIZED VIEW silver.rpt_sienge_empreendimentos AS
 SELECT 'empreendimentos'::text AS domain_type,
    (e.id)::text AS unique_id,
    e."dataCadastro" AS data_principal,
    EXTRACT(year FROM e."dataCadastro") AS ano,
    EXTRACT(month FROM e."dataCadastro") AS mes,
    to_char(e."dataCadastro", 'YYYY-MM'::text) AS ano_mes,
    e.id AS empreendimento_id,
    TRIM(BOTH FROM COALESCE(e.nome, ''::text)) AS empreendimento_nome,
    TRIM(BOTH FROM COALESCE(e."nomeComercial", ''::text)) AS nome_comercial,
    TRIM(BOTH FROM COALESCE(e."observacaoEmpreendimento", ''::text)) AS observacao,
    TRIM(BOTH FROM COALESCE(e.tipo, ''::text)) AS tipo_empreendimento,
    TRIM(BOTH FROM COALESCE(e.endereco, ''::text)) AS endereco,
        CASE
            WHEN ((e.cnpj IS NULL) OR (TRIM(BOTH FROM e.cnpj) = ''::text)) THEN NULL::text
            WHEN (length(regexp_replace(e.cnpj, '[^0-9]'::text, ''::text, 'g'::text)) = 14) THEN regexp_replace(e.cnpj, '[^0-9]'::text, ''::text, 'g'::text)
            ELSE NULL::text
        END AS cnpj_limpo,
        CASE
            WHEN ((e.cnpj IS NOT NULL) AND (TRIM(BOTH FROM e.cnpj) <> ''::text) AND (length(regexp_replace(e.cnpj, '[^0-9]'::text, ''::text, 'g'::text)) = 14)) THEN true
            ELSE false
        END AS tem_cnpj_valido,
    e."idEmpresa" AS empresa_id,
    TRIM(BOTH FROM COALESCE(e."nomeEmpresa", ''::text)) AS empresa_nome,
    e."idBaseCustos" AS base_custos_id,
    TRIM(BOTH FROM COALESCE(e."descricaoBaseCustos", ''::text)) AS base_custos_descricao,
    e."idTipoObra" AS tipo_obra_id,
    TRIM(BOTH FROM COALESCE(e."descricaoTipoObra", ''::text)) AS tipo_obra_descricao,
    e."dataCadastro" AS data_cadastro,
    e."dataAtualizacao" AS data_atualizacao,
    TRIM(BOTH FROM COALESCE(e."criadoPor", ''::text)) AS criado_por,
    TRIM(BOTH FROM COALESCE(e."modificadoPor", ''::text)) AS modificado_por,
    ( SELECT count(*) AS count
           FROM bronze.unidades u
          WHERE (u."idEmpreendimento" = e.id)) AS total_unidades,
    ( SELECT count(DISTINCT cv.id) AS count
           FROM ((bronze.unidades u
             JOIN bronze.contrato_unidades cu ON ((cu.unidade_sienge_id = u.id)))
             JOIN bronze.contratos_venda cv ON ((cv.id = cu.contrato_id)))
          WHERE (u."idEmpreendimento" = e.id)) AS total_contratos,
    ( SELECT COALESCE(sum(u."areaPrivativa"), (0)::numeric) AS "coalesce"
           FROM bronze.unidades u
          WHERE ((u."idEmpreendimento" = e.id) AND (u."areaPrivativa" IS NOT NULL) AND (u."areaPrivativa" > (0)::numeric))) AS area_total_privativa,
    ( SELECT COALESCE(sum(u."valorTerreno"), (0)::numeric) AS "coalesce"
           FROM bronze.unidades u
          WHERE ((u."idEmpreendimento" = e.id) AND (u."valorTerreno" IS NOT NULL) AND (u."valorTerreno" > (0)::numeric))) AS valor_total_estimado,
    ( SELECT min(u."dataEntrega") AS min
           FROM bronze.unidades u
          WHERE ((u."idEmpreendimento" = e.id) AND (u."dataEntrega" IS NOT NULL) AND (u."dataEntrega" >= CURRENT_DATE))) AS proxima_entrega,
    ( SELECT max(u."dataEntrega") AS max
           FROM bronze.unidades u
          WHERE ((u."idEmpreendimento" = e.id) AND (u."dataEntrega" IS NOT NULL))) AS ultima_entrega,
        CASE
            WHEN ((e.tipo IS NULL) OR (TRIM(BOTH FROM e.tipo) = ''::text)) THEN 'Não Definido'::text
            WHEN (lower(e.tipo) ~~ '%residencial%'::text) THEN 'Residencial'::text
            WHEN (lower(e.tipo) ~~ '%comercial%'::text) THEN 'Comercial'::text
            WHEN (lower(e.tipo) ~~ '%misto%'::text) THEN 'Misto'::text
            ELSE 'Outros'::text
        END AS categoria_tipo,
        CASE
            WHEN ((e.nome IS NULL) OR (TRIM(BOTH FROM e.nome) = ''::text)) THEN false
            ELSE true
        END AS tem_nome_valido,
        CASE
            WHEN ((e."nomeComercial" IS NULL) OR (TRIM(BOTH FROM e."nomeComercial") = ''::text)) THEN false
            ELSE true
        END AS tem_nome_comercial,
        CASE
            WHEN ((e.endereco IS NULL) OR (TRIM(BOTH FROM e.endereco) = ''::text)) THEN false
            ELSE true
        END AS tem_endereco_valido,
        CASE
            WHEN (e."idEmpresa" IS NULL) THEN false
            ELSE true
        END AS tem_empresa_vinculada,
        CASE
            WHEN ((e.tipo IS NULL) OR (TRIM(BOTH FROM e.tipo) = ''::text)) THEN false
            ELSE true
        END AS tem_tipo_definido,
        CASE
            WHEN (( SELECT count(*) AS count
               FROM bronze.unidades u
              WHERE (u."idEmpreendimento" = e.id)) = 0) THEN 'Sem Unidades'::text
            WHEN ((( SELECT count(*) AS count
               FROM bronze.unidades u
              WHERE ((u."idEmpreendimento" = e.id) AND (u."dataEntrega" IS NOT NULL) AND (u."dataEntrega" < CURRENT_DATE))) > 0) AND (( SELECT count(*) AS count
               FROM bronze.unidades u
              WHERE ((u."idEmpreendimento" = e.id) AND (u."dataEntrega" IS NOT NULL) AND (u."dataEntrega" >= CURRENT_DATE))) = 0)) THEN 'Entregue'::text
            WHEN (( SELECT count(*) AS count
               FROM bronze.unidades u
              WHERE ((u."idEmpreendimento" = e.id) AND (u."dataEntrega" IS NOT NULL) AND (u."dataEntrega" >= CURRENT_DATE))) > 0) THEN 'Em Construção'::text
            WHEN (( SELECT count(*) AS count
               FROM bronze.unidades u
              WHERE ((u."idEmpreendimento" = e.id) AND (u."estoqueComercial" = 'true'::text))) > 0) THEN 'Em Vendas'::text
            ELSE 'Em Planejamento'::text
        END AS status_empreendimento,
    (((((((((
        CASE
            WHEN ((e.nome IS NOT NULL) AND (TRIM(BOTH FROM e.nome) <> ''::text)) THEN 1
            ELSE 0
        END +
        CASE
            WHEN ((e."nomeComercial" IS NOT NULL) AND (TRIM(BOTH FROM e."nomeComercial") <> ''::text)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((e.tipo IS NOT NULL) AND (TRIM(BOTH FROM e.tipo) <> ''::text)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((e.endereco IS NOT NULL) AND (TRIM(BOTH FROM e.endereco) <> ''::text)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((e.cnpj IS NOT NULL) AND (length(regexp_replace(e.cnpj, '[^0-9]'::text, ''::text, 'g'::text)) = 14)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (e."idEmpresa" IS NOT NULL) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((e."observacaoEmpreendimento" IS NOT NULL) AND (TRIM(BOTH FROM e."observacaoEmpreendimento") <> ''::text)) THEN 1
            ELSE 0
        END))::numeric * 100.0) / (7)::numeric) AS qualidade_score,
        CASE
            WHEN (( SELECT count(*) AS count
               FROM bronze.unidades u
              WHERE (u."idEmpreendimento" = e.id)) = 0) THEN 'Sem Unidades'::text
            WHEN (( SELECT count(*) AS count
               FROM bronze.unidades u
              WHERE (u."idEmpreendimento" = e.id)) <= 10) THEN 'Pequeno'::text
            WHEN (( SELECT count(*) AS count
               FROM bronze.unidades u
              WHERE (u."idEmpreendimento" = e.id)) <= 50) THEN 'Médio'::text
            WHEN (( SELECT count(*) AS count
               FROM bronze.unidades u
              WHERE (u."idEmpreendimento" = e.id)) <= 200) THEN 'Grande'::text
            ELSE 'Mega'::text
        END AS categoria_porte
   FROM bronze.empreendimentos e
  ORDER BY e."dataCadastro" DESC, e.id
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW rpt_sienge_empreendimentos; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON MATERIALIZED VIEW silver.rpt_sienge_empreendimentos IS 'View Silver de empreendimentos: dados limpos, validados e enriquecidos com métricas de unidades e contratos';


--
-- Name: COLUMN rpt_sienge_empreendimentos.cnpj_limpo; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_empreendimentos.cnpj_limpo IS 'CNPJ validado e limpo (apenas números, 14 dígitos)';


--
-- Name: COLUMN rpt_sienge_empreendimentos.status_empreendimento; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_empreendimentos.status_empreendimento IS 'Status calculado baseado nas datas de entrega das unidades: Sem Unidades, Entregue, Em Construção, Em Vendas, Em Planejamento';


--
-- Name: COLUMN rpt_sienge_empreendimentos.qualidade_score; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_empreendimentos.qualidade_score IS 'Score de qualidade baseado em 7 critérios: nome, nome comercial, tipo, endereço, CNPJ, empresa, observação (0-100)';


--
-- Name: COLUMN rpt_sienge_empreendimentos.categoria_porte; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_empreendimentos.categoria_porte IS 'Categoria de porte baseada no número de unidades: Pequeno (≤10), Médio (11-50), Grande (51-200), Mega (>200)';


--
-- Name: rpt_sienge_unidades; Type: MATERIALIZED VIEW; Schema: silver; Owner: -
--

CREATE MATERIALIZED VIEW silver.rpt_sienge_unidades AS
 SELECT 'unidades'::text AS domain_type,
    (u.id)::text AS unique_id,
    u."dataCadastro" AS data_principal,
    EXTRACT(year FROM u."dataCadastro") AS ano,
    EXTRACT(month FROM u."dataCadastro") AS mes,
    to_char(u."dataCadastro", 'YYYY-MM'::text) AS ano_mes,
    u.id AS unidade_id,
    TRIM(BOTH FROM COALESCE(u.nome, ''::text)) AS unidade_nome,
    TRIM(BOTH FROM COALESCE(u."tipoImovel", ''::text)) AS tipo_imovel,
    COALESCE(u."estoqueComercial", 'false'::text) AS estoque_comercial,
    TRIM(BOTH FROM COALESCE(u.observacao, ''::text)) AS observacao,
    TRIM(BOTH FROM COALESCE(u.matricula, ''::text)) AS matricula,
    TRIM(BOTH FROM COALESCE(u.pavimento, ''::text)) AS pavimento,
    TRIM(BOTH FROM COALESCE(u."numeroContrato", ''::text)) AS numero_contrato,
    TRIM(BOTH FROM COALESCE(u."inscricaoImobiliaria", ''::text)) AS inscricao_imobiliaria,
        CASE
            WHEN ((u."areaPrivativa" IS NULL) OR (u."areaPrivativa" < (0)::numeric)) THEN NULL::numeric
            ELSE u."areaPrivativa"
        END AS area_privativa,
        CASE
            WHEN ((u."areaComum" IS NULL) OR (u."areaComum" < (0)::numeric)) THEN NULL::numeric
            ELSE u."areaComum"
        END AS area_comum,
        CASE
            WHEN ((u."areaTerreno" IS NULL) OR (u."areaTerreno" < (0)::numeric)) THEN NULL::numeric
            ELSE u."areaTerreno"
        END AS area_terreno,
        CASE
            WHEN ((u."areaUtil" IS NULL) OR (u."areaUtil" < (0)::numeric)) THEN NULL::numeric
            ELSE u."areaUtil"
        END AS area_util,
        CASE
            WHEN ((u."valorTerreno" IS NULL) OR (u."valorTerreno" < (0)::numeric)) THEN NULL::numeric
            ELSE u."valorTerreno"
        END AS valor_terreno,
        CASE
            WHEN ((u."valorIPTU" IS NULL) OR (u."valorIPTU" < (0)::numeric)) THEN NULL::numeric
            ELSE u."valorIPTU"
        END AS valor_iptu,
        CASE
            WHEN ((u."fracaoIdeal" IS NULL) OR (u."fracaoIdeal" < (0)::numeric) OR (u."fracaoIdeal" > (1)::numeric)) THEN NULL::numeric
            ELSE u."fracaoIdeal"
        END AS fracao_ideal,
        CASE
            WHEN ((u."fracaoIdealM2" IS NULL) OR (u."fracaoIdealM2" < (0)::numeric)) THEN NULL::numeric
            ELSE u."fracaoIdealM2"
        END AS fracao_ideal_m2,
        CASE
            WHEN ((u.latitude IS NULL) OR (u.latitude = ''::text) OR (NOT (u.latitude ~ '^-?[0-9]+\.?[0-9]*$'::text)) OR (abs((u.latitude)::numeric) > (90)::numeric)) THEN NULL::numeric
            ELSE (u.latitude)::numeric
        END AS latitude,
        CASE
            WHEN ((u.longitude IS NULL) OR (u.longitude = ''::text) OR (NOT (u.longitude ~ '^-?[0-9]+\.?[0-9]*$'::text)) OR (abs((u.longitude)::numeric) > (180)::numeric)) THEN NULL::numeric
            ELSE (u.longitude)::numeric
        END AS longitude,
        CASE
            WHEN ((u."dataEntrega" IS NULL) OR (u."dataEntrega" < '1900-01-01'::date)) THEN NULL::timestamp without time zone
            ELSE u."dataEntrega"
        END AS data_entrega,
        CASE
            WHEN ((u."scheduledDeliveryDate" IS NULL) OR (u."scheduledDeliveryDate" < '1900-01-01'::date)) THEN NULL::timestamp without time zone
            ELSE u."scheduledDeliveryDate"
        END AS data_entrega_programada,
    u."idEmpreendimento" AS empreendimento_id,
    u."idContrato" AS contrato_id,
    u."idIndexador" AS indexador_id,
    COALESCE(u."quantidadeIndexada", (0)::numeric) AS quantidade_indexada,
    COALESCE(u."adimplenciaPremiada", (0)::numeric) AS adimplencia_premiada,
    COALESCE(u.total_unidades_filhas, 0) AS total_unidades_filhas,
    COALESCE(u.total_agrupamentos, 0) AS total_agrupamentos,
    COALESCE(u.total_valores_especiais, 0) AS total_valores_especiais,
    COALESCE(u.total_links, 0) AS total_links,
        CASE
            WHEN ((u.childunits IS NULL) OR (jsonb_typeof(u.childunits) <> 'array'::text)) THEN '[]'::jsonb
            ELSE u.childunits
        END AS unidades_filhas_json,
        CASE
            WHEN ((u.groupings IS NULL) OR (jsonb_typeof(u.groupings) <> 'array'::text)) THEN '[]'::jsonb
            ELSE u.groupings
        END AS agrupamentos_json,
        CASE
            WHEN ((u.specialvalues IS NULL) OR (jsonb_typeof(u.specialvalues) <> 'array'::text)) THEN '[]'::jsonb
            ELSE u.specialvalues
        END AS valores_especiais_json,
        CASE
            WHEN ((u.links IS NULL) OR (jsonb_typeof(u.links) <> 'array'::text)) THEN '[]'::jsonb
            ELSE u.links
        END AS links_json,
    u."dataCadastro" AS data_cadastro,
    u."dataAtualizacao" AS data_atualizacao,
        CASE
            WHEN ((u.nome IS NULL) OR (TRIM(BOTH FROM u.nome) = ''::text)) THEN false
            ELSE true
        END AS tem_nome_valido,
        CASE
            WHEN ((u."areaPrivativa" IS NULL) OR (u."areaPrivativa" <= (0)::numeric)) THEN false
            ELSE true
        END AS tem_area_valida,
        CASE
            WHEN ((u."valorTerreno" IS NULL) OR (u."valorTerreno" <= (0)::numeric)) THEN false
            ELSE true
        END AS tem_valor_valido,
        CASE
            WHEN ((u.latitude IS NULL) OR (u.longitude IS NULL) OR (u.latitude = ''::text) OR (u.longitude = ''::text)) THEN false
            ELSE true
        END AS tem_localizacao_valida,
        CASE
            WHEN (u."dataEntrega" IS NULL) THEN false
            ELSE true
        END AS tem_data_entrega_valida,
    (((((((((
        CASE
            WHEN ((u.nome IS NOT NULL) AND (TRIM(BOTH FROM u.nome) <> ''::text)) THEN 1
            ELSE 0
        END +
        CASE
            WHEN ((u."tipoImovel" IS NOT NULL) AND (TRIM(BOTH FROM u."tipoImovel") <> ''::text)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((u."areaPrivativa" IS NOT NULL) AND (u."areaPrivativa" > (0)::numeric)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((u."valorTerreno" IS NOT NULL) AND (u."valorTerreno" > (0)::numeric)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (u."dataEntrega" IS NOT NULL) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((u.latitude IS NOT NULL) AND (u.longitude IS NOT NULL) AND (u.latitude <> ''::text) AND (u.longitude <> ''::text)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (u."idEmpreendimento" IS NOT NULL) THEN 1
            ELSE 0
        END))::numeric * 100.0) / (7)::numeric) AS qualidade_score
   FROM bronze.unidades u
  ORDER BY u."dataCadastro" DESC, u.id
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW rpt_sienge_unidades; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON MATERIALIZED VIEW silver.rpt_sienge_unidades IS 'View Silver de unidades: dados limpos, validados e enriquecidos com indicadores de qualidade';


--
-- Name: COLUMN rpt_sienge_unidades.area_privativa; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_unidades.area_privativa IS 'Área privativa validada (valores negativos ou nulos tratados)';


--
-- Name: COLUMN rpt_sienge_unidades.latitude; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_unidades.latitude IS 'Latitude validada (formato numérico, range -90 a 90)';


--
-- Name: COLUMN rpt_sienge_unidades.longitude; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_unidades.longitude IS 'Longitude validada (formato numérico, range -180 a 180)';


--
-- Name: COLUMN rpt_sienge_unidades.qualidade_score; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_unidades.qualidade_score IS 'Score de qualidade baseado em 7 critérios: nome, tipo, área, valor, entrega, localização, empreendimento (0-100)';


--
-- Name: portfolio_imobiliario; Type: MATERIALIZED VIEW; Schema: gold; Owner: -
--

CREATE MATERIALIZED VIEW gold.portfolio_imobiliario AS
 SELECT 'portfolio'::text AS domain_type,
    (u.unidade_id)::text AS unique_id,
    u.data_cadastro AS data_principal,
    EXTRACT(year FROM u.data_cadastro) AS ano,
    EXTRACT(month FROM u.data_cadastro) AS mes,
    to_char(u.data_cadastro, 'YYYY-MM'::text) AS ano_mes,
    u.unidade_id,
    u.unidade_nome,
    u.tipo_imovel,
    u.estoque_comercial,
    u.observacao AS unidade_observacao,
    u.matricula,
    u.pavimento,
    u.numero_contrato AS unidade_numero_contrato,
    u.inscricao_imobiliaria,
    u.area_privativa,
    u.area_comum,
    u.area_terreno,
    u.area_util,
    (COALESCE(u.area_privativa, (0)::numeric) + COALESCE(u.area_comum, (0)::numeric)) AS area_total,
    u.fracao_ideal,
    u.fracao_ideal_m2,
    u.valor_terreno,
    u.valor_iptu,
    u.adimplencia_premiada,
    u.quantidade_indexada,
    u.latitude,
    u.longitude,
        CASE
            WHEN ((u.latitude IS NOT NULL) AND (u.longitude IS NOT NULL)) THEN concat('https://maps.google.com/?q=', u.latitude, ',', u.longitude)
            ELSE NULL::text
        END AS link_maps,
    u.data_entrega,
    u.data_entrega_programada,
    u.data_cadastro AS unidade_data_cadastro,
    u.data_atualizacao AS unidade_data_atualizacao,
    e.empreendimento_id,
    e.empreendimento_nome,
    e.nome_comercial AS empreendimento_nome_comercial,
    e.tipo_empreendimento,
    e.endereco AS empreendimento_endereco,
    e.categoria_tipo AS empreendimento_categoria,
    e.categoria_porte AS empreendimento_porte,
    e.status_empreendimento,
    e.cnpj_limpo AS empreendimento_cnpj,
    e.empresa_id,
    e.empresa_nome,
    e.total_unidades AS empreendimento_total_unidades,
    e.total_contratos AS empreendimento_total_contratos,
    e.area_total_privativa AS empreendimento_area_total,
    e.valor_total_estimado AS empreendimento_valor_total,
    e.proxima_entrega AS empreendimento_proxima_entrega,
    e.ultima_entrega AS empreendimento_ultima_entrega,
    c.contrato_id,
    c.numero_contrato,
    c.data_contrato,
    c.valor_venda_total AS contrato_valor_venda,
    c.status_contrato AS contrato_status,
    c.cliente_principal_nome AS contrato_cliente_nome,
    c.data_entrega_chaves AS contrato_data_entrega_chaves,
    u.total_unidades_filhas,
    u.total_agrupamentos,
    u.total_valores_especiais,
    u.total_links,
    u.unidades_filhas_json,
    u.agrupamentos_json,
    u.valores_especiais_json,
    u.links_json,
        CASE
            WHEN ((u.data_entrega IS NOT NULL) AND (u.data_entrega <= CURRENT_DATE)) THEN 'Entregue'::text
            WHEN ((u.data_entrega IS NOT NULL) AND (u.data_entrega > CURRENT_DATE)) THEN 'Em Construção'::text
            WHEN (u.estoque_comercial = 'true'::text) THEN 'Disponível para Venda'::text
            WHEN (c.contrato_id IS NOT NULL) THEN 'Vendida'::text
            ELSE 'Em Desenvolvimento'::text
        END AS status_unidade,
        CASE
            WHEN ((u.area_privativa IS NULL) OR (u.area_privativa = (0)::numeric)) THEN 'Sem Área Definida'::text
            WHEN (u.area_privativa < (50)::numeric) THEN 'Compacto'::text
            WHEN (u.area_privativa < (100)::numeric) THEN 'Médio'::text
            WHEN (u.area_privativa < (200)::numeric) THEN 'Grande'::text
            ELSE 'Premium'::text
        END AS categoria_tamanho,
        CASE
            WHEN (u.tipo_imovel ~~* '%apartamento%'::text) THEN 'Apartamento'::text
            WHEN (u.tipo_imovel ~~* '%casa%'::text) THEN 'Casa'::text
            WHEN (u.tipo_imovel ~~* '%comercial%'::text) THEN 'Comercial'::text
            WHEN (u.tipo_imovel ~~* '%garagem%'::text) THEN 'Garagem'::text
            WHEN ((u.tipo_imovel ~~* '%depósito%'::text) OR (u.tipo_imovel ~~* '%deposito%'::text)) THEN 'Depósito'::text
            WHEN (u.tipo_imovel ~~* '%sala%'::text) THEN 'Sala'::text
            WHEN (u.tipo_imovel ~~* '%loja%'::text) THEN 'Loja'::text
            WHEN (u.tipo_imovel ~~* '%terreno%'::text) THEN 'Terreno'::text
            ELSE 'Outros'::text
        END AS categoria_tipo,
        CASE
            WHEN ((u.valor_terreno IS NULL) OR (u.valor_terreno = (0)::numeric)) THEN 'Sem Valor'::text
            WHEN (u.valor_terreno < (100000)::numeric) THEN 'Econômico'::text
            WHEN (u.valor_terreno < (300000)::numeric) THEN 'Médio'::text
            WHEN (u.valor_terreno < (600000)::numeric) THEN 'Alto'::text
            WHEN (u.valor_terreno < (1000000)::numeric) THEN 'Premium'::text
            ELSE 'Luxo'::text
        END AS categoria_valor,
        CASE
            WHEN (u.data_entrega IS NULL) THEN 'Não Definida'::text
            WHEN (u.data_entrega > CURRENT_DATE) THEN 'Futura'::text
            WHEN (u.data_entrega = CURRENT_DATE) THEN 'Hoje'::text
            WHEN (u.data_entrega < CURRENT_DATE) THEN 'Passada'::text
            ELSE NULL::text
        END AS status_entrega,
        CASE
            WHEN (u.data_entrega IS NULL) THEN NULL::numeric
            WHEN (u.data_entrega > CURRENT_DATE) THEN EXTRACT(days FROM (u.data_entrega - (CURRENT_DATE)::timestamp without time zone))
            WHEN (u.data_entrega < CURRENT_DATE) THEN (- EXTRACT(days FROM ((CURRENT_DATE)::timestamp without time zone - u.data_entrega)))
            ELSE (0)::numeric
        END AS dias_para_entrega,
        CASE
            WHEN ((u.area_privativa > (0)::numeric) AND (u.valor_terreno > (0)::numeric)) THEN round((u.valor_terreno / u.area_privativa), 2)
            ELSE NULL::numeric
        END AS valor_por_m2,
        CASE
            WHEN ((u.area_terreno > (0)::numeric) AND (u.area_privativa > (0)::numeric)) THEN round((u.area_privativa / u.area_terreno), 4)
            ELSE NULL::numeric
        END AS coeficiente_aproveitamento,
        CASE
            WHEN ((COALESCE(u.area_privativa, (0)::numeric) + COALESCE(u.area_comum, (0)::numeric)) > (0)::numeric) THEN round(((u.area_privativa / (u.area_privativa + COALESCE(u.area_comum, (0)::numeric))) * (100)::numeric), 2)
            ELSE NULL::numeric
        END AS percentual_area_privativa,
    u.tem_nome_valido,
    u.tem_area_valida,
    u.tem_valor_valido,
    u.tem_localizacao_valida,
    u.tem_data_entrega_valida,
    u.qualidade_score,
        CASE
            WHEN (u.empreendimento_id IS NOT NULL) THEN true
            ELSE false
        END AS tem_empreendimento_vinculado,
        CASE
            WHEN (c.contrato_id IS NOT NULL) THEN true
            ELSE false
        END AS tem_contrato_vinculado,
        CASE
            WHEN ((u.latitude IS NOT NULL) AND (u.longitude IS NOT NULL)) THEN true
            ELSE false
        END AS tem_coordenadas,
        CASE
            WHEN (u.total_unidades_filhas > 0) THEN true
            ELSE false
        END AS tem_unidades_filhas,
        CASE
            WHEN (u.total_agrupamentos > 0) THEN true
            ELSE false
        END AS tem_agrupamentos,
        CASE
            WHEN (e.total_unidades > 0) THEN round(((1.0 / (e.total_unidades)::numeric) * (100)::numeric), 2)
            ELSE NULL::numeric
        END AS participacao_no_empreendimento,
        CASE
            WHEN ((u.valor_terreno > (0)::numeric) AND (c.valor_venda_total > (0)::numeric)) THEN round((((c.valor_venda_total - u.valor_terreno) / u.valor_terreno) * (100)::numeric), 2)
            ELSE NULL::numeric
        END AS margem_venda_percentual,
        CASE
            WHEN ((u.estoque_comercial = 'true'::text) AND (u.valor_terreno >= (500000)::numeric)) THEN 'Alto Valor - Disponível'::text
            WHEN ((u.estoque_comercial = 'true'::text) AND (u.valor_terreno < (500000)::numeric)) THEN 'Padrão - Disponível'::text
            WHEN ((c.contrato_id IS NOT NULL) AND (c.valor_venda_total >= (500000)::numeric)) THEN 'Alto Valor - Vendida'::text
            WHEN ((c.contrato_id IS NOT NULL) AND (c.valor_venda_total < (500000)::numeric)) THEN 'Padrão - Vendida'::text
            WHEN ((u.data_entrega IS NOT NULL) AND (u.data_entrega <= CURRENT_DATE)) THEN 'Entregue'::text
            ELSE 'Em Desenvolvimento'::text
        END AS segmento_estrategico,
    ((((
        CASE
            WHEN (u.area_privativa >= (80)::numeric) THEN 2
            WHEN (u.area_privativa >= (50)::numeric) THEN 1
            ELSE 0
        END +
        CASE
            WHEN (u.valor_terreno < (300000)::numeric) THEN 2
            WHEN (u.valor_terreno < (600000)::numeric) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((u.latitude IS NOT NULL) AND (u.longitude IS NOT NULL)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((u.data_entrega IS NOT NULL) AND (u.data_entrega <= (CURRENT_DATE + '1 year'::interval))) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (e.status_empreendimento = ANY (ARRAY['Em Construção'::text, 'Em Vendas'::text])) THEN 1
            ELSE 0
        END) AS score_atratividade,
    CURRENT_TIMESTAMP AS data_processamento
   FROM ((silver.rpt_sienge_unidades u
     LEFT JOIN silver.rpt_sienge_empreendimentos e ON ((e.empreendimento_id = u.empreendimento_id)))
     LEFT JOIN ( SELECT DISTINCT ON (cu.unidade_sienge_id) cu.unidade_sienge_id,
            c_1.contrato_id,
            c_1.numero_contrato,
            c_1.data_contrato,
            c_1.valor_venda_total,
            c_1.status_contrato,
            c_1.cliente_principal_nome,
            c_1.data_entrega_chaves
           FROM (bronze.contrato_unidades cu
             JOIN silver.rpt_sienge_contratos c_1 ON ((c_1.contrato_id = cu.contrato_id)))
          ORDER BY cu.unidade_sienge_id, c_1.data_contrato DESC) c ON ((c.unidade_sienge_id = u.unidade_id)))
  ORDER BY e.empreendimento_nome, u.tipo_imovel, u.unidade_nome
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW portfolio_imobiliario; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON MATERIALIZED VIEW gold.portfolio_imobiliario IS 'View Gold do portfolio imobiliário: análise completa de unidades, empreendimentos e relacionamentos para gestão de ativos';


--
-- Name: COLUMN portfolio_imobiliario.status_unidade; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.portfolio_imobiliario.status_unidade IS 'Status da unidade: Entregue, Em Construção, Disponível para Venda, Vendida, Em Desenvolvimento';


--
-- Name: COLUMN portfolio_imobiliario.categoria_tamanho; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.portfolio_imobiliario.categoria_tamanho IS 'Categorização por área privativa: Compacto (<50m²), Médio (50-100m²), Grande (100-200m²), Premium (>200m²)';


--
-- Name: COLUMN portfolio_imobiliario.categoria_valor; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.portfolio_imobiliario.categoria_valor IS 'Categorização por valor: Econômico (<100k), Médio (100-300k), Alto (300-600k), Premium (600k-1M), Luxo (>1M)';


--
-- Name: COLUMN portfolio_imobiliario.valor_por_m2; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.portfolio_imobiliario.valor_por_m2 IS 'Valor do terreno por metro quadrado de área privativa';


--
-- Name: COLUMN portfolio_imobiliario.segmento_estrategico; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.portfolio_imobiliario.segmento_estrategico IS 'Segmentação estratégica combinando status, valor e disponibilidade';


--
-- Name: COLUMN portfolio_imobiliario.score_atratividade; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.portfolio_imobiliario.score_atratividade IS 'Score de atratividade (0-7): área, preço, localização, prazo de entrega, status do empreendimento';


--
-- Name: rpt_sienge_clientes; Type: MATERIALIZED VIEW; Schema: silver; Owner: -
--

CREATE MATERIALIZED VIEW silver.rpt_sienge_clientes AS
 SELECT 'clientes'::text AS domain_type,
    (c."idCliente")::text AS unique_id,
    c."dataCadastro" AS data_principal,
    EXTRACT(year FROM c."dataCadastro") AS ano,
    EXTRACT(month FROM c."dataCadastro") AS mes,
    to_char(c."dataCadastro", 'YYYY-MM'::text) AS ano_mes,
    c."idCliente" AS cliente_id,
    TRIM(BOTH FROM COALESCE(c.name, ''::text)) AS nome_completo,
    TRIM(BOTH FROM COALESCE(c."nomeSocial", ''::text)) AS nome_social,
    TRIM(BOTH FROM COALESCE(c."tradingName", ''::text)) AS nome_fantasia,
    TRIM(BOTH FROM COALESCE(c."corporateName", ''::text)) AS razao_social,
    TRIM(BOTH FROM COALESCE(c."internalCode", ''::text)) AS codigo_interno,
        CASE
            WHEN ((c."cpfCnpj" IS NULL) OR (TRIM(BOTH FROM c."cpfCnpj") = ''::text)) THEN NULL::text
            WHEN (length(regexp_replace(c."cpfCnpj", '[^0-9]'::text, ''::text, 'g'::text)) = ANY (ARRAY[11, 14])) THEN regexp_replace(c."cpfCnpj", '[^0-9]'::text, ''::text, 'g'::text)
            ELSE NULL::text
        END AS cpf_cnpj_limpo,
        CASE
            WHEN ((c.cnpj IS NULL) OR (TRIM(BOTH FROM c.cnpj) = ''::text)) THEN NULL::text
            WHEN (length(regexp_replace(c.cnpj, '[^0-9]'::text, ''::text, 'g'::text)) = 14) THEN regexp_replace(c.cnpj, '[^0-9]'::text, ''::text, 'g'::text)
            ELSE NULL::text
        END AS cnpj_limpo,
        CASE
            WHEN ((c.rg IS NULL) OR (TRIM(BOTH FROM c.rg) = ''::text)) THEN NULL::text
            ELSE TRIM(BOTH FROM c.rg)
        END AS rg_limpo,
        CASE
            WHEN ((c."personType" IS NULL) OR (TRIM(BOTH FROM c."personType") = ''::text)) THEN 'Não Definido'::text
            WHEN (upper(c."personType") = 'PHYSICAL'::text) THEN 'Física'::text
            WHEN (upper(c."personType") = 'LEGAL'::text) THEN 'Jurídica'::text
            ELSE TRIM(BOTH FROM c."personType")
        END AS tipo_pessoa,
        CASE
            WHEN ((c."dataNascimento" IS NULL) OR (c."dataNascimento" < '1900-01-01'::date) OR (c."dataNascimento" > CURRENT_DATE)) THEN NULL::timestamp without time zone
            ELSE c."dataNascimento"
        END AS data_nascimento,
    TRIM(BOTH FROM COALESCE(c.nacionalidade, ''::text)) AS nacionalidade,
    TRIM(BOTH FROM COALESCE(c.sex, ''::text)) AS sexo,
    TRIM(BOTH FROM COALESCE(c."birthPlace", ''::text)) AS local_nascimento,
    TRIM(BOTH FROM COALESCE(c."fatherName", ''::text)) AS nome_pai,
    TRIM(BOTH FROM COALESCE(c."motherName", ''::text)) AS nome_mae,
    TRIM(BOTH FROM COALESCE(c."civilStatus", ''::text)) AS estado_civil,
    TRIM(BOTH FROM COALESCE(c.profession, ''::text)) AS profissao,
        CASE
            WHEN ((c.email IS NULL) OR (TRIM(BOTH FROM c.email) = ''::text)) THEN NULL::text
            WHEN (c.email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'::text) THEN TRIM(BOTH FROM lower(c.email))
            ELSE NULL::text
        END AS email_validado,
        CASE
            WHEN ((c.email IS NOT NULL) AND (c.email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'::text)) THEN true
            ELSE false
        END AS tem_email_valido,
    TRIM(BOTH FROM COALESCE(c.telefone_principal, ''::text)) AS telefone_principal,
    TRIM(BOTH FROM COALESCE(c.telefone_principal_tipo, ''::text)) AS tipo_telefone_principal,
    COALESCE(c.total_telefones, 0) AS total_telefones,
    TRIM(BOTH FROM COALESCE(c.endereco_principal, ''::text)) AS endereco_principal,
    TRIM(BOTH FROM COALESCE(c.cidade_principal, ''::text)) AS cidade,
    TRIM(BOTH FROM COALESCE(c.estado_principal, ''::text)) AS estado,
    TRIM(BOTH FROM COALESCE(c.cep_principal, ''::text)) AS cep,
    COALESCE(c.total_enderecos, 0) AS total_enderecos,
    COALESCE(c.tem_conjuge, false) AS tem_conjuge,
    TRIM(BOTH FROM COALESCE(c.nome_conjuge, ''::text)) AS nome_conjuge,
        CASE
            WHEN ((c.cpf_conjuge IS NULL) OR (TRIM(BOTH FROM c.cpf_conjuge) = ''::text)) THEN NULL::text
            WHEN (length(regexp_replace(c.cpf_conjuge, '[^0-9]'::text, ''::text, 'g'::text)) = 11) THEN regexp_replace(c.cpf_conjuge, '[^0-9]'::text, ''::text, 'g'::text)
            ELSE NULL::text
        END AS cpf_conjuge_limpo,
    COALESCE(c.ativo, false) AS ativo,
    TRIM(BOTH FROM COALESCE(c.foreigner, ''::text)) AS estrangeiro,
    c."dataCadastro" AS data_cadastro,
    c."dataAtualizacao" AS data_atualizacao,
        CASE
            WHEN ((c.phones IS NULL) OR (jsonb_typeof(c.phones) <> 'array'::text)) THEN '[]'::jsonb
            ELSE c.phones
        END AS telefones_json,
        CASE
            WHEN ((c.addresses IS NULL) OR (jsonb_typeof(c.addresses) <> 'array'::text)) THEN '[]'::jsonb
            ELSE c.addresses
        END AS enderecos_json,
        CASE
            WHEN ((c.procurators IS NULL) OR (jsonb_typeof(c.procurators) <> 'array'::text)) THEN '[]'::jsonb
            ELSE c.procurators
        END AS procuradores_json,
        CASE
            WHEN ((c.contacts IS NULL) OR (jsonb_typeof(c.contacts) <> 'array'::text)) THEN '[]'::jsonb
            ELSE c.contacts
        END AS contatos_json,
        CASE
            WHEN ((c.spouse IS NULL) OR (jsonb_typeof(c.spouse) <> 'object'::text)) THEN '{}'::jsonb
            ELSE c.spouse
        END AS conjuge_json,
        CASE
            WHEN ((c."familyIncome" IS NULL) OR (jsonb_typeof(c."familyIncome") <> 'array'::text)) THEN '[]'::jsonb
            ELSE c."familyIncome"
        END AS renda_familiar_json,
        CASE
            WHEN ((c."subTypes" IS NULL) OR (jsonb_typeof(c."subTypes") <> 'array'::text)) THEN '[]'::jsonb
            ELSE c."subTypes"
        END AS subtipos_json,
        CASE
            WHEN ((c."maritalStatus" IS NULL) OR (jsonb_typeof(c."maritalStatus") <> 'object'::text)) THEN '{}'::jsonb
            ELSE c."maritalStatus"
        END AS estado_civil_json,
        CASE
            WHEN ((c."dataNascimento" IS NULL) OR (c."dataNascimento" > CURRENT_DATE)) THEN NULL::numeric
            ELSE EXTRACT(year FROM age((CURRENT_DATE)::timestamp without time zone, c."dataNascimento"))
        END AS idade_atual,
        CASE
            WHEN ((c."dataNascimento" IS NULL) OR (c."dataNascimento" > CURRENT_DATE)) THEN 'Não Informado'::text
            WHEN (EXTRACT(year FROM age((CURRENT_DATE)::timestamp without time zone, c."dataNascimento")) < (18)::numeric) THEN 'Menor de Idade'::text
            WHEN (EXTRACT(year FROM age((CURRENT_DATE)::timestamp without time zone, c."dataNascimento")) < (30)::numeric) THEN 'Jovem (18-29)'::text
            WHEN (EXTRACT(year FROM age((CURRENT_DATE)::timestamp without time zone, c."dataNascimento")) < (50)::numeric) THEN 'Adulto (30-49)'::text
            WHEN (EXTRACT(year FROM age((CURRENT_DATE)::timestamp without time zone, c."dataNascimento")) < (65)::numeric) THEN 'Meia Idade (50-64)'::text
            ELSE 'Idoso (65+)'::text
        END AS faixa_etaria,
    EXTRACT(days FROM ((CURRENT_DATE)::timestamp without time zone - c."dataCadastro")) AS dias_como_cliente,
        CASE
            WHEN (EXTRACT(days FROM ((CURRENT_DATE)::timestamp without time zone - c."dataCadastro")) < (30)::numeric) THEN 'Novo (< 1 mês)'::text
            WHEN (EXTRACT(days FROM ((CURRENT_DATE)::timestamp without time zone - c."dataCadastro")) < (365)::numeric) THEN 'Recente (< 1 ano)'::text
            WHEN (EXTRACT(days FROM ((CURRENT_DATE)::timestamp without time zone - c."dataCadastro")) < (1825)::numeric) THEN 'Estabelecido (1-5 anos)'::text
            ELSE 'Antigo (5+ anos)'::text
        END AS categoria_tempo_cliente,
        CASE
            WHEN ((c.name IS NULL) OR (TRIM(BOTH FROM c.name) = ''::text)) THEN false
            ELSE true
        END AS tem_nome_valido,
        CASE
            WHEN ((c."cpfCnpj" IS NOT NULL) AND (length(regexp_replace(c."cpfCnpj", '[^0-9]'::text, ''::text, 'g'::text)) = ANY (ARRAY[11, 14]))) THEN true
            ELSE false
        END AS tem_documento_valido,
        CASE
            WHEN ((c.endereco_principal IS NULL) OR (TRIM(BOTH FROM c.endereco_principal) = ''::text)) THEN false
            ELSE true
        END AS tem_endereco_valido,
        CASE
            WHEN ((c.telefone_principal IS NULL) OR (TRIM(BOTH FROM c.telefone_principal) = ''::text)) THEN false
            ELSE true
        END AS tem_telefone_valido,
        CASE
            WHEN ((c."dataNascimento" IS NULL) OR (c."dataNascimento" > CURRENT_DATE)) THEN false
            ELSE true
        END AS tem_data_nascimento_valida,
        CASE
            WHEN (length(regexp_replace(COALESCE(c."cpfCnpj", ''::text), '[^0-9]'::text, ''::text, 'g'::text)) = 11) THEN true
            ELSE false
        END AS eh_cpf,
        CASE
            WHEN (length(regexp_replace(COALESCE(c."cpfCnpj", ''::text), '[^0-9]'::text, ''::text, 'g'::text)) = 14) THEN true
            ELSE false
        END AS eh_cnpj,
    (((((((((
        CASE
            WHEN ((c.name IS NOT NULL) AND (TRIM(BOTH FROM c.name) <> ''::text)) THEN 1
            ELSE 0
        END +
        CASE
            WHEN ((c."cpfCnpj" IS NOT NULL) AND (length(regexp_replace(c."cpfCnpj", '[^0-9]'::text, ''::text, 'g'::text)) = ANY (ARRAY[11, 14]))) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((c.email IS NOT NULL) AND (c.email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'::text)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((c.telefone_principal IS NOT NULL) AND (TRIM(BOTH FROM c.telefone_principal) <> ''::text)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((c.endereco_principal IS NOT NULL) AND (TRIM(BOTH FROM c.endereco_principal) <> ''::text)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((c."dataNascimento" IS NOT NULL) AND (c."dataNascimento" <= CURRENT_DATE)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((c."personType" IS NOT NULL) AND (TRIM(BOTH FROM c."personType") <> ''::text)) THEN 1
            ELSE 0
        END))::numeric * 100.0) / (7)::numeric) AS qualidade_score
   FROM bronze.clientes c
  ORDER BY c."dataCadastro" DESC, c."idCliente"
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW rpt_sienge_clientes; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON MATERIALIZED VIEW silver.rpt_sienge_clientes IS 'View Silver de clientes: dados limpos, validados e categorizados com análises de idade e tempo';


--
-- Name: COLUMN rpt_sienge_clientes.cpf_cnpj_limpo; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_clientes.cpf_cnpj_limpo IS 'CPF ou CNPJ validado e limpo (apenas números, 11 ou 14 dígitos)';


--
-- Name: COLUMN rpt_sienge_clientes.email_validado; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_clientes.email_validado IS 'Email validado (formato correto) e normalizado (lowercase)';


--
-- Name: COLUMN rpt_sienge_clientes.faixa_etaria; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_clientes.faixa_etaria IS 'Faixa etária calculada: Menor de Idade, Jovem (18-29), Adulto (30-49), Meia Idade (50-64), Idoso (65+)';


--
-- Name: COLUMN rpt_sienge_clientes.qualidade_score; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_clientes.qualidade_score IS 'Score de qualidade baseado em 7 critérios: nome, documento, email, telefone, endereço, nascimento, tipo (0-100)';


--
-- Name: vendas_360; Type: MATERIALIZED VIEW; Schema: gold; Owner: -
--

CREATE MATERIALIZED VIEW gold.vendas_360 AS
 SELECT 'vendas'::text AS domain_type,
    (c.contrato_id)::text AS unique_id,
    c.data_contrato AS data_principal,
    EXTRACT(year FROM c.data_contrato) AS ano,
    EXTRACT(month FROM c.data_contrato) AS mes,
    to_char(c.data_contrato, 'YYYY-MM'::text) AS ano_mes,
    c.contrato_id,
    c.numero_contrato,
    c.id_externo AS contrato_id_externo,
    c.situacao AS situacao_contrato,
    c.status_contrato AS status_derivado,
    c.categoria_valor AS categoria_valor_contrato,
    c.data_contrato,
    c.data_emissao,
    c.data_contabilizacao,
    c.data_entrega_prevista,
    c.data_entrega_chaves,
    c.data_cancelamento,
    c.data_cadastro AS data_cadastro_contrato,
    c.valor_contrato AS valor_contrato_original,
    c.valor_venda_total,
    c.valor_cancelamento,
    c.valor_total_calculado,
    c.valor_total_pago,
    c.saldo_devedor,
    c.percentual_pago,
    c.total_parcelas,
    c.parcelas_pagas,
    c.forma_pagamento_principal,
    c.indexador_principal,
    c.tem_financiamento,
    c.total_condicoes_pagamento,
    c.tipo_desconto,
    c.percentual_desconto,
    c.tipo_correcao,
    c.tipo_juros,
    c.percentual_juros,
    c.tem_comissao,
    c.total_comissoes,
    c.valor_total_comissao,
    c.faixa_valor_comissao,
    c.percentual_comissao_sobre_contrato,
    cl.cliente_id,
    cl.nome_completo AS cliente_nome,
    cl.nome_social AS cliente_nome_social,
    cl.cpf_cnpj_limpo AS cliente_documento,
    cl.tipo_pessoa AS cliente_tipo_pessoa,
    cl.email_validado AS cliente_email,
    cl.telefone_principal AS cliente_telefone,
    cl.cidade AS cliente_cidade,
    cl.estado AS cliente_estado,
    cl.idade_atual AS cliente_idade,
    cl.faixa_etaria AS cliente_faixa_etaria,
    cl.categoria_tempo_cliente,
    cl.qualidade_score AS cliente_qualidade_score,
    e.empreendimento_id,
    e.empreendimento_nome,
    e.nome_comercial AS empreendimento_nome_comercial,
    e.tipo_empreendimento,
    e.endereco AS empreendimento_endereco,
    e.categoria_tipo AS empreendimento_categoria,
    e.categoria_porte AS empreendimento_porte,
    e.status_empreendimento,
    e.total_unidades AS empreendimento_total_unidades,
    e.total_contratos AS empreendimento_total_contratos,
    e.qualidade_score AS empreendimento_qualidade_score,
    c.empresa_id,
    c.empresa_nome,
    count(u.unidade_id) AS total_unidades_vendidas,
    string_agg(DISTINCT u.unidade_nome, '; '::text ORDER BY u.unidade_nome) AS nomes_unidades,
    string_agg(DISTINCT u.tipo_imovel, '; '::text ORDER BY u.tipo_imovel) AS tipos_unidades,
    COALESCE(sum(u.area_privativa), (0)::numeric) AS area_privativa_total,
    COALESCE(sum(u.area_comum), (0)::numeric) AS area_comum_total,
    COALESCE(sum(u.area_terreno), (0)::numeric) AS area_terreno_total,
    COALESCE(avg(u.area_privativa), (0)::numeric) AS area_privativa_media,
    COALESCE(sum(u.valor_terreno), (0)::numeric) AS valor_terreno_total,
    COALESCE(avg(u.valor_terreno), (0)::numeric) AS valor_terreno_medio,
    count(u.unidade_id) FILTER (WHERE (u.estoque_comercial = 'true'::text)) AS unidades_em_estoque,
    count(u.unidade_id) FILTER (WHERE ((u.data_entrega IS NOT NULL) AND (u.data_entrega <= CURRENT_DATE))) AS unidades_entregues,
    count(u.unidade_id) FILTER (WHERE ((u.data_entrega IS NOT NULL) AND (u.data_entrega > CURRENT_DATE))) AS unidades_a_entregar,
    min(u.data_entrega) AS primeira_entrega_prevista,
    max(u.data_entrega) AS ultima_entrega_prevista,
        CASE
            WHEN (c.total_parcelas > 0) THEN round((((c.parcelas_pagas)::numeric / (c.total_parcelas)::numeric) * (100)::numeric), 2)
            ELSE (0)::numeric
        END AS percentual_parcelas_pagas,
        CASE
            WHEN (c.valor_venda_total > (0)::numeric) THEN round(((c.valor_total_pago / c.valor_venda_total) * (100)::numeric), 2)
            ELSE (0)::numeric
        END AS percentual_valor_pago,
        CASE
            WHEN (min(u.data_entrega) IS NOT NULL) THEN EXTRACT(days FROM (min(u.data_entrega) - c.data_contrato))
            ELSE NULL::numeric
        END AS dias_para_primeira_entrega,
        CASE
            WHEN (max(u.data_entrega) IS NOT NULL) THEN EXTRACT(days FROM (max(u.data_entrega) - c.data_contrato))
            ELSE NULL::numeric
        END AS dias_para_ultima_entrega,
        CASE
            WHEN (COALESCE(sum(u.area_privativa), (0)::numeric) > (0)::numeric) THEN round((c.valor_venda_total / sum(u.area_privativa)), 2)
            ELSE NULL::numeric
        END AS valor_por_m2,
        CASE
            WHEN (c.data_cancelamento IS NOT NULL) THEN 'Cancelado'::text
            WHEN (c.data_entrega_chaves IS NOT NULL) THEN 'Entregue'::text
            WHEN (c.saldo_devedor <= (0)::numeric) THEN 'Quitado'::text
            WHEN ((c.data_entrega_prevista IS NOT NULL) AND (c.data_entrega_prevista < CURRENT_DATE) AND (c.data_entrega_chaves IS NULL)) THEN 'Atrasado'::text
            WHEN (c.percentual_pago >= (50)::numeric) THEN 'Em Andamento'::text
            WHEN ((c.percentual_pago < (50)::numeric) AND (c.percentual_pago > (0)::numeric)) THEN 'Início Pagamento'::text
            ELSE 'Novo'::text
        END AS situacao_detalhada,
        CASE
            WHEN (c.valor_venda_total >= (1000000)::numeric) THEN 'Premium'::text
            WHEN (c.valor_venda_total >= (500000)::numeric) THEN 'Alto'::text
            WHEN (c.valor_venda_total >= (200000)::numeric) THEN 'Médio'::text
            WHEN (c.valor_venda_total >= (100000)::numeric) THEN 'Baixo'::text
            ELSE 'Econômico'::text
        END AS categoria_valor_venda,
        CASE
            WHEN (c.data_cancelamento IS NOT NULL) THEN 'Cancelado'::text
            WHEN (c.saldo_devedor <= (0)::numeric) THEN 'Adimplente'::text
            WHEN (c.percentual_pago >= (80)::numeric) THEN 'Baixo Risco'::text
            WHEN (c.percentual_pago >= (50)::numeric) THEN 'Médio Risco'::text
            WHEN (c.percentual_pago >= (20)::numeric) THEN 'Alto Risco'::text
            ELSE 'Crítico'::text
        END AS categoria_risco,
    (((((((((
        CASE
            WHEN ((c.numero_contrato IS NOT NULL) AND (c.numero_contrato <> ''::text)) THEN 1
            ELSE 0
        END +
        CASE
            WHEN (c.data_contrato IS NOT NULL) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (c.valor_venda_total > (0)::numeric) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (cl.cliente_id IS NOT NULL) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (e.empreendimento_id IS NOT NULL) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (count(u.unidade_id) > 0) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (c.forma_pagamento_principal IS NOT NULL) THEN 1
            ELSE 0
        END))::numeric * 100.0) / (7)::numeric) AS completude_score,
        CASE
            WHEN (cl.cliente_id IS NOT NULL) THEN true
            ELSE false
        END AS tem_cliente_vinculado,
        CASE
            WHEN (e.empreendimento_id IS NOT NULL) THEN true
            ELSE false
        END AS tem_empreendimento_vinculado,
        CASE
            WHEN (count(u.unidade_id) > 0) THEN true
            ELSE false
        END AS tem_unidades_vinculadas,
        CASE
            WHEN (c.tem_comissao = true) THEN true
            ELSE false
        END AS tem_comissao_configurada,
    c.clientes_json,
    c.unidades_json,
    c.condicoes_pagamento_json,
    c.corretores_json,
    c.comissoes_json,
    CURRENT_TIMESTAMP AS data_processamento,
    c.data_atualizacao AS ultima_atualizacao_contrato
   FROM (((silver.rpt_sienge_contratos c
     LEFT JOIN silver.rpt_sienge_clientes cl ON ((cl.cliente_id = c.cliente_principal_id)))
     LEFT JOIN silver.rpt_sienge_empreendimentos e ON ((e.empreendimento_id = c.empreendimento_id)))
     LEFT JOIN ( SELECT cu.contrato_id AS cu_contrato_id,
            u_1.unidade_id,
            u_1.unidade_nome,
            u_1.tipo_imovel,
            u_1.estoque_comercial,
            u_1.area_privativa,
            u_1.area_comum,
            u_1.area_terreno,
            u_1.valor_terreno,
            u_1.data_entrega
           FROM (bronze.contrato_unidades cu
             JOIN silver.rpt_sienge_unidades u_1 ON ((u_1.unidade_id = cu.unidade_sienge_id)))) u ON ((u.cu_contrato_id = c.contrato_id)))
  GROUP BY c.contrato_id, c.numero_contrato, c.id_externo, c.situacao, c.status_contrato, c.categoria_valor, c.data_contrato, c.data_emissao, c.data_contabilizacao, c.data_entrega_prevista, c.data_entrega_chaves, c.data_cancelamento, c.data_cadastro, c.valor_contrato, c.valor_venda_total, c.valor_cancelamento, c.valor_total_calculado, c.valor_total_pago, c.saldo_devedor, c.percentual_pago, c.total_parcelas, c.parcelas_pagas, c.forma_pagamento_principal, c.indexador_principal, c.tem_financiamento, c.total_condicoes_pagamento, c.tipo_desconto, c.percentual_desconto, c.tipo_correcao, c.tipo_juros, c.percentual_juros, c.tem_comissao, c.total_comissoes, c.valor_total_comissao, c.faixa_valor_comissao, c.percentual_comissao_sobre_contrato, cl.cliente_id, cl.nome_completo, cl.nome_social, cl.cpf_cnpj_limpo, cl.tipo_pessoa, cl.email_validado, cl.telefone_principal, cl.cidade, cl.estado, cl.idade_atual, cl.faixa_etaria, cl.categoria_tempo_cliente, cl.qualidade_score, e.empreendimento_id, e.empreendimento_nome, e.nome_comercial, e.tipo_empreendimento, e.endereco, e.categoria_tipo, e.categoria_porte, e.status_empreendimento, e.total_unidades, e.total_contratos, e.qualidade_score, c.empresa_id, c.empresa_nome, c.clientes_json, c.unidades_json, c.condicoes_pagamento_json, c.corretores_json, c.comissoes_json, c.data_atualizacao
  ORDER BY c.data_contrato DESC, c.contrato_id
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW vendas_360; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON MATERIALIZED VIEW gold.vendas_360 IS 'View Gold 360° de vendas: integra contratos, clientes, empreendimentos e unidades em visão completa para análise de vendas';


--
-- Name: COLUMN vendas_360.valor_por_m2; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.vendas_360.valor_por_m2 IS 'Valor de venda por metro quadrado de área privativa';


--
-- Name: COLUMN vendas_360.situacao_detalhada; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.vendas_360.situacao_detalhada IS 'Status detalhado derivado: Cancelado, Entregue, Quitado, Atrasado, Em Andamento, Início Pagamento, Novo';


--
-- Name: COLUMN vendas_360.categoria_valor_venda; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.vendas_360.categoria_valor_venda IS 'Categorização por valor: Premium (≥1M), Alto (≥500k), Médio (≥200k), Baixo (≥100k), Econômico (<100k)';


--
-- Name: COLUMN vendas_360.categoria_risco; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.vendas_360.categoria_risco IS 'Análise de risco: Adimplente, Baixo Risco (≥80% pago), Médio Risco (≥50%), Alto Risco (≥20%), Crítico (<20%)';


--
-- Name: COLUMN vendas_360.completude_score; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.vendas_360.completude_score IS 'Score de completude baseado em 7 critérios essenciais (0-100)';


--
-- Name: clientes_360; Type: MATERIALIZED VIEW; Schema: gold; Owner: -
--

CREATE MATERIALIZED VIEW gold.clientes_360 AS
 SELECT 'clientes'::text AS domain_type,
    (cl.cliente_id)::text AS unique_id,
    cl.data_cadastro AS data_principal,
    EXTRACT(year FROM cl.data_cadastro) AS ano,
    EXTRACT(month FROM cl.data_cadastro) AS mes,
    to_char(cl.data_cadastro, 'YYYY-MM'::text) AS ano_mes,
    cl.cliente_id,
    cl.nome_completo,
    cl.nome_social,
    cl.nome_fantasia,
    cl.razao_social,
    cl.codigo_interno,
    cl.tipo_pessoa,
    cl.ativo,
    cl.estrangeiro,
    cl.cpf_cnpj_limpo,
    cl.cnpj_limpo,
    cl.rg_limpo,
    cl.eh_cpf,
    cl.eh_cnpj,
    cl.tem_documento_valido,
    cl.data_nascimento,
    cl.idade_atual,
    cl.faixa_etaria,
    cl.nacionalidade,
    cl.sexo,
    cl.local_nascimento,
    cl.nome_pai,
    cl.nome_mae,
    cl.estado_civil,
    cl.profissao,
    cl.email_validado,
    cl.tem_email_valido,
    cl.telefone_principal,
    cl.tipo_telefone_principal,
    cl.total_telefones,
    cl.endereco_principal,
    cl.cidade,
    cl.estado,
    cl.cep,
    cl.total_enderecos,
    cl.tem_endereco_valido,
    cl.tem_conjuge,
    cl.nome_conjuge,
    cl.cpf_conjuge_limpo,
    cl.data_cadastro,
    cl.data_atualizacao,
    cl.dias_como_cliente,
    cl.categoria_tempo_cliente,
    cl.tem_nome_valido,
    cl.tem_telefone_valido,
    cl.tem_data_nascimento_valida,
    cl.qualidade_score,
    count(DISTINCT c.contrato_id) AS total_contratos,
    count(DISTINCT c.contrato_id) FILTER (WHERE (c.situacao_detalhada <> 'Cancelado'::text)) AS contratos_ativos,
    count(DISTINCT c.contrato_id) FILTER (WHERE (c.situacao_detalhada = 'Cancelado'::text)) AS contratos_cancelados,
    count(DISTINCT c.contrato_id) FILTER (WHERE (c.situacao_detalhada = 'Entregue'::text)) AS contratos_entregues,
    count(DISTINCT c.contrato_id) FILTER (WHERE (c.situacao_detalhada = ANY (ARRAY['Em Andamento'::text, 'Início Pagamento'::text]))) AS contratos_em_andamento,
    min(c.data_contrato) AS primeiro_contrato_data,
    max(c.data_contrato) AS ultimo_contrato_data,
    string_agg(DISTINCT c.numero_contrato, '; '::text ORDER BY c.numero_contrato) AS numeros_contratos,
    COALESCE(sum(c.valor_venda_total), (0)::numeric) AS valor_total_contratos,
    COALESCE(sum(c.valor_total_pago), (0)::numeric) AS valor_total_pago,
    COALESCE(sum(c.saldo_devedor), (0)::numeric) AS saldo_devedor_total,
    COALESCE(avg(c.valor_venda_total), (0)::numeric) AS valor_medio_contrato,
        CASE
            WHEN (sum(c.valor_venda_total) > (0)::numeric) THEN round(((sum(c.valor_total_pago) / sum(c.valor_venda_total)) * (100)::numeric), 2)
            ELSE (0)::numeric
        END AS percentual_pago_geral,
    count(DISTINCT p.unidade_id) AS total_unidades_adquiridas,
    string_agg(DISTINCT p.categoria_tipo, '; '::text ORDER BY p.categoria_tipo) AS tipos_unidades,
    string_agg(DISTINCT p.empreendimento_nome, '; '::text ORDER BY p.empreendimento_nome) AS empreendimentos,
    COALESCE(sum(p.area_privativa), (0)::numeric) AS area_privativa_total,
    COALESCE(avg(p.area_privativa), (0)::numeric) AS area_privativa_media,
    COALESCE(sum(p.area_total), (0)::numeric) AS area_total_adquirida,
    COALESCE(sum(p.valor_terreno), (0)::numeric) AS valor_terreno_total_unidades,
    COALESCE(avg(p.valor_por_m2), (0)::numeric) AS valor_medio_m2,
    count(DISTINCT p.unidade_id) FILTER (WHERE (p.status_unidade = 'Entregue'::text)) AS unidades_entregues,
    count(DISTINCT p.unidade_id) FILTER (WHERE (p.status_unidade = 'Em Construção'::text)) AS unidades_em_construcao,
    count(DISTINCT p.unidade_id) FILTER (WHERE (p.status_unidade = 'Vendida'::text)) AS unidades_vendidas,
        CASE
            WHEN (COALESCE(avg(c.valor_venda_total), (0)::numeric) >= (1000000)::numeric) THEN 'VIP'::text
            WHEN (COALESCE(avg(c.valor_venda_total), (0)::numeric) >= (500000)::numeric) THEN 'Premium'::text
            WHEN (COALESCE(avg(c.valor_venda_total), (0)::numeric) >= (200000)::numeric) THEN 'Alto Valor'::text
            WHEN (COALESCE(avg(c.valor_venda_total), (0)::numeric) >= (100000)::numeric) THEN 'Padrão'::text
            WHEN (COALESCE(avg(c.valor_venda_total), (0)::numeric) > (0)::numeric) THEN 'Econômico'::text
            ELSE 'Sem Compras'::text
        END AS categoria_cliente,
        CASE
            WHEN (count(DISTINCT c.contrato_id) FILTER (WHERE (c.categoria_risco = ANY (ARRAY['Alto Risco'::text, 'Crítico'::text]))) > 0) THEN 'Alto Risco'::text
            WHEN ((COALESCE(sum(c.saldo_devedor), (0)::numeric) > (0)::numeric) AND (COALESCE(sum(c.valor_venda_total), (0)::numeric) > (0)::numeric) AND ((sum(c.saldo_devedor) / sum(c.valor_venda_total)) > 0.3)) THEN 'Médio Risco'::text
            WHEN (count(DISTINCT c.contrato_id) FILTER (WHERE (c.situacao_detalhada = 'Cancelado'::text)) > 0) THEN 'Risco Histórico'::text
            ELSE 'Baixo Risco'::text
        END AS categoria_risco_credito,
        CASE
            WHEN (count(DISTINCT c.contrato_id) >= 5) THEN 'Comprador Frequente'::text
            WHEN (count(DISTINCT c.contrato_id) >= 3) THEN 'Comprador Recorrente'::text
            WHEN (count(DISTINCT c.contrato_id) >= 2) THEN 'Comprador Eventual'::text
            WHEN (count(DISTINCT c.contrato_id) = 1) THEN 'Comprador Único'::text
            ELSE 'Sem Compras'::text
        END AS perfil_compra,
        CASE
            WHEN ((cl.dias_como_cliente > (0)::numeric) AND (count(DISTINCT c.contrato_id) > 0)) THEN round((cl.dias_como_cliente / (count(DISTINCT c.contrato_id))::numeric), 0)
            ELSE NULL::numeric
        END AS dias_media_entre_compras,
        CASE
            WHEN (cl.idade_atual IS NULL) THEN 'Idade Não Informada'::text
            WHEN ((cl.idade_atual < (30)::numeric) AND (COALESCE(avg(c.valor_venda_total), (0)::numeric) >= (300000)::numeric)) THEN 'Jovem Alto Poder'::text
            WHEN (cl.idade_atual < (30)::numeric) THEN 'Jovem'::text
            WHEN ((cl.idade_atual < (50)::numeric) AND (COALESCE(avg(c.valor_venda_total), (0)::numeric) >= (500000)::numeric)) THEN 'Adulto Alto Poder'::text
            WHEN (cl.idade_atual < (50)::numeric) THEN 'Adulto'::text
            WHEN ((cl.idade_atual >= (50)::numeric) AND (COALESCE(avg(c.valor_venda_total), (0)::numeric) >= (500000)::numeric)) THEN 'Sênior Alto Poder'::text
            WHEN (cl.idade_atual >= (50)::numeric) THEN 'Sênior'::text
            ELSE 'Não Classificado'::text
        END AS segmento_demografico,
    ((
        CASE
            WHEN (COALESCE(sum(c.valor_venda_total), (0)::numeric) >= (1000000)::numeric) THEN 4
            WHEN (COALESCE(sum(c.valor_venda_total), (0)::numeric) >= (500000)::numeric) THEN 3
            WHEN (COALESCE(sum(c.valor_venda_total), (0)::numeric) >= (200000)::numeric) THEN 2
            WHEN (COALESCE(sum(c.valor_venda_total), (0)::numeric) > (0)::numeric) THEN 1
            ELSE 0
        END +
        CASE
            WHEN (count(DISTINCT c.contrato_id) >= 3) THEN 3
            WHEN (count(DISTINCT c.contrato_id) = 2) THEN 2
            WHEN (count(DISTINCT c.contrato_id) = 1) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN ((COALESCE(sum(c.valor_venda_total), (0)::numeric) > (0)::numeric) AND ((COALESCE(sum(c.valor_total_pago), (0)::numeric) / sum(c.valor_venda_total)) >= 0.8)) THEN 3
            WHEN ((COALESCE(sum(c.valor_venda_total), (0)::numeric) > (0)::numeric) AND ((COALESCE(sum(c.valor_total_pago), (0)::numeric) / sum(c.valor_venda_total)) >= 0.5)) THEN 2
            WHEN ((COALESCE(sum(c.valor_venda_total), (0)::numeric) > (0)::numeric) AND ((COALESCE(sum(c.valor_total_pago), (0)::numeric) / sum(c.valor_venda_total)) > (0)::numeric)) THEN 1
            ELSE 0
        END) AS score_valor_cliente,
        CASE
            WHEN (count(DISTINCT c.contrato_id) > 0) THEN true
            ELSE false
        END AS tem_historico_compras,
        CASE
            WHEN (count(DISTINCT c.contrato_id) FILTER (WHERE (c.situacao_detalhada = 'Cancelado'::text)) > 0) THEN true
            ELSE false
        END AS tem_cancelamentos,
        CASE
            WHEN (COALESCE(sum(c.saldo_devedor), (0)::numeric) > (0)::numeric) THEN true
            ELSE false
        END AS tem_saldo_devedor,
        CASE
            WHEN (count(DISTINCT p.unidade_id) > 0) THEN true
            ELSE false
        END AS tem_unidades_vinculadas,
    cl.telefones_json,
    cl.enderecos_json,
    cl.procuradores_json,
    cl.contatos_json,
    cl.conjuge_json,
    cl.renda_familiar_json,
    cl.subtipos_json,
    cl.estado_civil_json,
    CURRENT_TIMESTAMP AS data_processamento
   FROM ((silver.rpt_sienge_clientes cl
     LEFT JOIN gold.vendas_360 c ON ((c.cliente_id = cl.cliente_id)))
     LEFT JOIN gold.portfolio_imobiliario p ON ((p.contrato_id = c.contrato_id)))
  GROUP BY cl.cliente_id, cl.nome_completo, cl.nome_social, cl.nome_fantasia, cl.razao_social, cl.codigo_interno, cl.tipo_pessoa, cl.ativo, cl.estrangeiro, cl.cpf_cnpj_limpo, cl.cnpj_limpo, cl.rg_limpo, cl.eh_cpf, cl.eh_cnpj, cl.tem_documento_valido, cl.data_nascimento, cl.idade_atual, cl.faixa_etaria, cl.nacionalidade, cl.sexo, cl.local_nascimento, cl.nome_pai, cl.nome_mae, cl.estado_civil, cl.profissao, cl.email_validado, cl.tem_email_valido, cl.telefone_principal, cl.tipo_telefone_principal, cl.total_telefones, cl.endereco_principal, cl.cidade, cl.estado, cl.cep, cl.total_enderecos, cl.tem_endereco_valido, cl.tem_conjuge, cl.nome_conjuge, cl.cpf_conjuge_limpo, cl.data_cadastro, cl.data_atualizacao, cl.dias_como_cliente, cl.categoria_tempo_cliente, cl.tem_nome_valido, cl.tem_telefone_valido, cl.tem_data_nascimento_valida, cl.qualidade_score, cl.telefones_json, cl.enderecos_json, cl.procuradores_json, cl.contatos_json, cl.conjuge_json, cl.renda_familiar_json, cl.subtipos_json, cl.estado_civil_json
  ORDER BY COALESCE(sum(c.valor_venda_total), (0)::numeric) DESC, cl.data_cadastro DESC
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW clientes_360; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON MATERIALIZED VIEW gold.clientes_360 IS 'View Gold 360° de clientes: perfil completo com histórico de contratos, unidades e análises comportamentais';


--
-- Name: COLUMN clientes_360.categoria_cliente; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.clientes_360.categoria_cliente IS 'Categorização por valor: VIP (≥1M), Premium (≥500k), Alto Valor (≥200k), Padrão (≥100k), Econômico (<100k)';


--
-- Name: COLUMN clientes_360.categoria_risco_credito; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.clientes_360.categoria_risco_credito IS 'Risco de crédito: Alto Risco, Médio Risco, Risco Histórico, Baixo Risco';


--
-- Name: COLUMN clientes_360.perfil_compra; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.clientes_360.perfil_compra IS 'Perfil de compra: Frequente (≥5), Recorrente (≥3), Eventual (≥2), Único (1), Sem Compras (0)';


--
-- Name: COLUMN clientes_360.segmento_demografico; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.clientes_360.segmento_demografico IS 'Segmentação por idade e poder aquisitivo: Jovem/Adulto/Sênior + Alto Poder';


--
-- Name: COLUMN clientes_360.score_valor_cliente; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.clientes_360.score_valor_cliente IS 'Score de valor (0-10): combinação de valor de compras, frequência e performance de pagamento';


--
-- Name: rpt_sienge_financeiro; Type: MATERIALIZED VIEW; Schema: silver; Owner: -
--

CREATE MATERIALIZED VIEW silver.rpt_sienge_financeiro AS
 WITH apropriacao_principal AS (
         SELECT DISTINCT ON (ea.extrato_conta_id) ea.extrato_conta_id,
            ea.centro_custo_id,
            ea.plano_financeiro_id,
            ea.percentual AS percentual_apropriacao,
            ea.valor_apropriado,
            cc.nome AS centro_custo_nome,
            pf.nome AS plano_financeiro_nome
           FROM ((bronze.extrato_apropriacoes ea
             LEFT JOIN bronze.centro_custos cc ON ((ea.centro_custo_id = cc.id)))
             LEFT JOIN bronze.planos_financeiros pf ON ((ea.plano_financeiro_id = pf.id)))
          ORDER BY ea.extrato_conta_id, ea.percentual DESC, ea.id
        )
 SELECT 'financeiro'::text AS domain_type,
    (ec.id)::text AS unique_id,
    ec.data AS data_principal,
    (EXTRACT(year FROM ec.data))::text AS ano,
    (EXTRACT(quarter FROM ec.data))::integer AS trimestre,
    (EXTRACT(month FROM ec.data))::text AS mes,
    to_char(ec.data, 'YYYY-MM'::text) AS ano_mes,
    ec.valor AS valor_extrato,
    ec.origem_extrato,
        CASE
            WHEN (ec.tipo = 'Income'::text) THEN 'Receita'::text
            WHEN (ec.tipo = 'Expense'::text) THEN 'Despesa'::text
            ELSE 'Transferência'::text
        END AS classificacao_fluxo,
        CASE
            WHEN (abs(ec.valor) = (0)::numeric) THEN 'Zero'::text
            WHEN (abs(ec.valor) < (1000)::numeric) THEN 'Até 1k'::text
            WHEN (abs(ec.valor) < (5000)::numeric) THEN '1k-5k'::text
            WHEN (abs(ec.valor) < (10000)::numeric) THEN '5k-10k'::text
            WHEN (abs(ec.valor) < (50000)::numeric) THEN '10k-50k'::text
            ELSE 'Acima de 50k'::text
        END AS faixa_valor_extrato,
    COALESCE(ap.centro_custo_nome, 'Não informado'::text) AS centro_custo_nome,
    COALESCE(ap.plano_financeiro_nome, 'Não informado'::text) AS plano_financeiro_nome,
    ec.tipo AS tipo_original,
    ec.descricao AS descricao_extrato,
    ec.beneficiario,
    ec.saldo AS saldo_conta,
    ec.conciliado AS conta_conciliada,
    ec.referencia AS referencia_documento,
    ec.documento_id AS documento_relacionado_id,
    ec.data_reconciliacao AS data_reconciliacao_bancaria,
    ec.titulo_id AS titulo_pagar_id,
    ec.conta_id AS conta_bancaria_id,
    ec.tags AS tags_categorizacao,
    ec.categorias_orcamentarias,
    ec.numero_documento,
    ec.numero_parcela,
    ec.tipo_extrato AS categoria_extrato,
    ec.observacoes_extrato AS observacoes,
    ap.centro_custo_id,
    ap.plano_financeiro_id,
    ap.percentual_apropriacao,
    ap.valor_apropriado,
    ec.empresa_id,
    ec.created_at AS data_criacao_registro,
    ec.updated_at AS data_atualizacao_registro,
        CASE
            WHEN (ec.conciliado = true) THEN 'Conciliado'::text
            WHEN (ec.data_reconciliacao IS NOT NULL) THEN 'Em Processo'::text
            ELSE 'Pendente'::text
        END AS status_conciliacao,
        CASE
            WHEN (ec.valor > (0)::numeric) THEN 'Entrada'::text
            WHEN (ec.valor < (0)::numeric) THEN 'Saída'::text
            ELSE 'Neutro'::text
        END AS movimento_caixa,
    (CURRENT_DATE - (ec.data)::date) AS dias_desde_lancamento,
        CASE
            WHEN ((ec.data)::date > CURRENT_DATE) THEN 'Futuro'::text
            WHEN ((ec.data)::date = CURRENT_DATE) THEN 'Hoje'::text
            WHEN ((ec.data)::date >= (CURRENT_DATE - '7 days'::interval)) THEN 'Última Semana'::text
            WHEN ((ec.data)::date >= (CURRENT_DATE - '30 days'::interval)) THEN 'Último Mês'::text
            WHEN ((ec.data)::date >= (CURRENT_DATE - '90 days'::interval)) THEN 'Último Trimestre'::text
            ELSE 'Mais Antigo'::text
        END AS periodo_lancamento
   FROM (bronze.extrato_contas ec
     LEFT JOIN apropriacao_principal ap ON ((ec.id = ap.extrato_conta_id)))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW rpt_sienge_financeiro; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON MATERIALIZED VIEW silver.rpt_sienge_financeiro IS 'View financeira completa com todos os 12 campos ausentes críticos - v1.0';


--
-- Name: performance_financeira; Type: MATERIALIZED VIEW; Schema: gold; Owner: -
--

CREATE MATERIALIZED VIEW gold.performance_financeira AS
 SELECT 'financeiro'::text AS domain_type,
    f.unique_id,
    f.data_principal,
    f.ano,
    f.mes,
    f.ano_mes,
    f.valor_extrato,
    f.origem_extrato,
    f.classificacao_fluxo,
    f.descricao_extrato,
    f.centro_custo_nome,
    f.empresa_id,
    f.trimestre,
    f.numero_parcela,
    f.centro_custo_id,
    f.titulo_pagar_id,
    f.conta_bancaria_id,
    f.percentual_apropriacao,
    f.valor_apropriado,
    f.saldo_conta,
    f.faixa_valor_extrato,
    f.categoria_extrato,
    f.tipo_original,
    f.beneficiario,
    f.numero_documento,
    f.observacoes,
    f.plano_financeiro_nome,
    f.plano_financeiro_id,
    f.referencia_documento,
    f.documento_relacionado_id,
    f.status_conciliacao,
    f.movimento_caixa,
    f.periodo_lancamento,
    f.data_criacao_registro,
    f.data_atualizacao_registro,
    f.data_reconciliacao_bancaria,
    f.tags_categorizacao,
    f.categorias_orcamentarias,
    f.dias_desde_lancamento,
    f.conta_conciliada,
        CASE
            WHEN (f.valor_extrato > (0)::numeric) THEN 'Entrada'::text
            WHEN (f.valor_extrato < (0)::numeric) THEN 'Saída'::text
            ELSE 'Neutro'::text
        END AS tipo_movimento,
        CASE
            WHEN (abs(f.valor_extrato) >= (100000)::numeric) THEN 'Alto Valor'::text
            WHEN (abs(f.valor_extrato) >= (10000)::numeric) THEN 'Médio Valor'::text
            WHEN (abs(f.valor_extrato) >= (1000)::numeric) THEN 'Baixo Valor'::text
            WHEN (abs(f.valor_extrato) > (0)::numeric) THEN 'Muito Baixo'::text
            ELSE 'Zero'::text
        END AS categoria_valor,
        CASE
            WHEN (f.mes = ANY (ARRAY['1'::text, '2'::text, '12'::text])) THEN 'Verão'::text
            WHEN (f.mes = ANY (ARRAY['3'::text, '4'::text, '5'::text])) THEN 'Outono'::text
            WHEN (f.mes = ANY (ARRAY['6'::text, '7'::text, '8'::text])) THEN 'Inverno'::text
            WHEN (f.mes = ANY (ARRAY['9'::text, '10'::text, '11'::text])) THEN 'Primavera'::text
            ELSE NULL::text
        END AS estacao,
        CASE
            WHEN (f.mes = ANY (ARRAY['1'::text, '7'::text, '12'::text])) THEN 'Alta Temporada'::text
            WHEN (f.mes = ANY (ARRAY['2'::text, '6'::text, '11'::text])) THEN 'Média Temporada'::text
            ELSE 'Baixa Temporada'::text
        END AS sazonalidade,
        CASE
            WHEN (f.conta_conciliada = true) THEN 'Conciliado'::text
            WHEN (f.status_conciliacao IS NOT NULL) THEN f.status_conciliacao
            ELSE 'Não Conciliado'::text
        END AS status_liquidez,
        CASE
            WHEN (f.dias_desde_lancamento <= 30) THEN 'Recente'::text
            WHEN (f.dias_desde_lancamento <= 90) THEN 'Normal'::text
            WHEN (f.dias_desde_lancamento <= 180) THEN 'Antigo'::text
            ELSE 'Muito Antigo'::text
        END AS idade_lancamento,
    ((
        CASE
            WHEN (abs(f.valor_extrato) >= (100000)::numeric) THEN 4
            WHEN (abs(f.valor_extrato) >= (50000)::numeric) THEN 3
            WHEN (abs(f.valor_extrato) >= (10000)::numeric) THEN 2
            WHEN (abs(f.valor_extrato) >= (1000)::numeric) THEN 1
            ELSE 0
        END +
        CASE
            WHEN (f.classificacao_fluxo ~~* '%receita%'::text) THEN 2
            WHEN ((f.classificacao_fluxo ~~* '%custo%'::text) OR (f.classificacao_fluxo ~~* '%despesa%'::text)) THEN 1
            ELSE 0
        END) +
        CASE
            WHEN (f.conta_conciliada = true) THEN 1
            ELSE 0
        END) AS score_importancia_financeira,
    CURRENT_TIMESTAMP AS data_processamento
   FROM silver.rpt_sienge_financeiro f
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW performance_financeira; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON MATERIALIZED VIEW gold.performance_financeira IS 'View Gold de performance financeira: análise integrada de fluxo de caixa com métricas operacionais';


--
-- Name: COLUMN performance_financeira.tipo_movimento; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.performance_financeira.tipo_movimento IS 'Tipo de movimento: Entrada, Saída, Neutro';


--
-- Name: COLUMN performance_financeira.score_importancia_financeira; Type: COMMENT; Schema: gold; Owner: -
--

COMMENT ON COLUMN gold.performance_financeira.score_importancia_financeira IS 'Score de importância (0-7): valor + tipo de movimento + status de conciliação';


--
-- Name: performance_financeira; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.performance_financeira AS
 SELECT performance_financeira.domain_type,
    performance_financeira.unique_id,
    performance_financeira.data_principal,
    performance_financeira.ano,
    performance_financeira.mes,
    performance_financeira.ano_mes,
    performance_financeira.valor_extrato,
    performance_financeira.origem_extrato,
    performance_financeira.classificacao_fluxo,
    performance_financeira.descricao_extrato,
    performance_financeira.centro_custo_nome,
    performance_financeira.empresa_id,
    performance_financeira.trimestre,
    performance_financeira.numero_parcela,
    performance_financeira.centro_custo_id,
    performance_financeira.titulo_pagar_id,
    performance_financeira.conta_bancaria_id,
    performance_financeira.percentual_apropriacao,
    performance_financeira.valor_apropriado,
    performance_financeira.saldo_conta,
    performance_financeira.faixa_valor_extrato,
    performance_financeira.categoria_extrato,
    performance_financeira.tipo_original,
    performance_financeira.beneficiario,
    performance_financeira.numero_documento,
    performance_financeira.observacoes,
    performance_financeira.plano_financeiro_nome,
    performance_financeira.plano_financeiro_id,
    performance_financeira.referencia_documento,
    performance_financeira.documento_relacionado_id,
    performance_financeira.status_conciliacao,
    performance_financeira.movimento_caixa,
    performance_financeira.periodo_lancamento,
    performance_financeira.data_criacao_registro,
    performance_financeira.data_atualizacao_registro,
    performance_financeira.data_reconciliacao_bancaria,
    performance_financeira.tags_categorizacao,
    performance_financeira.categorias_orcamentarias,
    performance_financeira.dias_desde_lancamento,
    performance_financeira.conta_conciliada,
    performance_financeira.tipo_movimento,
    performance_financeira.categoria_valor,
    performance_financeira.estacao,
    performance_financeira.sazonalidade,
    performance_financeira.status_liquidez,
    performance_financeira.idade_lancamento,
    performance_financeira.score_importancia_financeira,
    performance_financeira.data_processamento
   FROM gold.performance_financeira;


--
-- Name: rpt_sienge_core; Type: MATERIALIZED VIEW; Schema: silver; Owner: -
--

CREATE MATERIALIZED VIEW silver.rpt_sienge_core AS
 SELECT 'clientes'::text AS domain_type,
    (c."idCliente")::text AS unique_id,
    c."dataCadastro" AS data_principal,
    EXTRACT(year FROM c."dataCadastro") AS ano,
    EXTRACT(month FROM c."dataCadastro") AS mes,
    to_char(c."dataCadastro", 'YYYY-MM'::text) AS ano_mes,
    c."idCliente" AS cliente_id,
    c.name AS cliente_nome,
    COALESCE(c."cpfCnpj", c.cnpj) AS cliente_cpf_cnpj,
    c.email AS cliente_email,
    c.telefone_principal AS cliente_telefone,
    NULL::integer AS empresa_id,
    NULL::character varying AS empresa_nome,
    NULL::character varying AS empresa_cnpj,
    NULL::integer AS empreendimento_id,
    NULL::character varying AS empreendimento_nome,
    NULL::character varying AS empreendimento_tipo,
    NULL::integer AS contrato_id,
    NULL::character varying AS contrato_numero,
    NULL::numeric AS valor_contrato,
    NULL::character varying AS status_contrato,
    NULL::integer AS unidade_id,
    NULL::character varying AS unidade_nome,
    NULL::character varying AS unidade_codigo,
    NULL::character varying AS unidade_tipo,
    NULL::integer AS titulo_id,
    NULL::numeric AS valor_titulo,
    NULL::character varying AS status_pagamento,
    NULL::character varying AS forma_pagamento,
    NULL::character varying AS tipo_titulo,
    c."dataCadastro" AS data_cadastro,
    c."dataAtualizacao" AS data_atualizacao
   FROM bronze.clientes c
UNION ALL
 SELECT 'contratos'::text AS domain_type,
    (cv.id)::text AS unique_id,
    COALESCE(cv."contractDate", cv."issueDate") AS data_principal,
    EXTRACT(year FROM COALESCE(cv."contractDate", cv."issueDate")) AS ano,
    EXTRACT(month FROM COALESCE(cv."contractDate", cv."issueDate")) AS mes,
    to_char(COALESCE(cv."contractDate", cv."issueDate"), 'YYYY-MM'::text) AS ano_mes,
    cv.cliente_principal_id AS cliente_id,
    cv.cliente_principal_nome AS cliente_nome,
    NULL::text AS cliente_cpf_cnpj,
    NULL::text AS cliente_email,
    NULL::text AS cliente_telefone,
    cv."companyId" AS empresa_id,
    e."nomeEmpresa" AS empresa_nome,
    e.cnpj AS empresa_cnpj,
    cv."enterpriseId" AS empreendimento_id,
    em.nome AS empreendimento_nome,
    em.tipo AS empreendimento_tipo,
    cv.id AS contrato_id,
    cv.number AS contrato_numero,
    cv.value AS valor_contrato,
    cv.situation AS status_contrato,
    (((cv."salesContractUnits" -> 0) ->> 'unitId'::text))::integer AS unidade_id,
    NULL::character varying AS unidade_nome,
    NULL::character varying AS unidade_codigo,
    NULL::character varying AS unidade_tipo,
    NULL::integer AS titulo_id,
    NULL::numeric AS valor_titulo,
    NULL::character varying AS status_pagamento,
    cv.forma_pagamento_principal AS forma_pagamento,
    NULL::character varying AS tipo_titulo,
    cv."dataCadastro" AS data_cadastro,
    cv."dataAtualizacao" AS data_atualizacao
   FROM ((bronze.contratos_venda cv
     LEFT JOIN bronze.empresas e ON ((cv."companyId" = e."idEmpresa")))
     LEFT JOIN bronze.empreendimentos em ON ((cv."enterpriseId" = em.id)))
  WITH NO DATA;


--
-- Name: rpt_sienge_validacao; Type: MATERIALIZED VIEW; Schema: silver; Owner: -
--

CREATE MATERIALIZED VIEW silver.rpt_sienge_validacao AS
 SELECT 'clientes'::text AS entidade,
    'cpf_invalido'::text AS tipo_validacao,
    c."idCliente" AS registro_id,
    c.name AS descricao_registro,
    'CPF com formato inválido ou dígitos verificadores incorretos'::text AS problema_detectado,
    'crítico'::text AS severidade,
    c."dataCadastro" AS data_registro,
    c."dataAtualizacao" AS data_atualizacao
   FROM bronze.clientes c
  WHERE ((c."cpfCnpj" IS NOT NULL) AND (TRIM(BOTH FROM c."cpfCnpj") <> ''::text) AND (length(regexp_replace(c."cpfCnpj", '[^0-9]'::text, ''::text, 'g'::text)) = 11) AND (regexp_replace(c."cpfCnpj", '[^0-9]'::text, ''::text, 'g'::text) ~ '^(.)\1{10}$'::text))
UNION ALL
 SELECT 'clientes'::text AS entidade,
    'cnpj_invalido'::text AS tipo_validacao,
    c."idCliente" AS registro_id,
    c.name AS descricao_registro,
    'CNPJ com formato inválido'::text AS problema_detectado,
    'crítico'::text AS severidade,
    c."dataCadastro" AS data_registro,
    c."dataAtualizacao" AS data_atualizacao
   FROM bronze.clientes c
  WHERE ((c.cnpj IS NOT NULL) AND (TRIM(BOTH FROM c.cnpj) <> ''::text) AND (length(regexp_replace(c.cnpj, '[^0-9]'::text, ''::text, 'g'::text)) <> 14))
UNION ALL
 SELECT 'clientes'::text AS entidade,
    'email_invalido'::text AS tipo_validacao,
    c."idCliente" AS registro_id,
    c.name AS descricao_registro,
    'E-mail com formato inválido'::text AS problema_detectado,
    'médio'::text AS severidade,
    c."dataCadastro" AS data_registro,
    c."dataAtualizacao" AS data_atualizacao
   FROM bronze.clientes c
  WHERE ((c.email IS NOT NULL) AND (TRIM(BOTH FROM c.email) <> ''::text) AND (NOT (c.email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)))
UNION ALL
 SELECT 'clientes'::text AS entidade,
    'dados_obrigatorios_ausentes'::text AS tipo_validacao,
    c."idCliente" AS registro_id,
    c.name AS descricao_registro,
    'Nome obrigatório não preenchido'::text AS problema_detectado,
    'crítico'::text AS severidade,
    c."dataCadastro" AS data_registro,
    c."dataAtualizacao" AS data_atualizacao
   FROM bronze.clientes c
  WHERE ((c.name IS NULL) OR (TRIM(BOTH FROM c.name) = ''::text))
UNION ALL
 SELECT 'empreendimentos'::text AS entidade,
    'nome_ausente'::text AS tipo_validacao,
    e.id AS registro_id,
    COALESCE(e.nome, 'SEM NOME'::text) AS descricao_registro,
    'Nome do empreendimento não preenchido'::text AS problema_detectado,
    'crítico'::text AS severidade,
    e."dataCadastro" AS data_registro,
    e."dataAtualizacao" AS data_atualizacao
   FROM bronze.empreendimentos e
  WHERE ((e.nome IS NULL) OR (TRIM(BOTH FROM e.nome) = ''::text))
UNION ALL
 SELECT 'empreendimentos'::text AS entidade,
    'cnpj_invalido'::text AS tipo_validacao,
    e.id AS registro_id,
    e.nome AS descricao_registro,
    'CNPJ com formato inválido'::text AS problema_detectado,
    'médio'::text AS severidade,
    e."dataCadastro" AS data_registro,
    e."dataAtualizacao" AS data_atualizacao
   FROM bronze.empreendimentos e
  WHERE ((e.cnpj IS NOT NULL) AND (TRIM(BOTH FROM e.cnpj) <> ''::text) AND (length(regexp_replace(e.cnpj, '[^0-9]'::text, ''::text, 'g'::text)) <> 14))
UNION ALL
 SELECT 'empreendimentos'::text AS entidade,
    'empresa_nao_vinculada'::text AS tipo_validacao,
    e.id AS registro_id,
    e.nome AS descricao_registro,
    'Empreendimento sem empresa vinculada'::text AS problema_detectado,
    'médio'::text AS severidade,
    e."dataCadastro" AS data_registro,
    e."dataAtualizacao" AS data_atualizacao
   FROM bronze.empreendimentos e
  WHERE (e."idEmpresa" IS NULL)
UNION ALL
 SELECT 'unidades'::text AS entidade,
    'area_invalida'::text AS tipo_validacao,
    u.id AS registro_id,
    u.nome AS descricao_registro,
    'Área privativa inválida (negativa ou zero)'::text AS problema_detectado,
    'médio'::text AS severidade,
    u."dataCadastro" AS data_registro,
    u."dataAtualizacao" AS data_atualizacao
   FROM bronze.unidades u
  WHERE ((u."areaPrivativa" IS NOT NULL) AND (u."areaPrivativa" <= (0)::numeric))
UNION ALL
 SELECT 'unidades'::text AS entidade,
    'valor_invalido'::text AS tipo_validacao,
    u.id AS registro_id,
    u.nome AS descricao_registro,
    'Valor do terreno inválido (negativo)'::text AS problema_detectado,
    'médio'::text AS severidade,
    u."dataCadastro" AS data_registro,
    u."dataAtualizacao" AS data_atualizacao
   FROM bronze.unidades u
  WHERE ((u."valorTerreno" IS NOT NULL) AND (u."valorTerreno" < (0)::numeric))
UNION ALL
 SELECT 'unidades'::text AS entidade,
    'coordenadas_invalidas'::text AS tipo_validacao,
    u.id AS registro_id,
    u.nome AS descricao_registro,
    'Coordenadas geográficas inválidas'::text AS problema_detectado,
    'baixo'::text AS severidade,
    u."dataCadastro" AS data_registro,
    u."dataAtualizacao" AS data_atualizacao
   FROM bronze.unidades u
  WHERE (((u.latitude IS NOT NULL) AND (NOT (u.latitude ~ '^-?[0-9]+\.?[0-9]*$'::text))) OR ((u.longitude IS NOT NULL) AND (NOT (u.longitude ~ '^-?[0-9]+\.?[0-9]*$'::text))) OR ((u.latitude IS NOT NULL) AND (abs((u.latitude)::numeric) > (90)::numeric)) OR ((u.longitude IS NOT NULL) AND (abs((u.longitude)::numeric) > (180)::numeric)))
UNION ALL
 SELECT 'unidades'::text AS entidade,
    'empreendimento_nao_vinculado'::text AS tipo_validacao,
    u.id AS registro_id,
    u.nome AS descricao_registro,
    'Unidade sem empreendimento vinculado'::text AS problema_detectado,
    'crítico'::text AS severidade,
    u."dataCadastro" AS data_registro,
    u."dataAtualizacao" AS data_atualizacao
   FROM bronze.unidades u
  WHERE (u."idEmpreendimento" IS NULL)
UNION ALL
 SELECT 'contratos_venda'::text AS entidade,
    'numero_contrato_ausente'::text AS tipo_validacao,
    cv.id AS registro_id,
    COALESCE(cv.number, (cv.id)::text) AS descricao_registro,
    'Número do contrato não preenchido'::text AS problema_detectado,
    'crítico'::text AS severidade,
    cv."contractDate" AS data_registro,
    cv."dataAtualizacao" AS data_atualizacao
   FROM bronze.contratos_venda cv
  WHERE ((cv.number IS NULL) OR (TRIM(BOTH FROM cv.number) = ''::text))
UNION ALL
 SELECT 'contratos_venda'::text AS entidade,
    'valor_total_invalido'::text AS tipo_validacao,
    cv.id AS registro_id,
    COALESCE(cv.number, (cv.id)::text) AS descricao_registro,
    'Valor total do contrato inválido (zero ou negativo)'::text AS problema_detectado,
    'crítico'::text AS severidade,
    cv."contractDate" AS data_registro,
    cv."dataAtualizacao" AS data_atualizacao
   FROM bronze.contratos_venda cv
  WHERE ((cv."totalSellingValue" IS NOT NULL) AND (cv."totalSellingValue" <= (0)::numeric))
UNION ALL
 SELECT 'contratos_venda'::text AS entidade,
    'data_contrato_invalida'::text AS tipo_validacao,
    cv.id AS registro_id,
    COALESCE(cv.number, (cv.id)::text) AS descricao_registro,
    'Data do contrato inválida (futura ou muito antiga)'::text AS problema_detectado,
    'médio'::text AS severidade,
    cv."contractDate" AS data_registro,
    cv."dataAtualizacao" AS data_atualizacao
   FROM bronze.contratos_venda cv
  WHERE ((cv."contractDate" IS NOT NULL) AND ((cv."contractDate" > (CURRENT_DATE + '1 year'::interval)) OR (cv."contractDate" < '1990-01-01'::date)))
UNION ALL
 SELECT 'contratos_venda'::text AS entidade,
    'unidades_nao_vinculadas'::text AS tipo_validacao,
    cv.id AS registro_id,
    COALESCE(cv.number, (cv.id)::text) AS descricao_registro,
    'Contrato sem unidades vinculadas'::text AS problema_detectado,
    'crítico'::text AS severidade,
    cv."contractDate" AS data_registro,
    cv."dataAtualizacao" AS data_atualizacao
   FROM bronze.contratos_venda cv
  WHERE (NOT (EXISTS ( SELECT 1
           FROM bronze.contrato_unidades cu
          WHERE (cu.contrato_id = cv.id))))
UNION ALL
 SELECT 'titulos_pagar'::text AS entidade,
    'valor_total_invalido'::text AS tipo_validacao,
    tp.id AS registro_id,
    COALESCE(tp.numero_documento, (tp.id)::text) AS descricao_registro,
    'Valor total inválido (zero ou negativo)'::text AS problema_detectado,
    'crítico'::text AS severidade,
    tp.data_emissao AS data_registro,
    tp.data_alteracao AS data_atualizacao
   FROM bronze.titulos_pagar tp
  WHERE ((tp.valor_total_nota IS NOT NULL) AND (tp.valor_total_nota <= (0)::numeric))
UNION ALL
 SELECT 'titulos_pagar'::text AS entidade,
    'numero_documento_ausente'::text AS tipo_validacao,
    tp.id AS registro_id,
    COALESCE(tp.numero_documento, (tp.id)::text) AS descricao_registro,
    'Número do documento não preenchido'::text AS problema_detectado,
    'médio'::text AS severidade,
    tp.data_emissao AS data_registro,
    tp.data_alteracao AS data_atualizacao
   FROM bronze.titulos_pagar tp
  WHERE ((tp.numero_documento IS NULL) OR (TRIM(BOTH FROM tp.numero_documento) = ''::text))
UNION ALL
 SELECT 'contrato_unidades'::text AS entidade,
    'unidade_inexistente'::text AS tipo_validacao,
    cu.contrato_id AS registro_id,
    ('Contrato: '::text || (cu.contrato_id)::text) AS descricao_registro,
    'Unidade referenciada não existe na tabela de unidades'::text AS problema_detectado,
    'crítico'::text AS severidade,
    CURRENT_TIMESTAMP AS data_registro,
    CURRENT_TIMESTAMP AS data_atualizacao
   FROM bronze.contrato_unidades cu
  WHERE (NOT (EXISTS ( SELECT 1
           FROM bronze.unidades u
          WHERE (u.id = cu.unidade_sienge_id))))
UNION ALL
 SELECT 'contrato_unidades'::text AS entidade,
    'contrato_inexistente'::text AS tipo_validacao,
    cu.unidade_sienge_id AS registro_id,
    ('Unidade: '::text || (cu.unidade_sienge_id)::text) AS descricao_registro,
    'Contrato referenciado não existe na tabela de contratos'::text AS problema_detectado,
    'crítico'::text AS severidade,
    CURRENT_TIMESTAMP AS data_registro,
    CURRENT_TIMESTAMP AS data_atualizacao
   FROM bronze.contrato_unidades cu
  WHERE (NOT (EXISTS ( SELECT 1
           FROM bronze.contratos_venda cv
          WHERE (cv.id = cu.contrato_id))))
UNION ALL
 SELECT 'unidades'::text AS entidade,
    'empreendimento_inexistente'::text AS tipo_validacao,
    u.id AS registro_id,
    u.nome AS descricao_registro,
    'Empreendimento referenciado não existe'::text AS problema_detectado,
    'crítico'::text AS severidade,
    u."dataCadastro" AS data_registro,
    u."dataAtualizacao" AS data_atualizacao
   FROM bronze.unidades u
  WHERE ((u."idEmpreendimento" IS NOT NULL) AND (NOT (EXISTS ( SELECT 1
           FROM bronze.empreendimentos e
          WHERE (e.id = u."idEmpreendimento")))))
  ORDER BY 6, 1, 2, 7 DESC
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW rpt_sienge_validacao; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON MATERIALIZED VIEW silver.rpt_sienge_validacao IS 'View de validação da camada Silver: identifica problemas de qualidade de dados em todas as entidades do Bronze';


--
-- Name: COLUMN rpt_sienge_validacao.entidade; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_validacao.entidade IS 'Nome da tabela/entidade onde foi detectado o problema';


--
-- Name: COLUMN rpt_sienge_validacao.tipo_validacao; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_validacao.tipo_validacao IS 'Tipo específico de validação que falhou';


--
-- Name: COLUMN rpt_sienge_validacao.problema_detectado; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_validacao.problema_detectado IS 'Descrição detalhada do problema identificado';


--
-- Name: COLUMN rpt_sienge_validacao.severidade; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_validacao.severidade IS 'Nível de severidade: crítico (dados inválidos), médio (dados suspeitos), baixo (dados incompletos)';


--
-- Name: rpt_sienge_qualidade; Type: MATERIALIZED VIEW; Schema: silver; Owner: -
--

CREATE MATERIALIZED VIEW silver.rpt_sienge_qualidade AS
 SELECT 'resumo_geral'::text AS categoria_analise,
    'overview'::text AS subcategoria,
    'qualidade_dados'::text AS metrica_tipo,
    'todas_entidades'::text AS entidade,
    CURRENT_TIMESTAMP AS data_analise,
    ( SELECT count(*) AS count
           FROM bronze.clientes) AS total_clientes,
    ( SELECT count(*) AS count
           FROM bronze.empreendimentos) AS total_empreendimentos,
    ( SELECT count(*) AS count
           FROM bronze.unidades) AS total_unidades,
    ( SELECT count(*) AS count
           FROM bronze.contratos_venda) AS total_contratos,
    ( SELECT count(*) AS count
           FROM bronze.titulos_pagar) AS total_titulos,
    ( SELECT count(*) AS count
           FROM silver.rpt_sienge_validacao
          WHERE (rpt_sienge_validacao.severidade = 'crítico'::text)) AS problemas_criticos,
    ( SELECT count(*) AS count
           FROM silver.rpt_sienge_validacao
          WHERE (rpt_sienge_validacao.severidade = 'médio'::text)) AS problemas_medios,
    ( SELECT count(*) AS count
           FROM silver.rpt_sienge_validacao
          WHERE (rpt_sienge_validacao.severidade = 'baixo'::text)) AS problemas_baixos,
    ( SELECT count(*) AS count
           FROM silver.rpt_sienge_validacao) AS total_problemas,
    round(((1.0 - (( SELECT (count(*))::numeric AS count
           FROM silver.rpt_sienge_validacao
          WHERE (rpt_sienge_validacao.severidade = 'crítico'::text)) / (GREATEST((((( SELECT count(*) AS count
           FROM bronze.clientes) + ( SELECT count(*) AS count
           FROM bronze.empreendimentos)) + ( SELECT count(*) AS count
           FROM bronze.unidades)) + ( SELECT count(*) AS count
           FROM bronze.contratos_venda)), (1)::bigint))::numeric)) * (100)::numeric), 2) AS percentual_qualidade_critica,
    round(((1.0 - (( SELECT (count(*))::numeric AS count
           FROM silver.rpt_sienge_validacao) / (GREATEST((((( SELECT count(*) AS count
           FROM bronze.clientes) + ( SELECT count(*) AS count
           FROM bronze.empreendimentos)) + ( SELECT count(*) AS count
           FROM bronze.unidades)) + ( SELECT count(*) AS count
           FROM bronze.contratos_venda)), (1)::bigint))::numeric)) * (100)::numeric), 2) AS percentual_qualidade_geral,
    ( SELECT round(avg(rpt_sienge_clientes.qualidade_score), 2) AS round
           FROM silver.rpt_sienge_clientes) AS score_medio_clientes,
    ( SELECT round(avg(rpt_sienge_empreendimentos.qualidade_score), 2) AS round
           FROM silver.rpt_sienge_empreendimentos) AS score_medio_empreendimentos,
    ( SELECT round(avg(rpt_sienge_unidades.qualidade_score), 2) AS round
           FROM silver.rpt_sienge_unidades) AS score_medio_unidades,
    ( SELECT round(avg(rpt_sienge_contratos.qualidade_score), 2) AS round
           FROM silver.rpt_sienge_contratos) AS score_medio_contratos,
    ( SELECT min(clientes."dataCadastro") AS min
           FROM bronze.clientes) AS data_primeiro_cliente,
    ( SELECT max(clientes."dataCadastro") AS max
           FROM bronze.clientes) AS data_ultimo_cliente,
    ( SELECT min(empreendimentos."dataCadastro") AS min
           FROM bronze.empreendimentos) AS data_primeiro_empreendimento,
    ( SELECT max(empreendimentos."dataCadastro") AS max
           FROM bronze.empreendimentos) AS data_ultimo_empreendimento,
    ( SELECT count(*) AS count
           FROM bronze.unidades
          WHERE (unidades."idEmpreendimento" IS NOT NULL)) AS unidades_com_empreendimento,
    ( SELECT count(*) AS count
           FROM bronze.contratos_venda cv
          WHERE (EXISTS ( SELECT 1
                   FROM bronze.contrato_unidades cu
                  WHERE (cu.contrato_id = cv.id)))) AS contratos_com_unidades,
    ( SELECT count(*) AS count
           FROM bronze.clientes
          WHERE ((clientes.name IS NOT NULL) AND (TRIM(BOTH FROM clientes.name) <> ''::text))) AS clientes_com_nome,
    ( SELECT count(*) AS count
           FROM bronze.clientes
          WHERE ((clientes.email IS NOT NULL) AND (TRIM(BOTH FROM clientes.email) <> ''::text))) AS clientes_com_email,
    ( SELECT count(*) AS count
           FROM bronze.unidades
          WHERE ((unidades."areaPrivativa" IS NOT NULL) AND (unidades."areaPrivativa" > (0)::numeric))) AS unidades_com_area,
    ( SELECT count(*) AS count
           FROM bronze.unidades
          WHERE ((unidades."valorTerreno" IS NOT NULL) AND (unidades."valorTerreno" > (0)::numeric))) AS unidades_com_valor
UNION ALL
 SELECT 'problemas_por_entidade'::text AS categoria_analise,
    v.entidade AS subcategoria,
    'distribuicao_problemas'::text AS metrica_tipo,
    v.entidade,
    CURRENT_TIMESTAMP AS data_analise,
        CASE v.entidade
            WHEN 'clientes'::text THEN ( SELECT count(*) AS count
               FROM bronze.clientes)
            WHEN 'empreendimentos'::text THEN ( SELECT count(*) AS count
               FROM bronze.empreendimentos)
            WHEN 'unidades'::text THEN ( SELECT count(*) AS count
               FROM bronze.unidades)
            WHEN 'contratos_venda'::text THEN ( SELECT count(*) AS count
               FROM bronze.contratos_venda)
            WHEN 'titulos_pagar'::text THEN ( SELECT count(*) AS count
               FROM bronze.titulos_pagar)
            ELSE (0)::bigint
        END AS total_clientes,
    NULL::bigint AS total_empreendimentos,
    NULL::bigint AS total_unidades,
    NULL::bigint AS total_contratos,
    NULL::bigint AS total_titulos,
    count(*) FILTER (WHERE (v.severidade = 'crítico'::text)) AS problemas_criticos,
    count(*) FILTER (WHERE (v.severidade = 'médio'::text)) AS problemas_medios,
    count(*) FILTER (WHERE (v.severidade = 'baixo'::text)) AS problemas_baixos,
    count(*) AS total_problemas,
    round(((1.0 - ((count(*) FILTER (WHERE (v.severidade = 'crítico'::text)))::numeric / (GREATEST(
        CASE v.entidade
            WHEN 'clientes'::text THEN ( SELECT count(*) AS count
               FROM bronze.clientes)
            WHEN 'empreendimentos'::text THEN ( SELECT count(*) AS count
               FROM bronze.empreendimentos)
            WHEN 'unidades'::text THEN ( SELECT count(*) AS count
               FROM bronze.unidades)
            WHEN 'contratos_venda'::text THEN ( SELECT count(*) AS count
               FROM bronze.contratos_venda)
            WHEN 'titulos_pagar'::text THEN ( SELECT count(*) AS count
               FROM bronze.titulos_pagar)
            ELSE (1)::bigint
        END, (1)::bigint))::numeric)) * (100)::numeric), 2) AS percentual_qualidade_critica,
    round(((1.0 - ((count(*))::numeric / (GREATEST(
        CASE v.entidade
            WHEN 'clientes'::text THEN ( SELECT count(*) AS count
               FROM bronze.clientes)
            WHEN 'empreendimentos'::text THEN ( SELECT count(*) AS count
               FROM bronze.empreendimentos)
            WHEN 'unidades'::text THEN ( SELECT count(*) AS count
               FROM bronze.unidades)
            WHEN 'contratos_venda'::text THEN ( SELECT count(*) AS count
               FROM bronze.contratos_venda)
            WHEN 'titulos_pagar'::text THEN ( SELECT count(*) AS count
               FROM bronze.titulos_pagar)
            ELSE (1)::bigint
        END, (1)::bigint))::numeric)) * (100)::numeric), 2) AS percentual_qualidade_geral,
    NULL::numeric AS score_medio_clientes,
    NULL::numeric AS score_medio_empreendimentos,
    NULL::numeric AS score_medio_unidades,
    NULL::numeric AS score_medio_contratos,
    min(v.data_registro) AS data_primeiro_cliente,
    max(v.data_registro) AS data_ultimo_cliente,
    NULL::timestamp without time zone AS data_primeiro_empreendimento,
    NULL::timestamp without time zone AS data_ultimo_empreendimento,
    NULL::bigint AS unidades_com_empreendimento,
    NULL::bigint AS contratos_com_unidades,
    NULL::bigint AS clientes_com_nome,
    NULL::bigint AS clientes_com_email,
    NULL::bigint AS unidades_com_area,
    NULL::bigint AS unidades_com_valor
   FROM silver.rpt_sienge_validacao v
  GROUP BY v.entidade
UNION ALL
 SELECT 'tipos_problemas_frequentes'::text AS categoria_analise,
    v.tipo_validacao AS subcategoria,
    'ranking_problemas'::text AS metrica_tipo,
    v.entidade,
    CURRENT_TIMESTAMP AS data_analise,
    count(*) AS total_clientes,
    NULL::bigint AS total_empreendimentos,
    NULL::bigint AS total_unidades,
    NULL::bigint AS total_contratos,
    NULL::bigint AS total_titulos,
    count(*) FILTER (WHERE (v.severidade = 'crítico'::text)) AS problemas_criticos,
    count(*) FILTER (WHERE (v.severidade = 'médio'::text)) AS problemas_medios,
    count(*) FILTER (WHERE (v.severidade = 'baixo'::text)) AS problemas_baixos,
    count(*) AS total_problemas,
    round((((count(*))::numeric * 100.0) / (( SELECT count(*) AS count
           FROM silver.rpt_sienge_validacao))::numeric), 2) AS percentual_qualidade_critica,
    round((((count(*) FILTER (WHERE (v.severidade = 'crítico'::text)))::numeric * 100.0) / (GREATEST(( SELECT count(*) AS count
           FROM silver.rpt_sienge_validacao
          WHERE (rpt_sienge_validacao.severidade = 'crítico'::text)), (1)::bigint))::numeric), 2) AS percentual_qualidade_geral,
    NULL::numeric AS score_medio_clientes,
    NULL::numeric AS score_medio_empreendimentos,
    NULL::numeric AS score_medio_unidades,
    NULL::numeric AS score_medio_contratos,
    min(v.data_registro) AS data_primeiro_cliente,
    max(v.data_registro) AS data_ultimo_cliente,
    NULL::timestamp without time zone AS data_primeiro_empreendimento,
    NULL::timestamp without time zone AS data_ultimo_empreendimento,
    NULL::bigint AS unidades_com_empreendimento,
    NULL::bigint AS contratos_com_unidades,
    NULL::bigint AS clientes_com_nome,
    NULL::bigint AS clientes_com_email,
    NULL::bigint AS unidades_com_area,
    NULL::bigint AS unidades_com_valor
   FROM silver.rpt_sienge_validacao v
  GROUP BY v.entidade, v.tipo_validacao
 HAVING (count(*) >= 10)
UNION ALL
 SELECT 'evolucao_temporal'::text AS categoria_analise,
    to_char(c.mes, 'YYYY-MM'::text) AS subcategoria,
    'crescimento_mensal'::text AS metrica_tipo,
    'clientes'::text AS entidade,
    CURRENT_TIMESTAMP AS data_analise,
    count(*) AS total_clientes,
    NULL::bigint AS total_empreendimentos,
    NULL::bigint AS total_unidades,
    NULL::bigint AS total_contratos,
    NULL::bigint AS total_titulos,
    (0)::bigint AS problemas_criticos,
    (0)::bigint AS problemas_medios,
    (0)::bigint AS problemas_baixos,
    (0)::bigint AS total_problemas,
    95.0 AS percentual_qualidade_critica,
    90.0 AS percentual_qualidade_geral,
    NULL::numeric AS score_medio_clientes,
    NULL::numeric AS score_medio_empreendimentos,
    NULL::numeric AS score_medio_unidades,
    NULL::numeric AS score_medio_contratos,
    min(c."dataCadastro") AS data_primeiro_cliente,
    max(c."dataCadastro") AS data_ultimo_cliente,
    NULL::timestamp without time zone AS data_primeiro_empreendimento,
    NULL::timestamp without time zone AS data_ultimo_empreendimento,
    NULL::bigint AS unidades_com_empreendimento,
    NULL::bigint AS contratos_com_unidades,
    NULL::bigint AS clientes_com_nome,
    NULL::bigint AS clientes_com_email,
    NULL::bigint AS unidades_com_area,
    NULL::bigint AS unidades_com_valor
   FROM ( SELECT date_trunc('month'::text, c_1."dataCadastro") AS mes,
            c_1."dataCadastro",
            c_1."idCliente"
           FROM bronze.clientes c_1
          WHERE (c_1."dataCadastro" >= (CURRENT_DATE - '2 years'::interval))) c
  GROUP BY c.mes
 HAVING (count(*) > 0)
  ORDER BY 1, 2
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW rpt_sienge_qualidade; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON MATERIALIZED VIEW silver.rpt_sienge_qualidade IS 'View de qualidade da camada Silver: métricas e indicadores consolidados de qualidade de dados';


--
-- Name: COLUMN rpt_sienge_qualidade.categoria_analise; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_qualidade.categoria_analise IS 'Categoria da análise: resumo_geral, problemas_por_entidade, tipos_problemas_frequentes, evolucao_temporal';


--
-- Name: COLUMN rpt_sienge_qualidade.subcategoria; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_qualidade.subcategoria IS 'Subcategoria específica dentro de cada análise (entidade, tipo_problema, mês, etc.)';


--
-- Name: COLUMN rpt_sienge_qualidade.percentual_qualidade_critica; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_qualidade.percentual_qualidade_critica IS 'Percentual de registros sem problemas críticos (0-100)';


--
-- Name: COLUMN rpt_sienge_qualidade.percentual_qualidade_geral; Type: COMMENT; Schema: silver; Owner: -
--

COMMENT ON COLUMN silver.rpt_sienge_qualidade.percentual_qualidade_geral IS 'Percentual de registros sem problemas de qualquer severidade (0-100)';


--
-- Name: api_credentials; Type: TABLE; Schema: system; Owner: -
--

CREATE TABLE system.api_credentials (
    id integer NOT NULL,
    subdomain text NOT NULL,
    api_user text NOT NULL,
    api_password_hash text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    api_password_encrypted text,
    encryption_iv text,
    encryption_tag text,
    encryption_salt text
);


--
-- Name: api_credentials_id_seq; Type: SEQUENCE; Schema: system; Owner: -
--

CREATE SEQUENCE system.api_credentials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: api_credentials_id_seq; Type: SEQUENCE OWNED BY; Schema: system; Owner: -
--

ALTER SEQUENCE system.api_credentials_id_seq OWNED BY system.api_credentials.id;


--
-- Name: sync_logs; Type: TABLE; Schema: system; Owner: -
--

CREATE TABLE system.sync_logs (
    id integer NOT NULL,
    "entityType" text NOT NULL,
    "syncStartedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "syncCompletedAt" timestamp(3) without time zone,
    "recordsProcessed" integer DEFAULT 0 NOT NULL,
    "recordsInserted" integer DEFAULT 0 NOT NULL,
    "recordsUpdated" integer DEFAULT 0 NOT NULL,
    "recordsErrors" integer DEFAULT 0 NOT NULL,
    status text NOT NULL,
    "errorMessage" text,
    "apiCallsMade" integer DEFAULT 0 NOT NULL
);


--
-- Name: sync_logs_id_seq; Type: SEQUENCE; Schema: system; Owner: -
--

CREATE SEQUENCE system.sync_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sync_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: system; Owner: -
--

ALTER SEQUENCE system.sync_logs_id_seq OWNED BY system.sync_logs.id;


--
-- Name: webhooks; Type: TABLE; Schema: system; Owner: -
--

CREATE TABLE system.webhooks (
    id text NOT NULL,
    url text NOT NULL,
    token text,
    events jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: cliente_contatos id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_contatos ALTER COLUMN id SET DEFAULT nextval('bronze.cliente_contatos_id_seq'::regclass);


--
-- Name: cliente_enderecos id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_enderecos ALTER COLUMN id SET DEFAULT nextval('bronze.cliente_enderecos_id_seq'::regclass);


--
-- Name: cliente_procuradores id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_procuradores ALTER COLUMN id SET DEFAULT nextval('bronze.cliente_procuradores_id_seq'::regclass);


--
-- Name: cliente_renda_familiar id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_renda_familiar ALTER COLUMN id SET DEFAULT nextval('bronze.cliente_renda_familiar_id_seq'::regclass);


--
-- Name: cliente_subtipos id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_subtipos ALTER COLUMN id SET DEFAULT nextval('bronze.cliente_subtipos_id_seq'::regclass);


--
-- Name: cliente_telefones id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_telefones ALTER COLUMN id SET DEFAULT nextval('bronze.cliente_telefones_id_seq'::regclass);


--
-- Name: contrato_clientes id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contrato_clientes ALTER COLUMN id SET DEFAULT nextval('bronze.contrato_clientes_id_seq'::regclass);


--
-- Name: contrato_condicoes_pagamento id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contrato_condicoes_pagamento ALTER COLUMN id SET DEFAULT nextval('bronze.contrato_condicoes_pagamento_id_seq'::regclass);


--
-- Name: contrato_unidades id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contrato_unidades ALTER COLUMN id SET DEFAULT nextval('bronze.contrato_unidades_id_seq'::regclass);


--
-- Name: contratos_suprimento id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contratos_suprimento ALTER COLUMN id SET DEFAULT nextval('bronze.contratos_suprimento_id_seq'::regclass);


--
-- Name: extrato_apropriacoes id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.extrato_apropriacoes ALTER COLUMN id SET DEFAULT nextval('bronze.extrato_apropriacoes_id_seq'::regclass);


--
-- Name: unidade_agrupamentos id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidade_agrupamentos ALTER COLUMN id SET DEFAULT nextval('bronze.unidade_agrupamentos_id_seq'::regclass);


--
-- Name: unidade_filhas id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidade_filhas ALTER COLUMN id SET DEFAULT nextval('bronze.unidade_filhas_id_seq'::regclass);


--
-- Name: unidade_links id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidade_links ALTER COLUMN id SET DEFAULT nextval('bronze.unidade_links_id_seq'::regclass);


--
-- Name: unidade_valores_especiais id; Type: DEFAULT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidade_valores_especiais ALTER COLUMN id SET DEFAULT nextval('bronze.unidade_valores_especiais_id_seq'::regclass);


--
-- Name: api_credentials id; Type: DEFAULT; Schema: system; Owner: -
--

ALTER TABLE ONLY system.api_credentials ALTER COLUMN id SET DEFAULT nextval('system.api_credentials_id_seq'::regclass);


--
-- Name: sync_logs id; Type: DEFAULT; Schema: system; Owner: -
--

ALTER TABLE ONLY system.sync_logs ALTER COLUMN id SET DEFAULT nextval('system.sync_logs_id_seq'::regclass);


--
-- Name: centro_custos centro_custos_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.centro_custos
    ADD CONSTRAINT centro_custos_pkey PRIMARY KEY (id);


--
-- Name: cliente_contatos cliente_contatos_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_contatos
    ADD CONSTRAINT cliente_contatos_pkey PRIMARY KEY (id);


--
-- Name: cliente_enderecos cliente_enderecos_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_enderecos
    ADD CONSTRAINT cliente_enderecos_pkey PRIMARY KEY (id);


--
-- Name: cliente_procuradores cliente_procuradores_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_procuradores
    ADD CONSTRAINT cliente_procuradores_pkey PRIMARY KEY (id);


--
-- Name: cliente_renda_familiar cliente_renda_familiar_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_renda_familiar
    ADD CONSTRAINT cliente_renda_familiar_pkey PRIMARY KEY (id);


--
-- Name: cliente_subtipos cliente_subtipos_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_subtipos
    ADD CONSTRAINT cliente_subtipos_pkey PRIMARY KEY (id);


--
-- Name: cliente_telefones cliente_telefones_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_telefones
    ADD CONSTRAINT cliente_telefones_pkey PRIMARY KEY (id);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY ("idCliente");


--
-- Name: contrato_clientes contrato_clientes_contrato_id_cliente_sienge_id_ordem_no_co_key; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contrato_clientes
    ADD CONSTRAINT contrato_clientes_contrato_id_cliente_sienge_id_ordem_no_co_key UNIQUE (contrato_id, cliente_sienge_id, ordem_no_contrato);


--
-- Name: contrato_clientes contrato_clientes_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contrato_clientes
    ADD CONSTRAINT contrato_clientes_pkey PRIMARY KEY (id);


--
-- Name: contrato_condicoes_pagamento contrato_condicoes_pagamento_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contrato_condicoes_pagamento
    ADD CONSTRAINT contrato_condicoes_pagamento_pkey PRIMARY KEY (id);


--
-- Name: contrato_unidades contrato_unidades_contrato_id_unidade_sienge_id_key; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contrato_unidades
    ADD CONSTRAINT contrato_unidades_contrato_id_unidade_sienge_id_key UNIQUE (contrato_id, unidade_sienge_id);


--
-- Name: contrato_unidades contrato_unidades_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contrato_unidades
    ADD CONSTRAINT contrato_unidades_pkey PRIMARY KEY (id);


--
-- Name: contratos_suprimento contratos_suprimento_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contratos_suprimento
    ADD CONSTRAINT contratos_suprimento_pkey PRIMARY KEY (id);


--
-- Name: contratos_venda contratos_venda_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contratos_venda
    ADD CONSTRAINT contratos_venda_pkey PRIMARY KEY (id);


--
-- Name: credores credores_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.credores
    ADD CONSTRAINT credores_pkey PRIMARY KEY (id);


--
-- Name: empreendimentos empreendimentos_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.empreendimentos
    ADD CONSTRAINT empreendimentos_pkey PRIMARY KEY (id);


--
-- Name: empresas empresas_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.empresas
    ADD CONSTRAINT empresas_pkey PRIMARY KEY ("idEmpresa");


--
-- Name: extrato_apropriacoes extrato_apropriacoes_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.extrato_apropriacoes
    ADD CONSTRAINT extrato_apropriacoes_pkey PRIMARY KEY (id);


--
-- Name: extrato_contas extrato_contas_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.extrato_contas
    ADD CONSTRAINT extrato_contas_pkey PRIMARY KEY (id);


--
-- Name: planos_financeiros planos_financeiros_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.planos_financeiros
    ADD CONSTRAINT planos_financeiros_pkey PRIMARY KEY (id);


--
-- Name: portadores portadores_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.portadores
    ADD CONSTRAINT portadores_pkey PRIMARY KEY (id);


--
-- Name: titulos_pagar titulos_pagar_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.titulos_pagar
    ADD CONSTRAINT titulos_pagar_pkey PRIMARY KEY (id);


--
-- Name: unidade_agrupamentos unidade_agrupamentos_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidade_agrupamentos
    ADD CONSTRAINT unidade_agrupamentos_pkey PRIMARY KEY (id);


--
-- Name: unidade_filhas unidade_filhas_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidade_filhas
    ADD CONSTRAINT unidade_filhas_pkey PRIMARY KEY (id);


--
-- Name: unidade_links unidade_links_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidade_links
    ADD CONSTRAINT unidade_links_pkey PRIMARY KEY (id);


--
-- Name: unidade_valores_especiais unidade_valores_especiais_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidade_valores_especiais
    ADD CONSTRAINT unidade_valores_especiais_pkey PRIMARY KEY (id);


--
-- Name: unidades unidades_pkey; Type: CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidades
    ADD CONSTRAINT unidades_pkey PRIMARY KEY (id);


--
-- Name: api_credentials api_credentials_pkey; Type: CONSTRAINT; Schema: system; Owner: -
--

ALTER TABLE ONLY system.api_credentials
    ADD CONSTRAINT api_credentials_pkey PRIMARY KEY (id);


--
-- Name: sync_logs sync_logs_pkey; Type: CONSTRAINT; Schema: system; Owner: -
--

ALTER TABLE ONLY system.sync_logs
    ADD CONSTRAINT sync_logs_pkey PRIMARY KEY (id);


--
-- Name: webhooks webhooks_pkey; Type: CONSTRAINT; Schema: system; Owner: -
--

ALTER TABLE ONLY system.webhooks
    ADD CONSTRAINT webhooks_pkey PRIMARY KEY (id);


--
-- Name: centro_custos_ativo_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX centro_custos_ativo_idx ON bronze.centro_custos USING btree (ativo);


--
-- Name: centro_custos_empresa_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX centro_custos_empresa_id_idx ON bronze.centro_custos USING btree (empresa_id);


--
-- Name: centro_custos_nome_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX centro_custos_nome_idx ON bronze.centro_custos USING btree (nome);


--
-- Name: cliente_contatos_cliente_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX cliente_contatos_cliente_id_idx ON bronze.cliente_contatos USING btree (cliente_id);


--
-- Name: cliente_contatos_cliente_id_ordem_contato_key; Type: INDEX; Schema: bronze; Owner: -
--

CREATE UNIQUE INDEX cliente_contatos_cliente_id_ordem_contato_key ON bronze.cliente_contatos USING btree (cliente_id, ordem_contato);


--
-- Name: cliente_enderecos_cidade_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX cliente_enderecos_cidade_idx ON bronze.cliente_enderecos USING btree (cidade);


--
-- Name: cliente_enderecos_cliente_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX cliente_enderecos_cliente_id_idx ON bronze.cliente_enderecos USING btree (cliente_id);


--
-- Name: cliente_enderecos_cliente_id_ordem_endereco_key; Type: INDEX; Schema: bronze; Owner: -
--

CREATE UNIQUE INDEX cliente_enderecos_cliente_id_ordem_endereco_key ON bronze.cliente_enderecos USING btree (cliente_id, ordem_endereco);


--
-- Name: cliente_enderecos_endereco_correspondencia_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX cliente_enderecos_endereco_correspondencia_idx ON bronze.cliente_enderecos USING btree (endereco_correspondencia);


--
-- Name: cliente_enderecos_estado_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX cliente_enderecos_estado_idx ON bronze.cliente_enderecos USING btree (estado);


--
-- Name: cliente_procuradores_cliente_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX cliente_procuradores_cliente_id_idx ON bronze.cliente_procuradores USING btree (cliente_id);


--
-- Name: cliente_procuradores_cliente_id_ordem_procurador_key; Type: INDEX; Schema: bronze; Owner: -
--

CREATE UNIQUE INDEX cliente_procuradores_cliente_id_ordem_procurador_key ON bronze.cliente_procuradores USING btree (cliente_id, ordem_procurador);


--
-- Name: cliente_renda_familiar_cliente_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX cliente_renda_familiar_cliente_id_idx ON bronze.cliente_renda_familiar USING btree (cliente_id);


--
-- Name: cliente_renda_familiar_cliente_id_ordem_renda_key; Type: INDEX; Schema: bronze; Owner: -
--

CREATE UNIQUE INDEX cliente_renda_familiar_cliente_id_ordem_renda_key ON bronze.cliente_renda_familiar USING btree (cliente_id, ordem_renda);


--
-- Name: cliente_subtipos_cliente_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX cliente_subtipos_cliente_id_idx ON bronze.cliente_subtipos USING btree (cliente_id);


--
-- Name: cliente_subtipos_cliente_id_ordem_subtipo_key; Type: INDEX; Schema: bronze; Owner: -
--

CREATE UNIQUE INDEX cliente_subtipos_cliente_id_ordem_subtipo_key ON bronze.cliente_subtipos USING btree (cliente_id, ordem_subtipo);


--
-- Name: cliente_telefones_cliente_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX cliente_telefones_cliente_id_idx ON bronze.cliente_telefones USING btree (cliente_id);


--
-- Name: cliente_telefones_cliente_id_ordem_telefone_key; Type: INDEX; Schema: bronze; Owner: -
--

CREATE UNIQUE INDEX cliente_telefones_cliente_id_ordem_telefone_key ON bronze.cliente_telefones USING btree (cliente_id, ordem_telefone);


--
-- Name: cliente_telefones_principal_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX cliente_telefones_principal_idx ON bronze.cliente_telefones USING btree (principal);


--
-- Name: clientes_ativo_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX clientes_ativo_idx ON bronze.clientes USING btree (ativo);


--
-- Name: clientes_cidade_principal_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX clientes_cidade_principal_idx ON bronze.clientes USING btree (cidade_principal);


--
-- Name: clientes_dataAtualizacao_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "clientes_dataAtualizacao_idx" ON bronze.clientes USING btree ("dataAtualizacao");


--
-- Name: clientes_dataCadastro_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "clientes_dataCadastro_idx" ON bronze.clientes USING btree ("dataCadastro");


--
-- Name: clientes_estado_principal_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX clientes_estado_principal_idx ON bronze.clientes USING btree (estado_principal);


--
-- Name: clientes_nomeCompleto_ativo_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "clientes_nomeCompleto_ativo_idx" ON bronze.clientes USING btree (name, ativo);


--
-- Name: clientes_nomeCompleto_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "clientes_nomeCompleto_idx" ON bronze.clientes USING btree (name);


--
-- Name: clientes_telefone_principal_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX clientes_telefone_principal_idx ON bronze.clientes USING btree (telefone_principal);


--
-- Name: clientes_tem_conjuge_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX clientes_tem_conjuge_idx ON bronze.clientes USING btree (tem_conjuge);


--
-- Name: contrato_clientes_cliente_sienge_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_clientes_cliente_sienge_id_idx ON bronze.contrato_clientes USING btree (cliente_sienge_id);


--
-- Name: contrato_clientes_contrato_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_clientes_contrato_id_idx ON bronze.contrato_clientes USING btree (contrato_id);


--
-- Name: contrato_clientes_is_main_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_clientes_is_main_idx ON bronze.contrato_clientes USING btree (is_main);


--
-- Name: contrato_clientes_nome_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_clientes_nome_idx ON bronze.contrato_clientes USING btree (nome);


--
-- Name: contrato_condicoes_pagamento_contrato_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_condicoes_pagamento_contrato_id_idx ON bronze.contrato_condicoes_pagamento USING btree (contrato_id);


--
-- Name: contrato_condicoes_pagamento_contrato_id_ordem_condicao_key; Type: INDEX; Schema: bronze; Owner: -
--

CREATE UNIQUE INDEX contrato_condicoes_pagamento_contrato_id_ordem_condicao_key ON bronze.contrato_condicoes_pagamento USING btree (contrato_id, ordem_condicao);


--
-- Name: contrato_condicoes_pagamento_indexador_nome_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_condicoes_pagamento_indexador_nome_idx ON bronze.contrato_condicoes_pagamento USING btree (indexador_nome);


--
-- Name: contrato_condicoes_pagamento_saldo_devedor_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_condicoes_pagamento_saldo_devedor_idx ON bronze.contrato_condicoes_pagamento USING btree (saldo_devedor);


--
-- Name: contrato_condicoes_pagamento_status_condicao_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_condicoes_pagamento_status_condicao_idx ON bronze.contrato_condicoes_pagamento USING btree (status_condicao);


--
-- Name: contrato_condicoes_pagamento_tipo_condicao_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_condicoes_pagamento_tipo_condicao_id_idx ON bronze.contrato_condicoes_pagamento USING btree (tipo_condicao_id);


--
-- Name: contrato_condicoes_pagamento_valor_total_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_condicoes_pagamento_valor_total_idx ON bronze.contrato_condicoes_pagamento USING btree (valor_total);


--
-- Name: contrato_unidades_contrato_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_unidades_contrato_id_idx ON bronze.contrato_unidades USING btree (contrato_id);


--
-- Name: contrato_unidades_is_main_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_unidades_is_main_idx ON bronze.contrato_unidades USING btree (is_main);


--
-- Name: contrato_unidades_nome_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_unidades_nome_idx ON bronze.contrato_unidades USING btree (nome);


--
-- Name: contrato_unidades_tipo_unidade_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_unidades_tipo_unidade_idx ON bronze.contrato_unidades USING btree (tipo_unidade);


--
-- Name: contrato_unidades_unidade_sienge_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contrato_unidades_unidade_sienge_id_idx ON bronze.contrato_unidades USING btree (unidade_sienge_id);


--
-- Name: contratos_suprimento_data_contrato_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contratos_suprimento_data_contrato_idx ON bronze.contratos_suprimento USING btree (data_contrato);


--
-- Name: contratos_suprimento_empresa_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contratos_suprimento_empresa_id_idx ON bronze.contratos_suprimento USING btree (empresa_id);


--
-- Name: contratos_suprimento_fornecedor_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contratos_suprimento_fornecedor_id_idx ON bronze.contratos_suprimento USING btree (fornecedor_id);


--
-- Name: contratos_suprimento_numero_contrato_key; Type: INDEX; Schema: bronze; Owner: -
--

CREATE UNIQUE INDEX contratos_suprimento_numero_contrato_key ON bronze.contratos_suprimento USING btree (numero_contrato);


--
-- Name: contratos_suprimento_status_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contratos_suprimento_status_idx ON bronze.contratos_suprimento USING btree (status);


--
-- Name: contratos_venda_companyId_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "contratos_venda_companyId_idx" ON bronze.contratos_venda USING btree ("companyId");


--
-- Name: contratos_venda_contractDate_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "contratos_venda_contractDate_idx" ON bronze.contratos_venda USING btree ("contractDate");


--
-- Name: contratos_venda_enterpriseId_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "contratos_venda_enterpriseId_idx" ON bronze.contratos_venda USING btree ("enterpriseId");


--
-- Name: contratos_venda_enterpriseId_situation_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "contratos_venda_enterpriseId_situation_idx" ON bronze.contratos_venda USING btree ("enterpriseId", situation);


--
-- Name: contratos_venda_externalId_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "contratos_venda_externalId_idx" ON bronze.contratos_venda USING btree ("externalId");


--
-- Name: contratos_venda_issueDate_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "contratos_venda_issueDate_idx" ON bronze.contratos_venda USING btree ("issueDate");


--
-- Name: contratos_venda_number_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contratos_venda_number_idx ON bronze.contratos_venda USING btree (number);


--
-- Name: contratos_venda_situation_contractDate_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "contratos_venda_situation_contractDate_idx" ON bronze.contratos_venda USING btree (situation, "contractDate");


--
-- Name: contratos_venda_situation_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX contratos_venda_situation_idx ON bronze.contratos_venda USING btree (situation);


--
-- Name: credores_ativo_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX credores_ativo_idx ON bronze.credores USING btree (ativo);


--
-- Name: credores_cnpj_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX credores_cnpj_idx ON bronze.credores USING btree (cnpj);


--
-- Name: credores_cpf_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX credores_cpf_idx ON bronze.credores USING btree (cpf);


--
-- Name: credores_nome_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX credores_nome_idx ON bronze.credores USING btree (nome);


--
-- Name: empreendimentos_idEmpresa_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "empreendimentos_idEmpresa_idx" ON bronze.empreendimentos USING btree ("idEmpresa");


--
-- Name: empreendimentos_nome_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX empreendimentos_nome_idx ON bronze.empreendimentos USING btree (nome);


--
-- Name: empreendimentos_tipo_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX empreendimentos_tipo_idx ON bronze.empreendimentos USING btree (tipo);


--
-- Name: empresas_cnpj_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX empresas_cnpj_idx ON bronze.empresas USING btree (cnpj);


--
-- Name: empresas_nomeEmpresa_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "empresas_nomeEmpresa_idx" ON bronze.empresas USING btree ("nomeEmpresa");


--
-- Name: extrato_apropriacoes_centro_custo_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX extrato_apropriacoes_centro_custo_id_idx ON bronze.extrato_apropriacoes USING btree (centro_custo_id);


--
-- Name: extrato_apropriacoes_extrato_conta_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX extrato_apropriacoes_extrato_conta_id_idx ON bronze.extrato_apropriacoes USING btree (extrato_conta_id);


--
-- Name: extrato_apropriacoes_plano_financeiro_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX extrato_apropriacoes_plano_financeiro_id_idx ON bronze.extrato_apropriacoes USING btree (plano_financeiro_id);


--
-- Name: extrato_contas_centro_custo_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX extrato_contas_centro_custo_id_idx ON bronze.extrato_contas USING btree (centro_custo_id);


--
-- Name: extrato_contas_data_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX extrato_contas_data_idx ON bronze.extrato_contas USING btree (data);


--
-- Name: extrato_contas_empresa_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX extrato_contas_empresa_id_idx ON bronze.extrato_contas USING btree (empresa_id);


--
-- Name: extrato_contas_plano_financeiro_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX extrato_contas_plano_financeiro_id_idx ON bronze.extrato_contas USING btree (plano_financeiro_id);


--
-- Name: extrato_contas_tipo_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX extrato_contas_tipo_idx ON bronze.extrato_contas USING btree (tipo);


--
-- Name: extrato_contas_titulo_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX extrato_contas_titulo_id_idx ON bronze.extrato_contas USING btree (titulo_id);


--
-- Name: idx_clientes_civilstatus; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX idx_clientes_civilstatus ON bronze.clientes USING btree ("civilStatus");


--
-- Name: idx_clientes_persontype; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX idx_clientes_persontype ON bronze.clientes USING btree ("personType");


--
-- Name: idx_clientes_profession; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX idx_clientes_profession ON bronze.clientes USING btree (profession);


--
-- Name: idx_contrato_clientes_main; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX idx_contrato_clientes_main ON bronze.contrato_clientes USING btree (is_main) WHERE (is_main = true);


--
-- Name: idx_contrato_unidades_main; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX idx_contrato_unidades_main ON bronze.contrato_unidades USING btree (is_main) WHERE (is_main = true);


--
-- Name: planos_financeiros_fl_ativa_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX planos_financeiros_fl_ativa_idx ON bronze.planos_financeiros USING btree (fl_ativa);


--
-- Name: planos_financeiros_nome_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX planos_financeiros_nome_idx ON bronze.planos_financeiros USING btree (nome);


--
-- Name: titulos_pagar_credor_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX titulos_pagar_credor_id_idx ON bronze.titulos_pagar USING btree (credor_id);


--
-- Name: titulos_pagar_data_emissao_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX titulos_pagar_data_emissao_idx ON bronze.titulos_pagar USING btree (data_emissao);


--
-- Name: titulos_pagar_devedor_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX titulos_pagar_devedor_id_idx ON bronze.titulos_pagar USING btree (devedor_id);


--
-- Name: titulos_pagar_origem_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX titulos_pagar_origem_id_idx ON bronze.titulos_pagar USING btree (origem_id);


--
-- Name: titulos_pagar_status_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX titulos_pagar_status_idx ON bronze.titulos_pagar USING btree (status);


--
-- Name: unidade_agrupamentos_tipo_agrupamento_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidade_agrupamentos_tipo_agrupamento_idx ON bronze.unidade_agrupamentos USING btree (tipo_agrupamento);


--
-- Name: unidade_agrupamentos_unidade_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidade_agrupamentos_unidade_id_idx ON bronze.unidade_agrupamentos USING btree (unidade_id);


--
-- Name: unidade_agrupamentos_unidade_id_ordem_agrupamento_key; Type: INDEX; Schema: bronze; Owner: -
--

CREATE UNIQUE INDEX unidade_agrupamentos_unidade_id_ordem_agrupamento_key ON bronze.unidade_agrupamentos USING btree (unidade_id, ordem_agrupamento);


--
-- Name: unidade_filhas_unidade_filha_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidade_filhas_unidade_filha_id_idx ON bronze.unidade_filhas USING btree (unidade_filha_id);


--
-- Name: unidade_filhas_unidade_pai_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidade_filhas_unidade_pai_id_idx ON bronze.unidade_filhas USING btree (unidade_pai_id);


--
-- Name: unidade_filhas_unidade_pai_id_ordem_filha_key; Type: INDEX; Schema: bronze; Owner: -
--

CREATE UNIQUE INDEX unidade_filhas_unidade_pai_id_ordem_filha_key ON bronze.unidade_filhas USING btree (unidade_pai_id, ordem_filha);


--
-- Name: unidade_links_rel_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidade_links_rel_idx ON bronze.unidade_links USING btree (rel);


--
-- Name: unidade_links_unidade_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidade_links_unidade_id_idx ON bronze.unidade_links USING btree (unidade_id);


--
-- Name: unidade_links_unidade_id_ordem_link_key; Type: INDEX; Schema: bronze; Owner: -
--

CREATE UNIQUE INDEX unidade_links_unidade_id_ordem_link_key ON bronze.unidade_links USING btree (unidade_id, ordem_link);


--
-- Name: unidade_valores_especiais_tipo_valor_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidade_valores_especiais_tipo_valor_idx ON bronze.unidade_valores_especiais USING btree (tipo_valor);


--
-- Name: unidade_valores_especiais_unidade_id_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidade_valores_especiais_unidade_id_idx ON bronze.unidade_valores_especiais USING btree (unidade_id);


--
-- Name: unidade_valores_especiais_unidade_id_ordem_valor_key; Type: INDEX; Schema: bronze; Owner: -
--

CREATE UNIQUE INDEX unidade_valores_especiais_unidade_id_ordem_valor_key ON bronze.unidade_valores_especiais USING btree (unidade_id, ordem_valor);


--
-- Name: unidade_valores_especiais_valor_monetario_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidade_valores_especiais_valor_monetario_idx ON bronze.unidade_valores_especiais USING btree (valor_monetario);


--
-- Name: unidades_agrupamento_principal_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidades_agrupamento_principal_idx ON bronze.unidades USING btree (agrupamento_principal);


--
-- Name: unidades_estoqueComercial_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "unidades_estoqueComercial_idx" ON bronze.unidades USING btree ("estoqueComercial");


--
-- Name: unidades_idContrato_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "unidades_idContrato_idx" ON bronze.unidades USING btree ("idContrato");


--
-- Name: unidades_idEmpreendimento_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX "unidades_idEmpreendimento_idx" ON bronze.unidades USING btree ("idEmpreendimento");


--
-- Name: unidades_nome_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidades_nome_idx ON bronze.unidades USING btree (nome);


--
-- Name: unidades_total_agrupamentos_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidades_total_agrupamentos_idx ON bronze.unidades USING btree (total_agrupamentos);


--
-- Name: unidades_total_unidades_filhas_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidades_total_unidades_filhas_idx ON bronze.unidades USING btree (total_unidades_filhas);


--
-- Name: unidades_total_valores_especiais_idx; Type: INDEX; Schema: bronze; Owner: -
--

CREATE INDEX unidades_total_valores_especiais_idx ON bronze.unidades USING btree (total_valores_especiais);


--
-- Name: idx_gold_clientes_360_alto_risco; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_alto_risco ON gold.clientes_360 USING btree (cliente_id) WHERE (categoria_risco_credito = 'Alto Risco'::text);


--
-- Name: idx_gold_clientes_360_ano_mes; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_ano_mes ON gold.clientes_360 USING btree (ano_mes);


--
-- Name: idx_gold_clientes_360_ativos; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_ativos ON gold.clientes_360 USING btree (cliente_id) WHERE (total_contratos > 0);


--
-- Name: idx_gold_clientes_360_categoria; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_categoria ON gold.clientes_360 USING btree (categoria_cliente);


--
-- Name: idx_gold_clientes_360_cidade; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_cidade ON gold.clientes_360 USING btree (cidade);


--
-- Name: idx_gold_clientes_360_cliente_id; Type: INDEX; Schema: gold; Owner: -
--

CREATE UNIQUE INDEX idx_gold_clientes_360_cliente_id ON gold.clientes_360 USING btree (cliente_id);


--
-- Name: idx_gold_clientes_360_com_saldo; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_com_saldo ON gold.clientes_360 USING btree (cliente_id) WHERE (saldo_devedor_total > (0)::numeric);


--
-- Name: idx_gold_clientes_360_contatos_gin; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_contatos_gin ON gold.clientes_360 USING gin (contatos_json);


--
-- Name: idx_gold_clientes_360_data_cadastro; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_data_cadastro ON gold.clientes_360 USING btree (data_cadastro);


--
-- Name: idx_gold_clientes_360_documento; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_documento ON gold.clientes_360 USING btree (cpf_cnpj_limpo);


--
-- Name: idx_gold_clientes_360_email; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_email ON gold.clientes_360 USING btree (email_validado);


--
-- Name: idx_gold_clientes_360_enderecos_gin; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_enderecos_gin ON gold.clientes_360 USING gin (enderecos_json);


--
-- Name: idx_gold_clientes_360_estado; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_estado ON gold.clientes_360 USING btree (estado);


--
-- Name: idx_gold_clientes_360_idade; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_idade ON gold.clientes_360 USING btree (idade_atual);


--
-- Name: idx_gold_clientes_360_nome; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_nome ON gold.clientes_360 USING btree (nome_completo);


--
-- Name: idx_gold_clientes_360_perfil_compra; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_perfil_compra ON gold.clientes_360 USING btree (perfil_compra);


--
-- Name: idx_gold_clientes_360_risco_credito; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_risco_credito ON gold.clientes_360 USING btree (categoria_risco_credito);


--
-- Name: idx_gold_clientes_360_saldo_devedor; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_saldo_devedor ON gold.clientes_360 USING btree (saldo_devedor_total);


--
-- Name: idx_gold_clientes_360_score_valor; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_score_valor ON gold.clientes_360 USING btree (score_valor_cliente);


--
-- Name: idx_gold_clientes_360_segmento; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_segmento ON gold.clientes_360 USING btree (segmento_demografico);


--
-- Name: idx_gold_clientes_360_telefone; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_telefone ON gold.clientes_360 USING btree (telefone_principal);


--
-- Name: idx_gold_clientes_360_telefones_gin; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_telefones_gin ON gold.clientes_360 USING gin (telefones_json);


--
-- Name: idx_gold_clientes_360_tempo_cliente; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_tempo_cliente ON gold.clientes_360 USING btree (categoria_tempo_cliente);


--
-- Name: idx_gold_clientes_360_valor_total; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_valor_total ON gold.clientes_360 USING btree (valor_total_contratos);


--
-- Name: idx_gold_clientes_360_vip; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_clientes_360_vip ON gold.clientes_360 USING btree (cliente_id) WHERE (categoria_cliente = ANY (ARRAY['VIP'::text, 'Premium'::text]));


--
-- Name: idx_gold_performance_ano_mes; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_performance_ano_mes ON gold.performance_financeira USING btree (ano, mes);


--
-- Name: idx_gold_performance_categoria_valor; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_performance_categoria_valor ON gold.performance_financeira USING btree (categoria_valor);


--
-- Name: idx_gold_performance_centro_custo; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_performance_centro_custo ON gold.performance_financeira USING btree (centro_custo_id);


--
-- Name: idx_gold_performance_data_principal; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_performance_data_principal ON gold.performance_financeira USING btree (data_principal);


--
-- Name: idx_gold_performance_empresa; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_performance_empresa ON gold.performance_financeira USING btree (empresa_id);


--
-- Name: idx_gold_performance_score_importancia; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_performance_score_importancia ON gold.performance_financeira USING btree (score_importancia_financeira);


--
-- Name: idx_gold_performance_status_liquidez; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_performance_status_liquidez ON gold.performance_financeira USING btree (status_liquidez);


--
-- Name: idx_gold_performance_tags; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_performance_tags ON gold.performance_financeira USING gin (tags_categorizacao) WHERE (tags_categorizacao IS NOT NULL);


--
-- Name: idx_gold_performance_tipo_movimento; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_performance_tipo_movimento ON gold.performance_financeira USING btree (tipo_movimento);


--
-- Name: idx_gold_performance_unique_id; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_performance_unique_id ON gold.performance_financeira USING btree (unique_id);


--
-- Name: idx_gold_performance_valor_extrato; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_performance_valor_extrato ON gold.performance_financeira USING btree (valor_extrato);


--
-- Name: idx_gold_portfolio_agrupamentos_gin; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_agrupamentos_gin ON gold.portfolio_imobiliario USING gin (agrupamentos_json);


--
-- Name: idx_gold_portfolio_alto_valor; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_alto_valor ON gold.portfolio_imobiliario USING btree (unidade_id) WHERE (valor_terreno >= (500000)::numeric);


--
-- Name: idx_gold_portfolio_ano_mes; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_ano_mes ON gold.portfolio_imobiliario USING btree (ano_mes);


--
-- Name: idx_gold_portfolio_area_privativa; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_area_privativa ON gold.portfolio_imobiliario USING btree (area_privativa);


--
-- Name: idx_gold_portfolio_categoria_tamanho; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_categoria_tamanho ON gold.portfolio_imobiliario USING btree (categoria_tamanho);


--
-- Name: idx_gold_portfolio_categoria_tipo; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_categoria_tipo ON gold.portfolio_imobiliario USING btree (categoria_tipo);


--
-- Name: idx_gold_portfolio_categoria_valor; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_categoria_valor ON gold.portfolio_imobiliario USING btree (categoria_valor);


--
-- Name: idx_gold_portfolio_com_coordenadas; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_com_coordenadas ON gold.portfolio_imobiliario USING btree (latitude, longitude) WHERE ((latitude IS NOT NULL) AND (longitude IS NOT NULL));


--
-- Name: idx_gold_portfolio_contrato_id; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_contrato_id ON gold.portfolio_imobiliario USING btree (contrato_id);


--
-- Name: idx_gold_portfolio_data_entrega; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_data_entrega ON gold.portfolio_imobiliario USING btree (data_entrega);


--
-- Name: idx_gold_portfolio_disponiveis; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_disponiveis ON gold.portfolio_imobiliario USING btree (unidade_id) WHERE (estoque_comercial = 'true'::text);


--
-- Name: idx_gold_portfolio_empreendimento_id; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_empreendimento_id ON gold.portfolio_imobiliario USING btree (empreendimento_id);


--
-- Name: idx_gold_portfolio_empresa_id; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_empresa_id ON gold.portfolio_imobiliario USING btree (empresa_id);


--
-- Name: idx_gold_portfolio_entregues; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_entregues ON gold.portfolio_imobiliario USING btree (unidade_id, data_entrega) WHERE (data_entrega IS NOT NULL);


--
-- Name: idx_gold_portfolio_filhas_gin; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_filhas_gin ON gold.portfolio_imobiliario USING gin (unidades_filhas_json);


--
-- Name: idx_gold_portfolio_score_atratividade; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_score_atratividade ON gold.portfolio_imobiliario USING btree (score_atratividade);


--
-- Name: idx_gold_portfolio_segmento; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_segmento ON gold.portfolio_imobiliario USING btree (segmento_estrategico);


--
-- Name: idx_gold_portfolio_status_entrega; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_status_entrega ON gold.portfolio_imobiliario USING btree (status_entrega);


--
-- Name: idx_gold_portfolio_status_unidade; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_status_unidade ON gold.portfolio_imobiliario USING btree (status_unidade);


--
-- Name: idx_gold_portfolio_unidade_id; Type: INDEX; Schema: gold; Owner: -
--

CREATE UNIQUE INDEX idx_gold_portfolio_unidade_id ON gold.portfolio_imobiliario USING btree (unidade_id);


--
-- Name: idx_gold_portfolio_valor_m2; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_valor_m2 ON gold.portfolio_imobiliario USING btree (valor_por_m2);


--
-- Name: idx_gold_portfolio_valor_m2_func; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_valor_m2_func ON gold.portfolio_imobiliario USING btree (valor_por_m2) WHERE (valor_por_m2 IS NOT NULL);


--
-- Name: idx_gold_portfolio_valor_terreno; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_valor_terreno ON gold.portfolio_imobiliario USING btree (valor_terreno);


--
-- Name: idx_gold_portfolio_valores_gin; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_valores_gin ON gold.portfolio_imobiliario USING gin (valores_especiais_json);


--
-- Name: idx_gold_portfolio_vendidas; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_portfolio_vendidas ON gold.portfolio_imobiliario USING btree (unidade_id) WHERE (contrato_id IS NOT NULL);


--
-- Name: idx_gold_vendas_360_alto_valor; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_alto_valor ON gold.vendas_360 USING btree (contrato_id) WHERE (valor_venda_total >= (500000)::numeric);


--
-- Name: idx_gold_vendas_360_ano; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_ano ON gold.vendas_360 USING btree (ano);


--
-- Name: idx_gold_vendas_360_ano_mes; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_ano_mes ON gold.vendas_360 USING btree (ano_mes);


--
-- Name: idx_gold_vendas_360_ativos; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_ativos ON gold.vendas_360 USING btree (contrato_id) WHERE (situacao_detalhada <> ALL (ARRAY['Cancelado'::text, 'Entregue'::text]));


--
-- Name: idx_gold_vendas_360_categoria_risco; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_categoria_risco ON gold.vendas_360 USING btree (categoria_risco);


--
-- Name: idx_gold_vendas_360_categoria_valor; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_categoria_valor ON gold.vendas_360 USING btree (categoria_valor_venda);


--
-- Name: idx_gold_vendas_360_cliente_id; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_cliente_id ON gold.vendas_360 USING btree (cliente_id);


--
-- Name: idx_gold_vendas_360_clientes_gin; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_clientes_gin ON gold.vendas_360 USING gin (clientes_json);


--
-- Name: idx_gold_vendas_360_comissoes_gin; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_comissoes_gin ON gold.vendas_360 USING gin (comissoes_json);


--
-- Name: idx_gold_vendas_360_contrato_id; Type: INDEX; Schema: gold; Owner: -
--

CREATE UNIQUE INDEX idx_gold_vendas_360_contrato_id ON gold.vendas_360 USING btree (contrato_id);


--
-- Name: idx_gold_vendas_360_data_contrato; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_data_contrato ON gold.vendas_360 USING btree (data_contrato);


--
-- Name: idx_gold_vendas_360_empreendimento_id; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_empreendimento_id ON gold.vendas_360 USING btree (empreendimento_id);


--
-- Name: idx_gold_vendas_360_empresa_id; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_empresa_id ON gold.vendas_360 USING btree (empresa_id);


--
-- Name: idx_gold_vendas_360_inadimplentes; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_inadimplentes ON gold.vendas_360 USING btree (contrato_id) WHERE (categoria_risco = ANY (ARRAY['Alto Risco'::text, 'Crítico'::text]));


--
-- Name: idx_gold_vendas_360_mes; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_mes ON gold.vendas_360 USING btree (mes);


--
-- Name: idx_gold_vendas_360_saldo_devedor; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_saldo_devedor ON gold.vendas_360 USING btree (saldo_devedor);


--
-- Name: idx_gold_vendas_360_situacao; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_situacao ON gold.vendas_360 USING btree (situacao_detalhada);


--
-- Name: idx_gold_vendas_360_unidades_gin; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_unidades_gin ON gold.vendas_360 USING gin (unidades_json);


--
-- Name: idx_gold_vendas_360_valor_venda; Type: INDEX; Schema: gold; Owner: -
--

CREATE INDEX idx_gold_vendas_360_valor_venda ON gold.vendas_360 USING btree (valor_venda_total);


--
-- Name: idx_financeiro_ano_mes; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_financeiro_ano_mes ON silver.rpt_sienge_financeiro USING btree (ano_mes);


--
-- Name: idx_financeiro_beneficiario; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_financeiro_beneficiario ON silver.rpt_sienge_financeiro USING btree (beneficiario) WHERE (beneficiario IS NOT NULL);


--
-- Name: idx_financeiro_centro_custo; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_financeiro_centro_custo ON silver.rpt_sienge_financeiro USING btree (centro_custo_nome);


--
-- Name: idx_financeiro_conciliado; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_financeiro_conciliado ON silver.rpt_sienge_financeiro USING btree (conta_conciliada);


--
-- Name: idx_financeiro_data; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_financeiro_data ON silver.rpt_sienge_financeiro USING btree (data_principal);


--
-- Name: idx_financeiro_documento; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_financeiro_documento ON silver.rpt_sienge_financeiro USING btree (numero_documento) WHERE (numero_documento IS NOT NULL);


--
-- Name: idx_financeiro_empresa; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_financeiro_empresa ON silver.rpt_sienge_financeiro USING btree (empresa_id);


--
-- Name: idx_financeiro_plano; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_financeiro_plano ON silver.rpt_sienge_financeiro USING btree (plano_financeiro_nome);


--
-- Name: idx_financeiro_tags; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_financeiro_tags ON silver.rpt_sienge_financeiro USING gin (tags_categorizacao) WHERE (tags_categorizacao IS NOT NULL);


--
-- Name: idx_financeiro_tipo; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_financeiro_tipo ON silver.rpt_sienge_financeiro USING btree (tipo_original);


--
-- Name: idx_financeiro_valor; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_financeiro_valor ON silver.rpt_sienge_financeiro USING btree (valor_extrato);


--
-- Name: idx_financeiro_valor_abs; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_financeiro_valor_abs ON silver.rpt_sienge_financeiro USING btree (abs(valor_extrato) DESC);


--
-- Name: idx_silver_clientes_alta_qualidade; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_alta_qualidade ON silver.rpt_sienge_clientes USING btree (cliente_id) WHERE (qualidade_score >= (80)::numeric);


--
-- Name: idx_silver_clientes_ano_mes; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_ano_mes ON silver.rpt_sienge_clientes USING btree (ano_mes);


--
-- Name: idx_silver_clientes_ativo; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_ativo ON silver.rpt_sienge_clientes USING btree (cliente_id) WHERE (ativo = true);


--
-- Name: idx_silver_clientes_cadastro; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_cadastro ON silver.rpt_sienge_clientes USING btree (data_cadastro);


--
-- Name: idx_silver_clientes_cep; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_cep ON silver.rpt_sienge_clientes USING btree (cep) WHERE (cep <> ''::text);


--
-- Name: idx_silver_clientes_cidade; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_cidade ON silver.rpt_sienge_clientes USING btree (cidade) WHERE (cidade <> ''::text);


--
-- Name: idx_silver_clientes_cnpj; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_cnpj ON silver.rpt_sienge_clientes USING btree (cnpj_limpo) WHERE (cnpj_limpo IS NOT NULL);


--
-- Name: idx_silver_clientes_conjuge; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_conjuge ON silver.rpt_sienge_clientes USING btree (cliente_id) WHERE (tem_conjuge = true);


--
-- Name: idx_silver_clientes_cpf_cnpj; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_cpf_cnpj ON silver.rpt_sienge_clientes USING btree (cpf_cnpj_limpo) WHERE (cpf_cnpj_limpo IS NOT NULL);


--
-- Name: idx_silver_clientes_email; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_email ON silver.rpt_sienge_clientes USING btree (email_validado) WHERE (email_validado IS NOT NULL);


--
-- Name: idx_silver_clientes_enderecos_gin; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_enderecos_gin ON silver.rpt_sienge_clientes USING gin (enderecos_json);


--
-- Name: idx_silver_clientes_estado; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_estado ON silver.rpt_sienge_clientes USING btree (estado) WHERE (estado <> ''::text);


--
-- Name: idx_silver_clientes_faixa_etaria; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_faixa_etaria ON silver.rpt_sienge_clientes USING btree (faixa_etaria);


--
-- Name: idx_silver_clientes_id; Type: INDEX; Schema: silver; Owner: -
--

CREATE UNIQUE INDEX idx_silver_clientes_id ON silver.rpt_sienge_clientes USING btree (cliente_id);


--
-- Name: idx_silver_clientes_nascimento; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_nascimento ON silver.rpt_sienge_clientes USING btree (data_nascimento) WHERE (data_nascimento IS NOT NULL);


--
-- Name: idx_silver_clientes_pf; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_pf ON silver.rpt_sienge_clientes USING btree (cliente_id) WHERE (eh_cpf = true);


--
-- Name: idx_silver_clientes_pj; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_pj ON silver.rpt_sienge_clientes USING btree (cliente_id) WHERE (eh_cnpj = true);


--
-- Name: idx_silver_clientes_qualidade; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_qualidade ON silver.rpt_sienge_clientes USING btree (qualidade_score);


--
-- Name: idx_silver_clientes_renda_gin; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_renda_gin ON silver.rpt_sienge_clientes USING gin (renda_familiar_json);


--
-- Name: idx_silver_clientes_rg; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_rg ON silver.rpt_sienge_clientes USING btree (rg_limpo) WHERE (rg_limpo IS NOT NULL);


--
-- Name: idx_silver_clientes_telefone; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_telefone ON silver.rpt_sienge_clientes USING btree (telefone_principal) WHERE (telefone_principal <> ''::text);


--
-- Name: idx_silver_clientes_telefones_gin; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_telefones_gin ON silver.rpt_sienge_clientes USING gin (telefones_json);


--
-- Name: idx_silver_clientes_tempo_cliente; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_tempo_cliente ON silver.rpt_sienge_clientes USING btree (categoria_tempo_cliente);


--
-- Name: idx_silver_clientes_tipo_pessoa; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_clientes_tipo_pessoa ON silver.rpt_sienge_clientes USING btree (tipo_pessoa);


--
-- Name: idx_silver_contratos_alta_qualidade; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_alta_qualidade ON silver.rpt_sienge_contratos USING btree (contrato_id) WHERE (qualidade_score >= (80)::numeric);


--
-- Name: idx_silver_contratos_ano_mes; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_ano_mes ON silver.rpt_sienge_contratos USING btree (ano_mes);


--
-- Name: idx_silver_contratos_ativos; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_ativos ON silver.rpt_sienge_contratos USING btree (contrato_id) WHERE (status_contrato = ANY (ARRAY['Em Andamento'::text, 'Atrasado'::text]));


--
-- Name: idx_silver_contratos_cancelados; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_cancelados ON silver.rpt_sienge_contratos USING btree (data_cancelamento) WHERE (status_contrato = 'Cancelado'::text);


--
-- Name: idx_silver_contratos_categoria_valor; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_categoria_valor ON silver.rpt_sienge_contratos USING btree (categoria_valor);


--
-- Name: idx_silver_contratos_cliente_principal; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_cliente_principal ON silver.rpt_sienge_contratos USING btree (cliente_principal_id);


--
-- Name: idx_silver_contratos_clientes_gin; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_clientes_gin ON silver.rpt_sienge_contratos USING gin (clientes_json);


--
-- Name: idx_silver_contratos_comissoes_gin; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_comissoes_gin ON silver.rpt_sienge_contratos USING gin (comissoes_json);


--
-- Name: idx_silver_contratos_data_contrato; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_data_contrato ON silver.rpt_sienge_contratos USING btree (data_contrato);


--
-- Name: idx_silver_contratos_data_entrega; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_data_entrega ON silver.rpt_sienge_contratos USING btree (data_entrega_prevista);


--
-- Name: idx_silver_contratos_empreendimento; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_empreendimento ON silver.rpt_sienge_contratos USING btree (empreendimento_id);


--
-- Name: idx_silver_contratos_empresa; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_empresa ON silver.rpt_sienge_contratos USING btree (empresa_id);


--
-- Name: idx_silver_contratos_entregues; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_entregues ON silver.rpt_sienge_contratos USING btree (data_entrega_chaves) WHERE (status_contrato = 'Entregue'::text);


--
-- Name: idx_silver_contratos_id; Type: INDEX; Schema: silver; Owner: -
--

CREATE UNIQUE INDEX idx_silver_contratos_id ON silver.rpt_sienge_contratos USING btree (contrato_id);


--
-- Name: idx_silver_contratos_qualidade; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_qualidade ON silver.rpt_sienge_contratos USING btree (qualidade_score);


--
-- Name: idx_silver_contratos_saldo_devedor; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_saldo_devedor ON silver.rpt_sienge_contratos USING btree (saldo_devedor) WHERE (saldo_devedor IS NOT NULL);


--
-- Name: idx_silver_contratos_situacao; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_situacao ON silver.rpt_sienge_contratos USING btree (situacao);


--
-- Name: idx_silver_contratos_status; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_status ON silver.rpt_sienge_contratos USING btree (status_contrato);


--
-- Name: idx_silver_contratos_unidades_gin; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_unidades_gin ON silver.rpt_sienge_contratos USING gin (unidades_json);


--
-- Name: idx_silver_contratos_valor; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_valor ON silver.rpt_sienge_contratos USING btree (valor_contrato) WHERE (valor_contrato IS NOT NULL);


--
-- Name: idx_silver_contratos_valor_total; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_contratos_valor_total ON silver.rpt_sienge_contratos USING btree (valor_total_calculado) WHERE (valor_total_calculado IS NOT NULL);


--
-- Name: idx_silver_core_ano_mes; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_core_ano_mes ON silver.rpt_sienge_core USING btree (ano_mes);


--
-- Name: idx_silver_core_domain; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_core_domain ON silver.rpt_sienge_core USING btree (domain_type);


--
-- Name: idx_silver_empreend_alta_qualidade; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_alta_qualidade ON silver.rpt_sienge_empreendimentos USING btree (empreendimento_id) WHERE (qualidade_score >= (80)::numeric);


--
-- Name: idx_silver_empreend_ano_mes; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_ano_mes ON silver.rpt_sienge_empreendimentos USING btree (ano_mes);


--
-- Name: idx_silver_empreend_cadastro; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_cadastro ON silver.rpt_sienge_empreendimentos USING btree (data_cadastro);


--
-- Name: idx_silver_empreend_com_cnpj; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_com_cnpj ON silver.rpt_sienge_empreendimentos USING btree (cnpj_limpo) WHERE (tem_cnpj_valido = true);


--
-- Name: idx_silver_empreend_construcao; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_construcao ON silver.rpt_sienge_empreendimentos USING btree (empreendimento_id) WHERE (status_empreendimento = 'Em Construção'::text);


--
-- Name: idx_silver_empreend_empresa; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_empresa ON silver.rpt_sienge_empreendimentos USING btree (empresa_id);


--
-- Name: idx_silver_empreend_id; Type: INDEX; Schema: silver; Owner: -
--

CREATE UNIQUE INDEX idx_silver_empreend_id ON silver.rpt_sienge_empreendimentos USING btree (empreendimento_id);


--
-- Name: idx_silver_empreend_porte; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_porte ON silver.rpt_sienge_empreendimentos USING btree (categoria_porte);


--
-- Name: idx_silver_empreend_proxima_entrega; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_proxima_entrega ON silver.rpt_sienge_empreendimentos USING btree (proxima_entrega);


--
-- Name: idx_silver_empreend_qualidade; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_qualidade ON silver.rpt_sienge_empreendimentos USING btree (qualidade_score);


--
-- Name: idx_silver_empreend_status; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_status ON silver.rpt_sienge_empreendimentos USING btree (status_empreendimento);


--
-- Name: idx_silver_empreend_tipo; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_tipo ON silver.rpt_sienge_empreendimentos USING btree (categoria_tipo);


--
-- Name: idx_silver_empreend_total_unidades; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_total_unidades ON silver.rpt_sienge_empreendimentos USING btree (total_unidades);


--
-- Name: idx_silver_empreend_valor_total; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_empreend_valor_total ON silver.rpt_sienge_empreendimentos USING btree (valor_total_estimado);


--
-- Name: idx_silver_qualidade_categoria; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_qualidade_categoria ON silver.rpt_sienge_qualidade USING btree (categoria_analise);


--
-- Name: idx_silver_qualidade_data; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_qualidade_data ON silver.rpt_sienge_qualidade USING btree (data_analise);


--
-- Name: idx_silver_qualidade_entidade; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_qualidade_entidade ON silver.rpt_sienge_qualidade USING btree (entidade);


--
-- Name: idx_silver_qualidade_evolucao; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_qualidade_evolucao ON silver.rpt_sienge_qualidade USING btree (subcategoria, total_clientes) WHERE (categoria_analise = 'evolucao_temporal'::text);


--
-- Name: idx_silver_qualidade_percentual; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_qualidade_percentual ON silver.rpt_sienge_qualidade USING btree (percentual_qualidade_geral);


--
-- Name: idx_silver_qualidade_principal; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_qualidade_principal ON silver.rpt_sienge_qualidade USING btree (categoria_analise, subcategoria, metrica_tipo);


--
-- Name: idx_silver_qualidade_problemas_criticos; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_qualidade_problemas_criticos ON silver.rpt_sienge_qualidade USING btree (problemas_criticos) WHERE (problemas_criticos > 0);


--
-- Name: idx_silver_qualidade_resumo; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_qualidade_resumo ON silver.rpt_sienge_qualidade USING btree (entidade, total_problemas) WHERE (categoria_analise = 'resumo_geral'::text);


--
-- Name: idx_silver_unidades_agrupamentos_gin; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_agrupamentos_gin ON silver.rpt_sienge_unidades USING gin (agrupamentos_json);


--
-- Name: idx_silver_unidades_alta_qualidade; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_alta_qualidade ON silver.rpt_sienge_unidades USING btree (unidade_id) WHERE (qualidade_score >= (80)::numeric);


--
-- Name: idx_silver_unidades_ano_mes; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_ano_mes ON silver.rpt_sienge_unidades USING btree (ano_mes);


--
-- Name: idx_silver_unidades_area; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_area ON silver.rpt_sienge_unidades USING btree (area_privativa) WHERE (area_privativa IS NOT NULL);


--
-- Name: idx_silver_unidades_cadastro; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_cadastro ON silver.rpt_sienge_unidades USING btree (data_cadastro);


--
-- Name: idx_silver_unidades_contrato; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_contrato ON silver.rpt_sienge_unidades USING btree (contrato_id);


--
-- Name: idx_silver_unidades_coordenadas; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_coordenadas ON silver.rpt_sienge_unidades USING btree (latitude, longitude) WHERE ((latitude IS NOT NULL) AND (longitude IS NOT NULL));


--
-- Name: idx_silver_unidades_empreendimento; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_empreendimento ON silver.rpt_sienge_unidades USING btree (empreendimento_id);


--
-- Name: idx_silver_unidades_entrega; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_entrega ON silver.rpt_sienge_unidades USING btree (data_entrega);


--
-- Name: idx_silver_unidades_estoque; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_estoque ON silver.rpt_sienge_unidades USING btree (estoque_comercial);


--
-- Name: idx_silver_unidades_filhas_gin; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_filhas_gin ON silver.rpt_sienge_unidades USING gin (unidades_filhas_json);


--
-- Name: idx_silver_unidades_id; Type: INDEX; Schema: silver; Owner: -
--

CREATE UNIQUE INDEX idx_silver_unidades_id ON silver.rpt_sienge_unidades USING btree (unidade_id);


--
-- Name: idx_silver_unidades_qualidade; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_qualidade ON silver.rpt_sienge_unidades USING btree (qualidade_score);


--
-- Name: idx_silver_unidades_tipo; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_tipo ON silver.rpt_sienge_unidades USING btree (tipo_imovel);


--
-- Name: idx_silver_unidades_valor; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_valor ON silver.rpt_sienge_unidades USING btree (valor_terreno) WHERE (valor_terreno IS NOT NULL);


--
-- Name: idx_silver_unidades_valores_gin; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_unidades_valores_gin ON silver.rpt_sienge_unidades USING gin (valores_especiais_json);


--
-- Name: idx_silver_validacao_criticos; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_validacao_criticos ON silver.rpt_sienge_validacao USING btree (entidade, registro_id) WHERE (severidade = 'crítico'::text);


--
-- Name: idx_silver_validacao_data_atualizacao; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_validacao_data_atualizacao ON silver.rpt_sienge_validacao USING btree (data_atualizacao);


--
-- Name: idx_silver_validacao_data_registro; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_validacao_data_registro ON silver.rpt_sienge_validacao USING btree (data_registro);


--
-- Name: idx_silver_validacao_entidade; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_validacao_entidade ON silver.rpt_sienge_validacao USING btree (entidade);


--
-- Name: idx_silver_validacao_medios; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_validacao_medios ON silver.rpt_sienge_validacao USING btree (entidade, registro_id) WHERE (severidade = 'médio'::text);


--
-- Name: idx_silver_validacao_principal; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_validacao_principal ON silver.rpt_sienge_validacao USING btree (entidade, tipo_validacao, severidade);


--
-- Name: idx_silver_validacao_registro; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_validacao_registro ON silver.rpt_sienge_validacao USING btree (registro_id);


--
-- Name: idx_silver_validacao_severidade; Type: INDEX; Schema: silver; Owner: -
--

CREATE INDEX idx_silver_validacao_severidade ON silver.rpt_sienge_validacao USING btree (severidade);


--
-- Name: api_credentials_is_active_idx; Type: INDEX; Schema: system; Owner: -
--

CREATE INDEX api_credentials_is_active_idx ON system.api_credentials USING btree (is_active);


--
-- Name: api_credentials_subdomain_idx; Type: INDEX; Schema: system; Owner: -
--

CREATE INDEX api_credentials_subdomain_idx ON system.api_credentials USING btree (subdomain);


--
-- Name: api_credentials_subdomain_key; Type: INDEX; Schema: system; Owner: -
--

CREATE UNIQUE INDEX api_credentials_subdomain_key ON system.api_credentials USING btree (subdomain);


--
-- Name: idx_api_credentials_subdomain_encrypted; Type: INDEX; Schema: system; Owner: -
--

CREATE INDEX idx_api_credentials_subdomain_encrypted ON system.api_credentials USING btree (subdomain, api_password_encrypted);


--
-- Name: sync_logs_entityType_idx; Type: INDEX; Schema: system; Owner: -
--

CREATE INDEX "sync_logs_entityType_idx" ON system.sync_logs USING btree ("entityType");


--
-- Name: sync_logs_entityType_status_idx; Type: INDEX; Schema: system; Owner: -
--

CREATE INDEX "sync_logs_entityType_status_idx" ON system.sync_logs USING btree ("entityType", status);


--
-- Name: sync_logs_status_idx; Type: INDEX; Schema: system; Owner: -
--

CREATE INDEX sync_logs_status_idx ON system.sync_logs USING btree (status);


--
-- Name: sync_logs_syncStartedAt_idx; Type: INDEX; Schema: system; Owner: -
--

CREATE INDEX "sync_logs_syncStartedAt_idx" ON system.sync_logs USING btree ("syncStartedAt");


--
-- Name: webhooks_url_idx; Type: INDEX; Schema: system; Owner: -
--

CREATE INDEX webhooks_url_idx ON system.webhooks USING btree (url);


--
-- Name: centro_custos centro_custos_empresa_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.centro_custos
    ADD CONSTRAINT centro_custos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES bronze.empresas("idEmpresa") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cliente_contatos cliente_contatos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_contatos
    ADD CONSTRAINT cliente_contatos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES bronze.clientes("idCliente") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cliente_enderecos cliente_enderecos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_enderecos
    ADD CONSTRAINT cliente_enderecos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES bronze.clientes("idCliente") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cliente_procuradores cliente_procuradores_cliente_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_procuradores
    ADD CONSTRAINT cliente_procuradores_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES bronze.clientes("idCliente") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cliente_renda_familiar cliente_renda_familiar_cliente_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_renda_familiar
    ADD CONSTRAINT cliente_renda_familiar_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES bronze.clientes("idCliente") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cliente_subtipos cliente_subtipos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_subtipos
    ADD CONSTRAINT cliente_subtipos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES bronze.clientes("idCliente") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cliente_telefones cliente_telefones_cliente_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.cliente_telefones
    ADD CONSTRAINT cliente_telefones_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES bronze.clientes("idCliente") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: contrato_clientes contrato_clientes_contrato_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contrato_clientes
    ADD CONSTRAINT contrato_clientes_contrato_id_fkey FOREIGN KEY (contrato_id) REFERENCES bronze.contratos_venda(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: contrato_condicoes_pagamento contrato_condicoes_pagamento_contrato_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contrato_condicoes_pagamento
    ADD CONSTRAINT contrato_condicoes_pagamento_contrato_id_fkey FOREIGN KEY (contrato_id) REFERENCES bronze.contratos_venda(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: contrato_unidades contrato_unidades_contrato_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contrato_unidades
    ADD CONSTRAINT contrato_unidades_contrato_id_fkey FOREIGN KEY (contrato_id) REFERENCES bronze.contratos_venda(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: contratos_suprimento contratos_suprimento_empresa_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contratos_suprimento
    ADD CONSTRAINT contratos_suprimento_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES bronze.empresas("idEmpresa") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: contratos_suprimento contratos_suprimento_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contratos_suprimento
    ADD CONSTRAINT contratos_suprimento_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES bronze.credores(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: contratos_venda contratos_venda_enterpriseId_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.contratos_venda
    ADD CONSTRAINT "contratos_venda_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES bronze.empreendimentos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: extrato_apropriacoes extrato_apropriacoes_centro_custo_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.extrato_apropriacoes
    ADD CONSTRAINT extrato_apropriacoes_centro_custo_id_fkey FOREIGN KEY (centro_custo_id) REFERENCES bronze.centro_custos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: extrato_apropriacoes extrato_apropriacoes_extrato_conta_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.extrato_apropriacoes
    ADD CONSTRAINT extrato_apropriacoes_extrato_conta_id_fkey FOREIGN KEY (extrato_conta_id) REFERENCES bronze.extrato_contas(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: extrato_apropriacoes extrato_apropriacoes_plano_financeiro_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.extrato_apropriacoes
    ADD CONSTRAINT extrato_apropriacoes_plano_financeiro_id_fkey FOREIGN KEY (plano_financeiro_id) REFERENCES bronze.planos_financeiros(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: extrato_contas extrato_contas_centro_custo_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.extrato_contas
    ADD CONSTRAINT extrato_contas_centro_custo_id_fkey FOREIGN KEY (centro_custo_id) REFERENCES bronze.centro_custos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: extrato_contas extrato_contas_empresa_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.extrato_contas
    ADD CONSTRAINT extrato_contas_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES bronze.empresas("idEmpresa") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: extrato_contas extrato_contas_plano_financeiro_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.extrato_contas
    ADD CONSTRAINT extrato_contas_plano_financeiro_id_fkey FOREIGN KEY (plano_financeiro_id) REFERENCES bronze.planos_financeiros(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: extrato_contas extrato_contas_titulo_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.extrato_contas
    ADD CONSTRAINT extrato_contas_titulo_id_fkey FOREIGN KEY (titulo_id) REFERENCES bronze.titulos_pagar(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: titulos_pagar titulos_pagar_credor_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.titulos_pagar
    ADD CONSTRAINT titulos_pagar_credor_id_fkey FOREIGN KEY (credor_id) REFERENCES bronze.credores(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: titulos_pagar titulos_pagar_devedor_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.titulos_pagar
    ADD CONSTRAINT titulos_pagar_devedor_id_fkey FOREIGN KEY (devedor_id) REFERENCES bronze.empresas("idEmpresa") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: unidade_agrupamentos unidade_agrupamentos_unidade_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidade_agrupamentos
    ADD CONSTRAINT unidade_agrupamentos_unidade_id_fkey FOREIGN KEY (unidade_id) REFERENCES bronze.unidades(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: unidade_filhas unidade_filhas_unidade_pai_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidade_filhas
    ADD CONSTRAINT unidade_filhas_unidade_pai_id_fkey FOREIGN KEY (unidade_pai_id) REFERENCES bronze.unidades(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: unidade_links unidade_links_unidade_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidade_links
    ADD CONSTRAINT unidade_links_unidade_id_fkey FOREIGN KEY (unidade_id) REFERENCES bronze.unidades(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: unidade_valores_especiais unidade_valores_especiais_unidade_id_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidade_valores_especiais
    ADD CONSTRAINT unidade_valores_especiais_unidade_id_fkey FOREIGN KEY (unidade_id) REFERENCES bronze.unidades(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: unidades unidades_idContrato_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidades
    ADD CONSTRAINT "unidades_idContrato_fkey" FOREIGN KEY ("idContrato") REFERENCES bronze.contratos_venda(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: unidades unidades_idEmpreendimento_fkey; Type: FK CONSTRAINT; Schema: bronze; Owner: -
--

ALTER TABLE ONLY bronze.unidades
    ADD CONSTRAINT "unidades_idEmpreendimento_fkey" FOREIGN KEY ("idEmpreendimento") REFERENCES bronze.empreendimentos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict 87aM7O1rqn3qnw3ZHhIeVUTjfJ2YSwauBCQNqyaoPQrbs9aHyQSXtKUboJPRUlZ

