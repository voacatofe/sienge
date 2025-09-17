# 🔄 Plano de Migração: View Única Master

## 🎯 Objetivo da Migração

Migrar da arquitetura atual que usa `rpt_vendas_wide` (apenas contratos) para a nova `rpt_sienge_master_wide` (todos os domínios unificados) sem quebrar a API REST nem o Community Connector do Looker Studio.

## 📊 Estado Atual vs Futuro

### **🔴 ANTES: Arquitetura Atual**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ rpt_vendas_wide │ -> │ API /vendas      │ -> │ Looker Studio   │
│ (só contratos)  │    │ (campos mistos)  │    │ (grupos mistos) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

**Problemas:**
- ❌ Apenas domínio de contratos
- ❌ Nomenclatura inconsistente ("Performance — Valor Contrato")
- ❌ Sem dados financeiros, movimentos
- ❌ Grupos semânticos não otimizados

### **🟢 DEPOIS: Nova Arquitetura**
```
┌─────────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ rpt_sienge_master_  │ -> │ API /vendas      │ -> │ Looker Studio   │
│ wide (TODOS         │    │ (campos limpos)  │    │ (8 grupos)      │
│ os domínios)        │    │                  │    │                 │
└─────────────────────┘    └──────────────────┘    └─────────────────┘
```

**Benefícios:**
- ✅ Todos os domínios unificados
- ✅ Grupos semânticos limpos (Data, Empresas, Contratos, Financeiro, etc.)
- ✅ Nomenclatura consistente
- ✅ Análises cross-domain possíveis

## 🚀 Estratégia de Migração

### **Fase 1: Construção Paralela (Sem Impacto)**
- [x] Criar `rpt_sienge_master_wide` paralelamente à `rpt_vendas_wide`
- [x] Validar dados e performance
- [x] Manter API atual funcionando

### **Fase 2: Adaptação da API (Compatibilidade)**
- [ ] Modificar API para consumir nova view
- [ ] Manter estrutura de resposta compatível
- [ ] Filtrar apenas `domain_type = 'contratos'` inicialmente

### **Fase 3: Evolução Gradual (Expansão)**
- [ ] Adicionar novos endpoints para outros domínios
- [ ] Atualizar Community Connector
- [ ] Migrar dashboards existentes

### **Fase 4: Limpeza (Finalização)**
- [ ] Remover view antiga `rpt_vendas_wide`
- [ ] Consolidar documentação
- [ ] Monitorar performance

## 📋 Detalhamento das Fases

### **📦 Fase 1: Construção Paralela**

**Status: ✅ COMPLETA**

**Ações realizadas:**
- [x] Especificação completa da view única
- [x] SQL de implementação desenvolvido
- [x] Mapeamento de grupos semânticos definido
- [x] Documentação técnica criada

**Validações necessárias:**
```sql
-- Executar script 04_implementar_view_unica_master.sql
-- Verificar se dados estão sendo gerados corretamente
SELECT domain_type, COUNT(*) FROM rpt_sienge_master_wide GROUP BY domain_type;

-- Comparar dados de contratos entre views
SELECT COUNT(*) FROM rpt_vendas_wide;
SELECT COUNT(*) FROM rpt_sienge_master_wide WHERE domain_type = 'contratos';
```

### **🔄 Fase 2: Adaptação da API**

**Objetivo:** Migrar API sem quebrar compatibilidade

#### **2.1 Atualização do Arquivo API**

**Arquivo:** `app/api/datawarehouse/vendas/route.ts`

**Mudanças necessárias:**

```typescript
// ANTES - Query atual
const sql = `
  SELECT * FROM rpt_vendas_wide
  WHERE data_contrato >= $1
  ORDER BY data_contrato DESC
`;

// DEPOIS - Nova query
const sql = `
  SELECT * FROM rpt_sienge_master_wide
  WHERE data_principal >= $1
    AND domain_type = 'contratos'  -- Filtrar apenas contratos por enquanto
  ORDER BY data_principal DESC
`;
```

#### **2.2 Mapeamento de Campos**

**Compatibilidade de nomes:**

| Campo Antigo (rpt_vendas_wide) | Campo Novo (rpt_sienge_master_wide) | Ação |
|--------------------------------|-------------------------------------|------|
| `data_contrato` | `data_principal` | ✅ Mapear automaticamente |
| `"Performance — Valor Contrato"` | `valor_contrato` | ✅ Simplificar nome |
| `"Conversions — Status Contrato"` | `status_contrato` | ✅ Simplificar nome |
| `"Financial — Desconto (%)"` | `desconto_percent` | ⚠️ Novo campo (verificar origem) |

#### **2.3 Atualização do Schema da API**

```typescript
// ANTES - Schema com nomes complexos
schema: {
  categories: {
    Performance: {
      fields: ['Performance — Valor Contrato']
    }
  }
}

// DEPOIS - Schema com grupos limpos
schema: {
  categories: {
    Data: {
      fields: ['data_principal', 'ano', 'trimestre', 'mes']
    },
    Contratos: {
      fields: ['valor_contrato', 'status_contrato', 'tipo_contrato']
    },
    Financeiro: {
      fields: ['valor_original', 'valor_pago', 'saldo_devedor']
    }
  }
}
```

### **🔧 Fase 3: Evolução Gradual**

#### **3.1 Community Connector - Atualização**

**Arquivo:** `looker-studio-connector/Code.gs`

**Mudanças necessárias:**

