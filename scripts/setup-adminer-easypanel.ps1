# Script para configurar Adminer no EasyPanel
Write-Host "Configuracao do Adminer para EasyPanel Producao" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "ADMINER - INTERFACE WEB PARA BANCO DE DADOS" -ForegroundColor Yellow
Write-Host ""

Write-Host "VANTAGENS DO ADMINER:" -ForegroundColor Green
Write-Host "- Interface web simples e rapida" -ForegroundColor White
Write-Host "- Funciona perfeitamente no Docker/EasyPanel" -ForegroundColor White
Write-Host "- Nao precisa de VNC ou clientes especiais" -ForegroundColor White
Write-Host "- Acesso direto via navegador" -ForegroundColor White
Write-Host "- Suporte completo ao PostgreSQL" -ForegroundColor White

Write-Host ""
Write-Host "CONFIGURACAO NO EASYPANEL:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. DEPLOY NO EASYPANEL:" -ForegroundColor Green
Write-Host "   - Faca upload do docker-compose.yml atualizado" -ForegroundColor White
Write-Host "   - O Adminer sera iniciado automaticamente" -ForegroundColor White
Write-Host "   - Porta configurada: 8080" -ForegroundColor White

Write-Host ""
Write-Host "2. ACESSO AO ADMINER:" -ForegroundColor Green
Write-Host "   URL: http://[seu-dominio]:8080" -ForegroundColor White
Write-Host "   Exemplo: http://sienge.easypanel.host:8080" -ForegroundColor White

Write-Host ""
Write-Host "3. DADOS DE CONEXAO NO ADMINER:" -ForegroundColor Green
Write-Host "   Sistema: PostgreSQL" -ForegroundColor White
Write-Host "   Servidor: db" -ForegroundColor White
Write-Host "   Usuario: sienge_app" -ForegroundColor White
Write-Host "   Senha: kPnrGuFeJeuVprXzhhO2oLVE14f509KV" -ForegroundColor White
Write-Host "   Base de dados: sienge_data" -ForegroundColor White

Write-Host ""
Write-Host "FUNCIONALIDADES DO ADMINER:" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host "- Visualizar tabelas e dados" -ForegroundColor White
Write-Host "- Executar queries SQL" -ForegroundColor White
Write-Host "- Ver estrutura das tabelas" -ForegroundColor White
Write-Host "- Monitorar logs de sincronizacao" -ForegroundColor White
Write-Host "- Exportar dados" -ForegroundColor White
Write-Host "- Importar dados" -ForegroundColor White

Write-Host ""
Write-Host "MONITORAMENTO DA SINCRONIZACAO:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Tabela sync_logs:" -ForegroundColor Green
Write-Host "   - Ver historico de sincronizacoes" -ForegroundColor White
Write-Host "   - Status: running, completed, failed" -ForegroundColor White
Write-Host "   - Contadores de registros processados" -ForegroundColor White

Write-Host ""
Write-Host "2. Tabelas de dados:" -ForegroundColor Green
Write-Host "   - clientes (dados dos clientes)" -ForegroundColor White
Write-Host "   - empresas (dados das empresas)" -ForegroundColor White
Write-Host "   - documentos (documentos do Sienge)" -ForegroundColor White

Write-Host ""
Write-Host "COMANDOS UTEIS NO ADMINER:" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "-- Ver ultimas sincronizacoes" -ForegroundColor White
Write-Host "SELECT * FROM sync_logs ORDER BY sync_started_at DESC LIMIT 10;" -ForegroundColor Gray
Write-Host ""
Write-Host "-- Contar registros por tabela" -ForegroundColor White
Write-Host "SELECT 'clientes' as tabela, COUNT(*) as total FROM clientes" -ForegroundColor Gray
Write-Host "UNION ALL" -ForegroundColor Gray
Write-Host "SELECT 'empresas', COUNT(*) FROM empresas" -ForegroundColor Gray
Write-Host "UNION ALL" -ForegroundColor Gray
Write-Host "SELECT 'documentos', COUNT(*) FROM documentos;" -ForegroundColor Gray

Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Faça deploy no EasyPanel" -ForegroundColor White
Write-Host "2. Acesse o Adminer via navegador" -ForegroundColor White
Write-Host "3. Configure a conexao com o PostgreSQL" -ForegroundColor White
Write-Host "4. Explore as tabelas e monitore a sincronizacao" -ForegroundColor White

Write-Host ""
Write-Host "Configuracao concluida! Adminer pronto para uso no EasyPanel." -ForegroundColor Green
