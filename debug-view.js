const { Client } = require('pg');

async function checkView() {
  const client = new Client({
    host: '147.93.15.121',
    port: 5434,
    database: 'sienge_data',
    user: 'sienge_app',
    password: 'kPnrGuFeJeuVprXzhhO2oLVE14f509KV'
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados');

    // Verificar se a view materializada existe
    console.log('\n🔍 Verificando view materializada...');
    const viewCheck = await client.query(`
      SELECT schemaname, matviewname, definition
      FROM pg_matviews
      WHERE matviewname = 'rpt_sienge_master_wide'
    `);

    if (viewCheck.rows.length === 0) {
      console.log('❌ View materializada NÃO EXISTE!');

      // Verificar se existe como view normal
      const normalViewCheck = await client.query(`
        SELECT schemaname, viewname, definition
        FROM pg_views
        WHERE viewname = 'rpt_sienge_master_wide'
      `);

      if (normalViewCheck.rows.length > 0) {
        console.log('✅ Existe como VIEW normal:', normalViewCheck.rows[0]);
      } else {
        console.log('❌ Não existe nem como view normal');
      }
    } else {
      console.log('✅ View materializada existe:', viewCheck.rows[0]);
    }

    // Verificar estrutura da tabela/view se existir
    console.log('\n📋 Verificando estrutura...');
    try {
      const structure = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'rpt_sienge_master_wide'
        ORDER BY ordinal_position
      `);

      if (structure.rows.length > 0) {
        console.log('📊 Estrutura da view/tabela:');
        structure.rows.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
        });
      } else {
        console.log('❌ Estrutura não encontrada');
      }
    } catch (error) {
      console.log('❌ Erro ao verificar estrutura:', error.message);
    }

    // Testar query simples
    console.log('\n🧪 Testando query simples...');
    try {
      const testQuery = await client.query(`
        SELECT COUNT(*) as total
        FROM rpt_sienge_master_wide
        LIMIT 1
      `);
      console.log('✅ Query executada com sucesso. Total de registros:', testQuery.rows[0].total);
    } catch (error) {
      console.log('❌ Erro na query:', error.message);
    }

  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
  } finally {
    await client.end();
  }
}

checkView();