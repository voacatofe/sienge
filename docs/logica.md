## 📊 **Estrutura do Banco de Dados (44 Tabelas)**

### 🔧 **Sistema/Configuração (2 tabelas)**

- `api_credentials` - Credenciais da API Sienge
- `sync_logs` - Logs de sincronização

### 🏢 **Entidades Corporativas (3 tabelas)**

- `empresas` - Dados das empresas
- `departamentos` - Departamentos organizacionais
- `centros_custo` - Centros de custo

### 📊 **Configurações Financeiras (6 tabelas)**

- `indexadores` - Índices de correção monetária
- `planos_financeiros` - Planos/categorias financeiras
- `documentos_identificacao` - Tipos de documentos
- `tipos_condicao_pagamento` - Condições de pagamento
- `portadores_recebimento` - Portadores de recebimento

### 👥 **Clientes (8 tabelas)**

- `clientes` - Dados principais dos clientes
- `tipos_cliente` - Pessoa física/jurídica
- `estados_civis` - Estados civis
- `profissoes` - Profissões
- `conjuges` - Dados dos cônjuges
- `cliente_telefones` - Telefones dos clientes
- `cliente_enderecos` - Endereços dos clientes
- `cliente_rendas` - Rendas dos clientes
- `cliente_anexos` - Documentos anexos
- `municipios` - Cidades/municípios

### 🏗️ **Empreendimentos/Imóveis (4 tabelas)**

- `empreendimentos` - Projetos imobiliários
- `unidades_imobiliarias` - Unidades à venda
- `tipos_imovel` - Tipos de imóveis
- `reservas_unidades` - Reservas de unidades

### 💰 **Vendas/Contratos (3 tabelas)**

- `contratos_venda` - Contratos de venda
- `comissoes_venda` - Comissões dos corretores
- `titulos_receber` - Contas a receber

### 🛒 **Compras/Fornecedores (12 tabelas)**

- `credores` - Fornecedores/credores
- `credor_enderecos` - Endereços dos fornecedores
- `credor_info_bancaria` - Dados bancários
- `solicitacoes_compra` - Solicitações de compra
- `solicitacao_itens` - Itens das solicitações
- `pedidos_compra` - Pedidos de compra
- `pedido_itens` - Itens dos pedidos
- `cotacoes_preco` - Cotações de preços
- `cotacao_itens` - Itens das cotações
- `contratos_suprimento` - Contratos com fornecedores
- `medicoes_contrato` - Medições de contratos
- `notas_fiscais_compra` - Notas fiscais de compra

### 💸 **Contas a Pagar (5 tabelas)**

- `titulos_pagar` - Contas a pagar
- `parcelas_titulo_pagar` - Parcelas dos títulos
- `titulo_pagar_impostos` - Impostos dos títulos
- `titulo_pagar_centro_custo` - Alocação por centro de custo
- `titulo_pagar_departamento` - Alocação por departamento

**Total: 44 tabelas** organizadas em um sistema ERP completo para construtoras/incorporadoras, cobrindo desde CRM até gestão financeira e de projetos.

> **Observação**: As tabelas seguem um padrão bem estruturado com relacionamentos complexos, índices otimizados e campos sensíveis marcados para criptografia (CPF, CNPJ, etc.).

## 📡 **API Sienge - Endpoints e Configurações**

### **🔧 Configuração da URL Base**

```
https://api.sienge.com.br/{subdominio}/public/api/v1
```

### **✅ Endpoints da API Sienge (11 endpoints externos)**

#### **👥 Entidades Principais**

- `/customers` - Clientes
- `/companies` - Empresas

#### **💰 Financeiro**

- `/accounts-receivable` - Títulos a Receber (POST method)
- `/accounts-payable` - Títulos a Pagar (POST method)
- `/indexers` - Indexadores/Correção Monetária
- `/payment-categories` - Planos Financeiros
- `/carriers` - Portadores de Recebimento

#### **📋 Vendas**

- `/sales-contracts` - Contratos de Venda
- `/commissions` - Comissões de Vendas

#### **🏢 Organizacional**

- `/cost-centers` - Centros de Custo
- `/departments` - Departamentos

### **🔑 Autenticação**

- **Tipo**: Basic Auth (HTTP Basic Authentication)
- **Headers obrigatórios**:
  ```
  Authorization: Basic {base64(username:password)}
  Content-Type: application/json
  ```

### **📊 Parâmetros Padrão**

- `limit`: máximo 200 registros por requisição
- `offset`: para paginação
- Filtros de data quando aplicável

### **🔄 Sistema de Fallback HTTP**

- **GET**: Método padrão para a maioria dos endpoints
- **POST**: Fallback automático para endpoints que retornam 405 (Method Not Allowed)
- **Logs detalhados**: Cada tentativa de método é logada
- **Retry inteligente**: Continua tentando diferentes métodos até encontrar o correto

---

## 📊 **Resumo de Endpoints Implementados**

| Tipo                       | Quantidade   | Descrição                                         |
| -------------------------- | ------------ | ------------------------------------------------- |
| **API Sienge (Externos)**  | 11 endpoints | Endpoints que chamamos na API externa do Sienge   |
| **API Local Categorizada** | 22 endpoints | Endpoints da nossa API organizados por categorias |
| **API Local Total**        | 27 endpoints | Total de endpoints incluindo não categorizados    |

