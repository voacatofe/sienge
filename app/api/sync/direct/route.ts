import { NextRequest } from 'next/server';
import { hasEndpointMapping, getEndpointMapping } from './endpoint-mappings';
// ErrorLogger removed - using centralized logger
import { prisma } from '@/lib/prisma-singleton';
import { logger, createContextLogger } from '@/lib/logger';
import {
  apiSuccess,
  apiError,
  validateRequiredParams,
} from '@/lib/api-response';

const syncLogger = createContextLogger('SYNC_DIRECT');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface DirectSyncRequest {
  endpoint: string;
  data: any[];
}

interface SyncResult {
  inserted: number;
  updated: number;
  errors: number;
  firstError?: string;
}

/**
 * Valida foreign keys antes da inserção
 */
async function validateForeignKeys(
  endpoint: string,
  cleanedData: any
): Promise<any> {
  // Validação específica para units (unidades)
  if (endpoint === 'units' && cleanedData.idContrato) {
    try {
      const contractExists = await prisma.contratoVenda.findUnique({
        where: { id: cleanedData.idContrato },
        select: { id: true },
      });

      if (!contractExists) {
        syncLogger.warn(
          `Contract ${cleanedData.idContrato} not found for unit ${cleanedData.id || 'unknown'}. Setting idContrato to null.`
        );
        cleanedData.idContrato = null;
      }
    } catch (error) {
      syncLogger.error('Error validating contract FK', error);
      cleanedData.idContrato = null;
    }
  }

  // Validação para empreendimentos em contratos
  if (endpoint === 'sales-contracts' && cleanedData.enterpriseId) {
    try {
      const enterpriseExists = await prisma.empreendimento.findUnique({
        where: { id: cleanedData.enterpriseId },
        select: { id: true },
      });

      if (!enterpriseExists) {
        syncLogger.warn(
          `Enterprise ${cleanedData.enterpriseId} not found for contract ${cleanedData.id || 'unknown'}. Setting enterpriseId to null.`
        );
        cleanedData.enterpriseId = null;
      }
    } catch (error) {
      syncLogger.error('Error validating enterprise FK', error);
      cleanedData.enterpriseId = null;
    }
  }

  // Validação para bills (títulos a pagar)
  if (endpoint === 'bills') {
    // Validar credorId
    if (cleanedData.credorId) {
      try {
        const credorExists = await prisma.credor.findUnique({
          where: { id: cleanedData.credorId },
          select: { id: true },
        });

        if (!credorExists) {
          syncLogger.warn(
            `Creditor ${cleanedData.credorId} not found for bill ${cleanedData.id || 'unknown'}. Setting credorId to null.`
          );
          cleanedData.credorId = null;
        }
      } catch (error) {
        syncLogger.error('Error validating creditor FK', error);
        cleanedData.credorId = null;
      }
    }

    // Validar devedorId (empresaId)
    if (cleanedData.devedorId) {
      try {
        const empresaExists = await prisma.empresa.findUnique({
          where: { idEmpresa: cleanedData.devedorId },
          select: { idEmpresa: true },
        });

        if (!empresaExists) {
          syncLogger.warn(
            `Debtor/Company ${cleanedData.devedorId} not found for bill ${cleanedData.id || 'unknown'}. Setting devedorId to null.`
          );
          cleanedData.devedorId = null;
        }
      } catch (error) {
        syncLogger.error('Error validating debtor FK', error);
        cleanedData.devedorId = null;
      }
    }
  }

  // Validação para supply-contracts/all
  if (endpoint === 'supply-contracts/all') {
    // Validar fornecedorId
    if (cleanedData.fornecedorId) {
      try {
        const fornecedorExists = await prisma.credor.findUnique({
          where: { id: cleanedData.fornecedorId },
          select: { id: true },
        });

        if (!fornecedorExists) {
          syncLogger.warn(
            `Supplier ${cleanedData.fornecedorId} not found for contract ${cleanedData.numeroContrato || 'unknown'}. Setting fornecedorId to null.`
          );
          cleanedData.fornecedorId = null;
        }
      } catch (error) {
        syncLogger.error('Error validating supplier FK', error);
        cleanedData.fornecedorId = null;
      }
    }

    // Validar empresaId
    if (cleanedData.empresaId) {
      try {
        const empresaExists = await prisma.empresa.findUnique({
          where: { idEmpresa: cleanedData.empresaId },
          select: { idEmpresa: true },
        });

        if (!empresaExists) {
          syncLogger.warn(
            `Company ${cleanedData.empresaId} not found for contract ${cleanedData.numeroContrato || 'unknown'}. Setting empresaId to null.`
          );
          cleanedData.empresaId = null;
        }
      } catch (error) {
        syncLogger.error('Error validating company FK', error);
        cleanedData.empresaId = null;
      }
    }
  }

  // Validação para accounts-statements (extrato de contas)
  if (endpoint === 'accounts-statements') {
    // Validar tituloId
    if (cleanedData.tituloId) {
      try {
        const tituloExists = await prisma.tituloPagar.findUnique({
          where: { id: cleanedData.tituloId },
          select: { id: true },
        });

        if (!tituloExists) {
          syncLogger.warn(
            `Bill ${cleanedData.tituloId} not found for statement ${cleanedData.id || 'unknown'}. Setting tituloId to null.`
          );
          cleanedData.tituloId = null;
        }
      } catch (error) {
        syncLogger.error('Error validating bill FK', error);
        cleanedData.tituloId = null;
      }
    }
  }

  return cleanedData;
}

