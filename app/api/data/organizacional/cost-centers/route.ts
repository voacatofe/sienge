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
    const active = searchParams.get('active');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (active !== null && active !== undefined) {
      where.ativo = active === 'true';
    }

    if (search) {
      where.OR = [
        { nomeCentroCusto: { contains: search, mode: 'insensitive' } },
        { codigoCentroCusto: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [costCenters, total] = await Promise.all([
      prisma.centroCusto.findMany({
        where,
        skip,
        take: limit,
        select: {
          idCentroCusto: true,
          nomeCentroCusto: true,
          codigoCentroCusto: true,
          ativo: true,
        },
        orderBy: { nomeCentroCusto: 'asc' },
      }),
      prisma.centroCusto.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: costCenters,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/organizacional/cost-centers',
        description: 'Centros de Custo - Categoria Organizacional',
        entityType: 'cost-centers',
        category: 'organizacional',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Cost Centers API] Erro ao buscar centros de custo:', error);
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
