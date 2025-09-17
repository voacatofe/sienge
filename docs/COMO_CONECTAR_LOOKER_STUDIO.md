# 🔗 Como Conectar ao Looker Studio/Power BI

## 📋 URL Simples para Conexão

### **URL da API (Fixa - Não precisa alterar nada):**

```
https://seu-easypanel-domain.com/api/datawarehouse/vendas
```

**✅ Comportamento Automático:**

- Sempre retorna dados dos **últimos 12 meses**
- **780+ contratos** com campos organizados por categoria
- Atualização automática conforme novos dados chegam
- **Zero configuração** necessária

---

## 🎨 Conectando no Looker Studio

### **Passo a Passo:**

1. **Criar Nova Fonte de Dados**
   - Acesse [Looker Studio](https://lookerstudio.google.com)
   - Clique em "Criar" → "Fonte de dados"

2. **Escolher Conector Web**
   - Na lista de conectores, procure por **"Conector da Web"**
   - Clique para selecionar

3. **Configurar URL**
   - Cole a URL: `https://seu-easypanel-domain.com/api/datawarehouse/vendas`
   - Clique em "Conectar"

4. **Pronto! 🎉**
   - Todos os campos aparecem automaticamente organizados
   - Campos categorizados como "Performance — Valor Contrato"
   - Use como qualquer fonte de dados premium

---

## 📊 Conectando no Power BI

### **Passo a Passo:**

1. **Obter Dados**
   - Abra Power BI Desktop
   - Clique em "Obter dados" → "Web"

2. **Inserir URL**
   - Cole a URL: `https://seu-easypanel-domain.com/api/datawarehouse/vendas`
   - Clique em "OK"

3. **Transformar Dados (Automático)**
   - Power BI vai detectar automaticamente a estrutura JSON
   - Expanda os campos conforme necessário
   - Clique em "Carregar"

4. **Configurar Refresh**
   - Configure atualização automática diária
   - Publique no Power BI Service

---

## 🏗️ Campos Disponíveis (Organizados por Categoria)

### **📈 Performance**

- Performance — Valor Contrato
- Performance — Valor Venda Total
- Performance — Valor por M²
- Performance — Margem Bruta (%)
- Performance — Tempo Venda (dias)

### **🎯 Conversions**

- Conversions — Status Contrato
- Conversions — Contratos Ativos
- Conversions — Contratos Cancelados
- Conversions — Chaves Entregues
- Conversions — Contratos Assinados

### **💰 Financial**

- Financial — Desconto (%)
- Financial — Valor Desconto
- Financial — Forma Pagamento
- Financial — Taxa Juros (%)
- Financial — Total Parcelas
- Financial — Saldo Devedor

### **🎭 Segmentation**

- Segmentation — Faixa Valor
- Segmentation — Canal Venda
- Segmentation — Tipo Contrato

### **📅 Time (Dimensões Temporais)**

- data_contrato
- ano, trimestre, mes
- ano_mes, nome_mes
- dia_semana, nome_dia

### **🌍 Geography (Dimensões Geográficas)**

- empresa_regiao
- empresa_estado
- empresa_cidade
- empresa_nome

### **🏢 Business (Dimensões de Negócio)**

- empreendimento_nome
- empreendimento_tipo
- unidade_tipo
- unidade_faixa_area
- cliente_principal

---

## ⚡ Vantagens desta Abordagem

### **✅ Ultra Simples**

- **1 URL única** para tudo
- **Sem configuração** de banco de dados
- **Funciona imediatamente** em qualquer BI tool

### **✅ Sempre Atualizado**

- **Janela móvel** de 12 meses automaticamente
- **Dados frescos** sempre que acessar
- **Zero manutenção** manual

### **✅ Performance Otimizada**

- **Dados pré-processados** na view materializada
- **Campos categorizados** prontos para uso
- **Carregamento rápido** no BI

### **✅ Segurança**

- **Não expõe** credenciais do banco
- **Rate limiting** automático
- **Logs de acesso** completos

---

## 🔧 Solução de Problemas

### **❌ Erro de Conexão**

- Verifique se a URL está correta
- Teste a URL no navegador primeiro
- Verifique se o servidor está rodando

### **❌ Dados Não Aparecem**

- Aguarde alguns segundos para carregamento
- Verifique se há dados no período (últimos 12 meses)
- Verifique logs do servidor

### **❌ Campos Desorganizados**

- Use a opção "Transformar dados" no Power BI
- No Looker Studio, os campos aparecem automaticamente organizados
- Verifique se está usando a URL correta

---

## 📞 Suporte

**Para dúvidas:**

1. Verificar logs do servidor
2. Testar URL diretamente no navegador
3. Verificar documentação técnica

**URL de Teste:**

```
https://seu-easypanel-domain.com/api/datawarehouse/vendas
```

---

**✨ Esta solução elimina 100% da complexidade de configuração PostgreSQL, mantendo todos os benefícios do Data Warehouse organizado!**
