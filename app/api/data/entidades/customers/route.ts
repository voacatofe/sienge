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
        { nomeCompleto: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpfCnpj: { contains: search } },
      ];
    }

    // Buscar dados
    const [customers, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take: limit,
        select: {
          idCliente: true,
          nomeCompleto: true,
          nomeSocial: true,
          cpfCnpj: true,
          email: true,
          rg: true,
          dataNascimento: true,
          nacionalidade: true,
          ativo: true,
          dataCadastro: true,
          tipoCliente: {
            select: {
              descricao: true,
            },
          },
          profissao: {
            select: {
              nomeProfissao: true,
            },
          },
          estadoCivil: {
            select: {
              descricao: true,
            },
          },
          telefones: {
            select: {
              numero: true,
              tipo: true,
              observacao: true,
            },
          },
          enderecos: {
            select: {
              logradouro: true,
              numero: true,
              complemento: true,
              bairro: true,
              cep: true,
              tipoEndereco: true,
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
        endpoint: '/api/data/entidades/customers',
        description: 'Clientes - Categoria Entidades',
        entityType: 'customers',
        category: 'entidades',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Data API] Erro ao buscar clientes:', error);
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
