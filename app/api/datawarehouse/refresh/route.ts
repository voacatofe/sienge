import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withErrorHandler } from '@/lib/api-response';
import { createContextLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma-singleton';
import { getSaoPauloNow } from '@/lib/date-helper';

const refreshLogger = createContextLogger('DATAWAREHOUSE_REFRESH');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface RefreshOptions {
  schema?: 'silver' | 'gold' | 'all';
  concurrent?: boolean;
  force?: boolean;
}

interface RefreshResult {
  schema: string;
  view: string;
  status: 'success' | 'error';
  duration?: string;
  records?: number;
  error?: string;
}

/**
 * Executa refresh de uma view materializada específica
 */
async function refreshSingleView(
  schema: string,
  viewName: string,
  concurrent: boolean = true
): Promise<RefreshResult> {
  const startTime = Date.now();

  try {
    refreshLogger.info(`Starting refresh for ${schema}.${viewName}`, {
      concurrent,
      schema,
      view: viewName,
    });

    // Usar a função PostgreSQL existente
    const result = await prisma.$queryRaw`
      SELECT bronze.refresh_materialized_view(${schema}, ${viewName}) as result
    `;

    const duration = Date.now() - startTime;

    // Obter contagem de registros
    const countResult = (await prisma.$queryRaw`
      SELECT count(*) as count FROM ${schema}.${viewName}
    `) as any[];

    const records = parseInt(countResult[0]?.count || '0');

    refreshLogger.info(`Successfully refreshed ${schema}.${viewName}`, {
      duration: `${duration}ms`,
      records,
    });

    return {
      schema,
      view: viewName,
      status: 'success',
      duration: `${duration}ms`,
      records,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    refreshLogger.error(`Failed to refresh ${schema}.${viewName}`, error, {
      duration: `${duration}ms`,
      schema,
      view: viewName,
    });

    return {
      schema,
      view: viewName,
      status: 'error',
      duration: `${duration}ms`,
      error: errorMessage,
    };
  }
}

/**
 * Executa refresh completo usando a função PostgreSQL existente
 */
async function refreshAllViews(): Promise<RefreshResult[]> {
  const startTime = Date.now();

  try {
    refreshLogger.info('Starting complete datawarehouse refresh');

    // Usar a função PostgreSQL existente que já tem a ordem de dependência correta
    const results = (await prisma.$queryRaw`
      SELECT * FROM bronze.refresh_all_datawarehouse_views()
    `) as any[];

    const duration = Date.now() - startTime;

    refreshLogger.info('Completed datawarehouse refresh', {
      duration: `${duration}ms`,
      totalViews: results.length,
    });

    // Converter resultados para formato padrão
    return results.map((row: any) => {
      const isError = row.result.includes('Erro');
      const [schema, viewName] = row.view_name.includes('.')
        ? row.view_name.split('.')
        : ['unknown', row.view_name];

      return {
        schema,
        view: viewName,
        status: isError ? 'error' : 'success',
        duration: extractDurationFromResult(row.result),
        records: extractRecordsFromResult(row.result),
        error: isError ? row.result : undefined,
      } as RefreshResult;
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    refreshLogger.error('Failed to execute complete refresh', error, {
      duration: `${duration}ms`,
    });

    throw error;
  }
}

/**
 * Extrai duração do resultado da função PostgreSQL
 */
function extractDurationFromResult(result: string): string | undefined {
  const match = result.match(/Duração: ([^,]+)/);
  return match ? match[1] : undefined;
}

/**
 * Extrai número de registros do resultado da função PostgreSQL
 */
function extractRecordsFromResult(result: string): number | undefined {
  const match = result.match(/Registros: (\d+)/);
  return match ? parseInt(match[1]) : undefined;
}

/**
 * Endpoint POST para refresh das views materializadas
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();

    try {
      const body = (await request.json().catch(() => ({}))) as RefreshOptions;
      const { schema = 'all', concurrent = true, force = false } = body;

      refreshLogger.info('Starting datawarehouse refresh request', {
        schema,
        concurrent,
        force,
      });

      // Criar log de sincronização
      const syncLog = await prisma.syncLog.create({
        data: {
          entityType: `DATAWAREHOUSE_REFRESH_${schema.toUpperCase()}`,
          syncStartedAt: getSaoPauloNow(),
          status: 'in_progress',
          recordsProcessed: 0,
          recordsInserted: 0,
          recordsUpdated: 0,
          recordsErrors: 0,
          apiCallsMade: 1,
        },
      });

      let results: RefreshResult[] = [];

      if (schema === 'all') {
        // Refresh completo usando função PostgreSQL otimizada
        results = await refreshAllViews();
      } else {
        // Refresh de schema específico
        const viewsToRefresh = getViewsForSchema(schema);

        for (const viewName of viewsToRefresh) {
          const result = await refreshSingleView(schema, viewName, concurrent);
          results.push(result);
        }
      }

      // Calcular estatísticas
      const successCount = results.filter(r => r.status === 'success').length;
      const errorCount = results.filter(r => r.status === 'error').length;
      const totalRecords = results.reduce(
        (sum, r) => sum + (r.records || 0),
        0
      );
      const totalDuration = Date.now() - startTime;

      // Atualizar log de sincronização
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          syncCompletedAt: getSaoPauloNow(),
          recordsProcessed: totalRecords,
          recordsInserted: successCount,
          recordsUpdated: 0,
          recordsErrors: errorCount,
          status: errorCount > 0 ? 'completed_with_errors' : 'completed',
          errorMessage:
            errorCount > 0
              ? results
                  .filter(r => r.error)
                  .map(r => `${r.schema}.${r.view}: ${r.error}`)
                  .join('; ')
              : null,
        },
      });

      refreshLogger.info('Datawarehouse refresh completed', {
        schema,
        duration: `${totalDuration}ms`,
        successCount,
        errorCount,
        totalRecords,
      });

      return apiSuccess(
        {
          schema,
          results,
          summary: {
            totalViews: results.length,
            successful: successCount,
            errors: errorCount,
            totalRecords,
            duration: `${totalDuration}ms`,
          },
        },
        `Refresh do datawarehouse concluído`,
        {
          syncLogId: syncLog.id,
          performance: {
            viewsPerSecond: Math.round(results.length / (totalDuration / 1000)),
            avgTimePerView: Math.round(totalDuration / results.length),
          },
        }
      );
    } catch (error) {
      const totalDuration = Date.now() - startTime;
      refreshLogger.error('Datawarehouse refresh failed', error, {
        duration: `${totalDuration}ms`,
      });

      return apiError(
        'REFRESH_ERROR',
        'Erro durante o refresh do datawarehouse',
        500,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: `${totalDuration}ms`,
        }
      );
    }
  }, 'DW_REFRESH_POST');
}

/**
 * Endpoint GET para status das views
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const { searchParams } = new URL(request.url);
    const schema = searchParams.get('schema') || 'all';

    refreshLogger.info('Getting datawarehouse status', { schema });

    try {
      // Obter informações sobre views materializadas
      const viewsInfo = (await prisma.$queryRaw`
        SELECT
          n.nspname as schema_name,
          c.relname as view_name,
          pg_size_pretty(pg_relation_size(c.oid)) as size,
          obj_description(c.oid, 'pg_class') as description
        FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE c.relkind = 'm'
          AND n.nspname IN ('silver', 'gold')
          AND (${schema} = 'all' OR n.nspname = ${schema})
        ORDER BY n.nspname, c.relname
      `) as any[];

      // Obter últimos refreshes do log
      const lastRefreshes = await prisma.syncLog.findMany({
        where: {
          entityType: {
            startsWith: 'REFRESH_VIEW_',
          },
        },
        orderBy: {
          syncCompletedAt: 'desc',
        },
        take: 20,
      });

      return apiSuccess(
        {
          views: viewsInfo,
          lastRefreshes: lastRefreshes.map(log => ({
            view: log.entityType.replace('REFRESH_VIEW_', ''),
            completedAt: log.syncCompletedAt,
            records: log.recordsProcessed,
            status: log.status,
          })),
        },
        'Status do datawarehouse obtido com sucesso'
      );
    } catch (error) {
      refreshLogger.error('Failed to get datawarehouse status', error);

      return apiError(
        'STATUS_ERROR',
        'Erro ao obter status do datawarehouse',
        500,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );
    }
  }, 'DW_REFRESH_GET');
}

/**
 * Retorna as views para refresh por schema
 */
function getViewsForSchema(schema: string): string[] {
  switch (schema) {
    case 'silver':
      return [
        'rpt_sienge_core',
        'rpt_sienge_clientes',
        'rpt_sienge_contratos',
        'rpt_sienge_empreendimentos',
        'rpt_sienge_unidades',
        'rpt_sienge_financeiro',
        'rpt_sienge_qualidade',
        'rpt_sienge_validacao',
      ];
    case 'gold':
      return [
        'vendas_360',
        'clientes_360',
        'portfolio_imobiliario',
        'performance_financeira',
      ];
    default:
      return [];
  }
}
