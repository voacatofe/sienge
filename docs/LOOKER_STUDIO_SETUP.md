# 📊 Configuração Completa - Looker Studio

## 🎯 Objetivo

Configurar conexão entre PostgreSQL e Looker Studio para criar dashboards profissionais com dados organizados por categorias.

---

## 🔗 Passo 1: Configurar Conexão PostgreSQL

### 1.1 Criar usuário específico para BI (Recomendado)

```sql
-- Conectar como superuser no PostgreSQL
-- Criar usuário dedicado para Looker Studio (mais seguro)
CREATE USER looker_studio WITH PASSWORD 'senha_segura_bi_2024';

-- Dar permissões apenas nas views necessárias
GRANT CONNECT ON DATABASE sienge_data TO looker_studio;
GRANT USAGE ON SCHEMA public TO looker_studio;
GRANT SELECT ON rpt_vendas_wide TO looker_studio;

-- Para futuras views
GRANT SELECT ON ALL TABLES IN SCHEMA public TO looker_studio;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO looker_studio;
```

### 1.2 Configurar acesso externo (se necessário)

```bash
# No arquivo postgresql.conf
listen_addresses = '*'

# No arquivo pg_hba.conf (adicionar linha)
host    sienge_data    looker_studio    0.0.0.0/0    md5
```

---

## 🌐 Passo 2: Configurar Looker Studio

### 2.1 Acessar e criar fonte de dados

