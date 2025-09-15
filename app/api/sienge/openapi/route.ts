import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Endpoint para documentação OpenAPI/Swagger da API Sienge
 */
export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;

  const openApiSpec = {
    openapi: '3.1.0',
    info: {
      title: 'API Sienge - Proxy Bulk Data',
      version: '1.0.0',
      description:
        'API proxy para sincronização em massa (bulk data) com a API oficial do Sienge. Focada em endpoints que retornam grandes volumes de dados para popular bancos de dados.',
      contact: {
        name: 'Suporte Técnico',
        email: 'suporte@exemplo.com',
      },
    },
    servers: [
      {
        url: `${baseUrl}/api/sienge`,
        description: 'Servidor de Produção',
      },
    ],
    paths: {
      '/proxy': {
        get: {
          summary: 'Proxy para endpoints de bulk data da API Sienge',
          description:
            'Permite fazer chamadas para endpoints de sincronização em massa da API Sienge. Otimizado para buscar grandes volumes de dados.',
          parameters: [
            {
              name: 'endpoint',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description:
                'Endpoint da API Sienge (ex: /customers, /companies)',
              example: '/customers',
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 200,
                default: 100,
              },
              description: 'Quantidade máxima de resultados',
            },
            {
              name: 'offset',
              in: 'query',
              required: false,
              schema: { type: 'integer', minimum: 0, default: 0 },
              description: 'Deslocamento para paginação',
            },
          ],
          responses: {
            '200': {
              description: 'Sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      endpoint: { type: 'string', example: '/customers' },
                      data: { type: 'object' },
                      params: { type: 'object' },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Parâmetros inválidos',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      error: { type: 'string' },
                      message: { type: 'string' },
                      details: { type: 'array', items: { type: 'string' } },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      error: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Proxy genérico para endpoints da API Sienge (POST)',
          description:
            'Permite fazer chamadas POST para qualquer endpoint da API Sienge',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['endpoint'],
                  properties: {
                    endpoint: {
                      type: 'string',
                      description: 'Endpoint da API Sienge',
                      example: '/customers',
                    },
                    data: {
                      type: 'object',
                      description: 'Dados para enviar no body da requisição',
                    },
                    params: {
                      type: 'object',
                      description: 'Parâmetros de query adicionais',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      endpoint: { type: 'string' },
                      data: { type: 'object' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
          description: 'Autenticação básica com credenciais da API Sienge',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'array', items: { type: 'string' } },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            endpoint: { type: 'string' },
            data: { type: 'object' },
            params: { type: 'object' },
          },
        },
      },
    },
    security: [
      {
        basicAuth: [],
      },
    ],
  };

  return NextResponse.json(openApiSpec);
}
