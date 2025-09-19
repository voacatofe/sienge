const cron = require('node-cron');

// Configuração
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const SYNC_TIME = process.env.SYNC_SCHEDULE || '0 2 * * *'; // 2:00 AM todos os dias

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
  '/cost-centers',
  '/accounts-statements',
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
    // FASE 1: Sincronizar dados Bronze (API Sienge)
    console.log('\n📊 FASE 1: Sincronizando dados Bronze...');

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
            '/accounts-statements',
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
          } else if (endpoint === '/accounts-statements') {
            params.append('startDate', dateFilter);
            params.append('endDate', new Date().toISOString().split('T')[0]);
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
            phase: 'bronze',
            endpoint,
            success: true,
            records: recordCount,
          });
          totalSuccess++;
          console.log(`✅ ${endpoint}: ${recordCount} registros`);
        } else {
          results.push({
            phase: 'bronze',
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
          phase: 'bronze',
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

    // FASE 2: Refresh do Data Warehouse (Silver e Gold)
    if (totalErrors === 0 || totalSuccess > 0) {
      console.log('\n🏗️ FASE 2: Atualizando Data Warehouse (Silver → Gold)...');

      try {
        const refreshResponse = await fetch(
          `${APP_URL}/api/datawarehouse/refresh`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Daily-Sync-Script/1.0',
            },
            body: JSON.stringify({
              schema: 'all',
              concurrent: true,
              force: false,
            }),
          }
        );

        if (refreshResponse.ok) {
          const refreshResult = await refreshResponse.json();
          const summary = refreshResult.data.summary;

          results.push({
            phase: 'datawarehouse',
            endpoint: 'refresh_all_views',
            success: true,
            records: summary.totalRecords,
            duration: summary.duration,
            details: `${summary.successful}/${summary.totalViews} views atualizadas`,
          });

          console.log(
            `✅ Data Warehouse atualizado: ${summary.successful}/${summary.totalViews} views`
          );
          console.log(
            `📊 Total de registros processados: ${summary.totalRecords.toLocaleString()}`
          );
          console.log(`⏱️ Duração do refresh: ${summary.duration}`);

          if (summary.errors > 0) {
            console.log(
              `⚠️ ${summary.errors} views com erro - verifique os logs`
            );
          }
        } else {
          const errorText = await refreshResponse.text();
          results.push({
            phase: 'datawarehouse',
            endpoint: 'refresh_all_views',
            success: false,
            error: `${refreshResponse.status} ${refreshResponse.statusText}: ${errorText}`,
          });
          totalErrors++;
          console.log(
            `❌ Erro no refresh do Data Warehouse: ${refreshResponse.status} ${refreshResponse.statusText}`
          );
        }
      } catch (error) {
        results.push({
          phase: 'datawarehouse',
          endpoint: 'refresh_all_views',
          success: false,
          error: error.message,
        });
        totalErrors++;
        console.log(`💥 Erro no refresh do Data Warehouse: ${error.message}`);
      }
    } else {
      console.log(
        '\n⚠️ Pulando refresh do Data Warehouse devido a muitos erros na sincronização Bronze'
      );
    }

    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);

    // Contar resultados por fase
    const bronzeResults = results.filter(r => r.phase === 'bronze');
    const bronzeSuccess = bronzeResults.filter(r => r.success).length;
    const bronzeErrors = bronzeResults.filter(r => !r.success).length;

    const dwResults = results.filter(r => r.phase === 'datawarehouse');
    const dwSuccess = dwResults.filter(r => r.success).length;
    const dwErrors = dwResults.filter(r => !r.success).length;

    console.log(
      `\n📊 [${endTime.toISOString()}] Sincronização completa finalizada (${duration}s)`
    );
    console.log(`\n📋 RESUMO POR FASE:`);
    console.log(
      `   📦 Bronze (API): ${bronzeSuccess}✅ / ${bronzeErrors}❌ (${SYNC_ENDPOINTS.length} endpoints)`
    );
    console.log(`   🏗️ Data Warehouse: ${dwSuccess}✅ / ${dwErrors}❌`);
    console.log(`\n📈 TOTAIS:`);
    console.log(`   ✅ Sucessos gerais: ${totalSuccess + dwSuccess}`);
    console.log(`   ❌ Erros gerais: ${totalErrors}`);
    console.log(`   ⏱️ Duração total: ${duration}s`);

    const totalPhases = (bronzeSuccess > 0 ? 1 : 0) + (dwSuccess > 0 ? 1 : 0);
    const maxPhases = 2;
    console.log(`   📊 Fases concluídas: ${totalPhases}/${maxPhases}`);

    // Detalhes dos registros processados
    const totalBronzeRecords = bronzeResults.reduce(
      (sum, r) => sum + (r.records || 0),
      0
    );
    const totalDwRecords = dwResults.reduce(
      (sum, r) => sum + (r.records || 0),
      0
    );

    if (totalBronzeRecords > 0) {
      console.log(
        `   📊 Registros Bronze: ${totalBronzeRecords.toLocaleString()}`
      );
    }
    if (totalDwRecords > 0) {
      console.log(
        `   📊 Registros Data Warehouse: ${totalDwRecords.toLocaleString()}`
      );
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
