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
        { nomeCompleto: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
        { rg: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [conjuges, total] = await Promise.all([
      prisma.conjuge.findMany({
        where,
        skip,
        take: limit,
        select: {
          idConjuge: true,
          nomeCompleto: true,
          cpf: true,
          rg: true,
          dataNascimento: true,
          nacionalidade: true,
          email: true,
          idEstadoCivil: true,
          idProfissao: true,
          idCliente: true,
          // Incluir dados relacionados
          estadoCivil: {
            select: {
              idEstadoCivil: true,
              descricao: true,
            },
          },
          profissao: {
            select: {
              idProfissao: true,
              nomeProfissao: true,
              codigoProfissao: true,
            },
          },
          cliente: {
            select: {
              idCliente: true,
              nomeCompleto: true,
              cpfCnpj: true,
            },
          },
        },
        orderBy: { nomeCompleto: 'asc' },
      }),
      prisma.conjuge.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: conjuges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/clientes/conjuges',
        description: 'Cônjuges - Categoria Clientes',
        entityType: 'conjuges',
        category: 'clientes',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Cônjuges API] Erro ao buscar cônjuges:', error);
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
