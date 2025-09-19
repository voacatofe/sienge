import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-singleton';
import { createContextLogger } from '@/lib/logger';

const logger = createContextLogger('gold-financeiro');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parâmetros de filtro
    const dataInicio = searchParams.get('data_inicio');
    const dataFim = searchParams.get('data_fim');
    const centroCustoId = searchParams.get('centro_custo_id');
    const centroCustoNome = searchParams.get('centro_custo_nome');
    const planoFinanceiroId = searchParams.get('plano_financeiro_id');
    const classificacaoFluxo = searchParams.get('classificacao_fluxo');
    const categoriaExtrato = searchParams.get('categoria_extrato');
    const origemExtrato = searchParams.get('origem_extrato');
    const empresaId = searchParams.get('empresa_id');
    const valorMinimo = searchParams.get('valor_minimo');
    const valorMaximo = searchParams.get('valor_maximo');
    const statusConciliacao = searchParams.get('status_conciliacao');
    const tipoMovimento = searchParams.get('tipo_movimento');

    // Parâmetros de agregação
    const agruparPor = searchParams.get('agrupar_por') || 'mes'; // mes, trimestre, centro_custo, plano_financeiro
    const limit = parseInt(searchParams.get('limit') || '1000');

    // Construir WHERE dinâmico
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    // Filtro de data (últimos 6 meses por padrão devido ao volume)
    if (dataInicio && dataFim) {
      whereClause += ` AND data_principal BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(dataInicio, dataFim);
    } else {
      // Padrão: últimos 6 meses (devido ao volume)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 6);

      whereClause += ` AND data_principal >= $${params.length + 1}`;
      params.push(startDate);
    }

    if (centroCustoId) {
      whereClause += ` AND centro_custo_id = $${params.length + 1}`;
      params.push(parseInt(centroCustoId));
    }

    if (centroCustoNome) {
      whereClause += ` AND centro_custo_nome ILIKE $${params.length + 1}`;
      params.push(`%${centroCustoNome}%`);
    }

    if (planoFinanceiroId) {
      whereClause += ` AND plano_financeiro_id = $${params.length + 1}`;
      params.push(parseInt(planoFinanceiroId));
    }

    if (classificacaoFluxo) {
      whereClause += ` AND classificacao_fluxo = $${params.length + 1}`;
      params.push(classificacaoFluxo);
    }

    if (categoriaExtrato) {
      whereClause += ` AND categoria_extrato = $${params.length + 1}`;
      params.push(categoriaExtrato);
    }

    if (origemExtrato) {
      whereClause += ` AND origem_extrato = $${params.length + 1}`;
      params.push(origemExtrato);
    }

    if (empresaId) {
      whereClause += ` AND empresa_id = $${params.length + 1}`;
      params.push(parseInt(empresaId));
    }

    if (valorMinimo) {
      whereClause += ` AND ABS(valor_extrato) >= $${params.length + 1}`;
      params.push(parseFloat(valorMinimo));
    }

    if (valorMaximo) {
      whereClause += ` AND ABS(valor_extrato) <= $${params.length + 1}`;
      params.push(parseFloat(valorMaximo));
    }

    if (statusConciliacao) {
      whereClause += ` AND status_conciliacao = $${params.length + 1}`;
      params.push(statusConciliacao);
    }

    if (tipoMovimento) {
      whereClause += ` AND tipo_movimento = $${params.length + 1}`;
      params.push(tipoMovimento);
    }

    logger.info('Buscando dados gold.performance_financeira', {
      filtros: {
        dataInicio,
        dataFim,
        centroCustoId,
        centroCustoNome,
        planoFinanceiroId,
        classificacaoFluxo,
        agruparPor,
        limit,
      },
    });

    // Query principal baseada no tipo de agrupamento
    let sql = '';
    let isAggregated = false;

    if (agruparPor === 'detalhado') {
      // Dados detalhados (limitados)
      sql = `
        SELECT
          -- Identificação
          domain_type,
          unique_id,
          data_principal,
          ano,
          mes,
          ano_mes,
          trimestre,

          -- Financeiro
          valor_extrato,
          origem_extrato,
          classificacao_fluxo,
          descricao_extrato,
          centro_custo_nome,
          centro_custo_id,
          plano_financeiro_nome,
          plano_financeiro_id,

          -- Documento
          numero_documento,
          numero_parcela,
          tipo_original,
          beneficiario,
          referencia_documento,
          documento_relacionado_id,

          -- Conta
          conta_bancaria_id,
          saldo_conta,
          conta_conciliada,
          status_conciliacao,

          -- Apropriação
          percentual_apropriacao,
          valor_apropriado,

          -- Categorização
          faixa_valor_extrato,
          categoria_extrato,
          tipo_movimento,
          categoria_valor,

          -- Controle
          titulo_pagar_id,
          tags_categorizacao,
          categorias_orcamentarias,
          observacoes,

          -- Análises
          movimento_caixa,
          periodo_lancamento,
          dias_desde_lancamento,
          idade_lancamento,
          estacao,
          sazonalidade,
          status_liquidez,
          score_importancia_financeira,

          -- Empresa
          empresa_id,

          -- Datas de controle
          data_criacao_registro,
          data_atualizacao_registro,
          data_reconciliacao_bancaria,
          data_processamento

        FROM gold.performance_financeira
        ${whereClause}
        ORDER BY data_principal DESC, ABS(valor_extrato) DESC
        LIMIT $${params.length + 1}
      `;
      params.push(limit);
    } else {
      // Dados agregados
      isAggregated = true;
      let groupByClause = '';
      let selectClause = '';

      switch (agruparPor) {
        case 'mes':
          groupByClause = 'ano, mes, ano_mes';
          selectClause = 'ano, mes, ano_mes';
          break;
        case 'trimestre':
          groupByClause = 'ano, trimestre';
          selectClause =
            "ano, trimestre, CONCAT(ano, '-T', trimestre) as periodo";
          break;
        case 'centro_custo':
          groupByClause = 'centro_custo_id, centro_custo_nome';
          selectClause = 'centro_custo_id, centro_custo_nome';
          break;
        case 'plano_financeiro':
          groupByClause = 'plano_financeiro_id, plano_financeiro_nome';
          selectClause = 'plano_financeiro_id, plano_financeiro_nome';
          break;
        case 'classificacao':
          groupByClause = 'classificacao_fluxo';
          selectClause = 'classificacao_fluxo';
          break;
        case 'categoria':
          groupByClause = 'categoria_extrato';
          selectClause = 'categoria_extrato';
          break;
        default:
          groupByClause = 'ano, mes, ano_mes';
          selectClause = 'ano, mes, ano_mes';
      }

      sql = `
        SELECT
          ${selectClause},
          COUNT(*) as total_lancamentos,
          COUNT(DISTINCT numero_documento) as documentos_unicos,
          ROUND(SUM(valor_extrato), 2) as valor_total_extrato,
          ROUND(SUM(valor_apropriado), 2) as valor_total_apropriado,
          ROUND(SUM(CASE WHEN valor_extrato > 0 THEN valor_extrato ELSE 0 END), 2) as entradas,
          ROUND(SUM(CASE WHEN valor_extrato < 0 THEN ABS(valor_extrato) ELSE 0 END), 2) as saidas,
          ROUND(AVG(valor_extrato), 2) as valor_medio,
          ROUND(AVG(ABS(valor_extrato)), 2) as valor_medio_absoluto,
          MIN(valor_extrato) as menor_valor,
          MAX(valor_extrato) as maior_valor,
          COUNT(CASE WHEN status_conciliacao = 'Conciliado' THEN 1 END) as conciliados,
          COUNT(CASE WHEN status_conciliacao = 'Pendente' THEN 1 END) as pendentes,
          ROUND(AVG(score_importancia_financeira), 2) as score_medio_importancia,
          COUNT(DISTINCT centro_custo_id) as centros_custo_distintos,
          COUNT(DISTINCT plano_financeiro_id) as planos_financeiros_distintos,
          MIN(data_principal) as data_inicial,
          MAX(data_principal) as data_final
        FROM gold.performance_financeira
        ${whereClause}
        GROUP BY ${groupByClause}
        ORDER BY
          ${
            agruparPor === 'mes'
              ? 'ano DESC, mes DESC'
              : agruparPor === 'trimestre'
                ? 'ano DESC, trimestre DESC'
                : 'valor_total_extrato DESC'
          }
        LIMIT $${params.length + 1}
      `;
      params.push(limit);
    }

    // Executar query principal
    const rawData = (await prisma.$queryRawUnsafe(sql, ...params)) as any[];

    // Processar dados
    const data = rawData.map((row: any) => {
      const processedRow: any = { ...row };

      // Converter datas
      if (row.data_principal) {
        processedRow.data_principal = new Date(row.data_principal)
          .toISOString()
          .split('T')[0];
      }
      if (row.data_criacao_registro) {
        processedRow.data_criacao_registro = new Date(row.data_criacao_registro)
          .toISOString()
          .split('T')[0];
      }
      if (row.data_atualizacao_registro) {
        processedRow.data_atualizacao_registro = new Date(
          row.data_atualizacao_registro
        )
          .toISOString()
          .split('T')[0];
      }

      // Converter números
      const numericFields = [
        'valor_extrato',
        'valor_apropriado',
        'saldo_conta',
        'percentual_apropriacao',
        'score_importancia_financeira',
        'dias_desde_lancamento',
        'idade_lancamento',
        'valor_total_extrato',
        'valor_total_apropriado',
        'entradas',
        'saidas',
        'valor_medio',
        'valor_medio_absoluto',
        'menor_valor',
        'maior_valor',
        'score_medio_importancia',
      ];

      numericFields.forEach(field => {
        if (row[field] !== undefined && row[field] !== null) {
          processedRow[field] = parseFloat(row[field]) || 0;
        }
      });

      // Converter inteiros
      const intFields = [
        'numero_parcela',
        'dias_desde_lancamento',
        'idade_lancamento',
        'total_lancamentos',
        'documentos_unicos',
        'conciliados',
        'pendentes',
        'centros_custo_distintos',
        'planos_financeiros_distintos',
      ];

      intFields.forEach(field => {
        if (row[field] !== undefined && row[field] !== null) {
          processedRow[field] = parseInt(row[field]) || 0;
        }
      });

      // Converter booleans
      if (row.conta_conciliada !== undefined) {
        processedRow.conta_conciliada = Boolean(row.conta_conciliada);
      }

      return processedRow;
    });

    // Estatísticas gerais (sempre calculadas)
    const statsQuery = `
      SELECT
        COUNT(*) as total_registros,
        COUNT(DISTINCT centro_custo_id) as centros_custo_distintos,
        COUNT(DISTINCT plano_financeiro_id) as planos_financeiros_distintos,
        COUNT(DISTINCT empresa_id) as empresas_distintas,
        ROUND(SUM(valor_extrato), 2) as valor_total_movimentado,
        ROUND(SUM(CASE WHEN valor_extrato > 0 THEN valor_extrato ELSE 0 END), 2) as total_entradas,
        ROUND(SUM(CASE WHEN valor_extrato < 0 THEN ABS(valor_extrato) ELSE 0 END), 2) as total_saidas,
        ROUND(AVG(valor_extrato), 2) as valor_medio_lancamento,
        COUNT(CASE WHEN status_conciliacao = 'Conciliado' THEN 1 END) as total_conciliados,
        COUNT(CASE WHEN status_conciliacao = 'Pendente' THEN 1 END) as total_pendentes,
        ROUND(AVG(score_importancia_financeira), 2) as score_medio_importancia
      FROM gold.performance_financeira
      ${whereClause}
    `;

    const stats = (await prisma.$queryRawUnsafe(
      statsQuery,
      ...params.slice(0, -1)
    )) as any[];
    const statistics = stats[0];

    // Top centros de custo por movimento
    const topCentrosCusto = (await prisma.$queryRawUnsafe(
      `
      SELECT
        centro_custo_nome,
        COUNT(*) as total_lancamentos,
        ROUND(SUM(ABS(valor_extrato)), 2) as valor_total_absoluto,
        ROUND(SUM(valor_extrato), 2) as saldo_liquido
      FROM gold.performance_financeira
      ${whereClause}
      GROUP BY centro_custo_nome
      ORDER BY valor_total_absoluto DESC
      LIMIT 10
    `,
      ...params.slice(0, -1)
    )) as any[];

    // Distribuição por classificação de fluxo
    const distribFluxo = (await prisma.$queryRawUnsafe(
      `
      SELECT
        classificacao_fluxo,
        COUNT(*) as quantidade,
        ROUND(SUM(valor_extrato), 2) as valor_total
      FROM gold.performance_financeira
      ${whereClause}
      GROUP BY classificacao_fluxo
      ORDER BY quantidade DESC
    `,
      ...params.slice(0, -1)
    )) as any[];

    const response = {
      success: true,
      data: data,
      metadata: {
        total_records: data.length,
        tipo_agregacao: isAggregated ? agruparPor : 'detalhado',
        filtros_aplicados: {
          data_inicio: dataInicio,
          data_fim: dataFim,
          centro_custo_id: centroCustoId,
          centro_custo_nome: centroCustoNome,
          plano_financeiro_id: planoFinanceiroId,
          classificacao_fluxo: classificacaoFluxo,
          categoria_extrato: categoriaExtrato,
          origem_extrato: origemExtrato,
          empresa_id: empresaId,
          valor_range:
            valorMinimo || valorMaximo
              ? `${valorMinimo || 0} - ${valorMaximo || '∞'}`
              : null,
          status_conciliacao: statusConciliacao,
          tipo_movimento: tipoMovimento,
          limit: limit,
        },
        estatisticas: {
          ...statistics,
          total_registros: Number(statistics.total_registros),
          centros_custo_distintos: Number(statistics.centros_custo_distintos),
          planos_financeiros_distintos: Number(
            statistics.planos_financeiros_distintos
          ),
          empresas_distintas: Number(statistics.empresas_distintas),
          total_conciliados: Number(statistics.total_conciliados),
          total_pendentes: Number(statistics.total_pendentes),
          taxa_conciliacao:
            (Number(statistics.total_conciliados) /
              Number(statistics.total_registros)) *
            100,
        },
        top_centros_custo: topCentrosCusto.map(c => ({
          ...c,
          total_lancamentos: Number(c.total_lancamentos),
          valor_total_absoluto: parseFloat(c.valor_total_absoluto) || 0,
          saldo_liquido: parseFloat(c.saldo_liquido) || 0,
        })),
        distribuicao_fluxo: distribFluxo.map(d => ({
          ...d,
          quantidade: Number(d.quantidade),
          valor_total: parseFloat(d.valor_total) || 0,
        })),
        last_updated: new Date().toISOString(),
        performance_note: `${Number(statistics.total_registros).toLocaleString()} registros financeiros processados`,
      },
      schema: {
        description: 'API Gold - Performance Financeira',
        source: 'gold.performance_financeira',
        grain: isAggregated
          ? `Agregado por ${agruparPor}`
          : 'Extrato Financeiro Individual',
        total_fields: 47,
        volume: '51,801 registros (64 MB)',
        categories: {
          temporais: ['data_principal', 'ano', 'mes', 'trimestre', 'ano_mes'],
          financeiros: ['valor_extrato', 'valor_apropriado', 'saldo_conta'],
          organizacionais: ['centro_custo_nome', 'plano_financeiro_nome'],
          documentais: [
            'numero_documento',
            'referencia_documento',
            'beneficiario',
          ],
          controle: [
            'status_conciliacao',
            'conta_conciliada',
            'movimento_caixa',
          ],
          analises: [
            'score_importancia_financeira',
            'categoria_valor',
            'sazonalidade',
          ],
        },
        filtros_disponiveis: [
          'data_inicio',
          'data_fim',
          'centro_custo_id',
          'centro_custo_nome',
          'plano_financeiro_id',
          'classificacao_fluxo',
          'categoria_extrato',
          'origem_extrato',
          'empresa_id',
          'valor_minimo',
          'valor_maximo',
          'status_conciliacao',
          'tipo_movimento',
        ],
        agregacoes_disponiveis: [
          'mes',
          'trimestre',
          'centro_custo',
          'plano_financeiro',
          'classificacao',
          'categoria',
          'detalhado',
        ],
      },
    };

    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600', // Cache 1 hora
      },
    });
  } catch (error) {
    logger.error('Erro ao buscar dados gold.performance_financeira', { error });

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        data: [],
        metadata: null,
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

// Documentação da API
export async function OPTIONS() {
  return NextResponse.json(
    {
      api: 'Sienge Data Warehouse - Gold Performance Financeira',
      version: '1.0',
      description:
        'API especializada em análise financeira com dados gold pré-agregados e alta performance',
      endpoint: '/api/datawarehouse/gold/financeiro',
      method: 'GET',
      source:
        'gold.performance_financeira (51,801 registros, 47 campos, 64 MB)',

      parametros: {
        // Filtros
        data_inicio: 'Data início (YYYY-MM-DD) - padrão: 6 meses atrás',
        data_fim: 'Data fim (YYYY-MM-DD) - padrão: hoje',
        centro_custo_id: 'ID do centro de custo - opcional',
        centro_custo_nome: 'Nome do centro de custo (busca parcial) - opcional',
        plano_financeiro_id: 'ID do plano financeiro - opcional',
        classificacao_fluxo:
          'Classificação do fluxo (Entrada, Saída, etc) - opcional',
        categoria_extrato: 'Categoria do extrato - opcional',
        origem_extrato: 'Origem do extrato - opcional',
        empresa_id: 'ID da empresa - opcional',
        valor_minimo: 'Valor mínimo (absoluto) - opcional',
        valor_maximo: 'Valor máximo (absoluto) - opcional',
        status_conciliacao:
          'Status da conciliação (Conciliado, Pendente) - opcional',
        tipo_movimento: 'Tipo de movimento - opcional',

        // Agregação
        agrupar_por:
          'mes, trimestre, centro_custo, plano_financeiro, classificacao, categoria, detalhado - padrão: mes',
        limit: 'Limite de registros (padrão: 1000, máx: 5000) - opcional',
      },

      exemplos: {
        agregado_mensal: '/api/datawarehouse/gold/financeiro?agrupar_por=mes',
        por_centro_custo:
          '/api/datawarehouse/gold/financeiro?agrupar_por=centro_custo',
        detalhado_limitado:
          '/api/datawarehouse/gold/financeiro?agrupar_por=detalhado&limit=500',
        periodo_especifico:
          '/api/datawarehouse/gold/financeiro?data_inicio=2024-01-01&data_fim=2024-03-31',
        centro_especifico:
          '/api/datawarehouse/gold/financeiro?centro_custo_nome=Marketing',
        grandes_valores:
          '/api/datawarehouse/gold/financeiro?valor_minimo=10000',
        pendentes_conciliacao:
          '/api/datawarehouse/gold/financeiro?status_conciliacao=Pendente',
        fluxo_entrada:
          '/api/datawarehouse/gold/financeiro?classificacao_fluxo=Entrada',
      },

      performance: {
        cache: '1 hora',
        volume_maximo: '51,801 registros total',
        limite_recomendado: '1,000 registros por consulta',
        periodo_padrao: '6 meses (devido ao volume)',
        otimizacao: 'Use agregações para melhor performance',
      },

      agregacoes: {
        mes: 'Agrupamento por ano/mês com totais e médias',
        trimestre: 'Agrupamento trimestral',
        centro_custo: 'Agrupamento por centro de custo',
        plano_financeiro: 'Agrupamento por plano financeiro',
        classificacao: 'Agrupamento por classificação de fluxo',
        categoria: 'Agrupamento por categoria de extrato',
        detalhado: 'Dados individuais (limitado para performance)',
      },

      metricas_calculadas: {
        entradas: 'Soma de valores positivos',
        saidas: 'Soma de valores negativos (absolutos)',
        saldo_liquido: 'Entradas - Saídas',
        valor_medio: 'Média dos valores',
        taxa_conciliacao: 'Percentual de registros conciliados',
        score_importancia: 'Score médio de importância financeira',
      },

      integracao: {
        looker_studio: 'Use como fonte de dados Web - recomendado agregações',
        power_bi: 'Conecte via Web - configure cache adequado',
        formato: 'JSON otimizado para BI',
        recomendacao: 'Para análises detalhadas, use filtros específicos',
      },
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
