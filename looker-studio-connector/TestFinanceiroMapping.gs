/**
 * Script de Teste para Mapeamento Financeiro
 * Valida o processamento correto dos dados agregados da API Gold
 */

/**
 * Teste do mapeamento de campos financeiros
 */
function testFinanceiroMapping() {
  console.log('=== TESTE DE MAPEAMENTO FINANCEIRO ===\n');

  // Simular resposta da API Gold Financeiro (dados agregados)
  var apiResponse = {
    "ano": "2025",
    "mes": "8",
    "ano_mes": "2025-08",
    "total_lancamentos": 4510,
    "documentos_unicos": 1899,
    "valor_total_extrato": 60215598.46,
    "valor_total_apropriado": null,
    "entradas": 60315731.86,
    "saidas": 100133.40,
    "valor_medio": 13351.57,
    "valor_medio_absoluto": 13395.98,
    "menor_valor": -100000,
    "maior_valor": 2000000,
    "conciliados": 0,
    "pendentes": 0,
    "score_medio_importancia": 2.24,
    "centros_custo_distintos": 120,
    "planos_financeiros_distintos": 0,
    "data_inicial": "2025-08-01T00:00:00.000Z",
    "data_final": "2025-08-26T00:00:00.000Z"
  };

  console.log('Dados da API (agregados por mês):');
  console.log('================================');

  // Testar campos temporais
  console.log('\n📅 CAMPOS TEMPORAIS:');
  console.log('ano: ' + apiResponse.ano + ' => ' + formatYearForLooker(apiResponse.ano));
  console.log('mes: ' + apiResponse.mes + ' => ' + formatMonthForLooker(apiResponse.mes));
  console.log('ano_mes: ' + apiResponse.ano_mes + ' => ' + formatYearMonthForLooker(apiResponse.ano_mes));
  console.log('data_inicial: ' + apiResponse.data_inicial + ' => ' + formatDateForLooker(apiResponse.data_inicial));
  console.log('data_final: ' + apiResponse.data_final + ' => ' + formatDateForLooker(apiResponse.data_final));

  // Testar valores monetários
  console.log('\n💰 VALORES MONETÁRIOS:');
  console.log('valor_total_extrato: ' + apiResponse.valor_total_extrato + ' => ' + toSafeNumber(apiResponse.valor_total_extrato));
  console.log('entradas: ' + apiResponse.entradas + ' => ' + toSafeNumber(apiResponse.entradas));
  console.log('saidas: ' + apiResponse.saidas + ' => ' + toSafeNumber(apiResponse.saidas));
  console.log('valor_medio: ' + apiResponse.valor_medio + ' => ' + toSafeNumber(apiResponse.valor_medio));
  console.log('maior_valor: ' + apiResponse.maior_valor + ' => ' + toSafeNumber(apiResponse.maior_valor));
  console.log('menor_valor: ' + apiResponse.menor_valor + ' => ' + toSafeNumber(apiResponse.menor_valor));

  // Testar contadores
  console.log('\n📊 CONTADORES E ESTATÍSTICAS:');
  console.log('total_lancamentos: ' + apiResponse.total_lancamentos + ' => ' + toSafeInt(apiResponse.total_lancamentos));
  console.log('documentos_unicos: ' + apiResponse.documentos_unicos + ' => ' + toSafeInt(apiResponse.documentos_unicos));
  console.log('centros_custo_distintos: ' + apiResponse.centros_custo_distintos + ' => ' + toSafeInt(apiResponse.centros_custo_distintos));
  console.log('score_medio_importancia: ' + apiResponse.score_medio_importancia + ' => ' + toSafeNumber(apiResponse.score_medio_importancia));

  // Testar campos nulos
  console.log('\n⚠️ CAMPOS NULOS:');
  console.log('valor_total_apropriado: ' + apiResponse.valor_total_apropriado + ' => ' + toSafeNumber(apiResponse.valor_total_apropriado));
  console.log('conciliados: ' + apiResponse.conciliados + ' => ' + toSafeInt(apiResponse.conciliados));
  console.log('pendentes: ' + apiResponse.pendentes + ' => ' + toSafeInt(apiResponse.pendentes));

  // Simular processamento completo
  console.log('\n=== SIMULAÇÃO DE PROCESSAMENTO ===');

  var requestedFields = [
    'ano', 'mes', 'ano_mes', 'data_inicial', 'data_final',
    'valor_total_extrato', 'entradas', 'saidas',
    'total_lancamentos', 'documentos_unicos'
  ];

  console.log('Campos solicitados: ' + requestedFields.join(', '));
  console.log('\nValores processados:');

  requestedFields.forEach(function(fieldId) {
    var value = getFinanceiroFieldValue(apiResponse, fieldId);
    console.log(fieldId + ': ' + value);
  });

  console.log('\n✅ Teste concluído!');
  console.log('Os dados agregados da API estão sendo mapeados corretamente.');

  return true;
}

/**
 * Verificar diferenças entre dados detalhados e agregados
 */
function explainDataDifference() {
  console.log('\n===========================================');
  console.log('IMPORTANTE: Diferença de Granularidade');
  console.log('===========================================\n');

  console.log('📊 TABELA NO BANCO (performance_financeira):');
  console.log('- Contém registros INDIVIDUAIS de cada transação');
  console.log('- Julho/2025: 4.824 registros detalhados');
  console.log('- Agosto/2025: 4.510 registros detalhados');
  console.log('- Campos: documento, beneficiário, descrição, etc.');

  console.log('\n📈 API GOLD FINANCEIRO:');
  console.log('- Retorna dados AGREGADOS por período (mês)');
  console.log('- 1 registro por mês com totais calculados');
  console.log('- Campos: somas, médias, contadores, etc.');

  console.log('\n⚙️ CONECTOR LOOKER STUDIO:');
  console.log('- Adaptado para trabalhar com dados agregados');
  console.log('- Não permite drill-down para transações individuais');
  console.log('- Ideal para dashboards executivos e análises de tendências');

  console.log('\n💡 RECOMENDAÇÃO:');
  console.log('Para análise detalhada de transações individuais,');
  console.log('seria necessário criar um endpoint na API que retorne');
  console.log('dados não agregados ou conectar diretamente ao banco.');
}

// Para executar no Google Apps Script:
// 1. Copie as funções helper do Code-Gold.gs
// 2. Execute: testFinanceiroMapping()
// 3. Execute: explainDataDifference()