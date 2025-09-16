# 📊 Plano de Data Warehouse - Sienge Analytics

## 🎯 Objetivo

Criar uma camada analítica robusta seguindo o padrão **Star Schema** para alimentar dashboards do **Looker Studio** com dados organizados, performáticos e de fácil consumo.

## 🏗️ Arquitetura Proposta

### 1. **Staging (Dados Brutos)**

```
📦 Tabelas atuais (Raw Data)
├── empresas
├── clientes
├── empreendimentos
├── unidades
├── contratos_venda
├── titulos_receber
├── contas_receber
└── movimentos_bancarios
```

### 2. **Data Warehouse (Star Schema)**

```
🌟 Star Schema
├── 📅 dim_tempo (calendário completo)
├── 🏢 dim_empresa (com SCD Type 1)
├── 👤 dim_cliente (com SCD Type 2)
├── 🏗️ dim_empreendimento
├── 🏠 dim_unidade
├── 📋 dim_produto
├── 💰 fact_vendas
├── 💳 fact_financeiro
└── 📊 fact_contratos
```

### 3. **Camada de Apresentação (Views Materializadas)**

```
📈 Views para Looker Studio - Abordagem Inicial
├── rpt_vendas_wide (dashboard comercial)
├── rpt_financeiro_wide (dashboard financeiro)
├── rpt_pipeline_wide (funil de vendas)
└── rpt_performance_wide (KPIs executivos)

📊 Evolução Futura - View Única Consolidada
└── rpt_sienge_master_wide (todos os dados unificados)
```

## 📋 Dimensões Detalhadas

### 🕐 **dim_tempo** (Dimensão Fundamental)

```sql
Campos principais:
- date_key (YYYYMMDD)
- full_date, year, quarter, month, day
- day_of_week_name, week_of_year
- is_weekend, is_holiday
- semester (útil para análise semestral)
```

### 🏢 **dim_empresa**

```sql
Campos enriquecidos:
- dados básicos (nome, CNPJ, endereço)
- regiao (derivado do estado)
- porte (pequeno/médio/grande - baseado em faturamento)
- segmento (derivado do CNAE)
```

### 👤 **dim_cliente** (SCD Type 2)

```sql
Campos analíticos:
- dados básicos + demografias
- faixa_etaria (18-25, 26-35, etc.)
- segmento_cliente (VIP, Premium, Standard)
- score_credito (Alto, Médio, Baixo)
- versioning para histórico de mudanças
```

### 🏗️ **dim_empreendimento**

```sql
Campos estratégicos:
- dados básicos + localização
- fase (Planejamento, Construção, Entrega)
- vgv_total, unidades_totais
- data_lancamento, data_entrega_prevista
```

### 🏠 **dim_unidade**

```sql
Campos detalhados:
- características (dormitórios, área, pavimento)
- posicao, vista (para análise de pricing)
- valor_m2, status_unidade
- relacionamento com empreendimento
```

### 📋 **dim_produto**

```sql
Campos comerciais:
- tipo_produto, categoria
- forma_pagamento, prazo_meses
- tipo_financiamento, indexador
- percentual_entrada
```

## 💎 Fatos Detalhados

### 💰 **fact_vendas** (Grão: Contrato de Venda)

```sql
Métricas principais:
- valor_contrato, valor_entrada, valor_financiado
- valor_desconto, margem_bruta
- tempo_venda, ciclo_venda
- canal_venda, vendedor_id

Análises possíveis:
✅ Vendas por período/região/empreendimento
✅ Performance de vendedores
✅ Análise de margem e descontos
✅ Tempo médio de venda
✅ Mix de produtos vendidos
```

### 💳 **fact_financeiro** (Grão: Título a Receber)

```sql
Métricas principais:
- valor_original, valor_atualizado, valor_pago
- valor_juros, valor_multa, valor_liquido
- dias_atraso, faixa_atraso
- is_pago, is_vencido, is_negotiado

Análises possíveis:
✅ Inadimplência por período/cliente/região
✅ Aging de recebíveis
✅ Eficiência de cobrança
✅ Fluxo de caixa projetado vs realizado
✅ Performance de portadores
```

### 📊 **fact_contratos** (Grão: Contrato - Pipeline)

```sql
Métricas principais:
- valor_contrato, probabilidade, valor_ponderado
- status_contrato, etapa_pipeline
- dias_negociacao, dias_aprovacao
- is_assinado, is_cancelado

Análises possíveis:
✅ Funil de vendas (pipeline)
✅ Taxa de conversão por etapa
✅ Tempo médio de negociação
✅ Motivos de cancelamento
✅ Previsão de vendas (valor ponderado)
```

## 📈 Views Materializadas (Camada de Apresentação)

