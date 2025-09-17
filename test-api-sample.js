const { Client } = require('pg');

async function testApiSample() {
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

    // Calcular data de 1 ano atrás (igual à API)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    console.log(`\n🗓️ Período: ${startDate.toISOString().split('T')[0]} até ${endDate.toISOString().split('T')[0]}`);

    // Testar query exata da API
    console.log('\n🧪 Executando query igual à API...');
    const sql = `
      SELECT * FROM rpt_sienge_master_wide
      WHERE data_principal >= $1 AND domain_type = $2
      ORDER BY data_principal DESC, domain_type
      LIMIT 3
    `;

    const result = await client.query(sql, [startDate, 'contratos']);

    if (result.rows.length > 0) {
      console.log(`✅ Query executada! Retornou ${result.rows.length} registros`);
      console.log('\n📊 Amostra dos dados:');

      // Mostrar primeiro registro
      const firstRow = result.rows[0];
      console.log('\n🔍 Campos disponíveis no primeiro registro:');
      Object.keys(firstRow).forEach(key => {
        const value = firstRow[key];
        const type = typeof value;
        const preview = value ? String(value).substring(0, 50) : 'null';
        console.log(`  - ${key}: ${type} = "${preview}"`);
      });

      // Verificar se há problemas com campos específicos do connector
      const problematicFields = [
        'data_principal', 'ano', 'trimestre', 'mes', 'ano_mes', 'nome_mes',
        'empresa_nome', 'valor_contrato', 'status_contrato', 'contratos_ativos',
        'saldo_devedor', 'margem_bruta', 'cliente_principal'
      ];

      console.log('\n🎯 Verificando campos problemáticos:');
      problematicFields.forEach(field => {
        if (firstRow[field] !== undefined) {
          const value = firstRow[field];
          const type = typeof value;
          console.log(`  ✅ ${field}: ${type} = "${value}"`);
        } else {
          console.log(`  ❌ ${field}: CAMPO NÃO EXISTE!`);
        }
      });

    } else {
      console.log('❌ Query não retornou dados');
    }

  } catch (error) {
    console.error('❌ Erro na query:', error.message);
    console.error('Detalhes:', error);
  } finally {
    await client.end();
  }
}

testApiSample();