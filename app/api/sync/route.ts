import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { siengeApiClient } from '@/lib/sienge-api-client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SyncRequest {
  entities: string[];
}

// Funções auxiliares para mapeamento de dados
async function getOrCreateTipoCliente(descricao: string): Promise<number> {
  // Primeiro tentar encontrar existente
  let tipo = await prisma.tipoCliente.findFirst({
    where: { descricao },
    select: { idTipoCliente: true },
  });

  if (!tipo) {
    // Se não existir, criar novo
    tipo = await prisma.tipoCliente.create({
      data: { descricao },
      select: { idTipoCliente: true },
    });
  }

  return tipo.idTipoCliente;
}

async function getOrCreateEstadoCivil(
  descricao: string
): Promise<number | null> {
  if (!descricao) return null;

  // Primeiro tentar encontrar existente
  let estado = await prisma.estadoCivil.findFirst({
    where: { descricao },
    select: { idEstadoCivil: true },
  });

  if (!estado) {
    // Se não existir, criar novo
    estado = await prisma.estadoCivil.create({
      data: { descricao },
      select: { idEstadoCivil: true },
    });
  }

  return estado.idEstadoCivil;
}

async function getOrCreateProfissao(nome: string): Promise<number | null> {
  if (!nome || nome.trim() === '') return null;

  // Primeiro tentar encontrar existente
  let profissao = await prisma.profissao.findFirst({
    where: { nomeProfissao: nome.trim() },
    select: { idProfissao: true },
  });

  if (!profissao) {
    // Se não existir, criar novo
    profissao = await prisma.profissao.create({
      data: {
        nomeProfissao: nome.trim(),
        codigoProfissao: nome.trim().toLowerCase().replace(/\s+/g, '_'),
      },
      select: { idProfissao: true },
    });
  }

  return profissao.idProfissao;
}

// Funções auxiliares para entidades financeiras
async function getOrCreateCustomerReference(customerId: any): Promise<number> {
  if (!customerId) throw new Error('Customer ID é obrigatório');

  // Assumindo que o cliente já existe (foi sincronizado antes)
  // Se não existir, podemos criar um registro básico
  const cliente = await prisma.cliente.findFirst({
    where: { idCliente: customerId },
    select: { idCliente: true },
  });

  if (!cliente) {
    console.warn(
      `[Sync] Cliente ${customerId} não encontrado, criando registro básico`
    );
    const novoCliente = await prisma.cliente.create({
      data: {
        idCliente: customerId,
        idTipoCliente: 1, // Padrão PF
        nomeCompleto: `Cliente ${customerId}`,
        cpfCnpj: '',
        ativo: true,
        dataCadastro: new Date(),
      },
    });
    return novoCliente.idCliente;
  }

  return cliente.idCliente;
}

async function getOrCreateCredorReference(creditorId: any): Promise<number> {
  if (!creditorId) throw new Error('Creditor ID é obrigatório');

  const credor = await prisma.credor.findFirst({
    where: { idCredor: creditorId },
    select: { idCredor: true },
  });

  if (!credor) {
    console.warn(
      `[Sync] Credor ${creditorId} não encontrado, criando registro básico`
    );
    const novoCredor = await prisma.credor.create({
      data: {
        idCredor: creditorId,
        nomeCredor: `Credor ${creditorId}`,
        cpfCnpj: '',
        ativo: true,
      },
    });
    return novoCredor.idCredor;
  }

  return credor.idCredor;
}

async function getOrCreatePortador(portadorId: any): Promise<number | null> {
  if (!portadorId) return null;

  const portador = await prisma.portadorRecebimento.upsert({
    where: { idPortador: portadorId },
    update: {},
    create: {
      idPortador: portadorId,
      descricao: `Portador ${portadorId}`,
      ativo: true,
    },
    select: { idPortador: true },
  });

  return portador.idPortador;
}

