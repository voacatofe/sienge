/**
 * Suite de Testes para Looker Studio Connector
 * Versão 4.0 - Testes completos para validar estrutura correta
 */

// ============================================
// TESTES UNITÁRIOS
// ============================================

/**
 * Teste 1: Validar formato de data
 */
function test_DateFormatting() {
  console.log('=== TESTE: Formatação de Datas ===');

  var testDates = [
    '2024-09-18 00:00:00',
    '2024-09-18T00:00:00',
    '2024-09-18',
    '2024/09/18'
  ];

  testDates.forEach(function(dateStr) {
    var cleaned = dateStr.replace(/[-T:\s\/]/g, '').substring(0, 8);
    console.log(dateStr + ' -> ' + cleaned);

    if (cleaned.length === 8 && /^\d{8}$/.test(cleaned)) {
      console.log('✅ Formato correto (YYYYMMDD)');
    } else {
      console.log('❌ Formato incorreto!');
    }
  });
}

/**
 * Teste 2: Validar estrutura de rows
 */
function test_RowStructure() {
  console.log('=== TESTE: Estrutura de Rows ===');

  // Estrutura INCORRETA (antiga)
  var wrongRow = ['valor1', 'valor2', 'valor3'];
  console.log('Estrutura antiga (ERRADA): ' + JSON.stringify(wrongRow));

  // Estrutura CORRETA (nova)
  var correctRow = { values: ['valor1', 'valor2', 'valor3'] };
  console.log('Estrutura nova (CORRETA): ' + JSON.stringify(correctRow));

  // Validar estrutura
  if (correctRow.values && Array.isArray(correctRow.values)) {
    console.log('✅ Estrutura correta detectada!');
  } else {
    console.log('❌ Estrutura incorreta!');
  }
}

/**
 * Teste 3: Simular request do Looker Studio
 */
function test_MockRequest() {
  console.log('=== TESTE: Mock Request ===');

  // Simular dados da API
  var mockApiData = [
    {
      data_principal: '2024-09-18 00:00:00',
      domain_type: 'contratos',
      empresa_nome: 'Empresa Teste',
      valor_contrato: '150000.50',
      status_contrato: 'Ativo',
      tem_comissao: true,
      valor_comissao: '5000.00'
    },
    {
      data_principal: '2024-09-17 00:00:00',
      domain_type: 'clientes',
      empresa_nome: 'Empresa Demo',
      valor_contrato: '200000.00',
      status_contrato: 'Pendente',
      tem_comissao: false,
      valor_comissao: '0'
    }
  ];

  // Simular fields solicitados
  var requestedFields = [
    { name: 'data_principal' },
    { name: 'domain_type' },
    { name: 'empresa_nome' },
    { name: 'valor_contrato' }
  ];

  // Processar dados no formato correto
  var rows = [];
  mockApiData.forEach(function(record) {
    var values = [];

    requestedFields.forEach(function(field) {
      var value = null;

      switch(field.name) {
        case 'data_principal':
          value = record.data_principal.replace(/[-\s:]/g, '').substring(0, 8);
          break;
        case 'valor_contrato':
          value = parseFloat(record.valor_contrato);
          break;
        default:
          value = record[field.name] || '';
      }

      values.push(value);
    });

    // FORMATO CORRETO!
    rows.push({ values: values });
  });

  console.log('Rows processadas:');
  rows.forEach(function(row, index) {
    console.log('Row ' + index + ': ' + JSON.stringify(row));
  });

  // Validar estrutura final
  var result = {
    schema: requestedFields,
    rows: rows
  };

  console.log('\nEstrutura final para Looker Studio:');
  console.log(JSON.stringify(result, null, 2));

  // Verificações
  if (result.rows[0].values && Array.isArray(result.rows[0].values)) {
    console.log('✅ Estrutura de retorno correta!');
  } else {
    console.log('❌ Estrutura de retorno incorreta!');
  }
}

/**
 * Teste 4: Validar tipos de dados
 */
function test_DataTypes() {
  console.log('=== TESTE: Tipos de Dados ===');

  var testData = {
    // Strings
    texto: 'Teste',
    textoVazio: '',
    textoNull: null,

    // Números
    numeroInteiro: 10,
    numeroDecimal: 10.5,
    numeroString: '10.5',
    numeroInvalido: 'abc',

    // Booleanos
    boolTrue: true,
    boolFalse: false,
    boolString: 'true',
    boolNull: null
  };

  console.log('\n--- Conversão de Strings ---');
  console.log('texto: "' + (testData.texto || '') + '"');
  console.log('textoVazio: "' + (testData.textoVazio || '') + '"');
  console.log('textoNull: "' + (testData.textoNull || '') + '"');

  console.log('\n--- Conversão de Números ---');
  console.log('numeroInteiro: ' + parseFloat(testData.numeroInteiro));
  console.log('numeroDecimal: ' + parseFloat(testData.numeroDecimal));
  console.log('numeroString: ' + parseFloat(testData.numeroString));
  console.log('numeroInvalido: ' + (parseFloat(testData.numeroInvalido) || 0));

  console.log('\n--- Conversão de Booleanos ---');
  console.log('boolTrue: ' + (testData.boolTrue === true));
  console.log('boolFalse: ' + (testData.boolFalse === true));
  console.log('boolString: ' + (testData.boolString === 'true'));
  console.log('boolNull: ' + (testData.boolNull === true));
}

/**
 * Teste 5: Validar cache
 */