### 🎯 **rpt_vendas_wide** (Dashboard Comercial)

```sql
SELECT
  -- Dimensões de tempo
  dt.full_date, dt.year, dt.quarter, dt.month_name,

  -- Dimensões de negócio
  emp.nome_empresa, emp.regiao as empresa_regiao,
  cli.nome_completo, cli.faixa_etaria, cli.segmento_cliente,
  empr.nome as empreendimento, empr.tipo, empr.fase,
  uni.tipo_imovel, uni.dormitorios, uni.area_privativa,
  prod.forma_pagamento, prod.categoria,

  -- Métricas - Performance
  fv.valor_contrato as "Performance — Valor Contrato",
  fv.valor_venda as "Performance — Valor Venda",
  fv.margem_bruta as "Performance — Margem Bruta",
  fv.tempo_venda as "Performance — Tempo Venda (dias)",

  -- Métricas - Conversões
  CASE WHEN fv.status_venda = 'Assinado' THEN 1 ELSE 0 END as "Conversions — Vendas Efetivadas",
  CASE WHEN fv.status_venda = 'Cancelado' THEN 1 ELSE 0 END as "Conversions — Cancelamentos",
  fv.valor_m2 as "Conversions — Valor por M²",

  -- Métricas - Financeiro
  fv.valor_entrada as "Financial — Valor Entrada",
  fv.valor_financiado as "Financial — Valor Financiado",
  fv.comissao_total as "Financial — Comissão Total"

FROM fact_vendas fv
JOIN dim_tempo dt ON dt.date_key = fv.data_contrato_key
JOIN dim_empresa emp ON emp.empresa_key = fv.empresa_key
-- ... demais JOINs
```

### 💰 **rpt_financeiro_wide** (Dashboard Financeiro)

```sql
-- Similar structure com métricas financeiras organizadas:
-- "Receivables — Valor Original"
-- "Receivables — Valor Pago"
-- "Performance — Taxa Inadimplência"
-- "Aging — 0-30 dias"
-- "Aging — 31-60 dias"
-- etc.
```

### 📊 **rpt_pipeline_wide** (Funil de Vendas)

```sql
-- Métricas de pipeline organizadas:
-- "Pipeline — Valor Total"
-- "Pipeline — Valor Ponderado"
-- "Conversion — Taxa Proposta → Negociação"
-- "Conversion — Taxa Negociação → Assinatura"
-- "Performance — Tempo Médio Negociação"
-- etc.
```

## 🔄 Processo de ETL

### 1. **Carga Inicial (One-time)**

```sql
-- Populando dim_tempo (5 anos de calendário)
-- Populando dimensões a partir das tabelas raw
-- Calculando métricas derivadas
-- Criando chaves surrogates
```

### 2. **Carga Incremental (Diária)**

```sql
-- Atualizar dimensões (SCD Type 1 e 2)
-- Inserir novos fatos
-- Refresh das materialized views
-- Limpeza de dados antigos (se necessário)
```

### 3. **Agendamento**

```bash
# Cron job diário às 6h
0 6 * * * /app/scripts/etl_daily.sh

# Refresh das views materializadas
REFRESH MATERIALIZED VIEW CONCURRENTLY rpt_vendas_wide;
REFRESH MATERIALIZED VIEW CONCURRENTLY rpt_financeiro_wide;
# etc.
```

## 🎨 Conexão com Looker Studio

### 1. **Configuração PostgreSQL**

```sql
-- Criar usuário específico para BI
CREATE USER looker_studio WITH PASSWORD 'senha_segura';

-- Dar permissões apenas nas views
GRANT SELECT ON rpt_vendas_wide TO looker_studio;
GRANT SELECT ON rpt_financeiro_wide TO looker_studio;
GRANT SELECT ON rpt_pipeline_wide TO looker_studio;
```

### 2. **Custom Query no Looker Studio**

```sql
SELECT * FROM rpt_vendas_wide
WHERE full_date BETWEEN @DS_START_DATE AND @DS_END_DATE
```

### 3. **Organização dos Campos**

```
📊 Performance
├── Performance — Valor Contrato
├── Performance — Margem Bruta
├── Performance — Tempo Venda

💰 Conversions
├── Conversions — Vendas Efetivadas
├── Conversions — Taxa Conversão
├── Conversions — Valor por M²

💳 Financial
├── Financial — Valor Entrada
├── Financial — Valor Financiado
└── Financial — Comissão Total
```

## 🚀 Benefícios

### ✅ **Performance**

- Queries otimizadas com índices específicos
- Views materializadas para consultas complexas
- Dados pré-agregados no grão correto

### ✅ **Simplicidade no Looker Studio**

- Uma fonte de dados por dashboard (abordagem inicial)
- Campos organizados em categorias
- Métricas pré-calculadas

