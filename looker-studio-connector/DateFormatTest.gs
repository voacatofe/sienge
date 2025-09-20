/**
 * Script de Teste para Formatação de Datas
 * Valida as correções implementadas no conector Looker Studio
 */

// Copiar as funções auxiliares do Code-Gold.gs para teste
function toSafeNumber(value, defaultValue) {
  if (value === null || value === undefined || value === '') return null;
  var num = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return isFinite(num) ? num : null;
}

function toSafeInt(value, defaultValue) {
  if (value === null || value === undefined || value === '') return null;
  var num = parseInt(value, 10);
  return isFinite(num) ? num : null;
}

/**
 * Teste da função formatMonthForLooker
 */
function testFormatMonth() {
  console.log('=== TESTE formatMonthForLooker ===');

  var testCases = [
    { input: '2', expected: '02' },
    { input: '7', expected: '07' },
    { input: '9', expected: '09' },
    { input: '10', expected: '10' },
    { input: '12', expected: '12' },
    { input: 2, expected: '02' },
    { input: 12, expected: '12' },
    { input: '0', expected: null },
    { input: '13', expected: null },
    { input: null, expected: null },
    { input: '', expected: null },
    { input: 'abc', expected: null }
  ];

  var passed = 0;
  var failed = 0;

  testCases.forEach(function(test) {
    var result = formatMonthForLooker(test.input);
    if (result === test.expected) {
      console.log('✅ Input: ' + JSON.stringify(test.input) + ' => ' + JSON.stringify(result));
      passed++;
    } else {
      console.log('❌ Input: ' + JSON.stringify(test.input) + ' => Got: ' + JSON.stringify(result) + ', Expected: ' + JSON.stringify(test.expected));
      failed++;
    }
  });

  console.log('Resultado: ' + passed + ' passou, ' + failed + ' falhou\n');
  return failed === 0;
}

/**
 * Teste da função formatYearMonthForLooker
 */
function testFormatYearMonth() {
  console.log('=== TESTE formatYearMonthForLooker ===');

  var testCases = [
    { input: '2025-08', expected: '202508' },
    { input: '2025-7', expected: '202507' },
    { input: '2025-09', expected: '202509' },
    { input: '2025-2', expected: '202502' },
    { input: '2025-12', expected: '202512' },
    { input: '202508', expected: '202508' },
    { input: '202501', expected: '202501' },
    { input: '', expected: null },
    { input: null, expected: null },
    { input: 'null', expected: null },
    { input: '2025', expected: null },
    { input: 'invalid', expected: null }
  ];

  var passed = 0;
  var failed = 0;

  testCases.forEach(function(test) {
    var result = formatYearMonthForLooker(test.input);
    if (result === test.expected) {
      console.log('✅ Input: ' + JSON.stringify(test.input) + ' => ' + JSON.stringify(result));
      passed++;
    } else {
      console.log('❌ Input: ' + JSON.stringify(test.input) + ' => Got: ' + JSON.stringify(result) + ', Expected: ' + JSON.stringify(test.expected));
      failed++;
    }
  });

  console.log('Resultado: ' + passed + ' passou, ' + failed + ' falhou\n');
  return failed === 0;
}

/**
 * Teste da função formatDateForLooker
 */
function testFormatDate() {
  console.log('=== TESTE formatDateForLooker ===');

  var testCases = [
    // Formato YYYY-MM-DD (mais comum das APIs)
    { input: '2025-09-18', expected: '20250918' },
    { input: '2025-02-28', expected: '20250228' },
    { input: '2025-03-01', expected: '20250301' },
    { input: '2025-7-9', expected: '20250709' },
    { input: '2025-1-1', expected: '20250101' },

    // Formato com timestamp
    { input: '2025-08-01T00:00:00.000Z', expected: '20250801' },
    { input: '2025-09-19T22:38:16.048Z', expected: '20250919' },

    // Formato já correto
    { input: '20250918', expected: '20250918' },

    // Formato brasileiro
    { input: '18/09/2025', expected: '20250918' },
    { input: '01-01-2025', expected: '20250101' },

    // Valores inválidos
    { input: null, expected: null },
    { input: '', expected: null },
    { input: 'null', expected: null },
    { input: 'undefined', expected: null },
    { input: 'invalid', expected: null }
  ];

  var passed = 0;
  var failed = 0;

  testCases.forEach(function(test) {
    var result = formatDateForLooker(test.input);
    if (result === test.expected) {
      console.log('✅ Input: ' + JSON.stringify(test.input) + ' => ' + JSON.stringify(result));
      passed++;
    } else {
      console.log('❌ Input: ' + JSON.stringify(test.input) + ' => Got: ' + JSON.stringify(result) + ', Expected: ' + JSON.stringify(test.expected));
      failed++;
    }
  });

  console.log('Resultado: ' + passed + ' passou, ' + failed + ' falhou\n');
  return failed === 0;
}

