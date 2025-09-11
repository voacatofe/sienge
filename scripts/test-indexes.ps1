# Script PowerShell para testar a performance dos índices
# Este script executa consultas EXPLAIN ANALYZE para verificar se os índices estão sendo utilizados

Write-Host "🧪 Testando performance dos índices criados..." -ForegroundColor Cyan

# Carregar variáveis de ambiente do arquivo .env.dev
if (Test-Path ".env.dev") {
    Write-Host "📋 Carregando variáveis de ambiente do .env.dev..." -ForegroundColor Yellow
    Get-Content ".env.dev" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
} else {
    Write-Host "❌ Arquivo .env.dev não encontrado!" -ForegroundColor Red
    exit 1
}

# Verificar se o banco está rodando
Write-Host "🔍 Verificando se o banco de dados está rodando..." -ForegroundColor Yellow
$dbStatus = docker-compose -f docker-compose-dev.yml ps db
if ($dbStatus -notmatch "Up") {
    Write-Host "🚀 Iniciando banco de dados..." -ForegroundColor Green
    docker-compose -f docker-compose-dev.yml up -d db
    
    Write-Host "⏳ Aguardando banco estar pronto..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

# Executar testes de performance
Write-Host "🔬 Executando testes de performance dos índices..." -ForegroundColor Green

try {
    # Executar script SQL de teste
    $env:DATABASE_URL = "postgresql://sienge_dev:dev_password@localhost:5433/sienge_dev?schema=public"
    
    Write-Host "📊 Executando EXPLAIN ANALYZE para verificar uso dos índices..." -ForegroundColor Yellow
    
    # Executar o script SQL
    psql $env:DATABASE_URL -f scripts/test-indexes.sql
    
    Write-Host "✅ Testes de performance concluídos!" -ForegroundColor Green
    Write-Host "📈 Verifique os resultados acima para confirmar que os índices estão sendo utilizados." -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erro ao executar testes de performance: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎯 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Verifique se os índices estão sendo utilizados (Index Scan vs Seq Scan)" -ForegroundColor White
Write-Host "   2. Confirme que os tempos de execução estão otimizados" -ForegroundColor White
Write-Host "   3. Monitore o uso dos índices com pg_stat_user_indexes" -ForegroundColor White
