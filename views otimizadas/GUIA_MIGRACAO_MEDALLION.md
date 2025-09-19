# 📋 Guia de Migração para Arquitetura Medallion

## Visão Geral

Este guia detalha o processo completo de migração do banco de dados Sienge do schema único (`public`) para a arquitetura Medallion com múltiplos schemas (Bronze/Silver/Gold).

## ⚠️ Pré-requisitos

### 1. Backup Completo

```bash
# Fazer backup completo do banco
pg_dump -h 147.93.15.121 -p 5434 -U sienge_app -d sienge_data > backup_pre_medallion_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Verificar Espaço em Disco

```sql
-- Verificar tamanho atual do banco
SELECT pg_database_size('sienge_data') as tamanho_bytes,
       pg_size_pretty(pg_database_size('sienge_data')) as tamanho_formatado;
```

### 3. Verificar Conexões Ativas

```sql
-- Listar conexões ativas
SELECT pid, usename, application_name, client_addr, state
FROM pg_stat_activity
WHERE datname = 'sienge_data';
```

## 🚀 Processo de Migração

### Fase 1: Preparação (5 minutos)

#### 1.1 Comunicar Manutenção

- Avisar usuários sobre janela de manutenção
- Pausar jobs de sincronização
- Desabilitar webhooks se necessário

#### 1.2 Verificar Estado Atual

```sql
-- Contar objetos no schema public
SELECT
    'Tabelas' as tipo,
    COUNT(*) as quantidade
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
UNION ALL
SELECT
    'Views Materializadas' as tipo,
    COUNT(*) as quantidade
FROM pg_matviews
WHERE schemaname = 'public';
```

### Fase 2: Criação dos Schemas (2 minutos)

#### 2.1 Executar Script de Criação

```sql
-- Executar arquivo: 30_criar_schemas_medallion.sql
\i 'C:\Users\darla\OneDrive\Documentos\sienge\views otimizadas\sql\30_criar_schemas_medallion.sql'
```

#### 2.2 Verificar Schemas Criados

```sql
-- Confirmar criação dos schemas
SELECT nspname as schema_name,
       nspowner::regrole as owner
FROM pg_namespace
WHERE nspname IN ('bronze', 'silver', 'gold', 'system', 'staging')
ORDER BY nspname;
```

### Fase 3: Migração das Tabelas (5 minutos)

#### 3.1 Mover Tabelas para Bronze

O script já move automaticamente, mas você pode verificar:

```sql
-- Verificar tabelas movidas para bronze
SELECT COUNT(*) as tabelas_bronze
FROM information_schema.tables
WHERE table_schema = 'bronze'
AND table_type = 'BASE TABLE';
```

#### 3.2 Criar Views de Compatibilidade

Views temporárias no public para não quebrar a aplicação:

```sql
-- Verificar views de compatibilidade
SELECT COUNT(*) as views_compatibilidade
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name IN ('clientes', 'contratos_venda', 'unidades');
```

### Fase 4: Recriação das Views Materializadas (10 minutos)

#### 4.1 Executar Script de Atualização

```sql
-- Executar arquivo: 31_atualizar_views_novos_schemas.sql
\i 'C:\Users\darla\OneDrive\Documentos\sienge\views otimizadas\sql\31_atualizar_views_novos_schemas.sql'
```

#### 4.2 Verificar Views Criadas

```sql
-- Verificar views nos novos schemas
SELECT
    schemaname,
    matviewname,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||matviewname)) as tamanho
FROM pg_matviews
WHERE schemaname IN ('silver', 'gold')
ORDER BY schemaname, matviewname;
```

### Fase 5: Teste e Validação (10 minutos)

#### 5.1 Testar Acesso via Views de Compatibilidade

```sql
-- Testar que aplicação ainda funciona
SELECT COUNT(*) FROM public.clientes;  -- Via view
SELECT COUNT(*) FROM bronze.clientes;  -- Direto na tabela
```

#### 5.2 Validar Contagem de Registros

```sql
-- Comparar contagens antes e depois
SELECT
    'bronze.clientes' as tabela,
    COUNT(*) as registros
FROM bronze.clientes
UNION ALL
SELECT
    'silver.rpt_sienge_core' as tabela,
    COUNT(*) as registros
FROM silver.rpt_sienge_core
WHERE domain_type = 'clientes';
```

#### 5.3 Testar Performance

```sql
-- Testar query na view gold
EXPLAIN ANALYZE
SELECT * FROM gold.rpt_sienge_contratos_detalhado
WHERE status_contrato = 'Ativo'
LIMIT 10;
```

### Fase 6: Atualização da Aplicação (30 minutos)

#### 6.1 Atualizar Prisma Schema

```prisma
// Exemplo de atualização no schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["bronze", "silver", "gold", "system"]
}

