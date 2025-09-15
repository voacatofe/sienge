#!/usr/bin/env pwsh
# ============================================
# SIENGE - Development Environment Initializer
# ============================================
# Script para inicializar o ambiente de dev pela primeira vez

param(
    [switch]$Force,
    [switch]$SkipDependencies
)

$ErrorActionPreference = "Stop"

# Cores
$GREEN = "`e[32m"
$YELLOW = "`e[33m"
$RED = "`e[31m"
$BLUE = "`e[34m"
$CYAN = "`e[36m"
$RESET = "`e[0m"

function Write-Success { Write-Host "$GREEN✅ $args$RESET" }
function Write-Warning { Write-Host "$YELLOW⚠️  $args$RESET" }
function Write-Error { Write-Host "$RED❌ $args$RESET" }
function Write-Info { Write-Host "$BLUE⚡ $args$RESET" }
function Write-Header {
    Write-Host ""
    Write-Host "$CYAN════════════════════════════════════════════$RESET"
    Write-Host "$CYAN     $args$RESET"
    Write-Host "$CYAN════════════════════════════════════════════$RESET"
    Write-Host ""
}

Write-Header "🚀 Inicializando Ambiente de Desenvolvimento"

# Verifica Docker
Write-Info "Verificando Docker..."
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker não está instalado!"
    Write-Info "Baixe em: https://www.docker.com/products/docker-desktop"
    exit 1
}

$dockerRunning = docker info 2>$null
if (-not $dockerRunning) {
    Write-Error "Docker não está rodando! Inicie o Docker Desktop."
    exit 1
}
Write-Success "Docker está pronto"

# Verifica Node.js
if (-not $SkipDependencies) {
    Write-Info "Verificando Node.js..."
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Warning "Node.js não encontrado. Instalando dependências será ignorado."
        $SkipDependencies = $true
    } else {
        $nodeVersion = node --version
        Write-Success "Node.js $nodeVersion encontrado"
    }
}

# Cria estrutura de diretórios
Write-Info "Criando estrutura de diretórios..."
$directories = @(
    "logs",
    "logs/postgres",
    "logs/app",
    "backups",
    "backups/dev"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Success "Criado: $dir"
    }
}

# Verifica/cria arquivo .env.dev
Write-Info "Configurando arquivo .env.dev..."
if (-not (Test-Path ".env.dev")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.dev"
        Write-Success "Arquivo .env.dev criado a partir de .env.example"
        Write-Warning "⚠️  IMPORTANTE: Edite .env.dev com suas configurações!"
    } else {
        Write-Error ".env.example não encontrado!"
        exit 1
    }
} else {
    Write-Success ".env.dev já existe"
}

# Verifica arquivos PostgreSQL
Write-Info "Verificando configurações PostgreSQL..."
$pgFiles = @{
    "postgresql.conf" = $false
    "pg_hba.conf" = $false
}

foreach ($file in $pgFiles.Keys) {
    if (Test-Path $file) {
        Write-Success "$file encontrado"
    } else {
        Write-Error "$file não encontrado!"
        Write-Info "Execute o script principal para criar os arquivos de configuração"
        exit 1
    }
}

# Instala dependências Node.js
if (-not $SkipDependencies) {
    Write-Info "Instalando dependências Node.js..."
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependências instaladas"
    } else {
        Write-Warning "Erro ao instalar dependências"
    }
}

# Constrói imagens Docker
Write-Info "Construindo imagens Docker..."
docker-compose -f docker-compose-dev.yml build
if ($LASTEXITCODE -eq 0) {
    Write-Success "Imagens construídas com sucesso"
} else {
    Write-Error "Erro ao construir imagens"
    exit 1
}

# Inicia serviços
Write-Info "Iniciando serviços..."
docker-compose -f docker-compose-dev.yml up -d
if ($LASTEXITCODE -eq 0) {
    Write-Success "Serviços iniciados"
} else {
    Write-Error "Erro ao iniciar serviços"
    exit 1
}

# Aguarda banco de dados
Write-Info "Aguardando banco de dados ficar pronto..."
$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    Write-Host -NoNewline "."

    docker-compose -f docker-compose-dev.yml exec -T db pg_isready 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Success "Banco de dados está pronto!"
        break
    }

    Start-Sleep -Seconds 2
}

if ($attempt -eq $maxAttempts) {
    Write-Host ""
    Write-Error "Timeout esperando banco de dados"
    exit 1
}

# Executa migrations Prisma
Write-Info "Aplicando migrations do Prisma..."

# Carrega variáveis do .env.dev
Get-Content ".env.dev" | ForEach-Object {
    if ($_ -match "^[^#].*=") {
        $key, $value = $_ -split "=", 2
        $value = $value.Trim('"').Trim("'")
        [Environment]::SetEnvironmentVariable($key.Trim(), $value, "Process")
    }
}

npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Success "Prisma Client gerado"
}

npx prisma db push
if ($LASTEXITCODE -eq 0) {
    Write-Success "Schema aplicado ao banco de dados"
} else {
    Write-Warning "Erro ao aplicar schema. Verifique manualmente."
}

Write-Header "✨ Ambiente Inicializado com Sucesso!"

Write-Host ""
Write-Host "$CYAN📌 URLs disponíveis:$RESET"
Write-Host "  🌐 Aplicação:  http://localhost:3000"
Write-Host "  🗄️  Adminer:    http://localhost:8080"
Write-Host "  📊 PostgreSQL: localhost:5433"
Write-Host ""
Write-Host "$YELLOW💡 Próximos passos:$RESET"
Write-Host "  1. Verifique o arquivo .env.dev"
Write-Host "  2. Execute: .\docker-dev.ps1 status"
Write-Host "  3. Acesse http://localhost:3000"
Write-Host ""
Write-Host "$GREEN🎉 Desenvolvimento pronto!$RESET"