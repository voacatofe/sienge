/**
 * Gerenciador de cache para APIs do datawarehouse
 * Implementa cache em memória com TTL e invalidação inteligente
 */

import { createContextLogger } from '@/lib/logger';

const logger = createContextLogger('cache-manager');

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
  size: number; // Tamanho aproximado em bytes
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  oldestEntry?: number;
  newestEntry?: number;
}

export interface CacheConfig {
  maxSize: number; // Tamanho máximo em bytes
  maxEntries: number; // Número máximo de entradas
  defaultTtl: number; // TTL padrão em milissegundos
  cleanupInterval: number; // Intervalo de limpeza em milissegundos
}

export class CacheManager {
  private static instance: CacheManager;
  private cache = new Map<string, CacheEntry>();
  private stats = {
    hits: 0,
    misses: 0,
    totalSize: 0,
  };
  private config: CacheConfig;
  private cleanupTimer?: NodeJS.Timeout;

  private constructor(config?: Partial<CacheConfig>) {
    this.config = {
      maxSize: 100 * 1024 * 1024, // 100MB por padrão
      maxEntries: 1000,
      defaultTtl: 5 * 60 * 1000, // 5 minutos por padrão
      cleanupInterval: 60 * 1000, // 1 minuto
      ...config,
    };

    this.startCleanupTimer();
    logger.info('Cache manager initialized', this.config);
  }

