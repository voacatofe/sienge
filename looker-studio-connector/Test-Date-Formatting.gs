/**
 * Teste das Funções de Formatação de Data
 * Para verificar se as correções estão funcionando
 */

/**
 * Copiar as funções do Code-Gold.gs para teste
 */

/**
 * Formatar data para Looker Studio (YYYYMMDD)
 */
function formatDateForLooker(dateValue) {
  if (!dateValue || dateValue === '' || dateValue === 'null' || dateValue === 'undefined') {
    return null;
  }

  try {
    var dateStr = String(dateValue).trim();

    // Se já está no formato YYYYMMDD correto
    if (/^\d{8}$/.test(dateStr)) {
      return dateStr;
    }

    // Se está em formato timestamp "YYYY-MM-DD HH:MM:SS" ou "YYYY-MM-DD"
    var timestampMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (timestampMatch) {
      var year = timestampMatch[1];
      var month = timestampMatch[2];
      var day = timestampMatch[3];
      return year + month + day;
    }

    // Extrair números para tentar formar YYYYMMDD
    var numbers = dateStr.replace(/[^\d]/g, '');
    if (numbers.length >= 8) {
      var candidate = numbers.substring(0, 8);
      // Validar se é uma data válida (ano >= 1900, mês 01-12, dia 01-31)
      var year = parseInt(candidate.substring(0, 4));
      var month = parseInt(candidate.substring(4, 6));
      var day = parseInt(candidate.substring(6, 8));

      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        return candidate;
      }
    }

    // Tentar parser como Date object
    var date = new Date(dateStr);
    if (!isNaN(date.getTime()) && date.getFullYear() >= 1900) {
      var year = date.getFullYear();
      var month = ('0' + (date.getMonth() + 1)).slice(-2);
      var day = ('0' + date.getDate()).slice(-2);
      return year + month + day;
    }

    console.log('Data inválida ignorada: ' + dateValue);
    return null;

  } catch (e) {
    console.log('Erro ao formatar data: ' + dateValue + ' - ' + e.toString());
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

  var month = parseInt(monthValue);
  if (isNaN(month) || month < 1 || month > 12) return null;

  return month < 10 ? '0' + month : String(month);
}

/**
 * Formatar ano_mês para Looker Studio (YYYYMM)
 */
function formatYearMonthForLooker(yearMonthValue) {
  if (!yearMonthValue || yearMonthValue === '' || yearMonthValue === 'null') return null;

  var yearMonthStr = String(yearMonthValue).trim();

  // Se está no formato "YYYY-MM", remover o hífen
  var hyphenMatch = yearMonthStr.match(/^(\d{4})-(\d{2})$/);
  if (hyphenMatch) {
    return hyphenMatch[1] + hyphenMatch[2];
  }

  // Se já está no formato YYYYMM
  if (/^\d{6}$/.test(yearMonthStr)) {
    return yearMonthStr;
  }

  return null;
}

/**
 * Testar formatação com dados reais do banco
 */
function testDateFormatting() {
  console.log('=== TESTE DE FORMATAÇÃO DE DATAS ===');

  // Dados simulados do banco conforme visto na consulta
  var sampleRecord = {
    data_principal: '2024-01-15 00:00:00',
    ano: 2024,
    mes: 1,
    ano_mes: '2024-01'
  };

  console.log('Dados de entrada:', JSON.stringify(sampleRecord, null, 2));
  console.log('');

  // Testar formatDateForLooker
  var formattedDate = formatDateForLooker(sampleRecord.data_principal);
  console.log('data_principal:', sampleRecord.data_principal, '-> formatDateForLooker:', formattedDate);
  console.log('✓ Esperado: 20240115, Resultado:', formattedDate, formattedDate === '20240115' ? '✅ OK' : '❌ ERRO');

  // Testar formatYearForLooker
  var formattedYear = formatYearForLooker(sampleRecord.ano);
  console.log('ano:', sampleRecord.ano, '-> formatYearForLooker:', formattedYear);
  console.log('✓ Esperado: 2024, Resultado:', formattedYear, formattedYear === '2024' ? '✅ OK' : '❌ ERRO');

  // Testar formatMonthForLooker
  var formattedMonth = formatMonthForLooker(sampleRecord.mes);
  console.log('mes:', sampleRecord.mes, '-> formatMonthForLooker:', formattedMonth);
  console.log('✓ Esperado: 01, Resultado:', formattedMonth, formattedMonth === '01' ? '✅ OK' : '❌ ERRO');

  // Testar formatYearMonthForLooker
  var formattedYearMonth = formatYearMonthForLooker(sampleRecord.ano_mes);
  console.log('ano_mes:', sampleRecord.ano_mes, '-> formatYearMonthForLooker:', formattedYearMonth);
  console.log('✓ Esperado: 202401, Resultado:', formattedYearMonth, formattedYearMonth === '202401' ? '✅ OK' : '❌ ERRO');

  console.log('');
  console.log('=== TESTE COM SEGUNDO REGISTRO ===');

  var sampleRecord2 = {
    data_principal: '2024-09-19 00:00:00',
    ano: 2024,
    mes: 9,
    ano_mes: '2024-09'
  };

  console.log('Dados de entrada:', JSON.stringify(sampleRecord2, null, 2));
  console.log('');

  var formattedDate2 = formatDateForLooker(sampleRecord2.data_principal);
  console.log('data_principal:', sampleRecord2.data_principal, '-> formatDateForLooker:', formattedDate2);
  console.log('✓ Esperado: 20240919, Resultado:', formattedDate2, formattedDate2 === '20240919' ? '✅ OK' : '❌ ERRO');

  var formattedMonth2 = formatMonthForLooker(sampleRecord2.mes);
  console.log('mes:', sampleRecord2.mes, '-> formatMonthForLooker:', formattedMonth2);
  console.log('✓ Esperado: 09, Resultado:', formattedMonth2, formattedMonth2 === '09' ? '✅ OK' : '❌ ERRO');

  var formattedYearMonth2 = formatYearMonthForLooker(sampleRecord2.ano_mes);
  console.log('ano_mes:', sampleRecord2.ano_mes, '-> formatYearMonthForLooker:', formattedYearMonth2);
  console.log('✓ Esperado: 202409, Resultado:', formattedYearMonth2, formattedYearMonth2 === '202409' ? '✅ OK' : '❌ ERRO');

  console.log('');
  console.log('=== TESTE DE CASOS EXTREMOS ===');

  // Testar null/undefined
  console.log('Teste null: formatDateForLooker(null) =', formatDateForLooker(null));
  console.log('Teste undefined: formatYearForLooker(undefined) =', formatYearForLooker(undefined));
  console.log('Teste string vazia: formatMonthForLooker("") =', formatMonthForLooker(''));

  // Testar valores inválidos
  console.log('Teste mês inválido: formatMonthForLooker(13) =', formatMonthForLooker(13));
  console.log('Teste ano inválido: formatYearForLooker(1800) =', formatYearForLooker(1800));

  console.log('=== FIM DOS TESTES ===');
}

// Executar teste automaticamente
testDateFormatting();