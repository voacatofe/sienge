const cron = require('node-cron');

// Configuração
const SYNC_URL = process.env.SYNC_URL || 'http://localhost:3000/api/sync';
const SYNC_TIME = process.env.SYNC_TIME || '0 2 * * *'; // 2:00 AM todos os dias

console.log('🚀 Iniciando sistema de sincronização diária...');
console.log(`📅 Agendado para: ${SYNC_TIME} (formato cron)`);
console.log(`🔗 URL de sync: ${SYNC_URL}`);

// Função de sincronização
async function runDailySync() {
  const startTime = new Date();
  console.log(`\n🔄 [${startTime.toISOString()}] Iniciando sync diário...`);

  try {
    const response = await fetch(SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Daily-Sync-Script/1.0',
      },
      body: JSON.stringify({
        source: 'daily-cron',
        timestamp: startTime.toISOString(),
      }),
    });

    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);

    if (response.ok) {
      const result = await response.json();
      console.log(
        `✅ [${endTime.toISOString()}] Sync concluído com sucesso (${duration}s)`
      );
      console.log(`📊 Resultado:`, {
        status: result.status || 'success',
        duration: `${duration}s`,
        timestamp: endTime.toISOString(),
      });
    } else {
      console.error(
        `❌ [${endTime.toISOString()}] Erro no sync: ${response.status} ${response.statusText}`
      );
      console.error(`⏱️ Duração até erro: ${duration}s`);
    }
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
