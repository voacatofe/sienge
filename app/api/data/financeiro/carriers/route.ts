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
        { nomePortador: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [carriers, total] = await Promise.all([
      prisma.portadorRecebimento.findMany({
        where,
        skip,
        take: limit,
        select: {
          idPortador: true,
          descricao: true,
          codigo: true,
          ativo: true,
        },
        orderBy: { descricao: 'asc' },
      }),
      prisma.portadorRecebimento.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: carriers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/financeiro/carriers',
        description: 'Portadores de Recebimento - Categoria Financeiro',
        entityType: 'carriers',
        category: 'financeiro',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      '[Carriers API] Erro ao buscar portadores de recebimento:',
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
