import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-singleton';
import { createContextLogger } from '@/lib/logger';

const logger = createContextLogger('datawarehouse-financial');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    // Parâmetros de query opcionais
    const { searchParams } = new URL(request.url);
    const domainType = searchParams.get('domain') || 'all';
    const empresaFilter = searchParams.get('empresa');
    const limit = searchParams.get('limit');

    logger.info(`Buscando dados financeiros`);
    logger.info(
      `Filtros: domain=${domainType}, empresa=${empresaFilter || 'todas'}`
    );

    // Query dinâmica baseada na nova view financeira
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (domainType !== 'all') {
      whereClause += ` AND domain_type = $${params.length + 1}`;
      params.push(domainType);
    }

    if (empresaFilter) {
      whereClause += ` AND record_name ILIKE $${params.length + 1}`;
      params.push(`%${empresaFilter}%`);
    }

    let limitClause = '';
    if (limit) {
      limitClause = ` LIMIT $${params.length + 1}`;
      params.push(parseInt(limit));
    }

    const sql = `
      SELECT * FROM rpt_sienge_master_wide_v2
      ${whereClause}
      ORDER BY created_at DESC, domain_type
      ${limitClause}
    `;

    // Executar query
    const rawData = (await prisma.$queryRawUnsafe(sql, ...params)) as any[];

    // Processar e limpar dados para compatibilidade com Looker Studio
    const data = rawData.map((row: any) => ({
      ...row,
      // Converter datas para string no formato ISO
      created_at: row.created_at
        ? new Date(row.created_at).toISOString().split('T')[0]
        : null,
      updated_at: row.updated_at
        ? new Date(row.updated_at).toISOString().split('T')[0]
        : null,

      // Garantir que JSON seja parseado corretamente
      additional_data:
        typeof row.additional_data === 'string'
          ? JSON.parse(row.additional_data)
          : row.additional_data,
    }));

    // Obter metadados básicos
    const metadataResult = (await prisma.$queryRawUnsafe(
      `
      SELECT
        COUNT(*) as total_records,
        MIN(created_at) as earliest_date,
        MAX(created_at) as latest_date,
        COUNT(DISTINCT domain_type) as domain_count,
        NOW() as last_refresh
      FROM rpt_sienge_master_wide_v2
      ${whereClause}
    `,
      ...params.slice(0, -1) // Remove limit param for metadata
    )) as [
      {
        total_records: bigint;
        earliest_date: Date;
        latest_date: Date;
        domain_count: bigint;
        last_refresh: Date;
      },
    ];

    const metadata = metadataResult[0];

    // Estatísticas por domínio
    const domainStats = (await prisma.$queryRawUnsafe(
      `
      SELECT
        domain_type,
        domain_name,
        COUNT(*) as records,
        MIN(created_at) as oldest_record,
        MAX(created_at) as newest_record
      FROM rpt_sienge_master_wide_v2
      ${whereClause}
      GROUP BY domain_type, domain_name
      ORDER BY records DESC
    `,
      ...params.slice(0, -1) // Remove limit param for stats
    )) as Array<{
      domain_type: string;
      domain_name: string;
      records: bigint;
      oldest_record: Date;
      newest_record: Date;
    }>;

    // Resposta com a nova estrutura financeira
    const response = {
      success: true,
      data: data,
      metadata: {
        total_records: Number(metadata.total_records),
        domain_types: Number(metadata.domain_count),
        filters: {
          domain: domainType,
          empresa: empresaFilter || 'todas',
          limit: limit || 'sem limite',
        },
        data_range: {
          earliest: metadata.earliest_date,
          latest: metadata.latest_date,
        },
        domain_statistics: domainStats.map(stat => ({
          domain: stat.domain_type,
          name: stat.domain_name,
          records: Number(stat.records),
          oldest_record: stat.oldest_record,
          newest_record: stat.newest_record,
        })),
        last_updated: metadata.last_refresh,
        note: 'API Financeira - Gestão de centros de custo, planos financeiros e extratos',
      },
      schema: {
        description: 'Data Warehouse Financeiro - Gestão Financeira Sienge',
        grain:
          'Registro (Empresa, Centro de Custo, Plano Financeiro ou Extrato)',
        domains: [
          'empresas',
          'centro-custos',
          'planos-financeiros',
          'extratos-contas',
        ],
        categories: {
          Temporal: {
            description: 'Dimensões temporais',
            fields: ['created_at', 'updated_at'],
          },
          Identificacao: {
            description: 'Identificadores únicos',
            fields: [
              'record_id',
              'record_name',
              'main_identifier',
              'record_status',
            ],
          },
          Empresas: {
            description: 'Gestão de empresas e filiais',
            fields: ['empresas: nomeEmpresa, cnpj, inscricaoEstadual'],
          },
          CentrosCusto: {
            description: 'Centros de custo e departamentos',
            fields: ['centro-custos: nome, cnpj, empresaId, buildingSectors'],
          },
          PlanosFinanceiros: {
            description: 'Categorias e planos de contas',
            fields: ['planos-financeiros: nome, tipoConta, redutora, ativo'],
          },
          ExtratosContas: {
            description: 'Movimentações e extratos financeiros',
            fields: [
              'extratos-contas: valor, tipo, centroCusto, planoFinanceiro',
            ],
          },
        },
        usage: {
          all_domains: '/api/datawarehouse/financial',
          companies_only: '/api/datawarehouse/financial?domain=empresas',
          cost_centers_only:
            '/api/datawarehouse/financial?domain=centro-custos',
          financial_plans_only:
            '/api/datawarehouse/financial?domain=planos-financeiros',
          account_statements_only:
            '/api/datawarehouse/financial?domain=extratos-contas',
          limit_results: '/api/datawarehouse/financial?limit=100',
        },
      },
    };

    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=1800', // Cache por 30 minutos
      },
    });
  } catch (error) {
    logger.error('Erro ao buscar dados do Data Warehouse Financeiro', {
      error,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        data: [],
        metadata: null,
        note: "Verifique se a view materializada 'rpt_sienge_master_wide_v2' existe no banco de dados.",
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

// Endpoint de informações da API (para documentação)
export async function OPTIONS() {
  return NextResponse.json(
    {
      api: 'Sienge Data Warehouse - Financial',
      version: '1.0',
      description: 'API REST para domínios financeiros do Data Warehouse',
      url: '/api/datawarehouse/financial',
      method: 'GET',
      parameters: {
        domain:
          'Filtrar por domínio: empresas, centro-custos, planos-financeiros, extratos-contas (opcional)',
        empresa: 'Filtrar por nome da empresa (busca parcial, opcional)',
        limit: 'Limitar número de resultados (opcional)',
      },
      behavior: 'Retorna dados financeiros organizados por domínio',
      refresh: 'Dados atualizados em tempo real via sincronização',
      domains: {
        empresas: 'Empresas e filiais cadastradas',
        'centro-custos': 'Centros de custo e departamentos',
        'planos-financeiros': 'Categorias e planos de contas financeiras',
        'extratos-contas': 'Movimentações e extratos financeiros',
      },
      usage: {
        looker_studio: "Usar como 'Conector da Web' com esta URL",
        power_bi: "Usar como fonte de dados 'Web' com esta URL",
        all_financial_data: '/api/datawarehouse/financial',
        companies_only: '/api/datawarehouse/financial?domain=empresas',
        cost_centers_only: '/api/datawarehouse/financial?domain=centro-custos',
        financial_plans_only:
          '/api/datawarehouse/financial?domain=planos-financeiros',
        account_statements_only:
          '/api/datawarehouse/financial?domain=extratos-contas',
      },
      support: 'Para dúvidas, verifique a documentação ou logs do sistema',
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
