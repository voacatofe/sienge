import { apiSuccess, apiError, withErrorHandler } from '@/lib/api-response';
import { createContextLogger } from '@/lib/logger';

const metricsLogger = createContextLogger('METRICS');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SystemMetrics {
  memory: {
    used: string;
    total: string;
    percentage: number;
    heap: {
      used: string;
      total: string;
    };
  };
  uptime: {
    seconds: number;
    formatted: string;
  };
  performance: {
    cpuUsage: number;
    loadAverage?: number[];
  };
  process: {
    pid: number;
    nodeVersion: string;
    platform: string;
    arch: string;
  };
}

/**
 * Calcula métricas de sistema
 */
function getSystemMetrics(): SystemMetrics {
  const memUsage = process.memoryUsage();
  const totalMem = require('os').totalmem();
  const freeMem = require('os').freemem();
  const usedMem = totalMem - freeMem;

  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const cpuUsage = process.cpuUsage();
  const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000 / uptime * 100;

  return {
    memory: {
      used: `${Math.round(usedMem / 1024 / 1024)}MB`,
      total: `${Math.round(totalMem / 1024 / 1024)}MB`,
      percentage: Math.round((usedMem / totalMem) * 100),
      heap: {
        used: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      }
    },
    uptime: {
      seconds: Math.round(uptime),
      formatted: `${hours}h ${minutes}m ${seconds}s`
    },
    performance: {
      cpuUsage: Math.round(cpuPercent * 100) / 100,
      loadAverage: require('os').loadavg()
    },
    process: {
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };
}

/**
 * Endpoint de métricas do sistema
 */
export async function GET() {
  return withErrorHandler(async () => {
    metricsLogger.debug('Fetching system metrics');

    const systemMetrics = getSystemMetrics();

    // Tentar obter métricas de API se disponível
    let apiMetrics = null;
    try {
      const { getApiMetrics } = await import('@/lib/logger/api-logger');
      apiMetrics = getApiMetrics();
      metricsLogger.debug('API metrics loaded successfully');
    } catch (error) {
      metricsLogger.warn('API metrics not available', error);
      apiMetrics = {
        message: 'API metrics module not found',
        available: false
      };
    }

    const metrics = {
      system: systemMetrics,
      api: apiMetrics,
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV || 'unknown',
        runtime: 'nodejs',
        version: process.version
      }
    };

    metricsLogger.info('Metrics collected successfully', {
      memoryUsage: systemMetrics.memory.percentage,
      uptime: systemMetrics.uptime.seconds,
      hasApiMetrics: !!apiMetrics
    });

    return apiSuccess(
      metrics,
      'Métricas do sistema coletadas',
      {
        performance: {
          collectionTime: Date.now() - Date.now(), // Will be minimal
          dataPoints: Object.keys(metrics).length
        }
      },
      'short' // Cache por 1 minuto
    );
  }, 'METRICS');
}

/**
 * Endpoint para limpar métricas (se aplicável)
 */
export async function DELETE() {
  return withErrorHandler(async () => {
    // Só permitir em desenvolvimento
    if (process.env.NODE_ENV !== 'development') {
      return apiError(
        'OPERATION_NOT_ALLOWED',
        'Limpeza de métricas só é permitida em desenvolvimento',
        403
      );
    }

    metricsLogger.info('Clearing metrics (development only)');

    try {
      const { clearApiMetrics } = await import('@/lib/logger/api-logger');
      clearApiMetrics();

      return apiSuccess(
        { cleared: true },
        'Métricas limpos com sucesso'
      );
    } catch (error) {
      metricsLogger.warn('Unable to clear metrics', error);

      return apiSuccess(
        { cleared: false, reason: 'Metrics module not available' },
        'Módulo de métricas não disponível para limpeza'
      );
    }
  }, 'METRICS_CLEAR');
}

/**
 * Suporte a OPTIONS para CORS
 */
export async function OPTIONS() {
  return apiSuccess(
    {
      methods: ['GET', 'DELETE', 'OPTIONS'],
      description: 'Métricas do sistema e API',
      usage: {
        get: 'GET /api/metrics - Obter métricas atuais',
        delete: 'DELETE /api/metrics - Limpar métricas (dev only)'
      }
    },
    'Métodos disponíveis para métricas'
  );
}