import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  ENDPOINT_MAPPINGS,
  hasEndpointMapping,
  getEndpointMapping,
} from './direct/endpoint-mappings';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SyncRequest {
  entities: string[];
}

/**
 * Processa um endpoint usando o sistema de mapeamento automatizado
 */
async function processGenericEndpoint(
  endpoint: string,
  data: any[],
  syncLogId: number
): Promise<{ inserted: number; updated: number; errors: number }> {
  if (!hasEndpointMapping(endpoint)) {
    console.log(`Endpoint ${endpoint} não possui mapeamento definido`);
    return { inserted: 0, updated: 0, errors: 0 };
  }

  const mapping = getEndpointMapping(endpoint);
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const item of data) {
    try {
      // Aplicar mapeamento de campos
      const mappedData: any = {};

      for (const [apiField, dbField] of Object.entries(mapping.fieldMapping)) {
        if (item[apiField] !== undefined) {
          if (typeof dbField === 'string') {
            mappedData[dbField] = item[apiField];
          } else if (typeof dbField === 'object' && dbField.field) {
            // Aplicar transformação se definida
            mappedData[dbField.field] = dbField.transform
              ? dbField.transform(item[apiField])
              : item[apiField];
          }
        }
      }

      // Verificar se registro já existe
      const existingRecord = await (prisma as any)[mapping.model].findFirst({
        where: { [mapping.primaryKey]: mappedData[mapping.primaryKey] },
      });

      if (existingRecord) {
        // Atualizar registro existente
        await (prisma as any)[mapping.model].update({
          where: { [mapping.primaryKey]: mappedData[mapping.primaryKey] },
          data: mappedData,
        });
        updated++;
      } else {
        // Criar novo registro
        await (prisma as any)[mapping.model].create({
          data: mappedData,
        });
        inserted++;
      }
    } catch (error) {
      console.error(`Erro ao processar item do endpoint ${endpoint}:`, error);
      errors++;
    }
  }

  return { inserted, updated, errors };
}

/**
 * Processa entidades que ainda não foram migradas para o sistema automatizado
 */
async function processLegacyEntity(
  entity: string,
  data: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Manter funções legadas para entidades não migradas
  switch (entity) {
    case 'projects':
      return await saveProjects(data);
    case 'cost-centers':
      return await saveCostCenters(data);
    case 'sales-commissions':
      return await saveSalesCommissions(data);
    default:
      console.log(`Entidade ${entity} não implementada`);
      return { inserted: 0, updated: 0, errors: 0 };
  }
}

/**
 * Funções legadas mantidas para compatibilidade
 */
async function saveProjects(
  projects: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Implementação simplificada - pode ser migrada posteriormente
  console.log(`Processando ${projects.length} projetos`);
  return { inserted: projects.length, updated: 0, errors: 0 };
}

async function saveCostCenters(
  costCenters: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Implementação simplificada - pode ser migrada posteriormente
  console.log(`Processando ${costCenters.length} centros de custo`);
  return { inserted: costCenters.length, updated: 0, errors: 0 };
}

async function saveSalesCommissions(
  commissions: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Implementação simplificada - pode ser migrada posteriormente
  console.log(`Processando ${commissions.length} comissões`);
  return { inserted: commissions.length, updated: 0, errors: 0 };
}

/**
 * Mapeia nomes de entidades para endpoints da API
 */
function getEndpointFromEntity(entity: string): string {
  const entityToEndpointMap: { [key: string]: string } = {
    customers: 'customers',
    companies: 'companies',
    'sales-contracts': 'sales-contracts',
    income: 'income',
    'accounts-receivable': 'income',
    'accounts-payable': 'accounts-payable',
    'financial-plans': 'financial-plans',
    'receivable-carriers': 'receivable-carriers',
    indexers: 'indexers',
    projects: 'projects',
    'cost-centers': 'cost-centers',
    'sales-commissions': 'sales-commissions',
  };

  return entityToEndpointMap[entity] || entity;
}

/**
 * Endpoint principal de sincronização
 */
