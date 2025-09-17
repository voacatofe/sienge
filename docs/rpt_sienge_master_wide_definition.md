# 📊 View Única Master - Especificação Completa

## 🎯 Objetivo

Criar uma **view materializada única** `rpt_sienge_master_wide` que unifique todos os domínios de dados (Contratos, Financeiro, Movimentos) em uma fonte definitiva para análises, servindo diretamente a API REST e o Looker Studio.

## 🏗️ Arquitetura da View Única

### **Conceito Central: União de Domínios**

```sql
CREATE MATERIALIZED VIEW rpt_sienge_master_wide AS
SELECT * FROM (
  -- DOMÍNIO: CONTRATOS DE VENDA
  SELECT 'contratos' as domain_type, campos_padronizados... FROM contratos_venda

  UNION ALL

  -- DOMÍNIO: TÍTULOS A RECEBER
  SELECT 'financeiro' as domain_type, campos_padronizados... FROM titulos_receber

  UNION ALL

  -- DOMÍNIO: MOVIMENTOS BANCÁRIOS
  SELECT 'movimentos' as domain_type, campos_padronizados... FROM movimentos_bancarios
) dados_unificados;
```

### **Estratégia de Unificação**

1. **Grão Flexível**: Cada linha representa uma transação de qualquer domínio
2. **Campos Padronizados**: Mesma estrutura para todos os domínios
3. **Domain Type**: Flag identificando origem dos dados
4. **Grupos Semânticos**: Organização consistente independente do domínio

## 📋 Grupos Semânticos Definidos

### **1. Data (Universal) - `group='Data'`**
| Campo | Descrição | Tipo | Fonte |
|-------|-----------|------|-------|
| `data_principal` | Data principal da transação | DATE | cv.contractDate, tr.dataVencimento, mb.bankMovementDate |
| `ano` | Ano extraído | INTEGER | EXTRACT(YEAR FROM data_principal) |
| `trimestre` | Trimestre | INTEGER | EXTRACT(QUARTER FROM data_principal) |
| `mes` | Mês | INTEGER | EXTRACT(MONTH FROM data_principal) |
| `ano_mes` | Ano-Mês formatado | STRING | TO_CHAR(data_principal, 'YYYY-MM') |
| `nome_mes` | Nome do mês | STRING | TO_CHAR(data_principal, 'TMMonth') |

### **2. Empresas (Master) - `group='Empresas'`**
| Campo | Descrição | Tipo | Fonte |
|-------|-----------|------|-------|
| `empresa_nome` | Nome da empresa | STRING | emp.nomeEmpresa |
| `empresa_cidade` | Cidade da empresa | STRING | emp.cidade |
| `empresa_estado` | Estado da empresa | STRING | emp.estado |
| `empresa_regiao` | Região calculada | STRING | CASE WHEN estado... |
| `empresa_cnpj` | CNPJ da empresa | STRING | emp.cnpj |

### **3. Contratos (Domínio) - `group='Contratos'`**
| Campo | Descrição | Tipo | Fonte |
|-------|-----------|------|-------|
| `valor_contrato` | Valor do contrato | DECIMAL | cv.value |
| `status_contrato` | Status atual | STRING | cv.situation |
| `tipo_contrato` | Tipo do contrato | STRING | cv.contractType |
| `numero_contrato` | Número do contrato | STRING | cv.number |
| `contratos_ativos` | Flag de ativo | BOOLEAN | CASE WHEN status = 'ativo' |
| `chaves_entregues` | Flag chaves entregues | BOOLEAN | cv.keysDeliveredAt IS NOT NULL |
| `contratos_assinados` | Flag assinado | BOOLEAN | cv.contractDate IS NOT NULL |

