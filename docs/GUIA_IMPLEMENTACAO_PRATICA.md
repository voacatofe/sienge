# 🚀 Guia Prático - Implementação Data Warehouse

## 🎯 Objetivo

Implementar o **primeiro dashboard comercial** no Looker Studio usando nossa view materializada `rpt_vendas_wide`.

---

## 📋 Pré-requisitos

- [x] Banco PostgreSQL funcionando
- [x] Dados de contratos de venda populados
- [x] Acesso ao banco via pgAdmin ou psql
- [x] Conta no Google Looker Studio

---

## 🔧 Passo 1: Implementar a View Materializada

### 1.1 Conectar no banco PostgreSQL

```bash
# Via Docker (se usando docker-compose)
docker-compose exec db psql -U sienge_app -d sienge_data

# Ou via pgAdmin / cliente SQL de sua preferência
```

### 1.2 Executar o script de criação

```sql
-- Copie e execute o conteúdo completo do arquivo:
-- sql/01_implementar_rpt_vendas_wide.sql
\i /caminho/para/sql/01_implementar_rpt_vendas_wide.sql
```

### 1.3 Verificar se foi criada com sucesso

```sql
-- Deve retornar informações da view
SELECT COUNT(*) FROM rpt_vendas_wide;

-- Verificar estrutura
\d rpt_vendas_wide
```

**✅ Resultado esperado:**

- View criada sem erros
- Pelo menos alguns registros retornados
- Campos categorizados (Performance, Conversions, Financial)

---

## 📊 Passo 2: Testar a View Localmente

### 2.1 Consulta básica de teste

```sql
-- Ver primeiros registros
SELECT *
FROM rpt_vendas_wide
ORDER BY data_contrato DESC
LIMIT 10;
```

### 2.2 Verificar métricas por categoria

```sql
-- Performance
SELECT
  "Performance — Valor Contrato",
  "Performance — Valor por M²",
  "Performance — Margem Bruta (%)"
FROM rpt_vendas_wide
WHERE "Performance — Valor Contrato" > 0
LIMIT 5;

-- Conversions
SELECT
  "Conversions — Status Contrato",
  COUNT(*) as quantidade
FROM rpt_vendas_wide
GROUP BY "Conversions — Status Contrato"
ORDER BY quantidade DESC;

-- Financial
SELECT
  "Financial — Forma Pagamento",
  COUNT(*) as contratos,
  AVG("Performance — Valor Contrato") as valor_medio
FROM rpt_vendas_wide
GROUP BY "Financial — Forma Pagamento"
ORDER BY contratos DESC;
```

### 2.3 Testar performance

```sql
-- Esta query simula o que o Looker Studio fará
EXPLAIN ANALYZE
SELECT
  ano_mes,
  COUNT(*) as contratos,
  SUM("Performance — Valor Contrato") as valor_total
FROM rpt_vendas_wide
WHERE data_contrato >= '2024-01-01'
GROUP BY ano_mes
ORDER BY ano_mes;
```

**✅ Resultado esperado:**

- Query roda em menos de 1 segundo
- Dados organizados corretamente
- Todas as categorias funcionando

---

## 🔗 Passo 3: Conectar com Looker Studio

### 3.1 Acessar o Looker Studio

