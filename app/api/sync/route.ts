import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { siengeApiClient } from '@/lib/sienge-api-client';

interface SyncRequest {
  entities: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SyncRequest = await request.json();
    const { entities = [] } = body;

    // Verificar se existem credenciais salvas
    const credentials = await prisma.apiCredentials.findFirst({
      where: { isActive: true }
    });

    if (!credentials) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Nenhuma credencial configurada. Configure as credenciais primeiro.' 
        },
        { status: 400 }
      );
    }

    // Inicializar cliente da API
    try {
      await siengeApiClient.initialize();
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Erro ao inicializar cliente API. Verifique as credenciais.' 
        },
        { status: 500 }
      );
    }

    // Criar log de sincronização
    const syncLog = await prisma.syncLog.create({
      data: {
        entityType: 'batch_sync',
        status: 'in_progress',
        recordsProcessed: 0,
        recordsInserted: 0,
        recordsUpdated: 0,
        recordsErrors: 0,
        apiCallsMade: 0
      }
    });

    const results = [];
    let totalProcessed = 0;
    let totalErrors = 0;

    // Processar cada entidade
    for (const entity of entities) {
      try {
        let endpoint = '';
        
        switch (entity) {
          case 'customers':
            endpoint = '/customers';
            break;
          case 'companies':
            endpoint = '/companies';
            break;
          case 'projects':
            endpoint = '/projects';
            break;
          case 'costCenters':
            endpoint = '/cost-centers';
            break;
          default:
            throw new Error(`Entidade desconhecida: ${entity}`);
        }

        // Buscar dados usando o cliente API
        console.log(`[Sync API] Buscando dados para entidade: ${entity} no endpoint: ${endpoint}`);
        const data = await siengeApiClient.fetchPaginatedData(endpoint);
        console.log(`[Sync API] Dados obtidos para ${entity}:`, {
          count: data.length,
          sampleData: data.length > 0 ? data[0] : null
        });

        results.push({
          entity,
          success: true,
          count: data.length,
          message: `${data.length} registros obtidos`
        });

        totalProcessed += data.length;

        // TODO: Implementar salvamento no banco de dados
        console.log(`[Sync API] TODO: Implementar salvamento no banco para ${entity}`);

      } catch (error) {
        totalErrors++;
        results.push({
          entity,
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    // Atualizar log
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        syncCompletedAt: new Date(),
        recordsProcessed: totalProcessed,
        recordsErrors: totalErrors,
        status: totalErrors > 0 ? 'completed_with_errors' : 'completed',
        apiCallsMade: entities.length
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Sincronização concluída',
      results,
      summary: {
        totalProcessed,
        totalInserted: 0,
        totalUpdated: 0,
        totalErrors
      }
    });

  } catch (error) {
    console.error('Erro na sincronização:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro durante a sincronização',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}