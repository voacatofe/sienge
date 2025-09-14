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
      where.statusContrato = status;
    }

    if (clienteId) {
      where.idCliente = parseInt(clienteId);
    }

    if (search) {
      where.OR = [
        { numeroContrato: { contains: search, mode: 'insensitive' } },
        {
          cliente: { nomeCompleto: { contains: search, mode: 'insensitive' } },
        },
        { observacoes: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Buscar dados
    const [contracts, total] = await Promise.all([
      prisma.contratoVenda.findMany({
        where,
        skip,
        take: limit,
        select: {
          idContrato: true,
          numeroContrato: true,
          dataContrato: true,
          valorContrato: true,
          entrada: true,
          financiamento: true,
          statusContrato: true,
          observacoes: true,
          cliente: {
            select: {
              idCliente: true,
              nomeCompleto: true,
              cpfCnpj: true,
            },
          },
          unidade: {
            select: {
              idUnidade: true,
              codigoUnidade: true,
              areaTotal: true,
              valorTabela: true,
            },
          },
          planoFinanceiro: {
            select: {
              idPlanoFinanceiro: true,
              nomePlano: true,
            },
          },
          condicaoPagamento: {
            select: {
              idTipoCondPag: true,
              descricao: true,
            },
          },
          indexador: {
            select: {
              idIndexador: true,
              nomeIndexador: true,
            },
          },
          comissoes: {
            select: {
              idComissao: true,
              nomeCorretor: true,
              percentual: true,
              valorComissao: true,
              paga: true,
            },
          },
        },
        orderBy: { dataContrato: 'desc' },
      }),
      prisma.contratoVenda.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: contracts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/vendas/sales-contracts',
        description: 'Contratos de Venda - Categoria Vendas',
        entityType: 'sales-contracts',
        category: 'vendas',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Data API] Erro ao buscar contratos de venda:', error);
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
