#!/usr/bin/env node

// Script de teste rápido para verificar a sincronização de customers
// Execute: node test-customers-sync.js

const axios = require('axios');

async function testCustomersSync() {
  try {
    console.log('🧪 Testando sincronização de customers...');
    console.log('📅 Buscando apenas dados do último ano');
    console.log('⏱️ Timeout: 10 minutos');
    console.log('📄 Máximo: 50 páginas / 10.000 registros');
    console.log('');

    const startTime = Date.now();

    const response = await axios.post('http://localhost:3000/api/sync', {
      entities: ['customers'],
    });

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('✅ Resultado do teste:');
    console.log(`⏱️ Duração: ${duration} segundos`);
    console.log('📊 Resultados:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    if (error.response) {
      console.error('📝 Detalhes:', error.response.data);
    }
  }
}

// Executar teste
testCustomersSync();
