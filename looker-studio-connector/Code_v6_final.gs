/**
 * Sienge Looker Studio Connector - VERSÃO FINAL OTIMIZADA
 * Versão 6.0 - Com todas as correções cirúrgicas aplicadas
 *
 * MELHORIAS APLICADAS:
 * 1. Schema completo no getData usando getFields().forIds()
 * 2. Conversão robusta de boolean (1/0, true/false, SIM/NÃO)
 * 3. Proteção contra NaN em números
 * 4. Campo ano_mes para séries temporais
 * 5. Respeito ao dateRange do Looker Studio
 */

// ============================================
// CONFIGURAÇÃO
// ============================================
var CONFIG = {
  API_URL: 'https://conector.catometrics.com.br/api/datawarehouse/master',
  MAX_RECORDS: 10000,
  USE_CACHE: false,
  DEBUG: false
};

// ============================================
// INICIALIZAÇÃO
// ============================================
var cc = DataStudioApp.createCommunityConnector();

// ============================================
// FUNÇÕES AUXILIARES (HELPERS)
// ============================================

/**
 * Converter para float com proteção contra NaN
 */
function toFloat(v) {
  if (v === null || v === undefined || v === '') return 0;
  var n = parseFloat(String(v).replace(',', '.'));
  return isFinite(n) ? n : 0;
}

/**
 * Converter para inteiro com proteção contra NaN
 */
function toInt(v) {
  if (v === null || v === undefined || v === '') return 0;
  var n = parseInt(v, 10);
  return isFinite(n) ? n : 0;
}

/**
 * Converter para boolean robusto (aceita 1/0, true/false, S/N, SIM/NÃO)
 */
function toBool(v) {
  if (v === true || v === 'true' || v === 1 || v === '1') return true;
  if (v === 'S' || v === 's' || v === 'SIM' || v === 'sim') return true;
  if (v === 'Y' || v === 'y' || v === 'YES' || v === 'yes') return true;
  return false;
}

/**
 * Formatar data para Looker Studio (YYYYMMDD)
 */
