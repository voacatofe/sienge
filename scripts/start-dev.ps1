# Script PowerShell para iniciar ambiente de DESENVOLVIMENTO do projeto Sienge
# Otimizado para desenvolvimento com hot reload e recursos limitados

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    [Parameter(Position=1)]
    [string]$Option = ""
)

# Configurações
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$EnvFile = ".env.dev"
$ComposeFile = "docker-compose-dev.yml"

# Função para imprimir mensagens coloridas
function Write-Header {
    Write-Host "🛠️  Sienge - Ambiente de DESENVOLVIMENTO" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Função para configurar ambiente de desenvolvimento
function Setup-DevelopmentEnvironment {
    Write-Status "Configurando ambiente de desenvolvimento..."
    
    # Configurações padrão para desenvolvimento
    $env:NODE_ENV = "development"
    $env:BUILD_TARGET = "development"
    $env:POSTGRES_DB = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "sienge_dev" }
    $env:POSTGRES_USER = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "sienge_dev" }
    $env:POSTGRES_PASSWORD = if ($env:POSTGRES_PASSWORD) { $env:POSTGRES_PASSWORD } else { "dev_password" }
    $env:DB_PORT_EXTERNAL = if ($env:DB_PORT_EXTERNAL) { $env:DB_PORT_EXTERNAL } else { "5433" }
    $env:APP_PORT_EXTERNAL = if ($env:APP_PORT_EXTERNAL) { $env:APP_PORT_EXTERNAL } else { "3000" }
    $env:ADMINER_PORT_EXTERNAL = if ($env:ADMINER_PORT_EXTERNAL) { $env:ADMINER_PORT_EXTERNAL } else { "8080" }
    
    # Recursos limitados para desenvolvimento
    $env:DB_MEMORY_LIMIT = if ($env:DB_MEMORY_LIMIT) { $env:DB_MEMORY_LIMIT } else { "512M" }
    $env:DB_CPU_LIMIT = if ($env:DB_CPU_LIMIT) { $env:DB_CPU_LIMIT } else { "0.5" }
    $env:APP_MEMORY_LIMIT = if ($env:APP_MEMORY_LIMIT) { $env:APP_MEMORY_LIMIT } else { "1G" }
    $env:APP_CPU_LIMIT = if ($env:APP_CPU_LIMIT) { $env:APP_CPU_LIMIT } else { "1.0" }
    $env:ADMINER_MEMORY_LIMIT = if ($env:ADMINER_MEMORY_LIMIT) { $env:ADMINER_MEMORY_LIMIT } else { "256M" }
    $env:ADMINER_CPU_LIMIT = if ($env:ADMINER_CPU_LIMIT) { $env:ADMINER_CPU_LIMIT } else { "0.5" }
    
    # Configurações de sincronização para desenvolvimento (mais frequente)
    $env:SYNC_SCHEDULE = if ($env:SYNC_SCHEDULE) { $env:SYNC_SCHEDULE } else { "*/5 * * * *" }
    $env:SYNC_BATCH_SIZE = if ($env:SYNC_BATCH_SIZE) { $env:SYNC_BATCH_SIZE } else { "50" }
    $env:SYNC_MAX_RETRIES = if ($env:SYNC_MAX_RETRIES) { $env:SYNC_MAX_RETRIES } else { "1" }
}

# Função para carregar variáveis de ambiente
function Load-Environment {
    Setup-DevelopmentEnvironment
    
    if (Test-Path $EnvFile) {
        Write-Status "Carregando variáveis de ambiente de $EnvFile..."
        Get-Content $EnvFile | ForEach-Object {
            if ($_ -match "^[^#]*=") {
                $key, $value = $_ -split "=", 2
                [Environment]::SetEnvironmentVariable($key, $value, "Process")
            }
        }
    } else {
        Write-Warning "Arquivo $EnvFile não encontrado. Usando valores padrão."
        Write-Status "Crie o arquivo .env.dev baseado no .env.example para configurações personalizadas"
    }
}

# Função para verificar Docker
function Test-Docker {
    try {
        docker info | Out-Null
        Write-Success "Docker está rodando"
    } catch {
        Write-Error "Docker não está rodando. Por favor, inicie o Docker Desktop."
        exit 1
    }
}

