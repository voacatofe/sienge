import { NextRequest, NextResponse } from 'next/server';
import { siengeApiClient } from '@/lib/sienge-api-client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Endpoint para testar conectividade com endpoints de bulk data da API Sienge
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || '/customers';
    const limit = searchParams.get('limit') || '1';

    // Inicializar cliente
    await siengeApiClient.initialize();

    // Fazer uma requisição de teste
    const testResponse = await siengeApiClient.fetchData(endpoint, {
      limit: parseInt(limit),
    });

    // Verificar estrutura da resposta
    const responseStructure = {
      isArray: Array.isArray(testResponse),
      hasResults:
        testResponse &&
        typeof testResponse === 'object' &&
        'results' in testResponse,
      hasResultSetMetadata:
        testResponse &&
        typeof testResponse === 'object' &&
        'resultSetMetadata' in testResponse,
      keys:
        testResponse && typeof testResponse === 'object'
          ? Object.keys(testResponse)
          : [],
      sampleRecord: null as any,
    };

    // Se há resultados, pegar um exemplo
    if (
      responseStructure.hasResults &&
      Array.isArray(testResponse.results) &&
      testResponse.results.length > 0
    ) {
      responseStructure.sampleRecord = testResponse.results[0];
    } else if (responseStructure.isArray && testResponse.length > 0) {
      responseStructure.sampleRecord = testResponse[0];
    }

    return NextResponse.json({
      success: true,
      message: 'Teste de conectividade com API Sienge realizado com sucesso',
      testEndpoint: endpoint,
      testParams: { limit: parseInt(limit) },
      responseStructure,
      rateLimitStats: siengeApiClient.getRateLimitStats(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Sienge Test] Erro no teste:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erro no teste de conectividade',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
