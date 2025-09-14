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
        { nomeProfissao: { contains: search, mode: 'insensitive' } },
        { codigoProfissao: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [profissoes, total] = await Promise.all([
      prisma.profissao.findMany({
        where,
        skip,
        take: limit,
        select: {
          idProfissao: true,
          nomeProfissao: true,
          codigoProfissao: true,
        },
        orderBy: { nomeProfissao: 'asc' },
      }),
      prisma.profissao.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: profissoes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/clientes/profissoes',
        description: 'Profissões - Categoria Clientes',
        entityType: 'profissoes',
        category: 'clientes',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Profissões API] Erro ao buscar profissões:', error);
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