### **4. Financeiro (Domínio + Aging) - `group='Financeiro'`**
| Campo | Descrição | Tipo | Fonte |
|-------|-----------|------|-------|
| `valor_original` | Valor original do título | DECIMAL | tr.valorOriginal |
| `valor_pago` | Valor pago | DECIMAL | tr.valorPago |
| `saldo_devedor` | Saldo pendente | DECIMAL | tr.valorOriginal - tr.valorPago |
| `taxa_inadimplencia` | Taxa de inadimplência | DECIMAL | Calculado por empresa |
| `dias_atraso` | Dias em atraso | INTEGER | EXTRACT(DAY FROM NOW() - tr.dataVencimento) |
| `forma_pagamento` | Forma de pagamento | STRING | cv.paymentMethod, tr... |
| `taxa_juros` | Taxa de juros | DECIMAL | cv.interestPercentage |
| `aging_0_30` | Valor 0-30 dias | DECIMAL | CASE WHEN dias_atraso BETWEEN 0 AND 30 |
| `aging_31_60` | Valor 31-60 dias | DECIMAL | CASE WHEN dias_atraso BETWEEN 31 AND 60 |
| `aging_61_90` | Valor 61-90 dias | DECIMAL | CASE WHEN dias_atraso BETWEEN 61 AND 90 |
| `aging_90_plus` | Valor 90+ dias | DECIMAL | CASE WHEN dias_atraso > 90 |

### **5. Performance (Transversal) - `group='Performance'`**
| Campo | Descrição | Tipo | Fonte |
|-------|-----------|------|-------|
| `margem_bruta` | Margem bruta % | DECIMAL | (cv.totalSellingValue - cv.value) / cv.totalSellingValue * 100 |
| `tempo_venda` | Tempo de venda em dias | INTEGER | EXTRACT(DAY FROM cv.contractDate - empr.dataCadastro) |
| `valor_por_m2` | Valor por metro quadrado | DECIMAL | cv.value / uni.areaPrivativa |
| `eficiencia_cobranca` | Eficiência de cobrança % | DECIMAL | Calculado por empresa |

### **6. Clientes (Domínio) - `group='Clientes'`**
| Campo | Descrição | Tipo | Fonte |
|-------|-----------|------|-------|
| `cliente_nome` | Nome do cliente | STRING | cli.nomeCompleto |
| `cliente_principal` | Cliente principal do contrato | STRING | cv.salesContractCustomers->0->>'customerName' |
| `cliente_tipo` | Tipo de cliente | STRING | cli.personType |

### **7. Empreendimentos (Domínio) - `group='Empreendimentos'`**
| Campo | Descrição | Tipo | Fonte |
|-------|-----------|------|-------|
| `empreendimento_nome` | Nome do empreendimento | STRING | empr.nome |
| `empreendimento_tipo` | Tipo do empreendimento | STRING | empr.tipo |
| `unidade_tipo` | Tipo da unidade | STRING | uni.tipoImovel |
| `unidade_area` | Área da unidade | DECIMAL | uni.areaPrivativa |
| `faixa_area` | Faixa de área | STRING | CASE WHEN area < 50 THEN 'Até 50m²' |

### **8. Conversões (Transversal) - `group='Conversoes'`**
| Campo | Descrição | Tipo | Fonte |
|-------|-----------|------|-------|
| `contratos_cancelados` | Flag cancelado | BOOLEAN | CASE WHEN status = 'cancelado' |
| `titulos_pagos` | Flag título pago | BOOLEAN | tr.valorPago > 0 |
| `titulos_vencidos` | Flag título vencido | BOOLEAN | tr.dataVencimento < NOW() AND tr.valorPago = 0 |

## 🔧 Campos Técnicos

### **Identificação e Controle**
| Campo | Descrição | Tipo | Objetivo |
|-------|-----------|------|----------|
| `row_id` | ID único da linha | UUID | Identificação única |
| `domain_type` | Tipo de domínio | STRING | 'contratos', 'financeiro', 'movimentos' |
| `source_table` | Tabela de origem | STRING | Auditoria e debugging |
| `source_id` | ID original | INTEGER | Referência ao registro original |

## 🎯 Estratégia de Dados Faltantes

### **Para Registros de Contratos:**
- `valor_original`, `valor_pago`, `aging_*` → NULL
- `titulo_*` flags → FALSE

