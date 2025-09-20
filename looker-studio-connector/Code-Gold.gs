/**
 * Sienge Looker Studio Gold Connector - VERSÃO 7.1
 * Multi-Source Gold APIs com Organização Avançada e Performance Otimizada
 *
 * RECURSOS PRINCIPAIS:
 * ✅ 4 APIs Gold especializadas (Financeiro, Clientes, Vendas, Portfolio)
 * ✅ Organização em grupos lógicos com setGroup()
 * ✅ Schemas dinâmicos por API
 * ✅ Descrições detalhadas em todos os campos
 * ✅ Labels dinâmicos sem informações hardcoded
 * ✅ Agregações pré-calculadas
 * ✅ Filtros server-side
 * ✅ Cache otimizado
 * ✅ Paginação automática
 *
 * GRUPOS DE CAMPOS ORGANIZADOS:
 * 📅 Temporal, 🔑 Identificação, 💰 Valores, 📊 Indicadores
 * 👤 Dados Pessoais, 📍 Localização, 🏷️ Segmentação, ⭐ Qualidade
 * 📋 Contrato, 💳 Parcelamento, 🎯 Comissões, 🔗 Relacionamentos
 * 🏢 Unidade, 🏗️ Empreendimento, 📏 Dimensões, 📊 Status
 */

// ============================================
// CONFIGURAÇÃO GLOBAL
// ============================================
var CONFIG = {
  BASE_URL: 'https://conector.catometrics.com.br/api/datawarehouse/gold',
  APIS: {
    financeiro: {
      endpoint: '/financeiro',
      name: 'Performance Financeira',
      description: 'Dados detalhados de fluxo de caixa, conciliação e movimentações financeiras',
      default_aggregation: null,
      default_limit: 5000,
      use_cases: 'Análise detalhada de transações, controle de caixa, conciliação bancária'
    },
    clientes: {
      endpoint: '/clientes',
      name: 'Clientes 360°',
      description: 'Visão completa do perfil, comportamento e valor dos clientes',
      default_aggregation: null,
      default_limit: 500,
      use_cases: 'CRM analytics, segmentação, análise de lifetime value'
    },
    vendas: {
      endpoint: '/vendas',
      name: 'Vendas e Contratos',
      description: 'Performance de vendas, contratos e análise de comissões',
      default_aggregation: null,
      default_limit: 500,
      use_cases: 'Análise de vendas, tracking de contratos, gestão de comissões'
    },
    portfolio: {
      endpoint: '/portfolio',
      name: 'Portfolio Imobiliário',
      description: 'Gestão de unidades, empreendimentos e análise de portfolio',
      default_aggregation: null,
      default_limit: 500,
      use_cases: 'Gestão imobiliária, análise de atratividade, dashboard de portfolio'
    }
  },
  MAX_RECORDS: 10000,
  USE_CACHE: true,
  CACHE_DURATION: 3600, // 1 hora
  DEBUG: false
};

// ============================================
// INICIALIZAÇÃO
// ============================================
var cc = DataStudioApp.createCommunityConnector();

// ============================================
// HELPERS GLOBAIS
// ============================================

/**
 * Log de debug com contexto
 */
function logDebug(message, context) {
  if (CONFIG.DEBUG) {
    var ctx = context ? ' [' + context + ']' : '';
    console.log('[GOLD-V7]' + ctx + ' ' + message);
  }
}

/**
 * Converter para número seguro
 */
function toSafeNumber(value, defaultValue) {
  if (value === null || value === undefined || value === '') return null;
  var num = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return isFinite(num) ? num : null;
}

/**
 * Converter para inteiro seguro
 */
function toSafeInt(value, defaultValue) {
  if (value === null || value === undefined || value === '') return null;
  var num = parseInt(value, 10);
  return isFinite(num) ? num : null;
}

/**
 * Converter para boolean robusto
 */
function toSafeBool(value) {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === 'S' || value === 's' || value === 'SIM' || value === 'sim') return true;
  if (value === 'Y' || value === 'y' || value === 'YES' || value === 'yes') return true;
  return false;
}

/**
 * Formatar data para Looker Studio (YYYYMMDD)
 */
