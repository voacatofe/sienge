# Script para inicializar ambiente de desenvolvimento (PowerShell)
# init-dev.ps1

param(
    [switch]$Clean
)

Write-Host "🚀 Iniciando ambiente de desenvolvimento do Sienge..." -ForegroundColor Blue

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

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Verificar se Docker está rodando
try {
    docker info | Out-Null
    Write-Success "Docker está rodando"
} catch {
    Write-Error "Docker não está rodando. Por favor, inicie o Docker Desktop."
    exit 1
}

# Verificar se o arquivo .env.dev existe
if (-not (Test-Path ".env.dev")) {
    Write-Warning "Arquivo .env.dev não encontrado. Criando a partir do .env.example..."
    Copy-Item ".env.example" ".env.dev"
    Write-Success "Arquivo .env.dev criado"
}

# Verificar se o arquivo .env existe (para produção)
if (-not (Test-Path ".env")) {
    Write-Warning "Arquivo .env não encontrado. Criando a partir do .env.example..."
    Copy-Item ".env.example" ".env"
    Write-Success "Arquivo .env criado"
}

# Parar containers existentes (se houver)
Write-Status "Parando containers existentes..."
try {
    docker-compose -f docker-compose-dev.yml down 2>$null
} catch {
    # Ignorar erros se não houver containers rodando
}

# Remover volumes antigos se solicitado
if ($Clean) {
    Write-Status "Removendo volumes antigos..."
    try {
        docker volume rm sienge_postgres-dev-data 2>$null
    } catch {
        # Ignorar erros se volume não existir
    }
}

# Construir e iniciar containers
Write-Status "Construindo e iniciando containers de desenvolvimento..."
docker-compose -f docker-compose-dev.yml --env-file .env.dev up --build -d

# Aguardar containers ficarem prontos
Write-Status "Aguardando containers ficarem prontos..."
Start-Sleep -Seconds 10

# Verificar status dos containers
Write-Status "Verificando status dos containers..."
docker-compose -f docker-compose-dev.yml ps

# Verificar health checks
Write-Status "Verificando health checks..."
Start-Sleep -Seconds 5

# Testar conectividade
Write-Status "Testando conectividade..."

# Testar banco de dados
try {
    docker-compose -f docker-compose-dev.yml exec -T db pg_isready -U sienge_dev -d sienge_dev | Out-Null
    Write-Success "Banco de dados está acessível"
} catch {
    Write-Error "Banco de dados não está acessível"
}

# Testar aplicação
try {
    Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing | Out-Null
    Write-Success "Aplicação está acessível"
} catch {
    Write-Warning "Aplicação ainda não está acessível (pode estar inicializando)"
}

# Mostrar informações de acesso
Write-Host ""
Write-Success "🎉 Ambiente de desenvolvimento iniciado com sucesso!"
Write-Host ""
Write-Host "📋 Informações de acesso:" -ForegroundColor Cyan
Write-Host "  🌐 Aplicação: http://localhost:3000" -ForegroundColor White
Write-Host "  🗄️  Banco de dados: localhost:5432" -ForegroundColor White
Write-Host "  📊 URL Externa BD: postgresql://sienge_dev:dev_password@localhost:5432/sienge_dev" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Comandos úteis:" -ForegroundColor Cyan
Write-Host "  📝 Ver logs: docker-compose -f docker-compose-dev.yml logs -f" -ForegroundColor White
Write-Host "  🛑 Parar: docker-compose -f docker-compose-dev.yml down" -ForegroundColor White
Write-Host "  🔄 Reiniciar: docker-compose -f docker-compose-dev.yml restart" -ForegroundColor White
Write-Host "  🧹 Limpar tudo: docker-compose -f docker-compose-dev.yml down -v" -ForegroundColor White
Write-Host ""
Write-Status "Ambiente de desenvolvimento pronto! 🚀"
