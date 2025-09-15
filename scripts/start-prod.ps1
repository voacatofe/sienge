# Script PowerShell para iniciar ambiente de PRODUÇÃO do projeto Sienge
# Otimizado para produção com recursos completos e segurança reforçada

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    [Parameter(Position=1)]
    [string]$Option = ""
)

# Configurações
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$EnvFile = ".env"
$ComposeFile = "docker-compose.yml"

# Função para imprimir mensagens coloridas
function Write-Header {
    Write-Host "🏭 Sienge - Ambiente de PRODUÇÃO" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan
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

# Função para configurar ambiente de produção
function Setup-ProductionEnvironment {
    Write-Status "Configurando ambiente de produção..."
    
    # Configurações padrão para produção
    $env:NODE_ENV = "production"
    $env:BUILD_TARGET = "production"
    $env:POSTGRES_DB = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "sienge_data" }
    $env:POSTGRES_USER = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "sienge_app" }
    $env:POSTGRES_PASSWORD = if ($env:POSTGRES_PASSWORD) { $env:POSTGRES_PASSWORD } else { "senha_forte" }
    $env:DB_PORT_EXTERNAL = if ($env:DB_PORT_EXTERNAL) { $env:DB_PORT_EXTERNAL } else { "5432" }
    $env:APP_PORT_EXTERNAL = if ($env:APP_PORT_EXTERNAL) { $env:APP_PORT_EXTERNAL } else { "3000" }
    $env:ADMINER_PORT_EXTERNAL = if ($env:ADMINER_PORT_EXTERNAL) { $env:ADMINER_PORT_EXTERNAL } else { "8080" }
    
    # Recursos otimizados para produção
    $env:DB_MEMORY_LIMIT = if ($env:DB_MEMORY_LIMIT) { $env:DB_MEMORY_LIMIT } else { "2G" }
    $env:DB_CPU_LIMIT = if ($env:DB_CPU_LIMIT) { $env:DB_CPU_LIMIT } else { "2.0" }
    $env:APP_MEMORY_LIMIT = if ($env:APP_MEMORY_LIMIT) { $env:APP_MEMORY_LIMIT } else { "4G" }
    $env:APP_CPU_LIMIT = if ($env:APP_CPU_LIMIT) { $env:APP_CPU_LIMIT } else { "4.0" }
    $env:ADMINER_MEMORY_LIMIT = if ($env:ADMINER_MEMORY_LIMIT) { $env:ADMINER_MEMORY_LIMIT } else { "512M" }
    $env:ADMINER_CPU_LIMIT = if ($env:ADMINER_CPU_LIMIT) { $env:ADMINER_CPU_LIMIT } else { "1.0" }
    
    # Configurações de sincronização para produção
    $env:SYNC_SCHEDULE = if ($env:SYNC_SCHEDULE) { $env:SYNC_SCHEDULE } else { "0 2 * * *" }
    $env:SYNC_BATCH_SIZE = if ($env:SYNC_BATCH_SIZE) { $env:SYNC_BATCH_SIZE } else { "200" }
    $env:SYNC_MAX_RETRIES = if ($env:SYNC_MAX_RETRIES) { $env:SYNC_MAX_RETRIES } else { "3" }
}

# Função para carregar variáveis de ambiente
function Load-Environment {
    Setup-ProductionEnvironment
    
    if (Test-Path $EnvFile) {
        Write-Status "Carregando variáveis de ambiente de $EnvFile..."
        Get-Content $EnvFile | ForEach-Object {
            if ($_ -match "^[^#]*=") {
                $key, $value = $_ -split "=", 2
                [Environment]::SetEnvironmentVariable($key, $value, "Process")
            }
        }
    } else {
        Write-Error "Arquivo $EnvFile não encontrado!"
        Write-Status "Crie o arquivo .env baseado no .env.example"
        exit 1
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

# Função para verificar segurança
function Test-Security {
    Write-Status "Verificando configurações de segurança..."
    
    # Verificar se senhas não são padrão
    if ($env:POSTGRES_PASSWORD -eq "senha_forte" -or $env:POSTGRES_PASSWORD -eq "dev_password") {
        Write-Warning "ATENÇÃO: Senha padrão detectada! Configure uma senha forte no .env"
    }
    
    # Verificar se credenciais da API Sienge estão configuradas
    if (-not $env:SIENGE_SUBDOMAIN -or -not $env:SIENGE_USERNAME -or -not $env:SIENGE_PASSWORD) {
        Write-Warning "ATENÇÃO: Credenciais da API Sienge não configuradas!"
        Write-Status "Configure SIENGE_SUBDOMAIN, SIENGE_USERNAME e SIENGE_PASSWORD no .env"
    }
    
    Write-Success "Verificação de segurança concluída"
}

# Função para iniciar ambiente de produção
function Start-Production {
    param([string]$Clean)
    
    Write-Header
    Write-Status "Iniciando ambiente de PRODUÇÃO..."
    
    Test-Docker
    Load-Environment
    Test-Security
    
    # Parar containers existentes
    Write-Status "Parando containers existentes..."
    docker-compose -f $ComposeFile down 2>$null
    
    # Limpar volumes se solicitado
    if ($Clean -eq "true") {
        Write-Warning "ATENÇÃO: Removendo TODOS os dados do banco de produção!"
        $confirm = Read-Host "Tem certeza que deseja continuar? (y/N)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-Status "Operação cancelada."
            return
        }
        Write-Status "Removendo volumes..."
        docker-compose -f $ComposeFile down -v 2>$null
    }
    
    # Construir e iniciar containers
    Write-Status "Construindo e iniciando containers de produção..."
    docker-compose -f $ComposeFile up --build -d
    
    # Aguardar containers ficarem prontos
    Write-Status "Aguardando containers ficarem prontos..."
    Start-Sleep -Seconds 20
    
    # Verificar status
    Write-Status "Verificando status dos containers..."
    docker-compose -f $ComposeFile ps
    
    # Testar conectividade
    Test-Connectivity
    
    # Mostrar informações de acesso
    Show-AccessInfo
}

# Função para parar ambiente de produção
function Stop-Production {
    param([string]$Clean)
    
    Write-Status "Parando ambiente de PRODUÇÃO..."
    Load-Environment
    
    if ($Clean -eq "true") {
        Write-Warning "ATENÇÃO: Isso irá remover TODOS os dados do banco de produção!"
        $confirm = Read-Host "Tem certeza que deseja continuar? (y/N)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-Status "Operação cancelada."
            return
        }
        Write-Status "Removendo volumes..."
        docker-compose -f $ComposeFile down -v
    } else {
        docker-compose -f $ComposeFile down
    }
    
    Write-Success "Ambiente de produção parado com sucesso!"
}

