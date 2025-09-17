/**
 * Singleton do Prisma Client
 * Garante uma única instância e gerencia conexões eficientemente
 */

import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Tipo para o Prisma Client extendido
type PrismaClientSingleton = PrismaClient & {
  isConnected?: boolean;
};

// Declaração global para evitar múltiplas instâncias em desenvolvimento
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientSingleton | undefined;
}

// Configurações otimizadas do Prisma
const prismaClientOptions = {
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn'] as ('query' | 'error' | 'warn')[]
    : ['error'] as ('error')[],
  errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' as const : 'minimal' as const,
};

class PrismaService {
  private static instance: PrismaClientSingleton;
  private static connectionPromise: Promise<void> | null = null;

  /**
   * Obtém a instância singleton do Prisma Client
   */
  static getInstance(): PrismaClientSingleton {
    if (!PrismaService.instance) {
      // Em desenvolvimento, usa a instância global para hot reload
      if (process.env.NODE_ENV === 'development') {
        if (!global.prisma) {
          global.prisma = new PrismaClient(prismaClientOptions);
          PrismaService.configureLogging(global.prisma);
        }
        PrismaService.instance = global.prisma;
      } else {
        // Em produção, cria nova instância
        PrismaService.instance = new PrismaClient(prismaClientOptions);
        PrismaService.configureLogging(PrismaService.instance);
      }

      // Configurar hooks de lifecycle
      PrismaService.configureHooks();
    }

    return PrismaService.instance;
  }

  /**
   * Configura logging do Prisma para usar nosso logger centralizado
   */
  private static configureLogging(client: PrismaClientSingleton): void {
    // @ts-ignore - Acessando propriedade interna do Prisma
    client.$on('query' as never, (e: any) => {
      if (process.env.NODE_ENV === 'development') {
        logger.db('QUERY', e.target, {
          duration: e.duration,
          query: e.query,
          params: e.params,
        });
      }
    });

    // @ts-ignore
    client.$on('error' as never, (e: any) => {
      logger.error('PRISMA', 'Database error', e);
    });

    // @ts-ignore
    client.$on('warn' as never, (e: any) => {
      logger.warn('PRISMA', 'Database warning', e);
    });
  }

  /**
   * Configura hooks de lifecycle
   */
  private static configureHooks(): void {
    // Desconectar ao encerrar o processo
    process.on('beforeExit', async () => {
      await PrismaService.disconnect();
    });

    process.on('SIGINT', async () => {
      await PrismaService.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await PrismaService.disconnect();
      process.exit(0);
    });
  }

  /**
   * Conecta explicitamente ao banco
   */
  static async connect(): Promise<void> {
    if (PrismaService.instance?.isConnected) {
      return;
    }

    if (PrismaService.connectionPromise) {
      return PrismaService.connectionPromise;
    }

    const client = PrismaService.getInstance();

    PrismaService.connectionPromise = client.$connect()
      .then(() => {
        client.isConnected = true;
        logger.info('PRISMA', 'Database connected successfully');
      })
      .catch((error) => {
        logger.error('PRISMA', 'Failed to connect to database', error);
        throw error;
      })
      .finally(() => {
        PrismaService.connectionPromise = null;
      });

    return PrismaService.connectionPromise;
  }

  /**
   * Desconecta do banco
   */
  static async disconnect(): Promise<void> {
    if (PrismaService.instance && PrismaService.instance.isConnected) {
      await PrismaService.instance.$disconnect();
      PrismaService.instance.isConnected = false;
      logger.info('PRISMA', 'Database disconnected');
    }
  }

  /**
   * Verifica a saúde da conexão
   */
  static async checkHealth(): Promise<{
    status: 'healthy' | 'unhealthy';
    latency?: number;
    error?: string;
  }> {
    try {
      const startTime = Date.now();
      const client = PrismaService.getInstance();

      // Query simples para testar conexão
      await client.$queryRaw`SELECT 1`;

      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        latency,
      };
    } catch (error) {
      logger.error('PRISMA', 'Health check failed', error);
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Executa uma transação com retry automático
   */
  static async transaction<T>(
    fn: (prisma: any) => Promise<T>,
    options?: {
      maxRetries?: number;
      timeout?: number;
    }
  ): Promise<T> {
    const client = PrismaService.getInstance();
    const maxRetries = options?.maxRetries || 3;
    const timeout = options?.timeout || 5000;

    let lastError: Error | undefined;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await client.$transaction(fn, {
          timeout,
          isolationLevel: 'ReadCommitted',
        });
      } catch (error) {
        lastError = error as Error;
        logger.warn('PRISMA', `Transaction failed, retry ${i + 1}/${maxRetries}`, {
          error: lastError.message,
        });

        // Aguardar antes de tentar novamente (backoff exponencial)
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }

    throw lastError;
  }

  /**
   * Limpa o cache de queries (útil em desenvolvimento)
   */
  static async clearQueryCache(): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      const client = PrismaService.getInstance();
      // @ts-ignore - Acessando método interno
      await client.$executeRaw`SELECT pg_stat_reset()`;
      logger.info('PRISMA', 'Query cache cleared');
    }
  }
}

// Exportar a instância singleton
export const prisma = PrismaService.getInstance();

// Exportar funções utilitárias
export const {
  connect: connectDB,
  disconnect: disconnectDB,
  checkHealth: checkDBHealth,
  transaction: dbTransaction,
  clearQueryCache,
} = PrismaService;

// Exportar o serviço completo para casos avançados
export default PrismaService;