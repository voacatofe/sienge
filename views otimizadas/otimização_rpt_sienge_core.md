# 📊 ANÁLISE DETALHADA E PLANO DE CORREÇÃO - VIEW CORE (rpt_sienge_core)

## 🔍 PROBLEMAS IDENTIFICADOS NA IMPLEMENTAÇÃO ATUAL

### 1. **DADOS DE EMPRESA INCORRETOS OU AUSENTES**

#### Domínio CLIENTES (825 registros)

- **Problema**: 0% tem `idEmpresa` preenchido na tabela `clientes`
- **Resultado atual**: Todos mostram "Não informado" para empresa
- **Solução**: Usar dados do próprio cliente como identificação primária

#### Domínio FINANCEIRO (51.801 registros)

- **Problema**: 0% tem `empresa_id` direto na tabela `extrato_contas`
- **Descoberta**: 95% (49.199) tem empresa via `extrato_apropriacoes` → `centro_custos`
- **Solução**: JOIN com apropriações para obter empresa

#### Domínio CONTRATOS (689 registros)

- ✅ Funcionando corretamente (13 empresas distintas)

#### Domínio EMPREENDIMENTOS (217 registros)

- ✅ Funcionando corretamente (19 empresas distintas)

#### Domínio UNIDADES (2.669 registros)

- ✅ Funcionando corretamente (13 empresas via empreendimento)

---

## 📋 CAMPOS ATUALMENTE NA VIEW CORE (19 campos)

### ✅ Campos Implementados Corretamente:

1. `domain_type` - Identificador do domínio
2. `unique_id` - ID único do registro
3. `data_principal` - Data principal do registro
4. `ano` - Ano extraído
5. `trimestre` - Trimestre
6. `mes` - Mês
7. `ano_mes` - Formato YYYY-MM
8. `nome_mes` - Nome do mês
9. `empresa_id` - ID da empresa
10. `record_id` - ID do registro original
11. `cliente_principal_id` - ID do cliente (quando aplicável)
12. `empreendimento_id` - ID do empreendimento (quando aplicável)
13. `unidade_id` - ID da unidade (quando aplicável)
14. `extrato_id` - ID do extrato (quando aplicável)

### ⚠️ Campos com Problemas:

15. `empresa_nome` - Mostra "Não informado" para clientes e financeiro
16. `empresa_cnpj` - Mostra "Não informado" para clientes e financeiro
17. `empresa_cidade` - Mostra "Não informado" para clientes e financeiro
18. `empresa_estado` - Mostra "Não informado" para clientes e financeiro
19. `empresa_regiao` - Mostra "Não informado" para clientes e financeiro

---

## 🎯 PLANO DE CORREÇÃO DETALHADO

### **CORREÇÃO 1: DOMÍNIO CLIENTES**

Como não temos relação com empresa, vamos usar os dados do próprio cliente:

```sql
-- Para domínio CLIENTES
SELECT
  'clientes' as domain_type,
  c."idCliente"::text as unique_id,

  -- Usar nome do cliente como "empresa_nome"
  COALESCE(c."nomeCompleto", 'Cliente sem nome') as empresa_nome,

  -- Usar CPF/CNPJ do cliente como "empresa_cnpj"
  COALESCE(c."cpfCnpj", 'Sem documento') as empresa_cnpj,

  -- Para cidade/estado, podemos buscar do endereço se existir
  COALESCE(c.cidade, 'Não informado') as empresa_cidade,
  COALESCE(c.estado, 'Não informado') as empresa_estado,

  -- Cliente é pessoa física, então não tem "região empresa"
  'Cliente PF' as empresa_regiao,

  -- Manter cliente_principal_id como o próprio ID do cliente
  c."idCliente" as cliente_principal_id
```

### **CORREÇÃO 2: DOMÍNIO FINANCEIRO**

Obter empresa via apropriações (95% de cobertura):

```sql
-- CTE para obter empresa via apropriações
WITH empresa_extrato AS (
  SELECT DISTINCT ON (ec.id)
    ec.id as extrato_id,
    cc.empresa_id,
    e."nomeEmpresa",
    e.cnpj,
    e.cidade,
    e.estado
  FROM extrato_contas ec
  JOIN extrato_apropriacoes ea ON ec.id = ea.extrato_conta_id
  JOIN centro_custos cc ON ea.centro_custo_id = cc.id
  LEFT JOIN empresas e ON cc.empresa_id = e."idEmpresa"
  ORDER BY ec.id, ea.percentual DESC
)

-- Para domínio FINANCEIRO
SELECT
  'financeiro' as domain_type,
  ec.id::text as unique_id,

  -- Usar empresa via apropriação ou valor padrão
  COALESCE(ee."nomeEmpresa", 'Extrato sem empresa') as empresa_nome,
  COALESCE(ee.cnpj, 'Sem CNPJ') as empresa_cnpj,
  COALESCE(ee.cidade, 'Não informado') as empresa_cidade,
  COALESCE(ee.estado, 'Não informado') as empresa_estado,

  -- Região calculada
  CASE
    WHEN ee.estado IN ('SP', 'RJ', 'ES', 'MG') THEN 'Sudeste'
    WHEN ee.estado IN ('RS', 'SC', 'PR') THEN 'Sul'
    -- ... outras regiões
    ELSE 'Não informado'
  END as empresa_regiao

FROM extrato_contas ec
LEFT JOIN empresa_extrato ee ON ec.id = ee.extrato_id
```

