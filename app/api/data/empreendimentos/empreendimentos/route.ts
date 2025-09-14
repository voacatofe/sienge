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
      where.statusEmpreendimento = status;
    }

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { codigo: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [empreendimentos, total] = await Promise.all([
      prisma.empreendimento.findMany({
        where,
        skip,
        take: limit,
        select: {
          idEmpreendimento: true,
          nome: true,
          codigo: true,
          descricao: true,
          cidade: true,
          empresa: {
            select: {
              idEmpresa: true,
              nomeEmpresa: true,
              nomeFantasia: true,
            },
          },
          unidades: {
            select: {
              idUnidade: true,
              codigoUnidade: true,
              tipoImovel: {
                select: {
                  idTipoImovel: true,
                  descricao: true,
                },
              },
            },
          },
        },
        orderBy: { nome: 'asc' },
      }),
      prisma.empreendimento.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: empreendimentos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/empreendimentos/empreendimentos',
        description: 'Empreendimentos - Categoria Empreendimentos',
        entityType: 'empreendimentos',
        category: 'empreendimentos',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      '[Empreendimentos API] Erro ao buscar empreendimentos:',
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
