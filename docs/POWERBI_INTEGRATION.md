# Integração PowerBI - Tabelas Automatizadas

## Visão Geral

Este documento descreve a implementação de tabelas otimizadas para PowerBI que se atualizam automaticamente todos os dias, baseadas nos dados sincronizados da API Sienge.

## Estratégia Recomendada: Views Materializadas + ETL Diário

### 1. Estrutura das Tabelas PowerBI

As views materializadas no PostgreSQL "achatam" os dados complexos das APIs atuais para otimizar a performance no PowerBI.

#### Exemplo: `powerbi_companies`

```sql
CREATE MATERIALIZED VIEW powerbi_companies AS
SELECT
  e.idEmpresa,
  e.nomeEmpresa,
  e.cnpj,
  e.nomeFantasia,
  e.codigoEmpresa,
  e.ativo,
  COUNT(c.idCliente) as total_clientes,
  COUNT(tp.idTituloPagar) as total_titulos_pagar,
  COUNT(tr.idTituloReceber) as total_titulos_receber,
  CURRENT_TIMESTAMP as ultima_atualizacao
FROM empresas e
LEFT JOIN clientes c ON e.idEmpresa = c.idEmpresa
LEFT JOIN titulos_pagar tp ON e.idEmpresa = tp.idEmpresa
LEFT JOIN titulos_receber tr ON e.idEmpresa = tr.idEmpresa
GROUP BY e.idEmpresa, e.nomeEmpresa, e.cnpj, e.nomeFantasia, e.codigoEmpresa, e.ativo;
```

#### Exemplo: `powerbi_customers`

```sql
CREATE MATERIALIZED VIEW powerbi_customers AS
SELECT
  c.idCliente,
  c.nomeCompleto,
  c.cpfCnpj,
  c.email,
  c.dataNascimento,
  c.ativo,
  c.dataCadastro,
  tc.descricao as tipo_cliente,
  p.nomeProfissao,
  ec.descricao as estado_civil,
  e.nomeEmpresa,
  CURRENT_TIMESTAMP as ultima_atualizacao
FROM clientes c
LEFT JOIN tipo_cliente tc ON c.idTipoCliente = tc.idTipoCliente
LEFT JOIN profissao p ON c.idProfissao = p.idProfissao
LEFT JOIN estado_civil ec ON c.idEstadoCivil = ec.idEstadoCivil
LEFT JOIN empresas e ON c.idEmpresa = e.idEmpresa;
```

#### Exemplo: `powerbi_payables`

```sql
CREATE MATERIALIZED VIEW powerbi_payables AS
SELECT
  tp.idTituloPagar,
  tp.numeroDocumento,
  tp.dataEmissao,
  tp.dataVencimento,
  tp.valorOriginal,
  tp.valorAtualizado,
  tp.valorPago,
  tp.dataPagamento,
  tp.status,
  tp.observacao,
  cr.nomeCredor,
  cr.cpfCnpj as credor_cpf_cnpj,
  pf.nomePlano as plano_financeiro,
  idx.nomeIndexador,
  e.nomeEmpresa,
  CURRENT_TIMESTAMP as ultima_atualizacao
FROM titulos_pagar tp
LEFT JOIN credor cr ON tp.idCredor = cr.idCredor
LEFT JOIN plano_financeiro pf ON tp.idPlanoFinanceiro = pf.idPlanoFinanceiro
LEFT JOIN indexador idx ON tp.idIndexador = idx.idIndexador
LEFT JOIN empresas e ON tp.idEmpresa = e.idEmpresa;
```

#### Exemplo: `powerbi_receivables`

