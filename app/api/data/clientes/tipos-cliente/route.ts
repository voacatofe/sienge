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

    const [tiposCliente, total] = await Promise.all([
      prisma.tipoCliente.findMany({
        where,
        skip,
        take: limit,
        select: {
          idTipoCliente: true,
          descricao: true,
        },
        orderBy: { descricao: 'asc' },
      }),
      prisma.tipoCliente.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: tiposCliente,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/clientes/tipos-cliente',
        description: 'Tipos de Cliente - Categoria Clientes',
        entityType: 'tipos-cliente',
        category: 'clientes',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      '[Tipos Cliente API] Erro ao buscar tipos de cliente:',
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