1. Ir para [lookerstudio.google.com](https://lookerstudio.google.com)
2. Clicar em **"Criar" → "Fonte de dados"**
3. Escolher **"PostgreSQL"**

### 3.2 Configurar conexão

```
Configurações de conexão:
┌─────────────────────────────────────┐
│ Host: SEU_HOST_EASYPANEL            │
│ Porta: 5434                         │
│ Banco de dados: sienge_data         │
│ Nome de usuário: sienge_app         │
│ Senha: [sua senha]                  │
│ SSL: Desabilitado (ou conforme setup)│
└─────────────────────────────────────┘
```

### 3.3 Usar Custom Query

Na seção **"Query personalizada"**, inserir:

```sql
SELECT * FROM rpt_vendas_wide
WHERE data_contrato BETWEEN @DS_START_DATE AND @DS_END_DATE
ORDER BY data_contrato DESC
```

### 3.4 Configurar campos no Looker Studio

O Looker Studio detectará automaticamente:

**📅 Dimensões de tempo:**

- data_contrato (Date)
- ano, mes, trimestre (Number → Dimension)
- nome_mes (Text)

**📊 Métricas Performance:**

- Performance — Valor Contrato (Number → Metric, Sum)
- Performance — Valor por M² (Number → Metric, Average)
- Performance — Margem Bruta (%) (Number → Metric, Average)

**💰 Métricas Conversions:**

- Conversions — Contratos Ativos (Number → Metric, Sum)
- Conversions — Contratos Cancelados (Number → Metric, Sum)

**🎯 Dimensões para filtros:**

- empresa_regiao (Text)
- empreendimento_nome (Text)
- Segmentation — Faixa Valor (Text)

---

## 📈 Passo 4: Criar o Dashboard

### 4.1 Criar novo relatório

1. Clicar em **"Criar relatório"** após configurar a fonte
2. Aceitar adicionar dados ao relatório

### 4.2 Gráficos recomendados

**📊 Vendas por Mês (Gráfico de Linha)**

```
Dimensão: ano_mes
Métrica: Performance — Valor Contrato (Sum)
```

**🥧 Distribuição por Região (Gráfico de Pizza)**

```
Dimensão: empresa_regiao
Métrica: Performance — Valor Contrato (Sum)
```

**📊 Status dos Contratos (Gráfico de Barras)**

```
Dimensão: Conversions — Status Contrato
Métrica: Conversions — Contratos Ativos (Sum)
```

**📋 Tabela Detalhada**

```
Dimensões: empreendimento_nome, Segmentation — Faixa Valor
Métricas: Performance — Valor Contrato, Performance — Valor por M²
```

### 4.3 Filtros essenciais

- **Período**: data_contrato (controle de data)
- **Região**: empresa_regiao (lista suspensa)
- **Empreendimento**: empreendimento_nome (lista suspensa)
- **Status**: Conversions — Status Contrato (lista suspensa)

---

## 🔄 Passo 5: Automatizar Refresh

### 5.1 Executar script de refresh

```sql
-- No PostgreSQL, executar:
\i /caminho/para/sql/02_refresh_views_materializadas.sql
```

### 5.2 Configurar cron job (Linux/Mac)

```bash
# Editar crontab
crontab -e

# Adicionar linha para refresh diário às 6h
0 6 * * * psql "postgresql://sienge_app:senha@host:5434/sienge_data" -c "SELECT refresh_datawarehouse_views();" >> /var/log/dw_refresh.log 2>&1
```

### 5.3 Configurar agendamento no Windows

```powershell
# Criar script PowerShell refresh_dw.ps1
$env:PGPASSWORD = "sua_senha"
psql -h host -p 5434 -U sienge_app -d sienge_data -c "SELECT refresh_datawarehouse_views();"

# Agendar via Task Scheduler para executar diariamente
```

---

## ✅ Passo 6: Validação Final

### 6.1 Checklist de funcionamento

- [ ] View materializada criada sem erros
- [ ] Dados aparecem corretamente no Looker Studio
- [ ] Campos categorizados (Performance, Conversions, Financial)
- [ ] Gráficos respondem aos filtros
- [ ] Performance adequada (< 30s para consultas)
- [ ] Refresh automatizado funcionando

### 6.2 Testes de validação

```sql
-- 1. Verificar integridade dos dados
SELECT
  COUNT(*) as total_registros,
  COUNT(DISTINCT contrato_id) as contratos_unicos,
  MIN(data_contrato) as data_inicial,
  MAX(data_contrato) as data_final
FROM rpt_vendas_wide;

-- 2. Verificar métricas básicas
SELECT
  SUM("Performance — Valor Contrato") as valor_total,
  AVG("Performance — Valor Contrato") as valor_medio,
  COUNT("Conversions — Contratos Ativos") as total_ativos
FROM rpt_vendas_wide;
```

---

## 🎯 Resultados Esperados

### ✅ Dashboard funcionando com:

1. **Gráficos interativos** com drill-down
2. **Filtros dinâmicos** por período, região, empreendimento
3. **Métricas organizadas** por categoria (Performance, Conversions, Financial)
4. **Performance rápida** (consultas < 5 segundos)
5. **Dados atualizados** automaticamente (diário)

### 📊 KPIs disponíveis:

- **Volume de vendas** por período/região
- **Performance por empreendimento**
- **Análise de margem** e precificação
- **Conversão e status** dos contratos
- **Segmentação** por faixa de valor

---

## 🚨 Troubleshooting

### Problema: View não criada

```sql
-- Verificar se as tabelas base existem
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('contratos_venda', 'empresas', 'empreendimentos', 'unidades');
```

### Problema: Looker Studio não conecta

- Verificar configurações de rede/firewall
- Testar conexão com cliente SQL local primeiro
- Verificar credenciais e permissões

### Problema: Performance lenta

```sql
-- Verificar se índices foram criados
SELECT indexname, tablename FROM pg_indexes
WHERE tablename = 'rpt_vendas_wide';

-- Forçar refresh dos índices
REINDEX TABLE rpt_vendas_wide;
```

### Problema: Dados inconsistentes

```sql
-- Refresh forçado da view
REFRESH MATERIALIZED VIEW rpt_vendas_wide;

-- Verificar logs de erro
SELECT * FROM refresh_datawarehouse_views();
```

---

## 🎉 Próximos Passos

Após implementar com sucesso:

1. **Criar rpt_financeiro_wide** (dashboard financeiro)
2. **Adicionar mais KPIs** conforme necessidade
3. **Configurar alertas** no Looker Studio
4. **Treinar usuários** no dashboard
5. **Expandir para outros domínios** (pipeline, executivo)

---

**🎯 Com este guia, você terá seu primeiro dashboard analítico funcionando em menos de 2 horas!**
