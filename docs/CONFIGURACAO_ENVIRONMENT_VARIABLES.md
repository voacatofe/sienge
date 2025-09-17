# 🔧 Configuração de Variáveis de Ambiente

## 📋 Variáveis Obrigatórias para BI Tools

### **1. NEXT_PUBLIC_LOOKER_DEPLOYMENT_ID**

**Descrição:** ID do deployment do Community Connector no Google Apps Script para o Looker Studio.

**Como obter:**
1. Faça o deploy do Community Connector no Google Apps Script
2. Copie o Deployment ID gerado
3. Configure esta variável no EasyPanel

**Exemplo:**
```env
NEXT_PUBLIC_LOOKER_DEPLOYMENT_ID=AKfycbzXYZ123abc456def789ghi012jkl345mno678pqr901stu234vwx567yza890bcd
```

**No EasyPanel:**
1. Acesse seu projeto no EasyPanel
2. Vá em **Environment Variables**
3. Adicione:
   - **Nome:** `NEXT_PUBLIC_LOOKER_DEPLOYMENT_ID`
   - **Valor:** Seu Deployment ID do Google Apps Script

### **2. NEXT_PUBLIC_PRIMARY_DOMAIN**

**Descrição:** Domínio principal da aplicação (já configurado automaticamente pelo EasyPanel).

**Exemplo:**
```env
NEXT_PUBLIC_PRIMARY_DOMAIN=conector.catometrics.com.br
```

---

## 🚀 Como Configurar no EasyPanel

### **Passo 1: Acesse Environment Variables**
1. Entre no seu projeto EasyPanel
2. Clique em **Environment Variables** no menu lateral

### **Passo 2: Adicione as Variáveis**
```
NEXT_PUBLIC_LOOKER_DEPLOYMENT_ID = [Seu Deployment ID]
```

### **Passo 3: Restart a Aplicação**
Após adicionar as variáveis, faça restart da aplicação para que elas sejam carregadas.

---

## 📊 URLs Geradas Automaticamente

Com as variáveis configuradas, o frontend gerará automaticamente:

### **Looker Studio:**
```
https://lookerstudio.google.com/datasources/create?connectorId=[SEU_DEPLOYMENT_ID]
```

### **Power BI:**
```
https://[DOMAIN]/api/datawarehouse/master
https://[DOMAIN]/api/datawarehouse/master?domain=contratos
https://[DOMAIN]/api/datawarehouse/master?domain=clientes
https://[DOMAIN]/api/datawarehouse/master?domain=empreendimentos
https://[DOMAIN]/api/datawarehouse/master?domain=unidades
```

---

## ⚠️ Importante

- **NEXT_PUBLIC_LOOKER_DEPLOYMENT_ID** é obrigatória para o link direto do Looker Studio funcionar
- Sem esta variável, aparecerá um aviso de configuração no frontend
- As variáveis **NEXT_PUBLIC_*** ficam expostas no frontend (isso é normal e necessário)

---

## 🔍 Validação

Para testar se as variáveis estão funcionando:

1. **Frontend:** Acesse a página de BI Tools e verifique se os links estão corretos
2. **Looker Studio:** Teste o link direto do conector
3. **Power BI:** Teste uma das URLs da API Master

Se algum link mostrar `SEU_DEPLOYMENT_ID`, a variável não foi configurada corretamente.