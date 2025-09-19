import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withErrorHandler } from '@/lib/api-response';
import { createContextLogger } from '@/lib/logger';
import { getMonitoringStatus } from '@/app/api/sync/status/monitor';
import { prisma } from '@/lib/prisma-singleton';

const monitorLogger = createContextLogger('DW_MONITOR');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Endpoint GET para monitoramento completo do Data Warehouse
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';
    const format = searchParams.get('format') || 'json';

    monitorLogger.info('Getting datawarehouse monitoring status', {
      detailed,
      format,
    });

    try {
      // Obter status geral
      const healthCheck = await getMonitoringStatus(detailed);

      // Se detalhado, incluir logs recentes
      let additionalData = {};
      if (detailed) {
        const recentLogs = await prisma.syncLog.findMany({
          take: 20,
          orderBy: {
            syncStartedAt: 'desc',
          },
          select: {
            id: true,
            entityType: true,
            syncStartedAt: true,
            syncCompletedAt: true,
            recordsProcessed: true,
            status: true,
            errorMessage: true,
          },
        });

        // Estatísticas das views materializadas
        const viewStats = (await prisma.$queryRaw`
          SELECT
            n.nspname as schema_name,
            c.relname as view_name,
            pg_size_pretty(pg_relation_size(c.oid)) as size,
            pg_relation_size(c.oid) as size_bytes
          FROM pg_class c
          JOIN pg_namespace n ON c.relnamespace = n.oid
          WHERE c.relkind = 'm'
            AND n.nspname IN ('silver', 'gold')
          ORDER BY pg_relation_size(c.oid) DESC
        `) as any[];

        additionalData = {
          recentLogs,
          viewStats,
        };
      }

      const response = {
        ...healthCheck,
        ...additionalData,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      };

      // Formatação especial para monitoramento simples
      if (format === 'simple') {
        const simpleStatus = {
          status: healthCheck.overall,
          message:
            healthCheck.overall === 'healthy'
              ? '✅ Todos os sistemas operacionais'
              : healthCheck.alerts.join('; '),
          lastSync: healthCheck.lastFullSync,
          phases: healthCheck.phases.map(p => ({
            name: p.phase,
            status: p.status,
            lastSync: p.lastSync,
          })),
        };

        return apiSuccess(simpleStatus, 'Status simples do Data Warehouse');
      }

      monitorLogger.info('Datawarehouse monitoring completed', {
        overall: healthCheck.overall,
        phasesCount: healthCheck.phases.length,
        alertsCount: healthCheck.alerts.length,
      });

      return apiSuccess(
        response,
        `Status de monitoramento obtido com sucesso${detailed ? ' (detalhado)' : ''}`
      );
    } catch (error) {
      monitorLogger.error(
        'Failed to get datawarehouse monitoring status',
        error
      );

      return apiError(
        'MONITOR_ERROR',
        'Erro ao obter status de monitoramento do Data Warehouse',
        500,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );
    }
  }, 'DW_MONITOR_GET');
}

/**
 * Endpoint POST para forçar verificação de saúde
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    monitorLogger.info('Running forced health check');

    try {
      const body = await request.json().catch(() => ({}));
      const { includeRefresh = false } = body;

      // Obter status atual
      const healthCheck = await getMonitoringStatus(true);

      let refreshResult = null;

      // Se solicitado, executar refresh do datawarehouse
      if (includeRefresh && healthCheck.overall !== 'healthy') {
        monitorLogger.info(
          'Triggering datawarehouse refresh due to unhealthy status'
        );

        try {
          // Chamar função PostgreSQL diretamente
          const refreshResults = (await prisma.$queryRaw`
            SELECT * FROM bronze.refresh_all_datawarehouse_views()
          `) as any[];

          refreshResult = {
            executed: true,
            results: refreshResults,
            success: refreshResults.every(r => !r.result.includes('Erro')),
          };

          monitorLogger.info('Forced refresh completed', {
            success: refreshResult.success,
            viewsProcessed: refreshResults.length,
          });
        } catch (refreshError) {
          refreshResult = {
            executed: false,
            error:
              refreshError instanceof Error
                ? refreshError.message
                : 'Unknown refresh error',
          };

          monitorLogger.error('Forced refresh failed', refreshError);
        }
      }

      // Obter status atualizado após refresh
      const updatedHealthCheck = refreshResult?.executed
        ? await getMonitoringStatus(true)
        : healthCheck;

      return apiSuccess(
        {
          ...updatedHealthCheck,
          forced: true,
          refreshResult,
          timestamp: new Date().toISOString(),
        },
        'Verificação de saúde forçada concluída'
      );
    } catch (error) {
      monitorLogger.error('Failed to run forced health check', error);

      return apiError(
        'HEALTH_CHECK_ERROR',
        'Erro durante verificação de saúde forçada',
        500,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );
    }
  }, 'DW_MONITOR_POST');
}
