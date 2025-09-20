import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-singleton';
import { createContextLogger } from '@/lib/logger';

const logger = createContextLogger('gold-portfolio');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parâmetros de filtro
    const unidadeId = searchParams.get('unidade_id');
    const unidadeNome = searchParams.get('unidade_nome');
    const tipoImovel = searchParams.get('tipo_imovel');
    const empreendimentoId = searchParams.get('empreendimento_id');
    const empreendimentoNome = searchParams.get('empreendimento_nome');
    const empresaId = searchParams.get('empresa_id');
    const contratoId = searchParams.get('contrato_id');
    const numeroContrato = searchParams.get('numero_contrato');
    const statusUnidade = searchParams.get('status_unidade');
    const statusContrato = searchParams.get('contrato_status');
    const statusEmpreendimento = searchParams.get('status_empreendimento');
    const categoriaValor = searchParams.get('categoria_valor');
    const categoriaTamanho = searchParams.get('categoria_tamanho');
    const categoriaTipo = searchParams.get('categoria_tipo');
    const statusEntrega = searchParams.get('status_entrega');
    const segmentoEstrategico = searchParams.get('segmento_estrategico');
    const temContratoVinculado = searchParams.get('tem_contrato_vinculado');
    const temEmpreendimentoVinculado = searchParams.get(
      'tem_empreendimento_vinculado'
    );
    const temCoordenadas = searchParams.get('tem_coordenadas');
    const areaMinima = searchParams.get('area_minima');
    const areaMaxima = searchParams.get('area_maxima');
    const valorMinimo = searchParams.get('valor_minimo');
    const valorMaximo = searchParams.get('valor_maximo');
    const qualidadeMinima = searchParams.get('qualidade_minima');
    const scoreMinimo = searchParams.get('score_minimo');

    // Parâmetros de ordenação e limite
    const orderBy = searchParams.get('order_by') || 'score_atratividade';
    const orderDirection = searchParams.get('order_direction') || 'DESC';
    const limit = parseInt(searchParams.get('limit') || '500');

    // Construir WHERE dinâmico
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (unidadeId) {
      whereClause += ` AND unidade_id = $${params.length + 1}`;
      params.push(parseInt(unidadeId));
    }

    if (unidadeNome) {
      whereClause += ` AND unidade_nome ILIKE $${params.length + 1}`;
      params.push(`%${unidadeNome}%`);
    }

    if (tipoImovel) {
      whereClause += ` AND tipo_imovel ILIKE $${params.length + 1}`;
      params.push(`%${tipoImovel}%`);
    }

    if (empreendimentoId) {
      whereClause += ` AND empreendimento_id = $${params.length + 1}`;
      params.push(parseInt(empreendimentoId));
    }

    if (empreendimentoNome) {
      whereClause += ` AND empreendimento_nome ILIKE $${params.length + 1}`;
      params.push(`%${empreendimentoNome}%`);
    }

    if (empresaId) {
      whereClause += ` AND empresa_id = $${params.length + 1}`;
      params.push(parseInt(empresaId));
    }

    if (contratoId) {
      whereClause += ` AND contrato_id = $${params.length + 1}`;
      params.push(parseInt(contratoId));
    }

    if (numeroContrato) {
      whereClause += ` AND numero_contrato ILIKE $${params.length + 1}`;
      params.push(`%${numeroContrato}%`);
    }

    if (statusUnidade) {
      whereClause += ` AND status_unidade = $${params.length + 1}`;
      params.push(statusUnidade);
    }

    if (statusContrato) {
      whereClause += ` AND contrato_status = $${params.length + 1}`;
      params.push(statusContrato);
    }

    if (statusEmpreendimento) {
      whereClause += ` AND status_empreendimento = $${params.length + 1}`;
      params.push(statusEmpreendimento);
    }

    if (categoriaValor) {
      whereClause += ` AND categoria_valor = $${params.length + 1}`;
      params.push(categoriaValor);
    }

    if (categoriaTamanho) {
      whereClause += ` AND categoria_tamanho = $${params.length + 1}`;
      params.push(categoriaTamanho);
    }

    if (categoriaTipo) {
      whereClause += ` AND categoria_tipo = $${params.length + 1}`;
      params.push(categoriaTipo);
    }

    if (statusEntrega) {
      whereClause += ` AND status_entrega = $${params.length + 1}`;
      params.push(statusEntrega);
    }

    if (segmentoEstrategico) {
      whereClause += ` AND segmento_estrategico = $${params.length + 1}`;
      params.push(segmentoEstrategico);
    }

    if (temContratoVinculado) {
      whereClause += ` AND tem_contrato_vinculado = $${params.length + 1}`;
      params.push(temContratoVinculado === 'true');
    }

    if (temEmpreendimentoVinculado) {
      whereClause += ` AND tem_empreendimento_vinculado = $${params.length + 1}`;
      params.push(temEmpreendimentoVinculado === 'true');
    }

    if (temCoordenadas) {
      whereClause += ` AND tem_coordenadas = $${params.length + 1}`;
      params.push(temCoordenadas === 'true');
    }

    if (areaMinima) {
      whereClause += ` AND area_total >= $${params.length + 1}`;
      params.push(parseFloat(areaMinima));
    }

    if (areaMaxima) {
      whereClause += ` AND area_total <= $${params.length + 1}`;
      params.push(parseFloat(areaMaxima));
    }

    if (valorMinimo) {
      whereClause += ` AND contrato_valor_venda >= $${params.length + 1}`;
      params.push(parseFloat(valorMinimo));
    }

    if (valorMaximo) {
      whereClause += ` AND contrato_valor_venda <= $${params.length + 1}`;
      params.push(parseFloat(valorMaximo));
    }

    if (qualidadeMinima) {
      whereClause += ` AND qualidade_score >= $${params.length + 1}`;
      params.push(parseFloat(qualidadeMinima));
    }

    if (scoreMinimo) {
      whereClause += ` AND score_atratividade >= $${params.length + 1}`;
      params.push(parseFloat(scoreMinimo));
    }

    logger.info('Buscando dados gold.portfolio_imobiliario', {
      filtros: {
        unidadeId,
        tipoImovel,
        empreendimentoId,
        statusUnidade,
        statusContrato,
        orderBy,
        limit,
      },
    });

    // Validar campo de ordenação
    const validOrderFields = [
      'unidade_nome',
      'tipo_imovel',
      'area_total',
      'contrato_valor_venda',
      'data_contrato',
      'qualidade_score',
      'score_atratividade',
      'empreendimento_nome',
      'status_unidade',
      'categoria_valor',
    ];

    const finalOrderBy = validOrderFields.includes(orderBy)
      ? orderBy
      : 'score_atratividade';
    const finalOrderDirection = ['ASC', 'DESC'].includes(
      orderDirection.toUpperCase()
    )
      ? orderDirection.toUpperCase()
      : 'DESC';

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

        -- Dados da Unidade
        unidade_id,
        unidade_nome,
        tipo_imovel,
        estoque_comercial,
        unidade_observacao,
        matricula,
        pavimento,
        unidade_numero_contrato,
        inscricao_imobiliaria,

        -- Áreas e Medidas
        area_privativa,
        area_comum,
        area_terreno,
        area_util,
        area_total,
        fracao_ideal,
        fracao_ideal_m2,

        -- Valores
        valor_terreno,
        valor_iptu,
        adimplencia_premiada,
        quantidade_indexada,

        -- Localização
        latitude,
        longitude,
        link_maps,

        -- Datas
        data_entrega,
        data_entrega_programada,
        unidade_data_cadastro,
        unidade_data_atualizacao,

        -- Empreendimento
        empreendimento_id,
        empreendimento_nome,
        empreendimento_nome_comercial,
        tipo_empreendimento,
        empreendimento_endereco,
        empreendimento_categoria,
        empreendimento_porte,
        status_empreendimento,
        empreendimento_cnpj,
        empresa_id,
        empresa_nome,
        empreendimento_total_unidades,
        empreendimento_total_contratos,
        empreendimento_area_total,
        empreendimento_valor_total,
        empreendimento_proxima_entrega,
        empreendimento_ultima_entrega,

        -- Contrato
        contrato_id,
        numero_contrato,
        data_contrato,
        contrato_valor_venda,
        contrato_status,
        contrato_cliente_nome,
        contrato_data_entrega_chaves,

        -- Relacionamentos
        total_unidades_filhas,
        total_agrupamentos,
        total_valores_especiais,
        total_links,

        -- JSON Fields
        unidades_filhas_json,
        agrupamentos_json,
        valores_especiais_json,
        links_json,

        -- Categorização
        status_unidade,
        categoria_tamanho,
        categoria_tipo,
        categoria_valor,
        status_entrega,
        dias_para_entrega,
        valor_por_m2,
        coeficiente_aproveitamento,
        percentual_area_privativa,

        -- Qualidade de Dados
        tem_nome_valido,
        tem_area_valida,
        tem_valor_valido,
        tem_localizacao_valida,
        tem_data_entrega_valida,
        qualidade_score,

        -- Flags de Relacionamento
        tem_empreendimento_vinculado,
        tem_contrato_vinculado,
        tem_coordenadas,
        tem_unidades_filhas,
        tem_agrupamentos,

        -- Análise Estratégica
        participacao_no_empreendimento,
        margem_venda_percentual,
        segmento_estrategico,
        score_atratividade,

        -- Metadados
        data_processamento

      FROM gold.portfolio_imobiliario
      ${whereClause}
      ORDER BY ${finalOrderBy} ${finalOrderDirection}
      LIMIT $${params.length + 1}
    `;

    params.push(Math.min(limit, 1000)); // Máximo 1000 registros

    const result = await prisma.$queryRawUnsafe(sql, ...params);

    // Estatísticas para metadata
    const statsQuery = `
      SELECT 
        COUNT(*) as total_registros,
        COUNT(DISTINCT empreendimento_id) as total_empreendimentos,
        COUNT(DISTINCT empresa_id) as total_empresas,
        COUNT(DISTINCT tipo_imovel) as tipos_imoveis,
        COUNT(CASE WHEN tem_contrato_vinculado THEN 1 END) as unidades_vendidas,
        COUNT(CASE WHEN status_unidade = 'Disponível' THEN 1 END) as unidades_disponiveis,
        AVG(area_total) as area_media,
        AVG(contrato_valor_venda) as valor_medio,
        AVG(qualidade_score) as qualidade_media,
        SUM(area_total) as area_total_portfolio,
        SUM(contrato_valor_venda) as valor_total_portfolio
      FROM gold.portfolio_imobiliario
      ${whereClause}
    `;

    const statsResult = await prisma.$queryRawUnsafe(
      statsQuery,
      ...params.slice(0, -1)
    );
    const stats = Array.isArray(statsResult) ? statsResult[0] : statsResult;

    const response = {
      success: true,
      data: result,
      metadata: {
        total_registros: Number(stats.total_registros || 0),
        total_empreendimentos: Number(stats.total_empreendimentos || 0),
        total_empresas: Number(stats.total_empresas || 0),
        tipos_imoveis: Number(stats.tipos_imoveis || 0),
        unidades_vendidas: Number(stats.unidades_vendidas || 0),
        unidades_disponiveis: Number(stats.unidades_disponiveis || 0),
        area_media: Number(stats.area_media || 0),
        valor_medio: Number(stats.valor_medio || 0),
        qualidade_media: Number(stats.qualidade_media || 0),
        area_total_portfolio: Number(stats.area_total_portfolio || 0),
        valor_total_portfolio: Number(stats.valor_total_portfolio || 0),
        registros_retornados: Array.isArray(result) ? result.length : 0,
        source: 'gold.portfolio_imobiliario',
        total_fields: 85,
        volume: '2,669 unidades',
        categories: {
          identificacao: ['unidade_id', 'unidade_nome', 'tipo_imovel'],
          areas: ['area_privativa', 'area_comum', 'area_total', 'fracao_ideal'],
          valores: ['contrato_valor_venda', 'valor_terreno', 'valor_por_m2'],
          localizacao: ['latitude', 'longitude', 'empreendimento_endereco'],
          empreendimento: [
            'empreendimento_nome',
            'empreendimento_categoria',
            'empreendimento_porte',
          ],
          contrato: ['numero_contrato', 'data_contrato', 'contrato_status'],
          status: ['status_unidade', 'status_entrega', 'status_empreendimento'],
          categorias: [
            'categoria_tamanho',
            'categoria_tipo',
            'categoria_valor',
          ],
          qualidade: [
            'qualidade_score',
            'score_atratividade',
            'segmento_estrategico',
          ],
          relacionamentos: [
            'tem_contrato_vinculado',
            'tem_empreendimento_vinculado',
          ],
        },
        filtros_disponiveis: [
          'unidade_id',
          'unidade_nome',
          'tipo_imovel',
          'empreendimento_id',
          'empreendimento_nome',
          'empresa_id',
          'contrato_id',
          'numero_contrato',
          'status_unidade',
          'contrato_status',
          'status_empreendimento',
          'categoria_valor',
          'categoria_tamanho',
          'categoria_tipo',
          'status_entrega',
          'segmento_estrategico',
          'tem_contrato_vinculado',
          'tem_empreendimento_vinculado',
          'tem_coordenadas',
          'area_minima',
          'area_maxima',
          'valor_minimo',
          'valor_maximo',
          'qualidade_minima',
          'score_minimo',
        ],
        ordenacoes_disponiveis: [
          'unidade_nome',
          'tipo_imovel',
          'area_total',
          'contrato_valor_venda',
          'data_contrato',
          'qualidade_score',
          'score_atratividade',
          'empreendimento_nome',
          'status_unidade',
          'categoria_valor',
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
    logger.error('Erro ao buscar dados gold.portfolio_imobiliario', { error });

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
      api: 'Sienge Data Warehouse - Gold Portfolio Imobiliário',
      version: '1.0',
      description:
        'API especializada em análise completa do portfolio imobiliário com dados gold enriquecidos',
      endpoint: '/api/datawarehouse/gold/portfolio',
      method: 'GET',
      source: 'gold.portfolio_imobiliario (2,669 unidades, 85 campos)',

      parametros: {
        // Filtros de identificação
        unidade_id: 'ID específico da unidade - opcional',
        unidade_nome: 'Nome/número da unidade (busca parcial) - opcional',
        tipo_imovel: 'Tipo do imóvel (busca parcial) - opcional',
        empreendimento_id: 'ID do empreendimento - opcional',
        empreendimento_nome:
          'Nome do empreendimento (busca parcial) - opcional',
        empresa_id: 'ID da empresa - opcional',
        contrato_id: 'ID do contrato - opcional',
        numero_contrato: 'Número do contrato (busca parcial) - opcional',

        // Filtros de status
        status_unidade:
          'Status da unidade (Vendida, Disponível, etc.) - opcional',
        contrato_status: 'Status do contrato - opcional',
        status_empreendimento: 'Status do empreendimento - opcional',
        status_entrega: 'Status de entrega - opcional',

        // Filtros de categorização
        categoria_valor: 'Categoria de valor - opcional',
        categoria_tamanho: 'Categoria de tamanho - opcional',
        categoria_tipo: 'Categoria de tipo - opcional',
        segmento_estrategico: 'Segmento estratégico - opcional',

        // Filtros booleanos
        tem_contrato_vinculado: 'true/false - unidades com contrato - opcional',
        tem_empreendimento_vinculado:
          'true/false - unidades com empreendimento - opcional',
        tem_coordenadas: 'true/false - unidades com localização - opcional',

        // Filtros de área
        area_minima: 'Área total mínima em m² - opcional',
        area_maxima: 'Área total máxima em m² - opcional',

        // Filtros de valor
        valor_minimo: 'Valor mínimo do contrato - opcional',
        valor_maximo: 'Valor máximo do contrato - opcional',

        // Filtros de qualidade
        qualidade_minima: 'Score mínimo de qualidade (0-100) - opcional',
        score_minimo: 'Score mínimo de atratividade - opcional',

        // Ordenação e limite
        order_by:
          'Campo para ordenação (padrão: score_atratividade) - opcional',
        order_direction: 'ASC ou DESC (padrão: DESC) - opcional',
        limit: 'Limite de registros (padrão: 500, máx: 1000) - opcional',
      },

      exemplos: {
        todas_unidades: '/api/datawarehouse/gold/portfolio',
        unidades_vendidas:
          '/api/datawarehouse/gold/portfolio?status_unidade=Vendida',
        unidades_disponiveis:
          '/api/datawarehouse/gold/portfolio?status_unidade=Disponível',
        empreendimento_especifico:
          '/api/datawarehouse/gold/portfolio?empreendimento_id=1210',
        alto_valor: '/api/datawarehouse/gold/portfolio?valor_minimo=500000',
        grandes_areas: '/api/datawarehouse/gold/portfolio?area_minima=100',
        apartamentos:
          '/api/datawarehouse/gold/portfolio?tipo_imovel=Apartamento',
        alta_qualidade: '/api/datawarehouse/gold/portfolio?qualidade_minima=80',
        com_coordenadas:
          '/api/datawarehouse/gold/portfolio?tem_coordenadas=true',
        ordem_valor:
          '/api/datawarehouse/gold/portfolio?order_by=contrato_valor_venda&order_direction=DESC',
      },

      analises_disponiveis: {
        portfolio: 'Distribuição por tipo, tamanho, valor das unidades',
        geografica: 'Distribuição por empreendimento, localização',
        performance: 'Análise de vendas, disponibilidade, atratividade',
        financeira: 'Valor total, ticket médio, margem de venda',
        qualidade: 'Completude de dados, consistência cadastral',
        estrategica: 'Segmentação estratégica, score de atratividade',
        temporal: 'Análise de entregas, cronograma, sazonalidade',
        empreendimentos: 'Performance por empreendimento, empresa',
      },

      campos_especiais: {
        jsonb_fields: [
          'unidades_filhas_json',
          'agrupamentos_json',
          'valores_especiais_json',
          'links_json',
        ],
        scores: [
          'qualidade_score (0-100)',
          'score_atratividade (valor calculado)',
        ],
        flags_relacionamento: [
          'tem_contrato_vinculado',
          'tem_empreendimento_vinculado',
          'tem_coordenadas',
          'tem_unidades_filhas',
          'tem_agrupamentos',
        ],
        areas: [
          'area_privativa',
          'area_comum',
          'area_total',
          'fracao_ideal',
          'percentual_area_privativa',
        ],
      },

      integracao: {
        looker_studio:
          'Use como fonte de dados Web - ideal para dashboards imobiliários',
        power_bi: 'Conecte via Web - suporte completo a filtros dinâmicos',
        crm_imobiliario: 'Integração com sistemas imobiliários via API',
        formato: 'JSON otimizado com tipos padronizados',
        cache: '1 hora',
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
