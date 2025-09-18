/**
 * Sienge Looker Studio Connector - VERSÃO SIMPLIFICADA
 * Versão 4.0 SIMPLE - Mínima para testes
 *
 * FOCO: Resolver erro de estrutura com código mínimo
 */

// Configuração
var API_URL = 'https://conector.catometrics.com.br/api/datawarehouse/master';

// ============================================
// FUNÇÕES OBRIGATÓRIAS
// ============================================

function getAuthType() {
  return { type: 'NONE' };
}

function getConfig() {
  return { configParams: [] };
}

function getSchema() {
  var cc = DataStudioApp.createCommunityConnector();
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;

  // Campos mínimos para teste
  fields.newDimension()
    .setId('data_principal')
    .setName('Data Principal')
    .setType(types.YEAR_MONTH_DAY);

  fields.newDimension()
    .setId('empresa_nome')
    .setName('Empresa')
    .setType(types.TEXT);

  fields.newDimension()
    .setId('domain_type')
    .setName('Tipo')
    .setType(types.TEXT);

  // IMPORTANTE: Pelo menos uma métrica!
  fields.newMetric()
    .setId('valor_contrato')
    .setName('Valor')
    .setType(types.CURRENCY_BRL)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('contador')
    .setName('Quantidade')
    .setType(types.NUMBER)
    .setAggregation(aggregations.COUNT);

  return { schema: fields.build() };
}

function getData(request) {
  console.log('getData chamado com', request.fields.length, 'campos');

  try {
    // Buscar dados da API
    var response = UrlFetchApp.fetch(API_URL, {
      method: 'GET',
      muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
      throw new Error('API erro: ' + response.getResponseCode());
    }

    var data = JSON.parse(response.getContentText());

    if (!data.success || !data.data) {
      return {
        schema: request.fields,
        rows: []
      };
    }

    // FORMATO CRÍTICO: Cada row DEVE ter { values: [...] }
    var rows = [];

    // Processar no máximo 100 registros para teste
    var records = data.data.slice(0, 100);

    records.forEach(function(record) {
      var values = [];

      request.fields.forEach(function(field) {
        var value = null;

        switch(field.name) {
          case 'data_principal':
            // YYYYMMDD format obrigatório
            if (record.data_principal) {
              value = String(record.data_principal)
                .replace(/[-T:\s]/g, '')
                .substring(0, 8);
            }
            break;

          case 'empresa_nome':
            value = record.empresa_nome || 'N/A';
            break;

          case 'domain_type':
            value = record.domain_type || 'N/A';
            break;

          case 'valor_contrato':
            value = parseFloat(record.valor_contrato || 0);
            break;

          case 'contador':
            value = 1;
            break;

          default:
            value = null;
        }

        values.push(value);
      });

      // ESTRUTURA CORRETA!
      rows.push({ values: values });
    });

    console.log('Retornando', rows.length, 'linhas');

    return {
      schema: request.fields,
      rows: rows
    };

  } catch (e) {
    console.error('Erro:', e.toString());

    DataStudioApp.createCommunityConnector()
      .newUserError()
      .setText('Erro ao buscar dados: ' + e.toString())
      .throwException();
  }
}

function isAdminUser() {
  return false;
}

// ============================================
// FUNÇÕES DE TESTE
// ============================================

function testSimple() {
  console.log('=== TESTE SIMPLES ===');

  // 1. Testar API
  var response = UrlFetchApp.fetch(API_URL);
  var data = JSON.parse(response.getContentText());
  console.log('API OK:', data.success);
  console.log('Registros:', data.data.length);

  // 2. Testar getData
  var request = {
    fields: [
      { name: 'data_principal' },
      { name: 'empresa_nome' },
      { name: 'valor_contrato' }
    ]
  };

  var result = getData(request);
  console.log('Rows:', result.rows.length);

  // 3. Validar estrutura
  if (result.rows[0] && result.rows[0].values) {
    console.log('✅ ESTRUTURA CORRETA!');
    console.log('Primeira row:', JSON.stringify(result.rows[0]));
  } else {
    console.log('❌ ESTRUTURA ERRADA!');
  }

  return 'Teste completo';
}