1. Ir para [lookerstudio.google.com](https://lookerstudio.google.com)
2. Clicar em **"Criar"** → **"Fonte de dados"**
3. Buscar e selecionar **"PostgreSQL"**

### 2.2 Parâmetros de conexão

```
┌─────────────────────────────────────────────────────┐
│ 🔧 CONFIGURAÇÕES DE CONEXÃO                        │
├─────────────────────────────────────────────────────┤
│ Host:              SEU_HOST_EASYPANEL.com          │
│ Porta:             5434                             │
│ Banco de dados:    sienge_data                      │
│ Nome de usuário:   looker_studio                    │
│ Senha:             senha_segura_bi_2024             │
│ SSL:               Desabilitado (ajustar conforme) │
└─────────────────────────────────────────────────────┘
```

### 2.3 Query personalizada otimizada

```sql
SELECT
  -- Dimensões de tempo
  data_contrato,
  ano,
  trimestre,
  mes,
  ano_mes,
  nome_mes,

  -- Dimensões geográficas
  empresa_regiao,
  empresa_estado,
  empresa_nome,

  -- Dimensões de negócio
  empreendimento_nome,
  empreendimento_tipo,
  unidade_tipo,
  unidade_faixa_area,

  -- Dimensões de segmentação
  "Segmentation — Faixa Valor",
  "Segmentation — Canal Venda",
  "Segmentation — Tipo Contrato",

  -- Métricas Performance
  "Performance — Valor Contrato",
  "Performance — Valor Venda Total",
  "Performance — Valor por M²",
  "Performance — Margem Bruta (%)",
  "Performance — Tempo Venda (dias)",

  -- Métricas Conversions
  "Conversions — Status Contrato",
  "Conversions — Contratos Ativos",
  "Conversions — Contratos Cancelados",
  "Conversions — Chaves Entregues",
  "Conversions — Contratos Assinados",

  -- Métricas Financial
  "Financial — Desconto (%)",
  "Financial — Valor Desconto",
  "Financial — Forma Pagamento",
  "Financial — Taxa Juros (%)",
  "Financial — Total Parcelas",
  "Financial — Saldo Devedor",

  -- IDs para drill-through
  contrato_id,
  empresa_id,
  empreendimento_id

FROM rpt_vendas_wide
WHERE data_contrato BETWEEN @DS_START_DATE AND @DS_END_DATE
ORDER BY data_contrato DESC
```

---

## ⚙️ Passo 3: Configurar Tipos de Campos

### 3.1 Configurações automáticas

O Looker Studio detectará automaticamente:

**📅 Campos de Data/Tempo:**

- `data_contrato` → Date (Dimension)
- `ano_mes` → Text (Dimension) - para gráficos temporais

**📊 Métricas (Aggregatable):**

- `Performance — Valor Contrato` → Number (Metric, Sum)
- `Performance — Margem Bruta (%)` → Number (Metric, Average)
- `Conversions — Contratos Ativos` → Number (Metric, Sum)

**🏷️ Dimensões (Non-aggregatable):**

- `empresa_regiao` → Text (Dimension)
- `Segmentation — Faixa Valor` → Text (Dimension)

### 3.2 Ajustes manuais necessários

```
Campo: "Performance — Valor Contrato"
├── Tipo: Number
├── Agregação: Sum
├── Formato: Currency (R$)
└── Decimals: 0

Campo: "Performance — Margem Bruta (%)"
├── Tipo: Number
├── Agregação: Average
├── Formato: Percent
└── Decimals: 1

Campo: "Performance — Valor por M²"
├── Tipo: Number
├── Agregação: Average
├── Formato: Currency (R$)
└── Decimals: 0

Campo: ano_mes
├── Tipo: Text
├── Sort: Chronological
└── Usado para: Eixo temporal em gráficos
```

---

## 📈 Passo 4: Criar Dashboard Comercial

### 4.1 Layout recomendado

```
┌─────────────────────────────────────────────────────┐
│ 📊 DASHBOARD COMERCIAL - SIENGE                    │
├─────────────────────────────────────────────────────┤
│ 🎛️ Filtros: [Período] [Região] [Empreendimento]    │
├─────────────────────────────────────────────────────┤
│ 📈 Vendas por Mês    │ 🥧 Vendas por Região        │
│                      │                             │
├──────────────────────┼─────────────────────────────┤
│ 📊 Status Contratos  │ 💰 Valor Médio por Faixa   │
│                      │                             │
├─────────────────────────────────────────────────────┤
│ 📋 TABELA DETALHADA - TOP EMPREENDIMENTOS          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.2 Gráficos específicos

**📈 Gráfico 1: Vendas por Mês (Time Series)**

```
Tipo: Gráfico de linha
Dimensão: ano_mes
Métrica 1: Performance — Valor Contrato (Sum)
Métrica 2: Conversions — Contratos Ativos (Sum) [Eixo secundário]
Filtros: Aplicar filtro de período
```

**🥧 Gráfico 2: Distribuição por Região (Pie Chart)**

```
Tipo: Gráfico de pizza
Dimensão: empresa_regiao
Métrica: Performance — Valor Contrato (Sum)
Mostrar: Valores e percentuais
```

**📊 Gráfico 3: Status dos Contratos (Bar Chart)**

```
Tipo: Gráfico de barras
Dimensão: Conversions — Status Contrato
Métrica: Conversions — Contratos Ativos (Count)
Ordenação: Por valor decrescente
```

**💰 Gráfico 4: Valor Médio por Faixa (Column Chart)**

```
Tipo: Gráfico de colunas
Dimensão: Segmentation — Faixa Valor
Métrica: Performance — Valor Contrato (Average)
Formato: Moeda (R$)
```

**📋 Tabela 5: Top Empreendimentos**

```
Tipo: Tabela
Dimensões:
  - empreendimento_nome
  - Segmentation — Faixa Valor
  - empresa_regiao
Métricas:
  - Performance — Valor Contrato (Sum)
  - Performance — Valor por M² (Average)
  - Conversions — Contratos Ativos (Count)
Ordenação: Por Performance — Valor Contrato (DESC)
Linhas: Top 10
```

### 4.3 Filtros de controle

```
🎛️ Controle 1: Período
├── Tipo: Date range control
├── Campo: data_contrato
└── Padrão: Últimos 12 meses

🎛️ Controle 2: Região
├── Tipo: Drop-down list
├── Campo: empresa_regiao
└── Permitir: Múltipla seleção

🎛️ Controle 3: Empreendimento
├── Tipo: Drop-down list
├── Campo: empreendimento_nome
└── Permitir: Múltipla seleção

🎛️ Controle 4: Status
├── Tipo: Drop-down list
├── Campo: Conversions — Status Contrato
└── Permitir: Múltipla seleção
```

---

## 🎨 Passo 5: Personalização e Estilo

### 5.1 Tema e cores

```
🎨 Paleta de cores sugerida:
├── Primária: #1E3A8A (Azul corporativo)
├── Secundária: #10B981 (Verde sucesso)
├── Atenção: #F59E0B (Amarelo alerta)
├── Erro: #EF4444 (Vermelho erro)
└── Neutro: #6B7280 (Cinza texto)
```

### 5.2 Formatação de números

```
💰 Valores monetários:
├── Formato: R$ 1.234.567
├── Decimais: 0 (para valores grandes)
└── Negative: -R$ 1.234.567

📊 Percentuais:
├── Formato: 12,5%
├── Decimais: 1
└── Range: 0% - 100%

📈 Quantidades:
├── Formato: 1.234
├── Decimais: 0
└── Separador: Ponto (.)
```

### 5.3 Títulos e descrições

```
📊 Títulos dos gráficos:
├── "Evolução de Vendas por Mês"
├── "Distribuição de Vendas por Região"
├── "Status dos Contratos"
├── "Valor Médio por Segmento"
└── "Top 10 Empreendimentos"

📝 Descrições (tooltips):
├── "Valor total de contratos assinados no período"
├── "Margem bruta calculada sobre valor de venda"
├── "Contratos com status ativo ou assinado"
└── "Tempo médio desde lançamento até venda"
```

---

## 🔄 Passo 6: Configurar Atualização Automática

### 6.1 Configurações de cache

```
⚙️ Data freshness:
├── Atualização: A cada 12 horas
├── Cache: 1 hora
└── Modo: Automático

📊 Configuração de extract:
├── Usar extract: Sim (se > 100MB)
├── Atualização: Diária às 7h
└── Campos: Todos selecionados
```

### 6.2 Monitoramento de performance

```sql
-- Query para monitorar uso do dashboard
SELECT
  COUNT(*) as total_records,
  MAX(data_contrato) as last_update,
  pg_size_pretty(pg_total_relation_size('rpt_vendas_wide')) as view_size
FROM rpt_vendas_wide;
```

---

## 📱 Passo 7: Responsividade e Compartilhamento

### 7.1 Layout responsivo

- **Desktop**: Layout 4 colunas
- **Tablet**: Layout 2 colunas
- **Mobile**: Layout 1 coluna (empilhado)

### 7.2 Permissões de compartilhamento

```
👥 Tipos de acesso:
├── Viewer: Equipe comercial
├── Editor: Analistas de BI
└── Owner: Gestor de TI

🔗 Links de compartilhamento:
├── Link público: Desabilitado
├── Link com senha: Para stakeholders
└── Embed: Para sistemas internos
```

---

## ✅ Checklist Final

### 📋 Pré-produção

- [ ] Conexão PostgreSQL funcionando
- [ ] View materializada populada
- [ ] Todos os campos configurados corretamente
- [ ] Gráficos respondendo aos filtros
- [ ] Performance < 10 segundos para consultas

### 🎯 Produção

- [ ] Dashboard publicado e compartilhado
- [ ] Usuários treinados nos filtros
- [ ] Atualização automática configurada
- [ ] Monitoramento de erros ativo
- [ ] Backup da configuração realizado

---

## 🚨 Troubleshooting Comum

### ❌ Erro: "Não foi possível conectar"

```
Verificações:
1. Host e porta corretos no EasyPanel
2. Usuário looker_studio criado
3. Permissões GRANT aplicadas
4. Firewall liberado para IP do Google
```

### ❌ Erro: "Query muito lenta"

```sql
-- Verificar índices
SELECT indexname FROM pg_indexes
WHERE tablename = 'rpt_vendas_wide';

-- Analisar query plan
EXPLAIN ANALYZE SELECT * FROM rpt_vendas_wide LIMIT 100;
```

### ❌ Dados não aparecem

```sql
-- Verificar se view tem dados
SELECT COUNT(*) FROM rpt_vendas_wide;

-- Verificar período de dados
SELECT MIN(data_contrato), MAX(data_contrato)
FROM rpt_vendas_wide;
```

---

## 🎉 Resultado Final

### ✅ Dashboard funcional com:

- **Gráficos interativos** organizados por categoria
- **Filtros dinâmicos** (período, região, empreendimento)
- **Métricas categorizadas** (Performance, Conversions, Financial)
- **Drill-down capabilities** em todos os elementos
- **Atualização automática** diária
- **Performance otimizada** (< 10s por consulta)

### 📊 Categorias de campos como no exemplo:

```
📊 Performance
├── Performance — Valor Contrato
├── Performance — Margem Bruta
└── Performance — Valor por M²

💰 Conversions
├── Conversions — Contratos Ativos
├── Conversions — Taxa Conversão
└── Conversions — Status

💳 Financial
├── Financial — Forma Pagamento
├── Financial — Desconto
└── Financial — Parcelas
```

---

**🎯 Com esta configuração, você terá um dashboard profissional igual aos melhores conectores do mercado!**
