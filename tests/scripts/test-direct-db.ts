import { PrismaClient } from '@prisma/client';

// Conectar diretamente no banco de produção
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://sienge_app:kPnrGuFeJeuVprXzhhO2oLVE14f509KV@147.93.15.121:5434/sienge_data?schema=public&sslmode=disable',
    },
  },
});

async function testNewModels() {
  console.log('🔍 Testando modelos diretamente no banco de produção...\n');

  try {
    // Testar CentroCusto
    console.log('📊 Centro de Custos:');
    const centrosCount = await prisma.centroCusto.count();
    console.log(`   Total: ${centrosCount}`);

    // Criar um novo centro de custo
    const novoCentro = await prisma.centroCusto.create({
      data: {
        id: 99999,
        nome: 'Centro de Teste Direto',
        cnpj: '12345678000199',
        empresaId: 1,
        ativo: true,
      },
    });
    console.log(`   ✅ Criado: ${novoCentro.nome} (ID: ${novoCentro.id})`);

    // Testar PlanoFinanceiro
    console.log('\n💰 Planos Financeiros:');
    const planosCount = await prisma.planoFinanceiro.count();
    console.log(`   Total: ${planosCount}`);

    // Criar um novo plano financeiro
    const novoPlano = await prisma.planoFinanceiro.create({
      data: {
        id: '999',
        nome: 'PLANO DE TESTE DIRETO',
        tipoConta: 'R',
        flRedutora: 'N',
        flAtiva: 'S',
        flAdiantamento: 'N',
        flImposto: 'N',
      },
    });
    console.log(`   ✅ Criado: ${novoPlano.nome} (ID: ${novoPlano.id})`);

    // Testar ExtratoContas
    console.log('\n📄 Extratos de Contas:');
    const extratosCount = await prisma.extratoContas.count();
    console.log(`   Total: ${extratosCount}`);

    // Criar um novo extrato
    const novoExtrato = await prisma.extratoContas.create({
      data: {
        id: 99999,
        valor: 7500.5,
        data: new Date('2024-02-01'),
        numeroDocumento: 'TEST-DIRECT-001',
        descricao: 'Teste Direto no Banco',
        tipo: 'Income',
        centroCustoId: 99999,
        planoFinanceiroId: '999',
      },
    });
    console.log(
      `   ✅ Criado: ${novoExtrato.descricao} (ID: ${novoExtrato.id})`
    );

    // Testar ExtratoApropriacao
    console.log('\n🔗 Apropriações:');
    const apropriacoesCount = await prisma.extratoApropriacao.count();
    console.log(`   Total antes: ${apropriacoesCount}`);

    // Criar uma nova apropriação
    const novaApropriacao = await prisma.extratoApropriacao.create({
      data: {
        extratoContaId: 99999,
        centroCustoId: 99999,
        planoFinanceiroId: '999',
        percentual: 100,
        valorApropriado: 7500.5,
      },
    });
    console.log(`   ✅ Criado: Apropriação ID ${novaApropriacao.id}`);

    // Verificar relacionamentos
    console.log('\n🔍 Verificando relacionamentos:');
    const extratoCompleto = await prisma.extratoContas.findUnique({
      where: { id: 99999 },
      include: {
        centroCusto: true,
        planoFinanceiro: true,
        apropriacoes: {
          include: {
            centroCusto: true,
            planoFinanceiro: true,
          },
        },
      },
    });

    if (extratoCompleto) {
      console.log(`   Extrato: ${extratoCompleto.descricao}`);
      console.log(
        `   Centro de Custo: ${extratoCompleto.centroCusto?.nome || 'N/A'}`
      );
      console.log(
        `   Plano Financeiro: ${extratoCompleto.planoFinanceiro?.nome || 'N/A'}`
      );
      console.log(`   Apropriações: ${extratoCompleto.apropriacoes.length}`);

      extratoCompleto.apropriacoes.forEach(aprop => {
        console.log(
          `     - ${aprop.percentual}% em ${aprop.centroCusto?.nome} / ${aprop.planoFinanceiro?.nome}`
        );
      });
    }

    console.log('\n✅ Todos os testes passaram com sucesso!');

    // Limpar dados de teste
    console.log('\n🧹 Limpando dados de teste...');
    await prisma.extratoApropriacao.deleteMany({
      where: { extratoContaId: 99999 },
    });
    await prisma.extratoContas.delete({ where: { id: 99999 } });
    await prisma.centroCusto.delete({ where: { id: 99999 } });
    await prisma.planoFinanceiro.delete({ where: { id: '999' } });
    console.log('   Dados de teste removidos.');
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testNewModels();