### **Para Registros Financeiros:**
- `valor_contrato`, `tipo_contrato` → NULL (ou buscar via relacionamento)
- `empreendimento_*`, `unidade_*` → NULL

### **Para Movimentos Bancários:**
- Maioria dos campos → NULL
- Apenas `Data`, `Empresas`, `Financeiro` (valor movimento) preenchidos

## 📊 Mapeamento de Dados por Domínio

### **CONTRATOS (domain_type = 'contratos')**
```sql
SELECT
  'contratos' as domain_type,
  cv.id as source_id,
  'contratos_venda' as source_table,

  -- DATA
  cv.contractDate::date as data_principal,
  EXTRACT(YEAR FROM cv.contractDate) as ano,

  -- EMPRESAS
  COALESCE(emp.nomeEmpresa, cv.companyName) as empresa_nome,
  emp.cidade as empresa_cidade,

  -- CONTRATOS
  cv.value as valor_contrato,
  cv.situation as status_contrato,

  -- FINANCEIRO (derivado do contrato)
  cv.remainingBalance as saldo_devedor,
  cv.paymentMethod as forma_pagamento,

  -- PERFORMANCE
  CASE WHEN cv.totalSellingValue > 0 AND cv.value > 0
    THEN ((cv.totalSellingValue - cv.value) / cv.totalSellingValue * 100)
    END as margem_bruta,

  -- CLIENTES
  cv.salesContractCustomers->0->>'customerName' as cliente_principal,

  -- EMPREENDIMENTOS
  empr.nome as empreendimento_nome,
  uni.tipoImovel as unidade_tipo,

  -- Campos nulos para este domínio
  NULL as valor_original,
  NULL as valor_pago,
  NULL::integer as dias_atraso,
  NULL as aging_0_30

FROM contratos_venda cv
LEFT JOIN empresas emp ON emp.idEmpresa = cv.companyId
LEFT JOIN empreendimentos empr ON empr.id = cv.enterpriseId
LEFT JOIN unidades uni ON uni.idContrato = cv.id
WHERE cv.contractDate IS NOT NULL
```

### **FINANCEIRO (domain_type = 'financeiro')**
```sql
SELECT
  'financeiro' as domain_type,
  tr.idTituloReceber as source_id,
  'titulos_receber' as source_table,

  -- DATA
  tr.dataVencimento::date as data_principal,
  EXTRACT(YEAR FROM tr.dataVencimento) as ano,

  -- EMPRESAS
  emp.nomeEmpresa as empresa_nome,
  emp.cidade as empresa_cidade,

  -- FINANCEIRO
  tr.valorOriginal as valor_original,
  tr.valorPago as valor_pago,
  (tr.valorOriginal - COALESCE(tr.valorPago, 0)) as saldo_devedor,
  EXTRACT(DAY FROM NOW() - tr.dataVencimento) as dias_atraso,

  -- AGING
  CASE WHEN EXTRACT(DAY FROM NOW() - tr.dataVencimento) BETWEEN 0 AND 30
    THEN (tr.valorOriginal - COALESCE(tr.valorPago, 0)) ELSE 0 END as aging_0_30,

  -- CLIENTES
  cli.nomeCompleto as cliente_nome,

  -- Campos nulos para este domínio
  NULL as valor_contrato,
  NULL as status_contrato,
  NULL as empreendimento_nome,
  NULL as unidade_tipo

FROM titulos_receber tr
LEFT JOIN empresas emp ON emp.idEmpresa = tr.idEmpresa
LEFT JOIN clientes cli ON cli.idCliente = tr.idCliente
WHERE tr.dataVencimento IS NOT NULL
```