```sql
CREATE MATERIALIZED VIEW powerbi_receivables AS
SELECT
  tr.idTituloReceber,
  tr.numeroDocumento,
  tr.dataEmissao,
  tr.dataVencimento,
  tr.valorOriginal,
  tr.valorAtualizado,
  tr.valorPago,
  tr.dataPagamento,
  tr.status,
  tr.observacao,
  c.nomeCompleto as cliente_nome,
  c.cpfCnpj as cliente_cpf_cnpj,
  pf.nomePlano as plano_financeiro,
  idx.nomeIndexador,
  e.nomeEmpresa,
  CURRENT_TIMESTAMP as ultima_atualizacao
FROM titulos_receber tr
LEFT JOIN clientes c ON tr.idCliente = c.idCliente
LEFT JOIN plano_financeiro pf ON tr.idPlanoFinanceiro = pf.idPlanoFinanceiro
LEFT JOIN indexador idx ON tr.idIndexador = idx.idIndexador
LEFT JOIN empresas e ON tr.idEmpresa = e.idEmpresa;
```

### 2. Sistema de Atualização Automática

#### A. Novo Endpoint de ETL

```typescript
// app/api/powerbi/refresh/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('[PowerBI] Iniciando refresh das views materializadas...');

    // 1. Refresh das views materializadas
    await prisma.$executeRaw`REFRESH MATERIALIZED VIEW powerbi_companies`;
    await prisma.$executeRaw`REFRESH MATERIALIZED VIEW powerbi_customers`;
    await prisma.$executeRaw`REFRESH MATERIALIZED VIEW powerbi_payables`;
    await prisma.$executeRaw`REFRESH MATERIALIZED VIEW powerbi_receivables`;
    await prisma.$executeRaw`REFRESH MATERIALIZED VIEW powerbi_sales_contracts`;

    // 2. Log da operação
    await prisma.powerBILog.create({
      data: {
        status: 'completed',
        viewsUpdated: [
          'powerbi_companies',
          'powerbi_customers',
          'powerbi_payables',
          'powerbi_receivables',
          'powerbi_sales_contracts',
        ],
        refreshCompletedAt: new Date(),
      },
    });

    console.log('[PowerBI] Views atualizadas com sucesso');
    return NextResponse.json({
      success: true,
      message: 'Views PowerBI atualizadas com sucesso',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[PowerBI] Erro ao atualizar views:', error);

    // Log de erro
    await prisma.powerBILog.create({
      data: {
        status: 'failed',
        errorMessage:
          error instanceof Error ? error.message : 'Erro desconhecido',
      },
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
```

#### B. Cron Job Diário

```typescript
// scripts/powerbi-refresh.js
const cron = require('node-cron');

// Executar às 3:00 AM todos os dias
cron.schedule('0 3 * * *', async () => {
  try {
    console.log('[PowerBI] Iniciando refresh das views...');

    const response = await fetch('http://localhost:3000/api/powerbi/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN || 'dev-token'}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('[PowerBI] Views atualizadas com sucesso:', result.message);
    } else {
      console.error('[PowerBI] Erro ao atualizar views:', response.status);
    }
  } catch (error) {
    console.error('[PowerBI] Erro no cron job:', error);
  }
});

console.log(
  '[PowerBI] Cron job configurado para executar às 3:00 AM diariamente'
);
```

### 3. Modificações Necessárias no Código

#### A. Schema Prisma (Adicionar)

```prisma
// Adicionar ao schema.prisma
model PowerBILog {
  id                Int       @id @default(autoincrement())
  refreshStartedAt  DateTime  @default(now())
  refreshCompletedAt DateTime?
  status            String    // 'completed', 'failed', 'in_progress'
  viewsUpdated      String[]  // Array com nomes das views atualizadas
  errorMessage      String?

  @@index([refreshStartedAt])
  @@index([status])
  @@map("powerbi_logs")
}
```

#### B. Script de Inicialização

