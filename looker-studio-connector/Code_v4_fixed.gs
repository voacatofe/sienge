/**
 * Sienge Data Warehouse Community Connector para Looker Studio
 * Versão 4.0 - CORRIGIDA com estrutura adequada
 *
 * CORREÇÕES PRINCIPAIS:
 * 1. Formato correto de rows com { values: [...] }
 * 2. Uso do DataStudioApp para melhor compatibilidade
 * 3. Tratamento de erros apropriado
 * 4. Cache otimizado
 * 5. Validação de campos
 */

// ============================================
// CONFIGURAÇÃO PRINCIPAL
// ============================================
var CONFIG = {
  // URL da API - IMPORTANTE: Atualizar para produção
  API_URL: 'https://conector.catometrics.com.br/api/datawarehouse/master',

  // URL de fallback para testes locais
  API_URL_LOCAL: 'http://localhost:3001/api/datawarehouse/master',

  // Use produção por padrão
  USE_PRODUCTION: true,

  // Admins autorizados
  ADMIN_EMAILS: [
    'darlan@catofe.com.br'
  ],

  // Cache settings (em segundos) - REDUZIDO!
  CACHE_DURATION: 300, // 5 minutos apenas

  // Limite de registros por request
  MAX_RECORDS: 10000, // Reduzido para melhor performance

  // Debug mode
  DEBUG: true
};

// ============================================
// INICIALIZAÇÃO DO CONECTOR
// ============================================
var cc = DataStudioApp.createCommunityConnector();

// ============================================
// FUNÇÕES OBRIGATÓRIAS DO LOOKER STUDIO
// ============================================

/**
 * Define o tipo de autenticação
 */
function getAuthType() {
  var response = cc.newAuthTypeResponse()
    .setAuthType(cc.AuthType.NONE);
  return response.build();
}

/**
 * Configurações do usuário
 */
function getConfig(request) {
  var config = cc.getConfig();

  // Por enquanto, sem configurações customizadas
  // Futuramente podemos adicionar:
  // - Seleção de empresa
  // - Filtro de período
  // - Limite de registros

  return config.build();
}

/**
 * Schema dos dados - SIMPLIFICADO PARA TESTES
 * Começamos com campos essenciais e expandimos gradualmente
 */
function getSchema(request) {
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;

  // =====================================
  // DIMENSÕES ESSENCIAIS
  // =====================================

  // Data principal - FORMATO CRÍTICO!
  fields.newDimension()
    .setId('data_principal')
    .setName('Data Principal')
    .setType(types.YEAR_MONTH_DAY);

  // Dimensões de texto básicas
  fields.newDimension()
    .setId('domain_type')
    .setName('Tipo de Domínio')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('empresa_nome')
    .setName('Nome da Empresa')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('status_contrato')
    .setName('Status do Contrato')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('tipo_contrato')
    .setName('Tipo do Contrato')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('numero_contrato')
    .setName('Número do Contrato')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('forma_pagamento')
    .setName('Forma de Pagamento')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('cliente_principal')
    .setName('Cliente Principal')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('empreendimento_nome')
    .setName('Nome do Empreendimento')
    .setType(types.TEXT);

  // Dimensões temporais adicionais
  fields.newDimension()
    .setId('ano')
    .setName('Ano')
    .setType(types.YEAR);

  fields.newDimension()
    .setId('mes')
    .setName('Mês')
    .setType(types.MONTH);

  fields.newDimension()
    .setId('ano_mes')
    .setName('Ano-Mês')
    .setType(types.YEAR_MONTH);

  // =====================================
  // MÉTRICAS ESSENCIAIS (OBRIGATÓRIAS!)
  // =====================================

  fields.newMetric()
    .setId('valor_contrato')
    .setName('Valor do Contrato')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('saldo_devedor')
    .setName('Saldo Devedor')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('total_parcelas')
    .setName('Total de Parcelas')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('parcelas_pagas')
    .setName('Parcelas Pagas')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  // Métrica de contagem (sempre útil)
  fields.newMetric()
    .setId('quantidade_registros')
    .setName('Quantidade de Registros')
    .setType(types.NUMBER)
    .setAggregation(aggregations.COUNT);

  // Comissões
  fields.newMetric()
    .setId('valor_comissao')
    .setName('Valor da Comissão')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('percentual_comissao')
    .setName('Percentual de Comissão (%)')
    .setType(types.PERCENT)
    .setAggregation(aggregations.AVG);

  // Dimensões booleanas
  fields.newDimension()
    .setId('tem_comissao')
    .setName('Tem Comissão')
    .setType(types.BOOLEAN);

  fields.newDimension()
    .setId('tem_financiamento')
    .setName('Tem Financiamento')
    .setType(types.BOOLEAN);

  fields.newDimension()
    .setId('contratos_ativos')
    .setName('Contratos Ativos')
    .setType(types.BOOLEAN);

  return { schema: fields.build() };
}

