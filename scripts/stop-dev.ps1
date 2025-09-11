# Script para parar ambiente de desenvolvimento (PowerShell)
# scripts/stop-dev.ps1

param(
    [switch]$Clean
)

Write-Host "🛑 Parando ambiente de desenvolvimento do Sienge..." -ForegroundColor Blue

# Função para imprimir mensagens coloridas
function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

# Parar containers de desenvolvimento
Write-Status "Parando containers de desenvolvimento..."
docker-compose -f docker-compose-dev.yml down

Write-Success "Ambiente de desenvolvimento parado com sucesso!"

# Opção para limpar volumes também
if ($Clean) {
    Write-Status "Removendo volumes de desenvolvimento..."
    docker-compose -f docker-compose-dev.yml down -v
    Write-Success "Volumes removidos!"
}

Write-Status "Ambiente de desenvolvimento parado! 🛑"
