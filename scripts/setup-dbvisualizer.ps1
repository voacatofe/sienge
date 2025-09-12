# Script para configurar DbVisualizer para o projeto Sienge
Write-Host "Configurando DbVisualizer para Sienge..." -ForegroundColor Cyan

# Verificar se o Docker está rodando
if (-not (Get-Process "Docker Desktop" -ErrorAction SilentlyContinue)) {
    Write-Host "Docker Desktop nao esta rodando. Inicie o Docker Desktop primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o PostgreSQL está rodando
Write-Host "Verificando se PostgreSQL esta rodando..." -ForegroundColor Yellow
$dbStatus = docker-compose ps db --format "table {{.Name}}\t{{.Status}}"
if ($dbStatus -notmatch "Up") {
    Write-Host "PostgreSQL nao esta rodando. Iniciando..." -ForegroundColor Red
    docker-compose up -d db
    Start-Sleep -Seconds 10
}

Write-Host "PostgreSQL esta rodando!" -ForegroundColor Green

# Exibir informações de conexão
Write-Host ""
Write-Host "DADOS PARA CONFIGURAR NO DBVISUALIZER:" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Connection Name: Sienge PostgreSQL" -ForegroundColor White
Write-Host "Database Type: PostgreSQL" -ForegroundColor White
Write-Host "Server: localhost" -ForegroundColor White
Write-Host "Port: 5432" -ForegroundColor White
Write-Host "Database: sienge_data" -ForegroundColor White
Write-Host "Username: sienge_app" -ForegroundColor White
Write-Host "Password: kPnrGuFeJeuVprXzhhO2oLVE14f509KV" -ForegroundColor White
Write-Host ""

# Testar conexão
Write-Host "Testando conexao com PostgreSQL..." -ForegroundColor Yellow
try {
    $testResult = docker-compose exec -T db psql -U sienge_app -d sienge_data -c "SELECT version();" 2>$null
    if ($testResult) {
        Write-Host "Conexao com PostgreSQL funcionando!" -ForegroundColor Green
    } else {
        Write-Host "Nao foi possivel testar a conexao automaticamente." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Nao foi possivel testar a conexao automaticamente." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Abra o DbVisualizer" -ForegroundColor White
Write-Host "2. Crie uma nova conexao com os dados acima" -ForegroundColor White
Write-Host "3. Teste a conexao" -ForegroundColor White
Write-Host "4. Explore as tabelas do Sienge!" -ForegroundColor White
Write-Host ""

# Verificar se há dados nas tabelas
Write-Host "Verificando tabelas disponiveis..." -ForegroundColor Yellow
try {
    $tables = docker-compose exec -T db psql -U sienge_app -d sienge_data -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;" 2>$null
    if ($tables) {
        Write-Host "Tabelas encontradas:" -ForegroundColor Green
        $tables | ForEach-Object { 
            $table = $_.Trim()
            if ($table) {
                Write-Host "   - $table" -ForegroundColor White
            }
        }
    }
} catch {
    Write-Host "Nao foi possivel listar as tabelas automaticamente." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Configuracao concluida! Agora voce pode usar o DbVisualizer." -ForegroundColor Green