  public static getInstance(config?: Partial<CacheConfig>): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(config);
    }
    return CacheManager.instance;
  }

  /**
   * Armazena dados no cache
   */
  public set<T>(key: string, data: T, ttl?: number): void {
    try {
      const size = this.calculateSize(data);
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.config.defaultTtl,
        key,
        size,
      };

      // Verificar se precisa fazer limpeza antes de adicionar
      this.ensureCapacity(size);

      // Remover entrada existente se houver
      if (this.cache.has(key)) {
        const existing = this.cache.get(key)!;
        this.stats.totalSize -= existing.size;
      }

      this.cache.set(key, entry);
      this.stats.totalSize += size;

      logger.debug(`Cache SET: ${key} (${size} bytes, TTL: ${entry.ttl}ms)`);
    } catch (error) {
      logger.error('Error setting cache entry', error, { key });
    }
  }

  /**
   * Recupera dados do cache
   */
  public get<T>(key: string): T | null {
    try {
      const entry = this.cache.get(key);

      if (!entry) {
        this.stats.misses++;
        logger.debug(`Cache MISS: ${key}`);
        return null;
      }

      // Verificar se expirou
      if (this.isExpired(entry)) {
        this.delete(key);
        this.stats.misses++;
        logger.debug(`Cache EXPIRED: ${key}`);
        return null;
      }

      this.stats.hits++;
      logger.debug(`Cache HIT: ${key}`);
      return entry.data as T;
    } catch (error) {
      logger.error('Error getting cache entry', error, { key });
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Remove uma entrada do cache
   */
  public delete(key: string): boolean {
    try {
      const entry = this.cache.get(key);
      if (entry) {
        this.cache.delete(key);
        this.stats.totalSize -= entry.size;
        logger.debug(`Cache DELETE: ${key}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error deleting cache entry', error, { key });
      return false;
    }
  }

  /**
   * Verifica se uma chave existe no cache (sem afetar estatísticas)
   */
  public has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? !this.isExpired(entry) : false;
  }

  /**
   * Limpa todo o cache
   */
  public clear(): void {
    try {
      const entriesCount = this.cache.size;
      this.cache.clear();
      this.stats.totalSize = 0;
      logger.info(`Cache cleared: ${entriesCount} entries removed`);
    } catch (error) {
      logger.error('Error clearing cache', error);
    }
  }

  /**
   * Invalida entradas por padrão de chave
   */
  public invalidatePattern(pattern: string | RegExp): number {
    try {
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      let invalidated = 0;

      for (const [key, entry] of this.cache.entries()) {
        if (regex.test(key)) {
          this.cache.delete(key);
          this.stats.totalSize -= entry.size;
          invalidated++;
        }
      }

      logger.info(`Cache invalidated by pattern: ${invalidated} entries`, {
        pattern: pattern.toString(),
      });
      return invalidated;
    } catch (error) {
      logger.error('Error invalidating cache by pattern', error, { pattern });
      return 0;
    }
  }

  /**
   * Invalida cache por tabela do schema gold
   */
  public invalidateGoldTable(tableName: string): number {
    const pattern = new RegExp(`^gold:${tableName}:`);
    return this.invalidatePattern(pattern);
  }

  /**
   * Obtém estatísticas do cache
   */
  public getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const total = this.stats.hits + this.stats.misses;

    return {
      totalEntries: this.cache.size,
      totalSize: this.stats.totalSize,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
      missRate: total > 0 ? (this.stats.misses / total) * 100 : 0,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      oldestEntry:
        entries.length > 0
          ? Math.min(...entries.map(e => e.timestamp))
          : undefined,
      newestEntry:
        entries.length > 0
          ? Math.max(...entries.map(e => e.timestamp))
          : undefined,
    };
  }

  /**
   * Gera chave de cache para queries do gold schema
   */
  public static generateGoldCacheKey(
    table: string,
    filters: Record<string, any> = {},
    options: Record<string, any> = {}
  ): string {
    const filterStr = Object.keys(filters)
      .sort()
      .map(key => `${key}:${filters[key]}`)
      .join('|');

    const optionsStr = Object.keys(options)
      .sort()
      .map(key => `${key}:${options[key]}`)
      .join('|');

    const parts = ['gold', table];
    if (filterStr) parts.push(`f:${filterStr}`);
    if (optionsStr) parts.push(`o:${optionsStr}`);

    return parts.join(':');
  }

  /**
   * Wrapper para cache de queries com fallback
   */
  public async cacheQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Tentar buscar do cache primeiro
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    try {
      // Executar query
      const result = await queryFn();

      // Armazenar no cache
      this.set(key, result, ttl);

      return result;
    } catch (error) {
      logger.error('Error in cached query', error, { key });
      throw error;
    }
  }

  /**
   * Verifica se uma entrada expirou
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Calcula tamanho aproximado de um objeto
   */
  private calculateSize(data: any): number {
    try {
      return JSON.stringify(data).length * 2; // Aproximação: 2 bytes por caractere
    } catch {
      return 1000; // Fallback para objetos não serializáveis
    }
  }

  /**
   * Garante que há capacidade para nova entrada
   */
  private ensureCapacity(newEntrySize: number): void {
    // Verificar limite de tamanho
    while (
      this.stats.totalSize + newEntrySize > this.config.maxSize &&
      this.cache.size > 0
    ) {
      this.evictOldest();
    }

    // Verificar limite de entradas
    while (this.cache.size >= this.config.maxEntries) {
      this.evictOldest();
    }
  }

  /**
   * Remove a entrada mais antiga (LRU)
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
      logger.debug(`Cache evicted oldest entry: ${oldestKey}`);
    }
  }

  /**
   * Limpeza automática de entradas expiradas
   */
  private cleanup(): void {
    try {
      const before = this.cache.size;
      let cleaned = 0;

      for (const [key, entry] of this.cache.entries()) {
        if (this.isExpired(entry)) {
          this.cache.delete(key);
          this.stats.totalSize -= entry.size;
          cleaned++;
        }
      }

      if (cleaned > 0) {
        logger.debug(
          `Cache cleanup: ${cleaned} expired entries removed (${before} -> ${this.cache.size})`
        );
      }
    } catch (error) {
      logger.error('Error during cache cleanup', error);
    }
  }

  /**
   * Inicia timer de limpeza automática
   */
  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Para o timer de limpeza
   */
  public destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    this.clear();
    logger.info('Cache manager destroyed');
  }
}

// Exportar instância singleton com configuração padrão para datawarehouse
export const cacheManager = CacheManager.getInstance({
  maxSize: 200 * 1024 * 1024, // 200MB para datawarehouse
  maxEntries: 2000,
  defaultTtl: 10 * 60 * 1000, // 10 minutos para dados analíticos
  cleanupInterval: 2 * 60 * 1000, // Limpeza a cada 2 minutos
});

// Exportar classe e tipos
export { CacheManager };
export type { CacheEntry, CacheStats, CacheConfig };
