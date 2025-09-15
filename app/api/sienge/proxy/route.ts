import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Proxy genérico para a API Sienge
 * Permite fazer chamadas para qualquer endpoint da API Sienge
 */
export async function GET(request: NextRequest) {
  try {
    // Importar dependências apenas quando necessário
    const { siengeApiClient } = await import('@/lib/sienge-api-client');
    const { validateSiengeParams } = await import(
      '@/lib/validators/sienge-params'
    );

    const { searchParams } = new URL(request.url);

    // O endpoint é passado como parâmetro
    const endpoint = searchParams.get('endpoint');
    if (!endpoint) {
      return NextResponse.json(
        {
          success: false,
          error: 'Endpoint não especificado',
          message: 'O parâmetro endpoint é obrigatório',
        },
        { status: 400 }
      );
    }

    // Validar parâmetros obrigatórios e formato
    const validation = validateSiengeParams(endpoint, searchParams);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parâmetros inválidos',
          message: 'Erro de validação dos parâmetros',
          details: validation.errors,
          missingParams: validation.missingParams,
        },
        { status: 400 }
      );
    }

    // Inicializar cliente
    await siengeApiClient.initialize();

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

    console.log(
      `[Sienge Proxy] Chamando endpoint: ${endpoint} com params:`,
      params
    );

    const response = await siengeApiClient.fetchData(endpoint, params);

    return NextResponse.json({
      success: true,
      endpoint: endpoint,
      data: response,
      params: params,
    });
  } catch (error) {
    console.error('[Sienge Proxy] Erro:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao chamar API Sienge',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Importar dependências apenas quando necessário
    const { siengeApiClient } = await import('@/lib/sienge-api-client');

    const body = await request.json();
    const { endpoint, data, params } = body;

    if (!endpoint) {
      return NextResponse.json(
        {
          success: false,
          error: 'Endpoint não especificado',
          message: 'O campo endpoint é obrigatório no body',
        },
        { status: 400 }
      );
    }

    // Inicializar cliente
    await siengeApiClient.initialize();

    console.log(`[Sienge Proxy] POST para endpoint: ${endpoint}`);

    const response = await siengeApiClient.createData(endpoint, data);

    return NextResponse.json({
      success: true,
      endpoint: endpoint,
      data: response,
    });
  } catch (error) {
    console.error('[Sienge Proxy] Erro:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao chamar API Sienge',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
