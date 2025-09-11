# 🚀 Sienge - Ambientes de Desenvolvimento e Produção

Este projeto suporta dois ambientes distintos: **desenvolvimento** e **produção**, cada um com suas próprias configurações e scripts de inicialização.

## 📁 Estrutura de Arquivos

```
├── docker-compose.yml          # Ambiente de produção
├── docker-compose-dev.yml      # Ambiente de desenvolvimento
├── Dockerfile                  # Build único para ambos os ambientes
├── Dockerfile.original         # Backup do Dockerfile original
├── .env                        # Variáveis de produção
├── .env.dev                    # Variáveis de desenvolvimento
├── .env.example                # Template de variáveis
├── scripts/                    # Pasta com todos os scripts
│   ├── sienge.sh              # Script principal (Linux/Mac)
│   ├── init-dev.sh            # Iniciar desenvolvimento (Linux/Mac)
│   ├── init-dev.ps1           # Iniciar desenvolvimento (Windows)
│   ├── init-prod.sh           # Iniciar produção (Linux/Mac)
│   ├── init-prod.ps1          # Iniciar produção (Windows)
│   ├── stop-dev.sh             # Parar desenvolvimento (Linux/Mac)
│   ├── stop-dev.ps1            # Parar desenvolvimento (Windows)
│   ├── stop-prod.sh            # Parar produção (Linux/Mac)
│   ├── stop-prod.ps1           # Parar produção (Windows)
│   ├── logs-dev.sh             # Logs desenvolvimento
│   ├── logs-prod.sh            # Logs produção
│   ├── backup-db.sh            # Backup banco de dados
│   ├── restore-db.sh           # Restaurar backup
│   └── README.md               # Documentação dos scripts
├── backups/                    # Pasta para backups
│   ├── dev/                   # Backups de desenvolvimento
│   └── prod/                  # Backups de produção
└── CONFIGURACAO.md             # Documentação detalhada
```

## 🛠️ Ambiente de Desenvolvimento

### Características
- **Hot reload** habilitado
- **Logs detalhados** (debug level)
- **Recursos limitados** (menor uso de CPU/memória)
- **Volumes montados** para desenvolvimento
- **Banco de dados separado** (`sienge_dev`)

### Como usar

#### Script Principal (Recomendado):
```bash
# Tornar executável
chmod +x scripts/sienge.sh

# Iniciar ambiente de desenvolvimento
./scripts/sienge.sh dev

# Ver logs
./scripts/sienge.sh logs-dev

# Parar ambiente
./scripts/sienge.sh stop-dev
```

#### Scripts Individuais:

##### Linux/Mac:
```bash
# Tornar os scripts executáveis
chmod +x scripts/*.sh

# Iniciar ambiente de desenvolvimento
./scripts/init-dev.sh

# Ou com limpeza de volumes
./scripts/init-dev.sh --clean
```

##### Windows (PowerShell):
```powershell
# Iniciar ambiente de desenvolvimento
.\scripts\init-dev.ps1

# Ou com limpeza de volumes
.\scripts\init-dev.ps1 -Clean
```

#### Manual:
```bash
# Usar docker-compose-dev.yml
docker-compose -f docker-compose-dev.yml --env-file .env.dev up --build -d
```

### Acesso
- **Aplicação:** http://localhost:3000
- **Banco:** localhost:5432
- **Logs:** `docker-compose -f docker-compose-dev.yml logs -f`

## 🏭 Ambiente de Produção

### Características
- **Build otimizado** para produção
- **Recursos completos** (CPU/memória)
- **Logs otimizados** (info level)
- **Segurança reforçada**
- **Banco de dados principal** (`sienge_data`)

### Como usar

#### Script Principal (Recomendado):
```bash
# Iniciar ambiente de produção
./scripts/sienge.sh prod

# Ver logs
./scripts/sienge.sh logs-prod

# Parar ambiente
./scripts/sienge.sh stop-prod

# Backup
./scripts/sienge.sh backup-prod
```

#### Scripts Individuais:

##### Linux/Mac:
```bash
# Tornar o script executável
chmod +x scripts/init-prod.sh

# Iniciar ambiente de produção
./scripts/init-prod.sh
```

##### Windows (PowerShell):
```powershell
# Iniciar ambiente de produção
.\scripts\init-prod.ps1
```

#### Manual:
```bash
# Usar docker-compose.yml padrão
docker-compose up --build -d
```

### Acesso
- **Aplicação:** http://localhost:3000
- **Banco:** localhost:5432
- **Logs:** `docker-compose logs -f`

## 🔧 Comandos Úteis

