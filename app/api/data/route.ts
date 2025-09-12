import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Estatísticas gerais dos dados
    const [customersCount, companiesCount, lastSync] = await Promise.all([
      prisma.cliente.count(),
      prisma.empresa.count(),
      prisma.syncLog.findFirst({
        orderBy: { syncStartedAt: 'desc' },
        select: {
          syncStartedAt: true,
          entityType: true,
          recordsProcessed: true,
          status: true
        }
      })
    ]);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return NextResponse.json({
      success: true,
      message: 'API de dados do Sienge - Dashboard',
      data: {
        customers: {
          total: customersCount,
          endpoint: `${baseUrl}/api/data/customers`,
          description: 'Dados dos clientes sincronizados'
        },
        companies: {
          total: companiesCount,
          endpoint: `${baseUrl}/api/data/companies`,
          description: 'Dados das empresas sincronizadas'
        },
        syncLogs: {
          endpoint: `${baseUrl}/api/data/sync-logs`,
          description: 'Logs de sincronização'
        }
      },
      lastSync,
      powerBI: {
        quickStart: {
          customers: `${baseUrl}/api/data/customers?limit=1000`,
          companies: `${baseUrl}/api/data/companies?limit=1000`,
          syncLogs: `${baseUrl}/api/data/sync-logs?limit=1000`
        },
        instructions: [
          '1. Abra o Power BI Desktop',
          '2. Clique em "Obter Dados" > "Web"',
          '3. Cole uma das URLs acima',
          '4. Clique em "OK" para carregar'
        ]
      },
      meta: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        documentation: `${baseUrl}/api/data/docs`
      }
    });

  } catch (error) {
    console.error('[Data API] Erro ao gerar dashboard:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
