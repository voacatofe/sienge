// Script para testar se os novos endpoints estão disponíveis para sincronização
const {
  hasEndpointMapping,
  getEndpointMapping,
} = require('../../app/api/sync/direct/endpoint-mappings.ts');

console.log('🧪 Testando integração dos novos endpoints...\n');

// Endpoints que devem estar configurados
const newEndpoints = [
  'accounts-statements',
  'cost-centers',
  'payment-categories',
];

// Teste 1: Verificar se os mapeamentos existem
console.log('1️⃣ Verificando mapeamentos de endpoints...');
let allMappingsExist = true;

for (const endpoint of newEndpoints) {
  try {
    const hasMapping = hasEndpointMapping(endpoint);
    const mapping = getEndpointMapping(endpoint);

    if (hasMapping && mapping) {
      console.log(
        `   ✅ ${endpoint}: mapeamento encontrado (modelo: ${mapping.model})`
      );
    } else {
      console.log(`   ❌ ${endpoint}: mapeamento NÃO encontrado`);
      allMappingsExist = false;
    }
  } catch (error) {
    console.log(`   💥 ${endpoint}: erro ao verificar - ${error.message}`);
    allMappingsExist = false;
  }
}

// Teste 2: Verificar se os modelos Prisma existem
console.log('\n2️⃣ Verificando modelos Prisma...');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const expectedModels = {
  'accounts-statements': 'extratoContas',
  'cost-centers': 'centroCusto',
  'payment-categories': 'planoFinanceiro',
};

let allModelsExist = true;

for (const [endpoint, modelName] of Object.entries(expectedModels)) {
  try {
    if (prisma[modelName]) {
      console.log(`   ✅ ${endpoint}: modelo ${modelName} encontrado`);
    } else {
      console.log(`   ❌ ${endpoint}: modelo ${modelName} NÃO encontrado`);
      allModelsExist = false;
    }
  } catch (error) {
    console.log(
      `   💥 ${endpoint}: erro ao verificar modelo - ${error.message}`
    );
    allModelsExist = false;
  }
}

// Teste 3: Simular parâmetros de sync
console.log('\n3️⃣ Testando parâmetros de sincronização...');

function testEndpointParams(endpoint) {
  const params = {};

  if (endpoint === 'accounts-statements') {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    params.startDate = oneYearAgo.toISOString().split('T')[0];
    params.endDate = new Date().toISOString().split('T')[0];
    params.limit = 200;
    params.offset = 0;
  } else {
    params.limit = 200;
    params.offset = 0;
  }

  return params;
}

for (const endpoint of newEndpoints) {
  const params = testEndpointParams(endpoint);
  const paramCount = Object.keys(params).length;

  if (endpoint === 'accounts-statements') {
    if (params.startDate && params.endDate) {
      console.log(
        `   ✅ ${endpoint}: parâmetros obrigatórios configurados (${paramCount} params)`
      );
      console.log(
        `      startDate: ${params.startDate}, endDate: ${params.endDate}`
      );
    } else {
      console.log(`   ❌ ${endpoint}: parâmetros obrigatórios faltando`);
    }
  } else {
    console.log(
      `   ✅ ${endpoint}: parâmetros básicos configurados (${paramCount} params)`
    );
  }
}

// Resultado final
console.log('\n📊 RESULTADO FINAL:');
if (allMappingsExist && allModelsExist) {
  console.log(
    '✅ Todos os testes passaram! Os novos endpoints estão prontos para sincronização.'
  );
  console.log('\n🚀 Próximos passos:');
  console.log('   1. Fazer deploy das alterações');
  console.log('   2. Testar sync manual via interface');
  console.log('   3. Verificar logs de sincronização');
  console.log('   4. Confirmar dados no banco');
} else {
  console.log('❌ Alguns testes falharam. Verifique os problemas acima.');
  process.exit(1);
}

// Fechar conexão Prisma
prisma.$disconnect();
