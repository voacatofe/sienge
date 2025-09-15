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

  enterprises: {
    apiEndpoint: '/enterprises',
    model: 'empreendimento',
    primaryKey: 'id',
    dataPath: 'data',
    fieldMappings: [
      { sourceField: 'id', targetField: 'id', required: true },
      { sourceField: 'name', targetField: 'nome', required: true },
      { sourceField: 'commercialName', targetField: 'nomeComercial' },
      { sourceField: 'enterpriseObservation', targetField: 'observacaoEmpreendimento' },
      { sourceField: 'cnpj', targetField: 'cnpj' },
      { sourceField: 'type', targetField: 'tipo' },
      { sourceField: 'adress', targetField: 'endereco' },
      { sourceField: 'address', targetField: 'endereco' },
      { sourceField: 'city', targetField: 'cidade' },
      { sourceField: 'state', targetField: 'estado' },
      { sourceField: 'zipCode', targetField: 'cep' },
      { sourceField: 'phone', targetField: 'telefone' },
      { sourceField: 'email', targetField: 'email' },
      { sourceField: 'site', targetField: 'site' },
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
      { sourceField: 'companyId', targetField: 'companyId' },
      { sourceField: 'company_id', targetField: 'companyId' },
      { sourceField: 'internalCompanyId', targetField: 'internalCompanyId' },
      { sourceField: 'internal_company_id', targetField: 'internalCompanyId' },
      { sourceField: 'companyName', targetField: 'companyName' },
      { sourceField: 'company_name', targetField: 'companyName' },
      { sourceField: 'buildingCostEstimationStatus', targetField: 'buildingCostEstimationStatus' },
      { sourceField: 'building_cost_estimation_status', targetField: 'buildingCostEstimationStatus' },
      { sourceField: 'buildingStatus', targetField: 'buildingStatus' },
      { sourceField: 'building_status', targetField: 'buildingStatus' },
      { sourceField: 'receivableRegister', targetField: 'receivableRegister' },
      { sourceField: 'receivable_register', targetField: 'receivableRegister' },
      {
        sourceField: 'enabledForIntegration',
        targetField: 'enabledForIntegration',
        transform: (val: any) => val === true,
        defaultValue: false,
      },
      {
        sourceField: 'enabled_for_integration',
        targetField: 'enabledForIntegration',
        transform: (val: any) => val === true,
      },
      { sourceField: 'addressDetails', targetField: 'addressDetails' },
      { sourceField: 'address_details', targetField: 'addressDetails' },
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

  sites: {
    apiEndpoint: '/sites',
    model: 'site',
    primaryKey: 'id',
    dataPath: 'results',
    fieldMappings: [
      { sourceField: 'id', targetField: 'id', required: true },
      { sourceField: 'description', targetField: 'descricao', required: true },
      { sourceField: 'buildingId', targetField: 'buildingId' },
      { sourceField: 'building_id', targetField: 'buildingId' },
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

  units: {
    apiEndpoint: '/units',
    model: 'unidade',
    primaryKey: 'id',
    dataPath: 'data',
    fieldMappings: [
      { sourceField: 'id', targetField: 'id', required: true },
      { sourceField: 'enterpriseId', targetField: 'enterpriseId', required: true },
      { sourceField: 'enterprise_id', targetField: 'enterpriseId', required: true },
      { sourceField: 'contractId', targetField: 'contractId' },
      { sourceField: 'contract_id', targetField: 'contractId' },
      { sourceField: 'indexerId', targetField: 'indexerId' },
      { sourceField: 'indexer_id', targetField: 'indexerId' },
      { sourceField: 'name', targetField: 'nome', required: true },
      { sourceField: 'propertyType', targetField: 'tipoImovel' },
      { sourceField: 'property_type', targetField: 'tipoImovel' },
      { sourceField: 'note', targetField: 'observacao' },
      { sourceField: 'commercialStock', targetField: 'estoqueComercial' },
      { sourceField: 'commercial_stock', targetField: 'estoqueComercial' },
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
      // Campos adicionais da API
      { sourceField: 'propertyType', targetField: 'propertyType' },
      { sourceField: 'property_type', targetField: 'propertyType' },
      { sourceField: 'commercialStock', targetField: 'commercialStock' },
      { sourceField: 'commercial_stock', targetField: 'commercialStock' },
      { sourceField: 'note', targetField: 'note' },
      { sourceField: 'classificationUnit', targetField: 'classificationUnit' },
      { sourceField: 'classification_unit', targetField: 'classificationUnit' },
      { sourceField: 'propertyTypeId', targetField: 'propertyTypeId' },
      { sourceField: 'property_type_id', targetField: 'propertyTypeId' },
      { sourceField: 'situationId', targetField: 'situationId' },
      { sourceField: 'situation_id', targetField: 'situationId' },
      {
        sourceField: 'condominiumValue',
        targetField: 'condominiumValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'condominium_value',
        targetField: 'condominiumValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'privateArea',
        targetField: 'privateArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'private_area',
        targetField: 'privateArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'totalArea',
        targetField: 'totalArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'total_area',
        targetField: 'totalArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'builtArea',
        targetField: 'builtArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'built_area',
        targetField: 'builtArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'usefulArea',
        targetField: 'usefulArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      {
        sourceField: 'useful_area',
        targetField: 'usefulArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      { sourceField: 'garageSpaces', targetField: 'garageSpaces' },
      { sourceField: 'garage_spaces', targetField: 'garageSpaces' },
      { sourceField: 'bedrooms', targetField: 'bedrooms' },
      { sourceField: 'suites', targetField: 'suites' },
      { sourceField: 'bathrooms', targetField: 'bathrooms' },
      { sourceField: 'livingRooms', targetField: 'livingRooms' },
      { sourceField: 'living_rooms', targetField: 'livingRooms' },
      { sourceField: 'diningRooms', targetField: 'diningRooms' },
      { sourceField: 'dining_rooms', targetField: 'diningRooms' },
      { sourceField: 'kitchens', targetField: 'kitchens' },
      { sourceField: 'serviceArea', targetField: 'serviceArea' },
      { sourceField: 'service_area', targetField: 'serviceArea' },
      { sourceField: 'laundry', targetField: 'laundry' },
      { sourceField: 'balcony', targetField: 'balcony' },
      { sourceField: 'homeOffice', targetField: 'homeOffice' },
      { sourceField: 'home_office', targetField: 'homeOffice' },
      { sourceField: 'closet', targetField: 'closet' },
      { sourceField: 'pantry', targetField: 'pantry' },
      { sourceField: 'garden', targetField: 'garden' },
      { sourceField: 'terrace', targetField: 'terrace' },
      { sourceField: 'roof', targetField: 'roof' },
      { sourceField: 'basement', targetField: 'basement' },
      { sourceField: 'groundFloor', targetField: 'groundFloor' },
      { sourceField: 'ground_floor', targetField: 'groundFloor' },
      { sourceField: 'mezzanine', targetField: 'mezzanine' },
      { sourceField: 'roofGarden', targetField: 'roofGarden' },
      { sourceField: 'roof_garden', targetField: 'roofGarden' },
      { sourceField: 'socialRoom', targetField: 'socialRoom' },
      { sourceField: 'social_room', targetField: 'socialRoom' },
      { sourceField: 'gym', targetField: 'gym' },
      { sourceField: 'partyRoom', targetField: 'partyRoom' },
      { sourceField: 'party_room', targetField: 'partyRoom' },
      { sourceField: 'playground', targetField: 'playground' },
      { sourceField: 'barbecueArea', targetField: 'barbecueArea' },
      { sourceField: 'barbecue_area', targetField: 'barbecueArea' },
      { sourceField: 'swimmingPool', targetField: 'swimmingPool' },
      { sourceField: 'swimming_pool', targetField: 'swimmingPool' },
      { sourceField: 'sauna', targetField: 'sauna' },
      { sourceField: 'steamRoom', targetField: 'steamRoom' },
      { sourceField: 'steam_room', targetField: 'steamRoom' },
      { sourceField: 'jacuzzi', targetField: 'jacuzzi' },
      { sourceField: 'elevator', targetField: 'elevator' },
      { sourceField: 'concierge', targetField: 'concierge' },
      { sourceField: 'security', targetField: 'security' },
      { sourceField: 'camera', targetField: 'camera' },
      { sourceField: 'intercom', targetField: 'intercom' },
      { sourceField: 'generator', targetField: 'generator' },
      { sourceField: 'airConditioning', targetField: 'airConditioning' },
      { sourceField: 'air_conditioning', targetField: 'airConditioning' },
      { sourceField: 'heating', targetField: 'heating' },
      { sourceField: 'fireplace', targetField: 'fireplace' },
      { sourceField: 'solarHeating', targetField: 'solarHeating' },
      { sourceField: 'solar_heating', targetField: 'solarHeating' },
      { sourceField: 'solarPanel', targetField: 'solarPanel' },
      { sourceField: 'solar_panel', targetField: 'solarPanel' },
      { sourceField: 'waterTank', targetField: 'waterTank' },
      { sourceField: 'water_tank', targetField: 'waterTank' },
      { sourceField: 'gasTank', targetField: 'gasTank' },
      { sourceField: 'gas_tank', targetField: 'gasTank' },
      { sourceField: 'waterHeater', targetField: 'waterHeater' },
      { sourceField: 'water_heater', targetField: 'waterHeater' },
      { sourceField: 'waterSoftener', targetField: 'waterSoftener' },
      { sourceField: 'water_softener', targetField: 'waterSoftener' },
      { sourceField: 'waterFilter', targetField: 'waterFilter' },
      { sourceField: 'water_filter', targetField: 'waterFilter' },
      { sourceField: 'waterPump', targetField: 'waterPump' },
      { sourceField: 'water_pump', targetField: 'waterPump' },
      { sourceField: 'waterTreatment', targetField: 'waterTreatment' },
      { sourceField: 'water_treatment', targetField: 'waterTreatment' },
      { sourceField: 'sewageTreatment', targetField: 'sewageTreatment' },
      { sourceField: 'sewage_treatment', targetField: 'sewageTreatment' },
      { sourceField: 'rainwaterHarvesting', targetField: 'rainwaterHarvesting' },
      { sourceField: 'rainwater_harvesting', targetField: 'rainwaterHarvesting' },
      { sourceField: 'grayWaterReuse', targetField: 'grayWaterReuse' },
      { sourceField: 'gray_water_reuse', targetField: 'grayWaterReuse' },
      { sourceField: 'energyEfficiency', targetField: 'energyEfficiency' },
      { sourceField: 'energy_efficiency', targetField: 'energyEfficiency' },
      { sourceField: 'sustainability', targetField: 'sustainability' },
      { sourceField: 'accessibility', targetField: 'accessibility' },
      { sourceField: 'petFriendly', targetField: 'petFriendly' },
      { sourceField: 'pet_friendly', targetField: 'petFriendly' },
      { sourceField: 'furnished', targetField: 'furnished' },
      { sourceField: 'semiFurnished', targetField: 'semiFurnished' },
      { sourceField: 'semi_furnished', targetField: 'semiFurnished' },
      { sourceField: 'unfurnished', targetField: 'unfurnished' },
      { sourceField: 'readyToLive', targetField: 'readyToLive' },
      { sourceField: 'ready_to_live', targetField: 'readyToLive' },
      { sourceField: 'underConstruction', targetField: 'underConstruction' },
      { sourceField: 'under_construction', targetField: 'underConstruction' },
      { sourceField: 'planned', targetField: 'planned' },
      { sourceField: 'availableForSale', targetField: 'availableForSale' },
      { sourceField: 'available_for_sale', targetField: 'availableForSale' },
      { sourceField: 'availableForRent', targetField: 'availableForRent' },
      { sourceField: 'available_for_rent', targetField: 'availableForRent' },
      { sourceField: 'sold', targetField: 'sold' },
      { sourceField: 'rented', targetField: 'rented' },
      { sourceField: 'reserved', targetField: 'reserved' },
      { sourceField: 'technicalReserve', targetField: 'technicalReserve' },
      { sourceField: 'technical_reserve', targetField: 'technicalReserve' },
      { sourceField: 'exchange', targetField: 'exchange' },
      { sourceField: 'mutual', targetField: 'mutual' },
      { sourceField: 'proposal', targetField: 'proposal' },
      { sourceField: 'transferred', targetField: 'transferred' },
      { sourceField: 'soldToThirdParties', targetField: 'soldToThirdParties' },
      { sourceField: 'sold_to_third_parties', targetField: 'soldToThirdParties' },
      { sourceField: 'soldInPreContract', targetField: 'soldInPreContract' },
      { sourceField: 'sold_in_pre_contract', targetField: 'soldInPreContract' },
      // Dados adicionais (JSON)
      { sourceField: 'additionalData', targetField: 'additionalData' },
      { sourceField: 'additional_data', targetField: 'additionalData' },
      { sourceField: 'childUnits', targetField: 'childUnits' },
      { sourceField: 'child_units', targetField: 'childUnits' },
      { sourceField: 'groupings', targetField: 'groupings' },
      { sourceField: 'specialValues', targetField: 'specialValues' },
      { sourceField: 'special_values', targetField: 'specialValues' },
      { sourceField: 'links', targetField: 'links' },
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
