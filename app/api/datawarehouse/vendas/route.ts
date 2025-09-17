import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Calcular automaticamente o período de 1 ano atrás até hoje
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    console.log(
      `Buscando dados de ${startDate.toISOString().split('T')[0]} até ${endDate.toISOString().split('T')[0]}`
    );

    // Query simples: todos os dados do último ano
    const sql = `
      SELECT * FROM rpt_vendas_wide
      WHERE data_contrato >= $1
      ORDER BY data_contrato DESC
    `;

    // Executar query
    const data = await prisma.$queryRawUnsafe(sql, startDate);

    // Obter metadados básicos
    const metadataResult = (await prisma.$queryRawUnsafe(
      `
      SELECT
        COUNT(*) as total_records,
        MIN(data_contrato) as earliest_date,
        MAX(data_contrato) as latest_date,
        NOW() as last_refresh
      FROM rpt_vendas_wide
      WHERE data_contrato >= $1
    `,
      startDate
    )) as [
      {
        total_records: bigint;
        earliest_date: Date;
        latest_date: Date;
        last_refresh: Date;
      },
    ];

    const metadata = metadataResult[0];

    // Resposta simplificada
    const response = {
      success: true,
      data: data,
      metadata: {
        total_records: Number(metadata.total_records),
        period: {
          from: startDate.toISOString().split('T')[0],
          to: endDate.toISOString().split('T')[0],
          description: 'Últimos 12 meses automaticamente',
        },
        data_range: {
          earliest: metadata.earliest_date,
          latest: metadata.latest_date,
        },
        last_updated: metadata.last_refresh,
        note: 'Esta API sempre retorna dados dos últimos 12 meses automaticamente. Não são necessários parâmetros.',
      },
      schema: {
        description: 'Data Warehouse - Dashboard Comercial Sienge',
        grain: 'Contrato de Venda',
        categories: {
          Performance: {
            description: 'Métricas de desempenho de vendas',
            fields: [
              'Performance — Valor Contrato',
              'Performance — Valor Venda Total',
              'Performance — Valor por M²',
              'Performance — Margem Bruta (%)',
              'Performance — Tempo Venda (dias)',
            ],
          },
          Conversions: {
            description: 'Métricas de conversão e status',
            fields: [
              'Conversions — Status Contrato',
              'Conversions — Contratos Ativos',
              'Conversions — Contratos Cancelados',
              'Conversions — Chaves Entregues',
              'Conversions — Contratos Assinados',
            ],
          },
          Financial: {
            description: 'Métricas financeiras e de pagamento',
            fields: [
              'Financial — Desconto (%)',
              'Financial — Valor Desconto',
              'Financial — Forma Pagamento',
              'Financial — Taxa Juros (%)',
              'Financial — Total Parcelas',
              'Financial — Saldo Devedor',
            ],
          },
          Segmentation: {
            description: 'Dimensões de segmentação',
            fields: [
              'Segmentation — Faixa Valor',
              'Segmentation — Canal Venda',
              'Segmentation — Tipo Contrato',
            ],
          },
          Time: {
            description: 'Dimensões temporais',
            fields: [
              'data_contrato',
              'ano',
              'trimestre',
              'mes',
              'ano_mes',
              'nome_mes',
            ],
          },
          Geography: {
            description: 'Dimensões geográficas',
            fields: [
              'empresa_regiao',
              'empresa_estado',
              'empresa_cidade',
              'empresa_nome',
            ],
          },
          Business: {
            description: 'Dimensões de negócio',
            fields: [
              'empreendimento_nome',
              'empreendimento_tipo',
              'unidade_tipo',
              'unidade_faixa_area',
              'cliente_principal',
            ],
          },
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
    console.error('Erro ao buscar dados do Data Warehouse:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        data: [],
        metadata: null,
        note: "Verifique se a view materializada 'rpt_vendas_wide' existe no banco de dados.",
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
      api: 'Sienge Data Warehouse - Vendas',
      version: '1.0',
      description: 'API REST para acesso aos dados do Data Warehouse de vendas',
      url: '/api/datawarehouse/vendas',
      method: 'GET',
      parameters: 'Nenhum parâmetro necessário',
      behavior: 'Sempre retorna dados dos últimos 12 meses automaticamente',
      refresh: 'Dados atualizados diariamente às 6h',
      usage: {
        looker_studio: "Usar como 'Conector da Web' com esta URL",
        power_bi: "Usar como fonte de dados 'Web' com esta URL",
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
