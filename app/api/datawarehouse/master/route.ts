import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    // Calcular automaticamente o período de 1 ano atrás até hoje
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    // Parâmetros de query opcionais
    const { searchParams } = new URL(request.url);
    const domainType = searchParams.get('domain') || 'all';
    const empresaFilter = searchParams.get('empresa');

    console.log(
      `Buscando dados master de ${startDate.toISOString().split('T')[0]} até ${endDate.toISOString().split('T')[0]}`
    );
    console.log(`Filtros: domain=${domainType}, empresa=${empresaFilter || 'todas'}`);

    // Query dinâmica baseada na view única
    let whereClause = 'WHERE data_principal >= $1';
    const params: any[] = [startDate];

    if (domainType !== 'all') {
      whereClause += ` AND domain_type = $${params.length + 1}`;
      params.push(domainType);
    }

    if (empresaFilter) {
      whereClause += ` AND empresa_nome ILIKE $${params.length + 1}`;
      params.push(`%${empresaFilter}%`);
    }

    const sql = `
      SELECT * FROM rpt_sienge_master_wide
      ${whereClause}
      ORDER BY data_principal DESC, domain_type
    `;

    // Executar query
    const data = await prisma.$queryRawUnsafe(sql, ...params);

    // Obter metadados básicos
    const metadataResult = (await prisma.$queryRawUnsafe(
      `
      SELECT
        COUNT(*) as total_records,
        MIN(data_principal) as earliest_date,
        MAX(data_principal) as latest_date,
        COUNT(DISTINCT domain_type) as domain_count,
        COUNT(DISTINCT empresa_nome) as empresa_count,
        NOW() as last_refresh
      FROM rpt_sienge_master_wide
      ${whereClause}
    `,
      ...params
    )) as [
      {
        total_records: bigint;
        earliest_date: Date;
        latest_date: Date;
        domain_count: bigint;
        empresa_count: bigint;
        last_refresh: Date;
      },
    ];

    const metadata = metadataResult[0];

    // Estatísticas por domínio
    const domainStats = (await prisma.$queryRawUnsafe(
      `
      SELECT
        domain_type,
        COUNT(*) as records,
        SUM(COALESCE(valor_contrato, valor_original, 0)) as valor_total
      FROM rpt_sienge_master_wide
      ${whereClause}
      GROUP BY domain_type
      ORDER BY records DESC
    `,
      ...params
    )) as Array<{
      domain_type: string;
      records: bigint;
      valor_total: number;
    }>;

    // Resposta com a nova estrutura unificada
    const response = {
      success: true,
      data: data,
      metadata: {
        total_records: Number(metadata.total_records),
        domain_types: Number(metadata.domain_count),
        empresas: Number(metadata.empresa_count),
        period: {
          from: startDate.toISOString().split('T')[0],
          to: endDate.toISOString().split('T')[0],
          description: 'Últimos 12 meses automaticamente',
        },
        filters: {
          domain: domainType,
          empresa: empresaFilter || 'todas',
        },
        data_range: {
          earliest: metadata.earliest_date,
          latest: metadata.latest_date,
        },
        domain_statistics: domainStats.map(stat => ({
          domain: stat.domain_type,
          records: Number(stat.records),
          valor_total: Number(stat.valor_total),
        })),
        last_updated: metadata.last_refresh,
        note: 'API Master unificada - combina contratos, financeiro e movimentos bancários',
      },
      schema: {
        description: 'Data Warehouse Master - Vista Unificada Sienge',
        grain: 'Transação (Contrato, Título ou Movimento)',
        domains: ['contratos', 'financeiro', 'movimentos'],
        categories: {
          Data: {
            description: 'Dimensões temporais universais',
            fields: [
              'data_principal',
              'ano',
              'trimestre',
              'mes',
              'ano_mes',
              'nome_mes',
            ],
          },
          Empresas: {
            description: 'Dimensões organizacionais',
            fields: [
              'empresa_nome',
              'empresa_cidade',
              'empresa_estado',
              'empresa_regiao',
              'empresa_cnpj',
            ],
          },
          Contratos: {
            description: 'Métricas e dimensões de contratos',
            fields: [
              'valor_contrato',
              'status_contrato',
              'tipo_contrato',
              'numero_contrato',
              'contratos_ativos',
              'chaves_entregues',
              'contratos_assinados',
            ],
          },
          Financeiro: {
            description: 'Métricas financeiras e aging',
            fields: [
              'valor_original',
              'valor_pago',
              'saldo_devedor',
              'taxa_inadimplencia',
              'dias_atraso',
              'forma_pagamento',
              'taxa_juros',
              'aging_0_30',
              'aging_31_60',
              'aging_61_90',
              'aging_90_plus',
            ],
          },
          Performance: {
            description: 'Métricas de performance e eficiência',
            fields: [
              'margem_bruta',
              'tempo_venda',
              'valor_por_m2',
              'eficiencia_cobranca',
            ],
          },
          Clientes: {
            description: 'Dimensões de clientes',
            fields: [
              'cliente_nome',
              'cliente_principal',
              'cliente_tipo',
            ],
          },
          Empreendimentos: {
            description: 'Dimensões de empreendimentos e unidades',
            fields: [
              'empreendimento_nome',
              'empreendimento_tipo',
              'unidade_tipo',
              'unidade_area',
              'faixa_area',
            ],
          },
          Conversoes: {
            description: 'Métricas de conversão e status',
            fields: [
              'contratos_cancelados',
              'titulos_pagos',
              'titulos_vencidos',
            ],
          },
        },
        usage: {
          all_domains: '/api/datawarehouse/master',
          contracts_only: '/api/datawarehouse/master?domain=contratos',
          financial_only: '/api/datawarehouse/master?domain=financeiro',
          movements_only: '/api/datawarehouse/master?domain=movimentos',
          filtered_by_company: '/api/datawarehouse/master?empresa=Nome%20da%20Empresa',
        },
      },
    };

    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
      },
    });
  } catch (error) {
    console.error('Erro ao buscar dados do Data Warehouse Master:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        data: [],
        metadata: null,
        note: "Verifique se a view materializada 'rpt_sienge_master_wide' existe no banco de dados.",
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
  } finally {
    await prisma.$disconnect();
  }
}