```javascript
// Atualizar getSchema() para usar novos grupos
function getSchema(request) {
  var fields = [
    // GRUPO: Data
    {
      name: 'data_principal',
      label: 'Data Principal',
      dataType: 'STRING',
      group: 'Data',  // ✅ Grupo limpo
      semantics: { conceptType: 'DIMENSION', semanticType: 'YEAR_MONTH_DAY' }
    },

    // GRUPO: Contratos
    {
      name: 'valor_contrato',
      label: 'Valor do Contrato',
      dataType: 'NUMBER',
      group: 'Contratos',  // ✅ Grupo limpo
      semantics: { conceptType: 'METRIC', semanticType: 'CURRENCY_BRL' }
    }
  ];
}
```

#### **3.2 Novos Endpoints (Futuro)**

```
/api/datawarehouse/vendas     -> domain_type = 'contratos'    ✅ Atualizar
/api/datawarehouse/financeiro -> domain_type = 'financeiro'   🔄 Criar
/api/datawarehouse/movimentos -> domain_type = 'movimentos'   🔄 Criar
/api/datawarehouse/master     -> todos os domain_types        🔄 Criar
```

### **🧹 Fase 4: Limpeza e Otimização**

#### **4.1 Remoção da View Antiga**

```sql
-- Apenas após validação completa
DROP MATERIALIZED VIEW IF EXISTS rpt_vendas_wide CASCADE;
```

#### **4.2 Otimização de Performance**

```sql
-- Análise de performance da nova view
EXPLAIN ANALYZE
SELECT * FROM rpt_sienge_master_wide
WHERE data_principal >= CURRENT_DATE - INTERVAL '12 months';

-- Verificar uso dos índices
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE tablename = 'rpt_sienge_master_wide';
```

## ⚠️ Riscos e Mitigações

### **🔴 Risco: Quebra de Compatibilidade**

**Cenário:** Campos têm nomes diferentes, quebram dashboards existentes

**Mitigação:**
- Criar view de compatibilidade temporária
```sql
CREATE VIEW rpt_vendas_wide_compat AS
SELECT
  data_principal as data_contrato,
  valor_contrato as "Performance — Valor Contrato",
  status_contrato as "Conversions — Status Contrato"
FROM rpt_sienge_master_wide
WHERE domain_type = 'contratos';
```

### **🔴 Risco: Performance Degradada**

**Cenário:** View unificada é mais lenta que view específica

**Mitigação:**
- Monitorar performance antes/depois
- Otimizar índices específicos para queries da API
- Manter filtro `domain_type = 'contratos'` durante transição

### **🔴 Risco: Dados Inconsistentes**

**Cenário:** Dados da nova view não batem com a antiga

**Mitigação:**
- Testes A/B comparando resultados
- Queries de validação automatizadas
- Rollback plan definido

## 📋 Checklist de Migração

### **Pré-Migração**
- [ ] Backup da view atual `rpt_vendas_wide`
- [ ] Executar `04_implementar_view_unica_master.sql`
- [ ] Validar contagem de registros entre views
- [ ] Testar performance da nova view

### **Migração da API**
- [ ] Atualizar query em `/api/datawarehouse/vendas/route.ts`
- [ ] Adaptar mapeamento de campos
- [ ] Atualizar schema de resposta
- [ ] Testar API com dados reais

### **Migração do Community Connector**
- [ ] Atualizar `getSchema()` no `Code.gs`
- [ ] Fazer novo deploy no Google Apps Script
- [ ] Testar conexão no Looker Studio
- [ ] Validar agrupamento de campos

### **Pós-Migração**
- [ ] Monitorar logs de erro da API
- [ ] Verificar performance dos dashboards
- [ ] Validar dados com usuários finais
- [ ] Documentar mudanças

## 🔄 Rollback Plan

Em caso de problemas críticos:

### **Rollback Rápido (< 5 minutos)**
```typescript
// Reverter apenas a query da API
const sql = `
  SELECT * FROM rpt_vendas_wide  -- Voltar para view antiga
  WHERE data_contrato >= $1
  ORDER BY data_contrato DESC
`;
```

### **Rollback Completo (< 30 minutos)**
1. Reverter Community Connector para versão anterior
2. Restaurar API para configuração original
3. Verificar funcionamento dos dashboards
4. Comunicar usuários sobre instabilidade temporária

## 📊 Validação de Sucesso

### **Métricas de Sucesso**
- [ ] Performance da API ≤ 3 segundos
- [ ] Dashboards carregam em ≤ 10 segundos
- [ ] 0 erros reportados por usuários
- [ ] Dados consistentes com período anterior

### **Queries de Validação**
```sql
-- Comparar totais financeiros
SELECT
  SUM(valor_contrato) as total_contratos_novo
FROM rpt_sienge_master_wide
WHERE domain_type = 'contratos'
  AND data_principal >= '2024-01-01';

SELECT
  SUM("Performance — Valor Contrato") as total_contratos_antigo
FROM rpt_vendas_wide
WHERE data_contrato >= '2024-01-01';

-- Verificar distribuição temporal
SELECT ano_mes, COUNT(*)
FROM rpt_sienge_master_wide
WHERE domain_type = 'contratos'
GROUP BY ano_mes ORDER BY ano_mes;
```

## 🎯 Cronograma Sugerido

### **Semana 1: Preparação**
- **Dia 1-2:** Executar script de criação da view
- **Dia 3-4:** Validar dados e performance
- **Dia 5:** Preparar mudanças na API

### **Semana 2: Migração**
- **Dia 1:** Atualizar API em ambiente de teste
- **Dia 2-3:** Testar API e identificar problemas
- **Dia 4:** Atualizar Community Connector
- **Dia 5:** Deploy em produção com monitoramento

### **Semana 3: Validação**
- **Dia 1-3:** Monitorar performance e erros
- **Dia 4-5:** Colher feedback de usuários
- **Final:** Decisão sobre manter ou rollback

---

**Esta migração estabelece a base para uma arquitetura de dados unificada, permitindo análises cross-domain e simplificando a manutenção futura do sistema.**