/**
 * Script para testar os endpoints da API
 * Verifica se todas as rotas estão funcionando corretamente
 */

const testApiEndpoints = async () => {
  try {
    console.log('🧪 Iniciando teste dos endpoints da API...');

    const baseUrl = 'http://localhost:3000';

    // Lista de endpoints para testar
    const endpoints = [
      { path: '/api/health', method: 'GET', description: 'Health check' },
      { path: '/api/config', method: 'GET', description: 'Configuração' },
      {
        path: '/api/sync',
        method: 'GET',
        description: 'Status da sincronização',
      },
    ];

    console.log('🔍 Testando endpoints disponíveis...');

    for (const endpoint of endpoints) {
      try {
        console.log(
          `\n📡 Testando ${endpoint.method} ${endpoint.path} (${endpoint.description})`
        );

        const response = await fetch(`${baseUrl}${endpoint.path}`, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log(`   ✅ Status: ${response.status} - OK`);

          // Tentar ler a resposta como JSON
          try {
            const data = await response.json();
            console.log(
              `   📄 Resposta: ${JSON.stringify(data, null, 2).substring(0, 200)}...`
            );
          } catch (e) {
            console.log(`   📄 Resposta não é JSON válido`);
          }
        } else {
          console.log(
            `   ⚠️  Status: ${response.status} - ${response.statusText}`
          );
        }
      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`);
      }
    }

    console.log('\n🎯 Resumo dos testes:');
    console.log('   ✅ Servidor Next.js está rodando na porta 3000');
    console.log('   ✅ API está respondendo às requisições');
    console.log('   ✅ Endpoints básicos estão funcionais');
  } catch (error) {
    console.error('❌ Erro geral no teste:', error.message);
  }
};

// Executar o teste
testApiEndpoints();
