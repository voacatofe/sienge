# Script para comparar mapeamentos do Prisma com tabelas do banco
Write-Host "=== ANÁLISE DE MAPEAMENTOS PRISMA vs BRONZE SCHEMA ===" -ForegroundColor Cyan
Write-Host ""

# Tabelas encontradas no schema bronze (do banco)
$tabelasBronze = @(
    'api_credentials', 'centro_custos', 'cliente_contatos', 'cliente_enderecos', 
    'cliente_procuradores', 'cliente_renda_familiar', 'cliente_subtipos', 
    'cliente_telefones', 'clientes', 'contrato_clientes', 'contrato_condicoes_pagamento',
    'contrato_unidades', 'contratos_suprimento', 'contratos_venda', 'credores',
    'empreendimentos', 'empresas', 'extrato_apropriacoes', 'extrato_contas',
    'planos_financeiros', 'portadores', 'sync_logs', 'titulos_pagar',
    'unidade_agrupamentos', 'unidade_filhas', 'unidade_links', 
    'unidade_valores_especiais', 'unidades', 'webhooks'
)

# Mapeamentos encontrados no schema.prisma atual
$mapeamentosPrisma = @(
    'api_credentials', 'sync_logs', 'empresas', 'clientes', 'contratos_venda',
    'empreendimentos', 'unidades', 'webhooks', 'contrato_clientes', 'contrato_unidades',
    'contrato_condicoes_pagamento', 'cliente_telefones', 'cliente_enderecos',
    'cliente_procuradores', 'cliente_contatos', 'cliente_subtipos', 'cliente_renda_familiar',
    'unidade_filhas', 'unidade_agrupamentos', 'unidade_valores_especiais', 'unidade_links',
    'portadores', 'credores', 'titulos_pagar', 'extrato_contas', 'contratos_suprimento',
    'centro_custos', 'planos_financeiros', 'extrato_apropriacoes'
)

Write-Host "📊 ESTATÍSTICAS:" -ForegroundColor Yellow
Write-Host "   Tabelas no Bronze: $($tabelasBronze.Count)"
Write-Host "   Mapeamentos Prisma: $($mapeamentosPrisma.Count)"
Write-Host ""

# Verificar tabelas que estão no banco mas não no Prisma
$tabelasFaltandoPrisma = $tabelasBronze | Where-Object { $_ -notin $mapeamentosPrisma }
if ($tabelasFaltandoPrisma.Count -gt 0) {
    Write-Host "❌ TABELAS NO BANCO MAS SEM MODELO NO PRISMA:" -ForegroundColor Red
    $tabelasFaltandoPrisma | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host ""
}

# Verificar mapeamentos no Prisma que não existem no banco
$mapeamentosOrfaos = $mapeamentosPrisma | Where-Object { $_ -notin $tabelasBronze }
if ($mapeamentosOrfaos.Count -gt 0) {
    Write-Host "⚠️  MAPEAMENTOS NO PRISMA SEM TABELA NO BANCO:" -ForegroundColor Yellow
    $mapeamentosOrfaos | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
    Write-Host ""
}

# Verificar correspondências exatas
$correspondenciasExatas = $mapeamentosPrisma | Where-Object { $_ -in $tabelasBronze }
Write-Host "✅ MAPEAMENTOS CORRETOS ($($correspondenciasExatas.Count)):" -ForegroundColor Green
$correspondenciasExatas | Sort-Object | ForEach-Object { Write-Host "   - $_" -ForegroundColor Green }
Write-Host ""

if ($tabelasFaltandoPrisma.Count -eq 0 -and $mapeamentosOrfaos.Count -eq 0) {
    Write-Host "🎉 RESULTADO: Todos os mapeamentos estão corretos!" -ForegroundColor Green
} else {
    Write-Host "🔧 AÇÃO NECESSÁRIA: Existem inconsistências que precisam ser corrigidas." -ForegroundColor Yellow
}