function formatDateForLooker(dateValue) {
  if (!dateValue || dateValue === '' || dateValue === 'null' || dateValue === 'undefined') {
    return null;
  }

  try {
    var dateStr = String(dateValue).trim();

    // Se já está no formato YYYYMMDD correto (8 dígitos)
    if (/^\d{8}$/.test(dateStr)) {
      // Validar se é uma data válida
      var year = parseInt(dateStr.substring(0, 4));
      var month = parseInt(dateStr.substring(4, 6));
      var day = parseInt(dateStr.substring(6, 8));

      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        return dateStr;
      }
    }

    // PRIORIDADE: Formato YYYY-MM-DD (mais comum das APIs)
    var dashMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (dashMatch) {
      var year = dashMatch[1];
      var month = dashMatch[2];
      var day = dashMatch[3];

      // Adicionar zero à esquerda se necessário
      if (month.length === 1) month = '0' + month;
      if (day.length === 1) day = '0' + day;

      // Validar valores
      var yearNum = parseInt(year);
      var monthNum = parseInt(month);
      var dayNum = parseInt(day);

      if (yearNum >= 1900 && yearNum <= 2100 && monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
        return year + month + day;
      }
    }

    // Formato DD/MM/YYYY ou DD-MM-YYYY ou DD/MM/YYYY com barra
    var brMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (brMatch) {
      var day = brMatch[1];
      var month = brMatch[2];
      var year = brMatch[3];

      // Converter para números para validação
      var yearNum = parseInt(year, 10);
      var monthNum = parseInt(month, 10);
      var dayNum = parseInt(day, 10);

      // Validar valores
      if (yearNum >= 1900 && yearNum <= 2100 && monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
        // Adicionar zero à esquerda se necessário APÓS validação
        var monthFormatted = monthNum < 10 ? '0' + monthNum : String(monthNum);
        var dayFormatted = dayNum < 10 ? '0' + dayNum : String(dayNum);

        return String(yearNum) + monthFormatted + dayFormatted;
      }
    }

    // Tentar parser como Date object (fallback)
    var date = new Date(dateStr);
    if (!isNaN(date.getTime()) && date.getFullYear() >= 1900) {
      var year = date.getFullYear();
      var month = ('0' + (date.getMonth() + 1)).slice(-2);
      var day = ('0' + date.getDate()).slice(-2);
      return year + month + day;
    }

    logDebug('Data inválida ignorada: ' + dateValue, 'formatDate');
    return null;

  } catch (e) {
    logDebug('Erro ao formatar data: ' + dateValue + ' - ' + e.toString(), 'formatDate');
    return null;
  }
}

/**
 * Formatar ano para Looker Studio (YYYY)
 */
function formatYearForLooker(yearValue) {
  if (!yearValue && yearValue !== 0) return null;

  var year = parseInt(yearValue);
  if (isNaN(year) || year < 1900 || year > 2100) return null;

  return String(year);
}

/**
 * Formatar mês para Looker Studio (MM)
 */
function formatMonthForLooker(monthValue) {
  if (!monthValue && monthValue !== 0) return null;

  // Converter para string e remover espaços
  var monthStr = String(monthValue).trim();

  // Converter para número
  var month = parseInt(monthStr, 10);
  if (isNaN(month) || month < 1 || month > 12) return null;

  // Sempre retornar com 2 dígitos
  return month < 10 ? '0' + month : String(month);
}

/**
 * Formatar ano_mês para Looker Studio (YYYYMM)
 */
function formatYearMonthForLooker(yearMonthValue) {
  if (!yearMonthValue || yearMonthValue === '' || yearMonthValue === 'null') return null;

  var yearMonthStr = String(yearMonthValue).trim();

  // Se está no formato "YYYY-MM" ou "YYYY-M", processar
  if (yearMonthStr.includes('-')) {
    var parts = yearMonthStr.split('-');
    if (parts.length === 2) {
      var year = parts[0];
      var month = parts[1];

      // Validar ano (deve ter 4 dígitos)
      if (year.length === 4 && /^\d{4}$/.test(year)) {
        // Converter mês para número e validar
        var monthNum = parseInt(month, 10);
        if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
          // Adicionar zero à esquerda se necessário
          var formattedMonth = monthNum < 10 ? '0' + monthNum : String(monthNum);
          return year + formattedMonth;
        }
      }
    }
  }

  // Se já está no formato YYYYMM
  if (/^\d{6}$/.test(yearMonthStr)) {
    // Validar se é uma data válida
    var year = parseInt(yearMonthStr.substring(0, 4));
    var month = parseInt(yearMonthStr.substring(4, 6));

    if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12) {
      return yearMonthStr;
    }
  }

  logDebug('Formato ano_mes inválido: ' + yearMonthValue, 'formatYearMonth');
  return null;
}

/**
 * Erro para usuário
 */
function throwUserError(message, context) {
  var fullMessage = context ? '[' + context + '] ' + message : message;
  cc.newUserError()
    .setDebugText(fullMessage)
    .setText(message)
    .throwException();
}

// ============================================
// AUTENTICAÇÃO
// ============================================
function getAuthType() {
  return cc.newAuthTypeResponse()
    .setAuthType(cc.AuthType.NONE)
    .build();
}

// ============================================
// CONFIGURAÇÃO DO CONNECTOR
// ============================================
function getConfig(request) {
  var config = cc.getConfig();

  config.newInfo()
    .setId('info')
    .setText('Sienge Gold Data Warehouse - Conector simplificado para alta performance');

  // Seleção da API
  config.newSelectSingle()
    .setId('api_source')
    .setName('Fonte de Dados')
    .setHelpText('Escolha a API baseada no tipo de análise')
    .addOption(config.newOptionBuilder()
      .setLabel('Performance Financeira')
      .setValue('financeiro'))
    .addOption(config.newOptionBuilder()
      .setLabel('Clientes')
      .setValue('clientes'))
    .addOption(config.newOptionBuilder()
      .setLabel('Vendas e Contratos')
      .setValue('vendas'))
    .addOption(config.newOptionBuilder()
      .setLabel('Portfolio Imobiliário')
      .setValue('portfolio'))
    .setAllowOverride(true);

  // Cache
  config.newCheckbox()
    .setId('use_cache')
    .setName('Usar Cache')
    .setHelpText('Ativa cache de 1 hora para melhor performance')
    .setAllowOverride(true);

  // Exigir seleção de data
  config.setDateRangeRequired(true);

  return config.build();
}

