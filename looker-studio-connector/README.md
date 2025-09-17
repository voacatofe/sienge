# 🔗 Sienge Data Warehouse Community Connector

Community Connector para conectar a API Sienge Data Warehouse diretamente ao Looker Studio.

## 📁 **Arquivos Incluídos:**

- **`Code.gs`** - Código principal do Community Connector para Google Apps Script
- **`DEPLOY_INSTRUCTIONS.md`** - Instruções detalhadas de deploy
- **`README.md`** - Este arquivo

## 🚀 **Início Rápido**

### **1. Deploy no Google Apps Script:**

1. Acesse: https://script.google.com/
2. Novo projeto → Cole o conteúdo de `Code.gs`
3. Configure manifesto JSON
4. Deploy como "Aplicativo da web"
5. Copie o Deployment ID

### **2. Gerar Link Direto:**

```
https://lookerstudio.google.com/datasources/create?connectorId=SEU_DEPLOYMENT_ID
```

### **3. Uso:**

- Usuários clicam no link → Looker Studio abre automaticamente
- Clicam "Conectar" → dados carregam automaticamente
- Pronto para criar relatórios!

## ⚙️ **Configuração da API**

O conector está configurado para acessar:

```
https://conector.catometrics.com.br/api/datawarehouse/master?domain=contratos
```

Para alterar a URL da API, modifique a linha 245 em `Code.gs`:

```javascript
var API_URL = 'https://seu-dominio/api/datawarehouse/master?domain=contratos';
```

## 📊 **Campos Mapeados**

O conector mapeia automaticamente todos os campos da API para o formato esperado pelo Looker Studio:

### **Dimensões Temporais:**

- data_principal, ano, trimestre, mes, ano_mes, nome_mes

### **Dimensões Geográficas:**

- empresa_regiao, empresa_estado, empresa_cidade, empresa_nome

### **Dimensões de Negócio:**

- empreendimento_nome, empreendimento_tipo, unidade_tipo, cliente_principal

### **Métricas de Performance:**

- performance_valor_contrato, performance_margem_bruta_percent, etc.

### **Métricas Financeiras:**

- financial_desconto_percent, financial_saldo_devedor, etc.

## 🔧 **Características Técnicas**

- **Autenticação**: Nenhuma (AuthType.NONE)
- **Configuração**: Automática (sem parâmetros de usuário)
- **Cache**: Respeitado da API (1 hora)
- **Atualização**: Diária às 6h (conforme API)
- **Dados**: Últimos 12 meses automaticamente

## 🛠️ **Funções Principais**

### **`getAuthType()`**

Define que não requer autenticação.

### **`getConfig()`**

Retorna configuração vazia (máxima automação).

### **`getSchema()`**

Define a estrutura completa dos dados para o Looker Studio.

### **`getData()`**

Busca dados da API e formata para o Looker Studio.

### **`testConnection()`**

Função auxiliar para testar conectividade.

## 📈 **Vantagens**

- ✅ **Zero configuração** para usuários finais
- ✅ **Um clique** para conectar
- ✅ **Dados sempre atualizados** (12 meses)
- ✅ **Sem aprovação** do Google necessária
- ✅ **Gratuito** e ilimitado
- ✅ **Link compartilhável** direto

## 🔄 **Atualizações**

Para atualizar o conector:

1. Modifique `Code.gs` no Apps Script
2. Deploy → Gerenciar deployments → Editar
3. Nova versão → Implantar

O link permanece o mesmo!

## 🆘 **Suporte**

### **Logs e Debug:**

- Apps Script: Aba "Execuções"
- API: Logs do servidor
- Looker Studio: Console do navegador

### **Função de Teste:**

Execute `testConnection()` no Apps Script para verificar conectividade.

---

**🎯 Objetivo**: Conectar dados Sienge ao Looker Studio com máxima simplicidade e automação!
