#!/usr/bin/env ts-node

/**
 * Script para sincronização de dados com respeito às dependências
 * Garante que as entidades sejam sincronizadas na ordem correta
 */

import { getEntitiesByPhase, validateNoCycles } from '../lib/sync-dependencies';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface SyncResult {
  entity: string;
  success: boolean;
  processed?: number;
  inserted?: number;
  updated?: number;
  errors?: number;
  message?: string;
}

async function syncEntity(entity: string): Promise<SyncResult> {
  try {
    console.log(`Sincronizando ${entity}...`);

    const response = await fetch(`${API_BASE_URL}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entities: [entity],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0];
    }

    return {
      entity,
      success: false,
      message: 'Nenhum resultado retornado',
    };
  } catch (error) {
    console.error(`Erro ao sincronizar ${entity}:`, error);
    return {
      entity,
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

async function syncAllByPhases() {
  console.log('=== Iniciando Sincronização com Dependências ===\n');

  // Validar que não há ciclos nas dependências
  if (!validateNoCycles()) {
    console.error('Erro: Detectadas dependências circulares na configuração!');
    process.exit(1);
  }

  const phaseMap = getEntitiesByPhase();
  const allResults: SyncResult[] = [];
  let totalProcessed = 0;
  let totalInserted = 0;
  let totalUpdated = 0;
  let totalErrors = 0;

  // Processar cada fase em ordem
  for (const [phase, entities] of Array.from(phaseMap.entries()).sort((a, b) => a[0] - b[0])) {
    console.log(`\n--- Fase ${phase} ---`);
    console.log(`Entidades: ${entities.join(', ')}\n`);

    // Sincronizar todas as entidades da fase em paralelo
    const phasePromises = entities.map(entity => syncEntity(entity));
    const phaseResults = await Promise.all(phasePromises);

    // Processar resultados
    for (const result of phaseResults) {
      allResults.push(result);

      if (result.success) {
        console.log(`✅ ${result.entity}: ${result.inserted || 0} inseridos, ${result.updated || 0} atualizados, ${result.errors || 0} erros`);
        totalProcessed += result.processed || 0;
        totalInserted += result.inserted || 0;
        totalUpdated += result.updated || 0;
        totalErrors += result.errors || 0;
      } else {
        console.log(`❌ ${result.entity}: ${result.message || 'Falha na sincronização'}`);
      }
    }
  }

  // Resumo final
  console.log('\n=== Resumo da Sincronização ===');
  console.log(`Total processado: ${totalProcessed}`);
  console.log(`Total inserido: ${totalInserted}`);
  console.log(`Total atualizado: ${totalUpdated}`);
  console.log(`Total de erros: ${totalErrors}`);

  const failedEntities = allResults.filter(r => !r.success);
  if (failedEntities.length > 0) {
    console.log(`\nEntidades com falha: ${failedEntities.map(r => r.entity).join(', ')}`);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  syncAllByPhases()
    .then(() => {
      console.log('\nSincronização concluída!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Erro durante sincronização:', error);
      process.exit(1);
    });
}

export { syncEntity, syncAllByPhases };