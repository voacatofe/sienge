import { apiSuccess, apiError, withErrorHandler } from '@/lib/api-response';
import { checkDBHealth } from '@/lib/prisma-singleton';
import { logger } from '@/lib/logger';
import { siengeApiClient } from '@/lib/sienge-api-client';
import { formatSaoPauloDateTime } from '@/lib/date-helper';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    database: {
      status: 'healthy' | 'unhealthy';
      latency?: number;
      error?: string;
    };
    sienge_api: {
      status: 'available' | 'unavailable' | 'unauthorized';
      latency?: number;
      message?: string;
      error?: string;
    };
    cache?: {
      status: 'healthy' | 'unhealthy';
      message?: string;
    };
  };
  memory: {
    used: string;
    total: string;
    percentage: number;
  };
}

/**
 * Verifica conectividade real com a API Sienge
 */
async function checkSiengeAPI(): Promise<
  HealthStatus['services']['sienge_api']
> {
  const startTime = Date.now();

  try {
    // Inicializar cliente se necessário
    if (!siengeApiClient.isInitialized()) {
      await siengeApiClient.initialize();
    }

    // Fazer uma chamada simples para verificar conectividade
    // Usando limit=1 para minimizar carga
    const response = await siengeApiClient.fetchData('companies', { limit: 1 });

    const latency = Date.now() - startTime;

    logger.debug('HEALTH', 'Sienge API check completed', { latency });

    return {
      status: 'available',
      latency,
      message: 'API Sienge conectada e operacional',
    };
  } catch (error: any) {
    const latency = Date.now() - startTime;
    logger.error('HEALTH', 'Sienge API check failed', error);

    // Determinar tipo de erro
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return {
        status: 'unauthorized',
        latency,
        error: 'Credenciais inválidas ou expiradas',
      };
    }

    return {
      status: 'unavailable',
      latency,
      error: error?.message || 'API Sienge não acessível',
    };
  }
}

/**
 * Calcula informações de memória
 */
function getMemoryInfo() {
  const used = process.memoryUsage();
  const totalMem = require('os').totalmem();

  return {
    used: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
    total: `${Math.round(totalMem / 1024 / 1024)}MB`,
    percentage: Math.round((used.heapUsed / totalMem) * 100),
  };
}

/**
 * Endpoint de health check
 */
export async function GET() {
  return withErrorHandler(async () => {
    const startTime = Date.now();

    // Verificações em paralelo para melhor performance
    const [dbStatus, apiStatus] = await Promise.all([
      checkDBHealth(),
      checkSiengeAPI(),
    ]);

    // Calcular status geral
    let overallStatus: HealthStatus['status'] = 'healthy';

    if (dbStatus.status === 'unhealthy' || apiStatus.status === 'unavailable') {
      overallStatus = 'unhealthy';
    } else if (apiStatus.status === 'unauthorized') {
      overallStatus = 'degraded';
    }

    const health: HealthStatus = {
      status: overallStatus,
      timestamp: formatSaoPauloDateTime(new Date()),
      uptime: Math.round(process.uptime()),
      services: {
        database: dbStatus,
        sienge_api: apiStatus,
        cache: {
          status: 'healthy',
          message: 'Cache em memória operacional',
        },
      },
      memory: getMemoryInfo(),
    };

    // Log do health check
    logger.info('HEALTH', 'Health check completed', {
      status: overallStatus,
      duration: Date.now() - startTime,
    });

    // Usar cache curto para health checks
    return apiSuccess(health, 'Sistema operacional', undefined, 'short');
  }, 'HEALTH');
}

/**
 * Endpoint de readiness (para Kubernetes/Docker)
 */
export async function HEAD() {
  try {
    const dbStatus = await checkDBHealth();

    if (dbStatus.status === 'healthy') {
      return new Response(null, { status: 200 });
    }

    return new Response(null, { status: 503 });
  } catch {
    return new Response(null, { status: 503 });
  }
}
