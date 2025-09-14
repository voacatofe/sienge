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
        {
          contrato: {
            numeroContrato: { contains: search, mode: 'insensitive' },
          },
        },
        {
          contrato: {
            cliente: {
              nomeCompleto: { contains: search, mode: 'insensitive' },
            },
          },
        },
        { observacoes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [commissions, total] = await Promise.all([
      prisma.comissaoVenda.findMany({
        where,
        skip,
        take: limit,
        select: {
          idComissao: true,
          valorComissao: true,
          percentual: true,
          paga: true,
          contrato: {
            select: {
              idContrato: true,
              numeroContrato: true,
              dataContrato: true,
              valorContrato: true,
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
                  andar: true,
                  bloco: true,
                },
              },
            },
          },
        },
        orderBy: { idComissao: 'desc' },
      }),
      prisma.comissaoVenda.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: commissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/vendas/commissions',
        description: 'Comissões de Vendas - Categoria Vendas',
        entityType: 'commissions',
        category: 'vendas',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Commissions API] Erro ao buscar comissões:', error);
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
