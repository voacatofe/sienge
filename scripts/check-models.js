// Script para verificar se os modelos estão disponíveis no Prisma
// Usar JavaScript puro para evitar problemas de TypeScript

const { PrismaClient } = require('@prisma/client');

async function checkModels() {
  console.log('🔍 Verificando modelos Prisma...\n');

  const prisma = new PrismaClient();

  try {
    // Lista todos os modelos disponíveis
    const modelNames = Object.keys(prisma).filter(
      key =>
        !key.startsWith('$') &&
        !key.startsWith('_') &&
        typeof prisma[key] === 'object'
    );

    console.log(`✅ Total de modelos encontrados: ${modelNames.length}`);
    console.log('\n📋 Modelos disponíveis:');
    modelNames.forEach(model => console.log(`   - ${model}`));

    // Verificar modelos específicos
    const requiredModels = [
      'centroCusto',
      'planoFinanceiro',
      'extratoContas',
      'extratoApropriacao',
    ];
    const missingModels = [];

    console.log('\n🔍 Verificando modelos obrigatórios:');
    for (const model of requiredModels) {
      if (prisma[model]) {
        console.log(`   ✅ ${model}: disponível`);
      } else {
        console.log(`   ❌ ${model}: NÃO ENCONTRADO`);
        missingModels.push(model);
      }
    }

    if (missingModels.length > 0) {
      console.error('\n❌ ERRO: Modelos faltando!');
      console.error('Execute: npx prisma generate');
      process.exit(1);
    }

    console.log('\n✅ Todos os modelos obrigatórios estão disponíveis!');
  } catch (error) {
    console.error('❌ Erro ao verificar modelos:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkModels();
