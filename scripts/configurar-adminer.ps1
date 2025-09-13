# Script para configurar e acessar o Adminer
Write-Host "🗄️ Configurando Adminer para Sienge..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔍 VERIFICANDO DOCKER DESKTOP..." -ForegroundColor Yellow

# Verificar se o Docker Desktop está rodando
if (-not (Get-Process "Docker Desktop" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Desktop não está rodando!" -ForegroundColor Red
    Write-Host ""
    Write-Host "🚀 Para iniciar:" -ForegroundColor Yellow
    Write-Host "1. Abra o Docker Desktop no Windows" -ForegroundColor White
    Write-Host "2. Aguarde ele inicializar completamente" -ForegroundColor White
    Write-Host "3. Execute este script novamente" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Dica: O Docker Desktop pode levar alguns minutos para inicializar." -ForegroundColor Blue
    exit 1
}

Write-Host "✅ Docker Desktop está rodando!" -ForegroundColor Green

Write-Host ""
Write-Host "🐳 VERIFICANDO CONTAINERS..." -ForegroundColor Yellow

# Verificar se os containers estão rodando
try {
    $containers = docker-compose ps --format "table {{.Name}}\t{{.Status}}" 2>$null
    if ($containers -match "Up") {
        Write-Host "✅ Containers estão rodando!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Containers não estão rodando. Iniciando..." -ForegroundColor Yellow
        docker-compose up -d
        Start-Sleep -Seconds 10
        Write-Host "✅ Containers iniciados!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Erro ao verificar containers. Iniciando..." -ForegroundColor Red
    docker-compose up -d
    Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "🌐 CONFIGURAÇÃO DO ADMINER:" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 DADOS DE CONEXÃO:" -ForegroundColor Yellow
Write-Host "URL: http://localhost:8080" -ForegroundColor White
Write-Host "Sistema: PostgreSQL" -ForegroundColor White
Write-Host "Servidor: db" -ForegroundColor White
Write-Host "Usuário: sienge_app" -ForegroundColor White
Write-Host "Senha: kPnrGuFeJeuVprXzhhO2oLVE14f509KV" -ForegroundColor White
Write-Host "Base de dados: sienge_data" -ForegroundColor White

Write-Host ""
Write-Host "🔧 COMO USAR O ADMINER:" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 🌐 Acesse: http://localhost:8080" -ForegroundColor White
Write-Host "2. 📝 Preencha os dados de conexão acima" -ForegroundColor White
Write-Host "3. 🔗 Clique em 'Login'" -ForegroundColor White
Write-Host "4. 📊 Explore as tabelas do Sienge!" -ForegroundColor White

Write-Host ""
Write-Host "📊 TABELAS PRINCIPAIS:" -ForegroundColor Yellow
Write-Host "- sync_logs: Logs de sincronização" -ForegroundColor White
Write-Host "- clientes: Dados dos clientes" -ForegroundColor White
Write-Host "- empresas: Dados das empresas" -ForegroundColor White
Write-Host "- documentos: Documentos do Sienge" -ForegroundColor White

Write-Host ""
Write-Host "🔍 QUERIES ÚTEIS:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host ""
Write-Host "-- Ver últimas sincronizações" -ForegroundColor White
Write-Host "SELECT * FROM sync_logs ORDER BY sync_started_at DESC LIMIT 10;" -ForegroundColor Gray
Write-Host ""
Write-Host "-- Contar registros por tabela" -ForegroundColor White
Write-Host "SELECT 'clientes' as tabela, COUNT(*) as total FROM clientes" -ForegroundColor Gray
Write-Host "UNION ALL" -ForegroundColor Gray
Write-Host "SELECT 'empresas', COUNT(*) FROM empresas" -ForegroundColor Gray
Write-Host "UNION ALL" -ForegroundColor Gray
Write-Host "SELECT 'documentos', COUNT(*) FROM documentos;" -ForegroundColor Gray

Write-Host ""
Write-Host "🚀 ABRINDO ADMINER NO NAVEGADOR..." -ForegroundColor Green

# Tentar abrir o Adminer no navegador
try {
    Start-Process "http://localhost:8080"
    Write-Host "✅ Adminer aberto no navegador!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Não foi possível abrir automaticamente." -ForegroundColor Yellow
    Write-Host "💡 Abra manualmente: http://localhost:8080" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🎉 Configuração concluída!" -ForegroundColor Green
Write-Host "Agora você pode visualizar seus dados do Sienge no Adminer!" -ForegroundColor Green
