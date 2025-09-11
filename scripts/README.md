# 📁 Scripts - Sienge

Esta pasta contém todos os scripts para gerenciar os ambientes de desenvolvimento e produção do projeto Sienge.

## 🚀 Script Principal

### `sienge.sh` (Linux/Mac)
Script principal que centraliza todos os comandos:

```bash
# Tornar executável
chmod +x scripts/sienge.sh

# Ver ajuda
./scripts/sienge.sh help

# Comandos principais
./scripts/sienge.sh dev          # Iniciar desenvolvimento
./scripts/sienge.sh prod         # Iniciar produção
./scripts/sienge.sh status       # Ver status
./scripts/sienge.sh backup-prod  # Backup produção
```

## 🛠️ Scripts de Desenvolvimento

### `init-dev.sh` / `init-dev.ps1`
Inicia o ambiente de desenvolvimento:
- Hot reload habilitado
- Logs detalhados
- Recursos limitados
- Banco separado (`sienge_dev`)

**Linux/Mac:**
```bash
./scripts/init-dev.sh
./scripts/init-dev.sh --clean  # Com limpeza de volumes
```

**Windows:**
```powershell
.\scripts\init-dev.ps1
.\scripts\init-dev.ps1 -Clean  # Com limpeza de volumes
```

### `stop-dev.sh` / `stop-dev.ps1`
Para o ambiente de desenvolvimento:

**Linux/Mac:**
```bash
./scripts/stop-dev.sh
./scripts/stop-dev.sh --clean  # Remove volumes também
```

**Windows:**
```powershell
.\scripts\stop-dev.ps1
.\scripts\stop-dev.ps1 -Clean  # Remove volumes também
```

### `logs-dev.sh`
Visualiza logs do ambiente de desenvolvimento:
```bash
./scripts/logs-dev.sh
```

## 🏭 Scripts de Produção

### `init-prod.sh` / `init-prod.ps1`
Inicia o ambiente de produção:
- Build otimizado
- Recursos completos
- Logs otimizados
- Banco principal (`sienge_data`)

**Linux/Mac:**
```bash
./scripts/init-prod.sh
```

**Windows:**
```powershell
.\scripts\init-prod.ps1
```

### `stop-prod.sh` / `stop-prod.ps1`
Para o ambiente de produção:

**Linux/Mac:**
```bash
./scripts/stop-prod.sh
./scripts/stop-prod.sh --clean  # Remove volumes (CUIDADO!)
```

**Windows:**
```powershell
.\scripts\stop-prod.ps1
.\scripts\stop-prod.ps1 -Clean  # Remove volumes (CUIDADO!)
```

### `logs-prod.sh`
Visualiza logs do ambiente de produção:
```bash
./scripts/logs-prod.sh
```

## 💾 Scripts de Backup

### `backup-db.sh`
Cria backup do banco de dados:

```bash
# Backup desenvolvimento
./scripts/backup-db.sh dev

# Backup produção
./scripts/backup-db.sh prod
```

**Arquivos salvos em:**
- Desenvolvimento: `backups/dev/backup_sienge_dev_YYYYMMDD_HHMMSS.sql`
- Produção: `backups/prod/backup_sienge_data_YYYYMMDD_HHMMSS.sql`

### `restore-db.sh`
Restaura backup do banco de dados:

```bash
# Restaurar desenvolvimento
./scripts/restore-db.sh dev backups/dev/backup_sienge_dev_20240101_120000.sql

# Restaurar produção
./scripts/restore-db.sh prod backups/prod/backup_sienge_data_20240101_120000.sql
```

⚠️ **ATENÇÃO:** A restauração substitui todos os dados existentes!

## 🔧 Comandos Rápidos

### Desenvolvimento
```bash
# Iniciar
./scripts/sienge.sh dev

# Ver logs
./scripts/sienge.sh logs-dev

# Parar
./scripts/sienge.sh stop-dev

# Backup
./scripts/sienge.sh backup-dev
```

### Produção
```bash
# Iniciar
./scripts/sienge.sh prod

# Ver logs
./scripts/sienge.sh logs-prod

# Parar
./scripts/sienge.sh stop-prod

# Backup
./scripts/sienge.sh backup-prod
```

### Utilitários
```bash
# Ver status de todos os ambientes
./scripts/sienge.sh status

# Limpar sistema Docker
./scripts/sienge.sh clean

# Ver ajuda completa
./scripts/sienge.sh help
```

## 📋 Estrutura de Arquivos

```
scripts/
├── sienge.sh           # Script principal (Linux/Mac)
├── init-dev.sh         # Iniciar desenvolvimento (Linux/Mac)
├── init-dev.ps1        # Iniciar desenvolvimento (Windows)
├── init-prod.sh        # Iniciar produção (Linux/Mac)
├── init-prod.ps1       # Iniciar produção (Windows)
├── stop-dev.sh         # Parar desenvolvimento (Linux/Mac)
├── stop-dev.ps1        # Parar desenvolvimento (Windows)
├── stop-prod.sh        # Parar produção (Linux/Mac)
├── stop-prod.ps1       # Parar produção (Windows)
├── logs-dev.sh         # Logs desenvolvimento
├── logs-prod.sh        # Logs produção
├── backup-db.sh        # Backup banco de dados
├── restore-db.sh       # Restaurar backup
└── README.md           # Este arquivo
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
- Copie o template: `cp .env.example .env`
- Configure as credenciais no arquivo `.env`

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

1. **Use o script principal:** `./scripts/sienge.sh` centraliza todos os comandos
2. **Backup regular:** Execute `backup-prod` regularmente em produção
3. **Logs em tempo real:** Use `logs-dev` ou `logs-prod` para debug
4. **Limpeza:** Use `clean` periodicamente para liberar espaço
5. **Status:** Use `status` para verificar todos os ambientes

## 🔗 Links Úteis

- [README-AMBIENTES.md](../README-AMBIENTES.md) - Guia completo de ambientes
- [CONFIGURACAO.md](../CONFIGURACAO.md) - Configuração detalhada
- [EXEMPLOS_PORTAS.md](../EXEMPLOS_PORTAS.md) - Exemplos de configuração de portas
