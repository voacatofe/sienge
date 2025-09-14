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
        { nomePlano: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [plans, total] = await Promise.all([
      prisma.planoFinanceiro.findMany({
        where,
        skip,
        take: limit,
        select: {
          idPlanoFinanceiro: true,
          nomePlano: true,
          codigoPlano: true,
          tipo: true,
        },
        orderBy: { nomePlano: 'asc' },
      }),
      prisma.planoFinanceiro.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: plans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/financeiro/payment-categories',
        description: 'Planos Financeiros - Categoria Financeiro',
        entityType: 'payment-categories',
        category: 'financeiro',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      '[Payment Categories API] Erro ao buscar planos financeiros:',
      error
    );
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
