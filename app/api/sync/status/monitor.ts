import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withErrorHandler } from '@/lib/api-response';
import { createContextLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma-singleton';

const monitorLogger = createContextLogger('SYNC_MONITOR');

interface SyncStatus {
  phase: 'bronze' | 'silver' | 'gold' | 'datawarehouse';
  lastSync?: Date;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  details: string;
  recordsProcessed?: number;
  duration?: string;
}

interface HealthCheck {
  overall: 'healthy' | 'warning' | 'critical';
  lastFullSync?: Date;
  phases: SyncStatus[];
  alerts: string[];
  metrics: {
    totalRecords: number;
    avgDailyRecords: number;
    lastSyncDuration: string;
    uptime: string;
  };
}

/**
 * Calcula status baseado na última sincronização
 */
function calculateStatus(
  lastSync: Date | null,
  maxAgeHours: number = 25
): {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  details: string;
} {
  if (!lastSync) {
    return {
      status: 'unknown',
      details: 'Nenhuma sincronização encontrada',
    };
  }

  const now = new Date();
  const hoursSinceSync =
    (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

  if (hoursSinceSync <= maxAgeHours) {
    return {
      status: 'healthy',
      details: `Última sincronização há ${Math.round(hoursSinceSync)} horas`,
    };
  } else if (hoursSinceSync <= maxAgeHours * 2) {
    return {
      status: 'warning',
      details: `Sincronização atrasada há ${Math.round(hoursSinceSync)} horas`,
    };
  } else {
    return {
      status: 'critical',
      details: `Sincronização crítica: há ${Math.round(hoursSinceSync)} horas sem atualização`,
    };
  }
}

/**
 * Obtém status da camada Bronze (dados brutos da API)
 */
async function getBronzeStatus(): Promise<SyncStatus> {
  try {
    const lastBronzeSync = await prisma.syncLog.findFirst({
      where: {
        entityType: {
          in: [
            'customers',
            'companies',
            'sales-contracts',
            'units',
            'enterprises',
            'accounts-statements',
            'cost-centers',
            'payment-categories',
          ],
        },
        status: {
          in: ['completed', 'completed_with_errors'],
        },
      },
      orderBy: {
        syncCompletedAt: 'desc',
      },
    });

    const statusInfo = calculateStatus(lastBronzeSync?.syncCompletedAt || null);

    return {
      phase: 'bronze',
      lastSync: lastBronzeSync?.syncCompletedAt || undefined,
      status: statusInfo.status,
      details: statusInfo.details,
      recordsProcessed: lastBronzeSync?.recordsProcessed || 0,
      duration: lastBronzeSync
        ? calculateDuration(
            lastBronzeSync.syncStartedAt,
            lastBronzeSync.syncCompletedAt
          )
        : undefined,
    };
  } catch (error) {
    monitorLogger.error('Error getting Bronze status', error);
    return {
      phase: 'bronze',
      status: 'critical',
      details: 'Erro ao verificar status do Bronze',
    };
  }
}

/**
 * Obtém status das views Silver
 */
async function getSilverStatus(): Promise<SyncStatus> {
  try {
    const lastSilverRefresh = await prisma.syncLog.findFirst({
      where: {
        entityType: {
          startsWith: 'REFRESH_VIEW_silver.',
        },
      },
      orderBy: {
        syncCompletedAt: 'desc',
      },
    });

    const statusInfo = calculateStatus(
      lastSilverRefresh?.syncCompletedAt || null
    );

    return {
      phase: 'silver',
      lastSync: lastSilverRefresh?.syncCompletedAt || undefined,
      status: statusInfo.status,
      details: statusInfo.details,
      recordsProcessed: lastSilverRefresh?.recordsProcessed || 0,
      duration: lastSilverRefresh
        ? calculateDuration(
            lastSilverRefresh.syncStartedAt,
            lastSilverRefresh.syncCompletedAt
          )
        : undefined,
    };
  } catch (error) {
    monitorLogger.error('Error getting Silver status', error);
    return {
      phase: 'silver',
      status: 'critical',
      details: 'Erro ao verificar status do Silver',
    };
  }
}

/**
 * Obtém status das views Gold
 */
async function getGoldStatus(): Promise<SyncStatus> {
  try {
    const lastGoldRefresh = await prisma.syncLog.findFirst({
      where: {
        entityType: {
          startsWith: 'REFRESH_VIEW_gold.',
        },
      },
      orderBy: {
        syncCompletedAt: 'desc',
      },
    });

    const statusInfo = calculateStatus(
      lastGoldRefresh?.syncCompletedAt || null
    );

    return {
      phase: 'gold',
      lastSync: lastGoldRefresh?.syncCompletedAt || undefined,
      status: statusInfo.status,
      details: statusInfo.details,
      recordsProcessed: lastGoldRefresh?.recordsProcessed || 0,
      duration: lastGoldRefresh
        ? calculateDuration(
            lastGoldRefresh.syncStartedAt,
            lastGoldRefresh.syncCompletedAt
          )
        : undefined,
    };
  } catch (error) {
    monitorLogger.error('Error getting Gold status', error);
    return {
      phase: 'gold',
      status: 'critical',
      details: 'Erro ao verificar status do Gold',
    };
  }
}

/**
 * Obtém status do refresh completo do Data Warehouse
 */
async function getDataWarehouseStatus(): Promise<SyncStatus> {
  try {
    const lastDwRefresh = await prisma.syncLog.findFirst({
      where: {
        entityType: {
          startsWith: 'DATAWAREHOUSE_REFRESH_',
        },
      },
      orderBy: {
        syncCompletedAt: 'desc',
      },
    });

    const statusInfo = calculateStatus(lastDwRefresh?.syncCompletedAt || null);

    return {
      phase: 'datawarehouse',
      lastSync: lastDwRefresh?.syncCompletedAt || undefined,
      status: statusInfo.status,
      details: statusInfo.details,
      recordsProcessed: lastDwRefresh?.recordsProcessed || 0,
      duration: lastDwRefresh
        ? calculateDuration(
            lastDwRefresh.syncStartedAt,
            lastDwRefresh.syncCompletedAt
          )
        : undefined,
    };
  } catch (error) {
    monitorLogger.error('Error getting DataWarehouse status', error);
    return {
      phase: 'datawarehouse',
      status: 'critical',
      details: 'Erro ao verificar status do Data Warehouse',
    };
  }
}

/**
 * Calcula duração entre duas datas
 */
function calculateDuration(startDate: Date, endDate: Date | null): string {
  if (!endDate) return 'N/A';

  const duration = endDate.getTime() - startDate.getTime();
  const seconds = Math.round(duration / 1000);

  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.round(minutes / 60);
  return `${hours}h`;
}

/**
 * Calcula métricas gerais
 */
async function calculateMetrics(): Promise<HealthCheck['metrics']> {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentSyncs = await prisma.syncLog.findMany({
      where: {
        syncCompletedAt: {
          gte: weekAgo,
        },
        status: {
          in: ['completed', 'completed_with_errors'],
        },
      },
    });

    const totalRecords = recentSyncs.reduce(
      (sum, sync) => sum + (sync.recordsProcessed || 0),
      0
    );
    const avgDailyRecords = Math.round(totalRecords / 7);

    const lastSync = await prisma.syncLog.findFirst({
      where: {
        syncCompletedAt: { not: null },
      },
      orderBy: {
        syncCompletedAt: 'desc',
      },
    });

    const lastSyncDuration =
      lastSync && lastSync.syncCompletedAt
        ? calculateDuration(lastSync.syncStartedAt, lastSync.syncCompletedAt)
        : 'N/A';

    const firstSync = await prisma.syncLog.findFirst({
      orderBy: {
        syncStartedAt: 'asc',
      },
    });

    const uptime = firstSync
      ? calculateDuration(firstSync.syncStartedAt, new Date())
      : 'N/A';

    return {
      totalRecords,
      avgDailyRecords,
      lastSyncDuration,
      uptime,
    };
  } catch (error) {
    monitorLogger.error('Error calculating metrics', error);
    return {
      totalRecords: 0,
      avgDailyRecords: 0,
      lastSyncDuration: 'N/A',
      uptime: 'N/A',
    };
  }
}

/**
 * Função principal para obter status de monitoramento
 */
export async function getMonitoringStatus(
  detailed: boolean = false
): Promise<HealthCheck> {
  const [bronzeStatus, silverStatus, goldStatus, dwStatus] = await Promise.all([
    getBronzeStatus(),
    getSilverStatus(),
    getGoldStatus(),
    getDataWarehouseStatus(),
  ]);

  const phases = [bronzeStatus, silverStatus, goldStatus, dwStatus];

  const criticalPhases = phases.filter(p => p.status === 'critical');
  const warningPhases = phases.filter(p => p.status === 'warning');

  let overall: HealthCheck['overall'];
  if (criticalPhases.length > 0) {
    overall = 'critical';
  } else if (warningPhases.length > 0) {
    overall = 'warning';
  } else {
    overall = 'healthy';
  }

  const alerts: string[] = [];
  criticalPhases.forEach(phase => {
    alerts.push(`⚠️ ${phase.phase.toUpperCase()}: ${phase.details}`);
  });
  warningPhases.forEach(phase => {
    alerts.push(`⚡ ${phase.phase.toUpperCase()}: ${phase.details}`);
  });

  const lastFullSync = phases
    .map(p => p.lastSync)
    .filter(Boolean)
    .sort((a, b) => b!.getTime() - a!.getTime())[0];

  const metrics = await calculateMetrics();

  return {
    overall,
    lastFullSync,
    phases,
    alerts,
    metrics,
  };
}