/**
 * Teste com dados simulados das APIs
 */
function testWithApiData() {
  console.log('=== TESTE COM DADOS SIMULADOS DAS APIs ===\n');

  // Simular dados da API Financeiro
  var financeiroRecord = {
    ano: '2025',
    mes: '8',
    ano_mes: '2025-08',
    data_inicial: '2025-08-01T00:00:00.000Z',
    data_final: '2025-08-26T00:00:00.000Z'
  };

  console.log('API Financeiro:');
  console.log('ano: ' + financeiroRecord.ano + ' => ' + formatYearForLooker(financeiroRecord.ano));
  console.log('mes: ' + financeiroRecord.mes + ' => ' + formatMonthForLooker(financeiroRecord.mes));
  console.log('ano_mes: ' + financeiroRecord.ano_mes + ' => ' + formatYearMonthForLooker(financeiroRecord.ano_mes));
  console.log('data_inicial: ' + financeiroRecord.data_inicial + ' => ' + formatDateForLooker(financeiroRecord.data_inicial));
  console.log('data_final: ' + financeiroRecord.data_final + ' => ' + formatDateForLooker(financeiroRecord.data_final));
  console.log('');

  // Simular dados da API Vendas
  var vendasRecord = {
    data_principal: '2025-09-18',
    ano: '2025',
    mes: '9',
    ano_mes: '2025-09',
    data_contrato: '2025-09-18',
    data_entrega_prevista: '2028-08-30'
  };

  console.log('API Vendas:');
  console.log('data_principal: ' + vendasRecord.data_principal + ' => ' + formatDateForLooker(vendasRecord.data_principal));
  console.log('ano: ' + vendasRecord.ano + ' => ' + formatYearForLooker(vendasRecord.ano));
  console.log('mes: ' + vendasRecord.mes + ' => ' + formatMonthForLooker(vendasRecord.mes));
  console.log('ano_mes: ' + vendasRecord.ano_mes + ' => ' + formatYearMonthForLooker(vendasRecord.ano_mes));
  console.log('data_contrato: ' + vendasRecord.data_contrato + ' => ' + formatDateForLooker(vendasRecord.data_contrato));
  console.log('data_entrega_prevista: ' + vendasRecord.data_entrega_prevista + ' => ' + formatDateForLooker(vendasRecord.data_entrega_prevista));
  console.log('');

  // Simular dados da API Clientes
  var clientesRecord = {
    data_principal: '2025-02-28',
    ano: '2025',
    mes: '2',
    ano_mes: '2025-02',
    data_nascimento: '1950-10-28',
    data_cadastro: '2025-02-28',
    primeiro_contrato_data: '2025-03-01'
  };

  console.log('API Clientes:');
  console.log('data_principal: ' + clientesRecord.data_principal + ' => ' + formatDateForLooker(clientesRecord.data_principal));
  console.log('ano: ' + clientesRecord.ano + ' => ' + formatYearForLooker(clientesRecord.ano));
  console.log('mes: ' + clientesRecord.mes + ' => ' + formatMonthForLooker(clientesRecord.mes));
  console.log('ano_mes: ' + clientesRecord.ano_mes + ' => ' + formatYearMonthForLooker(clientesRecord.ano_mes));
  console.log('data_nascimento: ' + clientesRecord.data_nascimento + ' => ' + formatDateForLooker(clientesRecord.data_nascimento));
  console.log('data_cadastro: ' + clientesRecord.data_cadastro + ' => ' + formatDateForLooker(clientesRecord.data_cadastro));
  console.log('');
}

/**
 * Executar todos os testes
 */
function runAllDateTests() {
  console.log('==========================================');
  console.log('   TESTE COMPLETO DE FORMATAÇÃO DE DATAS');
  console.log('==========================================\n');

  var allPassed = true;

  // Teste individual de cada função
  allPassed = testFormatMonth() && allPassed;
  allPassed = testFormatYearMonth() && allPassed;
  allPassed = testFormatDate() && allPassed;

  // Teste com dados simulados das APIs
  testWithApiData();

  console.log('==========================================');
  if (allPassed) {
    console.log('🎉 TODOS OS TESTES PASSARAM! 🎉');
    console.log('As funções de formatação de data estão corrigidas.');
  } else {
    console.log('❌ ALGUNS TESTES FALHARAM');
    console.log('Verifique os erros acima.');
  }
  console.log('==========================================');

  return allPassed;
}

// Para executar no Google Apps Script
// Copie as funções formatDateForLooker, formatYearForLooker, formatMonthForLooker, formatYearMonthForLooker do Code-Gold.gs
// Então execute: runAllDateTests()