function formatDateForLooker(dateValue) {
  if (!dateValue) return null;

  try {
    var dateStr = String(dateValue);
    var numbers = dateStr.replace(/[^\d]/g, '');

    if (numbers.length >= 8) {
      return numbers.substring(0, 8);
    }

    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Log de debug
 */
function logDebug(message) {
  if (CONFIG.DEBUG) {
    console.log('[V6] ' + message);
  }
}

/**
 * Lançar erro para usuário
 */
function throwUserError(message) {
  cc.newUserError()
    .setDebugText(message)
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
// CONFIGURAÇÃO
// ============================================
function getConfig(request) {
  var config = cc.getConfig();

  config.newInfo()
    .setId('info')
    .setText('Conector para Sienge Data Warehouse - Versão 6.0 Final');

  // MELHORIA 5: Tornar dateRange obrigatório
  config.setDateRangeRequired(true);

  return config.build();
}

// ============================================
// DEFINIR CAMPOS
// ============================================
function getFields() {
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;

  // ===== DIMENSÕES TEMPORAIS =====

  fields.newDimension()
    .setId('data_principal')
    .setName('Data Principal')
    .setType(types.YEAR_MONTH_DAY);

  fields.newDimension()
    .setId('ano')
    .setName('Ano')
    .setType(types.YEAR);

  fields.newDimension()
    .setId('mes')
    .setName('Mês')
    .setType(types.MONTH);

  // MELHORIA 4: Campo ano_mes para séries temporais
  fields.newDimension()
    .setId('ano_mes')
    .setName('Ano-Mês')
    .setType(types.YEAR_MONTH);

  // ===== DIMENSÕES DE NEGÓCIO =====

  fields.newDimension()
    .setId('domain_type')
    .setName('Tipo de Domínio')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('empresa_nome')
    .setName('Nome da Empresa')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('empresa_cidade')
    .setName('Cidade da Empresa')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('empresa_estado')
    .setName('Estado da Empresa')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('empresa_regiao')
    .setName('Região da Empresa')
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

  fields.newDimension()
    .setId('empreendimento_tipo')
    .setName('Tipo do Empreendimento')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('faixa_valor_contrato')
    .setName('Faixa de Valor do Contrato')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('status_pagamento')
    .setName('Status de Pagamento')
    .setType(types.TEXT);

  // ===== DIMENSÕES BOOLEANAS =====

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

  // ===== MÉTRICAS FINANCEIRAS =====

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
    .setId('percentual_comissao')
    .setName('Percentual de Comissão (%)')
    .setType(types.PERCENT)
    .setAggregation(aggregations.AVG);

  // ===== MÉTRICAS DE QUANTIDADE =====

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
// BUSCAR DADOS - COM TODAS AS CORREÇÕES
// ============================================
function getData(request) {
  try {
    logDebug('getData iniciado - campos: ' + request.fields.length);

    // Buscar dados da API
    var response = UrlFetchApp.fetch(CONFIG.API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Sienge-Looker-Connector/6.0'
      },
      muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
      throwUserError('Erro ao conectar com a API: ' + response.getResponseCode());
    }

    var jsonData = JSON.parse(response.getContentText());

    // CORREÇÃO 1: Retornar schema completo mesmo sem dados
    var requestedFieldIds = request.fields.map(function(f) { return f.name; });
    var requestedSchema = getFields().forIds(requestedFieldIds).build();

    if (!jsonData.success || !jsonData.data || jsonData.data.length === 0) {
      return {
        schema: requestedSchema,
        rows: []
      };
    }

    var records = jsonData.data;

    // Limitar registros
    if (records.length > CONFIG.MAX_RECORDS) {
      logDebug('Limitando de ' + records.length + ' para ' + CONFIG.MAX_RECORDS);
      records = records.slice(0, CONFIG.MAX_RECORDS);
    }

    // MELHORIA 5: Filtrar por dateRange se fornecido
    if (request.dateRange && request.dateRange.startDate && request.dateRange.endDate) {
      var start = request.dateRange.startDate; // YYYYMMDD
      var end = request.dateRange.endDate;     // YYYYMMDD

      logDebug('Filtrando por período: ' + start + ' até ' + end);

      records = records.filter(function(r) {
        var d = formatDateForLooker(r['data_principal']);
        return d && d >= start && d <= end;
      });

      logDebug('Registros após filtro de data: ' + records.length);
    }

    // Construir rows com valores na ordem correta
    var rows = [];

    for (var i = 0; i < records.length; i++) {
      var values = [];

      for (var j = 0; j < requestedFieldIds.length; j++) {
        values.push(getFieldValue(records[i], requestedFieldIds[j]));
      }

      rows.push({ values: values });
    }

    logDebug('Retornando ' + rows.length + ' linhas');

    return {
      schema: requestedSchema,
      rows: rows
    };

  } catch (e) {
    logDebug('ERRO: ' + e.toString());
    throwUserError('Erro ao buscar dados: ' + e.toString());
  }
}

// ============================================
// OBTER VALOR DO CAMPO - COM TODAS AS CORREÇÕES
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
          var m = toInt(record['mes']);
          return (m < 10 ? '0' : '') + m;
        }
        return null;

      // MELHORIA 4: Campo ano_mes
      case 'ano_mes':
        var d = formatDateForLooker(record['data_principal']);
        return d ? d.substring(0, 6) : null;

      // ===== TEXTOS =====
      case 'domain_type':
        return record['domain_type'] || '';

      case 'empresa_nome':
        return record['empresa_nome'] || '';

      case 'empresa_cidade':
        return record['empresa_cidade'] || '';

      case 'empresa_estado':
        return record['empresa_estado'] || '';

      case 'empresa_regiao':
        return record['empresa_regiao'] || '';

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

      case 'empreendimento_tipo':
        return record['empreendimento_tipo'] || '';

      case 'faixa_valor_contrato':
        return record['faixa_valor_contrato'] || '';

      case 'status_pagamento':
        return record['status_pagamento'] || '';

      // ===== NÚMEROS COM PROTEÇÃO CONTRA NaN (CORREÇÃO 3) =====
      case 'valor_contrato':
        return toFloat(record['valor_contrato']);

      case 'saldo_devedor':
        return toFloat(record['saldo_devedor']);

      case 'valor_comissao':
        return toFloat(record['valor_comissao']);

      case 'percentual_comissao':
        return toFloat(record['percentual_comissao']) / 100; // Converter para decimal

      case 'total_parcelas':
        return toInt(record['total_parcelas']);

      case 'parcelas_pagas':
        return toInt(record['parcelas_pagas']);

      case 'quantidade_registros':
        return 1; // Sempre 1 para contagem

      // ===== BOOLEANOS ROBUSTOS (CORREÇÃO 2) =====
      case 'contratos_ativos':
        return toBool(record['contratos_ativos']);

      case 'tem_comissao':
        return toBool(record['tem_comissao']);

      case 'tem_financiamento':
        return toBool(record['tem_financiamento']);

      default:
        logDebug('Campo não mapeado: ' + fieldName);
        return null;
    }
  } catch (e) {
    logDebug('Erro no campo ' + fieldName + ': ' + e.toString());
    return null;
  }
}

