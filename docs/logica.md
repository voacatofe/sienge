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

#### **✅ APIs Locais Implementadas e Categorizadas:**

**🏢 Entidades Principais:**

- `/api/data/entidades/customers` - Consulta clientes locais
- `/api/data/entidades/companies` - Consulta empresas locais

**💰 Vendas:**

- `/api/data/vendas/sales-contracts` - Consulta contratos de venda locais
- `/api/data/vendas/commissions` - Consulta comissões de vendas locais

**💸 Financeiro:**

- `/api/data/financeiro/accounts-receivable` - Consulta títulos a receber locais
- `/api/data/financeiro/accounts-payable` - Consulta títulos a pagar locais
- `/api/data/financeiro/indexers` - Consulta indexadores locais
- `/api/data/financeiro/payment-categories` - Consulta categorias de pagamento locais
- `/api/data/financeiro/carriers` - Consulta portadores de recebimento locais

**🏛️ Organizacional:**

- `/api/data/organizacional/cost-centers` - Consulta centros de custo locais
- `/api/data/organizacional/departments` - Consulta departamentos locais

**👥 Clientes (Auxiliares):**

- `/api/data/clientes/tipos-cliente` - Consulta tipos de cliente locais
- `/api/data/clientes/estados-civis` - Consulta estados civis locais
- `/api/data/clientes/profissoes` - Consulta profissões locais
- `/api/data/clientes/municipios` - Consulta municípios locais

**🏗️ Empreendimentos:**

- `/api/data/empreendimentos/empreendimentos` - Consulta empreendimentos locais
- `/api/data/empreendimentos/unidades-imobiliarias` - Consulta unidades imobiliárias locais
- `/api/data/empreendimentos/tipos-imovel` - Consulta tipos de imóvel locais

**🛒 Compras:**

- `/api/data/compras/credores` - Consulta credores/fornecedores locais
- `/api/data/compras/pedidos-compra` - Consulta pedidos de compra locais

**⚙️ Configurações:**

- `/api/data/configuracoes/documentos-identificacao` - Consulta documentos de identificação locais
- `/api/data/configuracoes/tipos-condicao-pagamento` - Consulta tipos de condição de pagamento locais

#### **📋 Estrutura Categorizada Implementada:**

- ✅ **Diretórios categorizados** criados: `entidades/`, `clientes/`, `vendas/`, `empreendimentos/`, `compras/`, `financeiro/`, `organizacional/`, `configuracoes/`
- ✅ **Endpoints migrados** para nova estrutura categorizada
- ✅ **Novos endpoints implementados** para todas as entidades faltantes
- ✅ **Configurações atualizadas** em `lib/config/sienge-api.ts` com mapeamentos de endpoints locais
- ✅ **Meta endpoints** atualizados com categorias em todos os arquivos
- ✅ **Estrutura RESTful** consistente implementada
- ✅ **Sistema completo** com 19 endpoints categorizados implementados

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
