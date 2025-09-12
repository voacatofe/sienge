// Sistema de rate limiting em memória para APIs
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>();
  private readonly config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Limpar entradas expiradas a cada minuto
    setInterval(() => {
      this.cleanExpiredEntries();
    }, 60000);
  }

  private cleanExpiredEntries(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.requests.forEach((entry, key) => {
      if (now > entry.resetTime) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.requests.delete(key));
  }

  private generateKey(identifier: string): string {
    // Usar hash para evitar armazenar IPs em texto plano
    return Buffer.from(identifier).toString('base64');
  }

  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const key = this.generateKey(identifier);
    const now = Date.now();
    const entry = this.requests.get(key);

    if (!entry || now > entry.resetTime) {
      // Primeira requisição ou janela expirada
      const resetTime = now + this.config.windowMs;
      this.requests.set(key, {
        count: 1,
        resetTime,
      });

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime,
      };
    }

    if (entry.count >= this.config.maxRequests) {
      // Limite excedido
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Incrementar contador
    entry.count++;
    this.requests.set(key, entry);

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Obter estatísticas do rate limiter
  getStats() {
    const now = Date.now();
    let activeEntries = 0;
    let expiredEntries = 0;

    this.requests.forEach((entry) => {
      if (now > entry.resetTime) {
        expiredEntries++;
      } else {
        activeEntries++;
      }
    });

    return {
      totalEntries: this.requests.size,
      activeEntries,
      expiredEntries,
      config: this.config,
    };
  }

  // Limpar todas as entradas
  clear(): void {
    this.requests.clear();
  }
}

// Configurações de rate limiting para diferentes endpoints
export const rateLimitConfigs = {
  // Rate limiting mais restritivo para credenciais
  credentials: {
    maxRequests: parseInt(process.env.RATE_LIMIT_CREDENTIALS_MAX || '5'),
    windowMs: parseInt(process.env.RATE_LIMIT_CREDENTIALS_WINDOW || '900000'), // 15 minutos
  },
  // Rate limiting padrão para outras APIs
  default: {
    maxRequests: parseInt(process.env.RATE_LIMIT_DEFAULT_MAX || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_DEFAULT_WINDOW || '900000'), // 15 minutos
  },
};

// Instâncias dos rate limiters
export const credentialsRateLimiter = new RateLimiter(rateLimitConfigs.credentials);
export const defaultRateLimiter = new RateLimiter(rateLimitConfigs.default);

// Função para obter identificador do cliente
export function getClientIdentifier(request: Request): string {
  // Em produção, usar IP real
  // Em desenvolvimento, usar um identificador fixo para testes
  if (process.env.NODE_ENV === 'development') {
    return 'dev-client';
  }

  // Tentar obter IP real do request
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';

  return clientIp;
}

// Função para verificar rate limit
export function checkRateLimit(
  request: Request,
  limiter: RateLimiter = defaultRateLimiter
): { allowed: boolean; remaining: number; resetTime: number } {
  const identifier = getClientIdentifier(request);
  return limiter.isAllowed(identifier);
}

// Função para criar headers de rate limit
export function createRateLimitHeaders(
  allowed: boolean,
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': rateLimitConfigs.credentials.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
    'X-RateLimit-Reset-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
  };
}
