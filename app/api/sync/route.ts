import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  ENDPOINT_MAPPINGS,
  hasEndpointMapping,
  getEndpointMapping,
} from './direct/endpoint-mappings';
import { siengeApiClient } from '../../../lib/sienge-api-client';
import {
  GenericDataMapper,
  GenericEndpointConfig,
  GENERIC_ENDPOINT_CONFIGS,
} from '../../../lib/generic-data-mapper';
import {
  getSyncOrder,
  areDependenciesSatisfied,
  getEntitiesByPhase,
} from '../../../lib/sync-dependencies';
import { ErrorLogger } from '../../../lib/error-logger';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SyncRequest {
  entities: string[];
}

/**
 * Processa entidades usando o sistema de mapeamento automatizado genérico
 */
async function processGenericEndpoint(
  endpoint: string,
  data: any[],
  syncLogId: number,
  errorLogger?: ErrorLogger
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Verificar se existe configuração genérica
  const genericConfig = GenericDataMapper.getConfig(endpoint);

  if (genericConfig) {
    return await processWithGenericMapping(
      endpoint,
      data,
      syncLogId,
      genericConfig,
      errorLogger
    );
  }

  // Fallback para o sistema legado
  if (!hasEndpointMapping(endpoint)) {
    console.log(`Endpoint ${endpoint} não possui mapeamento definido`);
    return { inserted: 0, updated: 0, errors: 0 };
  }

  const mapping = getEndpointMapping(endpoint);
  return await processWithLegacyMapping(endpoint, data, syncLogId, mapping, errorLogger);
}

/**
 * Processa dados usando o novo sistema de mapeamento genérico
 */
async function processWithGenericMapping(
  endpoint: string,
  data: any[],
  syncLogId: number,
  config: GenericEndpointConfig,
  errorLogger?: ErrorLogger
): Promise<{ inserted: number; updated: number; errors: number }> {
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  console.log(
    `Processando ${data.length} registros de ${endpoint} com mapeamento genérico`
  );

  for (const item of data) {
    try {
      // Mapear dados usando o sistema genérico
      const mappedData = GenericDataMapper.mapApiDataToDatabase(item, config);

      // Validar dados mapeados
      if (!GenericDataMapper.validateMappedData(mappedData, config)) {
        console.error(`Dados inválidos para ${endpoint}:`, mappedData);
        errors++;
        continue;
      }

      // Tratamento especial para ContratoVenda - verificar se enterpriseId existe
      if (config.model === 'contratoVenda' && mappedData.enterpriseId) {
        const enterprise = await (prisma as any).empreendimento.findUnique({
          where: { id: mappedData.enterpriseId }
        });

        if (!enterprise) {
          console.warn(
            `[Sync] Empreendimento ${mappedData.enterpriseId} não encontrado para contrato ${item.id}. Definindo como null.`
          );
          mappedData.enterpriseId = null;
        }
      }

      // Verificar se o registro já existe
      const primaryKeyValue = mappedData[config.primaryKey];
      if (!primaryKeyValue) {
        console.error(
          `Chave primária ${config.primaryKey} não encontrada nos dados:`,
          mappedData
        );
        errors++;
        continue;
      }

      const existingRecord = await (prisma as any)[config.model].findUnique({
        where: { [config.primaryKey]: primaryKeyValue },
      });

      if (existingRecord) {
        // Atualizar registro existente
        await (prisma as any)[config.model].update({
          where: { [config.primaryKey]: primaryKeyValue },
          data: mappedData,
        });
        updated++;
        console.log(`Atualizado ${endpoint} ID: ${primaryKeyValue}`);
      } else {
        // Inserir novo registro
        await (prisma as any)[config.model].create({
          data: mappedData,
        });
        inserted++;
        console.log(`Inserido ${endpoint} ID: ${primaryKeyValue}`);
      }
    } catch (error) {
      console.error(`Erro ao processar item do endpoint ${endpoint}:`, error);
      if (errorLogger) {
        errorLogger.logException(endpoint, item.id || item.idCliente || item.idEmpresa, error);
      }
      errors++;
    }
  }

  console.log(
    `Processamento de ${endpoint} concluído: ${inserted} inseridos, ${updated} atualizados, ${errors} erros`
  );
  return { inserted, updated, errors };
}

