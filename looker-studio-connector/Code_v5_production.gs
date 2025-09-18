/**
 * Sienge Looker Studio Connector - VERSÃO PRODUÇÃO
 * Versão 5.0 - Testada e validada
 *
 * CORREÇÕES APLICADAS:
 * 1. Formato correto { values: [...] }
 * 2. Cache simplificado
 * 3. Tratamento de erros robusto
 * 4. Campos essenciais testados
 */

// ============================================
// CONFIGURAÇÃO
// ============================================
var CONFIG = {
  API_URL: 'https://conector.catometrics.com.br/api/datawarehouse/master',
  MAX_RECORDS: 5000,
  USE_CACHE: false, // Desabilitado inicialmente para evitar problemas
  DEBUG: false
};

// ============================================
// INICIALIZAÇÃO
// ============================================
var cc = DataStudioApp.createCommunityConnector();

// ============================================
// AUTENTICAÇÃO
// ============================================
function getAuthType() {
  return cc.newAuthTypeResponse()
    .setAuthType(cc.AuthType.NONE)
    .build();
}

// ============================================
// CONFIGURAÇÃO
// ============================================
function getConfig(request) {
  var config = cc.getConfig();

  config.newInfo()
    .setId('info')
    .setText('Conector para Sienge Data Warehouse - Versão 5.0');

  return config.build();
}

// ============================================
// SCHEMA DE CAMPOS
// ============================================
function getFields() {
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;

  // ===== DIMENSÕES =====

  // Data Principal (CRÍTICO para Looker Studio)
  fields.newDimension()
    .setId('data_principal')
    .setName('Data Principal')
    .setType(types.YEAR_MONTH_DAY);

  // Dimensões de Texto
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

  // Dimensões Temporais Adicionais
  fields.newDimension()
    .setId('ano')
    .setName('Ano')
    .setType(types.YEAR);

  fields.newDimension()
    .setId('mes')
    .setName('Mês')
    .setType(types.MONTH);

  // Dimensões Booleanas
  fields.newDimension()
    .setId('contratos_ativos')
    .setName('Contrato Ativo')
    .setType(types.BOOLEAN);

  fields.newDimension()
    .setId('tem_comissao')
    .setName('Tem Comissão')
    .setType(types.BOOLEAN);

  fields.newDimension()
    .setId('tem_financiamento')
    .setName('Tem Financiamento')
    .setType(types.BOOLEAN);

  // ===== MÉTRICAS =====

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
    .setId('valor_comissao')
    .setName('Valor da Comissão')
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

  fields.newMetric()
    .setId('quantidade_registros')
    .setName('Quantidade de Registros')
    .setType(types.NUMBER)
    .setAggregation(aggregations.COUNT);

  return fields;
}

// ============================================
// RETORNAR SCHEMA
// ============================================
function getSchema(request) {
  return { schema: getFields().build() };
}

// ============================================
// BUSCAR DADOS
// ============================================
function getData(request) {
  try {
    logDebug('getData iniciado - campos: ' + request.fields.length);

    // Buscar dados da API
    var response = UrlFetchApp.fetch(CONFIG.API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
      throwUserError('Erro ao conectar com a API: ' + response.getResponseCode());
    }

    var jsonData = JSON.parse(response.getContentText());

    if (!jsonData.success || !jsonData.data || jsonData.data.length === 0) {
      // Retornar dataset vazio se não houver dados
      return {
        schema: request.fields,
        rows: []
      };
    }

    // Limitar registros
    var records = jsonData.data;
    if (records.length > CONFIG.MAX_RECORDS) {
      records = records.slice(0, CONFIG.MAX_RECORDS);
    }

    logDebug('Processando ' + records.length + ' registros');

    // ================================================
    // CONSTRUIR ROWS NO FORMATO CORRETO
    // ================================================
    var rows = [];

    for (var i = 0; i < records.length; i++) {
      var record = records[i];
      var values = [];

      // Para cada campo solicitado, obter o valor
      for (var j = 0; j < request.fields.length; j++) {
        var field = request.fields[j];
        values.push(getFieldValue(record, field.name));
      }

      // FORMATO CRÍTICO: { values: array }
      rows.push({ values: values });
    }

    logDebug('Retornando ' + rows.length + ' linhas');

    return {
      schema: request.fields,
      rows: rows
    };

  } catch (e) {
    logDebug('ERRO: ' + e.toString());
    throwUserError('Erro ao buscar dados: ' + e.toString());
  }
}

