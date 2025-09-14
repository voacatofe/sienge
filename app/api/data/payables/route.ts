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
    const credorId = searchParams.get('credorId') || '';

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (credorId) {
      where.idCredor = parseInt(credorId);
    }

    if (search) {
      where.OR = [
        { numeroDocumento: { contains: search, mode: 'insensitive' } },
        { credor: { nomeCredor: { contains: search, mode: 'insensitive' } } },
        { observacao: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Buscar dados
    const [payables, total] = await Promise.all([
      prisma.tituloPagar.findMany({
        where,
        skip,
        take: limit,
        select: {
          idTituloPagar: true,
          numeroDocumento: true,
          dataEmissao: true,
          dataVencimento: true,
          valorOriginal: true,
          valorAtualizado: true,
          valorPago: true,
          dataPagamento: true,
          status: true,
          observacao: true,
          credor: {
            select: {
              idCredor: true,
              nomeCredor: true,
              cpfCnpj: true,
            },
          },
          planoFinanceiro: {
            select: {
              idPlanoFinanceiro: true,
              nomePlano: true,
            },
          },
          indexador: {
            select: {
              idIndexador: true,
              nomeIndexador: true,
            },
          },
        },
        orderBy: { dataVencimento: 'desc' },
      }),
      prisma.tituloPagar.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: payables,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/payables',
        description: 'Títulos a Pagar sincronizados do Sienge',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Data API] Erro ao buscar títulos a pagar:', error);
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
