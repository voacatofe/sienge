# Script para inicializar ambiente de produção (PowerShell)
# init-prod.ps1

Write-Host "🚀 Iniciando ambiente de produção do Sienge..." -ForegroundColor Blue

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

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Error "Arquivo .env não encontrado. Por favor, configure suas variáveis de ambiente."
    Write-Status "Copie .env.example para .env e configure as credenciais:"
    Write-Status "  Copy-Item .env.example .env"
    Write-Status "  # Edite .env com suas credenciais reais"
    exit 1
}

# Verificar se as credenciais estão configuradas
$envContent = Get-Content ".env" -Raw
if ($envContent -match "seu-subdominio" -or $envContent -match "seu-usuario-api" -or $envContent -match "sua-senha-api") {
    Write-Error "Credenciais da API Sienge não foram configuradas!"
    Write-Status "Por favor, edite o arquivo .env e configure:"
    Write-Status "  SIENGE_SUBDOMAIN=seu-subdominio-real"
    Write-Status "  SIENGE_USERNAME=seu-usuario-api-real"
    Write-Status "  SIENGE_PASSWORD=sua-senha-api-real"
    exit 1
}

Write-Success "Credenciais configuradas"

# Verificar se as senhas são seguras
if ($envContent -match "senha_forte") {
    Write-Warning "Senha padrão detectada! Considere usar uma senha mais segura para produção."
}

# Parar containers existentes (se houver)
Write-Status "Parando containers existentes..."
try {
    docker-compose down 2>$null
} catch {
    # Ignorar erros se não houver containers rodando
}

# Construir e iniciar containers
Write-Status "Construindo e iniciando containers de produção..."
docker-compose up --build -d

# Aguardar containers ficarem prontos
Write-Status "Aguardando containers ficarem prontos..."
Start-Sleep -Seconds 15

# Verificar status dos containers
Write-Status "Verificando status dos containers..."
docker-compose ps

# Verificar health checks
Write-Status "Verificando health checks..."
Start-Sleep -Seconds 10

# Testar conectividade
Write-Status "Testando conectividade..."

# Testar banco de dados
try {
    docker-compose exec -T db pg_isready -U sienge_app -d sienge_data | Out-Null
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
Write-Success "🎉 Ambiente de produção iniciado com sucesso!"
Write-Host ""
Write-Host "📋 Informações de acesso:" -ForegroundColor Cyan
Write-Host "  🌐 Aplicação: http://localhost:3000" -ForegroundColor White
Write-Host "  🗄️  Banco de dados: localhost:5432" -ForegroundColor White
Write-Host "  📊 URL Externa BD: postgresql://sienge_app:senha_forte@localhost:5432/sienge_data" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Comandos úteis:" -ForegroundColor Cyan
Write-Host "  📝 Ver logs: docker-compose logs -f" -ForegroundColor White
Write-Host "  🛑 Parar: docker-compose down" -ForegroundColor White
Write-Host "  🔄 Reiniciar: docker-compose restart" -ForegroundColor White
Write-Host "  🧹 Limpar tudo: docker-compose down -v" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE PARA PRODUÇÃO:" -ForegroundColor Yellow
Write-Host "  🔒 Configure firewall adequadamente" -ForegroundColor White
Write-Host "  🔐 Use senhas fortes" -ForegroundColor White
Write-Host "  📊 Configure backup do banco de dados" -ForegroundColor White
Write-Host "  📈 Configure monitoramento" -ForegroundColor White
Write-Host ""
Write-Status "Ambiente de produção pronto! 🚀"
