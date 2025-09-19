// Configuração de mapeamentos para endpoints do Sienge
// Para adicionar um novo endpoint, basta adicionar uma nova entrada neste objeto

import { getSaoPauloNow } from '@/lib/date-helper';

export interface FieldMapping {
  field?: string;
  transform?: (value: any, data?: any) => any;
}

export interface EndpointMapping {
  model: string;
  primaryKey: string;
  fieldMapping: Record<string, string | FieldMapping>;
}

export const ENDPOINT_MAPPINGS: Record<string, EndpointMapping> = {
  customers: {
    model: 'cliente',
    primaryKey: 'idCliente',
    fieldMapping: {
      // Identificador principal
      id: 'idCliente',

      // Tipo de pessoa (PF/PJ)
      personType: 'personType',

      // Dados básicos
      name: 'name', // Campo renomeado de nomeCompleto para name
      tradingName: 'tradingName', // Nome fantasia para PJ
      corporateName: 'corporateName', // Razão social para PJ
      internalCode: 'internalCode',
      socialName: 'nomeSocial',

      // Documentos - CPF/CNPJ tratados separadamente
      cpf: {
        field: 'cpfCnpj',
        transform: (val: any, data: any) => {
          // Apenas preenche se for pessoa física
          if (data.personType === 'PHYSICAL' && val) {
            return val;
          }
          return null;
        },
      },
      cnpj: {
        field: 'cnpj',
        transform: (val: any, data: any) => {
          // Campo específico para CNPJ (PJ)
          if (data.personType === 'LEGAL' && val) {
            return val;
          }
          // Se for PJ mas o CNPJ veio no campo cpf, usa ele
          if (data.personType === 'LEGAL' && data.cpf) {
            return data.cpf;
          }
          return null;
        },
      },
      rg: 'rg',

      // Dados pessoais
      email: 'email',
      birthDate: {
        field: 'dataNascimento',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      civilStatus: 'civilStatus',
      sex: 'sex',
      profession: 'profession',
      nationality: 'nacionalidade',
      birthPlace: 'birthPlace',
      foreigner: {
        field: 'foreigner',
        transform: (val: any) => val === true || val === 'true' || val === 'S',
      },
      motherName: 'motherName',
      fatherName: 'fatherName',

      // Campos de controle da API (mapeados para campos existentes)
      createdAt: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      modifiedAt: {
        field: 'dataAtualizacao',
        transform: (val: any) => (val ? new Date(val) : null),
      },

      // Campos de documentos adicionais (apenas os que funcionam)
      // Removidos campos que estavam 100% vazios

      // Mapear fantasyName para tradingName existente
      fantasyName: 'tradingName',

      // Estado civil detalhado (objeto)
      maritalStatus: {
        field: 'maritalStatus',
        transform: (val: any) => {
          if (!val) return null;
          // Estrutura: { weddingDate: string, patrimonyDivision: string }
          return val;
        },
      },

      // Campos de controle interno
      active: { field: 'ativo', transform: (val: any) => val !== false },
      updatedAt: {
        field: 'dataAtualizacao',
        transform: () => getSaoPauloNow(),
      },

      // Novos campos da API Sienge
      procurators: {
        field: 'procurators',
        transform: (val: any) => val || [],
      },
      contacts: {
        field: 'contacts',
        transform: (val: any) => val || [],
      },
      subTypes: {
        field: 'subTypes',
        transform: (val: any) => val || [],
      },
      spouse: {
        field: 'spouse',
        transform: (val: any) => val || null,
      },
      familyIncome: {
        field: 'familyIncome',
        transform: (val: any) => val || [],
      },

      // Campos extras para processamento posterior dos telefones e endereços
      // Estes não vão diretamente para a tabela Cliente, mas são usados para criar registros relacionados

      // Mapeamento direto do primeiro endereço
      mainAddress: {
        field: 'addresses',
        transform: (val: any) => {
          if (Array.isArray(val) && val.length > 0) {
            const firstAddress = val[0];
            const street = firstAddress.street || firstAddress.logradouro || '';
            const number = firstAddress.number || firstAddress.numero || '';
            const complement =
              firstAddress.complement || firstAddress.complemento || '';
            return (
              `${street}${number ? ', ' + number : ''}${complement ? ' - ' + complement : ''}`.trim() ||
              null
            );
          }
          return null;
        },
      },
      mainAddressCity: {
        field: 'addresses',
        transform: (val: any) => {
          if (Array.isArray(val) && val.length > 0) {
            const firstAddress = val[0];
            return firstAddress.city || firstAddress.cidade || null;
          }
          return null;
        },
      },
      mainAddressState: {
        field: 'addresses',
        transform: (val: any) => {
          if (Array.isArray(val) && val.length > 0) {
            const firstAddress = val[0];
            return firstAddress.state || firstAddress.estado || null;
          }
          return null;
        },
      },
      mainAddressZipCode: {
        field: 'addresses',
        transform: (val: any) => {
          if (Array.isArray(val) && val.length > 0) {
            const firstAddress = val[0];
            return firstAddress.zipCode || firstAddress.cep || null;
          }
          return null;
        },
      },
      mainAddressType: {
        field: 'addresses',
        transform: (val: any) => {
          if (Array.isArray(val) && val.length > 0) {
            const firstAddress = val[0];
            const type = firstAddress.type || firstAddress.tipo || '';
            return type === 'R'
              ? 'Residencial'
              : type === 'C'
                ? 'Comercial'
                : type;
          }
          return null;
        },
      },

      // Campos JSON para telefones e endereços
      phones: {
        field: 'phones',
        transform: (val: any) => val || [],
      },
      addresses: {
        field: 'addresses',
        transform: (val: any) => val || [],
      },
    },
  },

  companies: {
    model: 'empresa',
    primaryKey: 'idEmpresa',
    fieldMapping: {
      id: 'idEmpresa',
      name: 'nomeEmpresa',
      cnpj: 'cnpj',
    },
  },

  'sales-contracts': {
    model: 'contratoVenda',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      companyId: 'companyId',
      internalCompanyId: 'internalCompanyId',
      companyName: 'companyName',
      enterpriseId: 'enterpriseId',
      internalEnterpriseId: 'internalEnterpriseId',
      enterpriseName: 'enterpriseName',
      receivableBillId: 'receivableBillId',
      cancellationPayableBillId: 'cancellationPayableBillId',
      contractDate: {
        field: 'contractDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      issueDate: {
        field: 'issueDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      accountingDate: {
        field: 'accountingDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      expectedDeliveryDate: {
        field: 'expectedDeliveryDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      keysDeliveredAt: {
        field: 'keysDeliveredAt',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      number: 'number',
      externalId: 'externalId',
      correctionType: 'correctionType',
      situation: 'situation',
      discountType: 'discountType',
      discountPercentage: {
        field: 'discountPercentage',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      value: {
        field: 'value',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      totalSellingValue: {
        field: 'totalSellingValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      cancellationDate: {
        field: 'cancellationDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      totalCancellationAmount: {
        field: 'totalCancellationAmount',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      cancellationReason: 'cancellationReason',
      financialInstitutionNumber: 'financialInstitutionNumber',
      financialInstitutionDate: {
        field: 'financialInstitutionDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      proRataIndexer: 'proRataIndexer',
      interestType: 'interestType',
      interestPercentage: {
        field: 'interestPercentage',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      fineRate: {
        field: 'fineRate',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      lateInterestCalculationType: 'lateInterestCalculationType',
      dailyLateInterestValue: {
        field: 'dailyLateInterestValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      containsRemadeInstallments: 'containsRemadeInstallments',
      specialClause: 'specialClause',
      salesContractCustomers: {
        field: 'salesContractCustomers',
        transform: (val: any) => val || null,
      },
      salesContractUnits: {
        field: 'salesContractUnits',
        transform: (val: any) => val || null,
      },
      paymentConditions: {
        field: 'paymentConditions',
        transform: (val: any) => val || null,
      },
      brokers: { field: 'brokers', transform: (val: any) => val || null },
      linkedCommissions: {
        field: 'linkedCommissions',
        transform: (val: any) => val || null,
      },
      links: { field: 'links', transform: (val: any) => val || null },
      // Mapeamento único para datas do Sienge
      creationDate: {
        field: 'dataCriacaoSienge',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      lastUpdateDate: {
        field: 'dataUltimaAtualizacaoSienge',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      // Campos de auditoria locais (sempre gerados)
      createdAt: {
        field: 'dataCadastro',
        transform: () => new Date(),
      },
      updatedAt: {
        field: 'dataAtualizacao',
        transform: () => getSaoPauloNow(),
      },
    },
  },

  enterprises: {
    model: 'empreendimento',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      name: 'nome',
      commercialName: 'nomeComercial',
      enterpriseObservation: 'observacaoEmpreendimento',
      cnpj: 'cnpj',
      type: 'tipo',
      adress: 'endereco',
      creationDate: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      modificationDate: {
        field: 'dataAtualizacao',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      createdBy: 'criadoPor',
      modifiedBy: 'modificadoPor',
      companyId: 'idEmpresa',
      companyName: 'nomeEmpresa',
      // Campos que estavam faltando no mapeamento
      costDatabaseId: {
        field: 'idBaseCustos',
        transform: (val: any) => (val ? parseInt(val) : null),
      },
      costDatabaseDescription: 'descricaoBaseCustos',
      buildingTypeId: {
        field: 'idTipoObra',
        transform: (val: any) => (val ? parseInt(val) : null),
      },
      buildingTypeDescription: 'descricaoTipoObra',
    },
  },

  units: {
    model: 'unidade',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      enterpriseId: {
        field: 'idEmpreendimento',
        transform: (val: any) => (val && val !== undefined ? val : null),
      },
      contractId: {
        field: 'idContrato',
        transform: (val: any) => (val && val !== undefined ? val : null),
      },
      indexerId: {
        field: 'idIndexador',
        transform: (val: any) => (val !== undefined && val !== null ? val : 1), // Aceitar 0 como válido, usar 1 como default apenas para null/undefined
      },
      name: 'nome',
      propertyType: 'tipoImovel',
      note: 'observacao',
      commercialStock: 'estoqueComercial',
      latitude: 'latitude',
      longitude: 'longitude',
      legalRegistrationNumber: 'matricula',
      deliveryDate: {
        field: 'dataEntrega',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      scheduledDeliveryDate: {
        field: 'scheduledDeliveryDate', // Campo separado para evitar conflitos
        transform: (val: any) => (val ? new Date(val) : null),
      },
      privateArea: {
        field: 'areaPrivativa',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      commonArea: {
        field: 'areaComum',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      terrainArea: {
        field: 'areaTerreno',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      nonProportionalCommonArea: {
        field: 'areaComumNaoProporcional',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      idealFraction: {
        field: 'fracaoIdeal',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      idealFractionSquareMeter: {
        field: 'fracaoIdealM2',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      generalSaleValueFraction: {
        field: 'fracaoVGV',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      indexedQuantity: {
        field: 'quantidadeIndexada',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      prizedCompliance: {
        field: 'adimplenciaPremiada',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      terrainValue: {
        field: 'valorTerreno',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      floor: 'pavimento',
      contractNumber: 'numeroContrato',
      usableArea: {
        field: 'areaUtil',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      iptuValue: {
        field: 'valorIPTU',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      realEstateRegistration: 'inscricaoImobiliaria',
      createdAt: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: {
        field: 'dataAtualizacao',
        transform: () => new Date(),
      },

      // Novos campos JSON arrays da API Sienge
      childUnits: {
        field: 'childUnits',
        transform: (val: any) => val || [],
      },
      groupings: {
        field: 'groupings',
        transform: (val: any) => val || [],
      },
      specialValues: {
        field: 'specialValues',
        transform: (val: any) => val || [],
      },
      links: {
        field: 'links',
        transform: (val: any) => val || [],
      },
    },
  },

  hooks: {
    model: 'webhook',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      url: 'url',
      token: 'token',
      events: { field: 'events', transform: (val: any) => val || [] },
    },
  },

  bearers: {
    model: 'portador',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      name: 'nome',
    },
  },

  creditors: {
    model: 'credor',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      name: 'nome',
      tradeName: 'nomeFantasia',
      cpf: 'cpf',
      cnpj: 'cnpj',
      supplier: 'fornecedor',
      broker: 'corretor',
      employee: 'funcionario',
      active: {
        field: 'ativo',
        transform: (val: any) => val === true || val === 'S',
      },
      stateRegistrationNumber: 'inscricaoEstadual',
      stateRegistrationType: 'tipoInscricaoEstadual',
      paymentTypeId: 'tipoPagamentoId',
      address: {
        field: 'enderecoCidadeId',
        transform: (val: any) => val?.cityId || null,
      },
      'address.cityName': 'enderecoCidadeNome',
      'address.streetName': 'enderecoRua',
      'address.number': 'enderecoNumero',
      'address.complement': 'enderecoComplemento',
      'address.neighborhood': 'enderecoBairro',
      'address.state': 'enderecoEstado',
      'address.zipCode': 'enderecoCep',
      phones: {
        field: 'telefones',
        transform: (val: any) => val || [],
      },
      createdAt: {
        field: 'dataCriacao',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: {
        field: 'dataAtualizacao',
        transform: () => getSaoPauloNow(),
      },
    },
  },

  bills: {
    model: 'tituloPagar',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      debtorId: 'devedorId',
      creditorId: 'credorId',
      documentIdentificationId: 'documentoIdentificacaoId',
      documentNumber: 'numeroDocumento',
      installmentsNumber: 'numeroParcelas',
      totalInvoiceAmount: {
        field: 'valorTotalNota',
        transform: (val: any) => (val ? parseFloat(val) : 0),
      },
      notes: 'observacoes',
      discount: {
        field: 'desconto',
        transform: (val: any) => (val ? parseFloat(val) : 0),
      },
      status: 'status',
      originId: 'origemId',
      registeredUserId: 'usuarioCadastroId',
      registeredBy: 'usuarioCadastroNome',
      changedUserId: 'usuarioAlteracaoId',
      changedBy: 'usuarioAlteracaoNome',
      accessKeyNumber: 'numeroChaveAcesso',
      issueDate: {
        field: 'dataEmissao',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      registeredDate: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      changedDate: {
        field: 'dataAlteracao',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      createdAt: {
        field: 'dataCriacao',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: {
        field: 'dataAtualizacao',
        transform: () => getSaoPauloNow(),
      },
    },
  },

  'accounts-statements': {
    model: 'extratoContas',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      value: {
        field: 'valor',
        transform: (val: any) => (val ? parseFloat(val) : 0),
      },
      date: {
        field: 'data',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      documentNumber: 'numeroDocumento',
      description: 'descricao',
      documentId: 'documentoId',
      type: 'tipo', // Income/Expense
      reconciliationDate: {
        field: 'dataReconciliacao',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      billId: 'tituloId',
      installmentNumber: 'numeroParcela',
      statementOrigin: 'origemExtrato',
      statementType: 'tipoExtrato',
      statementTypeNotes: 'observacoesExtrato',
      // Campos relacionados com apropriações orçamentárias
      budgetCategories: {
        field: 'categoriasOrcamentarias',
        transform: (val: any) => val || [],
      },
      // Links serão processados separadamente para criar registros em extrato_apropriacoes
      links: {
        field: 'tags',
        transform: (val: any) => val || [],
      },
      createdAt: {
        field: 'createdAt',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: { field: 'updatedAt', transform: () => new Date() },
    },
  },

  'cost-centers': {
    model: 'centroCusto',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      name: 'nome',
      cnpj: 'cnpj',
      idCompany: 'empresaId',
      // Arrays opcionais que podem vir em detalhes
      buildingSectors: {
        field: 'buildingSectors',
        transform: (val: any) => val || null,
      },
      availables: {
        field: 'availableAccounts',
        transform: (val: any) => val || null,
      },
      createdAt: {
        field: 'createdAt',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: { field: 'updatedAt', transform: () => new Date() },
    },
  },

  'payment-categories': {
    model: 'planoFinanceiro',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      name: 'nome',
      tpConta: 'tipoConta',
      flRedutora: 'flRedutora',
      flAtiva: 'flAtiva',
      flAdiantamento: 'flAdiantamento',
      flImposto: 'flImposto',
      createdAt: {
        field: 'createdAt',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: { field: 'updatedAt', transform: () => new Date() },
    },
  },

  'supply-contracts/all': {
    model: 'contratoSuprimento',
    primaryKey: 'contractNumber',
    fieldMapping: {
      documentId: 'documentoId',
      contractNumber: 'numeroContrato',
      supplierId: 'fornecedorId',
      supplierName: 'empresaNome', // Note: supplier name goes to empresaNome as we store it
      customerId: 'clienteId',
      companyId: 'empresaId',
      companyName: 'empresaNome',
      responsibleId: 'responsavelId',
      responsibleName: 'responsavelNome',
      status: 'status',
      statusId: 'statusId',
      statusApproval: 'statusAprovacao',
      isAuthorized: { field: 'autorizado', transform: (val: any) => !!val },
      contractDate: {
        field: 'dataContrato',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      startDate: {
        field: 'dataInicio',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      endDate: {
        field: 'dataFim',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      object: 'objeto',
      internalNotes: 'observacoesInternas',
      contractType: 'tipoContrato',
      registrationType: 'tipoRegistro',
      itemType: 'tipoItem',
      totalLaborValue: {
        field: 'valorTotalMaoObra',
        transform: (val: any) => (val ? parseFloat(val) : 0),
      },
      totalMaterialValue: {
        field: 'valorTotalMaterial',
        transform: (val: any) => (val ? parseFloat(val) : 0),
      },
      consistent: { field: 'consistente', transform: (val: any) => !!val },
      buildings: {
        field: 'edificios',
        transform: (val: any) => val || [],
      },
      createdAt: {
        field: 'dataCriacao',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: {
        field: 'dataAtualizacao',
        transform: () => getSaoPauloNow(),
      },
    },
  },
};

// Função utilitária para adicionar novos mapeamentos dinamicamente
export function addEndpointMapping(endpoint: string, mapping: EndpointMapping) {
  ENDPOINT_MAPPINGS[endpoint] = mapping;
}

// Função utilitária para verificar se um endpoint tem mapeamento
export function hasEndpointMapping(endpoint: string): boolean {
  return endpoint in ENDPOINT_MAPPINGS;
}

// Função utilitária para obter o mapeamento de um endpoint
export function getEndpointMapping(
  endpoint: string
): EndpointMapping | undefined {
  return ENDPOINT_MAPPINGS[endpoint];
}
