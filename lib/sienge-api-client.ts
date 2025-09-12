import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import Bottleneck from 'bottleneck';
import { prisma } from '@/lib/prisma';
import { apiLogger, logApiRequest, logApiError, logRateLimitHit } from '@/lib/logger/api-logger';

// Extensão de tipos para Axios
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

// Tipos para a API Sienge
export interface SiengeCredentials {
  subdomain: string;
  username: string;
  password: string;
}

export interface SiengeApiResponse<T = any> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}

export interface SiengeApiError {
  message: string;
  code?: string;
  status?: number;
}

// Configurações da API Sienge
export const SIENGE_API_CONFIG = {
  BASE_URL_TEMPLATE: 'https://api.sienge.com.br/{subdomain}/public/api/v1',
  DEFAULT_PAGE_SIZE: 200,
  MAX_PAGE_SIZE: 200,
  RATE_LIMIT_PER_MINUTE: 200,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 30000,
} as const;

// Classe principal do cliente Sienge API
export class SiengeApiClient {
  private axiosInstance: AxiosInstance;
  private rateLimiter: Bottleneck;
  private credentials: SiengeCredentials | null = null;
  private baseURL: string = '';

  constructor() {
    this.rateLimiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: Math.ceil(60000 / SIENGE_API_CONFIG.RATE_LIMIT_PER_MINUTE), // ~300ms entre requests
      reservoir: SIENGE_API_CONFIG.RATE_LIMIT_PER_MINUTE,
      reservoirRefreshAmount: SIENGE_API_CONFIG.RATE_LIMIT_PER_MINUTE,
      reservoirRefreshInterval: 60 * 1000, // 1 minuto
    });

    this.axiosInstance = axios.create({
      timeout: SIENGE_API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Sienge-Data-Sync/1.0.0',
      },
    });

    this.setupRetryLogic();
    this.setupInterceptors();
  }

  // Configurar credenciais e inicializar cliente
  async initialize(): Promise<void> {
    try {
      const credentials = await this.loadCredentials();
      if (!credentials) {
        throw new Error('Credenciais da API Sienge não encontradas');
      }

      this.credentials = credentials;
      this.baseURL = SIENGE_API_CONFIG.BASE_URL_TEMPLATE.replace(
        '{subdomain}',
        credentials.subdomain
      );

      this.axiosInstance.defaults.baseURL = this.baseURL;
      this.axiosInstance.defaults.auth = {
        username: credentials.username,
        password: credentials.password,
      };

      console.log(`Cliente Sienge API inicializado para: ${credentials.subdomain}`);
    } catch (error) {
      console.error('Erro ao inicializar cliente Sienge API:', error);
      throw error;
    }
  }

  // Carregar credenciais do banco de dados
  private async loadCredentials(): Promise<SiengeCredentials | null> {
    try {
      // Para desenvolvimento/testes, usar variáveis de ambiente se disponíveis
      if (process.env.SIENGE_SUBDOMAIN && process.env.SIENGE_USERNAME && process.env.SIENGE_PASSWORD) {
        return {
          subdomain: process.env.SIENGE_SUBDOMAIN,
          username: process.env.SIENGE_USERNAME,
          password: process.env.SIENGE_PASSWORD,
        };
      }

      // Em produção, as credenciais devem vir de um sistema seguro
      // Por enquanto, retornar erro indicando que precisa configurar
      const credentials = await prisma.apiCredentials.findFirst({
        where: { isActive: true },
        select: {
          subdomain: true,
          apiUser: true,
        },
      });

      if (!credentials) {
        throw new Error('Nenhuma credencial configurada');
      }

      // Em produção, implemente uma solução segura para obter a senha
      // Opções: AWS Secrets Manager, Azure Key Vault, variáveis de ambiente criptografadas, etc.
      throw new Error(
        'Sistema de credenciais não configurado. Configure SIENGE_SUBDOMAIN, SIENGE_USERNAME e SIENGE_PASSWORD nas variáveis de ambiente.'
      );
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error);
      throw error;
    }
  }

  // Configurar lógica de retry
  private setupRetryLogic(): void {
    axiosRetry(this.axiosInstance, {
      retries: SIENGE_API_CONFIG.RETRY_ATTEMPTS,
      retryDelay: (retryCount) => {
        return Math.pow(2, retryCount) * SIENGE_API_CONFIG.RETRY_DELAY;
      },
      retryCondition: (error) => {
        // Retry em erros de rede e 5xx
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response?.status !== undefined && 
           error.response.status >= 500 && 
           error.response.status < 600)
        );
      },
    });
  }

  // Configurar interceptors
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const startTime = Date.now();
        config.metadata = { startTime };
        
        logApiRequest({
          method: config.method?.toUpperCase() || 'UNKNOWN',
          url: config.url || '',
          requestSize: JSON.stringify(config.data || {}).length,
        });
        
        return config;
      },
      (error) => {
        logApiError({
          method: error.config?.method?.toUpperCase() || 'UNKNOWN',
          url: error.config?.url || '',
          statusCode: error.response?.status,
          errorMessage: error.message,
        });
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        const endTime = Date.now();
        const startTime = response.config.metadata?.startTime || endTime;
        const responseTime = endTime - startTime;
        
        logApiRequest({
          method: response.config.method?.toUpperCase() || 'UNKNOWN',
          url: response.config.url || '',
          statusCode: response.status,
          responseTime,
          responseSize: JSON.stringify(response.data || {}).length,
        });
        
        return response;
      },
      (error) => {
        const endTime = Date.now();
        const startTime = error.config?.metadata?.startTime || endTime;
        const responseTime = endTime - startTime;
        
        logApiError({
          method: error.config?.method?.toUpperCase() || 'UNKNOWN',
          url: error.config?.url || '',
          statusCode: error.response?.status,
          responseTime,
          errorMessage: error.message,
        });
        
        return Promise.reject(error);
      }
    );
  }

  // Fazer requisição com rate limiting
  private async makeRequest<T = any>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    if (!this.credentials) {
      throw new Error('Cliente não inicializado. Chame initialize() primeiro.');
    }

    try {
      return await this.rateLimiter.schedule(async () => {
        return this.axiosInstance.request<T>(config);
      });
    } catch (error) {
      // Verificar se é erro de rate limiting
      if (error instanceof Error && error.message.includes('rate limit')) {
        logRateLimitHit();
      }
      throw error;
    }
  }

  // Método genérico para buscar dados paginados
  async fetchPaginatedData<T = any>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<T[]> {
    const allData: T[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await this.makeRequest<SiengeApiResponse<T>>({
          method: 'GET',
          url: endpoint,
          params: {
            ...params,
            page,
            limit: SIENGE_API_CONFIG.DEFAULT_PAGE_SIZE,
          },
        });

        const { data, hasMore: responseHasMore } = response.data;
        
        if (Array.isArray(data)) {
          allData.push(...data);
        }

        hasMore = responseHasMore || false;
        page++;

        // Log do progresso
        console.log(`[Sienge API] Página ${page - 1}: ${data?.length || 0} registros`);
      } catch (error) {
        console.error(`[Sienge API] Erro na página ${page}:`, error);
        throw error;
      }
    }

    console.log(`[Sienge API] Total de registros obtidos: ${allData.length}`);
    return allData;
  }

  // Método para buscar dados específicos
  async fetchData<T = any>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    const response = await this.makeRequest<T>({
      method: 'GET',
      url: endpoint,
      params,
    });

    return response.data;
  }

  // Método para criar dados
  async createData<T = any>(
    endpoint: string,
    data: any
  ): Promise<T> {
    const response = await this.makeRequest<T>({
      method: 'POST',
      url: endpoint,
      data,
    });

    return response.data;
  }

  // Método para atualizar dados
  async updateData<T = any>(
    endpoint: string,
    data: any
  ): Promise<T> {
    const response = await this.makeRequest<T>({
      method: 'PUT',
      url: endpoint,
      data,
    });

    return response.data;
  }

  // Método para deletar dados
  async deleteData<T = any>(
    endpoint: string
  ): Promise<T> {
    const response = await this.makeRequest<T>({
      method: 'DELETE',
      url: endpoint,
    });

    return response.data;
  }

  // Verificar saúde da API
  async healthCheck(): Promise<boolean> {
    try {
      await this.makeRequest({
        method: 'GET',
        url: '/customers',
        params: { limit: 1 },
      });
      return true;
    } catch (error) {
      console.error('[Sienge API] Health check falhou:', error);
      return false;
    }
  }

  // Obter estatísticas do rate limiter
  getRateLimitStats() {
    return {
      queued: this.rateLimiter.queued(),
      running: this.rateLimiter.running(),
      done: this.rateLimiter.done(),
      reservoir: (this.rateLimiter as any).reservoir || 0,
    };
  }
}

// Instância singleton do cliente
export const siengeApiClient = new SiengeApiClient();

// Função de conveniência para inicializar o cliente
export async function initializeSiengeApiClient(): Promise<SiengeApiClient> {
  await siengeApiClient.initialize();
  return siengeApiClient;
}
