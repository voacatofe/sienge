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
        endpoint: '/api/data/organizacional/departments',
        description: 'Departamentos - Categoria Organizacional',
        entityType: 'departments',
        category: 'organizacional',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Departments API] Erro ao buscar departamentos:', error);
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
