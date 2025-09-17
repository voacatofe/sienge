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
CREATE MATERIALIZED VIEW rpt_vendas_wide AS
SELECT
  -- Dimensões Temporais
  dt.full_date as data_contrato,          -- group='Tempo de Venda'
  dt.year as ano,                         -- group='Tempo de Venda'
  dt.quarter_name as trimestre,           -- group='Tempo de Venda'
  dt.month as mes,                        -- group='Mês'
  dt.year_month as ano_mes,               -- group='Mês'
  dt.month_name as nome_mes,              -- group='Mês'

  -- Dimensões Geográficas/Empresariais
  emp.regiao as empresa_regiao,           -- group='Região da Empresa'
  emp.estado as empresa_estado,           -- group='Estado da Empresa'
  emp.cidade as empresa_cidade,           -- group='Cidade da Empresa'
  emp.nome as empresa_nome,               -- group='Nome da Empresa'

  -- Dimensões de Negócio
  empr.nome as empreendimento_nome,       -- group='Nome do Empreendimento'
  empr.tipo as empreendimento_tipo,       -- group='Tipo de Contrato'
  uni.tipo_imovel as unidade_tipo,        -- group='Tipo da Unidade'
  uni.faixa_area as unidade_faixa_area,   -- group='Faixa de Área da Unidade'
  cli.nome_completo as cliente_principal, -- group='Cliente Principal'

  -- Métricas de Performance
  fv.valor_contrato,                      -- group='Performance - Valor Contrato'
  fv.valor_venda_total,                   -- group='Performance - Valor Venda Total'
  fv.valor_por_m2,                        -- group='Performance - Valor por M²'
  fv.margem_bruta_percent,                -- group='Performance - Margem Bruta (%)'
  fv.tempo_venda_dias,                    -- group='Performance - Tempo Venda (dias)'

  -- Métricas de Conversões
  fv.status_contrato,                     -- group='Conversões - Status Contrato'
  CASE WHEN fv.status = 'Ativo' THEN true ELSE false END as contratos_ativos,
                                          -- group='Conversões - Contratos Ativos'
  CASE WHEN fv.status = 'Cancelado' THEN true ELSE false END as contratos_cancelados,
                                          -- group='Conversões - Contratos Cancelados'
  CASE WHEN fv.chaves_entregues IS NOT NULL THEN true ELSE false END as chaves_entregues,
                                          -- group='Chaves Entregues'
  CASE WHEN fv.data_assinatura IS NOT NULL THEN true ELSE false END as contratos_assinados,
                                          -- group='Contratos Assinados'

  -- Métricas Financeiras
  fv.desconto_percent,                    -- group='Desconto (%)'
  fv.valor_desconto,                      -- group='Desconto (%)'
  fv.forma_pagamento,                     -- group='Forma de Pagamento'
  fv.taxa_juros_percent,                  -- group='Taxa de Juros (%)'
  fv.total_parcelas,                      -- group='Total de Parcelas'
  fv.saldo_devedor,                       -- group='Saldo Devedor'

  -- Métricas de Segmentação
  fv.faixa_valor,                         -- group='Faixa de Valor'
  fv.canal_venda                          -- group='Canal de Venda'

FROM fact_vendas fv
JOIN dim_tempo dt ON dt.date_key = fv.data_contrato_key
JOIN dim_empresa emp ON emp.empresa_key = fv.empresa_key
JOIN dim_cliente cli ON cli.cliente_key = fv.cliente_key
JOIN dim_empreendimento empr ON empr.empreendimento_key = fv.empreendimento_key
JOIN dim_unidade uni ON uni.unidade_key = fv.unidade_key
-- Índices otimizados para Looker Studio
WHERE dt.full_date >= CURRENT_DATE - INTERVAL '12 months';

