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

    const [condicoes, total] = await Promise.all([
      prisma.tipoCondicaoPagamento.findMany({
        where,
        skip,
        take: limit,
        select: {
          idTipoCondPag: true,
          descricao: true,
        },
        orderBy: { descricao: 'asc' },
      }),
      prisma.tipoCondicaoPagamento.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: condicoes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/configuracoes/tipos-condicao-pagamento',
        description: 'Tipos de Condição de Pagamento - Categoria Configurações',
        entityType: 'tipos-condicao-pagamento',
        category: 'configuracoes',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      '[Tipos Condição Pagamento API] Erro ao buscar condições de pagamento:',
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
