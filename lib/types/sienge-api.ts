// Tipos específicos para entidades da API Sienge

// Tipos específicos para entidades da API Sienge

export interface SiengePhone {
  type: string;
  number: string;
  main: boolean;
  note?: string;
  idd: string;
}

export interface SiengeAddress {
  type: string;
  streetName: string;
  number: string;
  complement?: string;
  neighborhood: string;
  cityId: number;
  city: string;
  state: string;
  zipCode: string;
  mail: boolean;
}

export interface SiengeFamilyIncome {
  kinsName: string;
  kinship: string;
  incomeValue: number;
  observation: string;
}

export interface SiengeCustomer {
  id: number;
  personType: string;
  foreigner: string;
  internationalId?: string;
  createdAt: string;
  modifiedAt: string;
  issuingBody?: string;
  clientType?: string;
  phones: SiengePhone[];
  addresses: SiengeAddress[];
  procurators: any[];
  contacts: any[];
  subTypes: any[];
  birthPlace?: string;
  civilStatus: string;
  cpf: string;
  email: string;
  fatherName?: string;
  sex: string;
  matrimonialRegime: string;
  name: string;
  nationality: string;
  numberIdentityCard: string;
  motherName?: string;
  profession: string;
  mailingAddress: string;
  licenseNumber?: string;
  licenseIssuingBody?: string;
  birthDate: string;
  issueDateIdentityCard?: string;
  marriageDate?: string;
  licenseIssueDate?: string;
  spouse?: any;
  familyIncome: SiengeFamilyIncome[];
}

export interface SiengeCostCenter {
  id: number;
  nome: string;
  codigo?: string;
  descricao?: string;
  ativo: boolean;
  dataCadastro: string;
  dataAtualizacao?: string;
}

export interface SiengeProject {
  id: number;
  nome: string;
  codigo?: string;
  descricao?: string;
  status: string;
  dataInicio?: string;
  dataFim?: string;
  valorTotal?: number;
  ativo: boolean;
  dataCadastro: string;
  dataAtualizacao?: string;
}

export interface SiengeContract {
  id: number;
  numero: string;
  idCliente: number;
  idProjeto?: number;
  tipo: string;
  valor: number;
  dataContrato: string;
  status: string;
  observacoes?: string;
  dataCadastro: string;
  dataAtualizacao?: string;
}

// Tipos para respostas da API
export interface SiengeApiResponse<T = any> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
  success: boolean;
  message?: string;
}

export interface SiengeApiError {
  success: false;
  message: string;
  code?: string;
  status?: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Tipos para parâmetros de consulta
export interface SiengeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Tipos para endpoints da API
export type SiengeEndpoint =
  | '/customers'
  | '/companies'
  | '/cost-centers'
  | '/departments'
  | '/projects'
  | '/contracts'
  | '/accounts-receivable'
  | '/accounts-payable'
  | '/indexers'
  | '/sales-contracts'
  | '/commissions'
  | '/payment-categories'
  | '/carriers'
  | '/professions'
  | '/marital-status'
  | '/customer-types';

// Tipos para métodos HTTP suportados
export type SiengeHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Tipos para configuração de sincronização
export interface SyncConfig {
  endpoint: SiengeEndpoint;
  batchSize: number;
  maxRetries: number;
  retryDelay: number;
  enabled: boolean;
  httpMethod?: SiengeHttpMethod; // Método HTTP específico para este endpoint
}

// Tipos para logs de sincronização
export interface SyncLog {
  id: number;
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
}

// Tipos para métricas de API
export interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  rateLimitHits: number;
  lastRequestAt?: Date;
  lastErrorAt?: Date;
}
