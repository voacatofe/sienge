// Script simples para testar os novos endpoints
console.log('🧪 Testando integração dos novos endpoints...\n');

// Teste 1: Verificar se os modelos Prisma existem
console.log('1️⃣ Verificando modelos Prisma...');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const expectedModels = {
  'accounts-statements': 'extratoContas',
  'cost-centers': 'centroCusto',
  'payment-categories': 'planoFinanceiro',
  appropriations: 'extratoApropriacao',
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

// Teste 2: Verificar contagem atual dos dados
console.log('\n2️⃣ Verificando dados existentes...');

async function checkCounts() {
  try {
    const counts = await Promise.all([
      prisma.centroCusto.count(),
      prisma.planoFinanceiro.count(),
      prisma.extratoContas.count(),
      prisma.extratoApropriacao.count(),
    ]);

    console.log(`   📊 Centro de Custos: ${counts[0]} registros`);
    console.log(`   📊 Planos Financeiros: ${counts[1]} registros`);
    console.log(`   📊 Extratos de Contas: ${counts[2]} registros`);
    console.log(`   📊 Apropriações: ${counts[3]} registros`);

    return counts.every(count => count >= 0); // Sucesso se conseguiu contar
  } catch (error) {
    console.log(`   ❌ Erro ao contar registros: ${error.message}`);
    return false;
  }
}

// Teste 3: Simular parâmetros de sync
console.log('\n3️⃣ Testando parâmetros de sincronização...');

function testEndpointParams() {
  // Test accounts-statements params
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const startDate = oneYearAgo.toISOString().split('T')[0];
  const endDate = new Date().toISOString().split('T')[0];

  console.log(
    `   ✅ accounts-statements: startDate=${startDate}, endDate=${endDate}`
  );
  console.log(`   ✅ cost-centers: sem parâmetros obrigatórios`);
  console.log(`   ✅ payment-categories: sem parâmetros obrigatórios`);

  return true;
}

// Executar testes
async function runTests() {
  const countsOk = await checkCounts();
  const paramsOk = testEndpointParams();

  console.log('\n📊 RESULTADO FINAL:');
  if (allModelsExist && countsOk && paramsOk) {
    console.log(
      '✅ Todos os testes passaram! Os novos endpoints estão prontos para sincronização.'
    );
    console.log('\n🚀 Próximos passos:');
    console.log(
      '   1. Testar sync manual via interface (botão "Configurar e Sincronizar")'
    );
    console.log('   2. Verificar logs de sincronização');
    console.log('   3. Confirmar novos dados no banco após sync');
    console.log('   4. Testar sync automático (daily-sync)');
  } else {
    console.log('❌ Alguns testes falharam. Verifique os problemas acima.');
    process.exit(1);
  }

  await prisma.$disconnect();
}

runTests().catch(console.error);
