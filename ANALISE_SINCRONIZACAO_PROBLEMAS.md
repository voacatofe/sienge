# Análise Detalhada: Problemas de Sincronização API Sienge → Banco de Dados

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **Cliente (customers)** - Campo Obrigatório Faltando
**Erro:** `Argument 'cpfCnpj' is missing`

**Causa:** O modelo `Cliente` no Prisma define `cpfCnpj` como campo obrigatório (`String` sem `?`), mas a API pode retornar valores vazios ou null.

**Impacto:** Nenhum cliente sem CPF/CNPJ está sendo inserido no banco.

**✅ CORRIGIDO:** Campo `cpfCnpj` agora é opcional (`String?`) no schema.

### 2. **Unidade (units)** - Relacionamento Obrigatório Faltando
**Erro:** `Argument 'empreendimento' is missing`

**Causa:** O modelo `Unidade` tem relacionamento obrigatório com `Empreendimento`, mas o mapeamento não está tratando essa relação corretamente.

**Impacto:** Nenhuma unidade está sendo inserida no banco.

**✅ CORRIGIDO:** Campo `idEmpreendimento` e relacionamento `empreendimento` agora são opcionais.

## 📊 ANÁLISE DO FLUXO DE DADOS

### Fluxo Atual:
```
API Sienge → endpoint-mappings.ts → Transformação → Prisma → Banco PostgreSQL
```

### Problemas no Fluxo:

#### 1. **Transformação de Dados Incompleta**
O mapeamento atual apenas transforma campos simples, mas não trata:
- Relacionamentos obrigatórios
- Campos obrigatórios que podem vir nulos da API
- Arrays e objetos complexos

#### 2. **Falta de Validação Pré-Inserção**
O código tenta inserir diretamente no banco sem validar:
- Se campos obrigatórios estão presentes
- Se relacionamentos existem
- Se tipos de dados estão corretos

## 🔍 COMPARAÇÃO: API vs BANCO

### Cliente (customers)

| Campo API | Campo Banco | Status | Problema |
|-----------|-------------|--------|----------|
| `cpf/cnpj` | `cpfCnpj` | ❌ | Obrigatório no banco, pode vir vazio da API |
| `phones[]` | Tabela separada | ⚠️ | Arrays não são salvos em `ClienteTelefone` |
| `addresses[]` | Tabela separada | ⚠️ | Arrays não são salvos em `ClienteEndereco` |
| `id` | `idCliente` | ✅ | OK |
| `name` | `nomeCompleto` | ✅ | OK |

### Unidade (units)

| Campo API | Campo Banco | Status | Problema |
|-----------|-------------|--------|----------|
| `enterpriseId` | `idEmpreendimento` | ❌ | Relacionamento obrigatório não tratado |
| `id` | `id` | ✅ | OK |
| `name` | `nome` | ✅ | OK |
| Todos os campos de área | Campos Decimal | ⚠️ | Muitos `undefined` nos logs |

### Empresa (companies)

| Campo API | Campo Banco | Status | Problema |
|-----------|-------------|--------|----------|
| `id` | `idEmpresa` | ✅ | OK |
| `name` | `nomeEmpresa` | ✅ | OK |
| Relacionamentos | Clientes, Títulos | ⚠️ | Não sincronizados automaticamente |

## 🚨 CAMPOS PERDIDOS NA TRANSFORMAÇÃO

### 1. **Dados que vêm da API mas são ignorados:**
- Arrays completos de telefones (exceto o primeiro)
- Arrays completos de endereços (exceto o primeiro)
- Campos não mapeados (ex: campos novos da API)
- Metadados e links

### 2. **Dados que o banco espera mas não recebe:**
- Relacionamentos obrigatórios
- Valores default para campos obrigatórios
- IDs de referência para tabelas relacionadas

### 3. **Transformações incorretas:**
- `undefined` ao invés de `null` para campos opcionais
- Falta de tratamento para campos vazios que são obrigatórios