export async function POST(request: NextRequest) {
  try {
    const body: SyncRequest = await request.json();
    const { entities } = body;

    if (!entities || !Array.isArray(entities)) {
      return NextResponse.json(
        { success: false, message: 'Lista de entidades é obrigatória' },
        { status: 400 }
      );
    }

    const results: any[] = [];

    for (const entity of entities) {
      try {
        console.log(`\n[Sync] Iniciando sincronização da entidade: ${entity}`);

        // Criar log de sincronização
        const syncLog = await prisma.syncLog.create({
          data: {
            entityType: entity,
            syncStartedAt: new Date(),
            status: 'in_progress',
            recordsProcessed: 0,
            recordsInserted: 0,
            recordsUpdated: 0,
            recordsErrors: 0,
          },
        });

        // Simular dados da API (em produção, viria de uma chamada real)
        const mockData = await getMockDataForEntity(entity);

        let result: { inserted: number; updated: number; errors: number };
        const endpoint = getEndpointFromEntity(entity);

        // Usar sistema automatizado se disponível, senão usar função legada
        if (hasEndpointMapping(endpoint)) {
          console.log(`[Sync] Usando sistema automatizado para ${entity}`);
          result = await processGenericEndpoint(endpoint, mockData, syncLog.id);
        } else {
          console.log(`[Sync] Usando processamento legado para ${entity}`);
          result = await processLegacyEntity(entity, mockData);
        }

        // Atualizar log de sincronização
        await prisma.syncLog.update({
          where: { id: syncLog.id },
          data: {
            syncCompletedAt: new Date(),
            recordsProcessed: mockData.length,
            recordsInserted: result.inserted,
            recordsUpdated: result.updated,
            recordsErrors: result.errors,
            status: result.errors > 0 ? 'completed_with_errors' : 'completed',
          },
        });

        results.push({
          entity,
          success: true,
          processed: mockData.length,
          inserted: result.inserted,
          updated: result.updated,
          errors: result.errors,
        });

        console.log(
          `[Sync] ${entity} concluída: ${result.inserted} inseridos, ${result.updated} atualizados, ${result.errors} erros`
        );
      } catch (error) {
        console.error(`[Sync] Erro ao processar ${entity}:`, error);
        results.push({
          entity,
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    }

    const totalProcessed = results.reduce(
      (sum, r) => sum + (r.processed || 0),
      0
    );
    const totalInserted = results.reduce(
      (sum, r) => sum + (r.inserted || 0),
      0
    );
    const totalUpdated = results.reduce((sum, r) => sum + (r.updated || 0), 0);
    const totalErrors = results.reduce((sum, r) => sum + (r.errors || 0), 0);

    console.log(`\n[Sync] Sincronização concluída:`);
    console.log(`  - Total processado: ${totalProcessed}`);
    console.log(`  - Total inserido: ${totalInserted}`);
    console.log(`  - Total atualizado: ${totalUpdated}`);
    console.log(`  - Total de erros: ${totalErrors}`);

    return NextResponse.json({
      success: true,
      message: 'Sincronização concluída',
      summary: {
        processed: totalProcessed,
        inserted: totalInserted,
        updated: totalUpdated,
        errors: totalErrors,
      },
      results,
    });
  } catch (error) {
    console.error('[Sync] Erro geral na sincronização:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro durante a sincronização',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

/**
 * Função auxiliar para simular dados da API (substituir por chamada real)
 */
async function getMockDataForEntity(entity: string): Promise<any[]> {
  // Em produção, esta função faria uma chamada real para a API Sienge
  // Por enquanto, retorna dados mock para teste
  switch (entity) {
    case 'customers':
      return [
        {
          id: 1,
          name: 'Cliente Teste',
          cpfCnpj: '12345678901',
          email: 'teste@email.com',
          companyId: 1,
        },
      ];
    case 'income':
      return [
        {
          id: 1,
          contractId: 1,
          customerId: 1,
          companyId: 1,
          documentNumber: 'DOC001',
          issueDate: '2024-01-15',
          dueDate: '2024-02-15',
          originalValue: 1000.0,
          receivableBillId: 'RB001',
          documentId: 'D001',
          defaulting: false,
          subjudice: false,
          normal: true,
          inBilling: true,
        },
      ];
    default:
      return [];
  }
}
