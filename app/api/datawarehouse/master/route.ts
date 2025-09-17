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
    const rawData = await prisma.$queryRawUnsafe(sql, ...params) as any[];

    // Processar e limpar dados para compatibilidade com Looker Studio
    const data = rawData.map((row: any) => ({
      ...row,
      // Converter datas para string no formato ISO
      data_principal: row.data_principal ? new Date(row.data_principal).toISOString().split('T')[0] : null,

      // Converter números decimais para formato limpo
      valor_contrato: row.valor_contrato ? parseFloat(row.valor_contrato) : 0,
      saldo_devedor: row.saldo_devedor ? parseFloat(row.saldo_devedor) : 0,
      taxa_juros: row.taxa_juros ? parseFloat(row.taxa_juros) : 0,
      margem_bruta: row.margem_bruta ? parseFloat(row.margem_bruta) : 0,
      unidade_area: row.unidade_area ? parseFloat(row.unidade_area) : 0,

      // Garantir que booleans sejam realmente boolean
      contratos_ativos: row.contratos_ativos === true || row.contratos_ativos === 'true',
      chaves_entregues: row.chaves_entregues === true || row.chaves_entregues === 'true',
      contratos_assinados: row.contratos_assinados === true || row.contratos_assinados === 'true',
      contratos_cancelados: row.contratos_cancelados === true || row.contratos_cancelados === 'true',

      // Garantir que integers sejam números
      total_parcelas: row.total_parcelas ? parseInt(row.total_parcelas) : 0,
      parcelas_pagas: row.parcelas_pagas ? parseInt(row.parcelas_pagas) : 0,
    }));

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
        note: 'API Master unificada - combina contratos, clientes, empreendimentos e unidades',
      },
      schema: {
        description: 'Data Warehouse Master - Vista Unificada Sienge',
        grain: 'Registro (Contrato, Cliente, Empreendimento ou Unidade)',
        domains: ['contratos', 'clientes', 'empreendimentos', 'unidades'],
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
            description: 'Métricas financeiras de contratos',
            fields: [
              'saldo_devedor',
              'forma_pagamento',
              'taxa_juros',
              'total_parcelas',
              'parcelas_pagas',
            ],
          },
          Performance: {
            description: 'Métricas de performance de vendas',
            fields: [
              'margem_bruta',
            ],
          },
          Clientes: {
            description: 'Dimensões de clientes',
            fields: [
              'cliente_principal',
            ],
          },
          Empreendimentos: {
            description: 'Dimensões de empreendimentos',
            fields: [
              'empreendimento_nome',
              'empreendimento_tipo',
            ],
          },
          Unidades: {
            description: 'Dimensões de unidades imobiliárias',
            fields: [
              'unidade_tipo',
              'unidade_area',
              'faixa_area',
            ],
          },
          Conversoes: {
            description: 'Métricas de conversão de contratos',
            fields: [
              'contratos_cancelados',
            ],
          },
        },
        usage: {
          all_domains: '/api/datawarehouse/master',
          contracts_only: '/api/datawarehouse/master?domain=contratos',
          clients_only: '/api/datawarehouse/master?domain=clientes',
          projects_only: '/api/datawarehouse/master?domain=empreendimentos',
          units_only: '/api/datawarehouse/master?domain=unidades',
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
        domain: 'Filtrar por domínio: contratos, clientes, empreendimentos, unidades (opcional)',
        empresa: 'Filtrar por nome da empresa (busca parcial, opcional)',
      },
      behavior: 'Sempre retorna dados dos últimos 12 meses automaticamente',
      refresh: 'Dados atualizados diariamente às 6h',
      domains: {
        contratos: 'Contratos de venda e informações comerciais (787 registros)',
        clientes: 'Base de clientes e informações pessoais (818 registros)',
        empreendimentos: 'Projetos imobiliários e desenvolvimento (201 registros)',
        unidades: 'Inventário de unidades imobiliárias (1.213 registros)',
      },
      usage: {
        looker_studio: "Usar como 'Conector da Web' com esta URL",
        power_bi: "Usar como fonte de dados 'Web' com esta URL",
        all_data: '/api/datawarehouse/master',
        contracts_only: '/api/datawarehouse/master?domain=contratos',
        clients_only: '/api/datawarehouse/master?domain=clientes',
        projects_only: '/api/datawarehouse/master?domain=empreendimentos',
        units_only: '/api/datawarehouse/master?domain=unidades',
      },
      migration: {
        from: '/api/datawarehouse/vendas (deprecated)',
        to: '/api/datawarehouse/master',
        breaking_changes: 'Nova estrutura de campos e grupos semânticos',
        compatibility: 'Use ?domain=contratos para compatibilidade com API vendas anterior',
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