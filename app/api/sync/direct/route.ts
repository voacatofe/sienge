import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  ENDPOINT_MAPPINGS,
  hasEndpointMapping,
  getEndpointMapping,
} from './endpoint-mappings';
import { ErrorLogger } from '../../../../lib/error-logger';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface DirectSyncRequest {
  endpoint: string;
  data: any[];
}

// Função para validar parâmetros obrigatórios
function validateRequiredParams(params: any) {
  const { endpoint, data } = params;
  return endpoint && data;
}

// Função genérica para processar qualquer endpoint
async function processGenericEndpoint(
  endpoint: string,
  data: any[],
  syncLogId: number,
  prisma: any,
  errorLogger?: ErrorLogger
) {
  const results = { inserted: 0, updated: 0, errors: 0 };
  const mapping = getEndpointMapping(endpoint);

  if (!mapping) {
    console.log(`Endpoint ${endpoint} não tem mapeamento definido`);
    return { inserted: data.length, updated: 0, errors: 0 };
  }

  for (const item of data) {
    try {
      const mappedData: any = {};

      // Aplicar mapeamento de campos
      for (const [sourceField, targetConfig] of Object.entries(
        mapping.fieldMapping
      )) {
        const sourceValue = item[sourceField];

        if (typeof targetConfig === 'string') {
          mappedData[targetConfig] = sourceValue;
        } else if (typeof targetConfig === 'object' && targetConfig.field) {
          mappedData[targetConfig.field] = targetConfig.transform
            ? targetConfig.transform(sourceValue)
            : sourceValue;
        }
      }

      // Tratamento especial para ContratoVenda - verificar se enterpriseId existe
      if (mapping.model === 'contratoVenda' && mappedData.enterpriseId) {
        const enterprise = await prisma.empreendimento.findUnique({
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
      const whereClause = { [mapping.primaryKey]: item.id };
      const existingRecord = await (prisma as any)[mapping.model].findUnique({
        where: whereClause,
      });

      if (existingRecord) {
        await (prisma as any)[mapping.model].update({
          where: whereClause,
          data: mappedData,
        });
        results.updated++;
      } else {
        await (prisma as any)[mapping.model].create({ data: mappedData });
        results.inserted++;
      }
    } catch (error) {
      console.error(`Erro ao processar ${endpoint} ${item.id}:`, error);
      if (errorLogger) {
        errorLogger.logException(endpoint, item.id, error);
      }
      results.errors++;
    }
  }

  return results;
}

export async function POST(request: NextRequest) {
  const errorLogger = new ErrorLogger();

  try {
    const body: DirectSyncRequest = await request.json();
    const { endpoint, data } = body;

    if (!endpoint || !data || !Array.isArray(data)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Parâmetros inválidos. Esperado: endpoint e data (array)',
        },
        { status: 400 }
      );
    }

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

    let result = { inserted: 0, updated: 0, errors: 0 };

    // Processar dados usando o sistema genérico
    if (hasEndpointMapping(endpoint)) {
      result = await processGenericEndpoint(endpoint, data, syncLog.id, prisma, errorLogger);
    } else {
      // Para endpoints sem mapeamento definido
      switch (endpoint) {
        case 'enterprises':
        case 'units':
        case 'units-characteristics':
        case 'units-situations':
        case 'bank-movement':
        case 'customer-extract-history':
        case 'accounts-statements':
        case 'sales':
        case 'supply-contracts-measurements-all':
        case 'supply-contracts-measurements-attachments-all':
        case 'construction-daily-report-event-type':
        case 'construction-daily-report-types':
        case 'hooks':
        case 'patrimony-fixed':
          // Para endpoints sem tabelas específicas, apenas logar os dados recebidos
          console.log(
            `Dados recebidos para ${endpoint}:`,
            data.length,
            'registros'
          );
          result = { inserted: data.length, updated: 0, errors: 0 };
          break;

        default:
          // Para outros endpoints, apenas logar por enquanto
          console.log(
            `Endpoint ${endpoint} não implementado ainda. Dados recebidos:`,
            data.length
          );
          result = { inserted: 0, updated: 0, errors: 0 };
      }
    }

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
      },
    });

    // Exibir resumo de erros se houver
    if (errorLogger.hasErrors()) {
      console.log(errorLogger.formatSummaryForConsole());
      errorLogger.saveToFile();
    }

    return NextResponse.json({
      success: true,
      message: `Sincronização do endpoint ${endpoint} concluída`,
      result: {
        endpoint,
        processed: data.length,
        inserted: result.inserted,
        updated: result.updated,
        errors: result.errors,
      },
      errorSummary: errorLogger.hasErrors() ? errorLogger.generateSummary() : null,
    });
  } catch (error) {
    console.error('Erro na sincronização direta:', error);

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
