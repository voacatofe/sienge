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
  customers: {
    model: 'cliente',
    primaryKey: 'idCliente',
    fieldMapping: {
      id: 'idCliente',
      name: 'nomeCompleto',
      cpfCnpj: 'cpfCnpj',
      email: 'email',
      active: { field: 'ativo', transform: (val: any) => val !== false },
      createdAt: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: { field: 'dataAtualizacao', transform: () => new Date() },
      socialName: 'nomeSocial',
      rg: 'rg',
      birthDate: {
        field: 'dataNascimento',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      nationality: 'nacionalidade',
      maritalStatus: 'estadoCivilStr',
      profession: 'profissaoStr',
      foreigner: 'foreigner',
      sex: 'sex',
      birthPlace: 'birthPlace',
      clientType: 'clientType',
      fatherName: 'fatherName',
      internationalId: 'internationalId',
      issueDateIdentityCard: {
        field: 'issueDateIdentityCard',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      issuingBody: 'issuingBody',
      licenseIssueDate: {
        field: 'licenseIssueDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      licenseIssuingBody: 'licenseIssuingBody',
      licenseNumber: 'licenseNumber',
      mailingAddress: 'mailingAddress',
      marriageDate: {
        field: 'marriageDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      matrimonialRegime: 'matrimonialRegime',
      motherName: 'motherName',
      cityRegistrationNumber: 'cityRegistrationNumber',
      cnaeNumber: 'cnaeNumber',
      contactName: 'contactName',
      creaNumber: 'creaNumber',
      establishmentDate: {
        field: 'establishmentDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      fantasyName: 'fantasyName',
      note: 'note',
      site: 'site',
      shareCapital: {
        field: 'shareCapital',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      stateRegistrationNumber: 'stateRegistrationNumber',
      technicalManager: 'technicalManager',
      personType: 'personType',
      activityId: 'activityId',
      activityDescription: 'activityDescription',
    },
  },

  companies: {
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
      createdAt: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: { field: 'dataAtualizacao', transform: () => new Date() },
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
      createdAt: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: { field: 'dataAtualizacao', transform: () => new Date() },
    },
  },

  income: {
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
      issueDate: {
        field: 'dataEmissao',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      dueDate: {
        field: 'dataVencimento',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      originalValue: {
        field: 'valorOriginal',
        transform: (val: any) => (val ? parseFloat(val) : 0),
      },
      updatedValue: {
        field: 'valorAtualizado',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      indexerId: 'idIndexador',
      interest: {
        field: 'juros',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      fine: {
        field: 'multa',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      discountGranted: {
        field: 'descontoConcedido',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      paidValue: {
        field: 'valorPago',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      paymentDate: {
        field: 'dataPagamento',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      status: { field: 'status', transform: (val: any) => val || 'pending' },
      observations: 'observacoes',
      notes: 'observacoes',
      carrierId: 'idPortador',
      financialPlanId: 'idPlanoFinanceiro',
      receivableBillId: 'receivableBillId',
      documentId: 'documentId',
      receivableBillValue: {
        field: 'receivableBillValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      defaulting: {
        field: 'defaulting',
        transform: (val: any) => val === true,
      },
      subjudice: { field: 'subjudice', transform: (val: any) => val === true },
      payOffDate: {
        field: 'payOffDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      normal: { field: 'normal', transform: (val: any) => val !== false },
      inBilling: { field: 'inBilling', transform: (val: any) => val === true },
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
      address: 'endereco',
      city: 'cidade',
      state: 'estado',
      zipCode: 'cep',
      phone: 'telefone',
      email: 'email',
      site: 'site',
      active: { field: 'ativo', transform: (val: any) => val !== false },
      isActive: { field: 'ativo', transform: (val: any) => val !== false },
      companyId: 'companyId',
      company_id: 'companyId',
      internalCompanyId: 'internalCompanyId',
      internal_company_id: 'internalCompanyId',
      companyName: 'companyName',
      company_name: 'companyName',
      buildingCostEstimationStatus: 'buildingCostEstimationStatus',
      building_cost_estimation_status: 'buildingCostEstimationStatus',
      buildingStatus: 'buildingStatus',
      building_status: 'buildingStatus',
      receivableRegister: 'receivableRegister',
      receivable_register: 'receivableRegister',
      enabledForIntegration: { field: 'enabledForIntegration', transform: (val: any) => val === true },
      enabled_for_integration: { field: 'enabledForIntegration', transform: (val: any) => val === true },
      addressDetails: 'addressDetails',
      address_details: 'addressDetails',
      createdAt: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      created_at: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: { field: 'dataAtualizacao', transform: () => new Date() },
      updated_at: { field: 'dataAtualizacao', transform: () => new Date() },
    },
  },

  sites: {
    model: 'site',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      description: 'descricao',
      buildingId: 'buildingId',
      building_id: 'buildingId',
      active: { field: 'ativo', transform: (val: any) => val !== false },
      isActive: { field: 'ativo', transform: (val: any) => val !== false },
      createdAt: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      created_at: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: { field: 'dataAtualizacao', transform: () => new Date() },
      updated_at: { field: 'dataAtualizacao', transform: () => new Date() },
    },
  },

  units: {
    model: 'unidade',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      enterpriseId: 'enterpriseId',
      enterprise_id: 'enterpriseId',
      contractId: 'contractId',
      contract_id: 'contractId',
      indexerId: 'indexerId',
      indexer_id: 'indexerId',
      name: 'nome',
      propertyType: 'tipoImovel',
      property_type: 'tipoImovel',
      note: 'observacao',
      commercialStock: 'estoqueComercial',
      commercial_stock: 'estoqueComercial',
      active: { field: 'ativo', transform: (val: any) => val !== false },
      isActive: { field: 'ativo', transform: (val: any) => val !== false },
      // Campos adicionais da API (duplicados removidos)
      classificationUnit: 'classificationUnit',
      classification_unit: 'classificationUnit',
      propertyTypeId: 'propertyTypeId',
      property_type_id: 'propertyTypeId',
      situationId: 'situationId',
      situation_id: 'situationId',
      condominiumValue: {
        field: 'condominiumValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      condominium_value: {
        field: 'condominiumValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      privateArea: {
        field: 'privateArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      private_area: {
        field: 'privateArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      totalArea: {
        field: 'totalArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      total_area: {
        field: 'totalArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      builtArea: {
        field: 'builtArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      built_area: {
        field: 'builtArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      usefulArea: {
        field: 'usefulArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      useful_area: {
        field: 'usefulArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      garageSpaces: 'garageSpaces',
      garage_spaces: 'garageSpaces',
      bedrooms: 'bedrooms',
      suites: 'suites',
      bathrooms: 'bathrooms',
      livingRooms: 'livingRooms',
      living_rooms: 'livingRooms',
      diningRooms: 'diningRooms',
      dining_rooms: 'diningRooms',
      kitchens: 'kitchens',
      serviceArea: 'serviceArea',
      service_area: 'serviceArea',
      laundry: 'laundry',
      balcony: 'balcony',
      homeOffice: 'homeOffice',
      home_office: 'homeOffice',
      closet: 'closet',
      pantry: 'pantry',
      garden: 'garden',
      terrace: 'terrace',
      roof: 'roof',
      basement: 'basement',
      groundFloor: 'groundFloor',
      ground_floor: 'groundFloor',
      mezzanine: 'mezzanine',
      roofGarden: 'roofGarden',
      roof_garden: 'roofGarden',
      socialRoom: 'socialRoom',
      social_room: 'socialRoom',
      gym: 'gym',
      partyRoom: 'partyRoom',
      party_room: 'partyRoom',
      playground: 'playground',
      barbecueArea: 'barbecueArea',
      barbecue_area: 'barbecueArea',
      swimmingPool: 'swimmingPool',
      swimming_pool: 'swimmingPool',
      sauna: 'sauna',
      steamRoom: 'steamRoom',
      steam_room: 'steamRoom',
      jacuzzi: 'jacuzzi',
      elevator: 'elevator',
      concierge: 'concierge',
      security: 'security',
      camera: 'camera',
      intercom: 'intercom',
      generator: 'generator',
      airConditioning: 'airConditioning',
      air_conditioning: 'airConditioning',
      heating: 'heating',
      fireplace: 'fireplace',
      solarHeating: 'solarHeating',
      solar_heating: 'solarHeating',
      solarPanel: 'solarPanel',
      solar_panel: 'solarPanel',
      waterTank: 'waterTank',
      water_tank: 'waterTank',
      gasTank: 'gasTank',
      gas_tank: 'gasTank',
      waterHeater: 'waterHeater',
      water_heater: 'waterHeater',
      waterSoftener: 'waterSoftener',
      water_softener: 'waterSoftener',
      waterFilter: 'waterFilter',
      water_filter: 'waterFilter',
      waterPump: 'waterPump',
      water_pump: 'waterPump',
      waterTreatment: 'waterTreatment',
      water_treatment: 'waterTreatment',
      sewageTreatment: 'sewageTreatment',
      sewage_treatment: 'sewageTreatment',
      rainwaterHarvesting: 'rainwaterHarvesting',
      rainwater_harvesting: 'rainwaterHarvesting',
      grayWaterReuse: 'grayWaterReuse',
      gray_water_reuse: 'grayWaterReuse',
      energyEfficiency: 'energyEfficiency',
      energy_efficiency: 'energyEfficiency',
      sustainability: 'sustainability',
      accessibility: 'accessibility',
      petFriendly: 'petFriendly',
      pet_friendly: 'petFriendly',
      furnished: 'furnished',
      semiFurnished: 'semiFurnished',
      semi_furnished: 'semiFurnished',
      unfurnished: 'unfurnished',
      readyToLive: 'readyToLive',
      ready_to_live: 'readyToLive',
      underConstruction: 'underConstruction',
      under_construction: 'underConstruction',
      planned: 'planned',
      availableForSale: 'availableForSale',
      available_for_sale: 'availableForSale',
      availableForRent: 'availableForRent',
      available_for_rent: 'availableForRent',
      sold: 'sold',
      rented: 'rented',
      reserved: 'reserved',
      technicalReserve: 'technicalReserve',
      technical_reserve: 'technicalReserve',
      exchange: 'exchange',
      mutual: 'mutual',
      proposal: 'proposal',
      transferred: 'transferred',
      soldToThirdParties: 'soldToThirdParties',
      sold_to_third_parties: 'soldToThirdParties',
      soldInPreContract: 'soldInPreContract',
      sold_in_pre_contract: 'soldInPreContract',
      // Dados adicionais (JSON)
      additionalData: 'additionalData',
      additional_data: 'additionalData',
      childUnits: 'childUnits',
      child_units: 'childUnits',
      groupings: 'groupings',
      specialValues: 'specialValues',
      special_values: 'specialValues',
      links: 'links',
      createdAt: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      created_at: {
        field: 'dataCadastro',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      updatedAt: { field: 'dataAtualizacao', transform: () => new Date() },
      updated_at: { field: 'dataAtualizacao', transform: () => new Date() },
    },
  },

  // ============================================
  // ENDPOINTS NÃO MAPEADOS - NOVOS MAPEAMENTOS
  // ============================================

  'accounts-receivable': {
    model: 'contas_receber',
    primaryKey: 'receivableBillId',
    fieldMapping: {
      customerId: 'customerId',
      receivableBillId: 'receivableBillId',
      documentId: 'documentId',
      documentNumber: 'documentNumber',
      issueDate: {
        field: 'issueDate',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      receivableBillValue: {
        field: 'receivableBillValue',
        transform: (val: any) => (val ? parseFloat(val) : 0),
      },
      companyId: 'companyId',
      defaulting: { field: 'defaulting', transform: (val: any) => val === true },
      subjudice: { field: 'subjudice', transform: (val: any) => val === true },
      normal: { field: 'normal', transform: (val: any) => val !== false },
      inBilling: { field: 'inBilling', transform: (val: any) => val === true },
      note: 'note',
      payOffDate: {
        field: 'payOffDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
    },
  },

  'bank-movement': {
    model: 'movimentos_bancarios',
    primaryKey: 'bankMovementId',
    fieldMapping: {
      bankMovementId: 'bankMovementId',
      billId: 'billId',
      installmentId: 'installmentId',
      bankMovementAmount: {
        field: 'bankMovementAmount',
        transform: (val: any) => (val ? parseFloat(val) : 0),
      },
      documentIdentificationId: 'documentIdentificationId',
      documentIdentificationName: 'documentIdentificationName',
      documentIdentificationNumber: 'documentIdentificationNumber',
      bankMovementOriginId: 'bankMovementOriginId',
      bankMovementHistoricId: 'bankMovementHistoricId',
      bankMovementHistoricName: 'bankMovementHistoricName',
      bankMovementOperationId: 'bankMovementOperationId',
      bankMovementOperationName: 'bankMovementOperationName',
      bankMovementOperationType: 'bankMovementOperationType',
      bankMovementReconcile: 'bankMovementReconcile',
      bankMovementDate: {
        field: 'bankMovementDate',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      billDate: {
        field: 'billDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      accountNumber: 'accountNumber',
      companyId: 'companyId',
      companyName: 'companyName',
      groupCompanyId: 'groupCompanyId',
      groupCompanyName: 'groupCompanyName',
      holdingId: 'holdingId',
      holdingName: 'holdingName',
      subsidiaryId: 'subsidiaryId',
      subsidiaryName: 'subsidiaryName',
      creditorId: 'creditorId',
      creditorName: 'creditorName',
      clientId: 'clientId',
      clientName: 'clientName',
      financialCategories: {
        field: 'financialCategories',
        transform: (val: any) => val || null,
      },
      departamentCosts: {
        field: 'departamentCosts',
        transform: (val: any) => val || null,
      },
      buildingCosts: {
        field: 'buildingCosts',
        transform: (val: any) => val || null,
      },
    },
  },

  'construction-daily-report': {
    model: 'diarios_obra',
    primaryKey: 'constructionDailyId',
    fieldMapping: {
      id: 'constructionDailyId',
      constructionDailyId: 'constructionDailyId',
      buildingId: 'buildingId',
      date: {
        field: 'date',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      responsibleId: 'responsibleId',
      rainfallIndex: {
        field: 'rainfallIndex',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      weekDay: 'weekDay',
      notes: 'notes',
      createdBy: 'createdBy',
      createdAt: {
        field: 'createdAt',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      modifiedBy: 'modifiedBy',
      modifiedAt: {
        field: 'modifiedAt',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      shifts: { field: 'shifts', transform: (val: any) => val || null },
      plannedTasks: { field: 'plannedTasks', transform: (val: any) => val || null },
      detachedTasks: { field: 'detachedTasks', transform: (val: any) => val || null },
      events: { field: 'events', transform: (val: any) => val || null },
      crews: { field: 'crews', transform: (val: any) => val || null },
      equipments: { field: 'equipments', transform: (val: any) => val || null },
      attachments: { field: 'attachments', transform: (val: any) => val || null },
    },
  },

  'construction-daily-report/event-type': {
    model: 'tipos_ocorrencia',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      description: 'description',
      isActive: { field: 'isActive', transform: (val: any) => val !== false },
    },
  },

  'construction-daily-report/types': {
    model: 'tipos_diario_obra',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      description: 'description',
      isActive: { field: 'isActive', transform: (val: any) => val !== false },
      type: 'type',
    },
  },

  'patrimony/fixed': {
    model: 'ativos_fixos',
    primaryKey: 'patrimonyId',
    fieldMapping: {
      patrimonyId: 'patrimonyId',
      detail: 'detail',
      observation: 'observation',
      costCenter: 'costCenter',
      situation: 'situation',
      preservation: 'preservation',
      propertyRegistration: 'propertyRegistration',
      landRegistration: 'landRegistration',
      previousOswner: 'previousOswner',
      privateArea: {
        field: 'privateArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      commonArea: {
        field: 'commonArea',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      address: 'address',
      addressNumber: 'addressNumber',
      addressComplement: 'addressComplement',
      neighborhood: 'neighborhood',
      city: 'city',
      postalCode: 'postalCode',
      incorporationForm: 'incorporationForm',
      incorporationDate: {
        field: 'incorporationDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      incorporationValue: {
        field: 'incorporationValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      accountancyIncorporationAccount: 'accountancyIncorporationAccount',
      accountancyIdentity: 'accountancyIdentity',
      accountancyOrigin: 'accountancyOrigin',
      accountancyUsageIndicator: 'accountancyUsageIndicator',
      depreciationInitialDate: {
        field: 'depreciationInitialDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      depreciationDebitAccount: 'depreciationDebitAccount',
      depreciationCreditAccount: 'depreciationCreditAccount',
      depreciationValue: 'depreciationValue',
      depreciationLastDate: {
        field: 'depreciationLastDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      depreciationActualValue: {
        field: 'depreciationActualValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
    },
  },

  'hooks': {
    model: 'webhooks',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      url: 'url',
      token: 'token',
      events: { field: 'events', transform: (val: any) => val || [] },
    },
  },

  'supply-contracts/measurements': {
    model: 'medicoes_contrato',
    primaryKey: 'measurementNumber',
    fieldMapping: {
      documentId: 'documentId',
      contractNumber: 'contractNumber',
      buildingId: 'buildingId',
      measurementNumber: 'measurementNumber',
      authorized: { field: 'authorized', transform: (val: any) => val === true },
      statusApproval: 'statusApproval',
      notes: 'notes',
      responsibleId: 'responsibleId',
      responsibleName: 'responsibleName',
      consistent: { field: 'consistent', transform: (val: any) => val === true },
      measurementDate: {
        field: 'measurementDate',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      dueDate: {
        field: 'dueDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      materialCost: {
        field: 'materialCost',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      laborCost: {
        field: 'laborCost',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      measuredTotal: {
        field: 'measuredTotal',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      indexesPriceChange: {
        field: 'indexesPriceChange',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      directBillingValue: {
        field: 'directBillingValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      subtotal: {
        field: 'subtotal',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      securityDepositValue: {
        field: 'securityDepositValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      exchangeValue: {
        field: 'exchangeValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      earnestMoneyValue: {
        field: 'earnestMoneyValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      discountsValue: {
        field: 'discountsValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      taxValue: {
        field: 'taxValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      netValue: {
        field: 'netValue',
        transform: (val: any) => (val ? parseFloat(val) : null),
      },
      contractSupplierId: 'contractSupplierId',
      contractCustomerId: 'contractCustomerId',
      released: { field: 'released', transform: (val: any) => val === true },
      finalized: { field: 'finalized', transform: (val: any) => val === true },
      buildingAppropriations: {
        field: 'buildingAppropriations',
        transform: (val: any) => val || null,
      },
    },
  },

  'supply-contracts/measurements/attachments': {
    model: 'anexos_medicao_contrato',
    primaryKey: 'attachmentNumber',
    fieldMapping: {
      documentId: 'documentId',
      buildingId: 'buildingId',
      contractNumber: 'contractNumber',
      measurementNumber: 'measurementNumber',
      attachmentNumber: 'attachmentNumber',
      name: 'name',
      description: 'description',
    },
  },

  'accounts-statements': {
    model: 'extratos_conta',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      value: {
        field: 'value',
        transform: (val: any) => (val ? parseFloat(val) : 0),
      },
      date: {
        field: 'date',
        transform: (val: any) => (val ? new Date(val) : new Date()),
      },
      documentNumber: 'documentNumber',
      description: 'description',
      documentId: 'documentId',
      type: 'type',
      reconciliationDate: {
        field: 'reconciliationDate',
        transform: (val: any) => (val ? new Date(val) : null),
      },
      billId: 'billId',
      installmentNumber: 'installmentNumber',
      statementOrigin: 'statementOrigin',
      statementType: 'statementType',
      statementTypeNotes: 'statementTypeNotes',
      budgetCategories: {
        field: 'budgetCategories',
        transform: (val: any) => val || null,
      },
      links: { field: 'links', transform: (val: any) => val || null },
    },
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
export function getEndpointMapping(
  endpoint: string
): EndpointMapping | undefined {
  return ENDPOINT_MAPPINGS[endpoint];
}
