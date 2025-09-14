# 📁 Scripts - Sienge

Esta pasta contém todos os scripts para gerenciar os ambientes de desenvolvimento e produção do projeto Sienge.

## 🚀 Scripts Principais (NOVOS)

### `start-prod.sh` / `start-prod.ps1` / `start-prod.bat`

Script otimizado para ambiente de **PRODUÇÃO**:

- Recursos completos (4GB RAM, 4 CPU)
- Segurança reforçada
- Logs otimizados para produção
- Backup automático
- Sincronização às 2h da manhã

**Linux/Mac:**

```bash
./scripts/start-prod.sh start
./scripts/start-prod.sh stop
./scripts/start-prod.sh logs
./scripts/start-prod.sh backup
```

**Windows PowerShell:**

```powershell
.\scripts\start-prod.ps1 start
.\scripts\start-prod.ps1 stop
.\scripts\start-prod.ps1 logs
.\scripts\start-prod.ps1 backup
```

**Windows Batch:**

```cmd
start-prod.bat start
start-prod.bat stop
start-prod.bat logs
start-prod.bat backup
```

### `start-dev.sh` / `start-dev.ps1` / `start-dev.bat`

Script otimizado para ambiente de **DESENVOLVIMENTO**:

- Recursos limitados (1GB RAM, 1 CPU)
- Hot reload habilitado
- Logs detalhados
- Sincronização a cada 5 minutos
- Banco separado (`sienge_dev`)

**Linux/Mac:**

```bash
./scripts/start-dev.sh start
./scripts/start-dev.sh stop
./scripts/start-dev.sh logs
./scripts/start-dev.sh backup
```

**Windows PowerShell:**

```powershell
.\scripts\start-dev.ps1 start
.\scripts\start-dev.ps1 stop
.\scripts\start-dev.ps1 logs
.\scripts\start-dev.ps1 backup
```

**Windows Batch:**

```cmd
start-dev.bat start
start-dev.bat stop
start-dev.bat logs
start-dev.bat backup
```

## 🐳 Docker Compose Separados

### `docker-compose.yml` (Produção)

- Otimizado para produção
- Recursos completos
- Segurança reforçada
- Logs otimizados

### `docker-compose-dev.yml` (Desenvolvimento)

- Otimizado para desenvolvimento
- Hot reload habilitado
- Recursos limitados
- Logs detalhados

## 🔧 Scripts de Schema Setup Automatizado

### `docker-entrypoint.sh`

Script de entrypoint que automatiza a inicialização do schema Prisma:

- Aguarda banco de dados estar disponível
- Executa migrações automaticamente
- Gera cliente Prisma
- Inicia aplicação Next.js

**Funcionalidades:**

- ✅ Verificação de conectividade com banco
- ✅ Execução automática de migrações
- ✅ Geração do cliente Prisma
- ✅ Logs detalhados com timestamp
- ✅ Tratamento de erros robusto

## 🔧 Scripts de Funcionalidade Core

### `daily-sync.js`

Sistema de sincronização diária com cron:

- Execução automática às 2h da manhã
- Logs detalhados de sincronização
- Tratamento de erros robusto

### `stop-sync.js`

Utilitário para parar sincronizações em andamento:

- Cancelamento seguro de syncs
- Logs de operação
- Integração com Prisma

## 🗄️ Scripts de Banco de Dados

### `adminer.sh`

Script para acesso ao Adminer (interface web do banco):

```bash
# Desenvolvimento
./scripts/adminer.sh dev

# Produção
./scripts/adminer.sh prod
```

**Funcionalidades:**

- ✅ Acesso automático ao Adminer
- ✅ Configuração automática de credenciais
- ✅ Abertura automática no navegador
- ✅ Suporte a ambos os ambientes

## 💾 Scripts de Backup

### Backup Automático

Os novos scripts incluem backup automático:

```bash
# Backup produção
./scripts/start-prod.sh backup

# Backup desenvolvimento
./scripts/start-dev.sh backup
```

**Arquivos salvos em:**

- Desenvolvimento: `backups/dev/backup_sienge_dev_YYYYMMDD_HHMMSS.sql`
- Produção: `backups/prod/backup_sienge_data_YYYYMMDD_HHMMSS.sql`

## 🔧 Comandos Rápidos

### Desenvolvimento (NOVO)

```bash
# Iniciar
./scripts/start-dev.sh start

# Ver logs
./scripts/start-dev.sh logs

# Parar
./scripts/start-dev.sh stop

# Backup
./scripts/start-dev.sh backup
```

### Produção (NOVO)

```bash
# Iniciar
./scripts/start-prod.sh start

# Ver logs
./scripts/start-prod.sh logs

# Parar
./scripts/start-prod.sh stop

# Backup
./scripts/start-prod.sh backup
```

### Banco de Dados

```bash
# Acessar Adminer (desenvolvimento)
./scripts/adminer.sh dev

# Acessar Adminer (produção)
./scripts/adminer.sh prod
```

## 📋 Estrutura de Arquivos (ATUALIZADA)

```
scripts/
├── start-prod.sh           # Script produção (Linux/Mac)
├── start-prod.ps1           # Script produção (Windows PowerShell)
├── start-dev.sh             # Script desenvolvimento (Linux/Mac)
├── start-dev.ps1            # Script desenvolvimento (Windows PowerShell)
├── docker-entrypoint.sh     # Entrypoint para automação do schema
├── adminer.sh               # Acesso ao Adminer
├── daily-sync.js            # Sincronização diária
├── stop-sync.js             # Parar sincronização
└── README.md                # Este arquivo

# Arquivos na raiz
├── start-prod.bat           # Script produção (Windows Batch)
├── start-dev.bat            # Script desenvolvimento (Windows Batch)
├── sienge.bat               # Script principal (Windows Batch)
├── docker-compose.yml       # Docker Compose para produção
└── docker-compose-dev.yml   # Docker Compose para desenvolvimento
```

## 🆘 Troubleshooting

### Scripts não executam (Linux/Mac)

```bash
# Tornar executáveis
chmod +x scripts/*.sh

# Verificar permissões
ls -la scripts/
```

### Erro "Docker não está rodando"

- Inicie o Docker Desktop
- Verifique se está rodando: `docker info`

### Erro "Arquivo .env não encontrado"

- **Produção:** Copie o template: `cp .env.example .env`
- **Desenvolvimento:** Copie o template: `cp .env.example .env.dev`
- Configure as credenciais nos arquivos

### Containers não iniciam

```bash
# Ver logs detalhados
docker-compose logs

# Verificar status
docker-compose ps

# Limpar e tentar novamente
docker-compose down -v
docker system prune -f
```

## 💡 Dicas

1. **Use os novos scripts:** `start-prod.sh` e `start-dev.sh` são mais eficientes
2. **Backup regular:** Execute `backup` regularmente em produção
3. **Logs em tempo real:** Use `logs` para debug
4. **Ambientes separados:** Dev usa porta 5433, Prod usa porta 5432
5. **Hot reload:** Funciona apenas em desenvolvimento

## 🔗 Links Úteis

- [README-AMBIENTES.md](../README-AMBIENTES.md) - Guia completo de ambientes
- [CONFIGURACAO.md](../CONFIGURACAO.md) - Configuração detalhada
- [EXEMPLOS_PORTAS.md](../EXEMPLOS_PORTAS.md) - Exemplos de configuração de portas