// ============================================
// ADMIN
// ============================================
function isAdminUser() {
  return false;
}

// ============================================
// FUNÇÕES DE TESTE
// ============================================

/**
 * Testar conexão
 */
function testConnection() {
  console.log('=== TESTE DE CONEXÃO V6 ===');

  try {
    var response = UrlFetchApp.fetch(CONFIG.API_URL, {
      muteHttpExceptions: true
    });

    console.log('Status: ' + response.getResponseCode());

    if (response.getResponseCode() === 200) {
      var data = JSON.parse(response.getContentText());
      console.log('✅ API OK');
      console.log('Registros: ' + (data.data ? data.data.length : 0));
      return '✅ Conexão OK!';
    } else {
      console.log('❌ Erro HTTP: ' + response.getResponseCode());
      return '❌ Erro na conexão';
    }
  } catch (e) {
    console.log('❌ Erro: ' + e.toString());
    return '❌ Erro: ' + e.toString();
  }
}

/**
 * Testar estrutura completa
 */
function testFullStructure() {
  console.log('=== TESTE COMPLETO V6 ===');

  try {
    // 1. Schema
    var schema = getSchema();
    console.log('Schema OK - Campos: ' + schema.schema.length);

    // 2. Mock request com dateRange
    var request = {
      fields: [
        { name: 'data_principal' },
        { name: 'ano_mes' },
        { name: 'domain_type' },
        { name: 'valor_contrato' },
        { name: 'tem_comissao' },
        { name: 'quantidade_registros' }
      ],
      dateRange: {
        startDate: '20240901',
        endDate: '20241231'
      }
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

        // Testar conversões
        console.log('\nTestando conversões:');
        console.log('toBool(1): ' + toBool(1));
        console.log('toBool("SIM"): ' + toBool("SIM"));
        console.log('toFloat("1.234,56"): ' + toFloat("1.234,56"));
        console.log('toInt("123abc"): ' + toInt("123abc"));

        return '✅ V6 TESTADA COM SUCESSO!';
      } else {
        console.log('❌ Estrutura incorreta');
        return '❌ Estrutura incorreta';
      }
    } else {
      console.log('⚠️ Sem dados para validar');
      return '⚠️ Sem dados';
    }

  } catch (e) {
    console.log('❌ Erro no teste: ' + e.toString());
    return '❌ Erro: ' + e.toString();
  }
}

/**
 * Testar helpers
 */
function testHelpers() {
  console.log('=== TESTE DE HELPERS V6 ===');

  // Teste toFloat
  console.log('\nTeste toFloat:');
  console.log('toFloat("123.45"): ' + toFloat("123.45"));
  console.log('toFloat("123,45"): ' + toFloat("123,45"));
  console.log('toFloat("abc"): ' + toFloat("abc"));
  console.log('toFloat(null): ' + toFloat(null));
  console.log('toFloat(NaN): ' + toFloat(NaN));

  // Teste toInt
  console.log('\nTeste toInt:');
  console.log('toInt("123"): ' + toInt("123"));
  console.log('toInt("123.45"): ' + toInt("123.45"));
  console.log('toInt("abc"): ' + toInt("abc"));
  console.log('toInt(null): ' + toInt(null));

  // Teste toBool
  console.log('\nTeste toBool:');
  console.log('toBool(true): ' + toBool(true));
  console.log('toBool(1): ' + toBool(1));
  console.log('toBool("1"): ' + toBool("1"));
  console.log('toBool("SIM"): ' + toBool("SIM"));
  console.log('toBool("sim"): ' + toBool("sim"));
  console.log('toBool("S"): ' + toBool("S"));
  console.log('toBool(false): ' + toBool(false));
  console.log('toBool(0): ' + toBool(0));
  console.log('toBool("NAO"): ' + toBool("NAO"));

  return 'Helpers testados';
}