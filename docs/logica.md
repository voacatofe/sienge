    🔧 Sistema/Configuração (2 tabelas)

    - api_credentials - Credenciais da API Sienge
    - sync_logs - Logs de sincronização

    🏢 Entidades Corporativas (3 tabelas)

    - empresas - Dados das empresas
    - departamentos - Departamentos organizacionais
    - centros_custo - Centros de custo

    📊 Configurações Financeiras (6 tabelas)

    - indexadores - Índices de correção monetária
    - planos_financeiros - Planos/categorias financeiras
    - documentos_identificacao - Tipos de documentos
    - tipos_condicao_pagamento - Condições de pagamento
    - portadores_recebimento - Portadores de recebimento

    👥 Clientes (8 tabelas)

    - clientes - Dados principais dos clientes
    - tipos_cliente - Pessoa física/jurídica
    - estados_civis - Estados civis
    - profissoes - Profissões
    - conjuges - Dados dos cônjuges
    - cliente_telefones - Telefones dos clientes
    - cliente_enderecos - Endereços dos clientes
    - cliente_rendas - Rendas dos clientes
    - cliente_anexos - Documentos anexos
    - municipios - Cidades/municípios

    🏗️ Empreendimentos/Imóveis (4 tabelas)

    - empreendimentos - Projetos imobiliários
    - unidades_imobiliarias - Unidades à venda
    - tipos_imovel - Tipos de imóveis
    - reservas_unidades - Reservas de unidades

    💰 Vendas/Contratos (3 tabelas)

    - contratos_venda - Contratos de venda
    - comissoes_venda - Comissões dos corretores
    - titulos_receber - Contas a receber

    🛒 Compras/Fornecedores (12 tabelas)

    - credores - Fornecedores/credores
    - credor_enderecos - Endereços dos fornecedores
    - credor_info_bancaria - Dados bancários
    - solicitacoes_compra - Solicitações de compra
    - solicitacao_itens - Itens das solicitações
    - pedidos_compra - Pedidos de compra
    - pedido_itens - Itens dos pedidos
    - cotacoes_preco - Cotações de preços
    - cotacao_itens - Itens das cotações
    - contratos_suprimento - Contratos com fornecedores
    - medicoes_contrato - Medições de contratos
    - notas_fiscais_compra - Notas fiscais de compra

    💸 Contas a Pagar (5 tabelas)

    - titulos_pagar - Contas a pagar
    - parcelas_titulo_pagar - Parcelas dos títulos
    - titulo_pagar_impostos - Impostos dos títulos
    - titulo_pagar_centro_custo - Alocação por centro de custo
    - titulo_pagar_departamento - Alocação por departamento

    Total: 44 tabelas organizadas em um sistema ERP completo para
    construtoras/incorporadoras, cobrindo desde CRM até gestão financeira
    e de projetos.

    Observação: As tabelas seguem um padrão bem estruturado com
    relacionamentos complexos, índices otimizados e campos sensíveis
    marcados para criptografia (CPF, CNPJ, etc.).

## 📡 **Endpoints da API Sienge (Corrigidos e Implementados)**

### **🔧 Configuração da URL Base**

```
https://api.sienge.com.br/{subdominio}/public/api/v1
```

### **✅ Endpoints Funcionais (Confirmados)**

#### **👥 Clientes e Empresas**

- `/customers` - Clientes ✅ **IMPLEMENTADO**
- `/companies` - Empresas ✅ **IMPLEMENTADO**

#### **💰 Entidades Financeiras**

- `/accounts-receivable` - Títulos a Receber (Contas a Receber) ✅ **IMPLEMENTADO**
- `/accounts-payable` - Títulos a Pagar (Contas a Pagar) ✅ **IMPLEMENTADO**
- `/indexers` - Indexadores/Correção Monetária ✅ **IMPLEMENTADO**
- `/payment-categories` - Planos Financeiros ✅ **IMPLEMENTADO**
- `/carriers` - Portadores de Recebimento ✅ **IMPLEMENTADO**

#### **📋 Contratos e Vendas**

- `/sales-contracts` - Contratos de Venda ✅ **IMPLEMENTADO**
- `/commissions` - Comissões de Vendas ✅ **IMPLEMENTADO**

#### **🏢 Estrutura Organizacional**

- `/cost-centers` - Centros de Custo ✅ **IMPLEMENTADO**
- `/departments` - Departamentos ✅ **IMPLEMENTADO**

### **❌ Endpoints Removidos (Causavam Erro 405)**

#### **Endpoints Incorretos Removidos:**

- `/indexes` ❌ → `/indexers` ✅
- `/receivables` ❌ → `/accounts-receivable` ✅
- `/payables` ❌ → `/accounts-payable` ✅
- `/bills-receivable` ❌ (não existe)
- `/bills-payable` ❌ (não existe)
- `/sales-commissions` ❌ → `/commissions` ✅
- `/financial-plans` ❌ → `/payment-categories` ✅
- `/receivable-carriers` ❌ → `/carriers` ✅

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

### **🔧 Status das Implementações**

#### **✅ APIs Locais Implementadas e Corrigidas:**

- `/api/data/customers` - Consulta clientes locais
- `/api/data/companies` - Consulta empresas locais
- `/api/data/accounts-receivable` - Consulta títulos a receber locais
- `/api/data/accounts-payable` - Consulta títulos a pagar locais
- `/api/data/sales-contracts` - Consulta contratos de venda locais
- `/api/data/financial?type=accounts-receivable` - Endpoint unificado
- `/api/data/financial?type=accounts-payable` - Endpoint unificado
- `/api/data/financial?type=commissions` - Endpoint unificado
- `/api/data/financial?type=payment-categories` - Endpoint unificado
- `/api/data/financial?type=indexers` - Endpoint unificado
- `/api/data/financial?type=carriers` - Endpoint unificado

#### **📋 Arquivos Corrigidos:**

- ✅ `lib/config/sienge-api.ts` - Configurações centralizadas atualizadas
- ✅ `app/api/data/receivables/route.ts` - Meta endpoint corrigido
- ✅ `app/api/data/payables/route.ts` - Meta endpoint corrigido
- ✅ `app/api/data/financial/route.ts` - Case statements e meta fields corrigidos

#### **🔧 Configurações Atualizadas:**

- ✅ Todos os endpoints Sienge mapeados corretamente
- ✅ Configurações de sincronização centralizadas
- ✅ Mapeamentos ENTITY_TO_ENDPOINT atualizados
- ✅ Meta endpoints corrigidos em todas as APIs

### **⚠️ Observações Importantes**

1. **Subdomínio obrigatório** na URL base
2. **Apenas endpoints confirmados** pela documentação oficial
3. **Rate limiting**: 200 requests/minuto
4. **Timeout**: 30 segundos por requisição
5. **Retry logic**: 3 tentativas com backoff exponencial
6. **✅ Todas as correções implementadas** conforme documentação oficial Sienge
