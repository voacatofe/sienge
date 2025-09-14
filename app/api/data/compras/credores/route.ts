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
    const ativo = searchParams.get('ativo');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (ativo !== null && ativo !== undefined) {
      where.ativo = ativo === 'true';
    }

    if (search) {
      where.OR = [
        { nomeCredor: { contains: search, mode: 'insensitive' } },
        { cpfCnpj: { contains: search, mode: 'insensitive' } },
        { emailContato: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [credores, total] = await Promise.all([
      prisma.credor.findMany({
        where,
        skip,
        take: limit,
        select: {
          idCredor: true,
          tipoCredor: true,
          nomeCredor: true,
          cpfCnpj: true,
          inscricaoEstadual: true,
          contato: true,
          telefoneContato: true,
          emailContato: true,
          ativo: true,
          ehCorretor: true,
          enderecos: {
            select: {
              idEndereco: true,
              logradouro: true,
              numero: true,
              complemento: true,
              bairro: true,
              cep: true,
            },
          },
          contasBancarias: {
            select: {
              idInfoBancaria: true,
              banco: true,
              agencia: true,
              conta: true,
              tipoConta: true,
            },
          },
        },
        orderBy: { nomeCredor: 'asc' },
      }),
      prisma.credor.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: credores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: '/api/data/compras/credores',
        description: 'Credores/Fornecedores - Categoria Compras',
        entityType: 'credores',
        category: 'compras',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Credores API] Erro ao buscar credores:', error);
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
