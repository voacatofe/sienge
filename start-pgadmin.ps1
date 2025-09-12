# Script para iniciar o pgAdmin no Windows
Write-Host "🗄️ Iniciando pgAdmin..." -ForegroundColor Cyan

# Verificar se o Docker está rodando
if (-not (Get-Process "Docker Desktop" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Desktop não está rodando. Inicie o Docker Desktop primeiro." -ForegroundColor Red
    exit 1
}

# Iniciar apenas o pgAdmin
Write-Host "📦 Iniciando container pgAdmin..." -ForegroundColor Yellow
docker-compose up -d pgadmin

# Aguardar o pgAdmin inicializar
Write-Host "⏳ Aguardando pgAdmin inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar se está rodando
$pgadminStatus = docker-compose ps pgadmin --format "table {{.Name}}\t{{.Status}}"
if ($pgadminStatus -match "Up") {
    Write-Host "✅ pgAdmin iniciado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Acesse o pgAdmin em: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "📧 Email: admin@sienge.local" -ForegroundColor White
    Write-Host "🔑 Senha: senha_forte_pgadmin" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Configuração do Servidor PostgreSQL:" -ForegroundColor Yellow
    Write-Host "   Host: db (ou localhost se acessando externamente)" -ForegroundColor White
    Write-Host "   Porta: 5432" -ForegroundColor White
    Write-Host "   Database: sienge_data" -ForegroundColor White
    Write-Host "   Usuário: sienge_app" -ForegroundColor White
    Write-Host "   Senha: senha_forte" -ForegroundColor White
    Write-Host ""
    
    # Perguntar se quer abrir no navegador
    $openBrowser = Read-Host "Deseja abrir o pgAdmin no navegador? (s/n)"
    if ($openBrowser -eq "s" -or $openBrowser -eq "S" -or $openBrowser -eq "sim") {
        Start-Process "http://localhost:8080"
    }
} else {
    Write-Host "❌ Erro ao iniciar pgAdmin. Verifique os logs:" -ForegroundColor Red
    Write-Host "docker-compose logs pgadmin" -ForegroundColor Yellow
}
