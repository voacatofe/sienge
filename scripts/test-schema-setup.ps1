# Script PowerShell para testar a automação do schema setup
# Este script simula o processo de inicialização do container

Write-Host "🧪 Testando automação do schema setup..." -ForegroundColor Cyan

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

# Executar comandos Prisma diretamente
Write-Host "🔄 Executando comandos Prisma..." -ForegroundColor Yellow

# Aguardar banco estar disponível
Write-Host "⏳ Aguardando banco de dados estar disponível..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 1

while ($attempt -le $maxAttempts) {
    try {
        $env:DATABASE_URL = "postgresql://${env:POSTGRES_USER}:${env:POSTGRES_PASSWORD}@localhost:${env:DB_PORT_EXTERNAL}/${env:POSTGRES_DB}?schema=public"
        $testQuery = "SELECT 1;"
        $testQuery | npx prisma db execute --stdin 2>$null
        Write-Host "✅ Banco de dados está disponível!" -ForegroundColor Green
        break
    } catch {
        Write-Host "🔄 Tentativa $attempt/$maxAttempts - Banco ainda não disponível, aguardando..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
        $attempt++
    }
}

if ($attempt -gt $maxAttempts) {
    Write-Host "❌ Erro: Banco de dados não ficou disponível após $maxAttempts tentativas" -ForegroundColor Red
    exit 1
}

# Executar migrações
Write-Host "🔄 Executando migrações do Prisma..." -ForegroundColor Yellow
npx prisma migrate deploy

# Gerar cliente Prisma
Write-Host "🔄 Gerando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

Write-Host "✅ Teste da automação concluído com sucesso!" -ForegroundColor Green