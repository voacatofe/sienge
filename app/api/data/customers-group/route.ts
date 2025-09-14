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

    const skip = (page - 1) * limit;

    switch (entityType) {
      case 'customers':
        return await getCustomers(skip, limit, search, page);

      case 'customer-types':
        return await getCustomerTypes(skip, limit, search, page);

      case 'marital-status':
        return await getMaritalStatus(skip, limit, search, page);

      case 'professions':
        return await getProfessions(skip, limit, search, page);

      case 'creditors':
        return await getCreditors(skip, limit, search, page);

      default:
        return await getCustomersGroupSummary();
    }
  } catch (error) {
    console.error(
      '[Customers Group API] Erro ao buscar dados de clientes:',
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

async function getCustomers(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.OR = [
      { nomeCompleto: { contains: search, mode: 'insensitive' } },
      { cpfCnpj: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.cliente.findMany({
      where,
      skip,
      take: limit,
      select: {
        idCliente: true,
        nomeCompleto: true,
        cpfCnpj: true,
        email: true,
        dataNascimento: true,
        ativo: true,
        tipoCliente: {
          select: {
            idTipoCliente: true,
            descricao: true,
          },
        },
        profissao: {
          select: {
            idProfissao: true,
            nomeProfissao: true,
          },
        },
        estadoCivil: {
          select: {
            idEstadoCivil: true,
            descricao: true,
          },
        },
        _count: {
          select: {
            contratosVenda: true,
            titulosReceber: true,
          },
        },
      },
      orderBy: { nomeCompleto: 'asc' },
    }),
    prisma.cliente.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    meta: {
      endpoint: '/api/data/customers-group?type=customers',
      description: 'Clientes com informações detalhadas - Grupo Clientes',
      entityType: 'customers',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getCustomerTypes(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.descricao = { contains: search, mode: 'insensitive' };
  }

  const [customerTypes, total] = await Promise.all([
    prisma.tipoCliente.findMany({
      where,
      skip,
      take: limit,
      select: {
        idTipoCliente: true,
        descricao: true,
        _count: {
          select: {
            clientes: true,
          },
        },
      },
      orderBy: { descricao: 'asc' },
    }),
    prisma.tipoCliente.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: customerTypes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    meta: {
      endpoint: '/api/data/customers-group?type=customer-types',
      description: 'Tipos de Clientes (PF/PJ) - Grupo Clientes',
      entityType: 'customer-types',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getMaritalStatus(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.descricao = { contains: search, mode: 'insensitive' };
  }

  const [maritalStatus, total] = await Promise.all([
    prisma.estadoCivil.findMany({
      where,
      skip,
      take: limit,
      select: {
        idEstadoCivil: true,
        descricao: true,
        _count: {
          select: {
            clientes: true,
          },
        },
      },
      orderBy: { descricao: 'asc' },
    }),
    prisma.estadoCivil.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: maritalStatus,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    meta: {
      endpoint: '/api/data/customers-group?type=marital-status',
      description: 'Estados Civis - Grupo Clientes',
      entityType: 'marital-status',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getProfessions(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.OR = [
      { nomeProfissao: { contains: search, mode: 'insensitive' } },
      { codigoProfissao: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [professions, total] = await Promise.all([
    prisma.profissao.findMany({
      where,
      skip,
      take: limit,
      select: {
        idProfissao: true,
        nomeProfissao: true,
        codigoProfissao: true,
        _count: {
          select: {
            clientes: true,
          },
        },
      },
      orderBy: { nomeProfissao: 'asc' },
    }),
    prisma.profissao.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: professions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    meta: {
      endpoint: '/api/data/customers-group?type=professions',
      description: 'Profissões - Grupo Clientes',
      entityType: 'professions',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getCreditors(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.OR = [
      { nomeCredor: { contains: search, mode: 'insensitive' } },
      { cpfCnpj: { contains: search, mode: 'insensitive' } },
      { emailContato: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [creditors, total] = await Promise.all([
    prisma.credor.findMany({
      where,
      skip,
      take: limit,
      select: {
        idCredor: true,
        nomeCredor: true,
        cpfCnpj: true,
        emailContato: true,
        telefoneContato: true,
        ativo: true,
        _count: {
          select: {
            titulosPagar: true,
          },
        },
      },
      orderBy: { nomeCredor: 'asc' },
    }),
    prisma.credor.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: creditors,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    meta: {
      endpoint: '/api/data/customers-group?type=creditors',
      description: 'Credores - Grupo Clientes',
      entityType: 'creditors',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getCustomersGroupSummary() {
  // Resumo do grupo de clientes
  const [
    customersCount,
    customerTypesCount,
    maritalStatusCount,
    professionsCount,
    creditorsCount,
    activeCustomersCount,
    activeCreditorsCount,
  ] = await Promise.all([
    prisma.cliente.count(),
    prisma.tipoCliente.count(),
    prisma.estadoCivil.count(),
    prisma.profissao.count(),
    prisma.credor.count(),
    prisma.cliente.count({ where: { ativo: true } }),
    prisma.credor.count({ where: { ativo: true } }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        customers: {
          total: customersCount,
          active: activeCustomersCount,
          description: 'Clientes cadastrados no sistema',
        },
        creditors: {
          total: creditorsCount,
          active: activeCreditorsCount,
          description: 'Credores para títulos a pagar',
        },
      },
      auxiliary: {
        customerTypes: {
          total: customerTypesCount,
          description: 'Tipos de clientes (PF/PJ)',
        },
        maritalStatus: {
          total: maritalStatusCount,
          description: 'Estados civis disponíveis',
        },
        professions: {
          total: professionsCount,
          description: 'Profissões cadastradas',
        },
      },
    },
    availableTypes: [
      'customers',
      'creditors',
      'customer-types',
      'marital-status',
      'professions',
    ],
    meta: {
      endpoint: '/api/data/customers-group',
      description:
        'API Grupo Clientes - Todas as entidades relacionadas a clientes',
      group: 'customers',
      lastUpdated: new Date().toISOString(),
    },
  });
}
