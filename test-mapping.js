// Teste do mapeamento corrigido
const ENDPOINT_MAPPINGS = {
  units: {
    model: 'unidade',
    primaryKey: 'id',
    fieldMapping: {
      id: 'id',
      enterpriseId: {
        field: 'idEmpreendimento',
        transform: val => (val && val !== undefined ? val : null),
      },
      contractId: {
        field: 'idContrato',
        transform: val => (val && val !== undefined ? val : null),
      },
      indexerId: {
        field: 'idIndexador',
        transform: val => (val === 0 ? 1 : val || 1), // Correção aplicada
      },
      name: 'nome',
      propertyType: 'tipoImovel',
      deliveryDate: {
        field: 'dataEntrega',
        transform: val => (val ? new Date(val) : null),
      },
      scheduledDeliveryDate: {
        field: 'dataEntrega',
        transform: val => (val ? new Date(val) : null),
      },
      privateArea: {
        field: 'areaPrivativa',
        transform: val => (val ? parseFloat(val) : null),
      },
    },
  },
};

// Dados de teste da API
const testApiData = {
  id: 6929,
  enterpriseId: 510,
  contractId: null,
  indexerId: 0, // Este era o problema!
  name: 'DA SALA COMRCIAL 305',
  propertyType: 'Dação',
  deliveryDate: null,
  scheduledDeliveryDate: '2025-10-02',
  privateArea: 25.86,
};

// Aplicar mapeamento
const mapping = ENDPOINT_MAPPINGS.units;
const mappedData = {};

for (const [apiField, dbField] of Object.entries(mapping.fieldMapping)) {
  if (testApiData[apiField] !== undefined) {
    if (typeof dbField === 'string') {
      mappedData[dbField] = testApiData[apiField];
    } else if (
      typeof dbField === 'object' &&
      dbField !== null &&
      'field' in dbField
    ) {
      const fieldMapping = dbField;
      mappedData[fieldMapping.field] = fieldMapping.transform
        ? fieldMapping.transform(testApiData[apiField])
        : testApiData[apiField];
    }
  }
}

console.log('Dados da API:', JSON.stringify(testApiData, null, 2));
console.log(
  '\nDados mapeados para o banco:',
  JSON.stringify(mappedData, null, 2)
);
console.log(
  '\nProblema resolvido? indexerId:',
  testApiData.indexerId,
  '→ idIndexador:',
  mappedData.idIndexador
);
