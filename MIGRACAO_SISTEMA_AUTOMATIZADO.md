# Migração para Sistema de Mapeamento Automatizado

## Resumo

Este documento explica como migrar do sistema atual de sincronização (`app/api/sync/route.ts`) para o sistema automatizado de mapeamento (`app/api/sync/direct/`).

## Problemas do Sistema Atual

### 1. **Código Duplicado e Verboso**

- Cada entidade tem sua própria função de processamento
- Mapeamento manual de campos repetitivo
- Difícil manutenção quando a API muda
- Mais de 1400 linhas de código

### 2. **Falta de Padronização**

- Cada função implementa sua própria lógica de upsert
- Tratamento de erros inconsistente
- Logs diferentes para cada entidade

### 3. **Dificuldade de Manutenção**

- Adicionar novos campos requer alterações em múltiplos lugares
- Risco de inconsistências entre entidades
- Difícil de testar individualmente

## Vantagens do Sistema Automatizado

### 1. **Fonte Única da Verdade**

- Todos os mapeamentos centralizados em `endpoint-mappings.ts`
- Fácil de encontrar e atualizar mapeamentos
- Documentação clara dos campos

### 2. **Código Reutilizável**

- Uma única função `processGenericEndpoint` para todas as entidades
- Lógica de upsert padronizada
- Tratamento de erros consistente

### 3. **Facilidade de Manutenção**

- Adicionar novos campos: apenas atualizar o mapeamento
- Adicionar nova entidade: apenas criar novo mapeamento
- Transformações de dados centralizadas

## Comparação de Código

### Sistema Atual (route.ts)

```typescript
// Para cada entidade, código similar a este:
async function saveReceivables(receivables: any[]) {
  // 100+ linhas de código manual
  for (const receivable of receivables) {
    const cleanReceivable = {
      idTituloReceber: receivable.id,
      idContrato: receivable.contractId,
      idCliente: await getCustomerReference(receivable.customerId),
      // ... mais 20+ campos mapeados manualmente
    };

    // Lógica de upsert manual
    const existing = await prisma.tituloReceber.findFirst({
      where: { idTituloReceber: receivable.id },
    });

    if (existing) {
      await prisma.tituloReceber.update({
        where: { idTituloReceber: receivable.id },
        data: cleanReceivable,
      });
    } else {
      await prisma.tituloReceber.create({
        data: cleanReceivable,
      });
    }
  }
}
```

### Sistema Automatizado (route-refactored.ts)

```typescript
// Uma única função para todas as entidades:
if (hasEndpointMapping(endpoint)) {
  result = await processGenericEndpoint(endpoint, mockData, syncLog.id);
}

// Mapeamento declarativo em endpoint-mappings.ts:
'income': {
  model: 'tituloReceber',
  primaryKey: 'idTituloReceber',
  fieldMapping: {
    id: 'idTituloReceber',
    contractId: 'idContrato',
    customerId: 'idCliente',
    originalValue: {
      field: 'valorOriginal',
      transform: (val: any) => val ? parseFloat(val) : 0
    },
    // ... outros campos
  }
}
```

## Plano de Migração

### Fase 1: Preparação ✅

- [x] Criar sistema de mapeamento automatizado
- [x] Atualizar schema.prisma com campos faltantes
- [x] Criar versão refatorada do route.ts
- [x] Adicionar mapeamentos para entidades principais

### Fase 2: Migração Gradual

1. **Testar sistema automatizado**
   - Executar testes com dados mock
   - Validar mapeamentos
   - Comparar resultados

2. **Migrar entidades uma por vez**
   - Começar com `customers` (já mapeado)
   - Depois `income` (já mapeado)
   - Seguir com `companies` e `sales-contracts`

3. **Substituir arquivo principal**
   - Fazer backup do `route.ts` atual
   - Substituir por `route-refactored.ts`
   - Atualizar imports e referências

### Fase 3: Limpeza

- Remover funções legadas não utilizadas
- Otimizar mapeamentos
- Adicionar testes automatizados

## Como Adicionar Nova Entidade

### Sistema Atual

1. Criar nova função `saveXxx()`
2. Implementar lógica de mapeamento manual
3. Implementar lógica de upsert
4. Adicionar tratamento de erros
5. Adicionar logs
6. Atualizar função principal

### Sistema Automatizado

1. Adicionar mapeamento em `endpoint-mappings.ts`:

```typescript
'nova-entidade': {
  model: 'nomeDoModelo',
  primaryKey: 'idCampo',
  fieldMapping: {
    apiField: 'dbField',
    // ... outros campos
  }
}
```

## Como Adicionar Novo Campo

### Sistema Atual

1. Atualizar schema.prisma
2. Encontrar todas as funções que processam a entidade
3. Adicionar mapeamento manual em cada função
4. Testar cada função individualmente

### Sistema Automatizado

1. Atualizar schema.prisma
2. Adicionar campo no mapeamento:

```typescript
fieldMapping: {
  // ... campos existentes
  novoApiField: 'novoDbField',
  // ou com transformação:
  outroApiField: {
    field: 'outroDbField',
    transform: (val) => val ? parseFloat(val) : 0
  }
}
```

## Benefícios Imediatos

1. **Redução de 90% no código**
   - De ~1400 linhas para ~300 linhas
   - Código mais limpo e legível

2. **Manutenção Simplificada**
   - Alterações centralizadas
   - Menos chance de erros

3. **Facilidade de Debug**
   - Logs padronizados
   - Tratamento de erros consistente

4. **Escalabilidade**
   - Fácil adicionar novas entidades
   - Reutilização de código

## Próximos Passos

1. **Validar sistema refatorado**

   ```bash
   # Testar compilação
   npx tsc --noEmit app/api/sync/route-refactored.ts

   # Executar testes (quando disponíveis)
   npm test
   ```

2. **Fazer backup do sistema atual**

   ```bash
   cp app/api/sync/route.ts app/api/sync/route-backup.ts
   ```

3. **Substituir sistema principal**

   ```bash
   mv app/api/sync/route-refactored.ts app/api/sync/route.ts
   ```

4. **Testar em ambiente de desenvolvimento**
   - Executar sincronização completa
   - Validar dados no banco
   - Verificar logs de erro

## Conclusão

O sistema automatizado resolve os principais problemas do sistema atual:

- **Manutenibilidade**: Código centralizado e padronizado
- **Escalabilidade**: Fácil adicionar novas entidades e campos
- **Confiabilidade**: Menos código = menos bugs
- **Produtividade**: Alterações mais rápidas e seguras

A migração pode ser feita gradualmente, mantendo compatibilidade durante a transição.
