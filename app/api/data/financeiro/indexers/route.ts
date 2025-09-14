import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { nomeIndexador: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [indexers, total] = await Promise.all([
      prisma.indexador.findMany({
        where,
        skip,
        take: limit,
        select: {
          idIndexador: true,
          nomeIndexador: true,
          descricao: true,
          periodicidade: true,
          valorAtual: true,
        },
        orderBy: { nomeIndexador: 'asc' },
      }),
      prisma.indexador.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: indexers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/financeiro/indexers',
        description: 'Indexadores/Correção Monetária - Categoria Financeiro',
        entityType: 'indexers',
        category: 'financeiro',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Indexers API] Erro ao buscar indexadores:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
