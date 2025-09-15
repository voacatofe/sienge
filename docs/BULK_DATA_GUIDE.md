# 🚀 Guia de Sincronização em Massa - API Sienge Bulk Data

## 📋 Visão Geral

Esta API foi **otimizada exclusivamente para sincronização em massa** (bulk data) com a API oficial do Sienge. Removemos todos os endpoints que requerem IDs específicos de itens, mantendo apenas aqueles que permitem buscar grandes volumes de dados para popular bancos de dados.

---

## 🎯 Endpoints Disponíveis

### 📊 **Dados Mestres (Bulk Data)**

| Endpoint                 | Descrição                         | Parâmetros            | Exemplo                                                        |
| ------------------------ | --------------------------------- | --------------------- | -------------------------------------------------------------- |
| `/customers`             | Lista completa de clientes        | `limit`, `onlyActive` | `/api/sienge/proxy?endpoint=/customers&limit=1000`             |
| `/companies`             | Lista completa de empresas        | `limit`               | `/api/sienge/proxy?endpoint=/companies&limit=1000`             |
| `/enterprises`           | Lista completa de empreendimentos | `limit`               | `/api/sienge/proxy?endpoint=/enterprises&limit=1000`           |
| `/units`                 | Lista completa de unidades        | `limit`               | `/api/sienge/proxy?endpoint=/units&limit=1000`                 |
| `/units/characteristics` | Características de unidades       | `limit`               | `/api/sienge/proxy?endpoint=/units/characteristics&limit=1000` |
| `/units/situations`      | Situações de unidades             | `limit`               | `/api/sienge/proxy?endpoint=/units/situations&limit=1000`      |
| `/sales-contracts`       | Contratos de venda                | `limit`               | `/api/sienge/proxy?endpoint=/sales-contracts&limit=1000`       |
| `/patrimony/fixed`       | Bens patrimoniais                 | `limit`               | `/api/sienge/proxy?endpoint=/patrimony/fixed&limit=1000`       |
| `/hooks`                 | Webhooks configurados             | `limit`               | `/api/sienge/proxy?endpoint=/hooks&limit=1000`                 |

### 📅 **Dados por Período (Bulk Data)**

| Endpoint                    | Descrição              | Parâmetros Obrigatórios                 | Exemplo                                                                                              |
| --------------------------- | ---------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `/income`                   | Receitas por período   | `startDate`, `endDate`, `selectionType` | `/api/sienge/proxy?endpoint=/income&startDate=2024-01-01&endDate=2024-12-31&selectionType=D`         |
| `/bank-movement`            | Movimentos financeiros | `startDate`, `endDate`                  | `/api/sienge/proxy?endpoint=/bank-movement&startDate=2024-01-01&endDate=2024-12-31`                  |
| `/customer-extract-history` | Extrato de clientes    | `startDueDate`, `endDueDate`            | `/api/sienge/proxy?endpoint=/customer-extract-history&startDueDate=2024-01-01&endDueDate=2024-12-31` |
| `/accounts-statements`      | Extrato de contas      | `startDate`, `endDate`                  | `/api/sienge/proxy?endpoint=/accounts-statements&startDate=2024-01-01&endDate=2024-12-31`            |

### 🏗️ **Dados de Obra (Bulk Data)**

| Endpoint                                | Descrição               | Parâmetros | Exemplo                                                                       |
| --------------------------------------- | ----------------------- | ---------- | ----------------------------------------------------------------------------- |
| `/construction-daily-report/event-type` | Tipos de ocorrência     | `limit`    | `/api/sienge/proxy?endpoint=/construction-daily-report/event-type&limit=1000` |
| `/construction-daily-report/types`      | Tipos de diário de obra | `limit`    | `/api/sienge/proxy?endpoint=/construction-daily-report/types&limit=1000`      |

### 💰 **Dados de Vendas (Bulk Data)**

| Endpoint | Descrição                 | Parâmetros Obrigatórios                                      | Exemplo                                                                                                              |
| -------- | ------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `/sales` | Vendas por empreendimento | `enterpriseId`, `createdAfter`, `createdBefore`, `situation` | `/api/sienge/proxy?endpoint=/sales&enterpriseId=123&createdAfter=2024-01-01&createdBefore=2024-12-31&situation=SOLD` |

### 📐 **Medições e Anexos (Bulk Data)**

| Endpoint                                         | Descrição          | Parâmetros                                   | Exemplo                                                                                                                                   |
| ------------------------------------------------ | ------------------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `/supply-contracts/measurements/all`             | Todas as medições  | `limit`                                      | `/api/sienge/proxy?endpoint=/supply-contracts/measurements/all&limit=1000`                                                                |
| `/supply-contracts/measurements/attachments/all` | Anexos por período | `measurementStartDate`, `measurementEndDate` | `/api/sienge/proxy?endpoint=/supply-contracts/measurements/attachments/all&measurementStartDate=2024-01-01&measurementEndDate=2024-12-31` |

---

## 🔧 Parâmetros Comuns

### 📝 **Parâmetros de Paginação**

- `limit`: Quantidade máxima de resultados (padrão: 100, máximo recomendado: 1000)
- `offset`: Deslocamento para paginação (padrão: 0)

### 📅 **Parâmetros de Data**

