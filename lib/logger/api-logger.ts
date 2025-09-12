import { prisma } from '@/lib/prisma';

// Tipos para logging
export interface ApiLogEntry {
  id?: number;
  timestamp: Date;
  method: string;
  url: string;
  statusCode?: number;
  responseTime?: number;
  requestSize?: number;
  responseSize?: number;
  errorMessage?: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  totalResponseTime: number;
  rateLimitHits: number;
  lastRequestAt?: Date;
  lastErrorAt?: Date;
  errorsByStatus: Record<number, number>;
  requestsByMethod: Record<string, number>;
  requestsByEndpoint: Record<string, number>;
}

export interface SyncLogEntry {
  id?: number;
  entityType: string;
  syncStartedAt: Date;
  syncCompletedAt?: Date;
  recordsProcessed: number;
  recordsInserted: number;
  recordsUpdated: number;
  recordsErrors: number;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  errorMessage?: string;
  apiCallsMade: number;
  duration?: number;
}

// Classe principal de logging
export class ApiLogger {
  private static instance: ApiLogger;
  private metrics: ApiMetrics;
  private logBuffer: ApiLogEntry[] = [];
  private readonly bufferSize = 100;
  private readonly flushInterval = 30000; // 30 segundos

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.startFlushTimer();
  }

  public static getInstance(): ApiLogger {
    if (!ApiLogger.instance) {
      ApiLogger.instance = new ApiLogger();
    }
    return ApiLogger.instance;
  }

  private initializeMetrics(): ApiMetrics {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalResponseTime: 0,
      rateLimitHits: 0,
      errorsByStatus: {},
      requestsByMethod: {},
      requestsByEndpoint: {},
    };
  }

  private startFlushTimer(): void {
    setInterval(() => {
      this.flushLogs();
    }, this.flushInterval);
  }

  // Log de requisição
  public logRequest(entry: Omit<ApiLogEntry, 'timestamp'>): void {
    const logEntry: ApiLogEntry = {
      ...entry,
      timestamp: new Date(),
    };

    this.logBuffer.push(logEntry);
    this.updateMetrics(logEntry);

    // Log no console para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${entry.method} ${entry.url} - ${entry.statusCode || 'pending'}`);
    }

    // Flush se buffer estiver cheio
    if (this.logBuffer.length >= this.bufferSize) {
      this.flushLogs();
    }
  }

  // Log de erro
  public logError(entry: Omit<ApiLogEntry, 'timestamp' | 'errorMessage'> & { errorMessage: string }): void {
    const logEntry: ApiLogEntry = {
      ...entry,
      timestamp: new Date(),
    };

    this.logBuffer.push(logEntry);
    this.updateMetrics(logEntry);

    // Log no console para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API ERROR] ${entry.method} ${entry.url} - ${entry.statusCode || 'unknown'}: ${entry.errorMessage}`);
    }

    // Flush imediatamente para erros
    this.flushLogs();
  }

  // Log de sincronização
  public async logSync(syncLog: SyncLogEntry): Promise<void> {
    try {
      await prisma.syncLog.create({
        data: {
          entityType: syncLog.entityType,
          syncStartedAt: syncLog.syncStartedAt,
          syncCompletedAt: syncLog.syncCompletedAt,
          recordsProcessed: syncLog.recordsProcessed,
          recordsInserted: syncLog.recordsInserted,
          recordsUpdated: syncLog.recordsUpdated,
          recordsErrors: syncLog.recordsErrors,
          status: syncLog.status,
          errorMessage: syncLog.errorMessage,
          apiCallsMade: syncLog.apiCallsMade,
        },
      });

      console.log(`[SYNC] ${syncLog.entityType}: ${syncLog.status} - ${syncLog.recordsProcessed} registros processados`);
    } catch (error) {
      console.error('Erro ao salvar log de sincronização:', error);
    }
  }

  // Atualizar métricas
  private updateMetrics(entry: ApiLogEntry): void {
    this.metrics.totalRequests++;
    
    if (entry.statusCode) {
      if (entry.statusCode >= 200 && entry.statusCode < 400) {
        this.metrics.successfulRequests++;
      } else {
        this.metrics.failedRequests++;
      }

      // Contar erros por status
      if (!this.metrics.errorsByStatus[entry.statusCode]) {
        this.metrics.errorsByStatus[entry.statusCode] = 0;
      }
      this.metrics.errorsByStatus[entry.statusCode]++;
    }

    if (entry.responseTime) {
      this.metrics.totalResponseTime += entry.responseTime;
      this.metrics.averageResponseTime = this.metrics.totalResponseTime / this.metrics.totalRequests;
    }

    // Contar por método
    if (!this.metrics.requestsByMethod[entry.method]) {
      this.metrics.requestsByMethod[entry.method] = 0;
    }
    this.metrics.requestsByMethod[entry.method]++;

    // Contar por endpoint
    const endpoint = this.extractEndpoint(entry.url);
    if (!this.metrics.requestsByEndpoint[endpoint]) {
      this.metrics.requestsByEndpoint[endpoint] = 0;
    }
    this.metrics.requestsByEndpoint[endpoint]++;

    // Atualizar timestamps
    this.metrics.lastRequestAt = entry.timestamp;
    if (entry.errorMessage) {
      this.metrics.lastErrorAt = entry.timestamp;
    }
  }

  // Extrair endpoint da URL
  private extractEndpoint(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return url;
    }
  }

  // Flush logs para banco de dados
  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0) {
      return;
    }

    const logsToFlush = [...this.logBuffer];
    this.logBuffer = [];

    try {
      // Aqui você implementaria o salvamento no banco de dados
      // Por enquanto, apenas log no console
      console.log(`[LOGGER] Flushing ${logsToFlush.length} log entries`);
      
      // TODO: Implementar salvamento no banco de dados
      // await prisma.apiLog.createMany({ data: logsToFlush });
    } catch (error) {
      console.error('Erro ao flush logs:', error);
      // Recolocar logs no buffer em caso de erro
      this.logBuffer.unshift(...logsToFlush);
    }
  }

  // Obter métricas
  public getMetrics(): ApiMetrics {
    return { ...this.metrics };
  }

  // Reset métricas
  public resetMetrics(): void {
    this.metrics = this.initializeMetrics();
  }

  // Obter logs recentes
  public getRecentLogs(count: number = 50): ApiLogEntry[] {
    return this.logBuffer.slice(-count);
  }

  // Log de rate limit hit
  public logRateLimitHit(): void {
    this.metrics.rateLimitHits++;
    console.warn('[API] Rate limit hit - request queued');
  }

  // Log de health check
  public logHealthCheck(status: 'healthy' | 'unhealthy', details?: string): void {
    const message = `[HEALTH] API Status: ${status}`;
    if (details) {
      console.log(`${message} - ${details}`);
    } else {
      console.log(message);
    }
  }
}

// Instância singleton
export const apiLogger = ApiLogger.getInstance();

// Funções de conveniência
export function logApiRequest(entry: Omit<ApiLogEntry, 'timestamp'>): void {
  apiLogger.logRequest(entry);
}

export function logApiError(entry: Omit<ApiLogEntry, 'timestamp' | 'errorMessage'> & { errorMessage: string }): void {
  apiLogger.logError(entry);
}

export function logSync(syncLog: SyncLogEntry): Promise<void> {
  return apiLogger.logSync(syncLog);
}

export function getApiMetrics(): ApiMetrics {
  return apiLogger.getMetrics();
}

export function logRateLimitHit(): void {
  apiLogger.logRateLimitHit();
}

export function logHealthCheck(status: 'healthy' | 'unhealthy', details?: string): void {
  apiLogger.logHealthCheck(status, details);
}
