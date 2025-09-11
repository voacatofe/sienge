# Script para parar ambiente de produção (PowerShell)
# scripts/stop-prod.ps1

param(
    [switch]$Clean
)

Write-Host "🛑 Parando ambiente de produção do Sienge..." -ForegroundColor Blue

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

# Parar containers de produção
Write-Status "Parando containers de produção..."
docker-compose down

Write-Success "Ambiente de produção parado com sucesso!"

# Opção para limpar volumes também
if ($Clean) {
    Write-Warning "ATENÇÃO: Isso irá remover TODOS os dados do banco de produção!"
    $confirmation = Read-Host "Tem certeza que deseja continuar? (y/N)"
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        Write-Status "Removendo volumes de produção..."
        docker-compose down -v
        Write-Success "Volumes removidos!"
    } else {
        Write-Status "Operação cancelada."
    }
}

Write-Status "Ambiente de produção parado! 🛑"
