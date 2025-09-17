import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withErrorHandler, validateRequiredParams } from '@/lib/api-response';
import { createContextLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma-singleton';

const statusLogger = createContextLogger('SYNC_STATUS');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SyncStatus {
  id: number;
  status: string;
  isRunning: boolean;
  progress: number;
  recordsProcessed: number;
  recordsInserted: number;
  recordsUpdated: number;
  recordsErrors: number;
  apiCallsMade: number;
  startedAt: Date;
  completedAt: Date | null;
  duration: number;
  entityType: string;
  errorMessage?: string | null;
}

/**
 * Calcula estatísticas e progresso da sincronização
 */
function calculateSyncStats(syncLog: any): SyncStatus {
  const isRunning = syncLog.status === 'in_progress';

  // Calcular progresso baseado em registros processados vs total estimado
  let progress = 0;
  if (syncLog.recordsProcessed > 0) {
    const totalAttempted = syncLog.recordsProcessed + syncLog.recordsErrors;
    progress = totalAttempted > 0 ? Math.round((syncLog.recordsProcessed / totalAttempted) * 100) : 0;
  }

  // Calcular duração em minutos
  const duration = syncLog.syncCompletedAt
    ? Math.round((syncLog.syncCompletedAt.getTime() - syncLog.syncStartedAt.getTime()) / 1000 / 60)
    : Math.round((Date.now() - syncLog.syncStartedAt.getTime()) / 1000 / 60);

  return {
    id: syncLog.id,
    status: syncLog.status,
    isRunning,
    progress,
    recordsProcessed: syncLog.recordsProcessed,
    recordsInserted: syncLog.recordsInserted,
    recordsUpdated: syncLog.recordsUpdated,
    recordsErrors: syncLog.recordsErrors,
    apiCallsMade: syncLog.apiCallsMade,
    startedAt: syncLog.syncStartedAt,
    completedAt: syncLog.syncCompletedAt,
    duration,
    entityType: syncLog.entityType,
    errorMessage: syncLog.errorMessage
  };
}

/**
 * Busca status da sincronização mais recente (GET)
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType') || 'batch_sync';
    const limit = parseInt(searchParams.get('limit') || '1');

    statusLogger.debug('Fetching sync status', {
      entityType,
      limit
    });

    // Buscar logs de sincronização
    const syncLogs = await prisma.syncLog.findMany({
      where: entityType !== 'all' ? { entityType } : {},
      orderBy: {
        syncStartedAt: 'desc',
      },
      take: limit,
    });

    if (syncLogs.length === 0) {
      statusLogger.info('No sync logs found', { entityType });

      return apiSuccess(
        { syncs: [], hasSync: false },
        'Nenhuma sincronização encontrada',
        { entityType, searchCriteria: 'recent' }
      );
    }

    // Calcular estatísticas para cada sync
    const syncsWithStats = syncLogs.map(calculateSyncStats);
    const latestSync = syncsWithStats[0];

    // Estatísticas gerais
    const runningSyncs = syncsWithStats.filter(s => s.isRunning).length;
    const totalRecordsProcessed = syncsWithStats.reduce((sum, s) => sum + s.recordsProcessed, 0);
    const totalErrors = syncsWithStats.reduce((sum, s) => sum + s.recordsErrors, 0);

    statusLogger.info('Sync status retrieved', {
      entityType,
      totalSyncs: syncsWithStats.length,
      runningSyncs,
      latestStatus: latestSync.status
    });

    return apiSuccess(
      {
        hasSync: true,
        syncs: syncsWithStats,
        latest: latestSync,
        summary: {
          totalSyncs: syncsWithStats.length,
          runningSyncs,
          totalRecordsProcessed,
          totalErrors,
          successRate: totalRecordsProcessed > 0 ?
            Math.round(((totalRecordsProcessed - totalErrors) / totalRecordsProcessed) * 100) : 0
        }
      },
      `Status de sincronização obtido - ${syncsWithStats.length} registros encontrados`,
      {
        entityType,
        limit,
        performance: {
          queryTime: Date.now() - Date.now() // Will be minimal
        }
      },
      'short' // Cache por 1 minuto
    );
  }, 'SYNC_STATUS_GET');
}

/**
 * Controla sincronização (POST) - cancelar, pausar, retomar
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const body = await request.json();

    // Validar parâmetros obrigatórios
    const validation = validateRequiredParams(body, ['action']);
    if (!validation.valid) {
      return apiError(
        'VALIDATION_ERROR',
        `Parâmetros obrigatórios ausentes: ${validation.missing?.join(', ')}`,
        400
      );
    }

    const { action, entityType, syncId } = body;

    statusLogger.info('Processing sync control action', {
      action,
      entityType,
      syncId
    });

    switch (action) {
      case 'cancel':
        return await cancelSyncOperation(entityType, syncId);

      case 'retry':
        return await retrySyncOperation(syncId);

      case 'clear_errors':
        return await clearSyncErrors(entityType);

      default:
        return apiError(
          'INVALID_ACTION',
          `Ação '${action}' não reconhecida. Ações válidas: cancel, retry, clear_errors`,
          400
        );
    }
  }, 'SYNC_STATUS_POST');
}

/**
 * Cancela sincronização em andamento
 */
async function cancelSyncOperation(entityType?: string, syncId?: number) {
  let whereClause: any = { status: 'in_progress' };

  if (syncId) {
    whereClause.id = syncId;
  } else if (entityType) {
    whereClause.entityType = entityType;
  } else {
    whereClause.entityType = 'batch_sync';
  }

  const runningSyncs = await prisma.syncLog.findMany({
    where: whereClause,
    orderBy: { syncStartedAt: 'desc' },
  });

  if (runningSyncs.length === 0) {
    statusLogger.warn('No running sync found for cancellation', { entityType, syncId });
    return apiError(
      'NOT_FOUND',
      'Nenhuma sincronização em andamento encontrada',
      404
    );
  }

  // Cancelar todas as sincronizações encontradas
  const cancelledIds = [];
  for (const sync of runningSyncs) {
    await prisma.syncLog.update({
      where: { id: sync.id },
      data: {
        status: 'cancelled',
        syncCompletedAt: new Date(),
        errorMessage: 'Sincronização cancelada pelo usuário'
      },
    });
    cancelledIds.push(sync.id);
  }

  statusLogger.info('Sync operations cancelled', {
    cancelledIds,
    count: cancelledIds.length
  });

  return apiSuccess(
    {
      cancelledSyncs: cancelledIds,
      count: cancelledIds.length
    },
    `${cancelledIds.length} sincronização(ões) cancelada(s) com sucesso`
  );
}

/**
 * Retentar sincronização com erro
 */
async function retrySyncOperation(syncId: number) {
  if (!syncId) {
    return apiError(
      'VALIDATION_ERROR',
      'ID da sincronização é obrigatório para retry',
      400
    );
  }

  const syncLog = await prisma.syncLog.findUnique({
    where: { id: syncId }
  });

  if (!syncLog) {
    return apiError(
      'NOT_FOUND',
      'Sincronização não encontrada',
      404
    );
  }

  if (syncLog.status === 'in_progress') {
    return apiError(
      'CONFLICT',
      'Não é possível retentar uma sincronização em andamento',
      409
    );
  }

  // Resetar status para permitir nova tentativa
  await prisma.syncLog.update({
    where: { id: syncId },
    data: {
      status: 'pending',
      syncCompletedAt: null,
      recordsErrors: 0,
      errorMessage: null
    }
  });

  statusLogger.info('Sync marked for retry', { syncId });

  return apiSuccess(
    { syncId, newStatus: 'pending' },
    'Sincronização marcada para nova tentativa'
  );
}

/**
 * Limpar logs de erro
 */
async function clearSyncErrors(entityType?: string) {
  let whereClause: any = {
    status: { in: ['completed_with_errors', 'failed', 'cancelled'] }
  };

  if (entityType && entityType !== 'all') {
    whereClause.entityType = entityType;
  }

  const deletedCount = await prisma.syncLog.deleteMany({
    where: whereClause
  });

  statusLogger.info('Sync error logs cleared', {
    deletedCount: deletedCount.count,
    entityType
  });

  return apiSuccess(
    { deletedCount: deletedCount.count },
    `${deletedCount.count} logs de erro removidos`
  );
}