async function getOrCreatePlanoFinanceiro(
  planoId: any
): Promise<number | null> {
  if (!planoId) return null;

  const plano = await prisma.planoFinanceiro.upsert({
    where: { idPlanoFinanceiro: planoId },
    update: {},
    create: {
      idPlanoFinanceiro: planoId,
      nomePlano: `Plano ${planoId}`,
    },
    select: { idPlanoFinanceiro: true },
  });

  return plano.idPlanoFinanceiro;
}

async function getOrCreateCondicaoPagamento(
  condicaoId: any
): Promise<number | null> {
  if (!condicaoId) return null;

  const condicao = await prisma.tipoCondicaoPagamento.upsert({
    where: { idTipoCondPag: condicaoId },
    update: {},
    create: {
      idTipoCondPag: condicaoId,
      descricao: `Condição ${condicaoId}`,
    },
    select: { idTipoCondPag: true },
  });

  return condicao.idTipoCondPag;
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
    // Entidades Financeiras
    case 'receivables':
      await saveReceivables(data);
      break;
    case 'payables':
      await savePayables(data);
      break;
    case 'salesContracts':
      await saveSalesContracts(data);
      break;
    case 'salesCommissions':
      await saveSalesCommissions(data);
      break;
    case 'financialPlans':
      await saveFinancialPlans(data);
      break;
    case 'receivableCarriers':
      await saveReceivableCarriers(data);
      break;
    case 'indexers':
      await saveIndexers(data);
      break;
    default:
      console.warn(
        `[Sync API] Salvamento não implementado para entidade: ${entity}`
      );
  }
}

// Implementações específicas de salvamento
async function saveCustomers(customers: any[]) {
  console.log(`[Sync] Iniciando salvamento de ${customers.length} customers`);

  for (const customer of customers) {
    try {
      // Buscar/criar relacionamentos
      const idTipoCliente = await getOrCreateTipoCliente(
        customer.personType === 'Física' ? 'Pessoa Física' : 'Pessoa Jurídica'
      );
      const idEstadoCivil = await getOrCreateEstadoCivil(customer.civilStatus);
      const idProfissao = await getOrCreateProfissao(customer.profession);

      // Mapear dados da API para schema do banco
      const customerData = {
        idTipoCliente,
        nomeCompleto: customer.name || '',
        cpfCnpj: customer.cpf || '',
        email: customer.email || null,
        rg: customer.numberIdentityCard || null,
        dataNascimento: customer.birthDate
          ? new Date(customer.birthDate)
          : null,
        nacionalidade: customer.nationality || null,
        idProfissao,
        idEstadoCivil,
        ativo: true,
        dataCadastro: customer.createdAt
          ? new Date(customer.createdAt)
          : new Date(),
      };

      await prisma.cliente.upsert({
        where: { idCliente: customer.id },
        update: customerData,
        create: {
          idCliente: customer.id,
          ...customerData,
        },
      });

      console.log(
        `[Sync] Cliente salvo: ${customer.name} (ID: ${customer.id})`
      );
    } catch (error) {
      console.error(
        `[Sync] Erro ao salvar cliente ${customer.id}:`,
        error instanceof Error ? error.message : error
      );
      // Continue com o próximo cliente em caso de erro
    }
  }

  console.log(`[Sync] Salvamento de customers concluído`);
}

async function saveCompanies(companies: any[]) {
  for (const company of companies) {
    await prisma.empresa.upsert({
      where: { idEmpresa: company.id },
      update: {
        nomeEmpresa: company.name,
        cnpj: company.cnpj,
        nomeFantasia: company.tradeName,
        ativo: true,
      },
      create: {
        idEmpresa: company.id,
        nomeEmpresa: company.name,
        cnpj: company.cnpj,
        nomeFantasia: company.tradeName,
        ativo: true,
      },
    });
  }
}

async function saveProjects(projects: any[]) {
  // Implementar quando o endpoint de projetos estiver funcionando
  console.log(
    `[Sync API] Salvamento de projetos não implementado ainda: ${projects.length} registros`
  );
}

async function saveCostCenters(costCenters: any[]) {
  // Implementar quando o endpoint de centros de custo estiver funcionando
  console.log(
    `[Sync API] Salvamento de centros de custo não implementado ainda: ${costCenters.length} registros`
  );
}