```typescript
// scripts/setup-powerbi-tables.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupPowerBITables() {
  console.log('[PowerBI] Configurando views materializadas...');

  const views = [
    'powerbi_companies',
    'powerbi_customers',
    'powerbi_payables',
    'powerbi_receivables',
    'powerbi_sales_contracts',
  ];

  for (const view of views) {
    try {
      // Verificar se a view existe
      const result = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = ${view}
        );
      `;

      if (result[0].exists) {
        await prisma.$executeRaw`REFRESH MATERIALIZED VIEW ${view}`;
        console.log(`✅ View ${view} atualizada`);
      } else {
        console.log(
          `⚠️  View ${view} não existe - será criada no primeiro refresh`
        );
      }
    } catch (error) {
      console.error(`❌ Erro na view ${view}:`, error);
    }
  }

  console.log('[PowerBI] Setup concluído');
}

setupPowerBITables()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

#### C. Arquivo SQL das Views

```sql
-- lib/powerbi/sql-views.sql
-- Este arquivo contém todas as definições das views materializadas

-- View para empresas
CREATE MATERIALIZED VIEW IF NOT EXISTS powerbi_companies AS
SELECT
  e.idEmpresa,
  e.nomeEmpresa,
  e.cnpj,
  e.nomeFantasia,
  e.codigoEmpresa,
  e.ativo,
  COUNT(DISTINCT c.idCliente) as total_clientes,
  COUNT(DISTINCT tp.idTituloPagar) as total_titulos_pagar,
  COUNT(DISTINCT tr.idTituloReceber) as total_titulos_receber,
  SUM(COALESCE(tp.valorOriginal, 0)) as total_valor_pagar,
  SUM(COALESCE(tr.valorOriginal, 0)) as total_valor_receber,
  CURRENT_TIMESTAMP as ultima_atualizacao
FROM empresas e
LEFT JOIN clientes c ON e.idEmpresa = c.idEmpresa AND c.ativo = true
LEFT JOIN titulos_pagar tp ON e.idEmpresa = tp.idEmpresa
LEFT JOIN titulos_receber tr ON e.idEmpresa = tr.idEmpresa
GROUP BY e.idEmpresa, e.nomeEmpresa, e.cnpj, e.nomeFantasia, e.codigoEmpresa, e.ativo;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_powerbi_companies_ativo ON powerbi_companies(ativo);
CREATE INDEX IF NOT EXISTS idx_powerbi_companies_nome ON powerbi_companies(nomeEmpresa);

-- View para clientes
CREATE MATERIALIZED VIEW IF NOT EXISTS powerbi_customers AS
SELECT
  c.idCliente,
  c.nomeCompleto,
  c.nomeSocial,
  c.cpfCnpj,
  c.email,
  c.dataNascimento,
  c.nacionalidade,
  c.ativo,
  c.dataCadastro,
  tc.descricao as tipo_cliente,
  p.nomeProfissao,
  ec.descricao as estado_civil,
  e.nomeEmpresa,
  e.idEmpresa,
  -- Campos calculados
  EXTRACT(YEAR FROM AGE(c.dataNascimento)) as idade,
  EXTRACT(YEAR FROM c.dataCadastro) as ano_cadastro,
  CURRENT_TIMESTAMP as ultima_atualizacao
FROM clientes c
LEFT JOIN tipo_cliente tc ON c.idTipoCliente = tc.idTipoCliente
LEFT JOIN profissao p ON c.idProfissao = p.idProfissao
LEFT JOIN estado_civil ec ON c.idEstadoCivil = ec.idEstadoCivil
LEFT JOIN empresas e ON c.idEmpresa = e.idEmpresa;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_powerbi_customers_ativo ON powerbi_customers(ativo);
CREATE INDEX IF NOT EXISTS idx_powerbi_customers_empresa ON powerbi_customers(idEmpresa);
CREATE INDEX IF NOT EXISTS idx_powerbi_customers_tipo ON powerbi_customers(tipo_cliente);

-- View para títulos a pagar
CREATE MATERIALIZED VIEW IF NOT EXISTS powerbi_payables AS
SELECT
  tp.idTituloPagar,
  tp.numeroDocumento,
  tp.dataEmissao,
  tp.dataVencimento,
  tp.valorOriginal,
  tp.valorAtualizado,
  tp.valorPago,
  tp.dataPagamento,
  tp.status,
  tp.observacao,
  cr.nomeCredor,
  cr.cpfCnpj as credor_cpf_cnpj,
  pf.nomePlano as plano_financeiro,
  idx.nomeIndexador,
  e.nomeEmpresa,
  e.idEmpresa,
  -- Campos calculados
  (tp.valorAtualizado - COALESCE(tp.valorPago, 0)) as valor_em_aberto,
  CASE
    WHEN tp.dataPagamento IS NOT NULL THEN 'Pago'
    WHEN tp.dataVencimento < CURRENT_DATE THEN 'Vencido'
    WHEN tp.dataVencimento <= CURRENT_DATE + INTERVAL '30 days' THEN 'Vencendo'
    ELSE 'Em dia'
  END as status_calculado,
  EXTRACT(MONTH FROM tp.dataVencimento) as mes_vencimento,
  EXTRACT(YEAR FROM tp.dataVencimento) as ano_vencimento,
  CURRENT_TIMESTAMP as ultima_atualizacao
FROM titulos_pagar tp
LEFT JOIN credor cr ON tp.idCredor = cr.idCredor
LEFT JOIN plano_financeiro pf ON tp.idPlanoFinanceiro = pf.idPlanoFinanceiro
LEFT JOIN indexador idx ON tp.idIndexador = idx.idIndexador
LEFT JOIN empresas e ON tp.idEmpresa = e.idEmpresa;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_powerbi_payables_status ON powerbi_payables(status);
CREATE INDEX IF NOT EXISTS idx_powerbi_payables_vencimento ON powerbi_payables(dataVencimento);
CREATE INDEX IF NOT EXISTS idx_powerbi_payables_empresa ON powerbi_payables(idEmpresa);

-- View para títulos a receber
CREATE MATERIALIZED VIEW IF NOT EXISTS powerbi_receivables AS
SELECT
  tr.idTituloReceber,
  tr.numeroDocumento,
  tr.dataEmissao,
  tr.dataVencimento,
  tr.valorOriginal,
  tr.valorAtualizado,
  tr.valorPago,
  tr.dataPagamento,
  tr.status,
  tr.observacao,
  c.nomeCompleto as cliente_nome,
  c.cpfCnpj as cliente_cpf_cnpj,
  pf.nomePlano as plano_financeiro,
  idx.nomeIndexador,
  e.nomeEmpresa,
  e.idEmpresa,
  -- Campos calculados
  (tr.valorAtualizado - COALESCE(tr.valorPago, 0)) as valor_em_aberto,
  CASE
    WHEN tr.dataPagamento IS NOT NULL THEN 'Recebido'
    WHEN tr.dataVencimento < CURRENT_DATE THEN 'Vencido'
    WHEN tr.dataVencimento <= CURRENT_DATE + INTERVAL '30 days' THEN 'Vencendo'
    ELSE 'Em dia'
  END as status_calculado,
  EXTRACT(MONTH FROM tr.dataVencimento) as mes_vencimento,
  EXTRACT(YEAR FROM tr.dataVencimento) as ano_vencimento,
  CURRENT_TIMESTAMP as ultima_atualizacao
FROM titulos_receber tr
LEFT JOIN clientes c ON tr.idCliente = c.idCliente
LEFT JOIN plano_financeiro pf ON tr.idPlanoFinanceiro = pf.idPlanoFinanceiro
LEFT JOIN indexador idx ON tr.idIndexador = idx.idIndexador
LEFT JOIN empresas e ON tr.idEmpresa = e.idEmpresa;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_powerbi_receivables_status ON powerbi_receivables(status);
CREATE INDEX IF NOT EXISTS idx_powerbi_receivables_vencimento ON powerbi_receivables(dataVencimento);
CREATE INDEX IF NOT EXISTS idx_powerbi_receivables_empresa ON powerbi_receivables(idEmpresa);

-- View para contratos de venda
CREATE MATERIALIZED VIEW IF NOT EXISTS powerbi_sales_contracts AS
SELECT
  cv.idContratoVenda,
  cv.numeroContrato,
  cv.dataContrato,
  cv.dataInicioObra,
  cv.dataPrevistaTermino,
  cv.dataRealTermino,
  cv.valorContrato,
  cv.valorEntrada,
  cv.valorFinanciado,
  cv.status,
  cv.observacao,
  c.nomeCompleto as cliente_nome,
  c.cpfCnpj as cliente_cpf_cnpj,
  e.nomeEmpresa,
  e.idEmpresa,
  emp.nomeEmpreendimento,
  -- Campos calculados
  CASE
    WHEN cv.dataRealTermino IS NOT NULL THEN 'Concluído'
    WHEN cv.dataPrevistaTermino < CURRENT_DATE THEN 'Atrasado'
    WHEN cv.dataPrevistaTermino <= CURRENT_DATE + INTERVAL '30 days' THEN 'Finalizando'
    ELSE 'Em andamento'
  END as status_calculado,
  EXTRACT(YEAR FROM cv.dataContrato) as ano_contrato,
  CURRENT_TIMESTAMP as ultima_atualizacao
FROM contrato_venda cv
LEFT JOIN clientes c ON cv.idCliente = c.idCliente
LEFT JOIN empresas e ON cv.idEmpresa = e.idEmpresa
LEFT JOIN empreendimento emp ON cv.idEmpreendimento = emp.idEmpreendimento;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_powerbi_contracts_status ON powerbi_sales_contracts(status);
CREATE INDEX IF NOT EXISTS idx_powerbi_contracts_data ON powerbi_sales_contracts(dataContrato);
CREATE INDEX IF NOT EXISTS idx_powerbi_contracts_empresa ON powerbi_sales_contracts(idEmpresa);
```

