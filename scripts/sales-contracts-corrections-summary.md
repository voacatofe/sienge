# Correções do Erro de Sincronização - sales-contracts

## 🚨 Problema Original

**Erro:** `Unknown argument 'enterpriseId'. Available options are marked with ?`

**Causa:** Múltiplos problemas na sincronização do endpoint `sales-contracts`:

1. Prisma client não inicializando corretamente em produção
2. Mapeamentos duplicados causando campos conflitantes
3. Validação insuficiente de modelos
4. Configuração de build interferindo com runtime

## ✅ Correções Aplicadas

### 1. **lib/prisma-singleton.ts**

- **Problema:** Proxy complexo estava causando falhas de inicialização
- **Solução:** Simplificado para `export const prisma = PrismaService.getInstance()`
- **Impacto:** Resolve erro "Cannot read properties of undefined (reading 'findUnique')"

### 2. **app/api/sync/direct/endpoint-mappings.ts**

- **Problema:** Campos duplicados no mapeamento de `sales-contracts`
  - `creationDate` → `data_criacao_sienge`
  - `createdAt` → `dataCadastro`
  - Causava conflitos no Prisma
- **Solução:** Mapeamentos únicos:
  ```typescript
  creationDate: {
    field: 'dataCriacaoSienge',
    transform: (val: any) => (val ? new Date(val) : null),
  },
  createdAt: {
    field: 'dataCadastro',
    transform: () => new Date(),
  },
  ```

### 3. **app/api/sync/direct/route.ts**

- **Problema:** Validação insuficiente de modelos Prisma
- **Solução:** Adicionadas verificações:
  - Prisma client inicializado
  - Modelo existe no cliente
  - Operação disponível no modelo
  - Logs detalhados para diagnóstico

### 4. **Dockerfile**

- **Problema:** Variável `BUILDING=true` desnecessária
- **Solução:** Removida linha `ENV BUILDING=true`

## 🧪 Testes Realizados

### ✅ Teste Local (Sucesso)

```bash
node scripts/test-sales-contracts-fix.js
```

**Resultados:**

- ✅ Prisma client inicializado corretamente
- ✅ Modelo contratoVenda encontrado (685 contratos)
- ✅ Campos de data acessíveis sem conflitos
- ✅ Estrutura de dados compatível com Prisma

## 🚀 Próximos Passos

### 1. **Deploy das Correções**

- Fazer deploy com as correções aplicadas
- Monitorar logs durante inicialização

### 2. **Teste de Sincronização**

- Testar sync manual via interface: "Configurar e Sincronizar"
- Monitorar endpoint `sales-contracts` especificamente
- Verificar logs para confirmar ausência do erro original

### 3. **Validação de Dados**

```bash
# Após deploy, verificar se sync está funcionando
node scripts/verify-new-endpoints.js

# Verificar logs de erro
ls logs/sync-errors/ -la
```

### 4. **Monitoramento**

- Observar logs em produção durante próxima sincronização
- Verificar se erro `Unknown argument 'enterpriseId'` foi resolvido
- Confirmar que todos os campos estão sendo processados corretamente

## 📋 Checklist de Validação

- [ ] Deploy realizado sem erros
- [ ] Aplicação iniciando corretamente
- [ ] Prisma client funcionando
- [ ] Sync manual de sales-contracts sem erros
- [ ] Logs limpos (sem erro de enterpriseId)
- [ ] Dados sendo salvos corretamente no banco

## 🔍 Monitoramento de Logs

**Logs a observar:**

- ✅ `Prisma client inicializado corretamente`
- ✅ `Attempting to access model: contratoVenda`
- ✅ `Processing sales-contracts item`
- ❌ NÃO deve aparecer: `Unknown argument 'enterpriseId'`
- ❌ NÃO deve aparecer: `Cannot read properties of undefined`

## 📞 Suporte

Se o erro persistir após as correções:

1. Verificar logs completos da aplicação
2. Validar se Prisma generate foi executado no deploy
3. Confirmar se banco de dados está acessível
4. Verificar se não há cache de build antigo