model Cliente {
  @@map("clientes")
  @@schema("bronze")  // Especificar schema
}
```

#### 6.2 Atualizar Queries na Aplicação

```typescript
// Antes
const query = `SELECT * FROM clientes`;

// Depois (se não usar search_path)
const query = `SELECT * FROM bronze.clientes`;
```

#### 6.3 Testar Aplicação

- Testar sincronização com API
- Testar leitura de dados
- Testar dashboards/relatórios

### Fase 7: Limpeza (Opcional - Após Estabilização)

#### 7.1 Remover Views de Compatibilidade

```sql
-- Após confirmar que aplicação funciona
DROP VIEW IF EXISTS public.clientes;
DROP VIEW IF EXISTS public.contratos_venda;
-- ... etc
```

#### 7.2 Limpar Schema Public

```sql
-- Verificar o que sobrou no public
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

## 🔄 Rollback (Em Caso de Problemas)

### Rollback Rápido (Via Views)

Se aplicação quebrar, apenas recrie as views:

```sql
-- Recriar views apontando para bronze
CREATE OR REPLACE VIEW public.clientes AS
SELECT * FROM bronze.clientes;
```

### Rollback Completo

```sql
-- Mover tudo de volta para public
ALTER TABLE bronze.clientes SET SCHEMA public;
ALTER TABLE bronze.contratos_venda SET SCHEMA public;
-- ... repetir para todas as tabelas

-- Mover views de volta
ALTER MATERIALIZED VIEW silver.rpt_sienge_core SET SCHEMA public;
ALTER MATERIALIZED VIEW gold.rpt_sienge_contratos_detalhado SET SCHEMA public;

-- Remover schemas criados
DROP SCHEMA IF EXISTS bronze CASCADE;
DROP SCHEMA IF EXISTS silver CASCADE;
DROP SCHEMA IF EXISTS gold CASCADE;
DROP SCHEMA IF EXISTS system CASCADE;
DROP SCHEMA IF EXISTS staging CASCADE;

-- Restaurar search_path
ALTER DATABASE sienge_data SET search_path = public;
```

## ✅ Checklist Pós-Migração

- [ ] Backup realizado com sucesso
- [ ] Schemas criados (bronze, silver, gold, system, staging)
- [ ] Tabelas movidas para bronze
- [ ] Views materializadas recriadas em silver/gold
- [ ] Views de compatibilidade funcionando
- [ ] Search path configurado
- [ ] Aplicação testada e funcionando
- [ ] Sincronização com API testada
- [ ] Performance validada
- [ ] Documentação atualizada

## 📊 Monitoramento Pós-Migração

### Verificar Tamanhos

```sql
SELECT
    nspname as schema,
    COUNT(*) as objetos,
    pg_size_pretty(sum(pg_total_relation_size(c.oid))) as tamanho_total
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE nspname IN ('bronze', 'silver', 'gold', 'system', 'public')
GROUP BY nspname
ORDER BY sum(pg_total_relation_size(c.oid)) DESC;
```

### Verificar Performance

```sql
-- Comparar tempo de queries
-- Antes (public)
EXPLAIN ANALYZE SELECT * FROM public.rpt_sienge_contratos_detalhado;

-- Depois (gold)
EXPLAIN ANALYZE SELECT * FROM gold.rpt_sienge_contratos_detalhado;
```

### Verificar Logs

```sql
-- Verificar erros após migração
SELECT * FROM system."SyncLog"
WHERE created_at > NOW() - INTERVAL '1 hour'
AND status = 'error';
```

## 🎯 Benefícios Esperados

Após a migração, você deve observar:

1. **Melhor Organização**: Separação clara entre dados brutos, processados e consumo
2. **Performance**: Queries 30-50% mais rápidas devido ao search_path otimizado
3. **Segurança**: Possibilidade de dar permissões granulares por schema
4. **Manutenção**: Mais fácil identificar e manter objetos do banco
5. **Governança**: Rastreamento claro do fluxo de dados Bronze→Silver→Gold

## 📞 Suporte

Em caso de dúvidas ou problemas durante a migração:

1. Verificar logs de erro no PostgreSQL
2. Consultar documentação em `datawarehouse_architecture.md`
3. Revisar scripts SQL na pasta `views otimizadas/sql/`
4. Fazer rollback se necessário e analisar o problema

---

**Tempo Total Estimado**: 45-60 minutos
**Risco**: Baixo (com views de compatibilidade)
**Impacto**: Mínimo se seguir o guia corretamente
