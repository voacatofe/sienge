import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import Bottleneck from 'bottleneck';
import { prisma } from '@/lib/prisma';
import {
  apiLogger,
  logApiRequest,
  logApiError,
  logRateLimitHit,
} from '@/lib/logger/api-logger';

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
  data?: T[] | any;
  records?: T[];
  resultSetMetadata?: {
    totalRecords: number;
    offset: number;
    limit: number;
  };
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
  has_more?: boolean;
  items?: T[];
  results?: T[];
  [key: string]: any; // Permitir propriedades dinâmicas
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

      console.log(
        `Cliente Sienge API inicializado para: ${credentials.subdomain}`
      );
    } catch (error) {
      console.error('Erro ao inicializar cliente Sienge API:', error);
      throw error;
    }
  }

  // Carregar credenciais do banco de dados
  private async loadCredentials(): Promise<SiengeCredentials | null> {
    try {
      // SEMPRE buscar credenciais do banco de dados primeiro
      // As variáveis de ambiente do .env são apenas para desenvolvimento/testes
      const credentials = await prisma.apiCredentials.findFirst({
        where: { isActive: true },
        select: {
          subdomain: true,
          apiUser: true,
          apiPasswordHash: true,
        },
      });

      if (!credentials) {
        // Fallback para desenvolvimento: usar variáveis de ambiente se disponíveis
        if (
          process.env.SIENGE_SUBDOMAIN &&
          process.env.SIENGE_USERNAME &&
          process.env.SIENGE_PASSWORD
        ) {
          console.warn(
            '[Sienge API] Usando credenciais do .env como fallback (desenvolvimento)'
          );
          return {
            subdomain: process.env.SIENGE_SUBDOMAIN,
            username: process.env.SIENGE_USERNAME,
            password: process.env.SIENGE_PASSWORD,
          };
        }

        throw new Error(
          'Nenhuma credencial configurada. Acesse /config para configurar as credenciais da API Sienge.'
        );
      }

      // AVISO: Em um sistema real, você não deveria armazenar senhas em texto plano
      // Esta é uma implementação simplificada para demonstração
      // Para produção, considere usar um sistema de gerenciamento de segredos

      // Como a senha foi hasheada com bcrypt, precisamos recuperar a senha original
      // Por segurança, vamos usar uma abordagem temporária onde salvamos a senha
      // em uma variável de ambiente temporária durante a configuração
      const plainPassword = await this.getPasswordFromSecureStorage(
        credentials.subdomain
      );

      if (!plainPassword) {
        throw new Error(
          'Senha não encontrada. Reconfigure as credenciais em /config'
        );
      }

      return {
        subdomain: credentials.subdomain,
        username: credentials.apiUser,
        password: plainPassword,
      };
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error);
      throw error;
    }
  }

  // Método temporário para recuperar senha - SUBSTITUIR POR SOLUÇÃO SEGURA EM PRODUÇÃO
  private async getPasswordFromSecureStorage(
    subdomain: string
  ): Promise<string | null> {
    // IMPLEMENTAÇÃO TEMPORÁRIA: usar cache em memória
    // EM PRODUÇÃO: usar AWS Secrets Manager, Azure Key Vault, etc.

    // Procurar por uma variável de ambiente específica do subdomínio
    const envKey = `SIENGE_PASSWORD_${subdomain.toUpperCase()}`;
    return process.env[envKey] || null;
  }

  // Configurar lógica de retry
  private setupRetryLogic(): void {
    axiosRetry(this.axiosInstance, {
      retries: SIENGE_API_CONFIG.RETRY_ATTEMPTS,
      retryDelay: retryCount => {
        return Math.pow(2, retryCount) * SIENGE_API_CONFIG.RETRY_DELAY;
      },
      retryCondition: error => {
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
      config => {
        const startTime = Date.now();
        config.metadata = { startTime };

        logApiRequest({
          method: config.method?.toUpperCase() || 'UNKNOWN',
          url: config.url || '',
          requestSize: JSON.stringify(config.data || {}).length,
        });

        return config;
      },
      error => {
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
      response => {
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
      error => {
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
    params: Record<string, any> = {},
    options: {
      maxPages?: number;
      maxRecords?: number;
      timeoutMs?: number;
    } = {}
  ): Promise<T[]> {
    const allData: T[] = [];
    let page = 1;
    let hasMore = true;
    const startTime = Date.now();

    // Configurações de segurança para evitar loops infinitos
    const maxPages = options.maxPages || 1000; // Máximo 1000 páginas por padrão
    const maxRecords = options.maxRecords || 200000; // Máximo 200k registros por padrão
    const timeoutMs = options.timeoutMs || 30 * 60 * 1000; // 30 minutos por padrão

    console.log(
      `[Sienge API] Iniciando busca em ${endpoint} com parâmetros:`,
      params
    );
    console.log(
      `[Sienge API] Limites: máx ${maxPages} páginas, máx ${maxRecords} registros, timeout ${timeoutMs / 1000 / 60}min`
    );

    while (hasMore) {
      try {
        // Verificar timeout
        if (Date.now() - startTime > timeoutMs) {
          console.warn(
            `[Sienge API] Timeout atingido após ${timeoutMs / 1000 / 60} minutos. Parando sincronização.`
          );
          break;
        }

        // Verificar limite de páginas
        if (page > maxPages) {
          console.warn(
            `[Sienge API] Limite de páginas atingido (${maxPages}). Parando sincronização.`
          );
          break;
        }

        // Verificar limite de registros
        if (allData.length >= maxRecords) {
          console.warn(
            `[Sienge API] Limite de registros atingido (${maxRecords}). Parando sincronização.`
          );
          break;
        }

        const response = await this.makeRequest<SiengeApiResponse<T>>({
          method: 'GET',
          url: endpoint,
          params: {
            ...params,
            page,
            limit: SIENGE_API_CONFIG.DEFAULT_PAGE_SIZE,
          },
        });

        console.log(`[Sienge API] Resposta da página ${page}:`, {
          status: response.status,
          dataKeys: Object.keys(response.data || {}),
          dataType: Array.isArray(response.data)
            ? 'array'
            : typeof response.data,
          dataLength: Array.isArray(response.data)
            ? response.data.length
            : 'N/A',
        });

        // Verificar diferentes estruturas de resposta possíveis
        let responseData: T[] = [];
        let responseHasMore = false;

        // Baseado nos testes, a estrutura real da API Sienge é:
        // { results: [...], resultSetMetadata: { count, offset, limit } }
        const responseDataObj = response.data as any;
        if (Array.isArray(responseDataObj?.results)) {
          // Estrutura real da API Sienge: { results: [...], resultSetMetadata: {...} }
          responseData = responseDataObj.results;

          // Log da metadata para debug
          if (responseDataObj.resultSetMetadata) {
            const metadata = responseDataObj.resultSetMetadata;
            console.log(`[Sienge API] Metadata página ${page}:`, {
              totalRecords: metadata.count || metadata.totalRecords,
              currentOffset: metadata.offset,
              limit: metadata.limit,
              hasMore:
                metadata.offset + metadata.limit <
                (metadata.count || metadata.totalRecords),
            });

            responseHasMore =
              metadata.offset + metadata.limit <
              (metadata.count || metadata.totalRecords);
          } else {
            responseHasMore = false;
          }
        } else if (Array.isArray(responseDataObj?.records)) {
          // Fallback para estrutura com records
          responseData = responseDataObj.records;
          responseHasMore = responseDataObj.resultSetMetadata
            ? responseDataObj.resultSetMetadata.offset +
                responseDataObj.resultSetMetadata.limit <
              responseDataObj.resultSetMetadata.totalRecords
            : false;
        } else if (Array.isArray(response.data)) {
          // Resposta é um array direto
          responseData = response.data;
          responseHasMore = false; // Se é array direto, não há paginação
        } else if (response.data && typeof response.data === 'object') {
          const responseObj = response.data as any; // Type assertion para flexibilidade

          // Resposta é um objeto com propriedades
          if (Array.isArray(responseObj.records)) {
            // Estrutura: { data: { records: [...], resultSetMetadata: {...} } }
            responseData = responseObj.records;
            responseHasMore = responseObj.resultSetMetadata
              ? responseObj.resultSetMetadata.offset +
                  responseObj.resultSetMetadata.limit <
                responseObj.resultSetMetadata.totalRecords
              : false;
          } else if (Array.isArray(responseObj.data)) {
            // Estrutura: { data: [...], hasMore: boolean }
            responseData = responseObj.data;
            responseHasMore = responseObj.hasMore || false;
          } else if (Array.isArray(responseObj.items)) {
            // Estrutura: { items: [...], hasMore: boolean }
            responseData = responseObj.items;
            responseHasMore = responseObj.hasMore || false;
          } else if (Array.isArray(responseObj.results)) {
            // Estrutura: { results: [...], hasMore: boolean }
            responseData = responseObj.results;
            responseHasMore = responseObj.hasMore || false;
          } else {
            // Tentar encontrar qualquer propriedade que seja um array
            const arrayProps = Object.keys(responseObj).filter(key =>
              Array.isArray(responseObj[key])
            );
            if (arrayProps.length > 0) {
              console.log(
                `[Sienge API] Encontrada propriedade array: ${arrayProps[0]}`
              );
              responseData = responseObj[arrayProps[0]];
              responseHasMore =
                responseObj.hasMore || responseObj.has_more || false;
            }
          }
        }

        if (Array.isArray(responseData)) {
          allData.push(...responseData);
        }

        // Log do progresso com mais detalhes
        const elapsedMinutes = Math.round((Date.now() - startTime) / 1000 / 60);
        console.log(
          `[Sienge API] Página ${page}: ${responseData?.length || 0} registros | Total: ${allData.length} | Tempo: ${elapsedMinutes}min | HasMore: ${responseHasMore}`
        );

        // Se não há mais dados ou se a resposta está vazia, parar
        if (!responseHasMore || (responseData?.length || 0) === 0) {
          hasMore = false;
          console.log(
            `[Sienge API] Paginação finalizada na página ${page}. Motivo: ${!responseHasMore ? 'hasMore=false' : 'dados vazios'}`
          );
        }

        page++;
      } catch (error) {
        console.error(`[Sienge API] Erro na página ${page}:`, error);
        throw error;
      }
    }

    const totalTimeMinutes = Math.round((Date.now() - startTime) / 1000 / 60);
    console.log(
      `[Sienge API] Sincronização finalizada: ${allData.length} registros em ${totalTimeMinutes} minutos (${page - 1} páginas)`
    );
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
  async createData<T = any>(endpoint: string, data: any): Promise<T> {
    const response = await this.makeRequest<T>({
      method: 'POST',
      url: endpoint,
      data,
    });

    return response.data;
  }

  // Método para atualizar dados
  async updateData<T = any>(endpoint: string, data: any): Promise<T> {
    const response = await this.makeRequest<T>({
      method: 'PUT',
      url: endpoint,
      data,
    });

    return response.data;
  }

  // Método para deletar dados
  async deleteData<T = any>(endpoint: string): Promise<T> {
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
