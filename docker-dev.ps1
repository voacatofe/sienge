#!/usr/bin/env pwsh
# ============================================
# SIENGE - Docker Development Manager v2.0
# ============================================
# Script unificado e robusto para ambiente dev
# Compativel com Windows/PowerShell

param(
    [Parameter(Position=0)]
    [ValidateSet("up", "down", "build", "restart", "logs", "ps", "exec", "prisma", "db", "adminer", "status", "clean", "backup", "help")]
    [string]$Command = "help",

    [Parameter(Position=1)]
    [string]$Service = "",

    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$RemainingArgs = @(),

    [switch]$Build,
    [switch]$Detach,
    [switch]$Volumes,
    [switch]$Force,
    [switch]$Clean
)

# Configuracoes globais
$Global:COMPOSE_FILE = "docker-compose-dev.yml"
$Global:ENV_FILE = ".env.dev"
$Global:PROJECT_ROOT = Get-Location
$Global:DOCKER_MIN_VERSION = "20.10.0"

# Cores para output
$GREEN = "`e[32m"
$YELLOW = "`e[33m"
$RED = "`e[31m"
$BLUE = "`e[34m"
$CYAN = "`e[36m"
$RESET = "`e[0m"

# Funcoes de output colorido
function Write-ColorOutput {
    param([string]$Message, [string]$Color = $RESET)
    Write-Host "$Color$Message$RESET"
}

function Write-Success {
    param($Message)
    Write-ColorOutput "[OK] $Message" $GREEN
}

function Write-Warning {
    param($Message)
    Write-ColorOutput "[WARN] $Message" $YELLOW
}

function Write-Error {
    param($Message)
    Write-ColorOutput "[ERROR] $Message" $RED
}

function Write-Info {
    param($Message)
    Write-ColorOutput "[INFO] $Message" $BLUE
}

function Write-Debug {
    param($Message)
    if ($env:DEBUG) {
        Write-ColorOutput "[DEBUG] $Message" $CYAN
    }
}

# Funcao de validacao de requisitos
function Test-Requirements {
    Write-Info "Verificando requisitos do sistema..."

    # Verifica Docker
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker nao esta instalado!"
        Write-Info "Instale Docker Desktop: https://www.docker.com/products/docker-desktop"
        exit 1
    }

    # Verifica versao do Docker
    $dockerVersion = docker version --format '{{.Server.Version}}' 2>$null
    if (-not $dockerVersion) {
        Write-Error "Docker nao esta rodando! Inicie o Docker Desktop."
        exit 1
    }

    Write-Success "Docker $dockerVersion esta rodando"

    # Verifica docker-compose
    if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Warning "docker-compose nao encontrado, tentando plugin docker compose..."
        docker compose version 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Error "docker-compose nao esta disponivel!"
            exit 1
        }
    }

    # Verifica arquivos necessarios
    $requiredFiles = @($COMPOSE_FILE, $ENV_FILE)
    foreach ($file in $requiredFiles) {
        if (-not (Test-Path $file)) {
            Write-Warning "Arquivo $file nao encontrado"
            if ($file -eq $ENV_FILE) {
                Write-Info "Criando $ENV_FILE com configuracoes padrao..."
                Initialize-EnvFile
            } else {
                Write-Error "Arquivo $file e obrigatorio!"
                exit 1
            }
        }
    }

    # Verifica configuracoes PostgreSQL
    $pgFiles = @("postgresql.conf", "pg_hba.conf")
    foreach ($file in $pgFiles) {
        if (-not (Test-Path $file)) {
            Write-Warning "Arquivo $file nao encontrado"
            Write-Info "Execute o comando 'init' para criar configuracoes padrao"
        }
    }

    Write-Success "Todos os requisitos foram verificados"
}

# Funcao para inicializar arquivo .env.dev
function Initialize-EnvFile {
    if (Test-Path $ENV_FILE) {
        if (-not $Force) {
            Write-Warning "$ENV_FILE ja existe. Use -Force para sobrescrever."
            return
        }
    }

    Write-Info "Criando $ENV_FILE com configuracoes padrao..."

    # Copia do .env.example se existir
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" $ENV_FILE
        Write-Success "$ENV_FILE criado a partir de .env.example"
    } else {
        Write-Error ".env.example nao encontrado"
        exit 1
    }
}