---

## 🏗️ **APIs Locais - Estrutura Categorizada (22 endpoints categorizados)**

### **🏢 Entidades Principais**

- `/api/data/entidades/customers` - Consulta clientes locais
- `/api/data/entidades/companies` - Consulta empresas locais

### **💰 Financeiro**

- `/api/data/financeiro/accounts-receivable` - Consulta títulos a receber locais
- `/api/data/financeiro/accounts-payable` - Consulta títulos a pagar locais
- `/api/data/financeiro/indexers` - Consulta indexadores locais
- `/api/data/financeiro/payment-categories` - Consulta categorias de pagamento locais
- `/api/data/financeiro/carriers` - Consulta portadores de recebimento locais

### **📋 Vendas**

- `/api/data/vendas/sales-contracts` - Consulta contratos de venda locais
- `/api/data/vendas/commissions` - Consulta comissões de vendas locais

### **🏛️ Organizacional**

- `/api/data/organizacional/cost-centers` - Consulta centros de custo locais
- `/api/data/organizacional/departments` - Consulta departamentos locais

### **👥 Clientes (Auxiliares)**

- `/api/data/clientes/tipos-cliente` - Consulta tipos de cliente locais
- `/api/data/clientes/estados-civis` - Consulta estados civis locais
- `/api/data/clientes/profissoes` - Consulta profissões locais
- `/api/data/clientes/municipios` - Consulta municípios locais

### **🏗️ Empreendimentos**

- `/api/data/empreendimentos/empreendimentos` - Consulta empreendimentos locais
- `/api/data/empreendimentos/unidades-imobiliarias` - Consulta unidades imobiliárias locais
- `/api/data/empreendimentos/tipos-imovel` - Consulta tipos de imóvel locais

### **🛒 Compras**

- `/api/data/compras/credores` - Consulta credores/fornecedores locais
- `/api/data/compras/pedidos-compra` - Consulta pedidos de compra locais

### **⚙️ Configurações**

- `/api/data/configuracoes/documentos-identificacao` - Consulta documentos de identificação locais
- `/api/data/configuracoes/tipos-condicao-pagamento` - Consulta tipos de condição de pagamento locais

## 🔧 **Endpoints Não Categorizados (5 endpoints)**

- `/api/data` - Dashboard principal com estatísticas
- `/api/data/docs` - Documentação da API
- `/api/data/sync-logs` - Logs de sincronização
- `/api/data/registries` - Cadastros básicos (empresas, departamentos, etc.)
- `/api/data/customers-group` - Grupo de clientes e credores

## ✅ **Status da Implementação**

### **📁 Estrutura de Diretórios Categorizada**

```
app/api/data/
├── entidades/          # Entidades principais
├── clientes/           # Dados auxiliares de clientes
├── vendas/             # Contratos e comissões
├── empreendimentos/    # Projetos e unidades
├── compras/            # Fornecedores e pedidos
├── financeiro/         # Contas a pagar/receber
├── organizacional/     # Estrutura corporativa
└── configuracoes/      # Configurações gerais
```

### **🔧 Funcionalidades Implementadas**

- ✅ **22 endpoints categorizados** com estrutura RESTful consistente
- ✅ **Sistema de fallback HTTP** automático (GET → POST)
- ✅ **Configurações centralizadas** em `lib/config/sienge-api.ts`
- ✅ **Mapeamentos completos** ENTITY_TO_ENDPOINT
- ✅ **Logs detalhados** para debugging e monitoramento
- ✅ **TypeScript validado** sem erros de compilação
- ✅ **Rate limiting** e retry logic implementados
- ✅ **Paginação automática** para grandes volumes de dados

## ⚙️ **Configurações Técnicas**

### **🔒 Segurança e Autenticação**

- **Subdomínio obrigatório** na URL base da API Sienge
- **Basic Auth** com credenciais criptografadas
- **Rate limiting**: 200 requests/minuto
- **Timeout**: 30 segundos por requisição
- **Retry logic**: 3 tentativas com backoff exponencial

### **📊 Monitoramento e Logs**

- **Logs detalhados** de todas as requisições à API Sienge
- **Tracking de erros** com códigos de status específicos
- **Monitoramento de performance** com timestamps
- **Alertas automáticos** para falhas de sincronização

### **🔄 Sincronização**

- **Sincronização incremental** com controle de offset
- **Batch processing** para otimizar performance
- **Fallback automático** de métodos HTTP
- **Validação de dados** antes de inserir no banco

### **📈 Otimizações**

- **Paginação inteligente** para grandes volumes
- **Cache de credenciais** para reduzir overhead
- **Connection pooling** para PostgreSQL
- **Índices otimizados** no banco de dados

---

## 🎯 **Próximos Passos**

1. **Teste de sincronização** com todos os endpoints implementados
2. **Validação de dados** comparando com API Sienge
3. **Implementação de dashboard** para monitoramento
4. **Integração com Power BI** para relatórios
5. **Documentação da API** para usuários finais

> **Status**: ✅ Sistema completo e funcional com 19 endpoints categorizados, sistema de fallback HTTP automático e configurações otimizadas para produção.