### 4. Configuração do Cron Job

#### A. Docker Compose (Adicionar serviço)

```yaml
# docker-compose.yml - Adicionar este serviço
services:
  powerbi-refresh:
    build: .
    command: node scripts/powerbi-refresh.js
    depends_on:
      - app
      - db
    restart: unless-stopped
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REFRESH_URL=http://app:3000/api/powerbi/refresh
      - INTERNAL_API_TOKEN=${INTERNAL_API_TOKEN}
    networks:
      - sienge-network
    volumes:
      - ./scripts:/app/scripts
```

#### B. Package.json (Adicionar scripts)

```json
{
  "scripts": {
    "powerbi:setup": "node scripts/setup-powerbi-tables.js",
    "powerbi:refresh": "node scripts/powerbi-refresh.js",
    "powerbi:create-views": "psql $DATABASE_URL -f lib/powerbi/sql-views.sql"
  },
  "dependencies": {
    "node-cron": "^3.0.3"
  }
}
```

#### C. Variáveis de Ambiente

```bash
# .env - Adicionar
INTERNAL_API_TOKEN=your-secure-token-here
POWERBI_REFRESH_SCHEDULE=0 3 * * *  # 3:00 AM diariamente
```

### 5. Conexão PowerBI

#### A. Configuração de Conexão

