import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withErrorHandler, validateRequiredParams } from '@/lib/api-response';
import { createContextLogger } from '@/lib/logger';

const proxyLogger = createContextLogger('SIENGE_PROXY');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Proxy genérico para a API Sienge (GET)
 * Permite fazer chamadas para qualquer endpoint da API Sienge
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    // Importar dependências apenas quando necessário
    const { siengeApiClient } = await import('@/lib/sienge-api-client');
    const { validateSiengeParams } = await import('@/lib/validators/sienge-params');

    const { searchParams } = new URL(request.url);

    // O endpoint é passado como parâmetro
    const endpoint = searchParams.get('endpoint');
    if (!endpoint) {
      return apiError(
        'MISSING_PARAMETER',
        'O parâmetro endpoint é obrigatório',
        400
      );
    }

    proxyLogger.info('Processing Sienge proxy request', {
      endpoint,
      paramCount: searchParams.size
    });

    // Validar parâmetros obrigatórios e formato
    const validation = validateSiengeParams(endpoint, searchParams);
    if (!validation.isValid) {
      proxyLogger.warn('Invalid Sienge parameters', {
        endpoint,
        errors: validation.errors,
        missingParams: validation.missingParams
      });

      return apiError(
        'VALIDATION_ERROR',
        'Parâmetros de requisição inválidos',
        400,
        {
          errors: validation.errors,
          missingParams: validation.missingParams
        }
      );
    }

    // Inicializar cliente
    if (!siengeApiClient.isInitialized()) {
      await siengeApiClient.initialize();
    }

    // Coletar todos os parâmetros exceto o endpoint
    const params: any = {};
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        // Tentar converter para número se possível
        const numValue = Number(value);
        if (!isNaN(numValue) && value === numValue.toString()) {
          params[key] = numValue;
        } else if (value === 'true' || value === 'false') {
          params[key] = value === 'true';
        } else {
          params[key] = value;
        }
      }
    });

    proxyLogger.debug('Calling Sienge API', {
      endpoint,
      params
    });

    const startTime = Date.now();
    const response = await siengeApiClient.fetchData(endpoint, params);
    const duration = Date.now() - startTime;

    const responseSize = Array.isArray(response) ? response.length : 1;

    proxyLogger.info('Sienge API call completed', {
      endpoint,
      duration,
      responseSize,
      success: true
    });

    return apiSuccess(
      response,
      `Dados obtidos do endpoint ${endpoint}`,
      {
        endpoint,
        params,
        performance: {
          duration,
          responseSize,
          itemsPerSecond: Math.round(responseSize / (duration / 1000))
        }
      },
      'short' // Cache por 1 minuto
    );
  }, 'SIENGE_PROXY_GET');
}

/**
 * Proxy genérico para a API Sienge (POST)
 * Permite criar dados em qualquer endpoint da API Sienge
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    // Importar dependências apenas quando necessário
    const { siengeApiClient } = await import('@/lib/sienge-api-client');

    const body = await request.json();

    // Validar parâmetros obrigatórios
    const validation = validateRequiredParams(body, ['endpoint']);
    if (!validation.valid) {
      return apiError(
        'VALIDATION_ERROR',
        `Parâmetros obrigatórios ausentes: ${validation.missing?.join(', ')}`,
        400
      );
    }

    const { endpoint, data, params } = body;

    proxyLogger.info('Processing Sienge proxy POST request', {
      endpoint,
      hasData: !!data,
      hasParams: !!params
    });

    // Inicializar cliente
    if (!siengeApiClient.isInitialized()) {
      await siengeApiClient.initialize();
    }

    proxyLogger.debug('Creating data via Sienge API', {
      endpoint,
      dataSize: data ? JSON.stringify(data).length : 0
    });

    const startTime = Date.now();
    const response = await siengeApiClient.createData(endpoint, data);
    const duration = Date.now() - startTime;

    proxyLogger.info('Sienge API POST completed', {
      endpoint,
      duration,
      success: true
    });

    return apiSuccess(
      response,
      `Dados criados no endpoint ${endpoint}`,
      {
        endpoint,
        operation: 'create',
        performance: {
          duration
        }
      }
    );
  }, 'SIENGE_PROXY_POST');
}

/**
 * Suporte a OPTIONS para CORS preflight
 */
export async function OPTIONS() {
  return apiSuccess(
    {
      methods: ['GET', 'POST', 'OPTIONS'],
      description: 'Proxy genérico para API Sienge',
      usage: {
        get: 'GET /api/sienge/proxy?endpoint=companies&limit=10',
        post: 'POST /api/sienge/proxy { "endpoint": "companies", "data": {...} }'
      }
    },
    'Métodos disponíveis no proxy Sienge'
  );
}