#!/usr/bin/env node

// Script para testar sincronização de entidades financeiras
const axios = require('axios');

async function testFinancialSync() {
  try {
    console.log('🏦 Testando sincronização de entidades financeiras...');
    console.log('');

    // Lista de entidades financeiras para testar
    const financialEntities = [
      'financialPlans', // Planos Financeiros (cadastro básico)
      'indexers', // Indexadores (cadastro básico)
      'receivableCarriers', // Portadores de Recebimento (cadastro básico)
      'salesContracts', // Contratos de Venda
      'receivables', // Títulos a Receber
      'payables', // Títulos a Pagar
      'salesCommissions', // Comissões de Venda
    ];

    const results = [];

    for (const entity of financialEntities) {
      console.log(`📊 Testando sincronização de: ${entity}`);

      const startTime = Date.now();

      try {
        const response = await axios.post('http://localhost:3000/api/sync', {
          entities: [entity],
        });

        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);

        const result = {
          entity,
          success: response.data.success,
          duration: `${duration}s`,
          totalProcessed: response.data.summary?.totalProcessed || 0,
          message: response.data.message,
        };

        if (response.data.results && response.data.results[0]) {
          result.endpoint = response.data.results[0].endpoint;
          result.count = response.data.results[0].count;
        }

        results.push(result);
        console.log(
          `  ✅ ${entity}: ${result.totalProcessed} registros em ${duration}s`
        );
      } catch (error) {
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);

        results.push({
          entity,
          success: false,
          duration: `${duration}s`,
          error: error.message,
          details: error.response?.data,
        });

        console.log(`  ❌ ${entity}: ERRO - ${error.message}`);
      }

      console.log('');

      // Aguardar um pouco entre as chamadas
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Resumo final
    console.log('📋 RESUMO DA SINCRONIZAÇÃO FINANCEIRA:');
    console.log('='.repeat(60));

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✅ Sucessos: ${successful.length}/${results.length}`);
    console.log(`❌ Falhas: ${failed.length}/${results.length}`);
    console.log('');

    if (successful.length > 0) {
      console.log('✅ SUCESSOS:');
      successful.forEach(result => {
        console.log(
          `  • ${result.entity}: ${result.totalProcessed || result.count || 0} registros`
        );
      });
      console.log('');
    }

    if (failed.length > 0) {
      console.log('❌ FALHAS:');
      failed.forEach(result => {
        console.log(`  • ${result.entity}: ${result.error}`);
      });
      console.log('');
    }

    console.log('📊 DETALHES COMPLETOS:');
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('❌ Erro geral no teste:', error.message);
  }
}

// Executar teste
testFinancialSync();
