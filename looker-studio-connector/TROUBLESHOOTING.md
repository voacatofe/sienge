# 🔧 Guia de Troubleshooting - Looker Studio Connector

## 📋 Índice

1. [Erros Comuns e Soluções](#erros-comuns)
2. [Diagnóstico Passo a Passo](#diagnóstico)
3. [Validação da Estrutura](#validação)
4. [Checklist de Deploy](#checklist)
5. [Logs e Debug](#logs)
6. [FAQ](#faq)

## 🚨 Erros Comuns e Soluções <a name="erros-comuns"></a>

### Erro: "Erro no conector da comunidade" (Código 11a65ddf ou similar)

**Causa Principal**: Schema mismatch - o formato dos dados retornados não corresponde ao esperado.

**Solução**:

1. Verificar se getData() retorna `{ values: [...] }` para cada linha
2. Confirmar que o número de valores corresponde aos campos solicitados
3. Validar tipos de dados (especialmente datas)

```javascript
// ❌ ERRADO
rows.push(['valor1', 'valor2']);

// ✅ CORRETO
rows.push({ values: ['valor1', 'valor2'] });
```

### Erro: "App schema does not match configured report schema"

**Causa**: Mudança no schema sem reconectar a fonte de dados.

**Solução**:

1. No Looker Studio, editar a fonte de dados
2. Clicar em "Reconectar"
3. Ou criar uma nova fonte de dados

### Erro: "getData() method is never called"

**Causa**: Nenhuma métrica definida no schema.

**Solução**:

```javascript
// Adicionar pelo menos uma métrica
fields
  .newMetric()
  .setId('quantidade_registros')
  .setName('Quantidade')
  .setType(types.NUMBER)
  .setAggregation(aggregations.COUNT);
```

### Erro: Dados não aparecem no relatório

**Causas possíveis**:

1. API retornando array vazio
2. Formato de data incorreto
3. Cache com dados antigos

**Soluções**:

```javascript
// 1. Verificar resposta da API
console.log('Total registros:', jsonResponse.data.length);

// 2. Formatar datas corretamente (YYYYMMDD)
var dateFormatted = dateStr.replace(/[-T:\s]/g, '').substring(0, 8);

// 3. Limpar cache
clearAllCache();
```

## 🔍 Diagnóstico Passo a Passo <a name="diagnóstico"></a>

### Passo 1: Testar Conexão com API

No Apps Script, executar:

```javascript
testConnection();
```

Verificar:

- ✅ Response code 200
- ✅ Dados retornados (data.length > 0)
- ✅ Estrutura dos dados

### Passo 2: Validar Schema

```javascript
function validateSchema() {
  var schema = getSchema();
  console.log('Total campos:', schema.schema.length);

  var metrics = schema.schema.filter(function (f) {
    return f.conceptType === 'METRIC';
  });

  console.log('Métricas:', metrics.length);

  if (metrics.length === 0) {
    console.log('❌ ERRO: Sem métricas!');
  }
}
```

### Passo 3: Testar getData()

```javascript
testFullConnector();
```

Verificar no log:

- Estrutura de rows
- Formato de values
- Tipos de dados

### Passo 4: Verificar Logs

Ver → Logs no Apps Script Editor

Procurar por:

- Erros de API
- Problemas de formatação
- Cache hits/misses

## ✅ Validação da Estrutura <a name="validação"></a>

### Estrutura Correta de Retorno

```javascript
{
  schema: [
    { name: 'field1', dataType: 'STRING', ... },
    { name: 'field2', dataType: 'NUMBER', ... }
  ],
  rows: [
    { values: ['valor1', 123] },
    { values: ['valor2', 456] }
  ]
}
```

### Validador de Estrutura

```javascript
function validateDataStructure(data) {
  // Verificar schema
  if (!data.schema || !Array.isArray(data.schema)) {
    return 'ERRO: Schema inválido';
  }

  // Verificar rows
  if (!data.rows || !Array.isArray(data.rows)) {
    return 'ERRO: Rows inválido';
  }

  // Verificar estrutura de cada row
  var invalidRows = data.rows.filter(function (row) {
    return !row.values || !Array.isArray(row.values);
  });

  if (invalidRows.length > 0) {
    return 'ERRO: ' + invalidRows.length + ' rows com formato incorreto';
  }

  // Verificar número de valores
  var schemaLength = data.schema.length;
  var mismatchedRows = data.rows.filter(function (row) {
    return row.values.length !== schemaLength;
  });

  if (mismatchedRows.length > 0) {
    return (
      'ERRO: ' + mismatchedRows.length + ' rows com número incorreto de valores'
    );
  }

  return 'OK: Estrutura válida';
}
```

## 📝 Checklist de Deploy <a name="checklist"></a>

### Antes do Deploy

- [ ] Executar `testConnection()` - API respondendo?
- [ ] Executar `testFullConnector()` - Estrutura correta?
- [ ] Verificar `CONFIG.API_URL` - Apontando para produção?
- [ ] Configurar `CONFIG.DEBUG = false` para produção
- [ ] Limpar cache com `clearAllCache()`

### Durante o Deploy

1. **No Apps Script:**
   - [ ] Salvar arquivo
   - [ ] Deploy → Nova implantação
   - [ ] Copiar ID do deployment

2. **No Looker Studio:**
   - [ ] Adicionar fonte de dados
   - [ ] Colar URL do conector
   - [ ] Autorizar acesso
   - [ ] Conectar

### Após o Deploy

- [ ] Criar gráfico simples para teste
- [ ] Verificar se dados aparecem
- [ ] Testar filtros de data
- [ ] Validar agregações

## 📊 Logs e Debug <a name="logs"></a>

### Habilitar Debug Detalhado

```javascript
CONFIG.DEBUG = true; // No início do arquivo
```

### Pontos de Debug Importantes

```javascript
// 1. Request recebido
logDebug('Request fields: ' + JSON.stringify(request.fields));

// 2. Resposta da API
logDebug('API response: ' + response.getResponseCode());

// 3. Dados processados
logDebug('Rows processed: ' + rows.length);

// 4. Primeira linha (amostra)
logDebug('First row: ' + JSON.stringify(rows[0]));
```

### Analisar Logs

1. Abrir Apps Script Editor
2. Ver → Logs
3. Procurar por `[DEBUG]`
4. Identificar onde o erro ocorre

## ❓ FAQ <a name="faq"></a>

### P: Como limpar o cache?

```javascript
clearAllCache(); // Executar no Apps Script
```

### P: Como testar com dados locais?

Mudar configuração:

```javascript
CONFIG.USE_PRODUCTION = false;
CONFIG.API_URL_LOCAL = 'http://localhost:3001/api/datawarehouse/master';
```

### P: Quantos registros o conector suporta?

Limite atual: 10.000 registros (configurável em `CONFIG.MAX_RECORDS`)

### P: Como adicionar novos campos?

1. Adicionar em `getSchema()`:

```javascript
fields
  .newDimension()
  .setId('novo_campo')
  .setName('Novo Campo')
  .setType(types.TEXT);
```

2. Adicionar em `getFieldValue()`:

```javascript
case 'novo_campo':
  value = record['novo_campo'] || '';
  break;
```

3. Reconectar no Looker Studio

### P: Como debugar erro específico?

1. Anotar código do erro
2. Adicionar try/catch com log:

```javascript
try {
  // código suspeito
} catch (e) {
  console.log('Erro específico: ' + e.toString());
  throw e;
}
```

3. Verificar logs

### P: Formato de data não funciona?

Datas devem estar em YYYYMMDD:

```javascript
// Converter qualquer formato para YYYYMMDD
function formatDateForLooker(dateStr) {
  if (!dateStr) return null;

  // Remover separadores e pegar 8 dígitos
  var cleaned = dateStr.replace(/[-T:\s\/]/g, '').substring(0, 8);

  // Validar formato
  if (cleaned.length === 8 && /^\d{8}$/.test(cleaned)) {
    return cleaned;
  }

  return null;
}
```

## 🆘 Suporte

Se o problema persistir:

1. Executar suite completa de testes:

```javascript
runAllTests();
```

2. Coletar informações:
   - Código do erro
   - Logs completos
   - Schema atual
   - Amostra de dados

3. Verificar:
   - View materializada existe?
   - API está respondendo?
   - Formato de dados está correto?

4. Contato: darlan@catofe.com.br

---

## 🎯 Resumo Rápido

**O erro mais comum (schema mismatch) é resolvido garantindo:**

```javascript
// SEMPRE retornar este formato em getData():
return {
  schema: request.fields,
  rows: [
    { values: [...] }, // CRÍTICO: { values: array }
    { values: [...] },
    { values: [...] }
  ]
};
```

**Nunca retornar:**

- Arrays simples como rows
- Objetos sem propriedade `values`
- Número diferente de valores vs campos

---

Versão: 4.0 | Data: 18/09/2024
