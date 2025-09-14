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
        { descricao: { contains: search, mode: 'insensitive' } },
        { idDocumentoIdent: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [documentos, total] = await Promise.all([
      prisma.documentoIdentificacao.findMany({
        where,
        skip,
        take: limit,
        select: {
          idDocumentoIdent: true,
          descricao: true,
        },
        orderBy: { descricao: 'asc' },
      }),
      prisma.documentoIdentificacao.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: documentos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/configuracoes/documentos-identificacao',
        description: 'Documentos de Identificação - Categoria Configurações',
        entityType: 'documentos-identificacao',
        category: 'configuracoes',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      '[Documentos Identificação API] Erro ao buscar documentos:',
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