# Função para verificar configurações de desenvolvimento
function Test-DevelopmentConfig {
    Write-Status "Verificando configurações de desenvolvimento..."
    
    # Verificar se não está usando porta de produção
    if ($env:DB_PORT_EXTERNAL -eq "5432") {
        Write-Warning "ATENÇÃO: Usando porta 5432 (produção) para desenvolvimento!"
        Write-Status "Considere usar porta 5433 para evitar conflitos"
    }
    
    Write-Success "Verificação de desenvolvimento concluída"
}

# Função para iniciar ambiente de desenvolvimento
function Start-Development {
    param([string]$Clean)
    
    Write-Header
    Write-Status "Iniciando ambiente de DESENVOLVIMENTO..."
    
    Test-Docker
    Load-Environment
    Test-DevelopmentConfig
    
    # Parar containers existentes
    Write-Status "Parando containers existentes..."
    docker-compose -f $ComposeFile down 2>$null
    
    # Limpar volumes se solicitado
    if ($Clean -eq "true") {
        Write-Warning "Removendo volumes de desenvolvimento..."
        docker-compose -f $ComposeFile down -v 2>$null
    }
    
    # Construir e iniciar containers
    Write-Status "Construindo e iniciando containers de desenvolvimento..."
    docker-compose -f $ComposeFile up --build -d
    
    # Aguardar containers ficarem prontos
    Write-Status "Aguardando containers ficarem prontos..."
    Start-Sleep -Seconds 15
    
    # Verificar status
    Write-Status "Verificando status dos containers..."
    docker-compose -f $ComposeFile ps
    
    # Testar conectividade
    Test-Connectivity
    
    # Mostrar informações de acesso
    Show-AccessInfo
}

# Função para parar ambiente de desenvolvimento
function Stop-Development {
    param([string]$Clean)
    
    Write-Status "Parando ambiente de DESENVOLVIMENTO..."
    Load-Environment
    
    if ($Clean -eq "true") {
        Write-Status "Removendo volumes de desenvolvimento..."
        docker-compose -f $ComposeFile down -v
    } else {
        docker-compose -f $ComposeFile down
    }
    
    Write-Success "Ambiente de desenvolvimento parado com sucesso!"
}

# Função para visualizar logs
function Show-Logs {
    Write-Status "Visualizando logs do ambiente de desenvolvimento..."
    Load-Environment
    
    $containers = docker-compose -f $ComposeFile ps
    if (-not ($containers -match "Up")) {
        Write-Error "Nenhum container está rodando."
        Write-Status "Execute: $($MyInvocation.MyCommand.Name) start"
        exit 1
    }
    
    Write-Status "Pressione Ctrl+C para sair dos logs"
    Write-Host ""
    docker-compose -f $ComposeFile logs -f
}

# Função para backup do banco
function Backup-Database {
    Write-Status "Criando backup do banco de dados de desenvolvimento..."
    Load-Environment
    
    # Configurar variáveis do banco
    $dbName = "sienge_dev"
    $dbUser = "sienge_dev"
    $backupDir = "backups/dev"
    
    # Criar diretório de backup
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    }
    
    # Gerar nome do arquivo com timestamp
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "$backupDir/backup_${dbName}_${timestamp}.sql"
    
    # Verificar se os containers estão rodando
    $containers = docker-compose -f $ComposeFile ps
    if (-not ($containers -match "Up")) {
        Write-Error "Containers não estão rodando. Execute primeiro: $($MyInvocation.MyCommand.Name) start"
        exit 1
    }
    
    # Criar backup
    docker-compose -f $ComposeFile exec -T db pg_dump -U $dbUser $dbName | Out-File -FilePath $backupFile -Encoding UTF8
    
    if ($LASTEXITCODE -eq 0) {
        $fileSize = (Get-Item $backupFile).Length
        $fileSizeMB = [math]::Round($fileSize / 1MB, 2)
        Write-Success "Backup criado com sucesso: $backupFile"
        Write-Status "Tamanho: ${fileSizeMB} MB"
    } else {
        Write-Error "Falha ao criar backup"
        exit 1
    }
}

# Função para testar conectividade
function Test-Connectivity {
    Write-Status "Testando conectividade..."
    
    # Testar banco de dados
    $dbTest = docker-compose -f $ComposeFile exec -T db pg_isready -U $env:POSTGRES_USER -d $env:POSTGRES_DB 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Banco de dados está acessível"
    } else {
        Write-Error "Banco de dados não está acessível"
    }
    
    # Testar aplicação
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($env:APP_PORT_EXTERNAL)/api/health" -UseBasicParsing -TimeoutSec 5
        Write-Success "Aplicação está acessível"
    } catch {
        Write-Warning "Aplicação ainda não está acessível (pode estar inicializando)"
    }
}

