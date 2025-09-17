# 🚀 Como Fazer Deploy do Community Connector Sienge

## 📋 Pré-requisitos

- Conta Google (Gmail)
- Acesso ao Google Apps Script

## 🔧 Passo-a-Passo do Deploy

### **1. Criar Projeto no Google Apps Script**

1. Acesse: https://script.google.com/
2. Clique em **"Novo projeto"**
3. Renomeie para: **"Sienge Data Warehouse Connector"**

### **2. Adicionar o Código**

1. Delete o código padrão (`function myFunction() {}`)
2. Cole **todo o conteúdo** do arquivo `Code.gs`
3. **Salve o projeto** (Ctrl+S)

### **3. Configurar Manifesto**

1. Clique em **"Manifesto"** (appsscript.json) no painel esquerdo
2. **Substitua todo o conteúdo** por:

```json
{
  "timeZone": "America/Sao_Paulo",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "dataStudio": {
    "name": "Sienge Data Warehouse",
    "logoUrl": "https://conector.catometrics.com.br/logo.png",
    "company": "Sienge",
    "companyUrl": "https://catometrics.com.br",
    "addonUrl": "https://conector.catometrics.com.br/api/datawarehouse/master",
    "supportUrl": "mailto:suporte@sienge.com.br",
    "description": "Conector para acessar dados do Data Warehouse Sienge diretamente no Looker Studio. Dados dos últimos 12 meses automaticamente, atualizados diariamente às 6h.",
    "shortDescription": "Dados de vendas Sienge para Looker Studio",
    "authType": ["NONE"],
    "feeType": ["FREE"]
  }
}
```

3. **Salve** (Ctrl+S)

### **4. Testar Conectividade (Opcional)**

1. No editor, clique em **"Função"** → selecione `testConnection`
2. Clique em **"Executar"**
3. Autorize quando solicitado
4. Verifique os logs: **"Execuções"** → deve mostrar "Connection successful!"

### **5. Fazer Deploy**

1. Clique em **"Deploy"** → **"Novo deployment"**
2. **Configurações**:
   - **Tipo**: Aplicativo da web
   - **Descrição**: "Sienge Data Warehouse Connector v1.0"
   - **Executar como**: Eu
   - **Quem tem acesso**: Qualquer pessoa
3. Clique em **"Implantar"**
4. **Copie o Deployment ID** (será algo como: `AKfyc...`)

### **6. Gerar Link Direto**

Cole o Deployment ID nesta URL:

```
https://lookerstudio.google.com/datasources/create?connectorId=AKfycbymjgNNbWkYOAPlVPF71YefmpuRNKTb_NRyU5ftvhkWZADaQDGzW0lklLqjJO0YAVLR
```

**Exemplo:**

```
https://lookerstudio.google.com/datasources/create?connectorId=AKfycbw8H9j2_exemplo_12345
```

## ✅ **Pronto! Como Usar**

### **Para Você (Admin):**

1. Teste o link gerado
2. Deve abrir o Looker Studio com seu conector
3. Clique em **"Conectar"**
4. Dados devem aparecer automaticamente

### **Para Usuários Finais:**

1. Compartilhe o link direto
2. Eles clicam → Looker Studio abre
3. Clicam em **"Conectar"** → pronto!

## 🔧 **Atualizações Futuras**

Quando precisar atualizar:

1. Modifique o código no Apps Script
2. **Deploy** → **Gerenciar deployments**
3. Clique no ícone de edição
4. **Versão**: Nova
5. **Implantar**

O link permanece o mesmo!

## 🆘 **Resolução de Problemas**

### **Erro: "Connector not found"**

- Verifique se o Deployment ID está correto no link
- Certifique-se que o deployment foi feito como "Aplicativo da web"

### **Erro: "Unable to fetch data"**

- Teste a função `testConnection()` no Apps Script
- Verifique se a URL da API está correta (linha 245 do código)
- Confirme se a API está online e acessível

### **Erro de Autorização**

- No Apps Script, execute qualquer função para autorizar
- Revise permissões em "Execuções"

## 📞 **Suporte**

- **API Issues**: Verificar logs em `/api/datawarehouse/vendas`
- **Apps Script Issues**: Verificar "Execuções" no console
- **Looker Studio Issues**: Verificar se dados estão sendo retornados

---

**🎯 Resultado Final**: Link clicável que conecta automaticamente sua API ao Looker Studio!
