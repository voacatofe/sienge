# Script para monitorar sincronização via pgAdmin
Write-Host "Monitoramento da Sincronizacao Sienge via pgAdmin" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "ACESSO AO PGADMIN:" -ForegroundColor Yellow
Write-Host "URL: http://[seu-dominio]:8080" -ForegroundColor White
Write-Host "Usuario: darlan@catofe.com.br" -ForegroundColor White
Write-Host "Senha: [sua senha do pgAdmin]" -ForegroundColor White

Write-Host ""
Write-Host "CONEXAO COM O BANCO:" -ForegroundColor Green
Write-Host "Sistema: PostgreSQL" -ForegroundColor White
Write-Host "Servidor: db" -ForegroundColor White
Write-Host "Usuario: sienge_app" -ForegroundColor White
Write-Host "Senha: kPnrGuFeJeuVprXzhhO2oLVE14f509KV" -ForegroundColor White
Write-Host "Base de dados: sienge_data" -ForegroundColor White

Write-Host ""
Write-Host "QUERIES PARA MONITORAR SINCRONIZACAO:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. VER STATUS ATUAL DA SINCRONIZACAO:" -ForegroundColor Green
Write-Host "SELECT * FROM sync_logs ORDER BY sync_started_at DESC LIMIT 5;" -ForegroundColor Gray

Write-Host ""
Write-Host "2. CONTAR REGISTROS POR TABELA:" -ForegroundColor Green
Write-Host "SELECT 'clientes' as tabela, COUNT(*) as total FROM clientes" -ForegroundColor Gray
Write-Host "UNION ALL" -ForegroundColor Gray
Write-Host "SELECT 'empresas', COUNT(*) FROM empresas" -ForegroundColor Gray
Write-Host "UNION ALL" -ForegroundColor Gray
Write-Host "SELECT 'documentos', COUNT(*) FROM documentos;" -ForegroundColor Gray

Write-Host ""
Write-Host "3. VER SINCRONIZACAO EM ANDAMENTO:" -ForegroundColor Green
Write-Host "SELECT * FROM sync_logs WHERE status = 'running';" -ForegroundColor Gray

Write-Host ""
Write-Host "4. VER ERROS DE SINCRONIZACAO:" -ForegroundColor Green
Write-Host "SELECT * FROM sync_logs WHERE status = 'failed' ORDER BY sync_started_at DESC;" -ForegroundColor Gray

Write-Host ""
Write-Host "5. ESTATISTICAS DE SINCRONIZACAO:" -ForegroundColor Green
Write-Host "SELECT" -ForegroundColor Gray
Write-Host "    DATE(sync_started_at) as data," -ForegroundColor Gray
Write-Host "    COUNT(*) as total_syncs," -ForegroundColor Gray
Write-Host "    SUM(records_processed) as total_records," -ForegroundColor Gray
Write-Host "    AVG(records_processed) as media_records" -ForegroundColor Gray
Write-Host "FROM sync_logs" -ForegroundColor Gray
Write-Host "WHERE sync_completed_at IS NOT NULL" -ForegroundColor Gray
Write-Host "GROUP BY DATE(sync_started_at)" -ForegroundColor Gray
Write-Host "ORDER BY data DESC;" -ForegroundColor Gray

Write-Host ""
Write-Host "6. VER DETALHES DOS ERROS 403:" -ForegroundColor Green
Write-Host "SELECT" -ForegroundColor Gray
Write-Host "    sync_started_at," -ForegroundColor Gray
Write-Host "    entities," -ForegroundColor Gray
Write-Host "    error_details" -ForegroundColor Gray
Write-Host "FROM sync_logs" -ForegroundColor Gray
Write-Host "WHERE status = 'completed_with_errors'" -ForegroundColor Gray
Write-Host "AND error_details LIKE '%403%';" -ForegroundColor Gray

Write-Host ""
Write-Host "COMO USAR NO PGADMIN:" -ForegroundColor Yellow
Write-Host "=====================" -ForegroundColor Yellow
Write-Host "1. Acesse o pgAdmin no navegador" -ForegroundColor White
Write-Host "2. Faça login com suas credenciais" -ForegroundColor White
Write-Host "3. Conecte ao servidor PostgreSQL" -ForegroundColor White
Write-Host "4. Selecione o banco 'sienge_data'" -ForegroundColor White
Write-Host "5. Clique em 'Query Tool' (icone SQL)" -ForegroundColor White
Write-Host "6. Cole uma das queries acima" -ForegroundColor White
Write-Host "7. Clique em 'Execute' (F5)" -ForegroundColor White

Write-Host ""
Write-Host "PROBLEMAS COMUNS E SOLUCOES:" -ForegroundColor Red
Write-Host "============================" -ForegroundColor Red
Write-Host ""
Write-Host "Erro 403 - Permission Denied:" -ForegroundColor Yellow
Write-Host "- Alguns endpoints da API Sienge nao sao acessíveis" -ForegroundColor White
Write-Host "- Normal - a sincronizacao continua com outros endpoints" -ForegroundColor White
Write-Host "- Verifique se os dados principais (clientes, empresas) estao sendo sincronizados" -ForegroundColor White

Write-Host ""
Write-Host "Sincronizacao demorada:" -ForegroundColor Yellow
Write-Host "- Normal para grandes volumes de dados" -ForegroundColor White
Write-Host "- Use a query de status para acompanhar o progresso" -ForegroundColor White
Write-Host "- A aplicacao tem limites de seguranca (max 1000 paginas, 200k registros)" -ForegroundColor White

Write-Host ""
Write-Host "Monitoramento ativo via pgAdmin configurado!" -ForegroundColor Green