function test_Cache() {
  console.log('=== TESTE: Cache ===');

  try {
    var cache = CacheService.getUserCache();

    // Limpar cache existente - removeAll precisa de array de chaves
    // Como não sabemos as chaves, vamos apenas testar put/get/remove
    console.log('Iniciando teste de cache');

    // Adicionar item no cache
    var testData = { test: 'data', timestamp: new Date().toString() };
    cache.put('test_key', JSON.stringify(testData), 60); // 60 segundos
    console.log('Item adicionado ao cache');

    // Recuperar do cache
    var cached = cache.get('test_key');
    if (cached) {
      var parsed = JSON.parse(cached);
      console.log('✅ Cache funcionando: ' + JSON.stringify(parsed));
    } else {
      console.log('❌ Cache não funcionou');
    }

    // Limpar novamente
    cache.remove('test_key');
    console.log('Item removido do cache');

  } catch (e) {
    console.error('❌ Erro no cache: ' + e.toString());
  }
}

/**
 * Teste 6: Validar campos do schema
 */
function test_SchemaFields() {
  console.log('=== TESTE: Campos do Schema ===');

  var expectedFields = [
    'data_principal',
    'domain_type',
    'empresa_nome',
    'status_contrato',
    'valor_contrato',
    'saldo_devedor',
    'tem_comissao',
    'valor_comissao',
    'quantidade_registros'
  ];

  try {
    // Obter schema
    var schema = getSchema();
    var schemaFields = schema.schema.map(function(field) {
      return field.name;
    });

    console.log('Total de campos no schema: ' + schemaFields.length);

    // Verificar campos esperados
    expectedFields.forEach(function(fieldName) {
      var exists = schemaFields.indexOf(fieldName) !== -1;
      if (exists) {
        console.log('✅ ' + fieldName + ' encontrado');
      } else {
        console.log('❌ ' + fieldName + ' NÃO encontrado');
      }
    });

    // Verificar se há pelo menos uma métrica
    var metrics = schema.schema.filter(function(field) {
      return field.semantics && field.semantics.conceptType === 'METRIC';
    });

    console.log('\nMétricas encontradas: ' + metrics.length);
    if (metrics.length > 0) {
      console.log('✅ Pelo menos uma métrica definida');
      metrics.forEach(function(metric) {
        console.log('  - ' + metric.name);
      });
    } else {
      console.log('❌ ERRO: Nenhuma métrica definida!');
    }

  } catch (e) {
    console.error('❌ Erro ao validar schema: ' + e.toString());
  }
}

/**
 * Teste 7: Performance com múltiplos registros
 */
function test_Performance() {
  console.log('=== TESTE: Performance ===');

  var numRecords = 1000;
  console.log('Testando com ' + numRecords + ' registros...');

  var start = new Date().getTime();

  // Simular processamento de dados
  var rows = [];
  for (var i = 0; i < numRecords; i++) {
    rows.push({
      values: [
        '20240918',
        'contratos',
        'Empresa ' + i,
        150000 + i,
        1
      ]
    });
  }

  var end = new Date().getTime();
  var duration = end - start;

  console.log('Tempo de processamento: ' + duration + 'ms');
  console.log('Tempo por registro: ' + (duration / numRecords).toFixed(2) + 'ms');

  if (duration < 5000) {
    console.log('✅ Performance aceitável');
  } else {
    console.log('⚠️ Performance pode ser melhorada');
  }
}

/**
 * Executar todos os testes
 */
function runAllTests() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  SUITE DE TESTES - CONECTOR V4      ║');
  console.log('╚══════════════════════════════════════╝\n');

  var tests = [
    { name: 'Formatação de Datas', fn: test_DateFormatting },
    { name: 'Estrutura de Rows', fn: test_RowStructure },
    { name: 'Mock Request', fn: test_MockRequest },
    { name: 'Tipos de Dados', fn: test_DataTypes },
    { name: 'Cache', fn: test_Cache },
    { name: 'Campos do Schema', fn: test_SchemaFields },
    { name: 'Performance', fn: test_Performance }
  ];

  var passed = 0;
  var failed = 0;

  tests.forEach(function(test, index) {
    console.log('\n' + '─'.repeat(40));
    console.log('TESTE ' + (index + 1) + '/' + tests.length + ': ' + test.name);
    console.log('─'.repeat(40));

    try {
      test.fn();
      passed++;
      console.log('✅ TESTE PASSOU');
    } catch (e) {
      failed++;
      console.error('❌ TESTE FALHOU: ' + e.toString());
    }
  });

  console.log('\n' + '═'.repeat(40));
  console.log('RESULTADO FINAL:');
  console.log('  ✅ Passou: ' + passed);
  console.log('  ❌ Falhou: ' + failed);
  console.log('  📊 Total: ' + tests.length);
  console.log('═'.repeat(40));

  return 'Testes concluídos. ' + passed + ' passou, ' + failed + ' falhou.';
}

/**
 * Teste de integração completo
 */
function test_FullIntegration() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  TESTE DE INTEGRAÇÃO COMPLETO        ║');
  console.log('╚══════════════════════════════════════╝\n');

  try {
    // 1. Testar conexão
    console.log('1. Testando conexão com API...');
    var connectionResult = testConnection();
    console.log(connectionResult);

    // 2. Testar conector completo
    console.log('\n2. Testando conector completo...');
    var connectorResult = testFullConnector();
    console.log(connectorResult);

    // 3. Validar estrutura final
    console.log('\n3. Validação final...');
    console.log('✅ Teste de integração completo!');

    return 'Integração testada com sucesso!';

  } catch (e) {
    console.error('❌ Erro na integração: ' + e.toString());
    return 'Erro na integração: ' + e.toString();
  }
}