# Funcao para carregar variaveis de ambiente
function Import-EnvFile {
    param([string]$EnvFile = $ENV_FILE)

    if (-not (Test-Path $EnvFile)) {
        Write-Warning "Arquivo $EnvFile nao encontrado"
        return $false
    }

    Write-Debug "Carregando variaveis de $EnvFile"

    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match "^[^#].*=") {
            $key, $value = $_ -split "=", 2
            $value = $value.Trim('"').Trim("'")
            [Environment]::SetEnvironmentVariable($key.Trim(), $value, "Process")
            Write-Debug "  $($key.Trim()) = ***"
        }
    }

    Write-Success "Variaveis de ambiente carregadas"
    return $true
}

function Show-Help {
    Write-ColorOutput "========================================" $CYAN
    Write-ColorOutput "   SIENGE Docker Development Manager v2.0" $CYAN
    Write-ColorOutput "========================================" $CYAN
    Write-Host ""
    Write-ColorOutput "Uso: .\docker-dev.ps1 [COMANDO] [SERVICO] [OPCOES]" $YELLOW
    Write-Host ""
    Write-ColorOutput "COMANDOS PRINCIPAIS:" $GREEN
    Write-Host "  up        - Inicia ambiente de desenvolvimento"
    Write-Host "  down      - Para os servicos"
    Write-Host "  restart   - Reinicia os servicos"
    Write-Host "  status    - Mostra status detalhado dos servicos"
    Write-Host "  clean     - Limpa volumes e containers"
    Write-Host ""
    Write-ColorOutput "COMANDOS AUXILIARES:" $GREEN
    Write-Host "  build     - Reconstroi as imagens"
    Write-Host "  logs      - Mostra logs (follow mode)"
    Write-Host "  ps        - Lista containers ativos"
    Write-Host "  exec      - Executa comando no container"
    Write-Host "  backup    - Faz backup do banco de dados"
    Write-Host ""
    Write-ColorOutput "BANCO DE DADOS:" $GREEN
    Write-Host "  prisma    - Executa comandos Prisma"
    Write-Host "  db        - Abre Adminer no navegador"
    Write-Host "  adminer   - Alias para 'db'"
    Write-Host ""
    Write-ColorOutput "OPCOES:" $BLUE
    Write-Host "  -Build    - Forca rebuild das imagens"
    Write-Host "  -Detach   - Executa em background"
    Write-Host "  -Volumes  - Remove volumes ao fazer down"
    Write-Host "  -Force    - Forca operacao sem confirmacao"
    Write-Host "  -Clean    - Limpa tudo (volumes, imagens, etc)"
    Write-Host ""
    Write-ColorOutput "EXEMPLOS:" $YELLOW
    Write-Host "  .\docker-dev.ps1 up              # Inicia desenvolvimento"
    Write-Host "  .\docker-dev.ps1 up -Build       # Rebuild e inicia"
    Write-Host "  .\docker-dev.ps1 status           # Verifica status"
    Write-Host "  .\docker-dev.ps1 logs app         # Logs da aplicacao"
    Write-Host "  .\docker-dev.ps1 exec app sh      # Shell no container"
    Write-Host "  .\docker-dev.ps1 prisma db push   # Aplica migrations"
    Write-Host "  .\docker-dev.ps1 clean -Force     # Limpa tudo"
    Write-Host ""
    Write-ColorOutput "URLs DO AMBIENTE:" $CYAN
    Write-Host "  Aplicacao:  http://localhost:3000"
    Write-Host "  Adminer:    http://localhost:8080"
    Write-Host "  PostgreSQL: localhost:5433"
    Write-Host ""
}

# Funcao para verificar status dos servicos
function Get-ServiceStatus {
    Write-Info "Verificando status dos servicos..."

    try {
        $containers = docker-compose -f $COMPOSE_FILE ps --format json 2>$null | ConvertFrom-Json

        if (-not $containers) {
            Write-Warning "Nenhum container esta rodando"
            return
        }

        Write-ColorOutput "`nStatus dos Servicos:" $CYAN
        Write-Host "------------------------------------------------"

        foreach ($container in $containers) {
            $status = if ($container.State -eq "running") { "[RUNNING]" } else { "[STOPPED]" }
            $health = if ($container.Health) { "[Health: $($container.Health)]" } else { "" }
            Write-Host "  $($container.Service): $status $health"
        }

        Write-Host "------------------------------------------------"

        # Testa conectividade
        Write-Info "`nTestando conectividade..."

        # Teste do banco
        try {
            docker-compose -f $COMPOSE_FILE exec -T db pg_isready 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Banco de dados esta acessivel"
            } else {
                Write-Warning "Banco de dados nao esta respondendo"
            }
        } catch {
            Write-Warning "Nao foi possivel testar o banco"
        }

        # Teste da aplicacao
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Success "Aplicacao esta acessivel"
            } else {
                Write-Warning "Aplicacao retornou status $($response.StatusCode)"
            }
        } catch {
            Write-Warning "Aplicacao nao esta acessivel ainda"
        }

    } catch {
        Write-Error "Erro ao verificar status: $_"
    }
}