/**
 * Executa operação CRUD usando delegate dinâmico do Prisma
 */
async function executePrismaOperation(
  model: string,
  operation: 'findUnique' | 'create' | 'update',
  params: any
): Promise<any> {
  try {
    const delegate = (prisma as any)[model];

    if (!delegate) {
      throw new Error(`Model ${model} not found in Prisma client`);
    }

    switch (operation) {
      case 'findUnique':
        return await delegate.findUnique(params);
      case 'create':
        return await delegate.create(params);
      case 'update':
        return await delegate.update(params);
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  } catch (error) {
    syncLogger.error(
      `Prisma ${operation} failed for model ${model}`,
      error,
      params
    );
    throw error;
  }
}

/**
 * Processa um item individual
 */
async function processItem(
  endpoint: string,
  item: any,
  mapping: any
): Promise<{
  status: 'inserted' | 'updated' | 'error';
  errorMessage?: string;
}> {
  try {
    // Aplicar mapeamento de campos
    const mappedData: any = {};

    for (const [sourceField, targetConfig] of Object.entries(
      mapping.fieldMapping
    )) {
      const sourceValue = item[sourceField];

      if (typeof targetConfig === 'string') {
        mappedData[targetConfig] = sourceValue;
      } else if (
        typeof targetConfig === 'object' &&
        targetConfig !== null &&
        'field' in targetConfig
      ) {
        const config = targetConfig as {
          field: string;
          transform?: (value: any) => any;
        };
        mappedData[config.field] = config.transform
          ? config.transform(sourceValue)
          : sourceValue;
      }
    }

    // Limpar valores undefined
    const cleanedData: any = {};
    for (const [key, value] of Object.entries(mappedData)) {
      if (value !== undefined) {
        cleanedData[key] = value;
      }
    }

    // Validar foreign keys
    const validatedData = await validateForeignKeys(endpoint, cleanedData);

    // Verificar chave primária
    const primaryKeyValue = item[mapping.primaryKey] || item.id;
    if (!primaryKeyValue) {
      throw new Error(`Primary key ${mapping.primaryKey} is missing`);
    }

    const whereClause = { [mapping.primaryKey]: primaryKeyValue };

    syncLogger.debug(`Processing ${endpoint} item`, {
      id: primaryKeyValue,
      model: mapping.model,
      operation: 'upsert',
    });

    // Verificar se registro existe
    const existingRecord = await executePrismaOperation(
      mapping.model,
      'findUnique',
      { where: whereClause }
    );

    if (existingRecord) {
      // Atualizar registro existente
      // Criar cópia dos dados SEM a primary key para o UPDATE
      const updateData: any = {};
      for (const [key, value] of Object.entries(validatedData)) {
        // Não incluir a primary key no data do update
        if (key !== mapping.primaryKey && key !== 'id') {
          updateData[key] = value;
        }
      }

      await executePrismaOperation(mapping.model, 'update', {
        where: whereClause,
        data: updateData,
      });
      return { status: 'updated' };
    } else {
      // Criar novo registro - mantém todos os campos incluindo ID
      await executePrismaOperation(mapping.model, 'create', {
        data: validatedData,
      });
      return { status: 'inserted' };
    }
  } catch (error) {
    const itemId = item[mapping.primaryKey] || item.id || 'unknown';
    syncLogger.error(`Error processing ${endpoint} item ${itemId}`, error);

    logger.error('SYNC_DIRECT', `Error processing ${endpoint} item`, error, {
      itemId,
    });

    const errorMessage =
      error instanceof Error
        ? `Item ${itemId}: ${error.message}`
        : `Item ${itemId}: Unknown error`;

    return { status: 'error', errorMessage };
  }
}

/**
 * Processa qualquer endpoint usando mapeamento genérico
 */
async function processGenericEndpoint(
  endpoint: string,
  data: any[],
  syncLogId: number
): Promise<SyncResult> {
  const mapping = getEndpointMapping(endpoint);

  if (!mapping) {
    syncLogger.warn(`No mapping defined for endpoint ${endpoint}`);
    return { inserted: data.length, updated: 0, errors: 0 };
  }

  const results: SyncResult = { inserted: 0, updated: 0, errors: 0 };

  syncLogger.info(`Processing ${data.length} items for ${endpoint}`, {
    model: mapping.model,
    endpoint,
  });

  // Processar itens em batches para melhor performance
  const batchSize = 50;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);

    syncLogger.debug(`Processing batch ${Math.floor(i / batchSize) + 1}`, {
      size: batch.length,
      total: data.length,
    });

    // Processar batch em paralelo
    const batchResults = await Promise.all(
      batch.map(item => processItem(endpoint, item, mapping))
    );

    // Contar resultados
    batchResults.forEach(result => {
      if (result.status === 'error') {
        results.errors++;
        // Capturar primeiro erro para o log
        if (!results.firstError && result.errorMessage) {
          results.firstError = result.errorMessage;
        }
      } else {
        results[result.status]++;
      }
    });
  }

  syncLogger.info(`Completed processing ${endpoint}`, results);
  return results;
}