/**
 * Buscar dados da API - FORMATO CORRIGIDO!
 */
function getData(request) {
  logDebug('=== getData INICIADO ===');
  logDebug('Campos solicitados: ' + request.fields.map(function(f) { return f.name; }).join(', '));

  try {
    // Determinar URL da API
    var apiUrl = CONFIG.USE_PRODUCTION ? CONFIG.API_URL : CONFIG.API_URL_LOCAL;

    // Tentar cache primeiro (com tempo reduzido)
    var cache = CacheService.getUserCache();
    // Criar chave de cache baseada nos campos solicitados
    var fieldNames = request.fields.map(function(f) { return f.name; }).sort().join('_');
    var cacheKey = 'sienge_v4_' + fieldNames.substring(0, 50); // Limitar tamanho da chave

    var cachedData = cache.get(cacheKey);
    if (cachedData && !CONFIG.DEBUG) {
      logDebug('Retornando dados do cache');
      return JSON.parse(cachedData);
    }

    // Buscar dados da API
    logDebug('Buscando dados da API: ' + apiUrl);

    var response = UrlFetchApp.fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Sienge-Looker-Connector/4.0'
      },
      muteHttpExceptions: true
    });

    var responseCode = response.getResponseCode();
    logDebug('Response code: ' + responseCode);

    if (responseCode !== 200) {
      var errorMessage = 'Erro ao buscar dados da API. Código: ' + responseCode;
      logDebug('ERRO: ' + errorMessage);

      // Usar error handling do DataStudio
      cc.newUserError()
        .setDebugText('API retornou erro: ' + responseCode)
        .setText(errorMessage)
        .throwException();
    }

    var responseText = response.getContentText();
    var jsonResponse = JSON.parse(responseText);

    logDebug('API success: ' + jsonResponse.success);
    logDebug('Total de registros da API: ' + (jsonResponse.data ? jsonResponse.data.length : 0));

    if (!jsonResponse.success || !jsonResponse.data || jsonResponse.data.length === 0) {
      // Retornar dataset vazio se não houver dados
      return {
        schema: request.fields,
        rows: []
      };
    }

    var apiData = jsonResponse.data;

    // Limitar registros se necessário
    if (apiData.length > CONFIG.MAX_RECORDS) {
      logDebug('Limitando registros de ' + apiData.length + ' para ' + CONFIG.MAX_RECORDS);
      apiData = apiData.slice(0, CONFIG.MAX_RECORDS);
    }

    // ================================================
    // FORMATO CRÍTICO - CORRIGIDO!
    // Cada linha DEVE ser { values: [...] }
    // ================================================
    var rows = [];

    for (var i = 0; i < apiData.length; i++) {
      var record = apiData[i];
      var values = [];

      // Para cada campo solicitado, adicionar o valor na ordem correta
      for (var j = 0; j < request.fields.length; j++) {
        var field = request.fields[j];
        var value = getFieldValue(record, field.name);
        values.push(value);
      }

      // FORMATO CORRETO: { values: [...] }
      rows.push({ values: values });
    }

    logDebug('Total de linhas processadas: ' + rows.length);
    if (rows.length > 0) {
      logDebug('Primeira linha (amostra): ' + JSON.stringify(rows[0]));
    }

    // Estrutura de retorno
    var result = {
      schema: request.fields,
      rows: rows
    };

    // Salvar no cache (tempo reduzido)
    if (!CONFIG.DEBUG) {
      try {
        cache.put(cacheKey, JSON.stringify(result), CONFIG.CACHE_DURATION);
        logDebug('Dados salvos no cache por ' + CONFIG.CACHE_DURATION + ' segundos');
      } catch (e) {
        logDebug('Erro ao salvar cache: ' + e.toString());
      }
    }

    return result;

  } catch (e) {
    var errorMessage = 'Erro ao buscar dados: ' + e.toString();
    logDebug('ERRO CRÍTICO: ' + errorMessage);

    cc.newUserError()
      .setDebugText(errorMessage)
      .setText('Erro ao conectar com a fonte de dados. Por favor, tente novamente.')
      .throwException();
  }
}

