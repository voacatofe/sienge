import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Importar função de métricas apenas quando necessário
    const { getApiMetrics } = await import('@/lib/logger/api-logger');

    const metrics = getApiMetrics();

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao obter métricas da API',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
