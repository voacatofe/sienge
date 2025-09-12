import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { siengeApiClient } from '@/lib/sienge-api-client';

interface SyncRequest {
  entities: string[];
}

// Método para salvar dados de entidades no banco
async function saveEntityData(entity: string, data: any[]) {
  switch (entity) {
    case 'customers':
      await saveCustomers(data);
      break;
    case 'companies':
      await saveCompanies(data);
      break;
    case 'projects':
      await saveProjects(data);
      break;
    case 'costCenters':
      await saveCostCenters(data);
      break;
    default:
      console.warn(`[Sync API] Salvamento não implementado para entidade: ${entity}`);
  }
}

// Implementações específicas de salvamento
async function saveCustomers(customers: any[]) {
  for (const customer of customers) {
    await prisma.cliente.upsert({
      where: { idCliente: customer.id },
      update: {
        idTipoCliente: customer.personType === 'Física' ? 1 : 2,
        nomeCompleto: customer.name,
        cpfCnpj: customer.cpf,
        email: customer.email,
        dataNascimento: customer.birthDate ? new Date(customer.birthDate) : null,
        nacionalidade: customer.nationality,
        profissao: customer.profession,
        estadoCivil: customer.civilStatus,
        ativo: true,
        dataCadastro: customer.createdAt ? new Date(customer.createdAt) : new Date()
      },
      create: {
        idCliente: customer.id,
        idTipoCliente: customer.personType === 'Física' ? 1 : 2, // Assumindo que 1 = PF, 2 = PJ
        nomeCompleto: customer.name,
        cpfCnpj: customer.cpf,
        email: customer.email,
        dataNascimento: customer.birthDate ? new Date(customer.birthDate) : null,
        nacionalidade: customer.nationality,
        profissao: customer.profession,
        estadoCivil: customer.civilStatus,
        ativo: true,
        dataCadastro: customer.createdAt ? new Date(customer.createdAt) : new Date()
      }
    });
  }
}

async function saveCompanies(companies: any[]) {
  for (const company of companies) {
    await prisma.empresa.upsert({
      where: { idEmpresa: company.id },
      update: {
        nomeEmpresa: company.name,
        cnpj: company.cnpj,
        nomeFantasia: company.tradeName,
        ativo: true
      },
      create: {
        idEmpresa: company.id,
        nomeEmpresa: company.name,
        cnpj: company.cnpj,
        nomeFantasia: company.tradeName,
        ativo: true
      }
    });
  }
}

async function saveProjects(projects: any[]) {
  // Implementar quando o endpoint de projetos estiver funcionando
  console.log(`[Sync API] Salvamento de projetos não implementado ainda: ${projects.length} registros`);
}

async function saveCostCenters(costCenters: any[]) {
  // Implementar quando o endpoint de centros de custo estiver funcionando
  console.log(`[Sync API] Salvamento de centros de custo não implementado ainda: ${costCenters.length} registros`);
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
        // Mapeamento de entidades para endpoints com fallbacks
        const endpointMap: Record<string, string[]> = {
          'customers': ['/customers'],
          'companies': ['/companies'],
          'projects': ['/buildings', '/constructions', '/empreendimentos', '/projects'],
          'costCenters': ['/cost-centers', '/departments']
        };

        const endpoints = endpointMap[entity];
        if (!endpoints) {
          throw new Error(`Entidade desconhecida: ${entity}`);
        }

        let data: any[] = [];
        let successfulEndpoint = '';
        let lastError: Error | null = null;

        // Tentar cada endpoint até encontrar um que funcione
        for (const endpoint of endpoints) {
          try {
            console.log(`[Sync API] Tentando endpoint: ${endpoint} para entidade: ${entity}`);
            data = await siengeApiClient.fetchPaginatedData(endpoint);
            successfulEndpoint = endpoint;
            console.log(`[Sync API] Sucesso com endpoint: ${endpoint} - ${data.length} registros`);
            break; // Se funcionou, sair do loop
          } catch (error) {
            console.warn(`[Sync API] Falha com endpoint: ${endpoint} - ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            lastError = error instanceof Error ? error : new Error('Erro desconhecido');
            continue; // Tentar próximo endpoint
          }
        }

        // Se nenhum endpoint funcionou, lançar erro
        if (data.length === 0 && !successfulEndpoint) {
          throw new Error(`Todos os endpoints falharam para ${entity}. Último erro: ${lastError?.message}`);
        }
        console.log(`[Sync API] Dados obtidos para ${entity}:`, {
          count: data.length,
          sampleData: data.length > 0 ? data[0] : null
        });

        results.push({
          entity,
          success: true,
          count: data.length,
          endpoint: successfulEndpoint,
          message: `${data.length} registros obtidos via ${successfulEndpoint}`
        });

        totalProcessed += data.length;

        // Implementar salvamento no banco de dados
        if (data.length > 0) {
          try {
            await saveEntityData(entity, data);
            console.log(`[Sync API] Dados salvos no banco para ${entity}: ${data.length} registros`);
          } catch (saveError) {
            console.error(`[Sync API] Erro ao salvar dados de ${entity}:`, saveError);
            // Não falhar a sincronização por erro de salvamento
          }
        }

      } catch (error) {
        totalErrors++;
        
        // Tratamento específico para erro 403 (permissão negada)
        let errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        let isPermissionError = false;
        
        if (error instanceof Error && error.message.includes('403')) {
          errorMessage = `Permissão negada para acessar ${entity}. Verifique as permissões do usuário da API no painel Sienge.`;
          isPermissionError = true;
        }
        
        results.push({
          entity,
          success: false,
          count: 0,
          message: errorMessage,
          isPermissionError
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