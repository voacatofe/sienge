/**
 * Script para testar a ordem de sincronização após correções
 * Verifica se empresas são sincronizadas antes de clientes
 */

const testSyncOrder = async () => {
  try {
    console.log('🧪 Iniciando teste de ordem de sincronização...');

    // Dados de teste com empresas e clientes
    const testData = {
      entities: ['companies', 'customers'],
    };

    console.log('📋 Entidades para sincronizar:', testData.entities);

    // Fazer requisição para a API de sincronização
    const response = await fetch('http://localhost:3000/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const result = await response.json();
    console.log(
      '✅ Resultado da sincronização:',
      JSON.stringify(result, null, 2)
    );

    // Verificar se a ordem foi respeitada
    if (result.processedEntities) {
      const processedOrder = result.processedEntities.map(e => e.entity);
      console.log('📊 Ordem de processamento:', processedOrder);

      const companiesIndex = processedOrder.indexOf('companies');
      const customersIndex = processedOrder.indexOf('customers');

      if (companiesIndex !== -1 && customersIndex !== -1) {
        if (companiesIndex < customersIndex) {
          console.log(
            '✅ SUCESSO: Empresas foram processadas antes dos clientes!'
          );
        } else {
          console.log(
            '❌ ERRO: Clientes foram processados antes das empresas!'
          );
        }
      }
    }
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
};

// Executar o teste
testSyncOrder();
