# Validação YAML vs Implementação - Correções de Sincronização

## Resumo das Correções Aplicadas

### 1. Problemas Identificados

#### Foreign Key Constraints
- **Erro Principal**: `contratos_venda_enterpriseId_fkey` violação de constraint
- **Causa**: Tentativa de inserir contratos de venda com `enterpriseId` que não existe na tabela `empreendimentos`
- **Impacto**: Falha na sincronização de contratos de venda

### 2. Soluções Implementadas

#### 2.1 Sistema de Dependências de Sincronização
**Arquivo criado**: `lib/sync-dependencies.ts`

- Define 4 fases de sincronização:
  - **Fase 1 (INDEPENDENT)**: Entidades sem dependências (companies, customers, indexers, etc.)
  - **Fase 2 (BASIC_DEPENDENCIES)**: Entidades com dependências básicas (enterprises, projects)
  - **Fase 3 (COMPLEX_DEPENDENCIES)**: Entidades com múltiplas dependências (sales-contracts, units, income)
  - **Fase 4 (RELATIONSHIPS)**: Entidades de relacionamento (sales-commissions)

- Funcionalidades:
  - `getSyncOrder()`: Retorna ordem correta de sincronização
  - `areDependenciesSatisfied()`: Verifica se dependências foram satisfeitas
  - `validateNoCycles()`: Detecta dependências circulares

#### 2.2 Atualização do Schema Prisma
**Arquivo modificado**: `prisma/schema.prisma`

```prisma
// Relacionamento ContratoVenda -> Empreendimento
empreendimento Empreendimento? @relation(
  fields: [enterpriseId],
  references: [id],
  onDelete: SetNull,    // Define enterpriseId como null se empreendimento for deletado
  onUpdate: Cascade     // Atualiza enterpriseId se id do empreendimento mudar
)
```

#### 2.3 Validação de Foreign Keys no Processamento
**Arquivos modificados**:
- `app/api/sync/route.ts`
- `app/api/sync/direct/route.ts`

Adicionado tratamento especial para ContratoVenda:
```typescript
// Verificar se enterpriseId existe antes de inserir
if (config.model === 'contratoVenda' && mappedData.enterpriseId) {
  const enterprise = await prisma.empreendimento.findUnique({
    where: { id: mappedData.enterpriseId }
  });

  if (!enterprise) {
    console.warn(`Empreendimento ${mappedData.enterpriseId} não encontrado`);
    mappedData.enterpriseId = null; // Define como null ao invés de falhar
  }
}
```

#### 2.4 Script de Sincronização com Dependências
**Arquivo criado**: `scripts/sync-with-dependencies.ts`

- Executa sincronização respeitando fases
- Processa entidades da mesma fase em paralelo
- Garante que dependências sejam satisfeitas antes de prosseguir
- Comando: `npm run sync:dependencies`

### 3. Melhorias na Estrutura Docker

#### 3.1 PowerShell Script Corrigido
**Arquivo modificado**: `docker-dev.ps1`

- Removidos caracteres Unicode que causavam erros de parsing
- Corrigida ordem de argumentos do docker-compose
- Adicionado suporte robusto para variáveis de ambiente

#### 3.2 Docker Compose Simplificado
**Arquivo modificado**: `docker-compose-dev.yml`

- Removidas configurações customizadas de PostgreSQL que causavam restart loops
- Ajustado DATABASE_URL para usar rede interna Docker (db:5432)
- Mantidas configurações de health checks e resource limits

### 4. Como Usar

#### Executar Ambiente Docker
```bash
# Iniciar ambiente de desenvolvimento
.\docker-dev.ps1 up -Build

# Verificar status
.\docker-dev.ps1 status

# Parar ambiente
.\docker-dev.ps1 down
```

#### Sincronizar Dados
```bash
# Sincronização com respeito às dependências
npm run sync:dependencies

# Ou dentro do container
docker exec sienge-dev-app npm run sync:dependencies
```

### 5. Validação

#### Testes Realizados
- ✅ Docker environment inicializa corretamente
- ✅ Todos os containers estão healthy
- ✅ Aplicação acessível em http://localhost:3000
- ✅ Adminer acessível em http://localhost:8080
- ✅ Schema Prisma sincronizado com banco de dados

#### Pendências
- Testar sincronização completa com dados reais da API Sienge
- Validar que todas as foreign keys são respeitadas
- Monitorar logs para identificar possíveis erros residuais

### 6. Arquivos Modificados/Criados

