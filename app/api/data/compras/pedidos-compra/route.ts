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

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { numeroPedido: { contains: search, mode: 'insensitive' } },
        { credor: { nomeCredor: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [pedidos, total] = await Promise.all([
      prisma.pedidoCompra.findMany({
        where,
        skip,
        take: limit,
        select: {
          idPedido: true,
          numeroPedido: true,
          dataPedido: true,
          dataEntregaPrevista: true,
          valorTotal: true,
          status: true,
          credor: {
            select: {
              idCredor: true,
              nomeCredor: true,
              cpfCnpj: true,
            },
          },
          empreendimento: {
            select: {
              idEmpreendimento: true,
              nome: true,
              codigo: true,
            },
          },
          departamento: {
            select: {
              idDepartamento: true,
              nomeDepartamento: true,
            },
          },
          itens: {
            select: {
              idPedidoItem: true,
              descricaoItem: true,
              quantidade: true,
              unidade: true,
              precoUnitario: true,
              valorTotalItem: true,
            },
          },
        },
        orderBy: { dataPedido: 'desc' },
      }),
      prisma.pedidoCompra.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: pedidos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/compras/pedidos-compra',
        description: 'Pedidos de Compra - Categoria Compras',
        entityType: 'pedidos-compra',
        category: 'compras',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      '[Pedidos Compra API] Erro ao buscar pedidos de compra:',
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
