#!/usr/bin/env node

/**
 * Script para parar sincronização em andamento
 * Execute com: node scripts/stop-sync.js
 */

const { PrismaClient } = require('@prisma/client');

async function stopSync() {
  const prisma = new PrismaClient();

  try {
    console.log('🛑 Procurando sincronizações em andamento...');

    // Buscar sincronização em andamento
    const runningSync = await prisma.syncLog.findFirst({
      where: {
        entityType: 'batch_sync',
        status: 'in_progress',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!runningSync) {
      console.log('✅ Nenhuma sincronização em andamento encontrada.');
      return;
    }

    console.log(`📊 Sincronização encontrada: ID ${runningSync.id}`);
    console.log(
      `   - Iniciada em: ${runningSync.createdAt.toLocaleString('pt-BR')}`
    );
    console.log(`   - Registros processados: ${runningSync.recordsProcessed}`);
    console.log(`   - Chamadas de API: ${runningSync.apiCallsMade}`);

    // Marcar como cancelada
    await prisma.syncLog.update({
      where: { id: runningSync.id },
      data: {
        status: 'cancelled',
        syncCompletedAt: new Date(),
      },
    });

    console.log('✅ Sincronização cancelada com sucesso!');
    console.log(
      '💡 Agora você pode reiniciar a sincronização com as novas otimizações.'
    );
  } catch (error) {
    console.error('❌ Erro ao cancelar sincronização:', error);
  } finally {
    await prisma.$disconnect();
  }
}

stopSync();