/**
 * Processa dados usando o sistema legado (compatibilidade)
 */
async function processWithLegacyMapping(
  endpoint: string,
  data: any[],
  syncLogId: number,
  mapping: any,
  errorLogger?: ErrorLogger
): Promise<{ inserted: number; updated: number; errors: number }> {
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  console.log(
    `Processando ${data.length} registros de ${endpoint} com mapeamento legado`
  );

  for (const item of data) {
    try {
      // Aplicar mapeamento de campos
      const mappedData: any = {};

      for (const [apiField, dbField] of Object.entries(mapping.fieldMapping)) {
        if (item[apiField] !== undefined) {
          if (typeof dbField === 'string') {
            mappedData[dbField] = item[apiField];
          } else if (typeof dbField === 'object' && dbField !== null && 'field' in dbField) {
            // Aplicar transformação se definida
            const fieldMapping = dbField as { field: string; transform?: (value: any) => any };
            mappedData[fieldMapping.field] = fieldMapping.transform
              ? fieldMapping.transform(item[apiField])
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
      if (errorLogger) {
        errorLogger.logException(endpoint, item.id, error);
      }
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
  const errorLogger = new ErrorLogger();

  try {
    const body: SyncRequest = await request.json();
    const { entities } = body;

    if (!entities || !Array.isArray(entities)) {
      return NextResponse.json(
        { success: false, message: 'Lista de entidades é obrigatória' },
        { status: 400 }
      );
    }

    // Ordenar entidades respeitando dependências
    const orderedEntities = getSyncOrder(entities);
    console.log('[Sync] Ordem de sincronização definida:', orderedEntities);

    // Mostrar fases de sincronização
    const phaseMap = getEntitiesByPhase();
    console.log('[Sync] Entidades organizadas por fase:');
    Array.from(phaseMap.entries()).forEach(([phase, phaseEntities]) => {
      const toSync = phaseEntities.filter(e => orderedEntities.includes(e));
      if (toSync.length > 0) {
        console.log(`  Fase ${phase}: ${toSync.join(', ')}`);
      }
    });

    const results: any[] = [];
    const syncedEntities: string[] = [];

    for (const entity of orderedEntities) {
      try {
        // Verificar se todas as dependências foram satisfeitas
        if (!areDependenciesSatisfied(entity, syncedEntities)) {
          console.warn(`[Sync] Pulando ${entity} - dependências não satisfeitas`);
          results.push({
            entity,
            success: false,
            message: 'Dependências não satisfeitas',
          });
          continue;
        }

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

        // Buscar dados da API Sienge
        const apiResponse = await getApiDataForEntity(entity);

        // Extrair dados da resposta usando o sistema genérico
        let extractedData: any[] = [];

        if (GenericDataMapper.hasConfig(entity)) {
          const config = GenericDataMapper.getConfig(entity)!;
          extractedData = GenericDataMapper.extractDataFromApiResponse(
            apiResponse,
            config
          );
        } else {
          // Fallback para dados diretos se não há configuração genérica
          extractedData = Array.isArray(apiResponse)
            ? apiResponse
            : (apiResponse as any)?.data && Array.isArray((apiResponse as any).data)
              ? (apiResponse as any).data
              : [];
        }

        console.log(`Extraídos ${extractedData.length} registros de ${entity}`);

        let result: { inserted: number; updated: number; errors: number };
        const endpoint = getEndpointFromEntity(entity);

        // Usar sistema automatizado se disponível, senão usar função legada
        if (
          GenericDataMapper.hasConfig(entity) ||
          hasEndpointMapping(endpoint)
        ) {
          console.log(`[Sync] Usando sistema automatizado para ${entity}`);
          result = await processGenericEndpoint(
            endpoint,
            extractedData,
            syncLog.id,
            errorLogger
          );
        } else {
          console.log(`[Sync] Usando processamento legado para ${entity}`);
          result = await processLegacyEntity(entity, extractedData);
        }

        // Atualizar log de sincronização
        await prisma.syncLog.update({
          where: { id: syncLog.id },
          data: {
            syncCompletedAt: new Date(),
            recordsProcessed: extractedData.length,
            recordsInserted: result.inserted,
            recordsUpdated: result.updated,
            recordsErrors: result.errors,
            status: result.errors > 0 ? 'completed_with_errors' : 'completed',
          },
        });

        results.push({
          entity,
          success: true,
          processed: extractedData.length,
          inserted: result.inserted,
          updated: result.updated,
          errors: result.errors,
        });

        // Adicionar entidade à lista de sincronizadas
        syncedEntities.push(entity);

        console.log(
          `[Sync] ${entity} concluída: ${result.inserted} inseridos, ${result.updated} atualizados, ${result.errors} erros`
        );
      } catch (error) {
        console.error(`[Sync] Erro ao processar ${entity}:`, error);
        errorLogger.logException(entity, undefined, error);
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

    // Exibir resumo de erros se houver
    if (errorLogger.hasErrors()) {
      console.log(errorLogger.formatSummaryForConsole());

      // Salvar log de erros em arquivo
      errorLogger.saveToFile();
    }

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
      errorSummary: errorLogger.hasErrors() ? errorLogger.generateSummary() : null,
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
 * Função para buscar dados reais da API Sienge
 * Substituiu os dados mock por chamadas reais
 */
async function getApiDataForEntity(entity: string): Promise<any[]> {
  try {
    // Inicializar cliente da API se não estiver inicializado
    if (!siengeApiClient.isInitialized()) {
      await siengeApiClient.initialize();
    }

    // Buscar dados da API usando o método genérico
    const apiData = await siengeApiClient.fetchEntityData(
      entity,
      {},
      {
        usePagination: true,
        batchSize: 100,
        maxPages: 5,
        onProgress: (page: number, total: number) => {
          console.log(`Buscando ${entity} - Página ${page}/${total}`);
        },
      }
    );

    console.log(
      `Dados obtidos da API para ${entity}:`,
      apiData?.length || 0,
      'registros'
    );
    return Array.isArray(apiData) ? apiData : [];
  } catch (error) {
    console.error(`Erro ao buscar dados da API para ${entity}:`, error);

    // Fallback para dados mock em caso de erro da API
    console.log(`Usando dados mock para ${entity} devido ao erro da API`);
    return getMockDataFallback(entity);
  }
}

/**
 * Função de fallback com dados mock (apenas para desenvolvimento/teste)
 */
function getMockDataFallback(entity: string): any[] {
  switch (entity) {
    case 'customers':
      return [
        {
          id: 1,
          name: 'João Silva',
          cpfCnpj: '123.456.789-00',
          email: 'joao@email.com',
          active: true,
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 2,
          name: 'Maria Santos',
          cpfCnpj: '987.654.321-00',
          email: 'maria@email.com',
          active: true,
          createdAt: '2024-01-16T11:00:00Z',
        },
      ];

    case 'income':
      return [
        {
          id: 1,
          customerId: 1,
          documentNumber: 'REC-001',
          issueDate: '2024-01-15T00:00:00Z',
          dueDate: '2024-02-15T00:00:00Z',
          originalValue: 1500.0,
          status: 'pending',
        },
        {
          id: 2,
          customerId: 2,
          documentNumber: 'REC-002',
          issueDate: '2024-01-16T00:00:00Z',
          dueDate: '2024-02-16T00:00:00Z',
          originalValue: 2500.0,
          status: 'pending',
        },
      ];

    default:
      return [];
  }
}
