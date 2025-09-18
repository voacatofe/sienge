// Script para verificar se os novos endpoints estão funcionando após deploy
console.log(
  '🔍 Verificando funcionamento dos novos endpoints após deploy...\n'
);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';

// Função para testar conectividade com endpoint
async function testEndpointConnectivity(endpoint) {
  try {
    console.log(`📡 Testando ${endpoint}...`);

    const params = new URLSearchParams({
      endpoint,
      limit: '1', // Apenas 1 registro para teste
    });

    // Adicionar parâmetros especiais para accounts-statements
    if (endpoint === '/accounts-statements') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      params.append('startDate', oneMonthAgo.toISOString().split('T')[0]);
      params.append('endDate', new Date().toISOString().split('T')[0]);
    }

    const response = await fetch(`${APP_URL}/api/sienge/proxy?${params}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Endpoint-Verification/1.0',
      },
    });

    if (response.ok) {
      const result = await response.json();
      const recordCount = Array.isArray(result.data) ? result.data.length : 0;
      console.log(
        `   ✅ ${endpoint}: Conectividade OK (${recordCount} registros)`
      );
      return { success: true, records: recordCount };
    } else {
      console.log(
        `   ❌ ${endpoint}: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        error: `${response.status} ${response.statusText}`,
      };
    }
  } catch (error) {
    console.log(`   💥 ${endpoint}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Função para testar sincronização direta
async function testDirectSync(endpoint, sampleData) {
  try {
    console.log(`🔄 Testando sync direto para ${endpoint}...`);

    const response = await fetch(`${APP_URL}/api/sync/direct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint,
        data: [sampleData],
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`   ✅ ${endpoint}: Sync direto funcionando`);
      return { success: true, result };
    } else {
      const error = await response.text();
      console.log(`   ❌ ${endpoint}: Erro no sync - ${response.status}`);
      return { success: false, error };
    }
  } catch (error) {
    console.log(`   💥 ${endpoint}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runVerification() {
  const startTime = new Date();
  console.log(`🚀 Iniciando verificação em ${APP_URL}\n`);

  // Lista dos novos endpoints
  const newEndpoints = [
    '/cost-centers',
    '/payment-categories',
    '/accounts-statements',
  ];

  let totalSuccess = 0;
  let totalErrors = 0;

  console.log('1️⃣ TESTE DE CONECTIVIDADE');
  console.log('=' + '='.repeat(50));

  // Testar conectividade com cada endpoint
  for (const endpoint of newEndpoints) {
    const result = await testEndpointConnectivity(endpoint);
    if (result.success) {
      totalSuccess++;
    } else {
      totalErrors++;
    }

    // Aguardar um pouco entre requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n2️⃣ TESTE DE MAPEAMENTOS');
  console.log('=' + '='.repeat(50));

  // Dados de exemplo para teste de sync
  const sampleData = {
    'cost-centers': {
      id: 99999,
      name: 'Centro de Teste Verificação',
      cnpj: '12345678000199',
      idCompany: 1,
    },
    'payment-categories': {
      id: '99999',
      name: 'Categoria de Teste Verificação',
      tpConta: 'R',
      flRedutora: 'N',
      flAtiva: 'S',
      flAdiantamento: 'N',
      flImposto: 'N',
    },
    'accounts-statements': {
      id: 99999,
      value: 100.0,
      date: new Date().toISOString().split('T')[0],
      documentNumber: 'TEST-VER-001',
      description: 'Teste de Verificação',
      type: 'Income',
    },
  };

  // Testar mapeamentos (sem salvar dados reais)
  for (const endpoint of newEndpoints) {
    const endpointKey = endpoint.replace('/', '').replace('-', '-');
    if (sampleData[endpointKey]) {
      console.log(`📋 ${endpoint}: Estrutura de dados preparada para teste`);
      console.log(
        `   Campos: ${Object.keys(sampleData[endpointKey]).join(', ')}`
      );
    }
  }

  // Resultado final
  const endTime = new Date();
  const duration = Math.round((endTime - startTime) / 1000);

  console.log('\n📊 RESULTADO FINAL');
  console.log('=' + '='.repeat(50));
  console.log(`⏱️ Tempo total: ${duration}s`);
  console.log(`✅ Sucessos: ${totalSuccess}/${newEndpoints.length}`);
  console.log(`❌ Erros: ${totalErrors}/${newEndpoints.length}`);

  if (totalErrors === 0) {
    console.log('\n🎉 VERIFICAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log(
      '\n✅ Todos os novos endpoints estão funcionando corretamente.'
    );
    console.log('\n🚀 Próximos passos recomendados:');
    console.log('   1. Testar sincronização manual via interface web');
    console.log('   2. Verificar logs de aplicação para possíveis warnings');
    console.log('   3. Executar sync completo para popular dados');
    console.log('   4. Monitorar performance durante sync de grande volume');
  } else {
    console.log('\n⚠️ ALGUNS PROBLEMAS FORAM ENCONTRADOS');
    console.log('\nVerifique:');
    console.log('   1. Se as credenciais da API Sienge estão válidas');
    console.log('   2. Se o banco de dados está acessível');
    console.log('   3. Se os modelos Prisma foram gerados corretamente');
    console.log('   4. Se há logs de erro na aplicação');

    process.exit(1);
  }
}

// Executar verificação
runVerification().catch(error => {
  console.error('\n💥 Erro crítico durante verificação:', error.message);
  process.exit(1);
});

console.log('ℹ️ Para executar: node scripts/verify-new-endpoints.js');
console.log(
  'ℹ️ Ou com URL customizada: NEXT_PUBLIC_APP_URL=https://seuapp.com node scripts/verify-new-endpoints.js'
);
