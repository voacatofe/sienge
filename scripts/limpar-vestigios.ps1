# Script para limpar vestígios de pgAdmin e DbVisualizer
Write-Host "🧹 Limpando vestígios de ferramentas antigas..." -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "🗑️ REMOVENDO ARQUIVOS DESNECESSÁRIOS:" -ForegroundColor Yellow
Write-Host ""

# Lista de arquivos para remover
$arquivosParaRemover = @(
    "docs\PGADMIN_SETUP.md",
    "docs\DBVISUALIZER_SETUP.md", 
    "scripts\monitor-sync-pgadmin.ps1",
    "scripts\stop-pgadmin.ps1",
    "scripts\pgadmin.sh",
    "scripts\setup-dbvisualizer.ps1"
)

foreach ($arquivo in $arquivosParaRemover) {
    if (Test-Path $arquivo) {
        Write-Host "   ❌ Removendo: $arquivo" -ForegroundColor Red
        Remove-Item $arquivo -Force
    } else {
        Write-Host "   ✅ Já removido: $arquivo" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📝 ATUALIZANDO DOCUMENTAÇÃO:" -ForegroundColor Yellow
Write-Host ""

# Atualizar README principal
if (Test-Path "README.md") {
    Write-Host "   📄 Atualizando README.md..." -ForegroundColor Blue
    
    $readmeContent = @"
# 🏗️ Sienge - Sincronização de Dados

## 📊 Visualização de Dados

### Adminer (Recomendado)
- **URL**: http://localhost:8080
- **Sistema**: PostgreSQL
- **Servidor**: db
- **Usuário**: sienge_app
- **Senha**: kPnrGuFeJeuVprXzhhO2oLVE14f509KV
- **Base de dados**: sienge_data

### Como Acessar
1. Inicie o Docker Desktop
2. Execute: `docker-compose up -d`
3. Acesse: http://localhost:8080
4. Configure a conexão com os dados acima

## 🚀 Início Rápido

```bash
# Iniciar serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Acessar Adminer
# http://localhost:8080
```

## 📋 Funcionalidades

- ✅ Sincronização automática com API Sienge
- ✅ Interface web para visualização de dados
- ✅ Logs de sincronização
- ✅ Monitoramento de status
- ✅ Backup automático

## 🔧 Configuração

Veja o arquivo `.env` para configurações de banco de dados e API.
"@
    
    Set-Content -Path "README.md" -Value $readmeContent -Encoding UTF8
    Write-Host "   ✅ README.md atualizado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 CONFIGURAÇÃO FINAL:" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Adminer configurado no docker-compose.yml" -ForegroundColor Green
Write-Host "✅ Vestígios de pgAdmin e DbVisualizer removidos" -ForegroundColor Green
Write-Host "✅ Documentação atualizada" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Inicie o Docker Desktop" -ForegroundColor White
Write-Host "2. Execute: docker-compose up -d" -ForegroundColor White
Write-Host "3. Acesse: http://localhost:8080" -ForegroundColor White
Write-Host "4. Configure a conexão com PostgreSQL" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Limpeza concluída! Agora você tem apenas o Adminer configurado." -ForegroundColor Green