-- Criar índices para performance
CREATE INDEX idx_rpt_vendas_wide_data ON rpt_vendas_wide (data_contrato);
CREATE INDEX idx_rpt_vendas_wide_empresa ON rpt_vendas_wide (empresa_nome);
```

### 💰 **rpt_financeiro_wide** (Dashboard Financeiro)

```sql
CREATE MATERIALIZED VIEW rpt_financeiro_wide AS
SELECT
  -- Dimensões Temporais (mesmo padrão)
  dt.full_date as data_vencimento,        -- group='Tempo de Venda'
  dt.year as ano,                         -- group='Tempo de Venda'
  dt.quarter_name as trimestre,           -- group='Tempo de Venda'
  dt.month as mes,                        -- group='Mês'
  dt.year_month as ano_mes,               -- group='Mês'
  dt.month_name as nome_mes,              -- group='Mês'

  -- Dimensões Empresariais (mesmo padrão)
  emp.regiao as empresa_regiao,           -- group='Região da Empresa'
  emp.estado as empresa_estado,           -- group='Estado da Empresa'
  emp.cidade as empresa_cidade,           -- group='Cidade da Empresa'
  emp.nome as empresa_nome,               -- group='Nome da Empresa'
  empr.nome as empreendimento_nome,       -- group='Nome do Empreendimento'
  cli.nome_completo as cliente_principal, -- group='Cliente Principal'

  -- Métricas de Recebíveis
  ff.valor_original,                      -- group='Recebíveis - Valor Original'
  ff.valor_atualizado,                    -- group='Recebíveis - Valor Atualizado'
  ff.valor_pago,                          -- group='Recebíveis - Valor Pago'
  ff.valor_saldo,                         -- group='Recebíveis - Saldo Devedor'

  -- Métricas de Performance Financeira
  ff.taxa_inadimplencia,                  -- group='Performance - Taxa Inadimplência'
  ff.dias_atraso,                         -- group='Performance - Dias Atraso'
  ff.eficiencia_cobranca_percent,         -- group='Performance - Eficiência Cobrança (%)'

  -- Métricas de Aging
  CASE WHEN ff.dias_atraso BETWEEN 0 AND 30 THEN ff.valor_saldo ELSE 0 END as aging_0_30,
                                          -- group='Aging - 0-30 dias'
  CASE WHEN ff.dias_atraso BETWEEN 31 AND 60 THEN ff.valor_saldo ELSE 0 END as aging_31_60,
                                          -- group='Aging - 31-60 dias'
  CASE WHEN ff.dias_atraso BETWEEN 61 AND 90 THEN ff.valor_saldo ELSE 0 END as aging_61_90,
                                          -- group='Aging - 61-90 dias'
  CASE WHEN ff.dias_atraso > 90 THEN ff.valor_saldo ELSE 0 END as aging_90_plus,
                                          -- group='Aging - 90+ dias'

  -- Status e Conversões Financeiras
  ff.status_titulo,                       -- group='Conversões - Status Título'
  CASE WHEN ff.is_pago = true THEN true ELSE false END as titulos_pagos,
                                          -- group='Conversões - Títulos Pagos'
  CASE WHEN ff.is_vencido = true THEN true ELSE false END as titulos_vencidos,
                                          -- group='Conversões - Títulos Vencidos'
  CASE WHEN ff.is_negociado = true THEN true ELSE false END as titulos_negociados,
                                          -- group='Conversões - Títulos Negociados'

  -- Forma de Pagamento (consistência com vendas)
  ff.forma_pagamento,                     -- group='Forma de Pagamento'
  ff.tipo_portador                        -- group='Tipo Portador'

FROM fact_financeiro ff
JOIN dim_tempo dt ON dt.date_key = ff.data_vencimento_key
JOIN dim_empresa emp ON emp.empresa_key = ff.empresa_key
JOIN dim_cliente cli ON cli.cliente_key = ff.cliente_key
JOIN dim_empreendimento empr ON empr.empreendimento_key = ff.empreendimento_key
WHERE dt.full_date >= CURRENT_DATE - INTERVAL '24 months';

