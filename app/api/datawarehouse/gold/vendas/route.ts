import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-singleton';
import { createContextLogger } from '@/lib/logger';

const logger = createContextLogger('gold-vendas');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parâmetros de filtro
    const dataInicio = searchParams.get('data_inicio');
    const dataFim = searchParams.get('data_fim');
    const statusContrato = searchParams.get('status_derivado');
    const empresaId = searchParams.get('empresa_id');
    const empreendimentoId = searchParams.get('empreendimento_id');
    const clienteId = searchParams.get('cliente_id');
    const temComissao = searchParams.get('tem_comissao');
    const valorMinimo = searchParams.get('valor_minimo');
    const valorMaximo = searchParams.get('valor_maximo');

    // Construir WHERE dinâmico
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    // Filtro de data (últimos 12 meses por padrão)
    if (dataInicio && dataFim) {
      whereClause += ` AND data_principal BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(dataInicio, dataFim);
    } else {
      // Padrão: últimos 12 meses
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);

      whereClause += ` AND data_principal >= $${params.length + 1}`;
      params.push(startDate);
    }

    if (statusContrato) {
      whereClause += ` AND status_derivado = $${params.length + 1}`;
      params.push(statusContrato);
    }

    if (empresaId) {
      whereClause += ` AND empresa_id = $${params.length + 1}`;
      params.push(parseInt(empresaId));
    }

    if (empreendimentoId) {
      whereClause += ` AND empreendimento_id = $${params.length + 1}`;
      params.push(parseInt(empreendimentoId));
    }

    if (clienteId) {
      whereClause += ` AND cliente_id = $${params.length + 1}`;
      params.push(parseInt(clienteId));
    }

    if (temComissao) {
      whereClause += ` AND tem_comissao = $${params.length + 1}`;
      params.push(temComissao === 'true');
    }

    if (valorMinimo) {
      whereClause += ` AND valor_venda_total >= $${params.length + 1}`;
      params.push(parseFloat(valorMinimo));
    }

    if (valorMaximo) {
      whereClause += ` AND valor_venda_total <= $${params.length + 1}`;
      params.push(parseFloat(valorMaximo));
    }

    logger.info('Buscando dados gold.vendas_360', {
      filtros: {
        dataInicio,
        dataFim,
        statusContrato,
        empresaId,
        empreendimentoId,
        clienteId,
        temComissao,
        valorMinimo,
        valorMaximo,
      },
    });

    // Query principal
    const sql = `
      SELECT
        -- Identificação
        domain_type,
        unique_id,
        data_principal,
        ano,
        mes,
        ano_mes,

        -- Contrato
        contrato_id,
        numero_contrato,
        contrato_id_externo,
        situacao_contrato,
        status_derivado,
        categoria_valor_contrato,

        -- Datas
        data_contrato,
        data_emissao,
        data_entrega_prevista,
        data_entrega_chaves,
        data_cancelamento,

        -- Valores
        valor_contrato_original,
        valor_venda_total,
        valor_cancelamento,
        valor_total_calculado,
        valor_total_pago,
        saldo_devedor,
        percentual_pago,

        -- Parcelamento
        total_parcelas,
        parcelas_pagas,
        forma_pagamento_principal,
        indexador_principal,
        tem_financiamento,

        -- Desconto e Juros
        tipo_desconto,
        percentual_desconto,
        tipo_correcao,
        tipo_juros,
        percentual_juros,

        -- Comissões
        tem_comissao,
        total_comissoes,
        valor_total_comissao,
        faixa_valor_comissao,
        percentual_comissao_sobre_contrato,

        -- Cliente
        cliente_id,
        cliente_nome,
        cliente_nome_social,
        cliente_documento,
        cliente_tipo_pessoa,
        cliente_email,
        cliente_telefone,
        cliente_cidade,
        cliente_estado,
        cliente_idade,
        cliente_faixa_etaria,
        categoria_tempo_cliente,
        cliente_qualidade_score,

        -- Empreendimento
        empreendimento_id,
        empreendimento_nome,
        empreendimento_nome_comercial,
        tipo_empreendimento,
        empreendimento_endereco,
        empreendimento_categoria,
        empreendimento_porte,
        status_empreendimento,

        -- Empresa
        empresa_id,
        empresa_nome,

        -- Unidades
        total_unidades_vendidas,
        area_privativa_total,
        area_privativa_media,
        valor_por_m2,

        -- Performance
        percentual_parcelas_pagas,
        percentual_valor_pago,
        dias_para_primeira_entrega,
        dias_para_ultima_entrega,

        -- Categorização
        situacao_detalhada,
        categoria_valor_venda,
        categoria_risco,
        completude_score,

        -- Flags
        tem_cliente_vinculado,
        tem_empreendimento_vinculado,
        tem_unidades_vinculadas,
        tem_comissao_configurada,

        -- JSONs (para análises detalhadas)
        clientes_json,
        unidades_json,
        condicoes_pagamento_json,
        corretores_json,
        comissoes_json,

        -- Metadados
        data_processamento,
        ultima_atualizacao_contrato

      FROM gold.vendas_360
      ${whereClause}
      ORDER BY data_principal DESC, valor_venda_total DESC
    `;

    // Executar query
    const rawData = (await prisma.$queryRawUnsafe(sql, ...params)) as any[];

    // Processar dados para compatibilidade com Looker Studio
    const data = rawData.map((row: any) => ({
      ...row,
      // Converter datas para ISO string
      data_principal: row.data_principal
        ? new Date(row.data_principal).toISOString().split('T')[0]
        : null,
      data_contrato: row.data_contrato
        ? new Date(row.data_contrato).toISOString().split('T')[0]
        : null,
      data_emissao: row.data_emissao
        ? new Date(row.data_emissao).toISOString().split('T')[0]
        : null,
      data_entrega_prevista: row.data_entrega_prevista
        ? new Date(row.data_entrega_prevista).toISOString().split('T')[0]
        : null,
      data_entrega_chaves: row.data_entrega_chaves
        ? new Date(row.data_entrega_chaves).toISOString().split('T')[0]
        : null,
      data_cancelamento: row.data_cancelamento
        ? new Date(row.data_cancelamento).toISOString().split('T')[0]
        : null,

      // Garantir números limpos
      valor_contrato_original: parseFloat(row.valor_contrato_original) || 0,
      valor_venda_total: parseFloat(row.valor_venda_total) || 0,
      valor_total_pago: parseFloat(row.valor_total_pago) || 0,
      saldo_devedor: parseFloat(row.saldo_devedor) || 0,
      valor_total_comissao: parseFloat(row.valor_total_comissao) || 0,
      percentual_comissao_sobre_contrato:
        parseFloat(row.percentual_comissao_sobre_contrato) || 0,
      percentual_pago: parseFloat(row.percentual_pago) || 0,
      percentual_desconto: parseFloat(row.percentual_desconto) || 0,
      percentual_juros: parseFloat(row.percentual_juros) || 0,
      area_privativa_total: parseFloat(row.area_privativa_total) || 0,
      area_privativa_media: parseFloat(row.area_privativa_media) || 0,
      valor_por_m2: parseFloat(row.valor_por_m2) || 0,

      // Garantir inteiros
      total_parcelas: parseInt(row.total_parcelas) || 0,
      parcelas_pagas: parseInt(row.parcelas_pagas) || 0,
      total_comissoes: parseInt(row.total_comissoes) || 0,
      total_unidades_vendidas: parseInt(row.total_unidades_vendidas) || 0,
      cliente_idade: parseInt(row.cliente_idade) || 0,
      dias_para_primeira_entrega: parseInt(row.dias_para_primeira_entrega) || 0,
      dias_para_ultima_entrega: parseInt(row.dias_para_ultima_entrega) || 0,

      // Garantir booleans
      tem_comissao: Boolean(row.tem_comissao),
      tem_financiamento: Boolean(row.tem_financiamento),
      tem_cliente_vinculado: Boolean(row.tem_cliente_vinculado),
      tem_empreendimento_vinculado: Boolean(row.tem_empreendimento_vinculado),
      tem_unidades_vinculadas: Boolean(row.tem_unidades_vinculadas),
      tem_comissao_configurada: Boolean(row.tem_comissao_configurada),
    }));

    // Estatísticas agregadas
    const stats = (await prisma.$queryRawUnsafe(
      `
      SELECT
        COUNT(*) as total_contratos,
        COUNT(CASE WHEN status_derivado = 'Em Andamento' THEN 1 END) as contratos_ativos,
        COUNT(CASE WHEN status_derivado = 'Cancelado' THEN 1 END) as contratos_cancelados,
        COUNT(CASE WHEN tem_comissao = true THEN 1 END) as contratos_com_comissao,
        ROUND(AVG(valor_venda_total), 2) as valor_medio_venda,
        ROUND(SUM(valor_venda_total), 2) as valor_total_vendas,
        ROUND(SUM(valor_total_pago), 2) as valor_total_recebido,
        ROUND(SUM(saldo_devedor), 2) as saldo_devedor_total,
        ROUND(AVG(percentual_pago), 2) as percentual_medio_pago,
        COUNT(DISTINCT cliente_id) as clientes_unicos,
        COUNT(DISTINCT empreendimento_id) as empreendimentos_unicos,
        COUNT(DISTINCT empresa_id) as empresas_unicas
      FROM gold.vendas_360
      ${whereClause}
    `,
      ...params
    )) as any[];

    const statistics = stats[0];

    // Top performers
    const topContratos = (await prisma.$queryRawUnsafe(
      `
      SELECT
        numero_contrato,
        cliente_nome,
        empreendimento_nome,
        valor_venda_total,
        status_derivado
      FROM gold.vendas_360
      ${whereClause}
      ORDER BY valor_venda_total DESC
      LIMIT 10
    `,
      ...params
    )) as any[];

    // Distribuição por status
    const distribStatus = (await prisma.$queryRawUnsafe(
      `
      SELECT
        status_derivado,
        COUNT(*) as quantidade,
        ROUND(SUM(valor_venda_total), 2) as valor_total
      FROM gold.vendas_360
      ${whereClause}
      GROUP BY status_derivado
      ORDER BY quantidade DESC
    `,
      ...params
    )) as any[];

    const response = {
      success: true,
      data: data,
      metadata: {
        total_records: data.length,
        filtros_aplicados: {
          data_inicio: dataInicio,
          data_fim: dataFim,
          status_derivado: statusContrato,
          empresa_id: empresaId,
          empreendimento_id: empreendimentoId,
          cliente_id: clienteId,
          tem_comissao: temComissao,
          valor_range:
            valorMinimo || valorMaximo
              ? `${valorMinimo || 0} - ${valorMaximo || '∞'}`
              : null,
        },
        estatisticas: {
          ...statistics,
          total_contratos: Number(statistics.total_contratos),
          contratos_ativos: Number(statistics.contratos_ativos),
          contratos_cancelados: Number(statistics.contratos_cancelados),
          contratos_com_comissao: Number(statistics.contratos_com_comissao),
          clientes_unicos: Number(statistics.clientes_unicos),
          empreendimentos_unicos: Number(statistics.empreendimentos_unicos),
          empresas_unicas: Number(statistics.empresas_unicas),
        },
        top_contratos: topContratos.map(c => ({
          ...c,
          valor_venda_total: parseFloat(c.valor_venda_total) || 0,
        })),
        distribuicao_status: distribStatus.map(d => ({
          ...d,
          quantidade: Number(d.quantidade),
          valor_total: parseFloat(d.valor_total) || 0,
        })),
        last_updated: new Date().toISOString(),
      },
      schema: {
        description: 'API Gold - Vendas 360°',
        source: 'gold.vendas_360',
        grain: 'Contrato de Venda',
        total_fields: 103,
        categories: {
          identificacao: ['contrato_id', 'numero_contrato', 'data_principal'],
          valores: ['valor_venda_total', 'valor_total_pago', 'saldo_devedor'],
          cliente: ['cliente_nome', 'cliente_documento', 'cliente_cidade'],
          empreendimento: ['empreendimento_nome', 'tipo_empreendimento'],
          comissoes: [
            'tem_comissao',
            'valor_total_comissao',
            'percentual_comissao',
          ],
          performance: [
            'percentual_pago',
            'categoria_risco',
            'completude_score',
          ],
          temporais: ['data_contrato', 'data_entrega_prevista', 'ano_mes'],
        },
        filtros_disponiveis: [
          'data_inicio',
          'data_fim',
          'status_derivado',
          'empresa_id',
          'empreendimento_id',
          'cliente_id',
          'tem_comissao',
          'valor_minimo',
          'valor_maximo',
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
    logger.error('Erro ao buscar dados gold.vendas_360', { error });

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
      api: 'Sienge Data Warehouse - Gold Vendas 360°',
      version: '1.0',
      description:
        'API especializada em análise de vendas e contratos com dados gold pré-agregados',
      endpoint: '/api/datawarehouse/gold/vendas',
      method: 'GET',
      source: 'gold.vendas_360 (689 contratos, 103 campos)',

      parametros: {
        data_inicio: 'Data início (YYYY-MM-DD) - opcional',
        data_fim: 'Data fim (YYYY-MM-DD) - opcional',
        status_derivado:
          'Status do contrato (Em Andamento, Cancelado, etc) - opcional',
        empresa_id: 'ID da empresa - opcional',
        empreendimento_id: 'ID do empreendimento - opcional',
        cliente_id: 'ID do cliente - opcional',
        tem_comissao: 'true/false - opcional',
        valor_minimo: 'Valor mínimo de venda - opcional',
        valor_maximo: 'Valor máximo de venda - opcional',
      },

      exemplos: {
        todos_contratos: '/api/datawarehouse/gold/vendas',
        contratos_ativos:
          '/api/datawarehouse/gold/vendas?status_derivado=Em Andamento',
        periodo_especifico:
          '/api/datawarehouse/gold/vendas?data_inicio=2024-01-01&data_fim=2024-12-31',
        com_comissao: '/api/datawarehouse/gold/vendas?tem_comissao=true',
        faixa_valor:
          '/api/datawarehouse/gold/vendas?valor_minimo=100000&valor_maximo=500000',
        empreendimento: '/api/datawarehouse/gold/vendas?empreendimento_id=123',
      },

      retorno: {
        estrutura: 'success, data[], metadata{}, schema{}',
        estatisticas: 'Total contratos, valores agregados, distribuições',
        top_performers: 'Top 10 contratos por valor',
        campos_principais:
          '103 campos incluindo valores, cliente, empreendimento, comissões',
      },

      integracao: {
        looker_studio: 'Use como fonte de dados Web',
        power_bi: 'Conecte via Web',
        cache: '1 hora',
        formato: 'JSON com tipos otimizados',
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