- **Tipo**: PostgreSQL Database
- **Servidor**: `localhost:5432` (ou IP do servidor)
- **Database**: `sienge_data`
- **Usuário**: `sienge_app`
- **Senha**: `${DB_PASSWORD}`
- **Tabelas**:
  - `powerbi_companies`
  - `powerbi_customers`
  - `powerbi_payables`
  - `powerbi_receivables`
  - `powerbi_sales_contracts`

#### B. Atualização Automática PowerBI

1. Configurar refresh automático no PowerBI Service
2. Conectar com as views materializadas
3. Agendar refresh para 4:00 AM (após o ETL às 3:00 AM)
4. Configurar refresh incremental baseado em `ultima_atualizacao`

### 6. Monitoramento e Logs

#### A. Endpoint de Status

```typescript
// app/api/powerbi/status/route.ts
export async function GET() {
  try {
    const lastRefresh = await prisma.powerBILog.findFirst({
      orderBy: { refreshStartedAt: 'desc' },
      select: {
        refreshStartedAt: true,
        refreshCompletedAt: true,
        status: true,
        viewsUpdated: true,
        errorMessage: true,
      },
    });

    return NextResponse.json({
      success: true,
      lastRefresh,
      nextScheduled: '03:00 AM (daily)',
      views: [
        'powerbi_companies',
        'powerbi_customers',
        'powerbi_payables',
        'powerbi_receivables',
        'powerbi_sales_contracts',
      ],
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
```

