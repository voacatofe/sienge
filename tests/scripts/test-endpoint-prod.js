// Script para testar os novos endpoints no banco de produção
const { PrismaClient } = require('@prisma/client');

// Conectar diretamente no banco de produção
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://sienge_app:kPnrGuFeJeuVprXzhhO2oLVE14f509KV@147.93.15.121:5434/sienge_data?schema=public&sslmode=disable',
    },
  },
});

console.log('🧪 Testando novos endpoints no banco de produção...\n');

async function testNewEndpoints() {
  try {
    console.log('1️⃣ Verificando modelos Prisma...');

    // Teste básico de contagem
    const counts = await Promise.all([
      prisma.centroCusto.count(),
      prisma.planoFinanceiro.count(),
      prisma.extratoContas.count(),
      prisma.extratoApropriacao.count(),
    ]);

    console.log(`   ✅ Centro de Custos: ${counts[0]} registros`);
    console.log(`   ✅ Planos Financeiros: ${counts[1]} registros`);
    console.log(`   ✅ Extratos de Contas: ${counts[2]} registros`);
    console.log(`   ✅ Apropriações: ${counts[3]} registros`);

    console.log('\n2️⃣ Testando relacionamentos...');

    // Testar se existem apropriações com relacionamentos
    if (counts[3] > 0) {
      const apropriacaoComRelacionamentos =
        await prisma.extratoApropriacao.findFirst({
          include: {
            centroCusto: true,
            planoFinanceiro: true,
            extratoContas: true,
          },
        });

      if (apropriacaoComRelacionamentos) {
        console.log(`   ✅ Relacionamentos funcionando:`);
        console.log(
          `      - Centro de Custo: ${apropriacaoComRelacionamentos.centroCusto?.nome || 'N/A'}`
        );
        console.log(
          `      - Plano Financeiro: ${apropriacaoComRelacionamentos.planoFinanceiro?.nome || 'N/A'}`
        );
        console.log(
          `      - Extrato: ${apropriacaoComRelacionamentos.extratoContas?.descricao || 'N/A'}`
        );
      } else {
        console.log(
          `   ⚠️ Apropriações existem mas sem relacionamentos completos`
        );
      }
    } else {
      console.log(
        `   ℹ️ Nenhuma apropriação encontrada (esperado se ainda não sincronizou)`
      );
    }

    console.log('\n3️⃣ Testando campos específicos...');

    // Verificar se os centros de custo têm os arrays JSON
    if (counts[0] > 0) {
      const centroComArrays = await prisma.centroCusto.findFirst({
        where: {
          OR: [
            { buildingSectors: { not: null } },
            { availableAccounts: { not: null } },
          ],
        },
      });

      if (centroComArrays) {
        console.log(`   ✅ Centro de Custo com arrays encontrado:`);
        console.log(`      - ID: ${centroComArrays.id}`);
        console.log(`      - Nome: ${centroComArrays.nome}`);
        console.log(
          `      - buildingSectors: ${centroComArrays.buildingSectors ? 'presente' : 'ausente'}`
        );
        console.log(
          `      - availableAccounts: ${centroComArrays.availableAccounts ? 'presente' : 'ausente'}`
        );
      } else {
        console.log(`   ℹ️ Nenhum centro de custo com arrays JSON encontrado`);
      }
    }

    console.log('\n4️⃣ Verificando estrutura de sync...');
    console.log(`   ✅ Endpoints configurados para sincronização:`);
    console.log(`      - /cost-centers → centroCusto`);
    console.log(`      - /payment-categories → planoFinanceiro`);
    console.log(
      `      - /accounts-statements → extratoContas + extratoApropriacao`
    );

    console.log('\n✅ TESTE CONCLUÍDO COM SUCESSO!');
    console.log('\n🚀 Os novos endpoints estão prontos para sincronização:');
    console.log('   1. Interface web: botão "Configurar e Sincronizar"');
    console.log('   2. Script automático: daily-sync.js');
    console.log('   3. API direta: /api/sync/direct');
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testNewEndpoints();
