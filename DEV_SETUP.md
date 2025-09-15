# 🚀 Setup do Ambiente de Desenvolvimento - SIENGE

## Estrutura Melhorada

A estrutura de desenvolvimento foi completamente reformulada para ser mais robusta e fácil de usar:

### ✅ Melhorias Implementadas

1. **Script Unificado PowerShell** (`docker-dev.ps1`)
   - Validação completa de requisitos
   - Tratamento robusto de erros
   - Feedback visual claro com cores e ícones
   - Comandos intuitivos e auto-explicativos

2. **Arquivo de Configuração Dedicado** (`.env.dev`)
   - Separação clara entre dev e produção
   - Valores padrão seguros para desenvolvimento
   - Configurações otimizadas para performance local

3. **Configurações PostgreSQL**
   - `postgresql.conf` - otimizado para desenvolvimento
   - `pg_hba.conf` - permissões adequadas para dev
   - Logs detalhados para debugging

4. **Docker Compose Melhorado** (`docker-compose-dev.yml`)
   - Nomes de containers explícitos
   - Volumes otimizados com cache
   - Health checks configurados
   - Hot reload habilitado

## 🎯 Como Usar

### Primeira Vez (Inicialização)

```powershell
# 1. Criar arquivo de configuração (se não existir)
Copy-Item .env.example .env.dev

# 2. Editar configurações (opcional)
notepad .env.dev

# 3. Iniciar ambiente
.\docker-dev.ps1 up
```

### Comandos Principais

```powershell
# Ver ajuda completa
.\docker-dev.ps1 help

# Iniciar ambiente
.\docker-dev.ps1 up

# Iniciar com rebuild
.\docker-dev.ps1 up -Build

# Verificar status
.\docker-dev.ps1 status

# Ver logs
.\docker-dev.ps1 logs app

# Parar ambiente
.\docker-dev.ps1 down

# Limpar tudo (volumes, imagens)
.\docker-dev.ps1 clean -Force

# Fazer backup do banco
.\docker-dev.ps1 backup
```

### Comandos do Banco de Dados

```powershell
# Abrir Adminer no navegador
.\docker-dev.ps1 db

# Executar migrations Prisma
.\docker-dev.ps1 prisma db push

# Gerar Prisma Client
.\docker-dev.ps1 prisma generate

# Abrir Prisma Studio
.\docker-dev.ps1 prisma studio
```

### Comandos Avançados

```powershell
# Acessar shell do container
.\docker-dev.ps1 exec app sh

# Reconstruir apenas um serviço
.\docker-dev.ps1 build app

# Reiniciar serviços
.\docker-dev.ps1 restart

# Ver containers rodando
.\docker-dev.ps1 ps
```

## 🔧 Estrutura de Arquivos

```
sienge/
├── docker-dev.ps1           # Script principal (PowerShell)
├── docker-compose-dev.yml   # Docker Compose para dev
├── .env.dev                 # Configurações de desenvolvimento
├── postgresql.conf          # Config PostgreSQL otimizada
├── pg_hba.conf             # Autenticação PostgreSQL
├── docker/
│   └── dev-init.ps1        # Script de inicialização
├── logs/                   # Logs da aplicação
│   ├── app/
│   └── postgres/
└── backups/               # Backups do banco
    └── dev/
```

## 📊 URLs e Portas

| Serviço    | URL/Porta                 | Credenciais                |
|------------|---------------------------|----------------------------|
| Aplicação  | http://localhost:3000     | -                         |
| Adminer    | http://localhost:8080     | Ver abaixo                |
| PostgreSQL | localhost:5433            | Ver abaixo                |

### Credenciais do Banco (Dev)

- **Host:** localhost (externo) ou db (interno)
- **Porta:** 5433 (externa) ou 5432 (interna)
- **Usuário:** sienge_dev
- **Senha:** dev_password_123
- **Banco:** sienge_dev

## 🛡️ Recursos de Robustez

### Validações Automáticas
- ✅ Verifica se Docker está instalado e rodando
- ✅ Verifica arquivos necessários
- ✅ Cria arquivos de configuração se não existirem
- ✅ Valida portas disponíveis
- ✅ Testa conectividade dos serviços

### Tratamento de Erros
- ✅ Mensagens claras de erro
- ✅ Rollback automático em falhas
- ✅ Logs detalhados para debugging
- ✅ Confirmações antes de operações destrutivas

### Performance Otimizada
- ✅ Volumes com cache para hot reload
- ✅ Limites de recursos configuráveis
- ✅ Build incremental
- ✅ Health checks para disponibilidade

## 🔍 Troubleshooting

### Problema: Docker não está rodando
```powershell
# Solução: Inicie o Docker Desktop
# No Windows, abra Docker Desktop manualmente
```

### Problema: Porta já em uso
```powershell
# Solução: Altere a porta no .env.dev
# APP_PORT_EXTERNAL=3001
# DB_PORT_EXTERNAL=5434
```

### Problema: Erro de permissão
```powershell
# Solução: Execute PowerShell como Administrador
# Ou ajuste política de execução:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Problema: Container não inicia
```powershell
# Solução: Limpe e reinicie
.\docker-dev.ps1 clean -Force
.\docker-dev.ps1 up -Build
```

## 📈 Monitoramento

### Ver Status Detalhado
```powershell
.\docker-dev.ps1 status
```

### Ver Logs em Tempo Real
```powershell
# Todos os serviços
.\docker-dev.ps1 logs

# Apenas aplicação
.\docker-dev.ps1 logs app

# Apenas banco
.\docker-dev.ps1 logs db
```

### Verificar Saúde dos Serviços
```powershell
# Status mostra health checks
.\docker-dev.ps1 status
```

## 🎉 Benefícios da Nova Estrutura

1. **Facilidade de Uso**
   - Comandos intuitivos e consistentes
   - Feedback visual claro
   - Ajuda integrada

2. **Robustez**
   - Validações automáticas
   - Tratamento de erros
   - Recuperação automática

3. **Performance**
   - Hot reload rápido
   - Build otimizado
   - Cache inteligente

4. **Manutenibilidade**
   - Código organizado e documentado
   - Configurações centralizadas
   - Logs estruturados

5. **Portabilidade**
   - Funciona em Windows/Mac/Linux
   - Configurações isoladas
   - Sem conflitos com produção

## 🚦 Status do Projeto

✅ **Pronto para Uso!**

O ambiente de desenvolvimento está totalmente configurado e otimizado. Use `.\docker-dev.ps1 help` para começar.