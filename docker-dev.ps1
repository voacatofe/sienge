#!/usr/bin/env pwsh
# Script para gerenciar Docker Compose em ambiente de desenvolvimento
# Sempre usa o arquivo docker-compose-dev.yml

param(
    [Parameter(Position=0)]
    [ValidateSet("up", "down", "build", "restart", "logs", "ps", "exec", "db", "adminer")]
    [string]$Command = "up",
    
    [Parameter(Position=1)]
    [string]$Service = "",
    
    [switch]$Build,
    [switch]$Detach,
    [switch]$Volumes,
    [switch]$Force
)

# Define o arquivo de compose para desenvolvimento
$COMPOSE_FILE = "docker-compose-dev.yml"

# Cores para output
$GREEN = "`e[32m"
$YELLOW = "`e[33m"
$RED = "`e[31m"
$BLUE = "`e[34m"
$RESET = "`e[0m"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = $RESET)
    Write-Host "$Color$Message$RESET"
}

function Show-Help {
    Write-ColorOutput "🐳 Docker Compose Development Helper" $BLUE
    Write-Host ""
    Write-ColorOutput "Uso: .\docker-dev.ps1 [COMANDO] [SERVIÇO] [OPÇÕES]" $YELLOW
    Write-Host ""
    Write-ColorOutput "Comandos disponíveis:" $GREEN
    Write-Host "  up        - Inicia os serviços (padrão)"
    Write-Host "  down      - Para e remove os serviços"
    Write-Host "  build     - Constrói as imagens"
    Write-Host "  restart   - Reinicia os serviços"
    Write-Host "  logs      - Mostra os logs"
    Write-Host "  ps        - Lista os containers"
    Write-Host "  exec      - Executa comando no container"
    Write-Host "  db        - Abre Adminer (interface web do banco)"
    Write-Host "  adminer   - Alias para db"
    Write-Host ""
    Write-ColorOutput "Opções:" $GREEN
    Write-Host "  -Build    - Força rebuild das imagens"
    Write-Host "  -Detach   - Executa em background"
    Write-Host "  -Volumes  - Remove volumes ao fazer down"
    Write-Host "  -Force    - Força operação sem confirmação"
    Write-Host ""
    Write-ColorOutput "Exemplos:" $YELLOW
    Write-Host "  .\docker-dev.ps1                    # Inicia tudo"
    Write-Host "  .\docker-dev.ps1 up -Build          # Inicia com rebuild"
    Write-Host "  .\docker-dev.ps1 down -Volumes      # Para e remove volumes"
    Write-Host "  .\docker-dev.ps1 logs app           # Logs da aplicação"
    Write-Host "  .\docker-dev.ps1 exec app sh        # Shell na aplicação"
    Write-Host "  .\docker-dev.ps1 db                 # Abre Adminer"
}

# Verifica se o arquivo docker-compose-dev.yml existe
if (-not (Test-Path $COMPOSE_FILE)) {
    Write-ColorOutput "❌ Arquivo $COMPOSE_FILE não encontrado!" $RED
    exit 1
}

# Constrói os argumentos do docker-compose
$COMPOSE_ARGS = @("-f", $COMPOSE_FILE)

switch ($Command) {
    "up" {
        Write-ColorOutput "🚀 Iniciando ambiente de desenvolvimento..." $BLUE
        if ($Build) {
            $COMPOSE_ARGS += "--build"
            Write-ColorOutput "🔨 Rebuild habilitado" $YELLOW
        }
        if ($Detach) {
            $COMPOSE_ARGS += "-d"
        } else {
            $COMPOSE_ARGS += "-d"  # Sempre em background para desenvolvimento
        }
        $COMPOSE_ARGS += "up"
        if ($Service) {
            $COMPOSE_ARGS += $Service
        }
    }
    
    "down" {
        Write-ColorOutput "🛑 Parando ambiente de desenvolvimento..." $YELLOW
        $COMPOSE_ARGS += "down"
        if ($Volumes) {
            $COMPOSE_ARGS += "-v"
            Write-ColorOutput "🗑️  Removendo volumes..." $YELLOW
        }
    }
    
    "build" {
        Write-ColorOutput "🔨 Construindo imagens..." $BLUE
        $COMPOSE_ARGS += "build"
        if ($Service) {
            $COMPOSE_ARGS += $Service
        }
    }
    
    "restart" {
        Write-ColorOutput "🔄 Reiniciando serviços..." $YELLOW
        $COMPOSE_ARGS += "restart"
        if ($Service) {
            $COMPOSE_ARGS += $Service
        }
    }
    
    "logs" {
        Write-ColorOutput "📋 Mostrando logs..." $BLUE
        $COMPOSE_ARGS += "logs"
        $COMPOSE_ARGS += "-f"  # Follow logs
        if ($Service) {
            $COMPOSE_ARGS += $Service
        }
    }
    
    "ps" {
        Write-ColorOutput "📊 Status dos containers..." $BLUE
        $COMPOSE_ARGS += "ps"
    }
    
    "exec" {
        if (-not $Service) {
            Write-ColorOutput "❌ Especifique o serviço para exec. Ex: .\docker-dev.ps1 exec app sh" $RED
            exit 1
        }
        Write-ColorOutput "🔧 Executando comando no serviço: $Service" $BLUE
        $COMPOSE_ARGS += "exec"
        $COMPOSE_ARGS += $Service
        
        # Se não há argumentos adicionais, abre shell interativo
        if ($args.Count -eq 0) {
            $COMPOSE_ARGS += "sh"
        } else {
            $COMPOSE_ARGS += $args
        }
    }
    
    { $_ -in @("db", "adminer") } {
        Write-ColorOutput "🌐 Abrindo Adminer..." $BLUE
        Write-ColorOutput "📋 Credenciais do banco:" $YELLOW
        Write-Host "  Servidor: db"
        Write-Host "  Usuário: sienge_dev"
        Write-Host "  Senha: dev_password"
        Write-Host "  Banco: sienge_dev"
        Write-Host ""
        Write-ColorOutput "🔗 Acesse: http://localhost:8080" $GREEN
        Start-Process "http://localhost:8080"
        exit 0
    }
    
    default {
        Show-Help
        exit 1
    }
}

# Executa o comando docker-compose
Write-ColorOutput "⚡ Executando: docker-compose $($COMPOSE_ARGS -join ' ')" $YELLOW
Write-Host ""

try {
    & docker-compose @COMPOSE_ARGS
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ Comando executado com sucesso!" $GREEN
    } else {
        Write-ColorOutput "❌ Erro na execução do comando!" $RED
    }
} catch {
    Write-ColorOutput "❌ Erro: $($_.Exception.Message)" $RED
    exit 1
}

# Comandos pós-execução
if ($Command -eq "up") {
    Write-Host ""
    Write-ColorOutput "🎉 Ambiente de desenvolvimento iniciado!" $GREEN
    Write-ColorOutput "📋 Serviços disponíveis:" $BLUE
    Write-Host "  🌐 Aplicação: http://localhost:3000"
    Write-Host "  🗄️  Adminer: http://localhost:8080"
    Write-Host "  📊 Banco: localhost:5433"
    Write-Host ""
    Write-ColorOutput "📝 Comandos úteis:" $YELLOW
    Write-Host "  .\docker-dev.ps1 logs app    # Ver logs da aplicação"
    Write-Host "  .\docker-dev.ps1 exec app sh # Shell na aplicação"
    Write-Host "  .\docker-dev.ps1 db          # Abrir Adminer"
    Write-Host "  .\docker-dev.ps1 down        # Parar tudo"
}