# Função para visualizar logs
function Show-Logs {
    Write-Status "Visualizando logs do ambiente de produção..."
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
    Write-Status "Criando backup do banco de dados de produção..."
    Load-Environment
    
    # Configurar variáveis do banco
    $dbName = "sienge_data"
    $dbUser = "sienge_app"
    $backupDir = "backups/prod"
    
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
    Write-Success "🎉 Ambiente de PRODUÇÃO iniciado com sucesso!"
    Write-Host ""
    Write-Host "📋 Informações de acesso:"
    Write-Host "  🌐 Aplicação: http://${env:NEXT_PUBLIC_PRIMARY_DOMAIN}:$($env:APP_PORT_EXTERNAL)"
    Write-Host "  🗄️  Banco de dados: ${env:NEXT_PUBLIC_PRIMARY_DOMAIN}:$($env:DB_PORT_EXTERNAL)"
    Write-Host "  📊 Adminer: http://${env:NEXT_PUBLIC_PRIMARY_DOMAIN}:$($env:ADMINER_PORT_EXTERNAL)"
    Write-Host "  📊 URL Externa BD: postgresql://$($env:POSTGRES_USER):$($env:POSTGRES_PASSWORD)@${env:NEXT_PUBLIC_PRIMARY_DOMAIN}:$($env:DB_PORT_EXTERNAL)/$($env:POSTGRES_DB)"
    Write-Host ""
    Write-Host "🔧 Comandos úteis:"
    Write-Host "  📝 Ver logs: $($MyInvocation.MyCommand.Name) logs"
    Write-Host "  🛑 Parar: $($MyInvocation.MyCommand.Name) stop"
    Write-Host "  🔄 Reiniciar: $($MyInvocation.MyCommand.Name) restart"
    Write-Host "  🧹 Limpar tudo: $($MyInvocation.MyCommand.Name) stop --clean"
    Write-Host "  💾 Backup: $($MyInvocation.MyCommand.Name) backup"
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Este é o ambiente de PRODUÇÃO!"
    Write-Host "   - Faça backups regulares"
    Write-Host "   - Monitore os logs"
    Write-Host "   - Configure credenciais seguras"
    Write-Host ""
}

# Função para mostrar ajuda
function Show-Help {
    Write-Header
    
    Write-Host "📋 Comandos Disponíveis:" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "🏭 Produção:" -ForegroundColor Yellow
    Write-Host "  start              - Iniciar ambiente de produção" -ForegroundColor Green
    Write-Host "  start --clean     - Iniciar ambiente limpo (remove volumes - CUIDADO!)" -ForegroundColor Green
    Write-Host "  stop               - Parar ambiente de produção" -ForegroundColor Green
    Write-Host "  stop --clean      - Parar e remover volumes (CUIDADO!)" -ForegroundColor Green
    Write-Host "  restart           - Reiniciar ambiente" -ForegroundColor Green
    Write-Host "  logs               - Visualizar logs" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "💾 Backup:" -ForegroundColor Yellow
    Write-Host "  backup            - Backup do banco de produção" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "💡 Exemplos de uso:" -ForegroundColor Cyan
    Write-Host "  $($MyInvocation.MyCommand.Name) start                    # Iniciar produção" -ForegroundColor Green
    Write-Host "  $($MyInvocation.MyCommand.Name) backup                   # Backup produção" -ForegroundColor Green
    Write-Host "  $($MyInvocation.MyCommand.Name) stop --clean             # Parar e limpar (CUIDADO!)" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  ATENÇÃO: Este é o ambiente de PRODUÇÃO!" -ForegroundColor Red
    Write-Host "   Use com cuidado e sempre faça backups!" -ForegroundColor Red
    Write-Host ""
}

# Função principal
function Main {
    Set-Location $ProjectRoot
    
    switch ($Command) {
        "start" {
            Start-Production $Option
        }
        "stop" {
            Stop-Production $Option
        }
        "restart" {
            Stop-Production "false"
            Start-Sleep -Seconds 2
            Start-Production "false"
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
