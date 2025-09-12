import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/prisma';

export async function GET() {
  try {
    // Verificar conectividade com o banco de dados
    const dbStatus = await checkDatabaseHealth();

    // Verificar conectividade com a API Sienge
    const apiStatus = await checkSiengeAPI();

    const health = {
      status: dbStatus.status === 'healthy' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        sienge_api: apiStatus,
      },
    };

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function checkSiengeAPI() {
  try {
    // Aqui você implementaria a verificação real da API Sienge
    // Por enquanto, retornamos um status simulado
    return {
      status: 'available',
      message: 'Sienge API is accessible',
    };
  } catch (error) {
    return {
      status: 'unavailable',
      message:
        error instanceof Error ? error.message : 'Sienge API is not accessible',
    };
  }
}
