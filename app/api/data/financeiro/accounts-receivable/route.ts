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
    const clienteId = searchParams.get('clienteId') || '';

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (clienteId) {
      where.idCliente = parseInt(clienteId);
    }

    if (search) {
      where.OR = [
        { numeroDocumento: { contains: search, mode: 'insensitive' } },
        {
          cliente: { nomeCompleto: { contains: search, mode: 'insensitive' } },
        },
        { observacoes: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Buscar dados
    const [receivables, total] = await Promise.all([
      prisma.tituloReceber.findMany({
        where,
        skip,
        take: limit,
        select: {
          idTituloReceber: true,
          numeroDocumento: true,
          dataEmissao: true,
          dataVencimento: true,
          valorOriginal: true,
          valorAtualizado: true,
          valorPago: true,
          dataPagamento: true,
          status: true,
          observacoes: true,
          cliente: {
            select: {
              idCliente: true,
              nomeCompleto: true,
              cpfCnpj: true,
            },
          },
          contrato: {
            select: {
              idContrato: true,
              numeroContrato: true,
            },
          },
          planoFinanceiro: {
            select: {
              idPlanoFinanceiro: true,
              nomePlano: true,
            },
          },
          portador: {
            select: {
              idPortador: true,
              descricao: true,
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
      prisma.tituloReceber.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: receivables,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/financeiro/accounts-receivable',
        description: 'Títulos a Receber - Categoria Financeiro',
        entityType: 'accounts-receivable',
        category: 'financeiro',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Data API] Erro ao buscar títulos a receber:', error);
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
