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
    const uf = searchParams.get('uf') || '';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (uf) {
      where.uf = uf;
    }

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { codigoIBGE: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [municipios, total] = await Promise.all([
      prisma.municipio.findMany({
        where,
        skip,
        take: limit,
        select: {
          idMunicipio: true,
          nome: true,
          uf: true,
          codigoIBGE: true,
        },
        orderBy: [{ uf: 'asc' }, { nome: 'asc' }],
      }),
      prisma.municipio.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: municipios,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/clientes/municipios',
        description: 'Municípios - Categoria Clientes',
        entityType: 'municipios',
        category: 'clientes',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Municípios API] Erro ao buscar municípios:', error);
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
