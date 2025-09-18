/**
 * Testes específicos para V5 Production
 * Valida todos os campos e estrutura
 */

/**
 * Teste do Schema V5
 */
function test_V5_Schema() {
  console.log('=== TESTE SCHEMA V5 ===');

  // Obter schema da V5
  var schema = getSchema();
  var fields = schema.schema;

  console.log('Total de campos: ' + fields.length);

  // Listar todos os campos
  console.log('\nCAMPOS DISPONÍVEIS:');
  fields.forEach(function(field) {
    var tipo = field.conceptType || field.semantics?.conceptType || 'UNKNOWN';
    console.log('- ' + field.name + ' (' + tipo + ')');
  });

  // Contar métricas e dimensões
  var metrics = 0;
  var dimensions = 0;

  fields.forEach(function(field) {
    if (field.conceptType === 'METRIC' ||
        (field.semantics && field.semantics.conceptType === 'METRIC')) {
      metrics++;
    } else {
      dimensions++;
    }
  });

  console.log('\nRESUMO:');
  console.log('Dimensões: ' + dimensions);
  console.log('Métricas: ' + metrics);

  if (metrics > 0) {
    console.log('✅ Tem métricas definidas');
  } else {
    console.log('❌ ERRO: Sem métricas!');
  }

  return 'Schema V5: ' + fields.length + ' campos (' + dimensions + ' dim, ' + metrics + ' met)';
}

/**
 * Teste de getData V5
 */
function test_V5_GetData() {
  console.log('=== TESTE GETDATA V5 ===');

  // Simular request do Looker
  var request = {
    fields: [
      { name: 'data_principal' },
      { name: 'domain_type' },
      { name: 'empresa_nome' },
      { name: 'status_contrato' },
      { name: 'valor_contrato' },
      { name: 'quantidade_registros' }
    ]
  };

  console.log('Solicitando ' + request.fields.length + ' campos...');

  try {
    var result = getData(request);

    console.log('Resposta recebida:');
    console.log('- Schema: ' + result.schema.length + ' campos');
    console.log('- Rows: ' + result.rows.length + ' linhas');

    if (result.rows.length > 0) {
      var firstRow = result.rows[0];

      // Validar estrutura
      if (firstRow.values && Array.isArray(firstRow.values)) {
        console.log('✅ Estrutura correta ({ values: [...] })');
        console.log('Valores na primeira linha: ' + firstRow.values.length);
        console.log('Amostra: ' + JSON.stringify(firstRow.values));

        // Validar quantidade de valores
        if (firstRow.values.length === request.fields.length) {
          console.log('✅ Número de valores corresponde aos campos');
        } else {
          console.log('❌ ERRO: ' + firstRow.values.length + ' valores, esperado ' + request.fields.length);
        }
      } else {
        console.log('❌ ERRO: Estrutura incorreta!');
      }
    }

    return 'getData OK: ' + result.rows.length + ' linhas';

  } catch (e) {
    console.error('❌ Erro: ' + e.toString());
    return 'Erro: ' + e.toString();
  }
}

/**
 * Teste de campos específicos V5
 */
function test_V5_Fields() {
  console.log('=== TESTE DE CAMPOS V5 ===');

  var camposEsperados = [
    // Dimensões
    'data_principal',
    'domain_type',
    'empresa_nome',
    'status_contrato',
    'tipo_contrato',
    'numero_contrato',
    'forma_pagamento',
    'cliente_principal',
    'empreendimento_nome',
    'ano',
    'mes',
    'contratos_ativos',
    'tem_comissao',
    'tem_financiamento',

    // Métricas
    'valor_contrato',
    'saldo_devedor',
    'valor_comissao',
    'total_parcelas',
    'parcelas_pagas',
    'quantidade_registros'
  ];

  var schema = getSchema();
  var camposReais = schema.schema.map(function(f) { return f.name; });

  console.log('Verificando ' + camposEsperados.length + ' campos esperados...\n');

  var encontrados = 0;
  var faltando = [];

  camposEsperados.forEach(function(campo) {
    if (camposReais.indexOf(campo) !== -1) {
      console.log('✅ ' + campo);
      encontrados++;
    } else {
      console.log('❌ ' + campo + ' (FALTANDO)');
      faltando.push(campo);
    }
  });

  console.log('\nRESULTADO:');
  console.log('Encontrados: ' + encontrados + '/' + camposEsperados.length);

  if (faltando.length > 0) {
    console.log('Faltando: ' + faltando.join(', '));
  }

  return encontrados === camposEsperados.length ?
    '✅ Todos os campos OK!' :
    '⚠️ Faltam ' + faltando.length + ' campos';
}

/**
 * Teste de formatação de datas V5
 */
function test_V5_DateFormat() {
  console.log('=== TESTE DE FORMATAÇÃO DE DATAS V5 ===');

  var testDates = [
    '2024-09-18 00:00:00',
    '2024-09-18T10:30:00',
    '2024/09/18',
    '18/09/2024',
    '2024-09-18'
  ];

  console.log('Testando formatDateForLooker():\n');

  testDates.forEach(function(date) {
    var formatted = formatDateForLooker(date);
    var isValid = formatted && formatted.length === 8 && /^\d{8}$/.test(formatted);

    console.log(date + ' -> ' + formatted + ' ' + (isValid ? '✅' : '❌'));
  });

  return 'Formatação testada';
}

/**
 * Executar todos os testes V5
 */
function runAllTests_V5() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║     TESTES COMPLETOS - V5 PRODUCTION   ║');
  console.log('╚════════════════════════════════════════╝\n');

  var tests = [
    { name: 'Schema V5', fn: test_V5_Schema },
    { name: 'GetData V5', fn: test_V5_GetData },
    { name: 'Campos V5', fn: test_V5_Fields },
    { name: 'Formatação de Datas', fn: test_V5_DateFormat }
  ];

  var results = [];

  tests.forEach(function(test, index) {
    console.log('\n' + '━'.repeat(40));
    console.log('TESTE ' + (index + 1) + ': ' + test.name);
    console.log('━'.repeat(40));

    try {
      var result = test.fn();
      results.push({ name: test.name, status: '✅', result: result });
    } catch (e) {
      results.push({ name: test.name, status: '❌', result: e.toString() });
      console.error('❌ Erro: ' + e.toString());
    }
  });

  console.log('\n' + '═'.repeat(40));
  console.log('RESUMO DOS TESTES V5:');
  console.log('═'.repeat(40));

  results.forEach(function(r) {
    console.log(r.status + ' ' + r.name + ': ' + r.result);
  });

  console.log('═'.repeat(40));

  return 'Testes V5 concluídos';
}

/**
 * Teste rápido de validação
 */
function quickTest_V5() {
  console.log('=== TESTE RÁPIDO V5 ===\n');

  // 1. Conexão
  console.log('1. Testando conexão...');
  var conn = testConnection();
  console.log('   ' + conn);

  // 2. Estrutura
  console.log('\n2. Testando estrutura...');
  var struct = testFullStructure();
  console.log('   ' + struct);

  console.log('\n=== FIM DO TESTE RÁPIDO ===');

  return conn.indexOf('OK') !== -1 && struct.indexOf('PERFEITA') !== -1 ?
    '✅ V5 PRONTA PARA PRODUÇÃO!' :
    '⚠️ Verificar problemas';
}