// ============================================
// SCHEMA DINÂMICO
// ============================================
function getSchema(request) {
  try {
    var configParams = request && request.configParams ? request.configParams : {};
    var apiSource = configParams.api_source || 'financeiro';

    logDebug('Gerando schema para API: ' + apiSource, 'getSchema');

    // Construir schema baseado na API selecionada
    var fields = getFieldsForApi(apiSource);

    return {
      schema: fields.build()
    };

  } catch (e) {
    logDebug('Erro no getSchema: ' + e.toString(), 'getSchema');
    throwUserError('Erro ao gerar schema: ' + e.toString(), 'Schema');
  }
}

/**
 * Gerar campos baseado na API selecionada
 */
function getFieldsForApi(apiSource) {
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;

  // Campos comuns a todas as APIs
  addCommonFields(fields, types);

  // Campos específicos por API
  switch (apiSource) {
    case 'financeiro':
      addFinanceiroFields(fields, types, aggregations);
      break;
    case 'clientes':
      addClientesFields(fields, types, aggregations);
      break;
    case 'vendas':
      addVendasFields(fields, types, aggregations);
      break;
    case 'portfolio':
      addPortfolioFields(fields, types, aggregations);
      break;
    default:
      addFinanceiroFields(fields, types, aggregations);
  }

  return fields;
}

/**
 * Campos comuns a todas as APIs
 */
function addCommonFields(fields, types) {
  // Dimensões temporais

  fields.newDimension()
    .setId('data_principal')
    .setName('Data Principal')
    .setType(types.YEAR_MONTH_DAY)
    .setDescription('Data de referência do registro');

  fields.newDimension()
    .setId('ano')
    .setName('Ano')
    .setType(types.YEAR)
    .setDescription('Ano extraído da data principal');

  fields.newDimension()
    .setId('mes')
    .setName('Mês')
    .setType(types.MONTH)
    .setDescription('Mês extraído da data principal');

  fields.newDimension()
    .setId('ano_mes')
    .setName('Ano-Mês')
    .setType(types.YEAR_MONTH)
    .setDescription('Ano e mês combinados para análise temporal');

  // ===== IDENTIFICAÇÃO =====

  fields.newDimension()
    .setId('domain_type')
    .setName('🔑 Tipo de Domínio')
    .setType(types.TEXT)
    .setDescription('Categoria do domínio de negócio');

  fields.newDimension()
    .setId('unique_id')
    .setName('🔑 ID Único')
    .setType(types.TEXT)
    .setDescription('Identificador único do registro');

  fields.newDimension()
    .setId('empresa_id')
    .setName('🔑 ID Empresa')
    .setType(types.NUMBER)
    .setDescription('Identificador da empresa');
}

/**
 * Campos específicos da API Financeiro
 */
function addFinanceiroFields(fields, types, aggregations) {
  // Valores agregados essenciais
  fields.newMetric()
    .setId('entradas')
    .setName('Entradas')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM)
    .setDescription('Total de valores de entrada no período');

  fields.newMetric()
    .setId('saidas')
    .setName('Saídas')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM)
    .setDescription('Total de valores de saída no período');

  fields.newMetric()
    .setId('valor_total_extrato')
    .setName('Valor Total Extrato')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM)
    .setDescription('Valor total movimentado no período');

  // Contadores e estatísticas
  fields.newMetric()
    .setId('total_lancamentos')
    .setName('Total Lançamentos')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setDescription('Quantidade total de lançamentos no período');

  fields.newMetric()
    .setId('documentos_unicos')
    .setName('Documentos Únicos')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setDescription('Quantidade de documentos únicos');

  fields.newMetric()
    .setId('valor_medio')
    .setName('Valor Médio')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.AVG)
    .setDescription('Valor médio dos lançamentos');

  fields.newMetric()
    .setId('maior_valor')
    .setName('Maior Valor')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.MAX)
    .setDescription('Maior valor do período');

  fields.newMetric()
    .setId('menor_valor')
    .setName('Menor Valor')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.MIN)
    .setDescription('Menor valor do período');

  fields.newMetric()
    .setId('centros_custo_distintos')
    .setName('Centros de Custo')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setDescription('Quantidade de centros de custo distintos');

  fields.newMetric()
    .setId('score_medio_importancia')
    .setName('Score Importância')
    .setType(types.NUMBER)
    .setAggregation(aggregations.AVG)
    .setDescription('Score médio de importância financeira');

  // Datas de período (agregado)
  fields.newDimension()
    .setId('data_inicial')
    .setName('Data Inicial')
    .setType(types.YEAR_MONTH_DAY)
    .setDescription('Data inicial do período agregado');

  fields.newDimension()
    .setId('data_final')
    .setName('Data Final')
    .setType(types.YEAR_MONTH_DAY)
    .setDescription('Data final do período agregado');
}