// Endpoint de informações da API (para documentação)
export async function OPTIONS() {
  return NextResponse.json(
    {
      api: 'Sienge Data Warehouse - Master',
      version: '2.0',
      description: 'API REST unificada para todos os domínios do Data Warehouse',
      url: '/api/datawarehouse/master',
      method: 'GET',
      parameters: {
        domain: 'Filtrar por domínio: contratos, financeiro, movimentos (opcional)',
        empresa: 'Filtrar por nome da empresa (busca parcial, opcional)',
      },
      behavior: 'Sempre retorna dados dos últimos 12 meses automaticamente',
      refresh: 'Dados atualizados diariamente às 6h',
      domains: {
        contratos: 'Contratos de venda e informações comerciais',
        financeiro: 'Títulos a receber, aging e inadimplência',
        movimentos: 'Movimentos bancários e fluxo de caixa',
      },
      usage: {
        looker_studio: "Usar como 'Conector da Web' com esta URL",
        power_bi: "Usar como fonte de dados 'Web' com esta URL",
        all_data: '/api/datawarehouse/master',
        contracts_only: '/api/datawarehouse/master?domain=contratos',
        financial_only: '/api/datawarehouse/master?domain=financeiro',
      },
      migration: {
        from: '/api/datawarehouse/vendas (deprecated)',
        to: '/api/datawarehouse/master',
        breaking_changes: 'Nova estrutura de campos e grupos semânticos',
        compatibility: 'Use ?domain=contratos para comportamento similar ao anterior',
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