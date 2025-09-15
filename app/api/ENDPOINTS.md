# Documentação dos Endpoints da API

## Estrutura de Endpoints

O projeto possui endpoints para sincronização de dados com a API do Sienge:

### Endpoints de Sincronização (Bulk Data)

Localizados em `/app/api/sienge/*` - Fazem chamadas diretas para a API do Sienge para sincronização em massa

---

## Endpoints de Sincronização (`/api/sienge/*`)

### Clientes

- **GET** `/api/sienge/customers`
  - Parâmetros: cpf, cnpj, internationalId, onlyActive, enterpriseId, createdAfter, createdBefore, modifiedAfter, modifiedBefore, limit, offset

### Empresas

- **GET** `/api/sienge/companies`
  - Parâmetros: limit, offset

### Empreendimentos

- **GET** `/api/sienge/enterprises`
  - Parâmetros: companyId, type, limit, offset, receivableRegister, onlyBuildingsEnabledForIntegration

### Locais de Obra

- **GET** `/api/sienge/sites`
  - Parâmetros: buildingId (obrigatório), limit, offset

### Unidades

- **GET** `/api/sienge/units`
  - Parâmetros: limit, offset, enterpriseId, commercialStock, name, additionalData

- **GET** `/api/sienge/units/characteristics`
  - Parâmetros: limit, offset

- **GET** `/api/sienge/units/situations`
  - Parâmetros: limit, offset

### Contratos de Venda

- **GET** `/api/sienge/sales-contracts`
  - Parâmetros: limit, offset, customerId, companyId, enterpriseId, enterpriseName, externalId, unitId, number, situation, createdAfter, createdBefore, modifiedAfter, modifiedBefore, onlyContractsWithoutCommission, initialIssueDate, finalIssueDate, initialCancelDate, finalCancelDate

### Contas a Receber

- **GET** `/api/sienge/accounts-receivable/receivable-bills`
  - Parâmetros: customerId (obrigatório), companyId, costCenterId, paidOff, limit, offset

### Extrato de Contas

- **GET** `/api/sienge/accounts-statements`
  - Parâmetros: startDate (obrigatório), endDate (obrigatório), accountNumber, companyId, companyGroupId, limit, offset

### Diário de Obra

- **GET** `/api/sienge/construction-daily-report`
  - Parâmetros: buildingId, startDate, endDate, offset, limit

- **GET** `/api/sienge/construction-daily-report/event-type`
  - Parâmetros: offset, limit, sort, order, id, description, isActive

- **GET** `/api/sienge/construction-daily-report/types`
  - Parâmetros: types, offset, limit, sort, order, id, description, isActive

### Receitas

- **GET** `/api/sienge/income`
  - Parâmetros: startDate (obrigatório), endDate (obrigatório), selectionType (obrigatório), correctionIndexerId, correctionDate, companyId, costCentersId, changeStartDate, completedBills, originsIds, bearersIdIn, bearersIdNotIn

### Vendas

- **GET** `/api/sienge/sales`
  - Parâmetros: enterpriseId (obrigatório), createdAfter (obrigatório), createdBefore (obrigatório), situation (obrigatório), valueGroupingDescription

### Webhooks

- **GET** `/api/sienge/hooks`
  - Parâmetros: limit, offset

---

## Endpoints de Sistema

### Configuração

- **GET** `/api/config` - Configurações do sistema
- **GET/POST** `/api/config/credentials` - Credenciais da API

### Sincronização

- **GET/POST** `/api/sync` - Sincronização de dados
- **GET** `/api/sync/status` - Status da sincronização

### Saúde e Métricas

- **GET** `/api/health` - Health check
- **GET** `/api/metrics` - Métricas do sistema

### Teste

- **GET** `/api/test-sienge` - Teste de conexão com API Sienge

---

## Observações

1. **Autenticação**: Todos os endpoints do Sienge requerem credenciais válidas configuradas no sistema
2. **Rate Limiting**: A API do Sienge tem limite de 200 requisições por minuto
3. **Paginação**: Use os parâmetros `limit` e `offset` para paginar resultados
4. **Formato de Data**: Use o formato `YYYY-MM-DD` para parâmetros de data
5. **Arrays**: Parâmetros que aceitam múltiplos valores devem ser separados por vírgula

## Exemplos de Uso

### Buscar clientes ativos

```
GET /api/sienge/customers?onlyActive=true&limit=50
```

### Buscar contratos de venda de um período

```
GET /api/sienge/sales-contracts?createdAfter=2024-01-01&createdBefore=2024-12-31
```

### Buscar unidades de um empreendimento

```
GET /api/sienge/units?enterpriseId=123&commercialStock=D
```
