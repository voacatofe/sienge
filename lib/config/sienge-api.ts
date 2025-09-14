import { SyncConfig, SiengeEndpoint } from '../types/sienge-api';

// Configurações dos endpoints da API Sienge
export const SIENGE_ENDPOINTS = {
  CUSTOMERS: '/customers' as SiengeEndpoint,
  COMPANIES: '/companies' as SiengeEndpoint,
  ACCOUNTS_RECEIVABLE: '/accounts-receivable' as SiengeEndpoint,
  ACCOUNTS_PAYABLE: '/accounts-payable' as SiengeEndpoint,
  SALES_CONTRACTS: '/sales-contracts' as SiengeEndpoint,
  COMMISSIONS: '/commissions' as SiengeEndpoint,
  COST_CENTERS: '/cost-centers' as SiengeEndpoint,
  DEPARTMENTS: '/departments' as SiengeEndpoint,
  PAYMENT_CATEGORIES: '/payment-categories' as SiengeEndpoint,
  INDEXERS: '/indexers' as SiengeEndpoint,
  CARRIERS: '/carriers' as SiengeEndpoint,
} as const;

// Configurações de sincronização para cada endpoint
export const SYNC_CONFIGS: Record<SiengeEndpoint, SyncConfig> = {
  '/customers': {
    endpoint: '/customers',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
  '/companies': {
    endpoint: '/companies',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
  '/accounts-receivable': {
    endpoint: '/accounts-receivable',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
  '/accounts-payable': {
    endpoint: '/accounts-payable',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
  '/sales-contracts': {
    endpoint: '/sales-contracts',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
  '/commissions': {
    endpoint: '/commissions',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
  '/cost-centers': {
    endpoint: '/cost-centers',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
  '/departments': {
    endpoint: '/departments',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
  '/payment-categories': {
    endpoint: '/payment-categories',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
  '/indexers': {
    endpoint: '/indexers',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
  '/carriers': {
    endpoint: '/carriers',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
  '/projects': {
    endpoint: '/projects',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
  '/contracts': {
    endpoint: '/contracts',
    batchSize: 200,
    maxRetries: 3,
    retryDelay: 1000,
    enabled: true,
  },
};

// Mapeamento de endpoints para nomes de entidades
export const ENDPOINT_TO_ENTITY: Record<SiengeEndpoint, string> = {
  '/customers': 'customers',
  '/companies': 'companies',
  '/accounts-receivable': 'accounts_receivable',
  '/accounts-payable': 'accounts_payable',
  '/sales-contracts': 'sales_contracts',
  '/commissions': 'commissions',
  '/cost-centers': 'cost_centers',
  '/departments': 'departments',
  '/payment-categories': 'payment_categories',
  '/indexers': 'indexers',
  '/carriers': 'carriers',
  '/projects': 'projects',
  '/contracts': 'contracts',
};

// Mapeamento de entidades para endpoints
export const ENTITY_TO_ENDPOINT: Record<string, SiengeEndpoint> = {
  customers: '/customers',
  companies: '/companies',
  accounts_receivable: '/accounts-receivable',
  accounts_payable: '/accounts-payable',
  sales_contracts: '/sales-contracts',
  commissions: '/commissions',
  cost_centers: '/cost-centers',
  departments: '/departments',
  payment_categories: '/payment-categories',
  indexers: '/indexers',
  carriers: '/carriers',
  projects: '/projects',
  contracts: '/contracts',
};

// Configurações de rate limiting por endpoint
export const RATE_LIMIT_CONFIG = {
  DEFAULT_LIMIT: 200, // requests per minute
  BURST_LIMIT: 10, // requests per second
  WINDOW_SIZE: 60000, // 1 minute in milliseconds
} as const;

// Configurações de retry
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  BASE_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
  BACKOFF_MULTIPLIER: 2,
} as const;

// Configurações de timeout
export const TIMEOUT_CONFIG = {
  REQUEST_TIMEOUT: 30000, // 30 seconds
  CONNECTION_TIMEOUT: 10000, // 10 seconds
  RESPONSE_TIMEOUT: 30000, // 30 seconds
} as const;

// Configurações de logging
export const LOGGING_CONFIG = {
  ENABLE_REQUEST_LOGGING: true,
  ENABLE_RESPONSE_LOGGING: true,
  ENABLE_ERROR_LOGGING: true,
  ENABLE_METRICS_LOGGING: true,
  LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
} as const;

// Configurações de cache
export const CACHE_CONFIG = {
  ENABLE_CACHE: false, // Desabilitado por padrão para dados em tempo real
  CACHE_TTL: 300000, // 5 minutes
  MAX_CACHE_SIZE: 1000, // items
} as const;

// Configurações de validação
export const VALIDATION_CONFIG = {
  ENABLE_REQUEST_VALIDATION: true,
  ENABLE_RESPONSE_VALIDATION: true,
  STRICT_MODE: process.env.NODE_ENV === 'production',
} as const;

// Função para obter configuração de sincronização
export function getSyncConfig(endpoint: SiengeEndpoint): SyncConfig {
  return SYNC_CONFIGS[endpoint];
}

// Função para verificar se endpoint está habilitado
export function isEndpointEnabled(endpoint: SiengeEndpoint): boolean {
  return SYNC_CONFIGS[endpoint]?.enabled ?? false;
}

// Função para obter nome da entidade
export function getEntityName(endpoint: SiengeEndpoint): string {
  return ENDPOINT_TO_ENTITY[endpoint];
}

// Função para obter endpoint da entidade
export function getEndpoint(entityName: string): SiengeEndpoint | undefined {
  return ENTITY_TO_ENDPOINT[entityName];
}

// Mapeamento de endpoints locais categorizados
export const LOCAL_ENDPOINTS = {
  ENTIDADES: {
    customers: '/api/data/entidades/customers',
    companies: '/api/data/entidades/companies',
  },
  CLIENTES: {
    'tipos-cliente': '/api/data/clientes/tipos-cliente',
    'estados-civis': '/api/data/clientes/estados-civis',
    profissoes: '/api/data/clientes/profissoes',
    municipios: '/api/data/clientes/municipios',
  },
  VENDAS: {
    'sales-contracts': '/api/data/vendas/sales-contracts',
    commissions: '/api/data/vendas/commissions',
  },
  EMPREENDIMENTOS: {
    empreendimentos: '/api/data/empreendimentos/empreendimentos',
    'unidades-imobiliarias': '/api/data/empreendimentos/unidades-imobiliarias',
    'tipos-imovel': '/api/data/empreendimentos/tipos-imovel',
  },
  COMPRAS: {
    credores: '/api/data/compras/credores',
    'pedidos-compra': '/api/data/compras/pedidos-compra',
  },
  FINANCEIRO: {
    'accounts-receivable': '/api/data/financeiro/accounts-receivable',
    'accounts-payable': '/api/data/financeiro/accounts-payable',
    indexers: '/api/data/financeiro/indexers',
    'payment-categories': '/api/data/financeiro/payment-categories',
    carriers: '/api/data/financeiro/carriers',
  },
  ORGANIZACIONAL: {
    'cost-centers': '/api/data/organizacional/cost-centers',
    departments: '/api/data/organizacional/departments',
  },
  CONFIGURACOES: {
    'documentos-identificacao':
      '/api/data/configuracoes/documentos-identificacao',
    'tipos-condicao-pagamento':
      '/api/data/configuracoes/tipos-condicao-pagamento',
  },
} as const;

// Função para obter endpoint local categorizado
export function getLocalEndpoint(entityName: string): string | undefined {
  // Busca em todas as categorias
  for (const category of Object.values(LOCAL_ENDPOINTS)) {
    if (category[entityName as keyof typeof category]) {
      return category[entityName as keyof typeof category];
    }
  }
  return undefined;
}
