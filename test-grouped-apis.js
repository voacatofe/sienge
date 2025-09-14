#!/usr/bin/env node

// Script para testar as novas APIs agrupadas por entidade
const axios = require('axios');

async function testGroupedAPIs() {
  try {
    console.log('🏗️  Testando APIs Agrupadas por Entidade...');
    console.log('');

    const results = [];

    // 1. Testar API Grupo Financeiro
    console.log('💰 TESTANDO GRUPO FINANCEIRO (/api/data/financial)');
    console.log('='.repeat(60));

    // Resumo financeiro
    await testEndpoint({
      name: 'Resumo Financeiro',
      url: 'http://localhost:3000/api/data/financial',
      results,
    });

    // Entidades financeiras específicas
    const financialEntities = [
      'receivables',
      'payables',
      'sales-contracts',
      'sales-commissions',
      'financial-plans',
      'indexers',
      'receivable-carriers',
    ];

    for (const entity of financialEntities) {
      await testEndpoint({
        name: `Financeiro - ${entity}`,
        url: `http://localhost:3000/api/data/financial?type=${entity}&limit=10`,
        results,
      });
    }

    console.log('');

    // 2. Testar API Grupo Cadastros Básicos
    console.log('📋 TESTANDO GRUPO CADASTROS BÁSICOS (/api/data/registries)');
    console.log('='.repeat(60));

    // Resumo cadastros básicos
    await testEndpoint({
      name: 'Resumo Cadastros Básicos',
      url: 'http://localhost:3000/api/data/registries',
      results,
    });

    // Entidades de cadastros básicos
    const registryEntities = [
      'companies',
      'departments',
      'cost-centers',
      'property-types',
      'parameters',
    ];

    for (const entity of registryEntities) {
      await testEndpoint({
        name: `Cadastros - ${entity}`,
        url: `http://localhost:3000/api/data/registries?type=${entity}&limit=10`,
        results,
      });
    }

    console.log('');

    // 3. Testar API Grupo Clientes
    console.log('👥 TESTANDO GRUPO CLIENTES (/api/data/customers-group)');
    console.log('='.repeat(60));

    // Resumo grupo clientes
    await testEndpoint({
      name: 'Resumo Grupo Clientes',
      url: 'http://localhost:3000/api/data/customers-group',
      results,
    });

    // Entidades do grupo clientes
    const customerEntities = [
      'customers',
      'creditors',
      'customer-types',
      'marital-status',
      'professions',
    ];

    for (const entity of customerEntities) {
      await testEndpoint({
        name: `Clientes - ${entity}`,
        url: `http://localhost:3000/api/data/customers-group?type=${entity}&limit=10`,
        results,
      });
    }

    console.log('');

    // 4. Testar funcionalidades de busca e filtros
    console.log('🔍 TESTANDO FUNCIONALIDADES DE BUSCA');
    console.log('='.repeat(60));

    const searchTests = [
      {
        name: 'Busca Clientes por nome',
        url: 'http://localhost:3000/api/data/customers-group?type=customers&search=silva&limit=5',
      },
      {
        name: 'Busca Títulos a Receber por status',
        url: 'http://localhost:3000/api/data/financial?type=receivables&status=PENDENTE&limit=5',
      },
      {
        name: 'Busca Empresas por CNPJ',
        url: 'http://localhost:3000/api/data/registries?type=companies&search=12345&limit=5',
      },
    ];

    for (const test of searchTests) {
      await testEndpoint({
        name: test.name,
        url: test.url,
        results,
      });
    }

    console.log('');

    // 5. Testar paginação
    console.log('📄 TESTANDO PAGINAÇÃO');
    console.log('='.repeat(60));

    const paginationTests = [
      {
        name: 'Clientes - Página 1',
        url: 'http://localhost:3000/api/data/customers-group?type=customers&page=1&limit=5',
      },
      {
        name: 'Clientes - Página 2',
        url: 'http://localhost:3000/api/data/customers-group?type=customers&page=2&limit=5',
      },
    ];

    for (const test of paginationTests) {
      await testEndpoint({
        name: test.name,
        url: test.url,
        results,
      });
    }

    // Resumo final
    console.log('');
    console.log('📊 RESUMO DOS TESTES DE APIS AGRUPADAS');
    console.log('='.repeat(60));

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✅ Sucessos: ${successful.length}/${results.length}`);
    console.log(`❌ Falhas: ${failed.length}/${results.length}`);
    console.log('');

    if (successful.length > 0) {
      console.log('✅ SUCESSOS:');
      successful.forEach(result => {
        const dataCount =
          result.data?.data?.length || result.data?.summary ? 'OK' : '0';
        console.log(
          `  • ${result.name}: ${dataCount} registros em ${result.duration}`
        );
      });
      console.log('');
    }

    if (failed.length > 0) {
      console.log('❌ FALHAS:');
      failed.forEach(result => {
        console.log(`  • ${result.name}: ${result.error}`);
      });
      console.log('');
    }

    // Análise da estrutura das APIs
    console.log('🏗️  ANÁLISE DAS ESTRUTURAS DE API:');
    console.log('='.repeat(60));

    const summaryAPIs = successful.filter(r => r.name.includes('Resumo'));
    summaryAPIs.forEach(api => {
      console.log(`📋 ${api.name}:`);
      if (api.data?.availableTypes) {
        console.log(
          `  - Tipos disponíveis: ${api.data.availableTypes.join(', ')}`
        );
      }
      if (api.data?.meta?.group) {
        console.log(`  - Grupo: ${api.data.meta.group}`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('❌ Erro geral no teste:', error.message);
  }
}

async function testEndpoint({ name, url, results }) {
  const startTime = Date.now();

  try {
    console.log(`🔄 Testando: ${name}`);

    const response = await axios.get(url);
    const endTime = Date.now();
    const duration = `${endTime - startTime}ms`;

    const result = {
      name,
      success: response.data.success,
      duration,
      url,
      data: response.data,
    };

    results.push(result);

    const dataCount =
      response.data.data?.length || (response.data.summary ? 'summary' : '0');

    console.log(`  ✅ ${name}: ${dataCount} registros (${duration})`);
  } catch (error) {
    const endTime = Date.now();
    const duration = `${endTime - startTime}ms`;

    results.push({
      name,
      success: false,
      duration,
      url,
      error: error.message,
      details: error.response?.data,
    });

    console.log(`  ❌ ${name}: ERRO - ${error.message} (${duration})`);
  }

  // Pequena pausa entre requests
  await new Promise(resolve => setTimeout(resolve, 500));
}

// Executar testes
testGroupedAPIs();