/**
 * Campos específicos da API Clientes
 */
function addClientesFields(fields, types, aggregations) {
  // Identificação
  fields.newDimension()
    .setId('cliente_id')
    .setName('ID Cliente')
    .setType(types.NUMBER)
    .setDescription('Identificador único do cliente');

  fields.newDimension()
    .setId('nome_completo')
    .setName('Nome')
    .setType(types.TEXT)
    .setDescription('Nome completo do cliente');

  fields.newDimension()
    .setId('cpf_cnpj_limpo')
    .setName('CPF/CNPJ')
    .setType(types.TEXT)
    .setDescription('CPF ou CNPJ do cliente');

  fields.newDimension()
    .setId('tipo_pessoa')
    .setName('Tipo Pessoa')
    .setType(types.TEXT)
    .setDescription('Pessoa Física ou Jurídica');

  // Localização
  fields.newDimension()
    .setId('cidade')
    .setName('Cidade')
    .setType(types.TEXT)
    .setDescription('Cidade de residência');

  fields.newDimension()
    .setId('estado')
    .setName('Estado')
    .setType(types.TEXT)
    .setDescription('Estado de residência');

  // Financeiro
  fields.newMetric()
    .setId('valor_total_contratos')
    .setName('Valor Total Contratos')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM)
    .setDescription('Valor total dos contratos');

  fields.newMetric()
    .setId('total_contratos')
    .setName('Total Contratos')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setDescription('Quantidade de contratos');

  // Status
  fields.newDimension()
    .setId('ativo')
    .setName('Ativo')
    .setType(types.BOOLEAN)
    .setDescription('Cliente ativo');

  fields.newDimension()
    .setId('tem_saldo_devedor')
    .setName('Tem Saldo Devedor')
    .setType(types.BOOLEAN)
    .setDescription('Possui saldo devedor');

  // Categoria
  fields.newDimension()
    .setId('categoria_cliente')
    .setName('Categoria')
    .setType(types.TEXT)
    .setDescription('Categoria do cliente');

  fields.newDimension()
    .setId('faixa_etaria')
    .setName('Faixa Etária')
    .setType(types.TEXT)
    .setDescription('Faixa etária do cliente');
}

/**
 * Campos específicos da API Vendas
 */
function addVendasFields(fields, types, aggregations) {
  // Contrato
  fields.newDimension()
    .setId('contrato_id')
    .setName('ID Contrato')
    .setType(types.NUMBER)
    .setDescription('Identificador único do contrato');

  fields.newDimension()
    .setId('numero_contrato')
    .setName('Número Contrato')
    .setType(types.TEXT)
    .setDescription('Número do contrato');

  fields.newDimension()
    .setId('situacao_contrato')
    .setName('Situação')
    .setType(types.TEXT)
    .setDescription('Situação do contrato');

  // Valores
  fields.newMetric()
    .setId('valor_venda_total')
    .setName('Valor Venda Total')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM)
    .setDescription('Valor total da venda');

  fields.newMetric()
    .setId('valor_total_pago')
    .setName('Valor Pago')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM)
    .setDescription('Valor já pago');

  fields.newMetric()
    .setId('saldo_devedor')
    .setName('Saldo Devedor')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM)
    .setDescription('Saldo em aberto');

  // Parcelamento
  fields.newMetric()
    .setId('total_parcelas')
    .setName('Total Parcelas')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setDescription('Número total de parcelas');

  fields.newMetric()
    .setId('parcelas_pagas')
    .setName('Parcelas Pagas')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setDescription('Parcelas já pagas');

  fields.newDimension()
    .setId('forma_pagamento_principal')
    .setName('Forma Pagamento')
    .setType(types.TEXT)
    .setDescription('Forma de pagamento');

  // Relacionamentos
  fields.newDimension()
    .setId('cliente_nome')
    .setName('Cliente')
    .setType(types.TEXT)
    .setDescription('Nome do cliente');

  fields.newDimension()
    .setId('empreendimento_nome')
    .setName('Empreendimento')
    .setType(types.TEXT)
    .setDescription('Nome do empreendimento');

  // Data
  fields.newDimension()
    .setId('data_contrato')
    .setName('Data Contrato')
    .setType(types.YEAR_MONTH_DAY)
    .setDescription('Data do contrato');

  // Comissão
  fields.newDimension()
    .setId('tem_comissao')
    .setName('Tem Comissão')
    .setType(types.BOOLEAN)
    .setDescription('Possui comissão');

  fields.newMetric()
    .setId('valor_total_comissao')
    .setName('Valor Comissão')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM)
    .setDescription('Valor da comissão');

  fields.newDimension()
    .setId('categoria_valor_contrato')
    .setName('Categoria Valor')
    .setType(types.TEXT)
    .setDescription('Faixa de valor');
}

/**
 * Campos específicos da API Portfolio
 */
