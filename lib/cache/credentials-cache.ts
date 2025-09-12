// Sistema de cache em memória para validação de credenciais Sienge
interface CacheEntry {
  isValid: boolean;
  timestamp: number;
  expiresAt: number;
}

interface CredentialsKey {
  subdomain: string;
  username: string;
  password: string;
}

class CredentialsCache {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutos em produção
  private readonly devTTL = 1 * 60 * 1000; // 1 minuto em desenvolvimento

  constructor() {
    // Limpar cache expirado a cada minuto
    setInterval(() => {
      this.cleanExpiredEntries();
    }, 60000);
  }

  private getTTL(): number {
    return process.env.NODE_ENV === 'development' ? this.devTTL : this.defaultTTL;
  }

  private generateKey(credentials: CredentialsKey): string {
    // Usar hash simples para evitar armazenar credenciais em texto plano
    const keyString = `${credentials.subdomain}:${credentials.username}:${credentials.password}`;
    return Buffer.from(keyString).toString('base64');
  }

  private cleanExpiredEntries(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  get(credentials: CredentialsKey): boolean | null {
    const key = this.generateKey(credentials);
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.isValid;
  }

  set(credentials: CredentialsKey, isValid: boolean): void {
    const key = this.generateKey(credentials);
    const now = Date.now();
    
    this.cache.set(key, {
      isValid,
      timestamp: now,
      expiresAt: now + this.getTTL(),
    });
  }

  // Invalidar cache para um subdomínio específico
  invalidateBySubdomain(subdomain: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      const decodedKey = Buffer.from(key, 'base64').toString();
      if (decodedKey.startsWith(`${subdomain}:`)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Limpar todo o cache
  clear(): void {
    this.cache.clear();
  }

  // Obter estatísticas do cache
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    this.cache.forEach((entry) => {
      if (now > entry.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    });

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      ttl: this.getTTL(),
    };
  }
}

// Instância singleton do cache
export const credentialsCache = new CredentialsCache();

// Função de conveniência para validar credenciais com cache
export async function validateCredentialsWithCache(
  subdomain: string,
  username: string,
  password: string,
  validationFunction: (subdomain: string, username: string, password: string) => Promise<boolean>
): Promise<boolean> {
  const credentials: CredentialsKey = { subdomain, username, password };
  
  // Verificar cache primeiro
  const cachedResult = credentialsCache.get(credentials);
  if (cachedResult !== null) {
    return cachedResult;
  }

  // Se não estiver no cache, validar e armazenar resultado
  try {
    const isValid = await validationFunction(subdomain, username, password);
    credentialsCache.set(credentials, isValid);
    return isValid;
  } catch (error) {
    // Em caso de erro na validação, não armazenar no cache
    // e assumir que as credenciais são inválidas
    console.error('Erro na validação de credenciais:', error);
    return false;
  }
}
