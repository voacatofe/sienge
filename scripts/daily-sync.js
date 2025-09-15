const cron = require('node-cron');

// Configuração
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const SYNC_TIME = process.env.SYNC_TIME || '0 2 * * *'; // 2:00 AM todos os dias

console.log('🚀 Iniciando sistema de sincronização diária...');
console.log(`📅 Agendado para: ${SYNC_TIME} (formato cron)`);
console.log(`🔗 URL da aplicação: ${APP_URL}`);

// Endpoints para sincronização automática
const SYNC_ENDPOINTS = [
  '/customers',
  '/companies',
  '/accounts-receivable',
  '/accounts-payable',
  '/sales-contracts',
  '/commissions',
  '/payment-categories',
  '/carriers',
  '/indexers',
];

// Função de sincronização
async function runDailySync() {
  const startTime = new Date();
  console.log(`\n🔄 [${startTime.toISOString()}] Iniciando sync diário...`);

  // Calcular data de 1 ano atrás para filtros
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const dateFilter = oneYearAgo.toISOString().split('T')[0]; // YYYY-MM-DD

  let totalSuccess = 0;
  let totalErrors = 0;
  const results = [];

  try {
    // Sincronizar cada endpoint
    for (const endpoint of SYNC_ENDPOINTS) {
      try {
        console.log(`📡 Sincronizando ${endpoint}...`);

        // Parâmetros específicos por endpoint
        const params = new URLSearchParams({
          endpoint,
          limit: '1000', // Limite conservador para sync automático
        });

        // Adicionar filtros de data para endpoints que precisam
        if (
          [
            '/customers',
            '/accounts-receivable',
            '/accounts-payable',
            '/sales-contracts',
          ].includes(endpoint)
        ) {
          if (endpoint === '/customers') {
            params.append('createdAfter', dateFilter);
          } else if (
            endpoint === '/accounts-receivable' ||
            endpoint === '/accounts-payable'
          ) {
            params.append('issueAfter', dateFilter);
          } else if (endpoint === '/sales-contracts') {
            params.append('contractAfter', dateFilter);
          }
        }

        const response = await fetch(`${APP_URL}/api/sienge/proxy?${params}`, {
          method: 'GET',
          headers: {
            'User-Agent': 'Daily-Sync-Script/1.0',
          },
        });

        if (response.ok) {
          const result = await response.json();
          const recordCount = Array.isArray(result.data)
            ? result.data.length
            : 0;
          results.push({
            endpoint,
            success: true,
            records: recordCount,
          });
          totalSuccess++;
          console.log(`✅ ${endpoint}: ${recordCount} registros`);
        } else {
          results.push({
            endpoint,
            success: false,
            error: `${response.status} ${response.statusText}`,
          });
          totalErrors++;
          console.log(
            `❌ ${endpoint}: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        results.push({
          endpoint,
          success: false,
          error: error.message,
        });
        totalErrors++;
        console.log(`💥 ${endpoint}: ${error.message}`);
      }

      // Pequena pausa entre endpoints para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log(
      `\n📊 [${endTime.toISOString()}] Sync concluído (${duration}s)`
    );
    console.log(`✅ Sucessos: ${totalSuccess}`);
    console.log(`❌ Erros: ${totalErrors}`);
    console.log(
      `📈 Taxa de sucesso: ${Math.round((totalSuccess / SYNC_ENDPOINTS.length) * 100)}%`
    );
  } catch (error) {
    const errorTime = new Date();
    const duration = Math.round((errorTime - startTime) / 1000);
    console.error(
      `💥 [${errorTime.toISOString()}] Erro crítico no sync (${duration}s):`,
      error.message
    );
  }
}

// Agendar execução diária
cron.schedule(SYNC_TIME, runDailySync, {
  timezone: 'America/Sao_Paulo',
});

console.log('⏰ Cron job configurado com sucesso!');
console.log('📍 Timezone: America/Sao_Paulo');
console.log('🔄 Para executar manualmente: npm run sync:daily');

// Executar uma vez no startup se solicitado
if (process.argv.includes('--run-now')) {
  console.log('\n🏃 Executando sync imediatamente (--run-now)...');
  runDailySync();
}

// Manter o processo rodando
process.on('SIGINT', () => {
  console.log('\n👋 Encerrando sistema de sync diário...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Encerrando sistema de sync diário (SIGTERM)...');
  process.exit(0);
});
