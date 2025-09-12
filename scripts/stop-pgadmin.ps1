# Script para parar pgAdmin (se estiver rodando)
Write-Host "🛑 Parando pgAdmin..." -ForegroundColor Cyan

# Parar container pgAdmin se estiver rodando
$pgadminStatus = docker-compose ps pgadmin --format "table {{.Name}}\t{{.Status}}" 2>$null
if ($pgadminStatus -match "Up") {
    Write-Host "📦 Parando container pgAdmin..." -ForegroundColor Yellow
    docker-compose stop pgadmin
    Write-Host "✅ pgAdmin parado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "ℹ️ pgAdmin não estava rodando." -ForegroundColor Blue
}

Write-Host ""
Write-Host "🗄️ Agora você pode usar o DbVisualizer!" -ForegroundColor Cyan
Write-Host "Execute: .\scripts\setup-dbvisualizer.ps1" -ForegroundColor White