# Função para mostrar informações de acesso
function Show-AccessInfo {
    Write-Host ""
    Write-Success "🎉 Ambiente de DESENVOLVIMENTO iniciado com sucesso!"
    Write-Host ""
    Write-Host "📋 Informações de acesso:"
    Write-Host "  🌐 Aplicação: http://localhost:$($env:APP_PORT_EXTERNAL)"
    Write-Host "  🗄️  Banco de dados: localhost:$($env:DB_PORT_EXTERNAL)"
    Write-Host "  📊 Adminer: http://localhost:$($env:ADMINER_PORT_EXTERNAL)"
    Write-Host "  📊 URL Externa BD: postgresql://$($env:POSTGRES_USER):$($env:POSTGRES_PASSWORD)@localhost:$($env:DB_PORT_EXTERNAL)/$($env:POSTGRES_DB)"
    Write-Host ""
    Write-Host "🔧 Comandos úteis:"
    Write-Host "  📝 Ver logs: $($MyInvocation.MyCommand.Name) logs"
    Write-Host "  🛑 Parar: $($MyInvocation.MyCommand.Name) stop"
    Write-Host "  🔄 Reiniciar: $($MyInvocation.MyCommand.Name) restart"
    Write-Host "  🧹 Limpar tudo: $($MyInvocation.MyCommand.Name) stop --clean"
    Write-Host "  💾 Backup: $($MyInvocation.MyCommand.Name) backup"
    Write-Host ""
    Write-Host "🛠️  Recursos de desenvolvimento:"
    Write-Host "   - Hot reload habilitado"
    Write-Host "   - Logs detalhados"
    Write-Host "   - Recursos limitados"
    Write-Host "   - Sincronização frequente (5 min)"
    Write-Host ""
}

# Função para mostrar ajuda
function Show-Help {
    Write-Header
    
    Write-Host "📋 Comandos Disponíveis:" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "🛠️  Desenvolvimento:" -ForegroundColor Yellow
    Write-Host "  start              - Iniciar ambiente de desenvolvimento" -ForegroundColor Green
    Write-Host "  start --clean     - Iniciar ambiente limpo (remove volumes)" -ForegroundColor Green
    Write-Host "  stop               - Parar ambiente de desenvolvimento" -ForegroundColor Green
    Write-Host "  stop --clean      - Parar e remover volumes" -ForegroundColor Green
    Write-Host "  restart           - Reiniciar ambiente" -ForegroundColor Green
    Write-Host "  logs               - Visualizar logs" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "💾 Backup:" -ForegroundColor Yellow
    Write-Host "  backup            - Backup do banco de desenvolvimento" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "💡 Exemplos de uso:" -ForegroundColor Cyan
    Write-Host "  $($MyInvocation.MyCommand.Name) start                    # Iniciar desenvolvimento" -ForegroundColor Green
    Write-Host "  $($MyInvocation.MyCommand.Name) start --clean           # Iniciar limpo" -ForegroundColor Green
    Write-Host "  $($MyInvocation.MyCommand.Name) backup                   # Backup desenvolvimento" -ForegroundColor Green
    Write-Host ""
    Write-Host "🛠️  Recursos de desenvolvimento:" -ForegroundColor Blue
    Write-Host "  • Hot reload habilitado" -ForegroundColor Blue
    Write-Host "  • Logs detalhados" -ForegroundColor Blue
    Write-Host "  • Recursos limitados" -ForegroundColor Blue
    Write-Host "  • Sincronização frequente" -ForegroundColor Blue
    Write-Host ""
}

# Função principal
function Main {
    Set-Location $ProjectRoot
    
    switch ($Command) {
        "start" {
            Start-Development $Option
        }
        "stop" {
            Stop-Development $Option
        }
        "restart" {
            Stop-Development "false"
            Start-Sleep -Seconds 2
            Start-Development "false"
        }
        "logs" {
            Show-Logs
        }
        "backup" {
            Backup-Database
        }
        "help" {
            Show-Help
        }
        default {
            Write-Error "Comando não reconhecido: $Command"
            Write-Host ""
            Show-Help
            exit 1
        }
    }
}

# Executar função principal
Main