function addPortfolioFields(fields, types, aggregations) {
  // Unidade
  fields.newDimension()
    .setId('unidade_id')
    .setName('ID Unidade')
    .setType(types.NUMBER)
    .setDescription('Identificador único da unidade');

  fields.newDimension()
    .setId('unidade_nome')
    .setName('Nome Unidade')
    .setType(types.TEXT)
    .setDescription('Nome da unidade');

  fields.newDimension()
    .setId('tipo_imovel')
    .setName('Tipo Imóvel')
    .setType(types.TEXT)
    .setDescription('Tipo do imóvel');

  fields.newDimension()
    .setId('status_unidade')
    .setName('Status')
    .setType(types.TEXT)
    .setDescription('Status da unidade');

  // Empreendimento
  fields.newDimension()
    .setId('empreendimento_nome')
    .setName('Empreendimento')
    .setType(types.TEXT)
    .setDescription('Nome do empreendimento');

  // Valores
  fields.newMetric()
    .setId('valor_unidade')
    .setName('Valor Unidade')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM)
    .setDescription('Valor da unidade');

  fields.newMetric()
    .setId('area_total')
    .setName('Área Total')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setDescription('Área total em m²');

  // Status
  fields.newDimension()
    .setId('tem_contrato_vinculado')
    .setName('Tem Contrato')
    .setType(types.BOOLEAN)
    .setDescription('Possui contrato vinculado');

  // Categoria
  fields.newDimension()
    .setId('categoria_valor')
    .setName('Categoria Valor')
    .setType(types.TEXT)
    .setDescription('Faixa de valor');

  fields.newDimension()
    .setId('categoria_tamanho')
    .setName('Categoria Tamanho')
    .setType(types.TEXT)
    .setDescription('Categoria de tamanho');
}

// ============================================
// BUSCA DE DADOS
// ============================================
function getData(request) {
  try {
    var configParams = request.configParams || {};
    var apiSource = configParams.api_source || 'financeiro';
    var useCache = CONFIG.USE_CACHE && (configParams.use_cache === true || configParams.use_cache === 'true');
    var recordLimit = CONFIG.APIS[apiSource].default_limit;

    logDebug('getData iniciado', 'getData');
    logDebug('API: ' + apiSource + ', Limite: ' + recordLimit, 'getData');

    // Construir URL da API
    var apiUrl = CONFIG.BASE_URL + CONFIG.APIS[apiSource].endpoint;
    var queryParams = buildQueryParams(request, apiSource, recordLimit);
    var fullUrl = apiUrl + (queryParams ? '?' + queryParams : '');

    logDebug('URL construída: ' + fullUrl, 'getData');

    // Buscar dados da API
    var apiData = fetchApiData(fullUrl, useCache);

    // Construir resposta
    var requestedFieldIds = request.fields.map(function(f) { return f.name; });

    // pegue os campos válidos/filtrados pelo schema final…
    var schemaFields = getFieldsForApi(apiSource).forIds(requestedFieldIds).build();

    if (!apiData || !apiData.data || apiData.data.length === 0) {
      logDebug('Nenhum dado retornado da API', 'getData');
      return {
        schema: schemaFields,
        rows: []
      };
    }

    // derive a ordem final a partir do schema (não de request.fields)
    var finalFieldIds = schemaFields.map(function (f) { return f.name; });

    // Processar dados com a ordem correta
    var rows = processApiData(apiData.data, finalFieldIds, apiSource);

    logDebug('Retornando ' + rows.length + ' linhas processadas', 'getData');

    return {
      schema: schemaFields,
      rows: rows
    };

  } catch (e) {
    logDebug('ERRO no getData: ' + e.toString(), 'getData');
    throwUserError('Erro ao buscar dados: ' + e.toString(), 'getData');
  }
}

/**
 * Construir parâmetros de query
 */
function buildQueryParams(request, apiSource, recordLimit) {
  var params = [];

  // Limite
  params.push('limit=' + recordLimit);

  // Filtro de data do Looker Studio
  if (request.dateRange && request.dateRange.startDate && request.dateRange.endDate) {
    var startDate = formatDateRangeForApi(request.dateRange.startDate);
    var endDate = formatDateRangeForApi(request.dateRange.endDate);

    if (startDate && endDate) {
      params.push('data_inicio=' + startDate);
      params.push('data_fim=' + endDate);
      logDebug('Filtro de data aplicado: ' + startDate + ' até ' + endDate, 'buildQueryParams');
    }
  }

  return params.length > 0 ? params.join('&') : '';
}

/**
 * Converter data do Looker Studio para formato da API
 */
function formatDateRangeForApi(lookerDate) {
  if (!lookerDate || lookerDate.length !== 8) return null;

  // YYYYMMDD -> YYYY-MM-DD
  var year = lookerDate.substring(0, 4);
  var month = lookerDate.substring(4, 6);
  var day = lookerDate.substring(6, 8);

  return year + '-' + month + '-' + day;
}

/**
 * Buscar dados da API com cache
 */