# Funcao para fazer backup do banco
function Backup-Database {
    Write-Info "Iniciando backup do banco de dados..."

    $backupDir = "backups/dev"
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    }

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "$backupDir/backup_sienge_dev_$timestamp.sql"

    try {
        docker-compose -f $COMPOSE_FILE exec -T db pg_dump -U sienge_dev sienge_dev > $backupFile 2>$null
        if ($LASTEXITCODE -eq 0) {
            $size = (Get-Item $backupFile).Length / 1KB
            Write-Success "Backup criado: $backupFile (${size:N0} KB)"
        } else {
            Write-Error "Falha ao criar backup"
            Remove-Item $backupFile -ErrorAction SilentlyContinue
        }
    } catch {
        Write-Error "Erro durante backup: $_"
    }
}

# Funcao para limpar ambiente
function Clear-Environment {
    Write-Warning "Esta operacao ira remover:"
    Write-Host "  - Todos os containers"
    Write-Host "  - Todos os volumes"
    Write-Host "  - Todas as redes orfas"

    if (-not $Force) {
        $confirm = Read-Host "`nDeseja continuar? (y/N)"
        if ($confirm -ne 'y') {
            Write-Info "Operacao cancelada"
            return
        }
    }

    Write-Info "Limpando ambiente..."

    # Para containers
    docker-compose -f $COMPOSE_FILE down -v 2>$null

    # Remove imagens orfas
    if ($Clean) {
        Write-Info "Removendo imagens orfas..."
        docker image prune -af 2>$null
    }

    # Remove volumes orfaos
    Write-Info "Removendo volumes orfaos..."
    docker volume prune -f 2>$null

    # Remove redes orfas
    Write-Info "Removendo redes orfas..."
    docker network prune -f 2>$null

    Write-Success "Ambiente limpo com sucesso"
}

# Inicializacao
if ($Command -ne "help") {
    Test-Requirements
    Import-EnvFile | Out-Null
}

# Constroi os argumentos do docker-compose
$COMPOSE_ARGS = @("-f", $COMPOSE_FILE)

