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
      where.OR = [{ descricao: { contains: search, mode: 'insensitive' } }];
    }

    const [estadosCivis, total] = await Promise.all([
      prisma.estadoCivil.findMany({
        where,
        skip,
        take: limit,
        select: {
          idEstadoCivil: true,
          descricao: true,
        },
        orderBy: { descricao: 'asc' },
      }),
      prisma.estadoCivil.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: estadosCivis,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/clientes/estados-civis',
        description: 'Estados Civis - Categoria Clientes',
        entityType: 'estados-civis',
        category: 'clientes',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Estados Civis API] Erro ao buscar estados civis:', error);
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