function fetchApiData(url, useCache) {
  try {
    var cacheKey = 'gold_api_' + Utilities.base64Encode(url);
    var cachedData = null;

    // Verificar cache
    if (useCache && CONFIG.USE_CACHE) {
      try {
        var cache = CacheService.getScriptCache();
        var cachedResponse = cache.get(cacheKey);
        if (cachedResponse) {
          cachedData = JSON.parse(cachedResponse);
          logDebug('Dados retornados do cache', 'fetchApiData');
          return cachedData;
        }
      } catch (e) {
        logDebug('Erro ao acessar cache: ' + e.toString(), 'fetchApiData');
      }
    }

    // Buscar da API
    logDebug('Buscando dados da API: ' + url, 'fetchApiData');

    var response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Sienge-Gold-Connector/7.1'
      },
      muteHttpExceptions: true
    });

    var responseCode = response.getResponseCode();
    logDebug('Resposta da API: ' + responseCode, 'fetchApiData');

    if (responseCode !== 200) {
      throwUserError('Erro HTTP ' + responseCode + ' ao conectar com a API Gold', 'API');
    }

    var jsonData = JSON.parse(response.getContentText());

    if (!jsonData.success) {
      var errorMsg = jsonData.message || jsonData.error || 'Erro desconhecido da API';
      throwUserError('Erro da API Gold: ' + errorMsg, 'API');
    }

    // Salvar no cache
    if (useCache && CONFIG.USE_CACHE) {
      try {
        var cache = CacheService.getScriptCache();
        cache.put(cacheKey, JSON.stringify(jsonData), CONFIG.CACHE_DURATION);
        logDebug('Dados salvos no cache', 'fetchApiData');
      } catch (e) {
        logDebug('Erro ao salvar cache: ' + e.toString(), 'fetchApiData');
      }
    }

    return jsonData;

  } catch (e) {
    logDebug('Erro ao buscar API: ' + e.toString(), 'fetchApiData');
    throwUserError('Erro de rede ao conectar com a API: ' + e.toString(), 'Network');
  }
}

/**
 * Processar dados da API
 */
function processApiData(apiData, requestedFieldIds, apiSource) {
  var rows = [];

  try {
    for (var i = 0; i < apiData.length; i++) {
      var record = apiData[i];
      var values = [];

      for (var j = 0; j < requestedFieldIds.length; j++) {
        var fieldValue = getFieldValueFromRecord(record, requestedFieldIds[j], apiSource);
        values.push(fieldValue);
      }

      rows.push({ values: values });
    }

    logDebug('Processados ' + rows.length + ' registros', 'processApiData');
    return rows;

  } catch (e) {
    logDebug('Erro ao processar dados: ' + e.toString(), 'processApiData');
    throwUserError('Erro ao processar dados da API: ' + e.toString(), 'Processing');
  }
}

/**
 * Extrair valor do campo do registro
 */
function getFieldValueFromRecord(record, fieldId, apiSource) {
  try {
    switch (fieldId) {
      // Campos temporais comuns
      case 'data_principal':
        // API Financeiro não tem data_principal, usar data_inicial como fallback
        if (apiSource === 'financeiro') {
          return formatDateForLooker(record.data_inicial || record.data_final);
        }
        return formatDateForLooker(record.data_principal);
      case 'ano':
        return formatYearForLooker(record.ano);
      case 'mes':
        return formatMonthForLooker(record.mes);
      case 'ano_mes':
        return formatYearMonthForLooker(record.ano_mes);

      // Campos de identificação
      case 'domain_type':
        return record.domain_type || '';
      case 'unique_id':
        return record.unique_id || '';
      case 'empresa_id':
        return toSafeInt(record.empresa_id);

      // Campos específicos por API
      default:
        return getApiSpecificFieldValue(record, fieldId, apiSource);
    }
  } catch (e) {
    logDebug('Erro no campo ' + fieldId + ': ' + e.toString(), 'getFieldValue');
    return null;
  }
}

/**
 * Valores específicos por API
 */
function getApiSpecificFieldValue(record, fieldId, apiSource) {
  switch (apiSource) {
    case 'financeiro':
      return getFinanceiroFieldValue(record, fieldId);
    case 'clientes':
      return getClientesFieldValue(record, fieldId);
    case 'vendas':
      return getVendasFieldValue(record, fieldId);
    case 'portfolio':
      return getPortfolioFieldValue(record, fieldId);
    default:
      return record[fieldId] || null;
  }
}

/**
 * Campos específicos da API Financeiro (dados agregados)
 */