### **MOVIMENTOS (domain_type = 'movimentos')**
```sql
SELECT
  'movimentos' as domain_type,
  mb.bankMovementId as source_id,
  'movimentos_bancarios' as source_table,

  -- DATA
  mb.bankMovementDate::date as data_principal,
  EXTRACT(YEAR FROM mb.bankMovementDate) as ano,

  -- EMPRESAS
  mb.companyName as empresa_nome,

  -- FINANCEIRO (movimento como valor)
  mb.bankMovementAmount as valor_original,
  CASE WHEN mb.bankMovementOperationType = 'C'
    THEN mb.bankMovementAmount ELSE 0 END as valor_pago,

  -- Maioria dos campos nulos
  NULL as valor_contrato,
  NULL as status_contrato,
  NULL as cliente_nome,
  NULL as empreendimento_nome

FROM movimentos_bancarios mb
WHERE mb.bankMovementDate IS NOT NULL
```

## 🚀 Índices de Performance

```sql
-- Índices principais para queries da API
CREATE INDEX idx_master_wide_data_principal ON rpt_sienge_master_wide (data_principal);
CREATE INDEX idx_master_wide_domain_type ON rpt_sienge_master_wide (domain_type);
CREATE INDEX idx_master_wide_empresa ON rpt_sienge_master_wide (empresa_nome);
CREATE INDEX idx_master_wide_data_domain ON rpt_sienge_master_wide (data_principal, domain_type);

-- Índices para filtros específicos
CREATE INDEX idx_master_wide_ano_mes ON rpt_sienge_master_wide (ano, mes);
CREATE INDEX idx_master_wide_status ON rpt_sienge_master_wide (status_contrato) WHERE status_contrato IS NOT NULL;
CREATE INDEX idx_master_wide_aging ON rpt_sienge_master_wide (dias_atraso) WHERE dias_atraso IS NOT NULL;

-- Índice composto para API principal (últimos 12 meses)
CREATE INDEX idx_master_wide_api_query ON rpt_sienge_master_wide (data_principal, domain_type)
WHERE data_principal >= CURRENT_DATE - INTERVAL '12 months';
```

## 📈 Benefícios da Arquitetura

### **✅ Unificação Total**
- Uma única fonte para todos os dados
- Eliminação de JOINs complexos na API
- Consistência garantida entre domínios

### **✅ Semantic Groups Limpos**
- 8 grupos bem definidos
- Aging integrado ao Financeiro
- Organização intuitiva no Looker Studio

### **✅ Performance Otimizada**
- Views materializadas pré-processadas
- Índices específicos por uso
- Cache na API de 1 hora

### **✅ Flexibilidade de Análise**
- Análises cross-domain (contratos vs financeiro)
- Filtros por domain_type para análises específicas
- Drill-down completo em qualquer dimensão

### **✅ Manutenibilidade**
- Uma única view para manter
- Padrão replicável para novos domínios
- Schema evolutivo sem quebrar compatibilidade

## 🔄 Estratégia de Refresh

```sql
-- Refresh diário às 6h (via cron)
REFRESH MATERIALIZED VIEW CONCURRENTLY rpt_sienge_master_wide;

-- Monitoramento do refresh
SELECT
  schemaname,
  matviewname,
  hasindexes,
  ispopulated,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||matviewname)) as size
FROM pg_matviews
WHERE matviewname = 'rpt_sienge_master_wide';
```

## 🎯 Validação de Dados

```sql
-- Verificar distribuição por domínio
SELECT
  domain_type,
  COUNT(*) as total_records,
  MIN(data_principal) as data_inicio,
  MAX(data_principal) as data_fim,
  COUNT(DISTINCT empresa_nome) as empresas_distintas
FROM rpt_sienge_master_wide
GROUP BY domain_type;

-- Verificar consistência de grupos semânticos
SELECT
  COUNT(*) as total_com_data,
  COUNT(empresa_nome) as total_com_empresa,
  COUNT(valor_contrato) as total_contratos,
  COUNT(valor_original) as total_financeiro
FROM rpt_sienge_master_wide
WHERE data_principal >= CURRENT_DATE - INTERVAL '12 months';
```

---

**Esta especificação define uma view única robusta que serve como fonte definitiva para todas as análises do Sienge, organizando dados de múltiplos domínios em grupos semânticos consistentes para uma experiência otimizada no Looker Studio.**