-- Índices otimizados
CREATE INDEX idx_rpt_financeiro_wide_data ON rpt_financeiro_wide (data_vencimento);
CREATE INDEX idx_rpt_financeiro_wide_status ON rpt_financeiro_wide (status_titulo);
```

### 📊 **rpt_pipeline_wide** (Funil de Vendas)

```sql
CREATE MATERIALIZED VIEW rpt_pipeline_wide AS
SELECT
  -- Dimensões Temporais (padrão consistente)
  dt.full_date as data_entrada_pipeline,  -- group='Tempo de Venda'
  dt.year as ano,                         -- group='Tempo de Venda'
  dt.quarter_name as trimestre,           -- group='Tempo de Venda'
  dt.month as mes,                        -- group='Mês'
  dt.year_month as ano_mes,               -- group='Mês'
  dt.month_name as nome_mes,              -- group='Mês'

  -- Dimensões Empresariais (padrão consistente)
  emp.regiao as empresa_regiao,           -- group='Região da Empresa'
  emp.estado as empresa_estado,           -- group='Estado da Empresa'
  emp.cidade as empresa_cidade,           -- group='Cidade da Empresa'
  emp.nome as empresa_nome,               -- group='Nome da Empresa'
  empr.nome as empreendimento_nome,       -- group='Nome do Empreendimento'
  uni.tipo_imovel as unidade_tipo,        -- group='Tipo da Unidade'
  cli.nome_completo as cliente_principal, -- group='Cliente Principal'

  -- Métricas de Pipeline
  fc.valor_contrato,                      -- group='Pipeline - Valor Total'
  fc.valor_ponderado,                     -- group='Pipeline - Valor Ponderado'
  fc.probabilidade_percent,               -- group='Pipeline - Probabilidade (%)'

  -- Status e Etapas do Pipeline
  fc.etapa_pipeline,                      -- group='Pipeline - Etapa Atual'
  fc.status_contrato,                     -- group='Conversões - Status Pipeline'

  -- Métricas de Performance Pipeline
  fc.dias_negociacao,                     -- group='Performance - Dias Negociação'
  fc.dias_aprovacao,                      -- group='Performance - Dias Aprovação'
  fc.tempo_medio_etapa,                   -- group='Performance - Tempo Médio Etapa'

  -- Conversões do Pipeline
  CASE WHEN fc.status = 'Proposta' THEN true ELSE false END as em_proposta,
                                          -- group='Conversões - Em Proposta'
  CASE WHEN fc.status = 'Negociacao' THEN true ELSE false END as em_negociacao,
                                          -- group='Conversões - Em Negociação'
  CASE WHEN fc.status = 'Aprovacao' THEN true ELSE false END as em_aprovacao,
                                          -- group='Conversões - Em Aprovação'
  CASE WHEN fc.is_assinado = true THEN true ELSE false END as contratos_assinados,
                                          -- group='Contratos Assinados'
  CASE WHEN fc.is_cancelado = true THEN true ELSE false END as contratos_cancelados,
                                          -- group='Conversões - Contratos Cancelados'

  -- Análise de Motivos
  fc.motivo_cancelamento,                 -- group='Pipeline - Motivo Cancelamento'
  fc.origem_lead,                         -- group='Pipeline - Origem Lead'

  -- Métricas Financeiras Pipeline (consistência)
  fc.forma_pagamento_prevista,            -- group='Forma de Pagamento'
  fc.desconto_percent,                    -- group='Desconto (%)'

  -- Vendedor e Canal
  vend.nome as vendedor,                  -- group='Pipeline - Vendedor'
  fc.canal_venda                          -- group='Canal de Venda'

FROM fact_contratos fc
JOIN dim_tempo dt ON dt.date_key = fc.data_entrada_key
JOIN dim_empresa emp ON emp.empresa_key = fc.empresa_key
JOIN dim_cliente cli ON cli.cliente_key = fc.cliente_key
JOIN dim_empreendimento empr ON empr.empreendimento_key = fc.empreendimento_key
JOIN dim_unidade uni ON uni.unidade_key = fc.unidade_key
LEFT JOIN dim_vendedor vend ON vend.vendedor_key = fc.vendedor_key
WHERE dt.full_date >= CURRENT_DATE - INTERVAL '18 months'
  AND fc.status NOT IN ('Arquivado', 'Excluído');

-- Índices para análise de funil
CREATE INDEX idx_rpt_pipeline_wide_etapa ON rpt_pipeline_wide (etapa_pipeline);
CREATE INDEX idx_rpt_pipeline_wide_vendedor ON rpt_pipeline_wide (vendedor);
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

## 🎯 Semantic Groups

Campos organizados em categorias no Looker Studio:

- **Performance**: Valor Contrato, Margem Bruta, Tempo Venda
- **Conversions**: Status, Contratos Ativos/Cancelados, Chaves Entregues
- **Financial**: Desconto, Forma Pagamento, Saldo Devedor
- **Time**: Data, Ano, Trimestre, Mês
- **Geography**: Empresa (Região, Estado, Cidade)
- **Business**: Empreendimento, Unidade, Cliente


## 🎨 Conexão com Looker Studio

**Community Connector** - Um clique para conectar:

```
https://lookerstudio.google.com/datasources/create?connectorId=SEU_DEPLOYMENT_ID
```

**API REST:** `/api/datawarehouse/vendas`
- ✅ Automático - últimos 12 meses
- ✅ Cache de 1 hora
- ✅ Semantic Groups organizados
- ✅ Sem autenticação

## 🚀 Benefícios

### ✅ **Performance**

- API REST otimizada com cache de 1 hora
- Dados pré-processados no Data Warehouse
- Views materializadas como base dos dados
- Response time otimizado para dashboards

