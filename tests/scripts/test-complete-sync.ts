import { PrismaClient } from '@prisma/client';

// Conectar diretamente no banco de produção
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://sienge_app:kPnrGuFeJeuVprXzhhO2oLVE14f509KV@147.93.15.121:5434/sienge_data?schema=public&sslmode=disable',
    },
  },
});

async function cleanTestData() {
  // Limpar dados de teste anteriores
  await prisma.extratoApropriacao.deleteMany({
    where: {
      extratoContaId: {
        in: [20001, 20002, 20003],
      },
    },
  });
  await prisma.extratoContas.deleteMany({
    where: {
      id: {
        in: [20001, 20002, 20003],
      },
    },
  });
  await prisma.centroCusto.deleteMany({
    where: {
      id: {
        in: [70001, 70002],
      },
    },
  });
  await prisma.planoFinanceiro.deleteMany({
    where: {
      id: {
        in: ['301', '302', '303'],
      },
    },
  });
}

async function testCompleteSync() {
  console.log('🚀 TESTE COMPLETO DE SINCRONIZAÇÃO\n');
  console.log('='.repeat(50));

  try {
    // Limpar dados antigos
    await cleanTestData();

    // 1. CRIAR PLANOS FINANCEIROS
    console.log('\n1️⃣ CRIANDO PLANOS FINANCEIROS...');
    const planos = await Promise.all([
      prisma.planoFinanceiro.create({
        data: {
          id: '301',
          nome: 'RECEITA OPERACIONAL',
          tipoConta: 'R',
          flRedutora: 'N',
          flAtiva: 'S',
          flAdiantamento: 'N',
          flImposto: 'N',
        },
      }),
      prisma.planoFinanceiro.create({
        data: {
          id: '302',
          nome: 'DESPESA ADMINISTRATIVA',
          tipoConta: 'R',
          flRedutora: 'N',
          flAtiva: 'S',
          flAdiantamento: 'N',
          flImposto: 'N',
        },
      }),
      prisma.planoFinanceiro.create({
        data: {
          id: '303',
          nome: 'DESPESA COM VENDAS',
          tipoConta: 'R',
          flRedutora: 'N',
          flAtiva: 'S',
          flAdiantamento: 'N',
          flImposto: 'N',
        },
      }),
    ]);
    console.log(`   ✅ ${planos.length} planos financeiros criados`);

    // 2. CRIAR CENTROS DE CUSTO COM ARRAYS
    console.log('\n2️⃣ CRIANDO CENTROS DE CUSTO...');
    const centros = await Promise.all([
      prisma.centroCusto.create({
        data: {
          id: 70001,
          nome: 'Obra Centro - Torre A',
          cnpj: '11222333000144',
          empresaId: 1,
          ativo: true,
          buildingSectors: [
            {
              id: 'SEC001',
              name: 'Setor Administrativo',
              accountableId: 'USR001',
              accountableName: 'João Silva',
            },
            {
              id: 'SEC002',
              name: 'Setor Operacional',
              accountableId: 'USR002',
              accountableName: 'Maria Santos',
            },
          ],
          availableAccounts: ['1234-5', '5678-9', '9012-3'],
        },
      }),
      prisma.centroCusto.create({
        data: {
          id: 70002,
          nome: 'Obra Sul - Residencial',
          cnpj: '44555666000177',
          empresaId: 1,
          ativo: true,
          buildingSectors: [
            {
              id: 'SEC003',
              name: 'Setor de Vendas',
              accountableId: 'USR003',
              accountableName: 'Pedro Costa',
            },
          ],
          availableAccounts: ['4321-0'],
        },
      }),
    ]);
    console.log(`   ✅ ${centros.length} centros de custo criados com arrays`);

    // 3. CRIAR EXTRATOS COM APROPRIAÇÕES COMPLEXAS
    console.log('\n3️⃣ CRIANDO EXTRATOS DE CONTAS...');

    // Extrato 1: Com múltiplas apropriações
    const extrato1 = await prisma.extratoContas.create({
      data: {
        id: 20001,
        valor: 10000.0,
        data: new Date('2024-02-01'),
        numeroDocumento: 'NF2024-100',
        descricao: 'Pagamento Fornecedor Material',
        documentoId: 'NFE',
        tipo: 'Expense',
        origemExtrato: 'CP',
        tipoExtrato: 'Pagamento',
        observacoesExtrato: 'Material para obra Torre A',
        empresaId: 1,
        centroCustoId: 70001,
        planoFinanceiroId: '302',
        categoriasOrcamentarias: [
          {
            percentage: 60,
            description: 'Material básico',
            links: [
              { href: '/api/v1/cost-centers/70001', rel: 'cost-center' },
              {
                href: '/api/v1/payment-categories/302',
                rel: 'payment-category',
              },
            ],
          },
          {
            percentage: 40,
            description: 'Material especial',
            links: [
              { href: '/api/v1/cost-centers/70002', rel: 'cost-center' },
              {
                href: '/api/v1/payment-categories/303',
                rel: 'payment-category',
              },
            ],
          },
        ],
      },
    });

    // Criar apropriações para extrato 1
    await Promise.all([
      prisma.extratoApropriacao.create({
        data: {
          extratoContaId: 20001,
          centroCustoId: 70001,
          planoFinanceiroId: '302',
          percentual: 60,
          valorApropriado: 6000.0,
        },
      }),
      prisma.extratoApropriacao.create({
        data: {
          extratoContaId: 20001,
          centroCustoId: 70002,
          planoFinanceiroId: '303',
          percentual: 40,
          valorApropriado: 4000.0,
        },
      }),
    ]);

    // Extrato 2: Receita simples
    const extrato2 = await prisma.extratoContas.create({
      data: {
        id: 20002,
        valor: 25000.0,
        data: new Date('2024-02-05'),
        numeroDocumento: 'REC2024-200',
        descricao: 'Recebimento Cliente - Parcela',
        tipo: 'Income',
        origemExtrato: 'CR',
        tipoExtrato: 'Recebimento',
        empresaId: 1,
        centroCustoId: 70001,
        planoFinanceiroId: '301',
      },
    });

    // Extrato 3: Despesa sem apropriações
    const extrato3 = await prisma.extratoContas.create({
      data: {
        id: 20003,
        valor: 3500.0,
        data: new Date('2024-02-10'),
        numeroDocumento: 'DESP2024-300',
        descricao: 'Despesa Administrativa Geral',
        tipo: 'Expense',
        origemExtrato: 'BC',
        tipoExtrato: 'Despesa',
        empresaId: 1,
        tags: ['administrativa', 'mensal', 'recorrente'],
      },
    });

    console.log('   ✅ 3 extratos criados com diferentes configurações');

    // 4. VERIFICAR RESULTADOS
    console.log('\n4️⃣ VERIFICANDO DADOS CRIADOS...');

    // Verificar centro de custo com arrays
    const centroCompleto = await prisma.centroCusto.findUnique({
      where: { id: 70001 },
      include: {
        empresa: true,
        apropriacoes: true,
      },
    });

    console.log('\n📊 Centro de Custo Detalhado:');
    console.log(`   Nome: ${centroCompleto?.nome}`);
    console.log(`   CNPJ: ${centroCompleto?.cnpj}`);
    console.log(`   Empresa: ${centroCompleto?.empresa?.nomeEmpresa || 'N/A'}`);
    console.log(
      `   Setores: ${JSON.stringify(centroCompleto?.buildingSectors)?.length} caracteres de dados`
    );
    console.log(
      `   Contas: ${JSON.stringify(centroCompleto?.availableAccounts)}`
    );
    console.log(
      `   Apropriações vinculadas: ${centroCompleto?.apropriacoes.length}`
    );

    // Verificar extrato com apropriações
    const extratoCompleto = await prisma.extratoContas.findUnique({
      where: { id: 20001 },
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

    console.log('\n📄 Extrato com Apropriações:');
    console.log(`   Descrição: ${extratoCompleto?.descricao}`);
    console.log(`   Valor: R$ ${extratoCompleto?.valor}`);
    console.log(
      `   Centro de Custo Principal: ${extratoCompleto?.centroCusto?.nome}`
    );
    console.log(
      `   Plano Financeiro Principal: ${extratoCompleto?.planoFinanceiro?.nome}`
    );
    console.log(`   Apropriações:`);
    extratoCompleto?.apropriacoes.forEach(aprop => {
      console.log(
        `     - ${aprop.percentual}% (R$ ${aprop.valorApropriado}) em ${aprop.centroCusto?.nome} / ${aprop.planoFinanceiro?.nome}`
      );
    });

    // Estatísticas finais
    console.log('\n📈 ESTATÍSTICAS FINAIS:');
    const stats = await Promise.all([
      prisma.planoFinanceiro.count(),
      prisma.centroCusto.count(),
      prisma.extratoContas.count(),
      prisma.extratoApropriacao.count(),
    ]);

    console.log(`   Planos Financeiros: ${stats[0]}`);
    console.log(`   Centros de Custo: ${stats[1]}`);
    console.log(`   Extratos de Contas: ${stats[2]}`);
    console.log(`   Apropriações: ${stats[3]}`);

    console.log('\n✅ TESTE COMPLETO FINALIZADO COM SUCESSO!');

    // Limpar dados de teste
    console.log('\n🧹 Limpando dados de teste...');
    await cleanTestData();
    console.log('   Dados de teste removidos.');
  } catch (error) {
    console.error('\n❌ ERRO DURANTE O TESTE:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar teste
testCompleteSync();
