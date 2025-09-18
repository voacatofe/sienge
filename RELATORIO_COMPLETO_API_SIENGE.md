# Relatório Completo de Testes - API Sienge

## Informações do Teste

- **Data/Hora**: 2025-09-18
- **Subdomain**: `abf`
- **Username**: `abf-gfragoso`
- **Total de Endpoints Testados**: 42
- **Taxa de Sucesso**: 45.2%

## Resumo Executivo

### Estatísticas Gerais

| Métrica                            | Valor |
| ---------------------------------- | ----- |
| Total de endpoints testados        | 42    |
| ✅ Endpoints funcionais (200)      | 19    |
| ❌ Endpoints não encontrados (404) | 5     |
| 🔒 Sem permissão (403)             | 17    |
| ⚠️ Outros erros (405)              | 1     |
| 📊 Total de registros retornados   | 70    |

## Endpoints Funcionais (19/42)

### ✅ Módulo Comercial

| Endpoint                 | Registros | URL                         |
| ------------------------ | --------- | --------------------------- |
| `/customers`             | 5         | Clientes                    |
| `/companies`             | 5         | Empresas                    |
| `/enterprises`           | 5         | Empreendimentos             |
| `/units`                 | 5         | Unidades                    |
| `/units/characteristics` | 0         | Características de Unidades |
| `/units/situations`      | 5         | Situações de Unidades       |
| `/sales-contracts`       | 5         | Contratos de Venda          |

### ✅ Módulo Financeiro

| Endpoint               | Registros | Descrição         |
| ---------------------- | --------- | ----------------- |
| `/bills`               | 5         | Títulos a Pagar   |
| `/accounts-statements` | 5         | Extrato de Contas |
| `/creditors`           | 5         | Credores          |
| `/bearers`             | 5         | Portadores        |

### ✅ Módulo Bulk Data

| Endpoint                                 | Registros | Descrição                       |
| ---------------------------------------- | --------- | ------------------------------- |
| `/bulk-data/v1/income`                   | 0         | Receitas (sem dados no período) |
| `/bulk-data/v1/bank-movement`            | 0         | Movimentos Bancários            |
| `/bulk-data/v1/customer-extract-history` | 0         | Histórico de Extrato            |
| `/bulk-data/v1/sales`                    | 0         | Vendas                          |

### ✅ Módulo Contratos

| Endpoint                                         | Registros | Descrição               |
| ------------------------------------------------ | --------- | ----------------------- |
| `/supply-contracts/all`                          | 5         | Contratos de Suprimento |
| `/supply-contracts/measurements/all`             | 5         | Medições de Contratos   |
| `/supply-contracts/measurements/attachments/all` | 5         | Anexos de Medições      |

### ✅ Outros Módulos

| Endpoint | Registros | Descrição             |
| -------- | --------- | --------------------- |
| `/hooks` | 5         | Webhooks configurados |

## Endpoints com Erro de Permissão (17/42)

### 🔒 Módulo Contábil

- `/accountancy/accounts` - Contas Contábeis
- `/accountancy/entries` - Lançamentos Contábeis
- `/closingaccountancy` - Fechamento Contábil
- `/accounts-balances` - Saldos de Contas

### 🔒 Módulo Patrimônio

- `/patrimony/fixed` - Bens Imóveis
- `/patrimony/movable` - Bens Móveis

### 🔒 Módulo Construção

- `/construction-daily-report` - Diário de Obra
- `/construction-daily-report/types` - Tipos de Diário
- `/construction-daily-report/event-type` - Tipos de Ocorrência
- `/building-projects/progress-logs` - Registro de Medições

### 🔒 Módulo Financeiro Avançado

- `/commissions` - Comissões
- `/checking-accounts` - Contas Correntes
- `/cost-centers` - Centros de Custo
- `/indexers` - Indexadores

### 🔒 Outros Módulos Restritos

- `/property-rental` - Locação de Imóveis
- `/customer-types` - Tipos de Cliente
- `/sites` - Sites

## Endpoints Não Encontrados (5/42)

| Endpoint               | Observação                 |
| ---------------------- | -------------------------- |
| `/income` (API V1)     | Use `/bulk-data/v1/income` |
| `/accounts-receivable` | Pode ter nome diferente    |
| `/projects`            | Endpoint não existe        |
| `/condominiums`        | Endpoint não existe        |
| `/documents`           | Endpoint não existe        |

## Outros Erros (1/42)

| Endpoint                   | Status | Erro                     |
| -------------------------- | ------ | ------------------------ |
| `/eletronic-invoice-bills` | 405    | Método GET não permitido |

## Análise e Recomendações

### 1. APIs Funcionais

- **19 endpoints estão totalmente funcionais** e prontos para uso
- Os módulos **Comercial**, **Financeiro básico** e **Contratos** estão acessíveis
- APIs de **Bulk Data** funcionam mas retornaram 0 registros (pode ser devido ao período ou falta de dados)

### 2. Problemas de Permissão

- **17 endpoints (40%)** retornam erro 403 (Forbidden)
- Módulos **Contábil**, **Patrimônio** e **Construção** estão bloqueados
- Recomenda-se solicitar permissões adicionais ao administrador do Sienge

### 3. URLs Corretas

- **URL Base V1**: `https://api.sienge.com.br/abf/public/api/v1`
- **URL Bulk Data**: `https://api.sienge.com.br/abf/public/api/bulk-data/v1`
- Autenticação: **HTTP Basic Auth**

### 4. Parâmetros Obrigatórios Confirmados

- `/bills`: `startDate`, `endDate`
- `/accounts-statements`: `startDate`, `endDate`
- `/income` (bulk): `startDate`, `endDate`, `selectionType`
- `/sales` (bulk): `enterpriseId`, `createdAfter`, `createdBefore`, `situation`

### 5. Próximos Passos

1. ✅ Use os 19 endpoints funcionais para sincronização de dados
2. 📧 Solicite permissões para os 17 endpoints bloqueados
3. 🔄 Verifique se os endpoints de bulk data têm dados no período consultado
4. 📝 Documente os parâmetros corretos no código de produção

## Conclusão

O teste foi **bem-sucedido** em identificar:

- ✅ **19 endpoints funcionais** prontos para uso
- 🔒 **17 endpoints** que precisam de permissões adicionais
- ❌ **5 endpoints** que não existem ou têm nomes diferentes
- ⚠️ **1 endpoint** que não aceita GET (precisa usar POST)

As credenciais fornecidas **funcionam corretamente**, mas têm **acesso limitado** a apenas 45% dos endpoints testados.