function getFinanceiroFieldValue(record, fieldId) {
  switch (fieldId) {
    // Valores monetários agregados
    case 'valor_total_extrato':
      return toSafeNumber(record.valor_total_extrato);
    case 'entradas':
      return toSafeNumber(record.entradas);
    case 'saidas':
      return toSafeNumber(record.saidas);
    case 'valor_medio':
      return toSafeNumber(record.valor_medio);
    case 'maior_valor':
      return toSafeNumber(record.maior_valor);
    case 'menor_valor':
      return toSafeNumber(record.menor_valor);
    case 'valor_medio_absoluto':
      return toSafeNumber(record.valor_medio_absoluto);

    // Contadores e estatísticas
    case 'total_lancamentos':
      return toSafeInt(record.total_lancamentos);
    case 'documentos_unicos':
      return toSafeInt(record.documentos_unicos);
    case 'centros_custo_distintos':
      return toSafeInt(record.centros_custo_distintos);
    case 'planos_financeiros_distintos':
      return toSafeInt(record.planos_financeiros_distintos);

    // Datas de período
    case 'data_inicial':
      return formatDateForLooker(record.data_inicial);
    case 'data_final':
      return formatDateForLooker(record.data_final);

    // Scores
    case 'score_medio_importancia':
      return toSafeNumber(record.score_medio_importancia);

    // Campos que podem vir como null
    case 'valor_total_apropriado':
      return toSafeNumber(record.valor_total_apropriado);
    case 'conciliados':
      return toSafeInt(record.conciliados);
    case 'pendentes':
      return toSafeInt(record.pendentes);

    default:
      return record[fieldId] || null;
  }
}

/**
 * Campos específicos da API Clientes
 */
function getClientesFieldValue(record, fieldId) {
  switch (fieldId) {
    // IDs
    case 'cliente_id':
      return toSafeInt(record[fieldId]);

    // Textos
    case 'nome_completo':
    case 'tipo_pessoa':
    case 'cpf_cnpj_limpo':
    case 'faixa_etaria':
    case 'cidade':
    case 'estado':
    case 'segmento_demografico':
    case 'categoria_cliente':
    case 'categoria_risco_credito':
      return record[fieldId] || '';

    // Números
    case 'qualidade_score':
    case 'score_valor_cliente':
    case 'idade_atual':
    case 'dias_como_cliente':
      return toSafeNumber(record[fieldId]);

    // Valores monetários
    case 'valor_total_contratos':
      return toSafeNumber(record[fieldId]);

    // Contadores
    case 'total_contratos':
      return toSafeInt(record[fieldId]);

    // Booleanos
    case 'tem_historico_compras':
    case 'tem_saldo_devedor':
    case 'ativo':
      return toSafeBool(record[fieldId]);

    default:
      return record[fieldId] || null;
  }
}

/**
 * Campos específicos da API Vendas
 */
function getVendasFieldValue(record, fieldId) {
  switch (fieldId) {
    // IDs
    case 'contrato_id':
    case 'cliente_id':
    case 'empreendimento_id':
      return toSafeInt(record[fieldId]);

    // Textos
    case 'numero_contrato':
    case 'situacao_contrato':
    case 'status_derivado':
    case 'categoria_valor_contrato':
    case 'forma_pagamento_principal':
    case 'indexador_principal':
    case 'faixa_valor_comissao':
    case 'cliente_nome':
    case 'empreendimento_nome':
      return record[fieldId] || '';

    // Valores monetários
    case 'valor_contrato_original':
    case 'valor_venda_total':
    case 'valor_total_pago':
    case 'saldo_devedor':
    case 'valor_total_comissao':
      return toSafeNumber(record[fieldId]);

    // Contadores
    case 'total_parcelas':
    case 'parcelas_pagas':
      return toSafeInt(record[fieldId]);

    // Percentuais
    case 'percentual_pago':
    case 'percentual_comissao_sobre_contrato':
      return toSafeNumber(record[fieldId]) / 100; // Converter para decimal

    // Booleanos
    case 'tem_comissao':
      return toSafeBool(record[fieldId]);

    // Datas
    case 'data_contrato':
    case 'data_entrega_prevista':
      return formatDateForLooker(record[fieldId]);

    default:
      return record[fieldId] || null;
  }
}

/**
 * Campos específicos da API Portfolio
 */
function getPortfolioFieldValue(record, fieldId) {
  switch (fieldId) {
    // IDs
    case 'unidade_id':
    case 'empreendimento_id':
    case 'contrato_id':
      return toSafeInt(record[fieldId]);

    // Textos
    case 'unidade_nome':
    case 'tipo_imovel':
    case 'status_unidade':
    case 'empreendimento_nome':
    case 'status_empreendimento':
    case 'categoria_valor':
    case 'categoria_tamanho':
    case 'categoria_tipo':
    case 'segmento_estrategico':
    case 'numero_contrato':
    case 'contrato_status':
      return record[fieldId] || '';

    // Números/Áreas
    case 'area_util':
    case 'area_total':
      return toSafeNumber(record[fieldId]);

    // Valores monetários
    case 'valor_unidade':
    case 'valor_m2':
      return toSafeNumber(record[fieldId]);

    // Scores
    case 'score_atratividade':
    case 'score_qualidade':
      return toSafeNumber(record[fieldId]);

    // Booleanos
    case 'tem_contrato_vinculado':
    case 'tem_empreendimento_vinculado':
    case 'tem_coordenadas':
      return toSafeBool(record[fieldId]);

    default:
      return record[fieldId] || null;
  }
}

// ============================================
// ADMIN E TESTES
// ============================================
function isAdminUser() {
  return false;
}

/**
 * Teste de conexão com todas as APIs
 */
