# 🚀 Guia Completo de Deploy - Looker Studio Connector V3

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Passo a Passo do Deploy](#passo-a-passo)
4. [Configuração do Looker Studio](#looker-studio)
5. [Testes e Validação](#testes)
6. [Troubleshooting](#troubleshooting)
7. [Manutenção](#manutenção)

## 🎯 Visão Geral <a name="visão-geral"></a>

### O que foi implementado:

- ✅ **View Materializada** `rpt_sienge_master_wide` com 4.393 registros
- ✅ **Novos campos normalizados**: comissões, financiamento, indicadores temporais
- ✅ **API Endpoint** otimizado em `/api/datawarehouse/master`
- ✅ **AppScript V3** com cache e todos os campos novos
- ✅ **Refresh automático** configurado para rodar diariamente

### Arquitetura:

```
PostgreSQL (Prod) → View Materializada → API Next.js → AppScript → Looker Studio
```

## 📦 Pré-requisitos <a name="pré-requisitos"></a>

1. **Acesso ao Banco de Dados**
   - Host: `147.93.15.121`
   - Port: `5434`
   - Database: `sienge_data`
   - User: `sienge_app`

2. **Acesso ao Google Apps Script**
   - Conta Google com permissão de criar scripts
   - Editor do Apps Script: https://script.google.com

3. **Acesso ao Looker Studio**
   - Conta Google com Looker Studio habilitado
   - https://lookerstudio.google.com

## 📝 Passo a Passo do Deploy <a name="passo-a-passo"></a>

### PASSO 1: Verificar View Materializada

```bash
# Conectar ao banco
export PGPASSWORD=kPnrGuFeJeuVprXzhhO2oLVE14f509KV
psql -h 147.93.15.121 -p 5434 -U sienge_app -d sienge_data --set=sslmode=disable

# Verificar view
SELECT COUNT(*) FROM rpt_sienge_master_wide;
# Esperado: 4393 registros

# Verificar dados por domínio
SELECT domain_type, COUNT(*) FROM rpt_sienge_master_wide GROUP BY domain_type;
```

### PASSO 2: Configurar Refresh Automático (Linux/Docker)

1. **Copiar script de refresh**:

```bash
cp scripts/refresh-view-cron.sh /opt/sienge/scripts/
chmod +x /opt/sienge/scripts/refresh-view-cron.sh
```

2. **Adicionar ao crontab**:

```bash
crontab -e
# Adicionar linha:
0 6 * * * /opt/sienge/scripts/refresh-view-cron.sh
```

### PASSO 3: Deploy do AppScript

1. **Acessar Google Apps Script**: https://script.google.com

2. **Criar novo projeto**:
   - Nome: "Sienge Looker Connector V3"

3. **Copiar código**:
   - Deletar conteúdo padrão
   - Colar todo o conteúdo de `Code_v3.gs`

4. **Configurar URL da API**:
   - Linha 11: Atualizar `API_URL` para sua URL de produção

   ```javascript
   API_URL: 'https://conector.catometrics.com.br/api/datawarehouse/master',
   ```

5. **Adicionar emails de admin**:
   - Linha 15: Adicionar emails autorizados

   ```javascript
   ADMIN_EMAILS: ['darlan@catofe.com.br', 'outro@email.com'];
   ```

6. **Salvar e Deploy**:
   - Arquivo → Salvar
   - Deploy → Nova implantação
   - Tipo: "Complemento do Editor"
   - Descrição: "Versão 3.0 - Campos normalizados"
   - Executar como: "Usuário que acessa o app"
   - Acesso: "Qualquer pessoa"
   - Clicar em "Implantar"

7. **Copiar ID do Deployment**:
   - Será algo como: `AKfycbw...`
   - Guardar este ID!

### PASSO 4: Configurar no Looker Studio <a name="looker-studio"></a>

1. **Acessar Looker Studio**: https://lookerstudio.google.com

2. **Criar fonte de dados**:
   - Clicar em "Criar" → "Fonte de dados"
   - Buscar "Build your own"
   - Clicar em "Community Connectors"

3. **Adicionar conector**:
   - URL do conector: `https://datastudio.google.com/datasources/create?connectorId=YOUR_DEPLOYMENT_ID`
   - Substituir `YOUR_DEPLOYMENT_ID` pelo ID copiado

4. **Autorizar e conectar**:
   - Autorizar acesso
   - Não há configurações adicionais (automático)
   - Clicar em "Conectar"

5. **Verificar campos**:
   - Devem aparecer todos os grupos:
     - Data (6 campos)
     - Empresas (5 campos)
     - Contratos (9 campos)
     - Financeiro (8 campos)
     - Comissões (4 campos) - NOVO
     - Performance (1 campo)
     - Clientes (2 campos)
     - Empreendimentos (2 campos)
     - Unidades (3 campos)
     - Indicadores (2 campos) - NOVO
     - Metadados (2 campos)

## 🧪 Testes e Validação <a name="testes"></a>

### Teste 1: Verificar Dados na API

```bash
# Testar API local
curl http://localhost:3001/api/datawarehouse/master | python -m json.tool | head -20

# Testar API produção
curl https://conector.catometrics.com.br/api/datawarehouse/master | python -m json.tool | head -20
```

### Teste 2: Validar no AppScript

1. No editor do Apps Script:
2. Executar função `testConnection()`
3. Ver logs em: Ver → Logs
4. Deve retornar: "✅ Conexão bem-sucedida! Versão 3.0"

### Teste 3: Criar Dashboard de Teste

1. No Looker Studio, criar novo relatório
2. Adicionar gráficos básicos:
   - Scorecard: Total de Contratos (COUNT de unique_id onde domain_type = 'contratos')
   - Gráfico de linha: Contratos por Mês (data_principal)
   - Tabela: Top 10 Contratos por Valor
   - Gráfico de pizza: Distribuição por Forma de Pagamento

### Teste 4: Verificar Novos Campos

Criar visualizações específicas para campos novos:

- **Comissões**: Gráfico de barras por faixa_valor_comissao
- **Financiamento**: Scorecard com % de contratos com financiamento
- **Status Pagamento**: Gráfico de funil por status_pagamento
- **Indicadores**: Média de dias_desde_contrato

## 🔧 Troubleshooting <a name="troubleshooting"></a>

### Problema: "View não encontrada"

```sql
-- Recriar view
\i sql/create_materialized_view.sql
```

### Problema: "Dados desatualizados"

```sql
-- Refresh manual
REFRESH MATERIALIZED VIEW CONCURRENTLY rpt_sienge_master_wide;
```

### Problema: "Erro de timeout no Looker"

- Verificar se há menos de 50.000 registros
- Aumentar cache no AppScript
- Filtrar por período menor

### Problema: "Campos não aparecem"

1. Verificar schema no AppScript
2. Reconectar fonte de dados
3. Atualizar cache do Looker Studio

### Problema: "Erro 500 na API"

```bash
# Verificar logs
docker logs sienge-app-1 --tail 100

# Verificar conexão com DB
psql -h 147.93.15.121 -p 5434 -U sienge_app -d sienge_data --set=sslmode=disable -c "SELECT 1"
```

## 🔄 Manutenção <a name="manutenção"></a>

### Diária (Automática)

- ✅ Refresh da view materializada às 6h

### Semanal (Manual)

- Verificar logs de refresh
- Monitorar performance das queries
- Verificar crescimento da view

### Mensal

- Atualizar estatísticas do banco:

```sql
ANALYZE rpt_sienge_master_wide;
VACUUM ANALYZE rpt_sienge_master_wide;
```

- Verificar índices:

```sql
SELECT indexname, indexdef FROM pg_indexes
WHERE tablename = 'rpt_sienge_master_wide';
```

### Quando adicionar novos campos

1. Atualizar view materializada:

```sql
DROP MATERIALIZED VIEW rpt_sienge_master_wide CASCADE;
CREATE MATERIALIZED VIEW rpt_sienge_master_wide AS ...
```

2. Atualizar AppScript:
   - Adicionar campo no `getSchema()`
   - Adicionar case no `formatRowForLookerStudio()`

3. Re-deploy no Apps Script

4. Reconectar no Looker Studio

## 📊 Métricas de Sucesso

### Performance

- ✅ Tempo de carregamento < 3 segundos
- ✅ Cache funcionando (30 minutos)
- ✅ Refresh diário completando em < 3 minutos

### Dados

- ✅ 4.393 registros totais
- ✅ 4 domínios ativos (contratos, clientes, unidades, empreendimentos)
- ✅ Todos os campos novos disponíveis

### Uso

- Dashboards responsivos
- Filtros funcionando corretamente
- Agregações precisas

## 🆘 Suporte

### Logs importantes:

- API: `/var/log/sienge/api.log`
- Refresh: `/var/log/sienge/refresh_view_*.log`
- AppScript: Ver → Logs no editor

### Contatos:

- Email: darlan@catofe.com.br
- Documentação: `/looker-studio-connector/README.md`

---

## 🎉 Checklist Final

- [ ] View materializada criada e populada
- [ ] Refresh automático configurado
- [ ] API respondendo corretamente
- [ ] AppScript deployado
- [ ] Conector adicionado ao Looker Studio
- [ ] Dashboard de teste criado
- [ ] Novos campos validados
- [ ] Documentação atualizada

**Versão:** 3.0
**Data:** 18/09/2025
**Status:** PRONTO PARA PRODUÇÃO 🚀