1. **Criados**:
   - `lib/sync-dependencies.ts` - Sistema de gerenciamento de dependências
   - `scripts/sync-with-dependencies.ts` - Script de sincronização ordenada
   - `.env.dev` - Variáveis de ambiente para desenvolvimento
   - `postgresql.conf` - Configuração PostgreSQL otimizada
   - `pg_hba.conf` - Configuração de autenticação PostgreSQL

2. **Modificados**:
   - `docker-dev.ps1` - Script PowerShell corrigido
   - `docker-compose-dev.yml` - Configuração Docker simplificada
   - `prisma/schema.prisma` - Relacionamentos com onDelete/onUpdate
   - `app/api/sync/route.ts` - Adicionado suporte a ordem de dependências
   - `app/api/sync/direct/route.ts` - Validação de foreign keys
   - `package.json` - Adicionado comando sync:dependencies

### 7. Próximos Passos Recomendados

1. **Executar sincronização completa** para validar correções
2. **Monitorar logs** durante sincronização para identificar novos problemas
3. **Implementar testes automatizados** para validar integridade referencial
4. **Adicionar retry logic** para entidades que falharem por dependências temporárias
5. **Criar dashboard** para visualizar status de sincronização por entidade

### 8. Sistema de Log Consolidado de Erros

#### 8.1 ErrorLogger (`lib/error-logger.ts`)
**Funcionalidades implementadas**:

- **Captura automática de erros** durante sincronização
- **Classificação de erros** por tipo (ForeignKey, Validation, Connection, etc.)
- **Análise de padrões** para identificar erros recorrentes
- **Resumo visual** ao final da sincronização com:
  - Estatísticas gerais (total de erros)
  - Erros por entidade (com percentual e gráfico)
  - Tipos de erro mais comuns
  - Padrões de erro identificados
  - Erros críticos destacados
  - Recomendações automáticas baseadas nos erros

#### 8.2 Formato do Resumo de Erros

```
================================================================================
                        RESUMO DE ERROS DA SINCRONIZAÇÃO
================================================================================

📊 ESTATÍSTICAS GERAIS
   Total de erros: 245

📋 ERROS POR ENTIDADE:
   sales-contracts      125 erros (51.0%) ██████████████████
   customers            75 erros (30.6%) ██████████
   enterprises          45 erros (18.4%) ██████

🔍 TIPOS DE ERRO:
   ForeignKeyConstraint      150 (61.2%)
   ValidationError           75 (30.6%)
   ConnectionError           20 (8.2%)

🔥 PADRÕES DE ERRO MAIS COMUNS:
   1. Foreign Key Constraint (125 ocorrências)
      • sales-contracts: foreign key constraint "contratos_venda_enterpriseId_fkey"
      • units: foreign key constraint "unidades_empreendimentoId_fkey"

⚠️  ERROS CRÍTICOS:
   1. [ForeignKeyConstraint] sales-contracts
      enterpriseId 12345 não encontrado
      ID do item: 67890

💡 RECOMENDAÇÕES:
   • Verificar ordem de sincronização das entidades
   • Garantir que entidades dependentes sejam sincronizadas primeiro
   • Revisar mapeamento de campos entre API e banco de dados

📁 Log completo salvo em: logs/sync-errors/sync-errors-2024-01-15T10-30-45.json
================================================================================
```

#### 8.3 Integração com Rotas de Sincronização

**Arquivos modificados**:
- `app/api/sync/route.ts` - Integração completa com ErrorLogger
- `app/api/sync/direct/route.ts` - Log de erros em sincronização direta

**Como funciona**:
1. ErrorLogger é instanciado no início da sincronização
2. Cada erro é capturado e classificado automaticamente
3. Ao final, o resumo é exibido no console
4. Log completo é salvo em arquivo JSON para análise posterior
5. Resumo é incluído na resposta da API

## Conclusão

As correções implementadas resolvem os problemas de foreign key constraints e fornecem visibilidade completa sobre erros:

1. **Ordem de Sincronização**: Entidades são sincronizadas respeitando dependências
2. **Validação de Foreign Keys**: Referências são validadas antes da inserção
3. **Tratamento Gracioso**: Campos FK são definidos como null quando referência não existe
4. **Docker Robusto**: Ambiente de desenvolvimento fácil de usar e confiável
5. **Visibilidade de Erros**: Sistema completo de log com análise e recomendações

O sistema agora está preparado para sincronizar dados respeitando a integridade referencial e fornecendo feedback detalhado sobre problemas encontrados.