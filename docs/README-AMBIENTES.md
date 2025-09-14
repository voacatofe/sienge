# 🚀 Sienge - Ambientes de Desenvolvimento e Produção

Este projeto suporta dois ambientes distintos: **desenvolvimento** e **produção**, cada um com suas próprias configurações e scripts de inicialização.

## 📁 Estrutura de Arquivos (ATUALIZADA)

```
├── docker-compose.yml          # Ambiente de produção (OTIMIZADO)
├── docker-compose-dev.yml      # Ambiente de desenvolvimento (NOVO)
├── Dockerfile                  # Build único para ambos os ambientes
├── .env                        # Variáveis de produção
├── .env.dev                    # Variáveis de desenvolvimento (NOVO)
├── .env.example                # Template de variáveis
├── start-prod.bat              # Script produção (Windows Batch) (NOVO)
├── start-dev.bat               # Script desenvolvimento (Windows Batch) (NOVO)
├── sienge.bat                  # Script principal (Windows Batch) (ATUALIZADO)
├── scripts/                    # Pasta com todos os scripts
│   ├── start-prod.sh          # Script produção (Linux/Mac)
│   ├── start-dev.sh           # Script desenvolvimento (Linux/Mac)
│   ├── adminer.sh             # Acesso ao Adminer
│   ├── daily-sync.js           # Sincronização diária
│   ├── stop-sync.js            # Parar sincronização
│   ├── docker-entrypoint.sh     # Entrypoint para automação do schema
│   └── README.md                # Documentação dos scripts (ATUALIZADO)
├── backups/                    # Pasta para backups
│   ├── dev/                   # Backups de desenvolvimento
│   └── prod/                  # Backups de produção
└── CONFIGURACAO.md             # Documentação detalhada
```

## 🛠️ Ambiente de Desenvolvimento (NOVO)

### Características

- **Hot reload** habilitado
- **Logs detalhados** (debug level)
- **Recursos limitados** (1GB RAM, 1 CPU)
- **Volumes montados** para desenvolvimento
- **Banco de dados separado** (`sienge_dev`)
- **Sincronização frequente** (a cada 5 minutos)
- **Porta separada** (5433 para evitar conflitos)

### Como usar (NOVO)

#### Scripts Específicos (Recomendado):

```bash
# Linux/Mac
./scripts/start-dev.sh start
./scripts/start-dev.sh stop
./scripts/start-dev.sh logs
./scripts/start-dev.sh backup

# Windows PowerShell
.\scripts\start-dev.ps1 start
.\scripts\start-dev.ps1 stop
.\scripts\start-dev.ps1 logs
.\scripts\start-dev.ps1 backup

# Windows Batch
start-dev.bat start
start-dev.bat stop
start-dev.bat logs
start-dev.bat backup
```

#### Manual:

```bash
# Usar docker-compose-dev.yml
docker-compose -f docker-compose-dev.yml --env-file .env.dev up --build -d
```

### Acesso

- **Aplicação:** http://localhost:3000
- **Banco:** localhost:5433 (porta separada)
- **Adminer:** http://localhost:8080
- **Logs:** `docker-compose -f docker-compose-dev.yml logs -f`

## 🏭 Ambiente de Produção (OTIMIZADO)

### Características

- **Build otimizado** para produção
- **Recursos completos** (4GB RAM, 4 CPU)
- **Logs otimizados** (info level)
- **Segurança reforçada**
- **Banco de dados principal** (`sienge_data`)
- **Sincronização às 2h da manhã**
- **Backup automático**

### Como usar (NOVO)

#### Scripts Específicos (Recomendado):

```bash
# Linux/Mac
./scripts/start-prod.sh start
./scripts/start-prod.sh stop
./scripts/start-prod.sh logs
./scripts/start-prod.sh backup

# Windows PowerShell
.\scripts\start-prod.ps1 start
.\scripts\start-prod.ps1 stop
.\scripts\start-prod.ps1 logs
.\scripts\start-prod.ps1 backup

# Windows Batch
start-prod.bat start
start-prod.bat stop
start-prod.bat logs
start-prod.bat backup
```

#### Manual:

```bash
# Usar docker-compose.yml padrão
docker-compose up --build -d
```

### Acesso

- **Aplicação:** http://localhost:3000
- **Banco:** localhost:5432
- **Adminer:** http://localhost:8080
- **Logs:** `docker-compose logs -f`

## 🔧 Comandos Úteis (ATUALIZADOS)

### Scripts Específicos (Recomendado)

#### Desenvolvimento:

```bash
# Linux/Mac
./scripts/start-dev.sh start          # Iniciar desenvolvimento
./scripts/start-dev.sh logs           # Ver logs desenvolvimento
./scripts/start-dev.sh stop           # Parar desenvolvimento
./scripts/start-dev.sh backup         # Backup desenvolvimento

# Windows PowerShell
.\scripts\start-dev.ps1 start
.\scripts\start-dev.ps1 logs
.\scripts\start-dev.ps1 stop
.\scripts\start-dev.ps1 backup

# Windows Batch
start-dev.bat start
start-dev.bat logs
start-dev.bat stop
start-dev.bat backup
```

#### Produção:

```bash
# Linux/Mac
./scripts/start-prod.sh start          # Iniciar produção
./scripts/start-prod.sh logs           # Ver logs produção
./scripts/start-prod.sh stop           # Parar produção
./scripts/start-prod.sh backup         # Backup produção

# Windows PowerShell
.\scripts\start-prod.ps1 start
.\scripts\start-prod.ps1 logs
.\scripts\start-prod.ps1 stop
.\scripts\start-prod.ps1 backup

# Windows Batch
start-prod.bat start
start-prod.bat logs
start-prod.bat stop
start-prod.bat backup
```

### Banco de Dados

```bash
# Acessar Adminer (desenvolvimento)
./scripts/adminer.sh dev

# Acessar Adminer (produção)
./scripts/adminer.sh prod
```

## 🌐 Deploy no EasyPanel

O projeto está preparado para deploy no EasyPanel! Use o `docker-compose.yml` otimizado para produção.

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

   # Recursos (opcional)
   DB_MEMORY_LIMIT=2G
   DB_CPU_LIMIT=2.0
   APP_MEMORY_LIMIT=4G
   APP_CPU_LIMIT=4.0
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
- Porta separada (5433)

### Produção

- Senhas fortes obrigatórias
- Logs otimizados
- Recursos completos
- Segurança reforçada
- Porta padrão (5432)

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
   # Desenvolvimento usa porta 5433
   # Produção usa porta 5432
   # Altere no .env.dev ou .env se necessário
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

## 💡 Dicas

1. **Use os novos scripts:** `start-prod.sh` e `start-dev.sh` são mais eficientes
2. **Backup regular:** Execute `backup` regularmente em produção
3. **Logs em tempo real:** Use `logs` para debug
4. **Ambientes separados:** Dev usa porta 5433, Prod usa porta 5432
5. **Hot reload:** Funciona apenas em desenvolvimento

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs: `docker-compose logs -f`
2. Consulte a documentação: `CONFIGURACAO.md`
3. Verifique os exemplos: `EXEMPLOS_PORTAS.md`
4. Use os novos scripts específicos para cada ambiente
