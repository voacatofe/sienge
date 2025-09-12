import { PrismaClient } from '@prisma/client';

// Configurações de connection pooling
export const prismaConfig = {
  // Configurações de pooling
  connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '10'),
  poolTimeout: parseInt(process.env.DATABASE_POOL_TIMEOUT || '10000'),
  
  // Configurações de retry
  maxRetries: parseInt(process.env.DATABASE_MAX_RETRIES || '3'),
  retryDelay: parseInt(process.env.DATABASE_RETRY_DELAY || '1000'),
  
  // Configurações de timeout
  queryTimeout: parseInt(process.env.DATABASE_QUERY_TIMEOUT || '30000'),
  transactionTimeout: parseInt(process.env.DATABASE_TRANSACTION_TIMEOUT || '60000'),
};

// Construir URL de conexão com parâmetros de pooling
function buildDatabaseUrl(): string {
  const baseUrl = process.env.DATABASE_URL;
  if (!baseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }


  // Adicionar parâmetros de pooling se não estiverem presentes
  const url = new URL(baseUrl);
  
  // Adicionar parâmetros de pooling do Prisma
  url.searchParams.set('connection_limit', prismaConfig.connectionLimit.toString());
  url.searchParams.set('pool_timeout', prismaConfig.poolTimeout.toString());
  url.searchParams.set('connect_timeout', '10');
  url.searchParams.set('socket_timeout', '30');
  
  return url.toString();
}

// Configuração global do Prisma Client com connection pooling
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: buildDatabaseUrl(),
    },
  },
  // Configurações adicionais do Prisma
  errorFormat: 'pretty' as const,
});

// Em desenvolvimento, reutiliza a instância para evitar múltiplas conexões
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Função para desconectar o Prisma Client
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// Função para conectar o Prisma Client
export async function connectPrisma() {
  await prisma.$connect();
}

// Função para verificar a saúde da conexão
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', message: 'Database connection is working' };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export default prisma;
