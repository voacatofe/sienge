# 🗄️ Configuração do DbVisualizer para Sienge

Este documento explica como configurar o DbVisualizer para conectar ao banco de dados PostgreSQL do projeto Sienge.

## 📋 Pré-requisitos

1. **DbVisualizer instalado** - Download em: https://www.dbvis.com/download/
2. **PostgreSQL rodando** via Docker Compose
3. **Dados de conexão** do projeto

## 🔧 Configuração da Conexão

### **1. Dados de Conexão:**

```
Connection Name: Sienge PostgreSQL
Database Type: PostgreSQL
Server: localhost
Port: 5432
Database: sienge_data
Username: sienge_app
Password: kPnrGuFeJeuVprXzhhO2oLVE14f509KV
```

### **2. Passos para Configurar:**

1. **Abra o DbVisualizer**
2. **Clique em "Create Connection"**
3. **Selecione "PostgreSQL" como tipo de banco**
4. **Preencha os dados acima**
5. **Clique em "Test Connection"** para verificar
6. **Salve a conexão**

## 📊 Tabelas Principais do Sienge

### **Tabelas de Sincronização:**

- `sync_logs` - Logs de sincronização
- `api_credentials` - Credenciais da API

### **Dados do Sienge:**

- `empresas` - Empresas
- `clientes` - Clientes
- `contratos_venda` - Contratos de venda
- `unidades_imobiliarias` - Unidades imobiliárias
- `titulos_receber` - Títulos a receber
- `titulos_pagar` - Títulos a pagar
- `empreendimentos` - Empreendimentos

## 🚀 Queries Úteis

### **Monitorar Sincronização:**

```sql
-- Status da última sincronização
SELECT
    status,
    records_processed,
    records_inserted,
    records_updated,
    records_errors,
    api_calls_made,
    sync_started_at,
    sync_completed_at
FROM sync_logs
WHERE entity_type = 'batch_sync'
ORDER BY sync_started_at DESC
LIMIT 5;
```

### **Contar Registros por Tabela:**

```sql
SELECT
    schemaname,
    tablename,
    n_tup_ins as inserted,
    n_tup_upd as updated,
    n_tup_del as deleted
FROM pg_stat_user_tables
ORDER BY n_tup_ins DESC;
```

### **Ver Progresso em Tempo Real:**

```sql
SELECT
    status,
    records_processed,
    records_inserted,
    records_updated,
    records_errors,
    EXTRACT(EPOCH FROM (NOW() - sync_started_at))/60 as minutos_rodando
FROM sync_logs
WHERE entity_type = 'batch_sync'
AND status = 'in_progress';
```

## 🔍 Recursos Avançados do DbVisualizer

### **1. Visualização de Dados:**

- Gráficos e charts dos dados
- Comparação de resultados
- Exportação em diferentes formatos

### **2. Editor SQL:**

- Syntax highlighting
- Auto-complete
- Execução de scripts

### **3. Monitoramento:**

- Acompanhar performance das queries
- Ver estatísticas de tabelas
- Monitorar conexões ativas

## 🛠️ Scripts de Configuração

Execute o script para configurar automaticamente:

```powershell
.\scripts\setup-dbvisualizer.ps1
```

## 📝 Notas Importantes

- **DbVisualizer é gratuito** para uso pessoal/desenvolvimento
- **Não precisa de porta** - é aplicação desktop
- **Conexão direta** com PostgreSQL via localhost:5432
- **Melhor performance** que pgAdmin para grandes datasets

## 🆘 Troubleshooting

### **Erro de Conexão:**

1. Verifique se PostgreSQL está rodando: `docker-compose ps db`
2. Teste conexão: `docker-compose exec db psql -U sienge_app -d sienge_data`
3. Verifique firewall/antivírus

### **Tabelas não aparecem:**

1. Verifique se a sincronização já foi executada
2. Execute: `SELECT COUNT(*) FROM sync_logs;`
3. Verifique logs da aplicação

## 🔄 Migração do pgAdmin

O pgAdmin foi **desabilitado** no docker-compose.yml para usar DbVisualizer:

- Comentado o serviço `pgadmin`
- Comentado o volume `pgadmin-data`
- Configurações movidas para este documento

Para reativar pgAdmin (não recomendado):

1. Descomente as linhas no `docker-compose.yml`
2. Execute: `docker-compose up -d pgadmin`
