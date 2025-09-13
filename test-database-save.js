#!/usr/bin/env node

// Script para testar se o salvamento no banco está funcionando
const axios = require('axios');

async function checkDatabase() {
  try {
    console.log('🔍 Verificando dados no banco...');

    // Simular uma verificação via API (se houver endpoint)
    const response = await axios.get(
      'http://localhost:3000/api/data/customers',
      {
        params: { limit: 5 },
      }
    );

    console.log(
      '📊 Primeiros 5 clientes no banco:',
      JSON.stringify(response.data, null, 2)
    );
  } catch (error) {
    console.log(
      'ℹ️ Endpoint de consulta não disponível, verifique diretamente no banco'
    );
    console.log(
      '💡 Use o Adminer em http://localhost:8080 para verificar a tabela "clientes"'
    );
  }
}

async function testSyncAndCheck() {
  try {
    console.log('🧪 Iniciando teste completo...');
    console.log('');

    // 1. Executar sincronização
    console.log('1️⃣ Executando sincronização...');
    const syncResponse = await axios.post('http://localhost:3000/api/sync', {
      entities: ['customers'],
    });

    console.log('✅ Sincronização concluída:', {
      success: syncResponse.data.success,
      totalProcessed: syncResponse.data.summary?.totalProcessed || 0,
      message: syncResponse.data.message,
    });
    console.log('');

    // 2. Aguardar um pouco para garantir que os dados foram salvos
    console.log('2️⃣ Aguardando salvamento...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('');

    // 3. Verificar dados no banco
    console.log('3️⃣ Verificando dados salvos...');
    await checkDatabase();
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    if (error.response?.data) {
      console.error(
        '📝 Detalhes:',
        JSON.stringify(error.response.data, null, 2)
      );
    }
  }
}

// Executar teste
testSyncAndCheck();
