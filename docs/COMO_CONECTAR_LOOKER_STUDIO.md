# 📊 Como Conectar Sienge ao Looker Studio

## 🎯 **Visão Geral**

O **Community Connector Sienge** permite conectar seus dados de vendas diretamente ao Looker Studio com **apenas um clique**. Sem configurações manuais, sem autenticação - completamente automático!

## 🚀 **Para Usuários Finais (Super Simples)**

### **Passo Único:**

1. **Clique no link** fornecido pelo seu administrador
2. **Looker Studio abre** automaticamente com o conector
3. **Clique em "Conectar"**
4. **Pronto!** Seus dados aparecem automaticamente

### **Link do Conector:**

```
https://lookerstudio.google.com/datasources/create?connectorId=XXXX
```

_O administrador fornecerá o link completo com o ID correto_

---

## 🛠️ **Para Administradores (Configuração Inicial)**

### **🔧 Setup do Community Connector (Uma vez apenas)**

#### **1. Criar o Conector no Google Apps Script**

1. Acesse: **https://script.google.com/**
2. Clique em **"Novo projeto"**
3. Renomeie para: **"Sienge Data Warehouse Connector"**

#### **2. Adicionar o Código**

1. **Delete** o código padrão
2. **Cole** todo o conteúdo do arquivo `looker-studio-connector/Code.gs`
3. **Salve** o projeto (Ctrl+S)

#### **3. Configurar o Manifesto**

1. Clique em **"Manifesto"** (appsscript.json)
2. **Substitua** todo o conteúdo pelo manifesto fornecido
3. **Salve** (Ctrl+S)

#### **4. Deploy como Aplicativo Web**

1. **Deploy** → **"Novo deployment"**
2. **Tipo**: Aplicativo da web
3. **Executar como**: Eu
4. **Acesso**: Qualquer pessoa
5. **Copie o Deployment ID**

#### **5. Gerar Link Direto**

```
https://lookerstudio.google.com/datasources/create?connectorId=SEU_DEPLOYMENT_ID
```

---

## 📈 **Dados Disponíveis**

### **📅 Dimensões Temporais**

- Data do Contrato, Ano, Trimestre, Mês
- Últimos 12 meses automaticamente

### **🏢 Dimensões Geográficas**

- Região, Estado, Cidade da Empresa
- Nome da Empresa

### **🏗️ Dimensões de Negócio**

- Nome e Tipo do Empreendimento
- Tipo de Unidade, Faixa de Área
- Cliente Principal

### **💰 Métricas Financeiras**

- Valor do Contrato, Valor Total de Vendas
- Margem Bruta (%), Valor por M²
- Descontos, Taxa de Juros, Saldo Devedor

### **📊 Métricas de Performance**

- Tempo de Venda (dias)
- Status dos Contratos
- Contratos Ativos/Cancelados/Assinados
- Chaves Entregues

### **🎯 Métricas de Segmentação**

- Faixa de Valor, Canal de Venda
- Tipo de Contrato

---

## ✅ **Vantagens do Community Connector**

### **🔄 Automático**

- Dados sempre dos últimos 12 meses
- Atualização diária às 6h
- Sem configuração manual necessária

### **🎯 Simples**

- Um clique para conectar
- Sem autenticação requerida
- Link compartilhável

### **⚡ Performático**

- Cache de 1 hora
- Otimizado para dashboards
- Estrutura de dados pré-definida

### **🆓 Gratuito**

- Sem custos adicionais
- Uso ilimitado
- Sem aprovação necessária

---

## 🛡️ **Resolução de Problemas**

### **❌ "Connector not found"**

**Causa**: Link incorreto ou deployment inválido
**Solução**: Verificar se o Deployment ID está correto

### **❌ "Unable to fetch data"**

**Causa**: API offline ou URL incorreta
**Solução**:

1. Testar função `testConnection()` no Apps Script
2. Verificar se `https://sienge-teste.hvlihi.easypanel.host/api/datawarehouse/vendas` está online

### **❌ "Authorization required"**

**Causa**: Primeira execução não autorizada
**Solução**:

1. No Apps Script, executar qualquer função
2. Autorizar quando solicitado

### **❌ Dados não aparecem**

**Causa**: Estrutura de dados alterada
**Solução**: Verificar mapeamento de campos na função `formatRowForLookerStudio()`

---

## 🔄 **Atualizações do Conector**

### **Para Alterar a API ou Campos:**

1. **Modificar** código no Google Apps Script
2. **Deploy** → **"Gerenciar deployments"**
3. **Editar** deployment existente
4. **Nova versão** → **"Implantar"**

**O link permanece o mesmo!**

---

## 📞 **Suporte Técnico**

### **🔍 Para Diagnósticos:**

1. **API Status**: Acesse diretamente `/api/datawarehouse/vendas`
2. **Apps Script Logs**: Aba "Execuções" no script.google.com
3. **Teste de Conexão**: Execute `testConnection()` no Apps Script

### **📧 Contato:**

- **Suporte API**: Verificar logs do servidor
- **Suporte Looker**: Verificar console do navegador
- **Suporte Apps Script**: Console Google Developer

---

## 🎉 **Resultado Final**

Após a configuração inicial (feita uma vez pelo administrador), todos os usuários podem:

1. **Clicar no link** → Looker Studio abre
2. **Clicar "Conectar"** → Dados carregam automaticamente
3. **Criar relatórios** com dados sempre atualizados

**🚀 Experiência do usuário: 2 cliques para dados completos!**