/**
 * Obter valor formatado de um campo
 */
function getFieldValue(record, fieldName) {
  var value = null;

  try {
    switch(fieldName) {
      // ===== DATAS - FORMATO CRÍTICO! =====
      case 'data_principal':
        if (record['data_principal']) {
          // Converter para YYYYMMDD (obrigatório para YEAR_MONTH_DAY)
          var dateStr = String(record['data_principal']);
          // Remover separadores e pegar apenas YYYYMMDD
          var cleaned = dateStr.replace(/[-T:\s]/g, '').substring(0, 8);
          value = cleaned.length === 8 ? cleaned : null;
        }
        break;

      case 'ano':
        // YEAR deve ser string de 4 dígitos
        value = record['ano'] ? String(record['ano']).substring(0, 4) : null;
        break;

      case 'mes':
        // MONTH deve ser string de 2 dígitos (01-12)
        if (record['mes']) {
          var mesNum = parseInt(record['mes']);
          value = (mesNum < 10 ? '0' : '') + mesNum;
        }
        break;

      case 'ano_mes':
        // YEAR_MONTH deve ser YYYYMM
        if (record['ano_mes']) {
          value = String(record['ano_mes']).replace(/-/g, '');
        }
        break;

      // ===== STRINGS =====
      case 'domain_type':
        value = record['domain_type'] || 'N/A';
        break;

      case 'empresa_nome':
        value = record['empresa_nome'] || '';
        break;

      case 'status_contrato':
        value = record['status_contrato'] || '';
        break;

      case 'tipo_contrato':
        value = record['tipo_contrato'] || '';
        break;

      case 'numero_contrato':
        value = record['numero_contrato'] || '';
        break;

      case 'forma_pagamento':
        value = record['forma_pagamento'] || '';
        break;

      case 'cliente_principal':
        value = record['cliente_principal'] || '';
        break;

      case 'empreendimento_nome':
        value = record['empreendimento_nome'] || '';
        break;

      // ===== NÚMEROS E MOEDAS =====
      case 'valor_contrato':
        value = parseFloat(record['valor_contrato'] || 0);
        break;

      case 'saldo_devedor':
        value = parseFloat(record['saldo_devedor'] || 0);
        break;

      case 'total_parcelas':
        value = parseInt(record['total_parcelas'] || 0);
        break;

      case 'parcelas_pagas':
        value = parseInt(record['parcelas_pagas'] || 0);
        break;

      case 'quantidade_registros':
        value = 1; // Sempre 1 para contagem
        break;

      case 'valor_comissao':
        value = parseFloat(record['valor_comissao'] || 0);
        break;

      case 'percentual_comissao':
        value = parseFloat(record['percentual_comissao'] || 0) / 100; // Converter para decimal
        break;

      // ===== BOOLEANOS =====
      case 'tem_comissao':
        value = record['tem_comissao'] === true || record['tem_comissao'] === 'true';
        break;

      case 'tem_financiamento':
        value = record['tem_financiamento'] === true || record['tem_financiamento'] === 'true';
        break;

      case 'contratos_ativos':
        value = record['contratos_ativos'] === true || record['contratos_ativos'] === 'true';
        break;

      default:
        // Campo não mapeado
        value = null;
    }
  } catch (e) {
    logDebug('Erro ao processar campo ' + fieldName + ': ' + e.toString());
    value = null;
  }

  return value;
}

/**
 * Função auxiliar para logging
 */
function logDebug(message) {
  if (CONFIG.DEBUG) {
    console.log('[DEBUG] ' + message);
  }
}

/**
 * Verificar se usuário é admin
 */
function isAdminUser() {
  try {
    var userEmail = Session.getEffectiveUser().getEmail();
    logDebug('Verificando admin para: ' + userEmail);

    var isAdmin = CONFIG.ADMIN_EMAILS.indexOf(userEmail) !== -1;
    return isAdmin;
  } catch (e) {
    logDebug('Erro ao verificar admin: ' + e.toString());
    return false;
  }
}

// ============================================
// FUNÇÕES DE TESTE E VALIDAÇÃO
// ============================================

