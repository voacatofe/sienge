#!/usr/bin/env ts-node

/**
 * Script de teste para sincronização com análise detalhada de erros
 * Executa sincronização das entidades problemáticas e exibe resumo de erros
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface SyncResponse {
  success: boolean;
  message: string;
  summary: {
    processed: number;
    inserted: number;
    updated: number;
    errors: number;
  };
  results: any[];
  errorSummary?: any;
}

async function testSyncWithErrors() {
  console.log('=== TESTE DE SINCRONIZAÇÃO COM ANÁLISE DE ERROS ===\n');
  console.log(
    'Este teste irá sincronizar as entidades problemáticas identificadas nos logs:\n'
  );
  console.log('  • customers (818 erros anteriores)');
  console.log('  • sales-contracts (681 erros anteriores)');
  console.log('  • units (2669 erros anteriores)');
  console.log('  • enterprises (217 erros anteriores)\n');
  console.log('Iniciando sincronização...\n');

  try {
    // Sincronizar apenas as entidades problemáticas
    // A ordem será ajustada automaticamente pelo sistema de dependências
    const response = await fetch(`${API_BASE_URL}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entities: [
          'companies', // Necessário para enterprises
          'enterprises', // 217 erros
          'customers', // 818 erros
          'sales-contracts', // 681 erros
          'units', // 2669 erros
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SyncResponse = await response.json();

    // Exibir resultados básicos
    console.log('\n=== RESULTADOS DA SINCRONIZAÇÃO ===\n');
    console.log(`Status: ${data.success ? '✅ Sucesso' : '❌ Falha'}`);
    console.log(`Mensagem: ${data.message}\n`);

    console.log('📊 RESUMO GERAL:');
    console.log(`  • Total processado: ${data.summary.processed}`);
    console.log(`  • Total inserido: ${data.summary.inserted}`);
    console.log(`  • Total atualizado: ${data.summary.updated}`);
    console.log(`  • Total de erros: ${data.summary.errors}\n`);

    // Exibir resultados por entidade
    if (data.results && data.results.length > 0) {
      console.log('📋 RESULTADOS POR ENTIDADE:');
      for (const result of data.results) {
        const status = result.success ? '✅' : '❌';
        console.log(`  ${status} ${result.entity}:`);
        if (result.success) {
          console.log(`     - Processados: ${result.processed || 0}`);
          console.log(`     - Inseridos: ${result.inserted || 0}`);
          console.log(`     - Atualizados: ${result.updated || 0}`);
          console.log(`     - Erros: ${result.errors || 0}`);
        } else {
          console.log(
            `     - Erro: ${result.error || result.message || 'Erro desconhecido'}`
          );
        }
      }
    }

    // Análise detalhada de erros
    if (data.errorSummary) {
      console.log('\n' + '='.repeat(80));
      console.log('                    ANÁLISE DETALHADA DE ERROS');
      console.log('='.repeat(80));

      const summary = data.errorSummary;

      // Estatísticas de erros
      console.log(`\n📊 TOTAL DE ERROS CAPTURADOS: ${summary.totalErrors}\n`);

      // Erros por entidade
      if (
        summary.errorsByEntity &&
        Object.keys(summary.errorsByEntity).length > 0
      ) {
        console.log('📋 DISTRIBUIÇÃO DE ERROS POR ENTIDADE:');
        const entities = Object.entries(summary.errorsByEntity).sort(
          ([, a], [, b]) => (b as number) - (a as number)
        );

        for (const [entity, count] of entities) {
          const percentage = (
            ((count as number) / summary.totalErrors) *
            100
          ).toFixed(1);
          const bar = '█'.repeat(
            Math.floor(((count as number) / summary.totalErrors) * 30)
          );
          console.log(
            `  ${entity.padEnd(20)} ${String(count).padStart(5)} erros (${percentage}%) ${bar}`
          );
        }
      }

      // Tipos de erro
      if (
        summary.errorsByType &&
        Object.keys(summary.errorsByType).length > 0
      ) {
        console.log('\n🔍 TIPOS DE ERRO IDENTIFICADOS:');
        const types = Object.entries(summary.errorsByType).sort(
          ([, a], [, b]) => (b as number) - (a as number)
        );

        for (const [type, count] of types) {
          const percentage = (
            ((count as number) / summary.totalErrors) *
            100
          ).toFixed(1);
          console.log(
            `  ${type.padEnd(25)} ${String(count).padStart(5)} (${percentage}%)`
          );
        }
      }

      // Padrões comuns
      if (summary.commonErrors && summary.commonErrors.length > 0) {
        console.log('\n🔥 PADRÕES DE ERRO MAIS FREQUENTES:');
        for (let i = 0; i < Math.min(5, summary.commonErrors.length); i++) {
          const error = summary.commonErrors[i];
          console.log(
            `\n  ${i + 1}. ${error.pattern} (${error.count} ocorrências)`
          );
          if (error.examples && error.examples.length > 0) {
            for (const example of error.examples) {
              console.log(`     • ${example}`);
            }
          }
        }
      }

      // Erros críticos
      if (summary.criticalErrors && summary.criticalErrors.length > 0) {
        console.log('\n⚠️  ERROS CRÍTICOS IDENTIFICADOS:');
        for (let i = 0; i < Math.min(5, summary.criticalErrors.length); i++) {
          const error = summary.criticalErrors[i];
          console.log(`\n  ${i + 1}. [${error.errorType}] ${error.entity}`);
          console.log(`     ${error.message.substring(0, 200)}`);
          if (error.itemId) {
            console.log(`     ID do item: ${error.itemId}`);
          }
        }
      }

      console.log('\n' + '='.repeat(80));
    } else {
      console.log('\n✅ Nenhum erro foi capturado durante a sincronização!');
    }

    // Comparação com erros anteriores
    console.log('\n📈 COMPARAÇÃO COM SINCRONIZAÇÃO ANTERIOR:');
    console.log('  Entidade          Erros Anteriores → Erros Atuais');
    console.log('  ' + '-'.repeat(50));

    const previousErrors: Record<string, number> = {
      customers: 818,
      'sales-contracts': 681,
      units: 2669,
      enterprises: 217,
    };

    for (const result of data.results) {
      if (previousErrors[result.entity]) {
        const prev = previousErrors[result.entity];
        const curr = result.errors || 0;
        const diff = curr - prev;
        const symbol = diff < 0 ? '↓' : diff > 0 ? '↑' : '=';
        const color = diff < 0 ? '✅' : diff > 0 ? '❌' : '➖';

        console.log(
          `  ${result.entity.padEnd(20)} ${String(prev).padStart(4)} → ${String(curr).padStart(4)} (${symbol} ${Math.abs(diff)}) ${color}`
        );
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(
      'Teste concluído! Verifique o diretório logs/sync-errors/ para o log completo.'
    );
    console.log('='.repeat(80));
  } catch (error) {
    console.error('\n❌ Erro durante o teste:', error);
    console.error(
      '\nVerifique se o servidor está rodando em http://localhost:3000'
    );
  }
}

// Executar teste
testSyncWithErrors()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
