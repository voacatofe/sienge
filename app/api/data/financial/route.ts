import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('type') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    switch (entityType) {
      case 'accounts-receivable':
        return await getReceivables(skip, limit, search, status, page);

      case 'accounts-payable':
        return await getPayables(skip, limit, search, status, page);

      case 'sales-contracts':
        return await getSalesContracts(skip, limit, search, status, page);

      case 'commissions':
        return await getSalesCommissions(skip, limit, search, page);

      case 'payment-categories':
        return await getFinancialPlans(skip, limit, search, page);

      case 'indexers':
        return await getIndexers(skip, limit, search, page);

      case 'carriers':
        return await getReceivableCarriers(skip, limit, search, page);

      default:
        return await getFinancialSummary();
    }
  } catch (error) {
    console.error('[Financial API] Erro ao buscar dados financeiros:', error);
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

async function getReceivables(
  skip: number,
  limit: number,
  search: string,
  status: string,
  page: number
) {
  const where: any = {};

  if (status) where.status = status;
  if (search) {
    where.OR = [
      { numeroDocumento: { contains: search, mode: 'insensitive' } },
      { cliente: { nomeCompleto: { contains: search, mode: 'insensitive' } } },
      { observacoes: { contains: search, mode: 'insensitive' } },
    ];
  }

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
      endpoint: '/api/data/financial?type=accounts-receivable',
      description: 'Títulos a Receber - Entidades Financeiras',
      entityType: 'accounts-receivable',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getPayables(
  skip: number,
  limit: number,
  search: string,
  status: string,
  page: number
) {
  const where: any = {};

  if (status) where.status = status;
  if (search) {
    where.OR = [
      { numeroDocumento: { contains: search, mode: 'insensitive' } },
      { credor: { nomeCredor: { contains: search, mode: 'insensitive' } } },
      { observacao: { contains: search, mode: 'insensitive' } },
    ];
  }

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
      endpoint: '/api/data/financial?type=accounts-payable',
      description: 'Títulos a Pagar - Entidades Financeiras',
      entityType: 'accounts-payable',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getSalesContracts(
  skip: number,
  limit: number,
  search: string,
  status: string,
  page: number
) {
  const where: any = {};

  if (status) where.status = status;
  if (search) {
    where.OR = [
      { numeroContrato: { contains: search, mode: 'insensitive' } },
      { cliente: { nomeCompleto: { contains: search, mode: 'insensitive' } } },
      { observacoes: { contains: search, mode: 'insensitive' } },
    ];
  }

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
            andar: true,
            bloco: true,
          },
        },
        comissoes: {
          select: {
            idComissao: true,
            valorComissao: true,
            percentual: true,
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
      endpoint: '/api/data/financial?type=sales-contracts',
      description: 'Contratos de Venda - Entidades Financeiras',
      entityType: 'sales-contracts',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getSalesCommissions(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.OR = [
      {
        contrato: { numeroContrato: { contains: search, mode: 'insensitive' } },
      },
      {
        contrato: {
          cliente: { nomeCompleto: { contains: search, mode: 'insensitive' } },
        },
      },
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
        dataPagamento: true,
        paga: true,
        contrato: {
          select: {
            idContrato: true,
            numeroContrato: true,
            cliente: {
              select: {
                idCliente: true,
                nomeCompleto: true,
              },
            },
          },
        },
      },
      orderBy: { dataPagamento: 'desc' },
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
      endpoint: '/api/data/financial?type=commissions',
      description: 'Comissões de Venda - Entidades Financeiras',
      entityType: 'commissions',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getFinancialPlans(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.nomePlano = { contains: search, mode: 'insensitive' };
  }

  const [plans, total] = await Promise.all([
    prisma.planoFinanceiro.findMany({
      where,
      skip,
      take: limit,
      select: {
        idPlanoFinanceiro: true,
        nomePlano: true,
        codigoPlano: true,
        _count: {
          select: {
            titulosReceber: true,
            titulosPagar: true,
          },
        },
      },
      orderBy: { nomePlano: 'asc' },
    }),
    prisma.planoFinanceiro.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: plans,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    meta: {
      endpoint: '/api/data/financial?type=payment-categories',
      description: 'Planos Financeiros - Cadastro Auxiliar Financeiro',
      entityType: 'payment-categories',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getIndexers(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.nomeIndexador = { contains: search, mode: 'insensitive' };
  }

  const [indexers, total] = await Promise.all([
    prisma.indexador.findMany({
      where,
      skip,
      take: limit,
      select: {
        idIndexador: true,
        nomeIndexador: true,
        descricao: true,
        periodicidade: true,
        valorAtual: true,
        _count: {
          select: {
            titulosReceber: true,
            titulosPagar: true,
          },
        },
      },
      orderBy: { nomeIndexador: 'asc' },
    }),
    prisma.indexador.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: indexers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    meta: {
      endpoint: '/api/data/financial?type=indexers',
      description: 'Indexadores - Cadastro Auxiliar Financeiro',
      entityType: 'indexers',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getReceivableCarriers(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.descricao = { contains: search, mode: 'insensitive' };
  }

  const [carriers, total] = await Promise.all([
    prisma.portadorRecebimento.findMany({
      where,
      skip,
      take: limit,
      select: {
        idPortador: true,
        descricao: true,
        ativo: true,
        _count: {
          select: {
            titulosReceber: true,
          },
        },
      },
      orderBy: { descricao: 'asc' },
    }),
    prisma.portadorRecebimento.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: carriers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    meta: {
      endpoint: '/api/data/financial?type=carriers',
      description: 'Portadores de Recebimento - Cadastro Auxiliar Financeiro',
      entityType: 'carriers',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getFinancialSummary() {
  // Resumo de todas as entidades financeiras
  const [
    receivablesCount,
    payablesCount,
    contractsCount,
    commissionsCount,
    plansCount,
    indexersCount,
    carriersCount,
    receivablesPendingSum,
    payablesPendingSum,
  ] = await Promise.all([
    prisma.tituloReceber.count(),
    prisma.tituloPagar.count(),
    prisma.contratoVenda.count(),
    prisma.comissaoVenda.count(),
    prisma.planoFinanceiro.count(),
    prisma.indexador.count(),
    prisma.portadorRecebimento.count(),
    prisma.tituloReceber.aggregate({
      where: { status: { not: 'PAGO' } },
      _sum: { valorAtualizado: true },
    }),
    prisma.tituloPagar.aggregate({
      where: { status: { not: 'PAGO' } },
      _sum: { valorAtualizado: true },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        receivables: {
          total: receivablesCount,
          pendingValue: receivablesPendingSum._sum.valorAtualizado || 0,
        },
        payables: {
          total: payablesCount,
          pendingValue: payablesPendingSum._sum.valorAtualizado || 0,
        },
        contracts: {
          total: contractsCount,
        },
        commissions: {
          total: commissionsCount,
        },
      },
      auxiliary: {
        financialPlans: plansCount,
        indexers: indexersCount,
        carriers: carriersCount,
      },
    },
    availableTypes: [
      'accounts-receivable',
      'accounts-payable',
      'sales-contracts',
      'commissions',
      'payment-categories',
      'indexers',
      'carriers',
    ],
    meta: {
      endpoint: '/api/data/financial',
      description:
        'API Grupo Financeiro - Todas as entidades financeiras agrupadas',
      group: 'financial',
      lastUpdated: new Date().toISOString(),
    },
  });
}
