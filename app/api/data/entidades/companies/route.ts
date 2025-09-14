import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const search = searchParams.get('search') || '';
    const active = searchParams.get('active') !== 'false'; // Default true

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (active !== null) {
      where.ativo = active;
    }

    if (search) {
      where.OR = [
        { nomeEmpresa: { contains: search, mode: 'insensitive' } },
        { nomeFantasia: { contains: search, mode: 'insensitive' } },
        { cnpj: { contains: search } },
      ];
    }

    // Buscar dados
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
        endpoint: '/api/data/entidades/companies',
        description: 'Empresas - Categoria Entidades',
        entityType: 'companies',
        category: 'entidades',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Data API] Erro ao buscar empresas:', error);
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