### **CORREÇÃO 3: ADICIONAR CAMPOS DE ENTIDADES**

Para enriquecer a view core com dados específicos de cada entidade:

#### Para CLIENTES, adicionar:

- `cliente_nome` - Nome completo do cliente
- `cliente_cpf_cnpj` - Documento do cliente
- `cliente_tipo` - PF/PJ
- `cliente_email` - Email do cliente
- `cliente_telefone` - Telefone principal

#### Para CONTRATOS, adicionar:

- `contrato_numero` - Número do contrato
- `contrato_valor` - Valor do contrato
- `contrato_status` - Status atual

#### Para EMPREENDIMENTOS, adicionar:

- `empreendimento_nome` - Nome do empreendimento
- `empreendimento_tipo` - Tipo do empreendimento
- `empreendimento_endereco` - Endereço

#### Para UNIDADES, adicionar:

- `unidade_nome` - Nome/identificação da unidade
- `unidade_tipo` - Tipo de imóvel
- `unidade_area` - Área em m²

#### Para FINANCEIRO, adicionar:

- `extrato_valor` - Valor do lançamento
- `extrato_tipo` - Income/Expense
- `extrato_descricao` - Descrição

---

## 📊 ESTRUTURA PROPOSTA REVISADA

### VIEW CORE COMUM - CAMPOS UNIVERSAIS (25-30 campos)

```sql
CREATE MATERIALIZED VIEW rpt_sienge_core AS
SELECT
  -- Identificação (2)
  domain_type,
  unique_id,

  -- Temporais (6)
  data_principal,
  ano,
  trimestre,
  mes,
  ano_mes,
  nome_mes,

  -- Empresa/Organização (6)
  empresa_id,
  empresa_nome,     -- Corrigido para cada domínio
  empresa_cnpj,     -- Corrigido para cada domínio
  empresa_cidade,   -- Corrigido para cada domínio
  empresa_estado,   -- Corrigido para cada domínio
  empresa_regiao,   -- Corrigido para cada domínio

  -- IDs de Relacionamento (6)
  record_id,
  cliente_principal_id,
  empreendimento_id,
  unidade_id,
  extrato_id,
  contrato_id,      -- NOVO

  -- Dados Principais da Entidade (5-8)
  entidade_nome,    -- Nome principal do registro
  entidade_tipo,    -- Tipo/categoria do registro
  entidade_valor,   -- Valor principal (se aplicável)
  entidade_status,  -- Status atual
  entidade_documento -- Documento principal (CPF/CNPJ/Número)
```

---

## 🚀 BENEFÍCIOS DA CORREÇÃO

1. **Dados Corretos**: 95% dos registros financeiros terão empresa identificada
2. **Consistência**: Todos os domínios terão campos preenchidos adequadamente
3. **Riqueza de Dados**: Campos específicos de cada entidade disponíveis no core
4. **Performance**: Índices otimizados para as novas estruturas de JOIN
5. **Análise**: Possibilidade de análises cross-domain mais precisas

---

## ⚠️ CONSIDERAÇÕES IMPORTANTES

### Impacto em Performance

- JOIN adicional para financeiro pode impactar refresh da view
- Sugestão: Criar índices específicos em `extrato_apropriacoes.extrato_conta_id`

### Dados Faltantes

- 5% dos extratos financeiros continuarão sem empresa
- 100% dos clientes não tem relação direta com empresa
- Solução: Usar valores padrão significativos

### Manutenção

- CTEs adicionais aumentam complexidade
- Documentar claramente a lógica de obtenção de empresa

---

## 📝 PRÓXIMOS PASSOS

1. **IMEDIATO**: Corrigir JOINs para obter empresa corretamente
2. **CURTO PRAZO**: Adicionar campos de entidade específicos
3. **MÉDIO PRAZO**: Criar views especializadas por domínio
4. **LONGO PRAZO**: Implementar view unificada com todos os dados

---

## 📈 MÉTRICAS DE SUCESSO

- [ ] 95% dos registros financeiros com empresa identificada
- [ ] 100% dos domínios com campos empresa preenchidos (mesmo que adaptados)
- [ ] Redução de campos "Não informado" de 85% para < 10%
- [ ] Performance de queries mantida ou melhorada
- [ ] Dashboards existentes funcionando sem alterações
