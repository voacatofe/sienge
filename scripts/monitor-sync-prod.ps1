# Script para monitorar sincronização em produção
Write-Host "Monitorando sincronizacao do Sienge em producao..." -ForegroundColor Cyan

# Verificar status do PostgreSQL
Write-Host "Verificando status do PostgreSQL..." -ForegroundColor Yellow
$dbStatus = docker-compose ps db --format "table {{.Name}}\t{{.Status}}"
if ($dbStatus -match "Up") {
    Write-Host "PostgreSQL esta rodando!" -ForegroundColor Green
} else {
    Write-Host "PostgreSQL nao esta rodando!" -ForegroundColor Red
    exit 1
}

# Verificar status da aplicação
Write-Host "Verificando status da aplicacao..." -ForegroundColor Yellow
$appStatus = docker-compose ps app --format "table {{.Name}}\t{{.Status}}"
if ($appStatus -match "Up") {
    Write-Host "Aplicacao esta rodando!" -ForegroundColor Green
} else {
    Write-Host "Aplicacao nao esta rodando!" -ForegroundColor Red
}

# Verificar logs de sincronização
Write-Host ""
Write-Host "LOGS DE SINCRONIZACAO:" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

try {
    $syncLogs = docker-compose exec -T db psql -U sienge_app -d sienge_data -c "SELECT id, entity_type, status, records_processed, records_inserted, records_updated, records_errors, sync_started_at, sync_completed_at FROM sync_logs ORDER BY sync_started_at DESC LIMIT 5;" 2>$null
    
    if ($syncLogs) {
        Write-Host $syncLogs -ForegroundColor White
    } else {
        Write-Host "Nenhum log de sincronizacao encontrado." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Erro ao buscar logs de sincronizacao." -ForegroundColor Red
}

# Verificar tabelas criadas
Write-Host ""
Write-Host "TABELAS DISPONIVEIS:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

try {
    $tables = docker-compose exec -T db psql -U sienge_app -d sienge_data -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;" 2>$null
    if ($tables) {
        $tables | ForEach-Object { 
            $table = $_.Trim()
            if ($table) {
                Write-Host "- $table" -ForegroundColor White
            }
        }
    } else {
        Write-Host "Nenhuma tabela encontrada." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Erro ao listar tabelas." -ForegroundColor Red
}

# Verificar logs da aplicação
Write-Host ""
Write-Host "LOGS DA APLICACAO (ultimas 10 linhas):" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

try {
    $appLogs = docker-compose logs --tail=10 app 2>$null
    if ($appLogs) {
        Write-Host $appLogs -ForegroundColor White
    }
} catch {
    Write-Host "Erro ao buscar logs da aplicacao." -ForegroundColor Red
}

Write-Host ""
Write-Host "CONFIGURACAO DBVISUALIZER PARA PRODUCAO:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Connection Name: Sienge Producao" -ForegroundColor White
Write-Host "Database Type: PostgreSQL" -ForegroundColor White
Write-Host "Server: localhost" -ForegroundColor White
Write-Host "Port: 5432" -ForegroundColor White
Write-Host "Database: sienge_data" -ForegroundColor White
Write-Host "Username: sienge_app" -ForegroundColor White
Write-Host "Password: kPnrGuFeJeuVprXzhhO2oLVE14f509KV" -ForegroundColor White
Write-Host ""

Write-Host "Monitoramento concluido!" -ForegroundColor Green
