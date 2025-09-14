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
    const status = searchParams.get('status') || '';
    const empreendimentoId = searchParams.get('empreendimentoId') || '';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.statusUnidade = status;
    }

    if (empreendimentoId) {
      where.empreendimentoId = parseInt(empreendimentoId);
    }

    if (search) {
      where.OR = [
        { codigoUnidade: { contains: search, mode: 'insensitive' } },
        { andar: { contains: search, mode: 'insensitive' } },
        { bloco: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [unidades, total] = await Promise.all([
      prisma.unidadeImobiliaria.findMany({
        where,
        skip,
        take: limit,
        select: {
          idUnidade: true,
          codigoUnidade: true,
          andar: true,
          bloco: true,
          areaPrivativa: true,
          areaTotal: true,
          valorTabela: true,
          valorMinimo: true,
          statusUnidade: true,
          empreendimento: {
            select: {
              idEmpreendimento: true,
              nome: true,
              codigo: true,
            },
          },
          tipoImovel: {
            select: {
              idTipoImovel: true,
              descricao: true,
            },
          },
          contratoVenda: {
            select: {
              idContrato: true,
              numeroContrato: true,
              statusContrato: true,
              cliente: {
                select: {
                  idCliente: true,
                  nomeCompleto: true,
                },
              },
            },
          },
        },
        orderBy: [{ bloco: 'asc' }, { andar: 'asc' }, { codigoUnidade: 'asc' }],
      }),
      prisma.unidadeImobiliaria.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: unidades,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/empreendimentos/unidades-imobiliarias',
        description: 'Unidades Imobiliárias - Categoria Empreendimentos',
        entityType: 'unidades-imobiliarias',
        category: 'empreendimentos',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      '[Unidades Imobiliárias API] Erro ao buscar unidades:',
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