## 📝 RECOMENDAÇÕES DE CORREÇÃO

### Prioridade ALTA - Correções Imediatas

#### 1. **Cliente - Tornar cpfCnpj opcional ou adicionar valor default**
```typescript
// Em endpoint-mappings.ts
cpfCnpj: {
  field: 'cpfCnpj',
  transform: (val: any) => val || 'SEM_DOCUMENTO' // ou tornar opcional no schema
},
```

#### 2. **Unidade - Verificar e criar/conectar empreendimento**
```typescript
// Em route.ts - Adicionar lógica especial para units
if (endpoint === 'units') {
  // Verificar se empreendimento existe
  if (mappedData.idEmpreendimento) {
    const empreendimento = await prisma.empreendimento.findUnique({
      where: { id: mappedData.idEmpreendimento }
    });

    if (!empreendimento) {
      // Criar empreendimento básico ou pular unidade
      continue;
    }
  }
}
```

#### 3. **Adicionar validação antes da inserção**
```typescript
// Função para validar dados obrigatórios
function validateRequiredFields(model: string, data: any): boolean {
  const requiredFields = {
    cliente: ['cpfCnpj', 'nomeCompleto'],
    unidade: ['idEmpreendimento', 'nome'],
    // ... outros modelos
  };

  const required = requiredFields[model] || [];
  return required.every(field => data[field] != null);
}
```

### Prioridade MÉDIA - Melhorias Estruturais

#### 1. **Processar arrays de telefones e endereços**
```typescript
// Após inserir cliente, processar telefones
if (item.phones && Array.isArray(item.phones)) {
  for (const phone of item.phones) {
    await prisma.clienteTelefone.create({
      data: {
        idCliente: item.id,
        numero: phone.number || phone.phone,
        tipo: phone.type,
        main: phone.main || false
      }
    });
  }
}
```

#### 2. **Implementar sistema de dependências**
- Sincronizar primeiro: empresas, indexadores
- Depois: empreendimentos, clientes
- Por último: unidades, contratos, títulos

### Prioridade BAIXA - Otimizações

1. **Usar transações para garantir consistência**
2. **Implementar retry logic para erros temporários**
3. **Adicionar logs mais detalhados para debugging**
4. **Criar relatórios de sincronização**

## 🎯 SOLUÇÃO PROPOSTA IMEDIATA

### Modificar Schema Prisma:
1. Tornar `cpfCnpj` opcional em `Cliente`
2. Tornar relacionamento `empreendimento` opcional em `Unidade`

### OU

### Modificar Lógica de Sincronização:
1. Adicionar valores default para campos obrigatórios
2. Verificar existência de relacionamentos antes de inserir
3. Criar registros relacionados se necessário

## 📈 MÉTRICAS DE SUCESSO

Após implementar as correções, você deve ver:
- ✅ 0 erros de "Argument missing"
- ✅ Registros sendo inseridos em todas as tabelas
- ✅ Telefones e endereços salvos nas tabelas auxiliares
- ✅ Relacionamentos mantidos corretamente

## 🔄 ORDEM RECOMENDADA DE SINCRONIZAÇÃO

1. **Empresas** (sem dependências)
2. **Clientes** (depende de empresas)
3. **Empreendimentos** (depende de empresas)
4. **Unidades** (depende de empreendimentos)
5. **Contratos** (depende de clientes e empreendimentos)
6. **Títulos** (depende de clientes e contratos)

## 📋 CHECKLIST DE VALIDAÇÃO

- [ ] Todos os campos obrigatórios do schema têm valores ou são opcionais
- [ ] Relacionamentos são verificados antes da inserção
- [ ] Arrays (telefones, endereços) são processados separadamente
- [ ] Logs mostram inserções bem-sucedidas
- [ ] Banco de dados tem registros em todas as tabelas principais