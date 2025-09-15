// Configuração de mapeamentos para endpoints do Sienge
// Para adicionar um novo endpoint, basta adicionar uma nova entrada neste objeto

export interface FieldMapping {
  field?: string;
  transform?: (value: any) => any;
}

export interface EndpointMapping {
  model: string;
  primaryKey: string;
  fieldMapping: Record<string, string | FieldMapping>;
}

export const ENDPOINT_MAPPINGS: Record<string, EndpointMapping> = {
  'customers': {
    model: 'cliente',
    primaryKey: 'idCliente',
    fieldMapping: {
      id: 'idCliente',
      name: 'nomeCompleto',
      cpfCnpj: 'cpfCnpj',
      email: 'email',
      active: { field: 'ativo', transform: (val: any) => val !== false },
      createdAt: { field: 'dataCadastro', transform: (val: any) => val ? new Date(val) : new Date() },
      updatedAt: { field: 'dataAtualizacao', transform: () => new Date() },
      socialName: 'nomeSocial',
      rg: 'rg',
      birthDate: { field: 'dataNascimento', transform: (val: any) => val ? new Date(val) : null },
      nationality: 'nacionalidade',
      maritalStatus: 'estadoCivilStr',
      profession: 'profissaoStr',
      foreigner: 'foreigner',
      sex: 'sex',
      birthPlace: 'birthPlace',
      clientType: 'clientType',
      fatherName: 'fatherName',
      internationalId: 'internationalId',
      issueDateIdentityCard: { field: 'issueDateIdentityCard', transform: (val: any) => val ? new Date(val) : null },
      issuingBody: 'issuingBody',
      licenseIssueDate: { field: 'licenseIssueDate', transform: (val: any) => val ? new Date(val) : null },
      licenseIssuingBody: 'licenseIssuingBody',
      licenseNumber: 'licenseNumber',
      mailingAddress: 'mailingAddress',
      marriageDate: { field: 'marriageDate', transform: (val: any) => val ? new Date(val) : null },
      matrimonialRegime: 'matrimonialRegime',
      motherName: 'motherName',
      cityRegistrationNumber: 'cityRegistrationNumber',
      cnaeNumber: 'cnaeNumber',
      contactName: 'contactName',
      creaNumber: 'creaNumber',
      establishmentDate: { field: 'establishmentDate', transform: (val: any) => val ? new Date(val) : null },
      fantasyName: 'fantasyName',
      note: 'note',
      site: 'site',
      shareCapital: { field: 'shareCapital', transform: (val: any) => val ? parseFloat(val) : null },
      stateRegistrationNumber: 'stateRegistrationNumber',
      technicalManager: 'technicalManager',
      personType: 'personType',
      activityId: 'activityId',
      activityDescription: 'activityDescription'
    }
  },
  
  'companies': {
    model: 'empresa',
    primaryKey: 'idEmpresa',
    fieldMapping: {
      id: 'idEmpresa',
      name: 'nomeEmpresa',
      cnpj: 'cnpj',
      stateRegistration: 'inscricaoEstadual',
      cityRegistration: 'inscricaoMunicipal',
      address: 'endereco',
      city: 'cidade',
      state: 'estado',
      zipCode: 'cep',
      phone: 'telefone',
      email: 'email',
      website: 'site',
      active: { field: 'ativo', transform: (val: any) => val !== false },
      createdAt: { field: 'dataCadastro', transform: (val: any) => val ? new Date(val) : new Date() },
      updatedAt: { field: 'dataAtualizacao', transform: () => new Date() }
    }
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
      contractDate: { field: 'contractDate', transform: (val: any) => val ? new Date(val) : null },
      issueDate: { field: 'issueDate', transform: (val: any) => val ? new Date(val) : null },
      accountingDate: { field: 'accountingDate', transform: (val: any) => val ? new Date(val) : null },
      expectedDeliveryDate: { field: 'expectedDeliveryDate', transform: (val: any) => val ? new Date(val) : null },
      keysDeliveredAt: { field: 'keysDeliveredAt', transform: (val: any) => val ? new Date(val) : null },
      number: 'number',
      externalId: 'externalId',
      correctionType: 'correctionType',
      situation: 'situation',
      discountType: 'discountType',
      discountPercentage: { field: 'discountPercentage', transform: (val: any) => val ? parseFloat(val) : null },
      value: { field: 'value', transform: (val: any) => val ? parseFloat(val) : null },
      totalSellingValue: { field: 'totalSellingValue', transform: (val: any) => val ? parseFloat(val) : null },
      cancellationDate: { field: 'cancellationDate', transform: (val: any) => val ? new Date(val) : null },
      totalCancellationAmount: { field: 'totalCancellationAmount', transform: (val: any) => val ? parseFloat(val) : null },
      cancellationReason: 'cancellationReason',
      financialInstitutionNumber: 'financialInstitutionNumber',
      financialInstitutionDate: { field: 'financialInstitutionDate', transform: (val: any) => val ? new Date(val) : null },
      proRataIndexer: 'proRataIndexer',
      interestType: 'interestType',
      interestPercentage: { field: 'interestPercentage', transform: (val: any) => val ? parseFloat(val) : null },
      fineRate: { field: 'fineRate', transform: (val: any) => val ? parseFloat(val) : null },
      lateInterestCalculationType: 'lateInterestCalculationType',
      dailyLateInterestValue: { field: 'dailyLateInterestValue', transform: (val: any) => val ? parseFloat(val) : null },
      containsRemadeInstallments: 'containsRemadeInstallments',
      specialClause: 'specialClause',
      salesContractCustomers: { field: 'salesContractCustomers', transform: (val: any) => val || null },
      salesContractUnits: { field: 'salesContractUnits', transform: (val: any) => val || null },
      paymentConditions: { field: 'paymentConditions', transform: (val: any) => val || null },
      brokers: { field: 'brokers', transform: (val: any) => val || null },
      linkedCommissions: { field: 'linkedCommissions', transform: (val: any) => val || null },
      links: { field: 'links', transform: (val: any) => val || null },
      createdAt: { field: 'dataCadastro', transform: (val: any) => val ? new Date(val) : new Date() },
      updatedAt: { field: 'dataAtualizacao', transform: () => new Date() }
    }
  },
  
  'income': {
    model: 'tituloReceber',
    primaryKey: 'idTituloReceber',
    fieldMapping: {
      id: 'idTituloReceber',
      contractId: 'idContrato',
      customerId: 'idCliente',
      clientId: 'idCliente',
      companyId: 'idEmpresa',
      documentNumber: 'numeroDocumento',
      number: 'numeroDocumento',
      documentIdentId: 'idDocumentoIdent',
      issueDate: { field: 'dataEmissao', transform: (val: any) => val ? new Date(val) : new Date() },
      dueDate: { field: 'dataVencimento', transform: (val: any) => val ? new Date(val) : new Date() },
      originalValue: { field: 'valorOriginal', transform: (val: any) => val ? parseFloat(val) : 0 },
      updatedValue: { field: 'valorAtualizado', transform: (val: any) => val ? parseFloat(val) : null },
      indexerId: 'idIndexador',
      interest: { field: 'juros', transform: (val: any) => val ? parseFloat(val) : null },
      fine: { field: 'multa', transform: (val: any) => val ? parseFloat(val) : null },
      discountGranted: { field: 'descontoConcedido', transform: (val: any) => val ? parseFloat(val) : null },
      paidValue: { field: 'valorPago', transform: (val: any) => val ? parseFloat(val) : null },
      paymentDate: { field: 'dataPagamento', transform: (val: any) => val ? new Date(val) : null },
      status: { field: 'status', transform: (val: any) => val || 'pending' },
      observations: 'observacoes',
      notes: 'observacoes',
      carrierId: 'idPortador',
      financialPlanId: 'idPlanoFinanceiro'
    }
  },

  // Exemplo de como adicionar um novo endpoint:
  // 'novo-endpoint': {
  //   model: 'nomeDoModel',
  //   primaryKey: 'campoChavePrimaria',
  //   fieldMapping: {
  //     campoOrigem: 'campoDestino',
  //     outroCampo: { field: 'campoDestino', transform: (val) => new Date(val) },
  //     // ... outros campos
  //   }
  // }
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
export function getEndpointMapping(endpoint: string): EndpointMapping | undefined {
  return ENDPOINT_MAPPINGS[endpoint];
}