- `startDate`: Data inicial (formato: YYYY-MM-DD)
- `endDate`: Data final (formato: YYYY-MM-DD)
- `createdAfter`: Data de criação inicial (formato: YYYY-MM-DD)
- `createdBefore`: Data de criação final (formato: YYYY-MM-DD)
- `measurementStartDate`: Data inicial de medição (formato: YYYY-MM-DD)
- `measurementEndDate`: Data final de medição (formato: YYYY-MM-DD)
- `startDueDate`: Data de vencimento inicial (formato: YYYY-MM-DD)
- `endDueDate`: Data de vencimento final (formato: YYYY-MM-DD)

### 🏢 **Parâmetros de Negócio**

- `enterpriseId`: ID do empreendimento
- `situation`: Situação da venda (ex: SOLD, RESERVED)
- `selectionType`: Tipo de seleção para receitas (ex: D para diário)
- `onlyActive`: Apenas registros ativos (true/false)

---

## 🚀 Exemplos de Uso

### 1. **Sincronização Completa de Clientes**

```bash
# Buscar todos os clientes ativos
curl "http://localhost:3000/api/sienge/proxy?endpoint=/customers&limit=1000&onlyActive=true"
```

### 2. **Sincronização de Dados Financeiros do Mês**

```bash
# Receitas do mês de janeiro
curl "http://localhost:3000/api/sienge/proxy?endpoint=/income&startDate=2024-01-01&endDate=2024-01-31&selectionType=D"

# Movimentos bancários do mês
curl "http://localhost:3000/api/sienge/proxy?endpoint=/bank-movement&startDate=2024-01-01&endDate=2024-01-31"
```

### 3. **Sincronização de Empreendimentos e Unidades**

```bash
# Todos os empreendimentos
curl "http://localhost:3000/api/sienge/proxy?endpoint=/enterprises&limit=1000"

# Todas as unidades
curl "http://localhost:3000/api/sienge/proxy?endpoint=/units&limit=1000"
```

### 4. **Sincronização de Vendas por Período**

```bash
# Vendas do último trimestre
curl "http://localhost:3000/api/sienge/proxy?endpoint=/sales&enterpriseId=123&createdAfter=2024-01-01&createdBefore=2024-03-31&situation=SOLD"
```

---

## 📊 Estratégias de Sincronização

### 🔄 **Sincronização Inicial (Full Sync)**

1. **Dados Mestres**: Buscar todos os registros com `limit=1000`
2. **Dados Históricos**: Buscar por períodos (ex: últimos 2 anos)
3. **Dados de Referência**: Buscar tabelas auxiliares

### 🔄 **Sincronização Incremental**

1. **Por Data**: Usar `createdAfter` com última data sincronizada
2. **Por Período**: Dividir em períodos menores (ex: mensal)
3. **Por Status**: Filtrar por status específicos

### 🔄 **Sincronização por Lotes**

1. **Paginação**: Usar `offset` para processar em lotes
2. **Paralelização**: Processar múltiplos endpoints simultaneamente
3. **Controle de Rate**: Respeitar limites da API Sienge

---

## 🛠️ Endpoints de Suporte

### 📖 **Documentação**

- **Lista de Endpoints**: `GET /api/sienge` - Lista todos os endpoints disponíveis
- **Documentação OpenAPI**: `GET /api/sienge/openapi` - Especificação OpenAPI/Swagger
- **Teste de Conectividade**: `GET /api/sienge/test` - Testa conectividade com a API

### 🔍 **Monitoramento**

- **Health Check**: `GET /api/health` - Status da aplicação
- **Métricas**: `GET /api/metrics` - Métricas de performance

---

## ⚠️ Considerações Importantes

### 🚫 **Endpoints Removidos**

Os seguintes endpoints foram **removidos** por requererem IDs específicos:

- `/sites` (requer `buildingId`)
- `/accounts-receivable/receivable-bills` (requer `customerId`)
- `/construction-daily-report` (requer `buildingId`)
- `/building-projects/progress-logs` (requer `buildingId`)
- `/building-cost-estimation-items` (requer `buildingId`)
- `/income/by-bills` (requer `billsIds`)
- `/bank-movement/by-movements` (requer `movementsIds`)
- Endpoints de medições específicas (requerem IDs de contrato/medição)

### ✅ **Benefícios da Abordagem Bulk Data**

- **Performance**: Otimizada para grandes volumes
- **Simplicidade**: Não requer conhecimento de IDs específicos
- **Eficiência**: Menos chamadas à API
- **Confiabilidade**: Menos pontos de falha
- **Manutenibilidade**: Código mais simples

---

## 🔧 Configuração e Uso

### 1. **Iniciar a Aplicação**

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

### 2. **Configurar Credenciais**

As credenciais da API Sienge devem estar configuradas no arquivo de ambiente.

### 3. **Testar Conectividade**

```bash
curl "http://localhost:3000/api/sienge/test?endpoint=/customers&limit=1"
```

### 4. **Iniciar Sincronização**

Use os endpoints listados acima para sincronizar os dados necessários para seu banco de dados.

---

## 📈 Próximos Passos

1. **Implementar Scheduler**: Criar jobs automáticos para sincronização periódica
2. **Adicionar Cache**: Implementar cache para dados que mudam pouco
3. **Monitoramento**: Adicionar alertas para falhas de sincronização
4. **Otimização**: Implementar sincronização paralela para melhor performance
