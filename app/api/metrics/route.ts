import { NextResponse } from 'next/server';
import { getApiMetrics } from '@/lib/logger/api-logger';

export async function GET() {
  try {
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
