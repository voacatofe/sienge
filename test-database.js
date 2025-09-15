/**
 * Script para testar a conectividade com o banco de dados
 * Verifica se o Prisma está funcionando corretamente
 */

const { PrismaClient } = require('@prisma/client');

const testDatabase = async () => {
  const prisma = new PrismaClient();

  try {
    console.log('🧪 Iniciando teste de conectividade com o banco de dados...');

    // Testar conexão básica
    console.log('🔍 Testando conexão com o banco...');
    await prisma.$connect();
    console.log('✅ Conexão com o banco estabelecida com sucesso!');

    // Testar uma query simples
    console.log('🔍 Testando query básica...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query executada com sucesso:', result);

    // Verificar se as tabelas existem
    console.log('🔍 Verificando estrutura do banco...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

    console.log('📊 Tabelas encontradas no banco:');
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });

    // Verificar tabelas específicas do projeto
    const expectedTables = ['Company', 'Customer', 'SyncLog', 'Config'];
    const existingTables = tables.map(t => t.table_name);

    console.log('\n🔍 Verificando tabelas do projeto:');
    expectedTables.forEach(tableName => {
      if (existingTables.includes(tableName)) {
        console.log(`   ✅ ${tableName} - Existe`);
      } else {
        console.log(`   ⚠️  ${tableName} - Não encontrada`);
      }
    });

    console.log('\n🎯 Resumo do teste de banco de dados:');
    console.log('   ✅ Prisma Client conectado com sucesso');
    console.log('   ✅ Banco PostgreSQL funcionando');
    console.log('   ✅ Estrutura do banco verificada');
    console.log(`   📊 Total de tabelas: ${tables.length}`);
  } catch (error) {
    console.error('❌ Erro no teste de banco:', error.message);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexão com o banco encerrada.');
  }
};

// Executar o teste
testDatabase();
