/**
 * Sistema genérico de mapeamento de dados da API Sienge
 * Independente de nomenclaturas específicas de campos
 */

import { EndpointMapping } from '../app/api/sync/direct/endpoint-mappings';

// Interface para configuração de mapeamento genérico
export interface GenericFieldMapping {
  sourceField: string; // Campo na resposta da API
  targetField: string; // Campo no banco de dados
  transform?: (value: any) => any; // Função de transformação opcional
  required?: boolean; // Se o campo é obrigatório
  defaultValue?: any; // Valor padrão se não existir
}

export interface GenericEndpointConfig {
  apiEndpoint: string; // Endpoint da API Sienge
  model: string; // Modelo Prisma
  primaryKey: string; // Chave primária
  fieldMappings: GenericFieldMapping[]; // Lista de mapeamentos
  dataPath?: string; // Caminho para os dados na resposta (ex: 'data', 'records', 'items')
  enabledFields?: string[]; // Campos habilitados para sincronização
}

// Configurações genéricas para cada endpoint
export const GENERIC_ENDPOINT_CONFIGS: Record<string, GenericEndpointConfig> = {
  customers: {
    apiEndpoint: '/customers',
    model: 'cliente',
    primaryKey: 'idCliente',
    dataPath: 'data', // Pode ser 'data', 'records', 'items', etc.
    fieldMappings: [
      { sourceField: 'id', targetField: 'idCliente', required: true },
      { sourceField: 'name', targetField: 'nomeCompleto', required: true },
      { sourceField: 'fullName', targetField: 'nomeCompleto', required: false }, // Campo alternativo
      { sourceField: 'cpfCnpj', targetField: 'cpfCnpj', required: true },
      { sourceField: 'cpf_cnpj', targetField: 'cpfCnpj', required: false }, // Campo alternativo
      { sourceField: 'email', targetField: 'email' },
      {
        sourceField: 'active',
        targetField: 'ativo',
        transform: (val: any) => val !== false,
        defaultValue: true,
      },
      {
        sourceField: 'isActive',
        targetField: 'ativo',
        transform: (val: any) => val !== false,
      }, // Campo alternativo
      {
        sourceField: 'createdAt',
        targetField: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      {
        sourceField: 'created_at',
        targetField: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      {
        sourceField: 'updatedAt',
        targetField: 'dataAtualizacao',
        transform: () => new Date(),
      },
      {
        sourceField: 'updated_at',
        targetField: 'dataAtualizacao',
        transform: () => new Date(),
      },
      { sourceField: 'socialName', targetField: 'nomeSocial' },
      { sourceField: 'social_name', targetField: 'nomeSocial' },
      { sourceField: 'rg', targetField: 'rg' },
      {
        sourceField: 'birthDate',
        targetField: 'dataNascimento',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      {
        sourceField: 'birth_date',
        targetField: 'dataNascimento',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      { sourceField: 'nationality', targetField: 'nacionalidade' },
      { sourceField: 'maritalStatus', targetField: 'estadoCivilStr' },
      { sourceField: 'marital_status', targetField: 'estadoCivilStr' },
      { sourceField: 'profession', targetField: 'profissaoStr' },
      { sourceField: 'personType', targetField: 'personType' },
      { sourceField: 'person_type', targetField: 'personType' },
    ],
  },

  companies: {
    apiEndpoint: '/companies',
    model: 'empresa',
    primaryKey: 'idEmpresa',
    dataPath: 'data',
    fieldMappings: [
      { sourceField: 'id', targetField: 'idEmpresa', required: true },
      { sourceField: 'name', targetField: 'nomeEmpresa', required: true },
      {
        sourceField: 'companyName',
        targetField: 'nomeEmpresa',
        required: false,
      },
      {
        sourceField: 'company_name',
        targetField: 'nomeEmpresa',
        required: false,
      },
      { sourceField: 'cnpj', targetField: 'cnpj' },
      { sourceField: 'stateRegistration', targetField: 'inscricaoEstadual' },
      { sourceField: 'state_registration', targetField: 'inscricaoEstadual' },
      { sourceField: 'cityRegistration', targetField: 'inscricaoMunicipal' },
      { sourceField: 'city_registration', targetField: 'inscricaoMunicipal' },
      { sourceField: 'address', targetField: 'endereco' },
      { sourceField: 'city', targetField: 'cidade' },
      { sourceField: 'state', targetField: 'estado' },
      { sourceField: 'zipCode', targetField: 'cep' },
      { sourceField: 'zip_code', targetField: 'cep' },
      { sourceField: 'phone', targetField: 'telefone' },
      { sourceField: 'email', targetField: 'email' },
      { sourceField: 'website', targetField: 'site' },
      {
        sourceField: 'active',
        targetField: 'ativo',
        transform: (val: any) => val !== false,
        defaultValue: true,
      },
      {
        sourceField: 'isActive',
        targetField: 'ativo',
        transform: (val: any) => val !== false,
      },
      {
        sourceField: 'createdAt',
        targetField: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      {
        sourceField: 'created_at',
        targetField: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      {
        sourceField: 'updatedAt',
        targetField: 'dataAtualizacao',
        transform: () => new Date(),
      },
      {
        sourceField: 'updated_at',
        targetField: 'dataAtualizacao',
        transform: () => new Date(),
      },
    ],
  },

  income: {
    apiEndpoint: '/accounts-receivable',
    model: 'tituloReceber',
    primaryKey: 'idTituloReceber',
    dataPath: 'data',
    fieldMappings: [
      { sourceField: 'id', targetField: 'idTituloReceber', required: true },
      { sourceField: 'contractId', targetField: 'idContrato' },
      { sourceField: 'contract_id', targetField: 'idContrato' },
      { sourceField: 'customerId', targetField: 'idCliente', required: true },
      { sourceField: 'customer_id', targetField: 'idCliente', required: true },
      { sourceField: 'clientId', targetField: 'idCliente' },
      { sourceField: 'client_id', targetField: 'idCliente' },
      { sourceField: 'companyId', targetField: 'idEmpresa' },
      { sourceField: 'company_id', targetField: 'idEmpresa' },
      {
        sourceField: 'documentNumber',
        targetField: 'numeroDocumento',
        required: true,
      },
      {
        sourceField: 'document_number',
        targetField: 'numeroDocumento',
        required: true,
      },
      { sourceField: 'number', targetField: 'numeroDocumento' },
      {
        sourceField: 'issueDate',
        targetField: 'dataEmissao',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      {
        sourceField: 'issue_date',
        targetField: 'dataEmissao',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      {
        sourceField: 'dueDate',
        targetField: 'dataVencimento',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      {
        sourceField: 'due_date',
        targetField: 'dataVencimento',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      {
        sourceField: 'originalValue',
        targetField: 'valorOriginal',
        transform: (val: any) => (val ? parseFloat(val) : 0),
      },
      {
        sourceField: 'original_value',
        targetField: 'valorOriginal',
        transform: (val: any) => (val ? parseFloat(val) : 0),
      },
      {
        sourceField: 'value',
        targetField: 'valorOriginal',
        transform: (val: any) => (val ? parseFloat(val) : 0),
      },
      {
        sourceField: 'updatedValue',
        targetField: 'valorAtualizado',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'updated_value',
        targetField: 'valorAtualizado',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      { sourceField: 'status', targetField: 'status', defaultValue: 'pending' },
      { sourceField: 'observations', targetField: 'observacoes' },
      { sourceField: 'notes', targetField: 'observacoes' },
    ],
  },

  'sales-contracts': {
    apiEndpoint: '/sales-contracts',
    model: 'contratoVenda',
    primaryKey: 'id',
    dataPath: 'data',
    fieldMappings: [
      { sourceField: 'id', targetField: 'id', required: true },
      { sourceField: 'companyId', targetField: 'companyId' },
      { sourceField: 'company_id', targetField: 'companyId' },
      { sourceField: 'enterpriseId', targetField: 'enterpriseId' },
      { sourceField: 'enterprise_id', targetField: 'enterpriseId' },
      {
        sourceField: 'contractDate',
        targetField: 'contractDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      {
        sourceField: 'contract_date',
        targetField: 'contractDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      {
        sourceField: 'issueDate',
        targetField: 'issueDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      {
        sourceField: 'issue_date',
        targetField: 'issueDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      { sourceField: 'number', targetField: 'number' },
      { sourceField: 'contractNumber', targetField: 'number' },
      { sourceField: 'contract_number', targetField: 'number' },
      { sourceField: 'situation', targetField: 'situation' },
      { sourceField: 'status', targetField: 'situation' },
      {
        sourceField: 'value',
        targetField: 'value',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'totalValue',
        targetField: 'totalSellingValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'total_value',
        targetField: 'totalSellingValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'createdAt',
        targetField: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      {
        sourceField: 'created_at',
        targetField: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      {
        sourceField: 'updatedAt',
        targetField: 'dataAtualizacao',
        transform: () => new Date(),
      },
      {
        sourceField: 'updated_at',
        targetField: 'dataAtualizacao',
        transform: () => new Date(),
      },
    ],
  },
};

/**
 * Classe para mapeamento genérico de dados
 */
export class GenericDataMapper {
  /**
   * Mapeia dados da API para o formato do banco de dados
   */
  static mapApiDataToDatabase(
    apiData: any,
    config: GenericEndpointConfig
  ): any {
    const mappedData: any = {};

    // Processar cada mapeamento de campo
    for (const fieldMapping of config.fieldMappings) {
      const { sourceField, targetField, transform, required, defaultValue } =
        fieldMapping;

      let value = apiData[sourceField];

      // Se o campo não existe e é obrigatório, pular este registro
      if (value === undefined && required) {
        console.warn(
          `Campo obrigatório '${sourceField}' não encontrado nos dados da API`
        );
        continue;
      }

      // Usar valor padrão se definido e valor não existe
      if (value === undefined && defaultValue !== undefined) {
        value = defaultValue;
      }

      // Aplicar transformação se definida e valor existe
      if (value !== undefined && transform) {
        try {
          value = transform(value);
        } catch (error) {
          console.error(`Erro ao transformar campo '${sourceField}':`, error);
          continue;
        }
      }

      // Adicionar ao objeto mapeado se valor existe
      if (value !== undefined) {
        mappedData[targetField] = value;
      }
    }

    return mappedData;
  }

  /**
   * Extrai dados da resposta da API usando o caminho configurado
   */
  static extractDataFromApiResponse(
    apiResponse: any,
    config: GenericEndpointConfig
  ): any[] {
    if (!apiResponse) {
      return [];
    }

    // Tentar diferentes caminhos para os dados
    const possiblePaths = [
      config.dataPath,
      'data',
      'records',
      'items',
      'results',
      'content',
    ].filter(Boolean);

    for (const path of possiblePaths) {
      const data = apiResponse[path!];
      if (Array.isArray(data)) {
        return data;
      }
    }

    // Se não encontrou array em nenhum caminho, verificar se a resposta é um array
    if (Array.isArray(apiResponse)) {
      return apiResponse;
    }

    // Se é um objeto único, retornar como array
    if (typeof apiResponse === 'object' && apiResponse !== null) {
      return [apiResponse];
    }

    console.warn(
      'Não foi possível extrair dados da resposta da API:',
      apiResponse
    );
    return [];
  }

  /**
   * Valida se os dados mapeados contêm os campos obrigatórios
   */
  static validateMappedData(
    mappedData: any,
    config: GenericEndpointConfig
  ): boolean {
    const requiredFields = config.fieldMappings
      .filter(mapping => mapping.required)
      .map(mapping => mapping.targetField);

    for (const field of requiredFields) {
      if (mappedData[field] === undefined || mappedData[field] === null) {
        console.error(
          `Campo obrigatório '${field}' está ausente nos dados mapeados`
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Obtém configuração para uma entidade
   */
  static getConfig(entityName: string): GenericEndpointConfig | undefined {
    return GENERIC_ENDPOINT_CONFIGS[entityName];
  }

  /**
   * Verifica se uma entidade tem configuração genérica
   */
  static hasConfig(entityName: string): boolean {
    return entityName in GENERIC_ENDPOINT_CONFIGS;
  }

  /**
   * Lista todas as entidades configuradas
   */
  static getConfiguredEntities(): string[] {
    return Object.keys(GENERIC_ENDPOINT_CONFIGS);
  }
}

/**
 * Converte configuração genérica para o formato legado (compatibilidade)
 */
export function convertToLegacyMapping(
  config: GenericEndpointConfig
): EndpointMapping {
  const fieldMapping: Record<
    string,
    string | { field: string; transform?: (value: any) => any }
  > = {};

  for (const mapping of config.fieldMappings) {
    if (mapping.transform) {
      fieldMapping[mapping.sourceField] = {
        field: mapping.targetField,
        transform: mapping.transform,
      };
    } else {
      fieldMapping[mapping.sourceField] = mapping.targetField;
    }
  }

  return {
    model: config.model,
    primaryKey: config.primaryKey,
    fieldMapping,
  };
}