/**
 * Testar conexão com a API
 */
function testConnection() {
  console.log('=== TESTE DE CONEXÃO V4 ===');

  try {
    var apiUrl = CONFIG.USE_PRODUCTION ? CONFIG.API_URL : CONFIG.API_URL_LOCAL;
    console.log('Testando API: ' + apiUrl);

    var response = UrlFetchApp.fetch(apiUrl, {
      method: 'GET',
      muteHttpExceptions: true
    });

    var responseCode = response.getResponseCode();
    console.log('Response Code: ' + responseCode);

    if (responseCode === 200) {
      var data = JSON.parse(response.getContentText());
      console.log('✅ Conexão OK!');
      console.log('Total de registros: ' + (data.data ? data.data.length : 0));

      if (data.data && data.data.length > 0) {
        console.log('Primeiro registro (amostra):');
        console.log(JSON.stringify(data.data[0], null, 2));
      }

      return '✅ Conexão bem-sucedida! Versão 4.0 CORRIGIDA';
    } else {
      return '❌ Erro na conexão. Código: ' + responseCode;
    }
  } catch (e) {
    console.error('❌ Erro: ' + e.toString());
    return '❌ Erro na conexão: ' + e.toString();
  }
}

/**
 * Testar estrutura completa do conector
 */
function testFullConnector() {
  console.log('=== TESTE COMPLETO DO CONECTOR V4 ===');

  try {
    // 1. Testar getAuthType
    console.log('\n1. Testando getAuthType...');
    var auth = getAuthType();
    console.log('AuthType: ' + JSON.stringify(auth));

    // 2. Testar getConfig
    console.log('\n2. Testando getConfig...');
    var config = getConfig();
    console.log('Config: ' + JSON.stringify(config));

    // 3. Testar getSchema
    console.log('\n3. Testando getSchema...');
    var schema = getSchema();
    console.log('Total de campos no schema: ' + schema.schema.length);

    // 4. Simular request do Looker Studio
    console.log('\n4. Simulando getData...');
    var mockRequest = {
      fields: [
        { name: 'data_principal' },
        { name: 'domain_type' },
        { name: 'empresa_nome' },
        { name: 'valor_contrato' },
        { name: 'quantidade_registros' }
      ]
    };

    var data = getData(mockRequest);
    console.log('Rows retornadas: ' + data.rows.length);

    // 5. Validar estrutura
    console.log('\n5. Validando estrutura...');
    if (data.rows.length > 0) {
      var firstRow = data.rows[0];
      console.log('Primeira linha: ' + JSON.stringify(firstRow));

      if (firstRow.values && Array.isArray(firstRow.values)) {
        console.log('✅ ESTRUTURA CORRETA! Row tem propriedade "values" como array');
        console.log('Número de valores: ' + firstRow.values.length);
        console.log('Número de campos solicitados: ' + mockRequest.fields.length);

        if (firstRow.values.length === mockRequest.fields.length) {
          console.log('✅ Número de valores corresponde aos campos solicitados!');
        } else {
          console.log('❌ ERRO: Número de valores não corresponde!');
        }
      } else {
        console.log('❌ ERRO: Estrutura incorreta! Row deve ter { values: [...] }');
      }
    }

    console.log('\n=== TESTE COMPLETO FINALIZADO ===');
    return 'Teste completo executado. Verifique os logs.';

  } catch (e) {
    console.error('❌ Erro no teste: ' + e.toString());
    return 'Erro no teste: ' + e.toString();
  }
}

/**
 * Limpar todo o cache
 */
function clearAllCache() {
  try {
    var cache = CacheService.getUserCache();
    // removeAll() requer array de chaves específicas
    // Como alternativa, vamos remover chaves conhecidas do nosso padrão
    var keysToRemove = [];

    // Tentar remover chaves com nosso prefixo
    for (var i = 0; i < 100; i++) {
      keysToRemove.push('sienge_v4_' + i);
    }

    // Remover chaves se existirem
    keysToRemove.forEach(function(key) {
      try {
        cache.remove(key);
      } catch (e) {
        // Ignorar se chave não existe
      }
    });

    console.log('✅ Cache limpo (chaves conhecidas removidas)');
    return 'Cache limpo!';
  } catch (e) {
    console.error('❌ Erro ao limpar cache: ' + e.toString());
    return 'Erro ao limpar cache';
  }
}