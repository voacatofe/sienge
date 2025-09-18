import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dados de teste para os novos endpoints
const testData = {
  'payment-categories': [
    {
      id: '101',
      name: 'RECEITA DE UNIDADES IMOBILIÁRIAS',
      tpConta: 'T',
      flRedutora: 'N',
      flAtiva: 'S',
      flAdiantamento: 'N',
      flImposto: 'N',
    },
    {
      id: '10199',
      name: '(-) Cancelamento de Contrato de Venda',
      tpConta: 'R',
      flRedutora: 'S',
      flAtiva: 'S',
      flAdiantamento: 'N',
      flImposto: 'N',
    },
  ],
  'cost-centers': [
    {
      id: 90115,
      name: 'Nova Sede (Clube) - PDV',
      cnpj: '',
      idCompany: 1,
    },
    {
      id: 12104,
      name: 'Terreno Luiz Voelker',
      cnpj: '',
      idCompany: 1,
    },
  ],
  'accounts-statements': [
    {
      id: 1001,
      value: 999.99,
      date: '2024-01-15',
      documentNumber: 'DOC2024001',
      description: 'Pagamento fornecedor - Teste',
      documentId: 'NFE123',
      type: 'Expense',
      reconciliationDate: '2024-01-16',
      billId: null,
      installmentNumber: 1,
      statementOrigin: 'CP',
      statementType: 'Pagamento',
      statementTypeNotes: 'Teste de apropriação',
      budgetCategories: [
        {
          percentage: 60,
          links: [
            {
              href: '/api/v1/cost-centers/90115',
              rel: 'cost-center',
            },
            {
              href: '/api/v1/payment-categories/101',
              rel: 'payment-category',
            },
          ],
        },
        {
          percentage: 40,
          links: [
            {
              href: '/api/v1/cost-centers/12104',
              rel: 'cost-center',
            },
            {
              href: '/api/v1/payment-categories/10199',
              rel: 'payment-category',
            },
          ],
        },
      ],
    },
  ],
};

async function testEndpoint(endpoint: string, data: any[]) {
  console.log(`\n📋 Testando endpoint: ${endpoint}`);
  console.log(`   Enviando ${data.length} registros...`);

  try {
    const response = await fetch('http://localhost:3002/api/sync/direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint,
        data,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`   ✅ Sucesso:`, result.data);
    return true;
  } catch (error) {
    console.error(`   ❌ Erro:`, error);
    return false;
  }
}

async function verifyData() {
  console.log('\n🔍 Verificando dados importados...\n');

  // Verificar planos financeiros
  const planos = await prisma.planoFinanceiro.count();
  console.log(`   Planos Financeiros: ${planos} registros`);

  // Verificar centros de custo
  const centros = await prisma.centroCusto.count();
  console.log(`   Centros de Custo: ${centros} registros`);

  // Verificar extratos
  const extratos = await prisma.extratoContas.count();
  console.log(`   Extratos de Contas: ${extratos} registros`);

  // Verificar apropriações
  const apropriacoes = await prisma.extratoApropriacao.count();
  console.log(`   Apropriações: ${apropriacoes} registros`);

  // Verificar relacionamentos
  if (apropriacoes > 0) {
    const apropWithRelations = await prisma.extratoApropriacao.findFirst({
      include: {
        centroCusto: true,
        planoFinanceiro: true,
        extratoContas: true,
      },
    });

    if (apropWithRelations) {
      console.log('\n   📊 Exemplo de apropriação com relacionamentos:');
      console.log(`      Extrato ID: ${apropWithRelations.extratoContaId}`);
      console.log(
        `      Centro de Custo: ${apropWithRelations.centroCusto?.nome || 'N/A'}`
      );
      console.log(
        `      Plano Financeiro: ${apropWithRelations.planoFinanceiro?.nome || 'N/A'}`
      );
      console.log(`      Percentual: ${apropWithRelations.percentual}%`);
    }
  }
}

async function main() {
  console.log('🚀 Iniciando testes dos novos endpoints...\n');

  // Ordem de sincronização: payment-categories -> cost-centers -> accounts-statements
  const endpoints = [
    'payment-categories',
    'cost-centers',
    'accounts-statements',
  ];
  let allSuccess = true;

  for (const endpoint of endpoints) {
    const data = testData[endpoint as keyof typeof testData];
    const success = await testEndpoint(endpoint, data);
    if (!success) allSuccess = false;

    // Aguardar um pouco entre as requisições
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  if (allSuccess) {
    console.log('\n✅ Todos os testes passaram!');
    await verifyData();
  } else {
    console.log('\n❌ Alguns testes falharam. Verifique os logs acima.');
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