### Script Principal (Recomendado)
```bash
# Ver todos os comandos disponíveis
./scripts/sienge.sh help

# Ver status de todos os ambientes
./scripts/sienge.sh status

# Desenvolvimento
./scripts/sienge.sh dev          # Iniciar desenvolvimento
./scripts/sienge.sh logs-dev     # Ver logs desenvolvimento
./scripts/sienge.sh stop-dev     # Parar desenvolvimento
./scripts/sienge.sh backup-dev   # Backup desenvolvimento

# Produção
./scripts/sienge.sh prod         # Iniciar produção
./scripts/sienge.sh logs-prod    # Ver logs produção
./scripts/sienge.sh stop-prod    # Parar produção
./scripts/sienge.sh backup-prod  # Backup produção

# Utilitários
./scripts/sienge.sh clean        # Limpar sistema Docker
./scripts/sienge.sh docs         # Abrir documentação
```

### Desenvolvimento
```bash
# Ver logs em tempo real
./scripts/logs-dev.sh

# Parar ambiente
./scripts/stop-dev.sh

# Reiniciar apenas a aplicação
docker-compose -f docker-compose-dev.yml restart app

# Limpar tudo (incluindo volumes)
./scripts/stop-dev.sh --clean

# Executar comandos no container
docker-compose -f docker-compose-dev.yml exec app npm run build
```

### Produção
```bash
# Ver logs em tempo real
./scripts/logs-prod.sh

# Parar ambiente
./scripts/stop-prod.sh

# Reiniciar apenas a aplicação
docker-compose restart app

# Limpar tudo (incluindo volumes) - CUIDADO!
./scripts/stop-prod.sh --clean

# Backup do banco
./scripts/backup-db.sh prod

# Restaurar backup
./scripts/restore-db.sh prod backups/prod/backup_sienge_data_20240101_120000.sql
```

## 🌐 Deploy no EasyPanel

O projeto está preparado para deploy no EasyPanel! As variáveis de ambiente são totalmente compatíveis.

### Configuração no EasyPanel

1. **Crie um novo projeto** no EasyPanel
2. **Configure as variáveis de ambiente** na interface do EasyPanel:
   ```bash
   # Credenciais Sienge
   SIENGE_SUBDOMAIN=seu-subdominio
   SIENGE_USERNAME=seu-usuario-api
   SIENGE_PASSWORD=sua-senha-api
   
   # Banco de dados
   POSTGRES_DB=sienge_data
   POSTGRES_USER=sienge_app
   POSTGRES_PASSWORD=senha-super-segura
   
   # Aplicação
   NEXT_PUBLIC_APP_URL=https://seu-dominio.com
   NEXTAUTH_SECRET=seu-secret-super-seguro
   
   # Portas (EasyPanel gerencia automaticamente)
   APP_PORT_EXTERNAL=3000
   APP_PORT_INTERNAL=3000
   DB_PORT_EXTERNAL=5432
   DB_PORT_INTERNAL=5432
   ```

3. **Use o docker-compose.yml** padrão (produção)
4. **Configure domínio** e SSL no EasyPanel

### Vantagens do EasyPanel
- ✅ **Gerenciamento automático** de variáveis de ambiente
- ✅ **SSL automático** com Let's Encrypt
- ✅ **Backup automático** do banco de dados
- ✅ **Monitoramento** integrado
- ✅ **Escalabilidade** automática

## 🔒 Segurança

### Desenvolvimento
- Senhas simples (para facilitar desenvolvimento)
- Logs detalhados
- Recursos limitados

### Produção
- Senhas fortes obrigatórias
- Logs otimizados
- Recursos completos
- Firewall configurado

## 📊 Monitoramento

### Health Checks
- **Aplicação:** `GET /api/health`
- **Banco:** `pg_isready`

### Logs
- **Desenvolvimento:** Debug level
- **Produção:** Info level
- **Rotação automática** de logs

## 🆘 Troubleshooting

### Problemas Comuns

1. **Porta já em uso:**
   ```bash
   # Altere no .env ou .env.dev
   APP_PORT_EXTERNAL=3001
   DB_PORT_EXTERNAL=5433
   ```

2. **Container não inicia:**
   ```bash
   # Verificar logs
   docker-compose logs
   
   # Verificar status
   docker-compose ps
   ```

3. **Banco não conecta:**
   ```bash
   # Verificar se PostgreSQL está rodando
   docker-compose exec db pg_isready
   
   # Verificar variáveis de ambiente
   docker-compose exec app env | grep DATABASE
   ```

### Limpeza Completa
```bash
# Desenvolvimento
docker-compose -f docker-compose-dev.yml down -v
docker system prune -f

# Produção
docker-compose down -v
docker system prune -f
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs: `docker-compose logs -f`
2. Consulte a documentação: `CONFIGURACAO.md`
3. Verifique os exemplos: `EXEMPLOS_PORTAS.md`
