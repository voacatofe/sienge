import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const entity = searchParams.get('entity') || '';

    const skip = (page - 1) * limit;

    // Buscar logs de sincronização
    const where: any = {};
    if (entity) {
      where.entityType = entity;
    }

    const [logs, total] = await Promise.all([
      prisma.syncLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { syncStartedAt: 'desc' }
      }),
      prisma.syncLog.count({ where })
    ]);

    // Estatísticas gerais
    const stats = await prisma.syncLog.groupBy({
      by: ['entityType', 'status'],
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      stats,
      meta: {
        endpoint: '/api/data/sync-logs',
        description: 'Logs de sincronização do Sienge',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[Data API] Erro ao buscar logs:', error);
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
