import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-singleton';
import { createContextLogger } from '@/lib/logger';

const logger = createContextLogger('gold-clientes');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parâmetros de filtro
    const clienteId = searchParams.get('cliente_id');
    const nomeCliente = searchParams.get('nome_cliente');
    const documento = searchParams.get('documento');
    const tipoePessoa = searchParams.get('tipo_pessoa');
    const cidade = searchParams.get('cidade');
    const estado = searchParams.get('estado');
    const faixaEtaria = searchParams.get('faixa_etaria');
    const categoriaCliente = searchParams.get('categoria_cliente');
    const categoriaRisco = searchParams.get('categoria_risco');
    const temContrato = searchParams.get('tem_contrato');
    const temSaldoDevedor = searchParams.get('tem_saldo_devedor');
    const qualidadeMinima = searchParams.get('qualidade_minima');
    const valorMinimoContratos = searchParams.get('valor_minimo_contratos');
    const valorMaximoContratos = searchParams.get('valor_maximo_contratos');
    const segmentodemografico = searchParams.get('segmento_demografico');

    // Parâmetros de ordenação e limite
    const orderBy = searchParams.get('order_by') || 'score_valor_cliente';
    const orderDirection = searchParams.get('order_direction') || 'DESC';
    const limit = parseInt(searchParams.get('limit') || '500');

    // Construir WHERE dinâmico
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (clienteId) {
      whereClause += ` AND cliente_id = $${params.length + 1}`;
      params.push(parseInt(clienteId));
    }

    if (nomeCliente) {
      whereClause += ` AND nome_completo ILIKE $${params.length + 1}`;
      params.push(`%${nomeCliente}%`);
    }

    if (documento) {
      whereClause += ` AND cpf_cnpj_limpo = $${params.length + 1}`;
      params.push(documento.replace(/\D/g, ''));
    }

    if (tipoePessoa) {
      whereClause += ` AND tipo_pessoa = $${params.length + 1}`;
      params.push(tipoePessoa);
    }

    if (cidade) {
      whereClause += ` AND cidade ILIKE $${params.length + 1}`;
      params.push(`%${cidade}%`);
    }

    if (estado) {
      whereClause += ` AND estado = $${params.length + 1}`;
      params.push(estado);
    }

    if (faixaEtaria) {
      whereClause += ` AND faixa_etaria = $${params.length + 1}`;
      params.push(faixaEtaria);
    }

    if (categoriaCliente) {
      whereClause += ` AND categoria_cliente = $${params.length + 1}`;
      params.push(categoriaCliente);
    }

    if (categoriaRisco) {
      whereClause += ` AND categoria_risco_credito = $${params.length + 1}`;
      params.push(categoriaRisco);
    }

    if (temContrato) {
      whereClause += ` AND tem_historico_compras = $${params.length + 1}`;
      params.push(temContrato === 'true');
    }

    if (temSaldoDevedor) {
      whereClause += ` AND tem_saldo_devedor = $${params.length + 1}`;
      params.push(temSaldoDevedor === 'true');
    }

    if (qualidadeMinima) {
      whereClause += ` AND qualidade_score >= $${params.length + 1}`;
      params.push(parseFloat(qualidadeMinima));
    }

    if (valorMinimoContratos) {
      whereClause += ` AND valor_total_contratos >= $${params.length + 1}`;
      params.push(parseFloat(valorMinimoContratos));
    }

    if (valorMaximoContratos) {
      whereClause += ` AND valor_total_contratos <= $${params.length + 1}`;
      params.push(parseFloat(valorMaximoContratos));
    }

    if (segmentodemografico) {
      whereClause += ` AND segmento_demografico = $${params.length + 1}`;
      params.push(segmentodemografico);
    }

    logger.info('Buscando dados gold.clientes_360', {
      filtros: {
        clienteId,
        nomeCliente,
        documento,
        tipoePessoa,
        cidade,
        estado,
        faixaEtaria,
        categoriaCliente,
        categoriaRisco,
        orderBy,
        limit,
      },
    });

    // Validar campo de ordenação
    const validOrderFields = [
      'nome_completo',
      'data_cadastro',
      'qualidade_score',
      'score_valor_cliente',
      'valor_total_contratos',
      'total_contratos',
      'idade_atual',
      'dias_como_cliente',
    ];

    const finalOrderBy = validOrderFields.includes(orderBy)
      ? orderBy
      : 'score_valor_cliente';
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

        -- Dados Básicos do Cliente
        cliente_id,
        nome_completo,
        nome_social,
        nome_fantasia,
        razao_social,
        codigo_interno,
        tipo_pessoa,
        ativo,
        estrangeiro,

        -- Documentos
        cpf_cnpj_limpo,
        cnpj_limpo,
        rg_limpo,
        eh_cpf,
        eh_cnpj,
        tem_documento_valido,

        -- Dados Pessoais
        data_nascimento,
        idade_atual,
        faixa_etaria,
        nacionalidade,
        sexo,
        local_nascimento,
        nome_pai,
        nome_mae,
        estado_civil,
        profissao,

        -- Contato
        email_validado,
        tem_email_valido,
        telefone_principal,
        tipo_telefone_principal,
        total_telefones,

        -- Endereço
        endereco_principal,
        cidade,
        estado,
        cep,
        total_enderecos,
        tem_endereco_valido,

        -- Cônjuge
        tem_conjuge,
        nome_conjuge,
        cpf_conjuge_limpo,

        -- Qualidade de Dados
        tem_nome_valido,
        tem_telefone_valido,
        tem_data_nascimento_valida,
        qualidade_score,

        -- Relacionamento
        data_cadastro,
        data_atualizacao,
        dias_como_cliente,
        categoria_tempo_cliente,

        -- Histórico de Contratos
        total_contratos,
        contratos_ativos,
        contratos_cancelados,
        contratos_entregues,
        contratos_em_andamento,
        primeiro_contrato_data,
        ultimo_contrato_data,
        numeros_contratos,

        -- Valores Financeiros
        valor_total_contratos,
        valor_total_pago,
        saldo_devedor_total,
        valor_medio_contrato,
        percentual_pago_geral,

        -- Análise de Unidades
        total_unidades_adquiridas,
        tipos_unidades,
        empreendimentos,
        area_privativa_total,
        area_privativa_media,
        area_total_adquirida,
        valor_terreno_total_unidades,
        valor_medio_m2,
        unidades_entregues,
        unidades_em_construcao,
        unidades_vendidas,

        -- Categorização e Análises
        categoria_cliente,
        categoria_risco_credito,
        perfil_compra,
        dias_media_entre_compras,
        segmento_demografico,
        score_valor_cliente,

        -- Flags de Status
        tem_historico_compras,
        tem_cancelamentos,
        tem_saldo_devedor,
        tem_unidades_vinculadas,

        -- JSONs Estruturados (para análises detalhadas)
        telefones_json,
        enderecos_json,
        procuradores_json,
        contatos_json,
        conjuge_json,
        renda_familiar_json,
        subtipos_json,
        estado_civil_json,

        -- Metadados
        data_processamento

      FROM gold.clientes_360
      ${whereClause}
      ORDER BY ${finalOrderBy} ${finalOrderDirection}
      LIMIT $${params.length + 1}
    `;

    params.push(limit);

    // Executar query principal
    const rawData = (await prisma.$queryRawUnsafe(sql, ...params)) as any[];

    // Processar dados para compatibilidade
    const data = rawData.map((row: any) => ({
      ...row,
      // Converter datas
      data_principal: row.data_principal
        ? new Date(row.data_principal).toISOString().split('T')[0]
        : null,
      data_nascimento: row.data_nascimento
        ? new Date(row.data_nascimento).toISOString().split('T')[0]
        : null,
      data_cadastro: row.data_cadastro
        ? new Date(row.data_cadastro).toISOString().split('T')[0]
        : null,
      data_atualizacao: row.data_atualizacao
        ? new Date(row.data_atualizacao).toISOString().split('T')[0]
        : null,
      primeiro_contrato_data: row.primeiro_contrato_data
        ? new Date(row.primeiro_contrato_data).toISOString().split('T')[0]
        : null,
      ultimo_contrato_data: row.ultimo_contrato_data
        ? new Date(row.ultimo_contrato_data).toISOString().split('T')[0]
        : null,

      // Garantir números limpos
      valor_total_contratos: parseFloat(row.valor_total_contratos) || 0,
      valor_total_pago: parseFloat(row.valor_total_pago) || 0,
      saldo_devedor_total: parseFloat(row.saldo_devedor_total) || 0,
      valor_medio_contrato: parseFloat(row.valor_medio_contrato) || 0,
      percentual_pago_geral: parseFloat(row.percentual_pago_geral) || 0,
      area_privativa_total: parseFloat(row.area_privativa_total) || 0,
      area_privativa_media: parseFloat(row.area_privativa_media) || 0,
      area_total_adquirida: parseFloat(row.area_total_adquirida) || 0,
      valor_terreno_total_unidades:
        parseFloat(row.valor_terreno_total_unidades) || 0,
      valor_medio_m2: parseFloat(row.valor_medio_m2) || 0,
      qualidade_score: parseFloat(row.qualidade_score) || 0,
      score_valor_cliente: parseFloat(row.score_valor_cliente) || 0,

      // Garantir inteiros
      idade_atual: parseInt(row.idade_atual) || 0,
      dias_como_cliente: parseInt(row.dias_como_cliente) || 0,
      total_contratos: parseInt(row.total_contratos) || 0,
      contratos_ativos: parseInt(row.contratos_ativos) || 0,
      contratos_cancelados: parseInt(row.contratos_cancelados) || 0,
      contratos_entregues: parseInt(row.contratos_entregues) || 0,
      contratos_em_andamento: parseInt(row.contratos_em_andamento) || 0,
      total_unidades_adquiridas: parseInt(row.total_unidades_adquiridas) || 0,
      unidades_entregues: parseInt(row.unidades_entregues) || 0,
      unidades_em_construcao: parseInt(row.unidades_em_construcao) || 0,
      unidades_vendidas: parseInt(row.unidades_vendidas) || 0,
      total_telefones: parseInt(row.total_telefones) || 0,
      total_enderecos: parseInt(row.total_enderecos) || 0,
      dias_media_entre_compras: parseInt(row.dias_media_entre_compras) || 0,

      // Garantir booleans
      ativo: Boolean(row.ativo),
      estrangeiro: Boolean(row.estrangeiro),
      eh_cpf: Boolean(row.eh_cpf),
      eh_cnpj: Boolean(row.eh_cnpj),
      tem_documento_valido: Boolean(row.tem_documento_valido),
      tem_email_valido: Boolean(row.tem_email_valido),
      tem_endereco_valido: Boolean(row.tem_endereco_valido),
      tem_conjuge: Boolean(row.tem_conjuge),
      tem_nome_valido: Boolean(row.tem_nome_valido),
      tem_telefone_valido: Boolean(row.tem_telefone_valido),
      tem_data_nascimento_valida: Boolean(row.tem_data_nascimento_valida),
      tem_historico_compras: Boolean(row.tem_historico_compras),
      tem_cancelamentos: Boolean(row.tem_cancelamentos),
      tem_saldo_devedor: Boolean(row.tem_saldo_devedor),
      tem_unidades_vinculadas: Boolean(row.tem_unidades_vinculadas),
    }));

    // Estatísticas gerais
    const statsQuery = `
      SELECT
        COUNT(*) as total_clientes,
        COUNT(CASE WHEN tipo_pessoa = 'PF' THEN 1 END) as pessoas_fisicas,
        COUNT(CASE WHEN tipo_pessoa = 'PJ' THEN 1 END) as pessoas_juridicas,
        COUNT(CASE WHEN tem_historico_compras = true THEN 1 END) as com_contratos,
        COUNT(CASE WHEN tem_saldo_devedor = true THEN 1 END) as com_saldo_devedor,
        ROUND(AVG(qualidade_score), 2) as qualidade_media,
        ROUND(AVG(score_valor_cliente), 2) as score_valor_medio,
        ROUND(SUM(valor_total_contratos), 2) as valor_total_portfolio,
        ROUND(AVG(valor_total_contratos), 2) as valor_medio_por_cliente,
        ROUND(AVG(idade_atual), 0) as idade_media,
        COUNT(DISTINCT cidade) as cidades_distintas,
        COUNT(DISTINCT estado) as estados_distintos
      FROM gold.clientes_360
      ${whereClause.replace(/LIMIT.*$/, '')}
    `;

    const stats = (await prisma.$queryRawUnsafe(
      statsQuery,
      ...params.slice(0, -1)
    )) as any[];
    const statistics = stats[0];

    // Top clientes por valor
    const topClientes = (await prisma.$queryRawUnsafe(
      `
      SELECT
        nome_completo,
        cidade,
        estado,
        tipo_pessoa,
        valor_total_contratos,
        total_contratos,
        score_valor_cliente
      FROM gold.clientes_360
      ${whereClause.replace(/LIMIT.*$/, '')}
      ORDER BY valor_total_contratos DESC
      LIMIT 10
    `,
      ...params.slice(0, -1)
    )) as any[];

    // Distribuição por faixa etária
    const distribEtaria = (await prisma.$queryRawUnsafe(
      `
      SELECT
        faixa_etaria,
        COUNT(*) as quantidade,
        ROUND(AVG(valor_total_contratos), 2) as valor_medio_contratos
      FROM gold.clientes_360
      ${whereClause.replace(/LIMIT.*$/, '')}
      GROUP BY faixa_etaria
      ORDER BY quantidade DESC
    `,
      ...params.slice(0, -1)
    )) as any[];

    // Distribuição por categoria de risco
    const distribRisco = (await prisma.$queryRawUnsafe(
      `
      SELECT
        categoria_risco_credito,
        COUNT(*) as quantidade,
        ROUND(AVG(score_valor_cliente), 2) as score_medio
      FROM gold.clientes_360
      ${whereClause.replace(/LIMIT.*$/, '')}
      GROUP BY categoria_risco_credito
      ORDER BY quantidade DESC
    `,
      ...params.slice(0, -1)
    )) as any[];

    const response = {
      success: true,
      data: data,
      metadata: {
        total_records: data.length,
        ordenacao: `${finalOrderBy} ${finalOrderDirection}`,
        filtros_aplicados: {
          cliente_id: clienteId,
          nome_cliente: nomeCliente,
          documento: documento,
          tipo_pessoa: tipoePessoa,
          cidade: cidade,
          estado: estado,
          faixa_etaria: faixaEtaria,
          categoria_cliente: categoriaCliente,
          categoria_risco: categoriaRisco,
          tem_contrato: temContrato,
          tem_saldo_devedor: temSaldoDevedor,
          qualidade_minima: qualidadeMinima,
          valor_range_contratos:
            valorMinimoContratos || valorMaximoContratos
              ? `${valorMinimoContratos || 0} - ${valorMaximoContratos || '∞'}`
              : null,
          segmento_demografico: segmentodemografico,
          limit: limit,
        },
        estatisticas: {
          ...statistics,
          total_clientes: Number(statistics.total_clientes),
          pessoas_fisicas: Number(statistics.pessoas_fisicas),
          pessoas_juridicas: Number(statistics.pessoas_juridicas),
          com_contratos: Number(statistics.com_contratos),
          com_saldo_devedor: Number(statistics.com_saldo_devedor),
          cidades_distintas: Number(statistics.cidades_distintas),
          estados_distintos: Number(statistics.estados_distintos),
          taxa_clientes_ativos:
            (Number(statistics.com_contratos) /
              Number(statistics.total_clientes)) *
            100,
        },
        top_clientes: topClientes.map(c => ({
          ...c,
          valor_total_contratos: parseFloat(c.valor_total_contratos) || 0,
          total_contratos: Number(c.total_contratos),
          score_valor_cliente: parseFloat(c.score_valor_cliente) || 0,
        })),
        distribuicao_etaria: distribEtaria.map(d => ({
          ...d,
          quantidade: Number(d.quantidade),
          valor_medio_contratos: parseFloat(d.valor_medio_contratos) || 0,
        })),
        distribuicao_risco: distribRisco.map(r => ({
          ...r,
          quantidade: Number(r.quantidade),
          score_medio: parseFloat(r.score_medio) || 0,
        })),
        last_updated: new Date().toISOString(),
      },
      schema: {
        description: 'API Gold - Clientes 360°',
        source: 'gold.clientes_360',
        grain: 'Cliente Individual',
        total_fields: 96,
        volume: '825 clientes',
        categories: {
          identificacao: ['cliente_id', 'nome_completo', 'cpf_cnpj_limpo'],
          demograficos: ['idade_atual', 'faixa_etaria', 'sexo', 'estado_civil'],
          localizacao: ['cidade', 'estado', 'endereco_principal'],
          contato: ['email_validado', 'telefone_principal'],
          relacionamento: [
            'total_contratos',
            'valor_total_contratos',
            'dias_como_cliente',
          ],
          qualidade: [
            'qualidade_score',
            'score_valor_cliente',
            'categoria_risco_credito',
          ],
          portfolio: [
            'total_unidades_adquiridas',
            'area_total_adquirida',
            'valor_medio_m2',
          ],
          conjuge: ['tem_conjuge', 'nome_conjuge', 'cpf_conjuge_limpo'],
          financeiro: [
            'valor_total_pago',
            'saldo_devedor_total',
            'percentual_pago_geral',
          ],
        },
        filtros_disponiveis: [
          'cliente_id',
          'nome_cliente',
          'documento',
          'tipo_pessoa',
          'cidade',
          'estado',
          'faixa_etaria',
          'categoria_cliente',
          'categoria_risco',
          'tem_contrato',
          'tem_saldo_devedor',
          'qualidade_minima',
          'valor_minimo_contratos',
          'valor_maximo_contratos',
          'segmento_demografico',
        ],
        ordenacoes_disponiveis: [
          'nome_completo',
          'data_cadastro',
          'qualidade_score',
          'score_valor_cliente',
          'valor_total_contratos',
          'total_contratos',
          'idade_atual',
          'dias_como_cliente',
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
    logger.error('Erro ao buscar dados gold.clientes_360', { error });

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
      api: 'Sienge Data Warehouse - Gold Clientes 360°',
      version: '1.0',
      description:
        'API especializada em análise completa de clientes com visão 360° e dados gold enriquecidos',
      endpoint: '/api/datawarehouse/gold/clientes',
      method: 'GET',
      source: 'gold.clientes_360 (825 clientes, 96 campos)',

      parametros: {
        // Filtros de identificação
        cliente_id: 'ID específico do cliente - opcional',
        nome_cliente: 'Nome do cliente (busca parcial) - opcional',
        documento: 'CPF/CNPJ do cliente - opcional',
        tipo_pessoa: 'PF ou PJ - opcional',

        // Filtros geográficos
        cidade: 'Cidade do cliente (busca parcial) - opcional',
        estado: 'Estado do cliente - opcional',

        // Filtros demográficos
        faixa_etaria: 'Faixa etária do cliente - opcional',
        segmento_demografico: 'Segmento demográfico - opcional',

        // Filtros de performance
        categoria_cliente: 'Categoria do cliente - opcional',
        categoria_risco: 'Categoria de risco de crédito - opcional',
        tem_contrato:
          'true/false - clientes com histórico de compras - opcional',
        tem_saldo_devedor:
          'true/false - clientes com saldo em aberto - opcional',

        // Filtros de qualidade
        qualidade_minima: 'Score mínimo de qualidade (0-100) - opcional',

        // Filtros financeiros
        valor_minimo_contratos: 'Valor mínimo total de contratos - opcional',
        valor_maximo_contratos: 'Valor máximo total de contratos - opcional',

        // Ordenação e limite
        order_by:
          'Campo para ordenação (padrão: score_valor_cliente) - opcional',
        order_direction: 'ASC ou DESC (padrão: DESC) - opcional',
        limit: 'Limite de registros (padrão: 500, máx: 1000) - opcional',
      },

      exemplos: {
        todos_clientes: '/api/datawarehouse/gold/clientes',
        clientes_vip: '/api/datawarehouse/gold/clientes?categoria_cliente=VIP',
        alto_valor:
          '/api/datawarehouse/gold/clientes?valor_minimo_contratos=500000',
        pf_sp: '/api/datawarehouse/gold/clientes?tipo_pessoa=PF&estado=SP',
        com_saldo: '/api/datawarehouse/gold/clientes?tem_saldo_devedor=true',
        alta_qualidade: '/api/datawarehouse/gold/clientes?qualidade_minima=80',
        busca_nome: '/api/datawarehouse/gold/clientes?nome_cliente=João Silva',
        ordem_valor:
          '/api/datawarehouse/gold/clientes?order_by=valor_total_contratos&order_direction=DESC',
        jovens_compradores:
          '/api/datawarehouse/gold/clientes?faixa_etaria=25-35 anos&tem_contrato=true',
      },

      analises_disponiveis: {
        demografica: 'Distribuição por idade, sexo, estado civil',
        geografica: 'Distribuição por cidade, estado, região',
        comportamental: 'Padrões de compra, frequência, sazonalidade',
        financeira: 'Valor total, ticket médio, saldo devedor',
        risco: 'Score de crédito, categoria de risco, inadimplência',
        qualidade: 'Completude de dados, consistência cadastral',
        relacionamento: 'Tempo como cliente, recência, frequência',
        portfolio: 'Unidades adquiridas, área total, tipo de imóveis',
      },

      campos_especiais: {
        jsonb_fields: [
          'telefones_json',
          'enderecos_json',
          'procuradores_json',
          'contatos_json',
          'conjuge_json',
          'renda_familiar_json',
        ],
        scores: [
          'qualidade_score (0-100)',
          'score_valor_cliente (valor calculado)',
        ],
        flags_comportamentais: [
          'tem_historico_compras',
          'tem_cancelamentos',
          'tem_saldo_devedor',
          'tem_unidades_vinculadas',
        ],
      },

      integracao: {
        looker_studio:
          'Use como fonte de dados Web - ideal para dashboards de clientes',
        power_bi: 'Conecte via Web - suporte completo a filtros dinâmicos',
        crm: 'Integração com sistemas CRM via API',
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