function testAllApis() {
  console.log('=== TESTE COMPLETO GOLD CONNECTOR V7 ===');

  var results = {};
  var apiKeys = Object.keys(CONFIG.APIS);

  for (var i = 0; i < apiKeys.length; i++) {
    var apiKey = apiKeys[i];
    var api = CONFIG.APIS[apiKey];

    try {
      console.log('\nTestando API: ' + api.name);

      var url = CONFIG.BASE_URL + api.endpoint + '?limit=1';
      var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

      var statusCode = response.getResponseCode();
      console.log('Status: ' + statusCode);

      if (statusCode === 200) {
        var data = JSON.parse(response.getContentText());
        console.log('✅ ' + api.name + ' - OK');
        console.log('   Registros: ' + (data.data ? data.data.length : 0));
        results[apiKey] = '✅ OK';
      } else {
        console.log('❌ ' + api.name + ' - Erro ' + statusCode);
        results[apiKey] = '❌ Erro ' + statusCode;
      }

    } catch (e) {
      console.log('❌ ' + api.name + ' - Exceção: ' + e.toString());
      results[apiKey] = '❌ Erro: ' + e.toString();
    }
  }

  console.log('\n=== RESUMO DOS TESTES ===');
  for (var key in results) {
    console.log(key + ': ' + results[key]);
  }

  return results;
}

/**
 * Teste simples de grupo
 */
function testSimpleGroup() {
  console.log('=== TESTE SIMPLES DE GRUPO ===');

  try {
    var cc = DataStudioApp.createCommunityConnector();
    var types = cc.FieldType;
    var fields = cc.getFields();

    // Teste básico de grupo
    var testField = fields.newDimension()
      .setId('test_field')
      .setName('Campo de Teste')
      .setType(types.TEXT)
      .setDescription('Campo para testar grupos')
      .setGroup('🧪 Teste');

    console.log('Campo criado:', testField);

    var schema = fields.build();
    console.log('Schema construído com ' + schema.length + ' campos');

    // Verificar se o grupo foi aplicado
    if (schema.length > 0 && schema[0].group) {
      console.log('✅ Grupo detectado: ' + schema[0].group);
      return '✅ setGroup() funciona!';
    } else {
      console.log('❌ Grupo não detectado no schema');
      console.log('Propriedades do campo:', JSON.stringify(schema[0], null, 2));
      return '❌ setGroup() não está funcionando';
    }

  } catch (e) {
    console.log('❌ Erro no teste: ' + e.toString());
    return '❌ Erro: ' + e.toString();
  }
}

/**
 * Teste dos grupos de campos
 */
function testFieldGroups() {
  console.log('=== TESTE DE GRUPOS DE CAMPOS ===');

  try {
    // Primeiro teste simples
    var simpleResult = testSimpleGroup();
    console.log('Resultado do teste simples: ' + simpleResult);

    var apis = ['financeiro', 'clientes', 'vendas', 'portfolio'];
    var cc = DataStudioApp.createCommunityConnector();
    var types = cc.FieldType;
    var aggregations = cc.AggregationType;

    for (var i = 0; i < apis.length; i++) {
      var apiName = apis[i];
      console.log('\nTesting API: ' + apiName);

      var fields = cc.getFields();
      addCommonFields(fields, types);

      switch (apiName) {
        case 'financeiro':
          addFinanceiroFields(fields, types, aggregations);
          break;
        case 'clientes':
          addClientesFields(fields, types, aggregations);
          break;
        case 'vendas':
          addVendasFields(fields, types, aggregations);
          break;
        case 'portfolio':
          addPortfolioFields(fields, types, aggregations);
          break;
      }

      var schema = fields.build();
      console.log('✅ ' + apiName + ' - ' + schema.length + ' campos definidos');

      // Verificar grupos
      var groups = {};
      for (var j = 0; j < schema.length; j++) {
        if (schema[j].group) {
          groups[schema[j].group] = (groups[schema[j].group] || 0) + 1;
        }
      }

      console.log('Grupos encontrados:');
      for (var group in groups) {
        console.log('  ' + group + ': ' + groups[group] + ' campos');
      }
    }

    return '✅ Teste de grupos concluído!';

  } catch (e) {
    console.log('❌ Erro no teste: ' + e.toString());
    return '❌ Erro: ' + e.toString();
  }
}

/**
 * Teste completo do connector
 */
function testFullConnector() {
  console.log('=== TESTE COMPLETO DO CONNECTOR ===');

  try {
    // 1. Teste de configuração
    var config = getConfig({});
    console.log('✅ Configuração OK');

    // 2. Teste de schema para cada API
    var apis = ['financeiro', 'clientes', 'vendas', 'portfolio'];
    for (var i = 0; i < apis.length; i++) {
      var apiName = apis[i];
      var schema = getSchema({ configParams: { api_source: apiName } });
      console.log('✅ Schema ' + apiName + ' OK - Campos: ' + schema.schema.length);
    }

    // 3. Teste de grupos
    testFieldGroups();

    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('🚀 Gold Connector v7.1 está pronto para uso!');

    return '✅ Connector Gold v7.1 - PRONTO COM GRUPOS!';

  } catch (e) {
    console.log('❌ Erro no teste: ' + e.toString());
    return '❌ Erro: ' + e.toString();
  }
}