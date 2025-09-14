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
      case 'companies':
        return await getCompanies(skip, limit, search, page);

      case 'departments':
        return await getDepartments(skip, limit, search, page);

      case 'cost-centers':
        return await getCostCenters(skip, limit, search, page);

      case 'property-types':
        return await getPropertyTypes(skip, limit, search, page);

      default:
        return await getRegistriesSummary();
    }
  } catch (error) {
    console.error('[Registries API] Erro ao buscar cadastros básicos:', error);
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

async function getCompanies(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.OR = [
      { nomeEmpresa: { contains: search, mode: 'insensitive' } },
      { nomeFantasia: { contains: search, mode: 'insensitive' } },
      { cnpj: { contains: search, mode: 'insensitive' } },
      { codigoEmpresa: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [companies, total] = await Promise.all([
    prisma.empresa.findMany({
      where,
      skip,
      take: limit,
      select: {
        idEmpresa: true,
        nomeEmpresa: true,
        cnpj: true,
        nomeFantasia: true,
        codigoEmpresa: true,
        ativo: true,
        _count: {
          select: {
            empreendimentos: true,
          },
        },
      },
      orderBy: { nomeEmpresa: 'asc' },
    }),
    prisma.empresa.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: companies,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    meta: {
      endpoint: '/api/data/registries?type=companies',
      description: 'Empresas - Cadastros Básicos',
      entityType: 'companies',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getDepartments(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.OR = [
      { nomeDepartamento: { contains: search, mode: 'insensitive' } },
      { codigoDepartamento: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [departments, total] = await Promise.all([
    prisma.departamento.findMany({
      where,
      skip,
      take: limit,
      select: {
        idDepartamento: true,
        nomeDepartamento: true,
        codigoDepartamento: true,
      },
      orderBy: { nomeDepartamento: 'asc' },
    }),
    prisma.departamento.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: departments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    meta: {
      endpoint: '/api/data/registries?type=departments',
      description: 'Departamentos - Cadastros Básicos',
      entityType: 'departments',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getCostCenters(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.OR = [
      { nomeCentroCusto: { contains: search, mode: 'insensitive' } },
      { codigoCentroCusto: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [costCenters, total] = await Promise.all([
    prisma.centroCusto.findMany({
      where,
      skip,
      take: limit,
      select: {
        idCentroCusto: true,
        nomeCentroCusto: true,
        codigoCentroCusto: true,
        ativo: true,
      },
      orderBy: { nomeCentroCusto: 'asc' },
    }),
    prisma.centroCusto.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: costCenters,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    meta: {
      endpoint: '/api/data/registries?type=cost-centers',
      description: 'Centros de Custo - Cadastros Básicos',
      entityType: 'cost-centers',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getPropertyTypes(
  skip: number,
  limit: number,
  search: string,
  page: number
) {
  const where: any = {};

  if (search) {
    where.descricao = { contains: search, mode: 'insensitive' };
  }

  const [propertyTypes, total] = await Promise.all([
    prisma.tipoImovel.findMany({
      where,
      skip,
      take: limit,
      select: {
        idTipoImovel: true,
        descricao: true,
        _count: {
          select: {
            unidades: true,
          },
        },
      },
      orderBy: { descricao: 'asc' },
    }),
    prisma.tipoImovel.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: propertyTypes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    meta: {
      endpoint: '/api/data/registries?type=property-types',
      description: 'Tipos de Imóveis - Cadastros Básicos',
      entityType: 'property-types',
      lastUpdated: new Date().toISOString(),
    },
  });
}

async function getRegistriesSummary() {
  // Resumo de todos os cadastros básicos
  const [
    companiesCount,
    departmentsCount,
    costCentersCount,
    propertyTypesCount,
  ] = await Promise.all([
    prisma.empresa.count(),
    prisma.departamento.count(),
    prisma.centroCusto.count(),
    prisma.tipoImovel.count(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        companies: {
          total: companiesCount,
          description: 'Empresas cadastradas no sistema',
        },
        departments: {
          total: departmentsCount,
          description: 'Departamentos organizacionais',
        },
        costCenters: {
          total: costCentersCount,
          description: 'Centros de custo para classificação',
        },
        propertyTypes: {
          total: propertyTypesCount,
          description: 'Tipos de imóveis disponíveis',
        },
      },
    },
    availableTypes: [
      'companies',
      'departments',
      'cost-centers',
      'property-types',
    ],
    meta: {
      endpoint: '/api/data/registries',
      description:
        'API Grupo Cadastros Básicos - Entidades fundamentais do sistema',
      group: 'registries',
      lastUpdated: new Date().toISOString(),
    },
  });
}