/**
 * Endpoint principal de sincronização direta
 */
export async function POST(request: NextRequest) {
  try {
    const body: DirectSyncRequest = await request.json();

    // Validar parâmetros obrigatórios
    const validation = validateRequiredParams(body, ['endpoint', 'data']);
    if (!validation.valid) {
      return apiError(
        'VALIDATION_ERROR',
        `Parâmetros obrigatórios ausentes: ${validation.missing?.join(', ')}`,
        400
      );
    }

    const { endpoint, data } = body;

    // Validar se data é array
    if (!Array.isArray(data)) {
      return apiError(
        'VALIDATION_ERROR',
        'O campo "data" deve ser um array',
        400
      );
    }

    // Verificar se endpoint tem mapeamento
    if (!hasEndpointMapping(endpoint)) {
      return apiError(
        'ENDPOINT_NOT_SUPPORTED',
        `Endpoint ${endpoint} não possui mapeamento definido`,
        400
      );
    }

    const logger = createContextLogger('sync-direct');
    const startTime = Date.now();

    syncLogger.info(`Starting sync for endpoint ${endpoint}`, {
      itemCount: data.length,
      endpoint,
    });

    // Criar log de sincronização
    const syncLog = await prisma.syncLog.create({
      data: {
        entityType: endpoint,
        status: 'in_progress',
        recordsProcessed: 0,
        recordsInserted: 0,
        recordsUpdated: 0,
        recordsErrors: 0,
        apiCallsMade: 1,
      },
    });

    // Processar dados
    const result = await processGenericEndpoint(endpoint, data, syncLog.id);

    // Atualizar log
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        syncCompletedAt: new Date(),
        recordsProcessed: data.length,
        recordsInserted: result.inserted,
        recordsUpdated: result.updated,
        recordsErrors: result.errors,
        status: result.errors > 0 ? 'completed_with_errors' : 'completed',
        errorMessage: result.firstError || null,
      },
    });

    const duration = Date.now() - startTime;

    // Log de resumo
    syncLogger.info(`Sync completed for ${endpoint}`, {
      ...result,
      duration,
      processed: data.length,
    });

    // Salvar log de erros se houver
    if (result.errors > 0) {
      syncLogger.warn('Errors occurred during sync', {
        errorCount: result.errors,
        summary: 'Errors logged above',
      });
    }

    return apiSuccess(
      {
        endpoint,
        processed: data.length,
        inserted: result.inserted,
        updated: result.updated,
        errors: result.errors,
        duration,
        errorSummary:
          result.errors > 0 ? `${result.errors} errors logged` : null,
      },
      `Sincronização do endpoint ${endpoint} concluída`,
      {
        syncLogId: syncLog.id,
        performance: {
          itemsPerSecond: Math.round(data.length / (duration / 1000)),
          avgTimePerItem: Math.round(duration / data.length),
        },
      }
    );
  } catch (error) {
    const logger = createContextLogger('sync-direct');
    logger.error('Sync direct failed', error);

    return apiError('SYNC_ERROR', 'Erro durante a sincronização', 500, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