### ✅ **Manutenibilidade**

- Schema star simples e conhecido
- ETL documentado e versionado
- Separação clara entre staging e apresentação

### ✅ **Escalabilidade**

- Fácil adição de novas dimensões
- Suporte a análises históricas (SCD)
- Preparado para crescimento de volume

### ✅ **Evolução Estratégica**

- **Início**: Views separadas para desenvolvimento ágil e performance
- **Futuro**: Consolidação em view única para máxima simplicidade
- **Flexibilidade**: Manter ambas abordagens conforme necessidade
- **Migração gradual**: Dashboards podem migrar quando view única estiver otimizada

## 📅 Roadmap de Implementação

### **Fase 1 - Fundação** (Semana 1)

- [ ] Criar schema das dimensões básicas
- [ ] Popular dim_tempo (5 anos)
- [ ] Criar dim_empresa e dim_cliente

### **Fase 2 - Fatos Core** (Semana 2)

- [ ] Implementar fact_vendas
- [ ] Implementar fact_financeiro
- [ ] Criar ETL inicial

### **Fase 3 - Views e BI** (Semana 3)

- [ ] Criar rpt_vendas_wide
- [ ] Criar rpt_financeiro_wide
- [ ] Conectar com Looker Studio

### **Fase 4 - Expansão** (Semana 4)

- [ ] Implementar fact_contratos (pipeline)
- [ ] Criar rpt_pipeline_wide
- [ ] Automatizar ETL completo

### **Fase 5 - Evolução Futura** (Longo Prazo)

- [ ] Consolidar views separadas em uma única view unificada
- [ ] Criar `rpt_sienge_master_wide` com todos os dados
- [ ] Otimizar performance da view única com particionamento
- [ ] Migrar dashboards para fonte única (se performance adequada)

## 🎯 KPIs Principais Suportados

### 📈 **Comerciais**

- Vendas por período/região/produto
- Performance de vendedores
- Tempo médio de venda
- Taxa de conversão do pipeline
- Mix de produtos e formas de pagamento

### 💰 **Financeiros**

- Inadimplência por aging
- Fluxo de caixa realizado vs projetado
- Performance de cobrança
- Margem bruta por produto/região

### 📊 **Executivos**

- Dashboard consolidado com principais KPIs
- Análise de tendências (YoY, MoM)
- Drill-down por qualquer dimensão
- Alertas automáticos via Looker Studio

---

## 🎯 Estratégia de Evolução: Views Separadas → View Única

### **Abordagem Inicial: Views Especializadas**

```sql
-- Múltiplas views otimizadas por domínio
rpt_vendas_wide      → Dashboard Comercial
rpt_financeiro_wide  → Dashboard Financeiro
rpt_pipeline_wide    → Dashboard Pipeline
rpt_performance_wide → Dashboard Executivo
```

**Vantagens da abordagem inicial:**

- ✅ Desenvolvimento mais rápido e iterativo
- ✅ Performance otimizada por domínio específico
- ✅ Manutenção simplificada (alterações isoladas)
- ✅ Testagem e validação mais fácil

### **Evolução Futura: View Única Consolidada**

```sql
-- Visão unificada para máxima simplicidade
CREATE MATERIALIZED VIEW rpt_sienge_master_wide AS
SELECT
  -- Todas as dimensões de tempo, empresa, cliente, empreendimento
  -- Todas as métricas: vendas + financeiro + pipeline + executivo
  -- Flags de contexto para filtrar domínios específicos
  'vendas' as domain_type,     -- Para filtrar dados de vendas
  'financeiro' as domain_type, -- Para filtrar dados financeiros
  -- etc.
FROM (mega JOIN de todas as tabelas)
```

**Vantagens da view única futura:**

- ✅ **Uma única fonte** para todos os dashboards
- ✅ **Cross-domain analytics** (vendas vs financeiro)
- ✅ **Consistência total** entre dashboards
- ✅ **Manutenção centralizada** de transformações

### **Estratégia de Migração**

1. **Curto prazo**: Desenvolver e validar views separadas
2. **Médio prazo**: Criar view única experimental paralela
3. **Longo prazo**: Migrar dashboards quando performance for adequada
4. **Flexibilidade**: Manter ambas abordagens se necessário

### **Critérios para Migração**

- [ ] View única com performance ≤ 30s para consultas típicas
- [ ] Todos os casos de uso cobertos na view única
- [ ] Estratégia de particionamento implementada (se necessário)
- [ ] Aprovação dos usuários finais dos dashboards

---

**Este plano cria uma base sólida para analytics no Sienge, seguindo best practices de Data Warehouse e otimizado para consumo via Looker Studio, com flexibilidade para evoluir conforme necessidades futuras.**