// === FUNÇÕES DE SALVAMENTO PARA ENTIDADES FINANCEIRAS ===

async function saveReceivables(receivables: any[]) {
  console.log(
    `[Sync] Iniciando salvamento de ${receivables.length} títulos a receber`
  );

  for (const receivable of receivables) {
    try {
      // Buscar/criar relacionamentos necessários
      const idCliente = await getOrCreateCustomerReference(
        receivable.customerId || receivable.clientId
      );
      const idContrato = receivable.contractId || null;
      const idEmpresa = receivable.companyId || null;
      const idPortador = await getOrCreatePortador(
        receivable.carrierId || receivable.portadorId
      );
      const idPlanoFinanceiro = await getOrCreatePlanoFinanceiro(
        receivable.paymentCategoryId || receivable.financialPlanId
      );
      const idIndexador = receivable.indexId || null;

      const receivableData = {
        idCliente,
        idContrato,
        idEmpresa,
        numeroDocumento: receivable.documentNumber || receivable.numero || '',
        idDocumentoIdent: receivable.documentIdentificationId || null,
        dataEmissao: receivable.issueDate
          ? new Date(receivable.issueDate)
          : new Date(),
        dataVencimento: receivable.dueDate
          ? new Date(receivable.dueDate)
          : new Date(),
        valorOriginal: receivable.originalValue || receivable.valor || 0,
        valorAtualizado: receivable.updatedValue || null,
        idIndexador,
        juros: receivable.interest || null,
        multa: receivable.penalty || null,
        descontoConcedido: receivable.discountGranted || null,
        valorPago: receivable.paidValue || null,
        dataPagamento: receivable.paymentDate
          ? new Date(receivable.paymentDate)
          : null,
        status: receivable.status || 'PENDENTE',
        observacoes: receivable.observations || null,
        idPortador,
        idPlanoFinanceiro,
      };

      await prisma.tituloReceber.upsert({
        where: { idTituloReceber: receivable.id },
        update: receivableData,
        create: {
          idTituloReceber: receivable.id,
          ...receivableData,
        },
      });

      console.log(
        `[Sync] Título a receber salvo: ${receivable.documentNumber} (ID: ${receivable.id})`
      );
    } catch (error) {
      console.error(
        `[Sync] Erro ao salvar título a receber ${receivable.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(`[Sync] Salvamento de títulos a receber concluído`);
}

async function savePayables(payables: any[]) {
  console.log(
    `[Sync] Iniciando salvamento de ${payables.length} títulos a pagar`
  );

  for (const payable of payables) {
    try {
      const idCredor = await getOrCreateCredorReference(
        payable.creditorId || payable.supplierId
      );
      const idEmpresaDevedora = payable.companyId || null;
      const idPlanoFinanceiro = await getOrCreatePlanoFinanceiro(
        payable.paymentCategoryId || payable.financialPlanId
      );
      const idIndexador = payable.indexId || null;
      const idContratoSuprimento = payable.contractId || null;

      const payableData = {
        idCredor,
        idEmpresaDevedora,
        numeroDocumento: payable.documentNumber || payable.numero || '',
        idDocumentoIdent: payable.documentIdentificationId || null,
        dataEmissao: payable.issueDate
          ? new Date(payable.issueDate)
          : new Date(),
        dataVencimento: payable.dueDate
          ? new Date(payable.dueDate)
          : new Date(),
        valorOriginal: payable.originalValue || payable.valor || 0,
        valorAtualizado: payable.updatedValue || null,
        idIndexador,
        idPlanoFinanceiro,
        observacao: payable.observations || null,
        descontoObtido: payable.discountObtained || null,
        valorPago: payable.paidValue || null,
        dataPagamento: payable.paymentDate
          ? new Date(payable.paymentDate)
          : null,
        status: payable.status || 'PENDENTE',
        idContratoSuprimento,
      };

      await prisma.tituloPagar.upsert({
        where: { idTituloPagar: payable.id },
        update: payableData,
        create: {
          idTituloPagar: payable.id,
          ...payableData,
        },
      });

      console.log(
        `[Sync] Título a pagar salvo: ${payable.documentNumber} (ID: ${payable.id})`
      );
    } catch (error) {
      console.error(
        `[Sync] Erro ao salvar título a pagar ${payable.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(`[Sync] Salvamento de títulos a pagar concluído`);
}

async function saveSalesContracts(contracts: any[]) {
  console.log(
    `[Sync] Iniciando salvamento de ${contracts.length} contratos de venda`
  );

  for (const contract of contracts) {
    try {
      const idCliente = await getOrCreateCustomerReference(
        contract.customerId || contract.clientId
      );
      const idUnidade = contract.unitId || contract.propertyId;
      const idIndexador = contract.indexId || null;
      const idPlanoFinanceiro = await getOrCreatePlanoFinanceiro(
        contract.financialPlanId
      );
      const idCondicaoPagamento = await getOrCreateCondicaoPagamento(
        contract.paymentConditionId
      );

      const contractData = {
        numeroContrato: contract.contractNumber || contract.numero || '',
        idCliente,
        idUnidade,
        dataContrato: contract.contractDate
          ? new Date(contract.contractDate)
          : new Date(),
        valorContrato: contract.contractValue || contract.valor || 0,
        idIndexador,
        idPlanoFinanceiro,
        idCondicaoPagamento,
        entrada: contract.downPayment || null,
        financiamento: contract.financing || null,
        observacoes: contract.observations || null,
        statusContrato: contract.status || 'ATIVO',
      };

      await prisma.contratoVenda.upsert({
        where: { idContrato: contract.id },
        update: contractData,
        create: {
          idContrato: contract.id,
          ...contractData,
        },
      });

      console.log(
        `[Sync] Contrato de venda salvo: ${contract.contractNumber} (ID: ${contract.id})`
      );
    } catch (error) {
      console.error(
        `[Sync] Erro ao salvar contrato de venda ${contract.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(`[Sync] Salvamento de contratos de venda concluído`);
}

async function saveSalesCommissions(commissions: any[]) {
  console.log(
    `[Sync] Iniciando salvamento de ${commissions.length} comissões de venda`
  );

  for (const commission of commissions) {
    try {
      const idContrato = commission.contractId;

      const commissionData = {
        idContrato,
        nomeCorretor: commission.brokerName || commission.corretor || '',
        percentual: commission.percentage || commission.percentual || null,
        valorComissao: commission.commissionValue || commission.valor || 0,
        paga: commission.paid || false,
        dataPagamento: commission.paymentDate
          ? new Date(commission.paymentDate)
          : null,
      };

      await prisma.comissaoVenda.upsert({
        where: { idComissao: commission.id },
        update: commissionData,
        create: {
          idComissao: commission.id,
          ...commissionData,
        },
      });

      console.log(
        `[Sync] Comissão de venda salva: ${commission.brokerName} (ID: ${commission.id})`
      );
    } catch (error) {
      console.error(
        `[Sync] Erro ao salvar comissão de venda ${commission.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(`[Sync] Salvamento de comissões de venda concluído`);
}

async function saveFinancialPlans(plans: any[]) {
  console.log(
    `[Sync] Iniciando salvamento de ${plans.length} planos financeiros`
  );

  for (const plan of plans) {
    try {
      const planData = {
        nomePlano: plan.name || plan.nome || '',
        codigoPlano: plan.code || plan.codigo || null,
        tipo: plan.type || plan.tipo || null,
      };

      await prisma.planoFinanceiro.upsert({
        where: { idPlanoFinanceiro: plan.id },
        update: planData,
        create: {
          idPlanoFinanceiro: plan.id,
          ...planData,
        },
      });

      console.log(
        `[Sync] Plano financeiro salvo: ${plan.name} (ID: ${plan.id})`
      );
    } catch (error) {
      console.error(
        `[Sync] Erro ao salvar plano financeiro ${plan.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(`[Sync] Salvamento de planos financeiros concluído`);
}

async function saveReceivableCarriers(carriers: any[]) {
  console.log(
    `[Sync] Iniciando salvamento de ${carriers.length} portadores de recebimento`
  );

  for (const carrier of carriers) {
    try {
      const carrierData = {
        descricao: carrier.description || carrier.nome || '',
        codigo: carrier.code || carrier.codigo || null,
        ativo: carrier.active !== false,
      };

      await prisma.portadorRecebimento.upsert({
        where: { idPortador: carrier.id },
        update: carrierData,
        create: {
          idPortador: carrier.id,
          ...carrierData,
        },
      });

      console.log(
        `[Sync] Portador de recebimento salvo: ${carrier.description} (ID: ${carrier.id})`
      );
    } catch (error) {
      console.error(
        `[Sync] Erro ao salvar portador de recebimento ${carrier.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(`[Sync] Salvamento de portadores de recebimento concluído`);
}

async function saveIndexers(indexers: any[]) {
  console.log(`[Sync] Iniciando salvamento de ${indexers.length} indexadores`);

  for (const indexer of indexers) {
    try {
      const indexerData = {
        nomeIndexador: indexer.name || indexer.nome || '',
        descricao: indexer.description || indexer.descricao || null,
        periodicidade: indexer.periodicity || indexer.periodicidade || null,
        valorAtual: indexer.currentValue || indexer.valor || null,
      };

      await prisma.indexador.upsert({
        where: { idIndexador: indexer.id },
        update: indexerData,
        create: {
          idIndexador: indexer.id,
          ...indexerData,
        },
      });

      console.log(
        `[Sync] Indexador salvo: ${indexer.name} (ID: ${indexer.id})`
      );
    } catch (error) {
      console.error(
        `[Sync] Erro ao salvar indexador ${indexer.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(`[Sync] Salvamento de indexadores concluído`);
}

export async function POST(request: NextRequest) {
  try {
    const body: SyncRequest = await request.json();
    const { entities = [] } = body;

    // Verificar se existem credenciais salvas
    const credentials = await prisma.apiCredentials.findFirst({
      where: { isActive: true },
    });

    if (!credentials) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Nenhuma credencial configurada. Configure as credenciais primeiro.',
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
          message: 'Erro ao inicializar cliente API. Verifique as credenciais.',
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
        apiCallsMade: 0,
      },
    });

    const results = [];
    let totalProcessed = 0;
    let totalErrors = 0;

    // Processar cada entidade
    for (const entity of entities) {
      try {
        // Mapeamento de entidades para endpoints com fallbacks
        const endpointMap: Record<string, string[]> = {
          customers: ['/customers'],
          companies: ['/companies'],
          projects: [
            '/buildings',
            '/constructions',
            '/empreendimentos',
            '/projects',
          ],
          costCenters: ['/cost-centers', '/departments'],
          // Entidades Financeiras
          receivables: [
            '/receivables',
            '/accounts-receivable',
            '/bills-receivable',
          ],
          payables: ['/payables', '/accounts-payable', '/bills-payable'],
          salesContracts: ['/sales-contracts', '/contracts'],
          salesCommissions: ['/sales-commissions', '/commissions'],
          financialPlans: ['/payment-categories', '/financial-plans'],
          receivableCarriers: ['/receivable-carriers', '/carriers'],
          indexers: ['/indexes', '/indexers'],
        };

        // Filtros de data - buscar apenas dados do último ano
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const dateFilter = oneYearAgo.toISOString().split('T')[0]; // YYYY-MM-DD format

        // Parâmetros específicos por entidade
        const entityParams: Record<string, Record<string, any>> = {
          customers: {
            // Filtrar por data de criação do último ano
            createdAfter: dateFilter,
            // Ordenar por data de criação para paginação consistente
            sort: 'createdAt',
            order: 'asc',
          },
          companies: {
            // Companies geralmente são poucas, não precisa filtro de data
          },
          projects: {
            createdAfter: dateFilter,
            sort: 'createdAt',
            order: 'asc',
          },
          costCenters: {
            // Centros de custo geralmente são poucos
          },
          // Parâmetros para entidades financeiras
          receivables: {
            // Filtrar por data de emissão do último ano
            issueAfter: dateFilter,
            sort: 'issueDate',
            order: 'asc',
          },
          payables: {
            // Filtrar por data de emissão do último ano
            issueAfter: dateFilter,
            sort: 'issueDate',
            order: 'asc',
          },
          salesContracts: {
            // Filtrar por data do contrato do último ano
            contractAfter: dateFilter,
            sort: 'contractDate',
            order: 'asc',
          },
          salesCommissions: {
            // Filtrar por data de criação do último ano
            createdAfter: dateFilter,
            sort: 'createdAt',
            order: 'asc',
          },
          financialPlans: {
            // Planos financeiros são cadastros, geralmente poucos
          },
          receivableCarriers: {
            // Portadores são cadastros, geralmente poucos
          },
          indexers: {
            // Indexadores são cadastros, geralmente poucos
          },
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
            console.log(
              `[Sync API] Tentando endpoint: ${endpoint} para entidade: ${entity}`
            );

            // Configurações de limite baseadas na entidade
            const syncOptions = {
              maxPages:
                entity === 'customers'
                  ? 50
                  : ['receivables', 'payables', 'salesContracts'].includes(
                        entity
                      )
                    ? 100
                    : 50,
              maxRecords:
                entity === 'customers'
                  ? 10000
                  : ['receivables', 'payables'].includes(entity)
                    ? 20000
                    : entity === 'salesContracts'
                      ? 5000
                      : 2000,
              timeoutMs: ['receivables', 'payables'].includes(entity)
                ? 15 * 60 * 1000
                : 10 * 60 * 1000, // Mais tempo para financeiros
            };

            // Combinar parâmetros de filtro com parâmetros da entidade
            const requestParams = {
              ...(entityParams[entity] || {}),
            };

            console.log(`[Sync API] Parâmetros para ${entity}:`, requestParams);

            data = await siengeApiClient.fetchPaginatedData(
              endpoint,
              requestParams,
              syncOptions
            );
            successfulEndpoint = endpoint;
            console.log(
              `[Sync API] Sucesso com endpoint: ${endpoint} - ${data.length} registros`
            );
            break; // Se funcionou, sair do loop
          } catch (error) {
            console.warn(
              `[Sync API] Falha com endpoint: ${endpoint} - ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            );
            lastError =
              error instanceof Error ? error : new Error('Erro desconhecido');
            continue; // Tentar próximo endpoint
          }
        }

        // Se nenhum endpoint funcionou, lançar erro
        if (data.length === 0 && !successfulEndpoint) {
          throw new Error(
            `Todos os endpoints falharam para ${entity}. Último erro: ${lastError?.message}`
          );
        }
        console.log(`[Sync API] Dados obtidos para ${entity}:`, {
          count: data.length,
          sampleData: data.length > 0 ? data[0] : null,
        });

        results.push({
          entity,
          success: true,
          count: data.length,
          endpoint: successfulEndpoint,
          message: `${data.length} registros obtidos via ${successfulEndpoint}`,
        });

        totalProcessed += data.length;

        // Implementar salvamento no banco de dados
        if (data.length > 0) {
          try {
            await saveEntityData(entity, data);
            console.log(
              `[Sync API] Dados salvos no banco para ${entity}: ${data.length} registros`
            );
          } catch (saveError) {
            console.error(
              `[Sync API] Erro ao salvar dados de ${entity}:`,
              saveError
            );
            // Não falhar a sincronização por erro de salvamento
          }
        }
      } catch (error) {
        totalErrors++;

        // Tratamento específico para erro 403 (permissão negada)
        let errorMessage =
          error instanceof Error ? error.message : 'Erro desconhecido';
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
          isPermissionError,
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
        apiCallsMade: entities.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Sincronização concluída',
      results,
      summary: {
        totalProcessed,
        totalInserted: 0,
        totalUpdated: 0,
        totalErrors,
      },
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);

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
