import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface DirectSyncRequest {
  endpoint: string;
  data: any[];
}

// Função auxiliar para criar mapeamento amigável de dados
function createFriendlyFieldMapping(customer: any) {
  return {
    'ID do Cliente': customer.id,
    'Nome Completo': customer.name,
    'CPF/CNPJ': customer.cpf,
    Email: customer.email,
    RG: customer.numberIdentityCard,
    'Data de Nascimento': customer.birthDate,
    Nacionalidade: customer.nationality,
    'Tipo de Pessoa': customer.personType,
    'Estado Civil': customer.civilStatus?.descricao || customer.civilStatus,
    Profissão: customer.profession?.descricao || customer.profession,
    'Data de Cadastro': customer.createdAt,
    'Data de Atualização': customer.updatedAt,
  };
}

// Funções auxiliares para mapeamento de dados
async function getOrCreateEstadoCivil(
  descricao: string
): Promise<string | null> {
  return descricao || null;
}

async function getOrCreateProfissao(
  descricao: string
): Promise<string | null> {
  return descricao || null;
}

// Função para processar e salvar clientes
async function processCustomers(customers: any[], prisma: any) {
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const customer of customers) {
    try {
      // Mapear campos da API para o banco
      const estadoCivil = await getOrCreateEstadoCivil(
        customer.civilStatus?.descricao || customer.civilStatus
      );
      const profissao = await getOrCreateProfissao(
        customer.profession?.descricao || customer.profession
      );

      const cleanCustomer = {
        idCliente: customer.id,
        nome: customer.name,
        cpf: customer.cpf,
        email: customer.email,
        rg: customer.numberIdentityCard,
        dataNascimento: customer.birthDate
          ? new Date(customer.birthDate)
          : null,
        nacionalidade: customer.nationality,
        tipoPessoa: customer.personType,
        estadoCivil,
        profissao,
        dataCadastro: customer.createdAt
          ? new Date(customer.createdAt)
          : new Date(),
        dataAtualizacao: customer.updatedAt
          ? new Date(customer.updatedAt)
          : new Date(),
      };

      // Verificar se o cliente já existe
      const existingCustomer = await prisma.cliente.findUnique({
        where: { idCliente: customer.id },
      });

      if (existingCustomer) {
        // Atualizar cliente existente
        await prisma.cliente.update({
          where: { idCliente: customer.id },
          data: cleanCustomer,
        });
        updated++;
      } else {
        // Criar novo cliente
        await prisma.cliente.create({
          data: cleanCustomer,
        });
        inserted++;
      }
    } catch (error) {
      console.error(`Erro ao processar cliente ${customer.id}:`, error);
      errors++;
    }
  }

  return { inserted, updated, errors };
}

export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma');
    
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

    // Processar dados baseado no endpoint
    switch (endpoint) {
      case 'customers':
        result = await processCustomers(data, prisma);
        break;
      
      default:
        // Para outros endpoints, apenas logar por enquanto
        console.log(`Endpoint ${endpoint} não implementado ainda. Dados recebidos:`, data.length);
        result = { inserted: 0, updated: 0, errors: 0 };
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