/**
 * Padronização de respostas da API
 * Garante consistência em todas as respostas
 */

import { NextResponse } from 'next/server';
import { formatSaoPauloDateTime } from '@/lib/date-helper';

// Interface genérica para respostas de sucesso
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
}

// Interface para respostas de erro
export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: any;
  statusCode?: number;
  timestamp: string;
}

// Headers padrão de segurança e CORS
const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// Headers de cache por tipo de resposta
const CACHE_HEADERS = {
  none: 'no-store, no-cache, must-revalidate',
  short: 'public, max-age=60', // 1 minuto
  medium: 'public, max-age=300', // 5 minutos
  long: 'public, max-age=3600', // 1 hora
  veryLong: 'public, max-age=86400', // 24 horas
};

export type CacheStrategy = keyof typeof CACHE_HEADERS;

/**
 * Cria uma resposta de sucesso padronizada
 */
export function apiSuccess<T>(
  data: T,
  message?: string,
  metadata?: Record<string, any>,
  cache: CacheStrategy = 'none'
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    metadata,
    timestamp: formatSaoPauloDateTime(new Date()),
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      ...DEFAULT_HEADERS,
      'Cache-Control': CACHE_HEADERS[cache],
    },
  });
}

/**
 * Cria uma resposta de erro padronizada
 */
export function apiError(
  error: string,
  message: string,
  statusCode: number = 500,
  details?: any
): NextResponse<ApiErrorResponse> {
  // Sanitizar mensagem de erro para não expor detalhes internos
  const sanitizedMessage =
    process.env.NODE_ENV === 'production'
      ? message.replace(/\b(?:at\s+.*?:\d+:\d+|\/.*?\/.*?\.js:\d+:\d+)\b/g, '')
      : message;

  const response: ApiErrorResponse = {
    success: false,
    error,
    message: sanitizedMessage,
    details: process.env.NODE_ENV === 'development' ? details : undefined,
    statusCode,
    timestamp: formatSaoPauloDateTime(new Date()),
  };

  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      ...DEFAULT_HEADERS,
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * Wrapper para tratamento de erros em endpoints
 */
export async function withErrorHandler(
  handler: () => Promise<NextResponse<any>>,
  context: string
): Promise<NextResponse<any>> {
  try {
    return await handler();
  } catch (error) {
    // Log do erro (será substituído pelo logger centralizado)
    console.error(`[${context}] Error:`, error);

    if (error instanceof Error) {
      // Erros conhecidos
      if (error.message.includes('Invalid credentials')) {
        return apiError('AUTHENTICATION_ERROR', 'Credenciais inválidas', 401);
      }
      if (error.message.includes('not found')) {
        return apiError('NOT_FOUND', 'Recurso não encontrado', 404);
      }
      if (error.message.includes('validation')) {
        return apiError('VALIDATION_ERROR', error.message, 400, error);
      }

      // Erro genérico
      return apiError(
        'INTERNAL_ERROR',
        process.env.NODE_ENV === 'production'
          ? 'Erro interno do servidor'
          : error.message,
        500,
        error.stack
      );
    }

    // Erro desconhecido
    return apiError('UNKNOWN_ERROR', 'Erro desconhecido', 500);
  }
}

/**
 * Validador de parâmetros obrigatórios
 */
export function validateRequiredParams<T extends Record<string, any>>(
  params: any,
  required: (keyof T)[]
): { valid: boolean; missing?: string[] } {
  const missing = required.filter(key => !params[key]);

  if (missing.length > 0) {
    return { valid: false, missing: missing as string[] };
  }

  return { valid: true };
}

/**
 * Cria resposta para endpoints não implementados
 */
export function apiNotImplemented(
  endpoint: string
): NextResponse<ApiErrorResponse> {
  return apiError(
    'NOT_IMPLEMENTED',
    `O endpoint ${endpoint} ainda não foi implementado`,
    501
  );
}

/**
 * Cria resposta para métodos HTTP não permitidos
 */
export function apiMethodNotAllowed(
  method: string,
  allowed: string[]
): NextResponse<ApiErrorResponse> {
  return apiError(
    'METHOD_NOT_ALLOWED',
    `Método ${method} não permitido. Use: ${allowed.join(', ')}`,
    405
  );
}

/**
 * Cria resposta para rate limiting
 */
export function apiRateLimited(
  retryAfter: number = 60
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'RATE_LIMITED',
      message: 'Muitas requisições. Tente novamente mais tarde.',
      statusCode: 429,
      timestamp: formatSaoPauloDateTime(new Date()),
    },
    {
      status: 429,
      headers: {
        ...DEFAULT_HEADERS,
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': formatSaoPauloDateTime(
          new Date(Date.now() + retryAfter * 1000)
        ),
      },
    }
  );
}