#### B. Dashboard de Monitoramento

- Acesse `/api/powerbi/status` para verificar status
- Logs detalhados em `powerbi_logs` no banco
- Alertas em caso de falha na atualização

### 7. Benefícios desta Abordagem

✅ **Performance**: Views materializadas são pré-calculadas  
✅ **Consistência**: Dados sempre atualizados diariamente  
✅ **Simplicidade**: PowerBI acessa tabelas "flat"  
✅ **Manutenibilidade**: Reutiliza lógica existente das APIs  
✅ **Escalabilidade**: Fácil adicionar novas views  
✅ **Monitoramento**: Logs detalhados de todas as operações  
✅ **Flexibilidade**: Pode ser executado manualmente via API

### 8. Arquivos que Precisam ser Criados/Modificados

#### Novos Arquivos:

- `app/api/powerbi/refresh/route.ts`
- `app/api/powerbi/status/route.ts`
- `scripts/powerbi-refresh.js`
- `scripts/setup-powerbi-tables.js`
- `lib/powerbi/sql-views.sql`

#### Arquivos Modificados:

- `prisma/schema.prisma` (adicionar PowerBILog)
- `docker-compose.yml` (adicionar serviço powerbi-refresh)
- `package.json` (adicionar scripts e dependência node-cron)
- `.env` (adicionar INTERNAL_API_TOKEN)

### 9. Cronograma de Implementação

#### Semana 1: Infraestrutura Base

- [ ] Criar schema PowerBILog no Prisma
- [ ] Implementar endpoint de refresh
- [ ] Criar arquivo SQL das views
- [ ] Testar criação das views manualmente

#### Semana 2: Automação

- [ ] Implementar script de refresh automático
- [ ] Configurar cron job no Docker
- [ ] Implementar logs e monitoramento
- [ ] Testar execução automática

#### Semana 3: Integração PowerBI

- [ ] Conectar PowerBI às views
- [ ] Configurar refresh automático no PowerBI
- [ ] Criar dashboards de teste
- [ ] Validar dados e performance

#### Semana 4: Produção

- [ ] Deploy em produção
- [ ] Configurar alertas de monitoramento
- [ ] Documentar procedimentos de manutenção
- [ ] Treinar equipe no uso

### 10. Comandos Úteis

```bash
# Setup inicial
npm run powerbi:create-views
npm run powerbi:setup

# Refresh manual
curl -X POST http://localhost:3000/api/powerbi/refresh

# Verificar status
curl http://localhost:3000/api/powerbi/status

# Logs do Docker
docker logs sienge-powerbi-refresh

# Conectar ao banco para verificar views
psql $DATABASE_URL -c "\dt powerbi_*"
```

### 11. Troubleshooting

#### Problema: Views não são criadas

**Solução**: Executar manualmente o arquivo SQL

```bash
psql $DATABASE_URL -f lib/powerbi/sql-views.sql
```

#### Problema: Cron job não executa

**Solução**: Verificar logs do container

```bash
docker logs sienge-powerbi-refresh
```

#### Problema: PowerBI não conecta

**Solução**: Verificar configurações de rede e credenciais do PostgreSQL

#### Problema: Performance lenta

**Solução**: Verificar índices e otimizar queries das views

---

Esta implementação aproveita toda a infraestrutura existente de sincronização e adiciona uma camada otimizada especificamente para PowerBI, garantindo dados atualizados e performance adequada para análise de negócios.
