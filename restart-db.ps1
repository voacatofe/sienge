# Script para reiniciar o PostgreSQL com configurações de conexão externa
# PowerShell script para Windows

Write-Host "🔄 Reiniciando PostgreSQL com configurações de conexão externa..." -ForegroundColor Yellow

# Parar containers existentes
Write-Host "⏹️  Parando containers..." -ForegroundColor Blue
docker-compose down

# Remover volumes antigos (opcional - descomente se quiser resetar dados)
# Write-Host "🗑️  Removendo volumes antigos..." -ForegroundColor Red
# docker volume rm sienge_postgres-data

# Iniciar containers com novas configurações
Write-Host "🚀 Iniciando containers com novas configurações..." -ForegroundColor Green
docker-compose up -d

# Aguardar o banco ficar pronto
Write-Host "⏳ Aguardando PostgreSQL ficar pronto..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar status
Write-Host "📊 Verificando status dos containers..." -ForegroundColor Blue
docker-compose ps

Write-Host "✅ PostgreSQL reiniciado com configurações de conexão externa!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Configuração para Power BI:" -ForegroundColor Cyan
Write-Host "   Servidor: 147.93.15.121,5432" -ForegroundColor White
Write-Host "   Banco: sienge_data" -ForegroundColor White
Write-Host "   Usuário: sienge_app" -ForegroundColor White
Write-Host "   Senha: [sua senha]" -ForegroundColor White
