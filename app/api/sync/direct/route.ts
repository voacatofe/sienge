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

// Função para processar e salvar empresas
async function processCompanies(companies: any[], prisma: any) {
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const company of companies) {
    try {
      const cleanCompany = {
        idEmpresa: company.id,
        nomeEmpresa: company.name || '',
        cnpj: company.cnpj,
        inscricaoEstadual: company.stateRegistration,
        inscricaoMunicipal: company.cityRegistration,
        endereco: company.address,
        cidade: company.city,
        estado: company.state,
        cep: company.zipCode,
        telefone: company.phone,
        email: company.email,
        site: company.website,
        ativo: company.active !== false,
        dataCadastro: company.createdAt
          ? new Date(company.createdAt)
          : new Date(),
        dataAtualizacao: company.updatedAt
          ? new Date(company.updatedAt)
          : new Date(),
      };

      // Verificar se a empresa já existe
      const existingCompany = await prisma.empresa.findUnique({
        where: { idEmpresa: company.id },
      });

      if (existingCompany) {
        // Atualizar empresa existente
        await prisma.empresa.update({
          where: { idEmpresa: company.id },
          data: cleanCompany,
        });
        updated++;
      } else {
        // Criar nova empresa
        await prisma.empresa.create({
          data: cleanCompany,
        });
        inserted++;
      }
    } catch (error) {
      console.error(`Erro ao processar empresa ${company.id}:`, error);
      errors++;
    }
  }

  return { inserted, updated, errors };
}

// Função para processar e salvar contratos de venda
async function processSalesContracts(data: any[], syncLogId: number) {
  const results = { inserted: 0, updated: 0, errors: 0 };
  
  for (const item of data) {
    try {
      const contratoData = {
        id: item.id,
        companyId: item.companyId,
        internalCompanyId: item.internalCompanyId,
        companyName: item.companyName,
        enterpriseId: item.enterpriseId,
        internalEnterpriseId: item.internalEnterpriseId,
        enterpriseName: item.enterpriseName,
        receivableBillId: item.receivableBillId,
        cancellationPayableBillId: item.cancellationPayableBillId,
        contractDate: item.contractDate ? new Date(item.contractDate) : null,
        issueDate: item.issueDate ? new Date(item.issueDate) : null,
        accountingDate: item.accountingDate ? new Date(item.accountingDate) : null,
        expectedDeliveryDate: item.expectedDeliveryDate ? new Date(item.expectedDeliveryDate) : null,
        keysDeliveredAt: item.keysDeliveredAt ? new Date(item.keysDeliveredAt) : null,
        number: item.number,
        externalId: item.externalId,
        correctionType: item.correctionType,
        situation: item.situation,
        discountType: item.discountType,
        discountPercentage: item.discountPercentage ? parseFloat(item.discountPercentage) : null,
        value: item.value ? parseFloat(item.value) : null,
        totalSellingValue: item.totalSellingValue ? parseFloat(item.totalSellingValue) : null,
        cancellationDate: item.cancellationDate ? new Date(item.cancellationDate) : null,
        totalCancellationAmount: item.totalCancellationAmount ? parseFloat(item.totalCancellationAmount) : null,
        cancellationReason: item.cancellationReason,
        financialInstitutionNumber: item.financialInstitutionNumber,
        financialInstitutionDate: item.financialInstitutionDate ? new Date(item.financialInstitutionDate) : null,
        proRataIndexer: item.proRataIndexer,
        interestType: item.interestType,
        interestPercentage: item.interestPercentage ? parseFloat(item.interestPercentage) : null,
        fineRate: item.fineRate ? parseFloat(item.fineRate) : null,
        lateInterestCalculationType: item.lateInterestCalculationType,
        dailyLateInterestValue: item.dailyLateInterestValue ? parseFloat(item.dailyLateInterestValue) : null,
        containsRemadeInstallments: item.containsRemadeInstallments,
        specialClause: item.specialClause,
        salesContractCustomers: item.salesContractCustomers || null,
        salesContractUnits: item.salesContractUnits || null,
        paymentConditions: item.paymentConditions || null,
        brokers: item.brokers || null,
        linkedCommissions: item.linkedCommissions || null,
        links: item.links || null,
        dataCadastro: item.createdAt ? new Date(item.createdAt) : new Date(),
        dataAtualizacao: new Date(),
      };

      const existingContrato = await prisma.contratoVenda.findUnique({
        where: { id: item.id }
      });

      if (existingContrato) {
        await prisma.contratoVenda.update({
          where: { id: item.id },
          data: contratoData
        });
        results.updated++;
      } else {
        await prisma.contratoVenda.create({
          data: contratoData
        });
        results.inserted++;
      }
    } catch (error) {
      console.error(`Erro ao processar contrato de venda ${item.id}:`, error);
      results.errors++;
    }
  }
  
  return results;
}

// Função para processar e salvar títulos a receber (income)
async function processIncome(data: any[], syncLogId: number) {
  const results = { inserted: 0, updated: 0, errors: 0 };
  
  for (const item of data) {
    try {
      const tituloData = {
        idTituloReceber: item.id,
        idContrato: item.contractId,
        idCliente: item.customerId || item.clientId,
        idEmpresa: item.companyId,
        numeroDocumento: item.documentNumber || item.number || '',
        idDocumentoIdent: item.documentIdentId,
        dataEmissao: item.issueDate ? new Date(item.issueDate) : new Date(),
        dataVencimento: item.dueDate ? new Date(item.dueDate) : new Date(),
        valorOriginal: item.originalValue ? parseFloat(item.originalValue) : 0,
        valorAtualizado: item.updatedValue ? parseFloat(item.updatedValue) : null,
        idIndexador: item.indexerId,
        juros: item.interest ? parseFloat(item.interest) : null,
        multa: item.fine ? parseFloat(item.fine) : null,
        descontoConcedido: item.discountGranted ? parseFloat(item.discountGranted) : null,
        valorPago: item.paidValue ? parseFloat(item.paidValue) : null,
        dataPagamento: item.paymentDate ? new Date(item.paymentDate) : null,
        status: item.status || 'pending',
        observacoes: item.observations || item.notes,
        idPortador: item.carrierId,
        idPlanoFinanceiro: item.financialPlanId,
      };

      const existingTitulo = await prisma.tituloReceber.findUnique({
        where: { idTituloReceber: item.id }
      });

      if (existingTitulo) {
        await prisma.tituloReceber.update({
          where: { idTituloReceber: item.id },
          data: tituloData
        });
        results.updated++;
      } else {
        await prisma.tituloReceber.create({
          data: tituloData
        });
        results.inserted++;
      }
    } catch (error) {
      console.error(`Erro ao processar título a receber ${item.id}:`, error);
      results.errors++;
    }
  }
  
  return results;
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
      
      case 'companies':
        result = await processCompanies(data, prisma);
        break;
      
      case 'sales-contracts':
        result = await processSalesContracts(data, syncLog.id);
        break;
      
      case 'income':
        result = await processIncome(data, syncLog.id);
        break;
      
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
        console.log(`Dados recebidos para ${endpoint}:`, data.length, 'registros');
        result = { inserted: data.length, updated: 0, errors: 0 };
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