# Processamento dos comandos
switch ($Command) {
    "up" {
        Write-Info "Iniciando ambiente de desenvolvimento..."

        # Verifica se containers ja estao rodando
        $running = docker-compose -f $COMPOSE_FILE ps -q 2>$null
        if ($running -and -not $Force) {
            Write-Warning "Containers ja estao rodando. Use -Force para reiniciar."
            Get-ServiceStatus
            exit 0
        }

        $COMPOSE_ARGS += "up", "-d"

        if ($Build) {
            $COMPOSE_ARGS += "--build"
            Write-Info "Rebuild das imagens habilitado"
        }

        if ($Service) {
            $COMPOSE_ARGS += $Service
        }

        # Executa comando
        docker-compose @COMPOSE_ARGS

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Ambiente iniciado com sucesso!"
            Start-Sleep -Seconds 3
            Get-ServiceStatus

            Write-Host ""
            Write-ColorOutput "Ambiente pronto para desenvolvimento!" $GREEN
            Write-Host ""
            Write-ColorOutput "URLs disponiveis:" $CYAN
            Write-Host "  Aplicacao:  http://localhost:3000"
            Write-Host "  Adminer:    http://localhost:8080"
            Write-Host "  PostgreSQL: localhost:5433"
            Write-Host ""
            Write-ColorOutput "Dicas:" $YELLOW
            Write-Host "  Use '.\docker-dev.ps1 logs app' para ver logs"
            Write-Host "  Use '.\docker-dev.ps1 status' para verificar servicos"
        } else {
            Write-Error "Falha ao iniciar ambiente"
            exit 1
        }
        exit 0
    }

    "down" {
        Write-Info "Parando ambiente de desenvolvimento..."
        $COMPOSE_ARGS += "down"
        if ($Volumes) {
            $COMPOSE_ARGS += "-v"
            Write-Warning "Volumes serao removidos"
        }

        docker-compose @COMPOSE_ARGS

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Ambiente parado com sucesso"
        } else {
            Write-Error "Erro ao parar ambiente"
            exit 1
        }
        exit 0
    }

    "restart" {
        Write-Info "Reiniciando servicos..."

        if ($Service) {
            $COMPOSE_ARGS += "restart", $Service
            Write-Info "Reiniciando servico: $Service"
        } else {
            $COMPOSE_ARGS += "restart"
            Write-Info "Reiniciando todos os servicos"
        }

        docker-compose @COMPOSE_ARGS

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Servicos reiniciados"
            Start-Sleep -Seconds 2
            Get-ServiceStatus
        } else {
            Write-Error "Erro ao reiniciar"
            exit 1
        }
        exit 0
    }

    "status" {
        Get-ServiceStatus
        exit 0
    }

    "clean" {
        Clear-Environment
        exit 0
    }

    "backup" {
        Backup-Database
        exit 0
    }

    "build" {
        Write-Info "Reconstruindo imagens..."
        $COMPOSE_ARGS += "build"

        if ($Service) {
            $COMPOSE_ARGS += $Service
            Write-Info "Reconstruindo: $Service"
        } else {
            Write-Info "Reconstruindo todas as imagens"
        }

        docker-compose @COMPOSE_ARGS

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Imagens reconstruidas"
        } else {
            Write-Error "Erro na construcao"
            exit 1
        }
        exit 0
    }

    "logs" {
        Write-Info "Mostrando logs (Ctrl+C para sair)..."
        $COMPOSE_ARGS += "logs", "-f", "--tail=100"

        if ($Service) {
            $COMPOSE_ARGS += $Service
        }

        docker-compose @COMPOSE_ARGS
        exit 0
    }

    "ps" {
        Write-Info "Listando containers..."
        $COMPOSE_ARGS += "ps"
        docker-compose @COMPOSE_ARGS
        exit 0
    }

    "exec" {
        if (-not $Service) {
            Write-Error "Especifique o servico. Ex: .\docker-dev.ps1 exec app sh"
            exit 1
        }

        Write-Info "Executando comando no servico: $Service"
        $COMPOSE_ARGS += "exec", $Service

        if ($RemainingArgs.Count -eq 0) {
            $COMPOSE_ARGS += "sh"
        } else {
            $COMPOSE_ARGS += $RemainingArgs
        }

        docker-compose @COMPOSE_ARGS
        exit $LASTEXITCODE
    }

    "prisma" {
        Write-Info "Executando comando Prisma..."

        if (-not (Import-EnvFile)) {
            Write-Error "Nao foi possivel carregar .env.dev"
            exit 1
        }

        Write-Info "DATABASE_URL configurado para desenvolvimento local"

        if ($Service -or $RemainingArgs.Count -gt 0) {
            $prismaArgs = @()
            if ($Service) { $prismaArgs += $Service }
            if ($RemainingArgs.Count -gt 0) { $prismaArgs += $RemainingArgs }

            Write-Debug "Executando: npx prisma $($prismaArgs -join ' ')"
            & npx prisma @prismaArgs
        } else {
            Write-Error "Especifique o comando. Ex: .\docker-dev.ps1 prisma db push"
            exit 1
        }
        exit $LASTEXITCODE
    }

    { $_ -in @("db", "adminer") } {
        Write-Info "Abrindo Adminer no navegador..."

        # Verifica se Adminer esta rodando
        $adminerRunning = docker-compose -f $COMPOSE_FILE ps adminer 2>$null | Select-String "Up"
        if (-not $adminerRunning) {
            Write-Warning "Adminer nao esta rodando. Inicie o ambiente primeiro."
            exit 1
        }

        Write-ColorOutput "Credenciais do banco:" $YELLOW
        Write-Host "  Sistema:  PostgreSQL"
        Write-Host "  Servidor: db (ou localhost:5433 externamente)"
        Write-Host "  Usuario:  sienge_dev"
        Write-Host "  Senha:    dev_password_123"
        Write-Host "  Banco:    sienge_dev"
        Write-Host ""

        Start-Process "http://localhost:8080"
        Write-Success "Adminer aberto em http://localhost:8080"
        exit 0
    }

    "help" {
        Show-Help
        exit 0
    }

    default {
        Write-Error "Comando desconhecido: $Command"
        Show-Help
        exit 1
    }
}

# Fim do script - os comandos sao executados dentro do switch