### ✅ **Simplicidade no Looker Studio**

- **Community Connector** - um clique para conectar
- Sem configuração manual de credenciais ou parâmetros
- Campos organizados automaticamente em grupos semânticos
- Métricas pré-calculadas disponíveis instantaneamente

### ✅ **Manutenibilidade**

- **API REST centralizada** - uma fonte para todas as atualizações
- Schema star simples no backend, API simplificada no frontend
- ETL documentado e versionado
- **Community Connector atualizável** via Google Apps Script
- Separação clara entre Data Warehouse e camada de apresentação

### ✅ **Escalabilidade**

- **Novos endpoints API** facilmente adicionáveis
- **Community Connector extensível** para novos dados
- Suporte a análises históricas (SCD) no backend
- **Cache strategy** escalável para crescimento de volume
- **Multiple dashboards** usando a mesma API base

### ✅ **Evolução Estratégica baseada em API**

- **Atual**: API única `/api/datawarehouse/vendas` para dashboard comercial
- **Próximo**: APIs especializadas `/financeiro`, `/pipeline`, `/executivo`
- **Futuro**: API unificada `/master` consolidando todos os domínios
- **Flexibilidade**: Community Connector pode consumir qualquer endpoint
- **Migração suave**: Mudança apenas na URL do connector

## 📅 Roadmap de Implementação

### **Fase 1 - Fundação** (Semana 1)

- [ ] Criar schema das dimensões básicas
- [ ] Popular dim_tempo (5 anos)
- [ ] Criar dim_empresa e dim_cliente

### **Fase 2 - Fatos Core** (Semana 2)

- [ ] Implementar fact_vendas
- [ ] Implementar fact_financeiro
- [ ] Criar ETL inicial

### **Fase 3 - Community Connector ✅**
- [x] API `/api/datawarehouse/vendas`
- [x] Community Connector para Looker Studio
- [x] Semantic Groups organizados

### **Fase 4 - Próximas APIs**
- [ ] `/api/datawarehouse/financeiro`
- [ ] `/api/datawarehouse/pipeline`
- [ ] `/api/datawarehouse/executivo`

### **Fase 5 - API Unificada**
- [ ] `/api/datawarehouse/master`
- [ ] Performance otimizada

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

## 🎯 Estratégia de Evolução: APIs Especializadas → API Unificada

### **Abordagem Atual: APIs Especializadas**

```typescript
// Múltiplas APIs otimizadas por domínio via Community Connector
/api/datawarehouse/vendas      → Dashboard Comercial    ✅ IMPLEMENTADO
/api/datawarehouse/financeiro  → Dashboard Financeiro   🔄 PRÓXIMO
/api/datawarehouse/pipeline    → Dashboard Pipeline     🔄 PRÓXIMO
/api/datawarehouse/executivo   → Dashboard Executivo    🔄 PRÓXIMO
```

**Vantagens da abordagem por APIs:**

- ✅ **Desenvolvimento iterativo** - uma API por vez
- ✅ **Performance otimizada** - cada endpoint serve dados específicos
- ✅ **Community Connector simples** - um endpoint por dashboard
- ✅ **Manutenção isolada** - mudanças não afetam outros domínios
- ✅ **Testagem facilitada** - validação independente

### **Evolução Futura: API Unificada**

```typescript
// API única consolidada para máxima flexibilidade
/api/datawarehouse/master?domains=vendas,financeiro&format=unified
```

**Vantagens da API única futura:**

- ✅ **Cross-domain analytics** via parâmetros
- ✅ **Uma fonte** para dashboards complexos
- ✅ **Consistência total** entre domínios
- ✅ **Community Connector universal** - um connector, múltiplos dashboards

### **Estratégia de Migração via API**

1. **Atual**: API Vendas validada e em produção
2. **Próximo**: APIs especializadas (Financeiro, Pipeline, Executivo)
3. **Futuro**: API Master consolidando todos os endpoints
4. **Flexibilidade**: Community Connector pode alternar URLs conforme necessidade

### **Critérios para Migração de API**

- [ ] **Performance ≤ 3s** para consultas típicas da API Master
- [ ] **Todos os casos de uso** cobertos na API unificada
- [ ] **Cache strategy avançada** implementada
- [ ] **Validação pelos usuários** dos dashboards migrados

---

**Este plano cria uma base sólida para analytics no Sienge, seguindo best practices de Data Warehouse e otimizado para consumo via Looker Studio, com flexibilidade para evoluir conforme necessidades futuras.**