// ============================================
// OBTER VALOR DO CAMPO
// ============================================
function getFieldValue(record, fieldName) {
  try {
    switch (fieldName) {
      // ===== DATAS =====
      case 'data_principal':
        return formatDateForLooker(record['data_principal']);

      case 'ano':
        return record['ano'] ? String(record['ano']).substring(0, 4) : null;

      case 'mes':
        if (record['mes']) {
          var m = parseInt(record['mes']);
          return (m < 10 ? '0' : '') + m;
        }
        return null;

      // ===== TEXTOS =====
      case 'domain_type':
        return record['domain_type'] || '';

      case 'empresa_nome':
        return record['empresa_nome'] || '';

      case 'status_contrato':
        return record['status_contrato'] || '';

      case 'tipo_contrato':
        return record['tipo_contrato'] || '';

      case 'numero_contrato':
        return record['numero_contrato'] || '';

      case 'forma_pagamento':
        return record['forma_pagamento'] || '';

      case 'cliente_principal':
        return record['cliente_principal'] || '';

      case 'empreendimento_nome':
        return record['empreendimento_nome'] || '';

      // ===== NÚMEROS =====
      case 'valor_contrato':
        return parseFloat(record['valor_contrato'] || 0);

      case 'saldo_devedor':
        return parseFloat(record['saldo_devedor'] || 0);

      case 'valor_comissao':
        return parseFloat(record['valor_comissao'] || 0);

      case 'total_parcelas':
        return parseInt(record['total_parcelas'] || 0);

      case 'parcelas_pagas':
        return parseInt(record['parcelas_pagas'] || 0);

      case 'quantidade_registros':
        return 1; // Sempre 1 para contagem

      // ===== BOOLEANOS =====
      case 'contratos_ativos':
        return record['contratos_ativos'] === true || record['contratos_ativos'] === 'true';

      case 'tem_comissao':
        return record['tem_comissao'] === true || record['tem_comissao'] === 'true';

      case 'tem_financiamento':
        return record['tem_financiamento'] === true || record['tem_financiamento'] === 'true';

      default:
        return null;
    }
  } catch (e) {
    logDebug('Erro no campo ' + fieldName + ': ' + e.toString());
    return null;
  }
}

// ============================================
// FORMATAR DATA PARA LOOKER STUDIO
// ============================================
function formatDateForLooker(dateValue) {
  if (!dateValue) return null;

  try {
    // Converter para string e remover caracteres não numéricos
    var dateStr = String(dateValue);

    // Remover tudo exceto números
    var numbers = dateStr.replace(/[^\d]/g, '');

    // Pegar apenas YYYYMMDD (8 primeiros dígitos)
    if (numbers.length >= 8) {
      return numbers.substring(0, 8);
    }

    return null;
  } catch (e) {
    return null;
  }
}

// ============================================
// TRATAMENTO DE ERROS
// ============================================
function throwUserError(message) {
  cc.newUserError()
    .setDebugText(message)
    .setText(message)
    .throwException();
}

// ============================================
// DEBUG
// ============================================
function logDebug(message) {
  if (CONFIG.DEBUG) {
    console.log('[V5] ' + message);
  }
}

// ============================================
// ADMIN
// ============================================
function isAdminUser() {
  return false; // Simplificado
}

// ============================================
// TESTES
// ============================================

/**
 * Testar conexão com API
 */
function testConnection() {
  console.log('=== TESTE DE CONEXÃO V5 ===');

  try {
    var response = UrlFetchApp.fetch(CONFIG.API_URL, {
      muteHttpExceptions: true
    });

    console.log('Status: ' + response.getResponseCode());

    if (response.getResponseCode() === 200) {
      var data = JSON.parse(response.getContentText());
      console.log('✅ API OK');
      console.log('Registros: ' + (data.data ? data.data.length : 0));
      return 'Conexão OK!';
    } else {
      console.log('❌ Erro HTTP: ' + response.getResponseCode());
      return 'Erro na conexão';
    }
  } catch (e) {
    console.log('❌ Erro: ' + e.toString());
    return 'Erro: ' + e.toString();
  }
}

/**
 * Testar estrutura completa
 */
function testFullStructure() {
  console.log('=== TESTE COMPLETO V5 ===');

  try {
    // 1. Schema
    var schema = getSchema();
    console.log('Schema OK - Campos: ' + schema.schema.length);

    // 2. Mock request
    var request = {
      fields: [
        { name: 'data_principal' },
        { name: 'domain_type' },
        { name: 'valor_contrato' },
        { name: 'quantidade_registros' }
      ]
    };

    // 3. getData
    var result = getData(request);
    console.log('getData OK - Linhas: ' + result.rows.length);

    // 4. Validar estrutura
    if (result.rows.length > 0) {
      var firstRow = result.rows[0];
      if (firstRow.values && Array.isArray(firstRow.values)) {
        console.log('✅ ESTRUTURA PERFEITA!');
        console.log('Primeira linha: ' + JSON.stringify(firstRow));
        return 'TESTE PASSOU - Estrutura correta!';
      } else {
        console.log('❌ Estrutura incorreta');
        return 'ERRO - Estrutura incorreta';
      }
    } else {
      console.log('⚠️ Sem dados para validar');
      return 'Sem dados';
    }

  } catch (e) {
    console.log('❌ Erro no teste: ' + e.toString());
    return 'Erro: ' + e.toString();
  }
}