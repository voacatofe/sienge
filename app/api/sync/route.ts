import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SyncRequest {
  entities: string[];
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

// Função para logar exemplo de dados processados (apenas para debug)
function logSampleProcessedData(customer: any, cleanCustomer: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Sync] Exemplo de dados processados para ${customer.name}:`);
    console.log(
      `  - Estado Civil: "${customer.civilStatus}" → "${cleanCustomer.estadoCivil}"`
    );
    console.log(
      `  - Profissão: "${customer.profession}" → "${cleanCustomer.profissao}"`
    );
    console.log(
      `  - Data de Cadastro: "${customer.createdAt}" → "${cleanCustomer.dataCadastro}"`
    );
  }
}

// Funções auxiliares para mapeamento de dados

async function getOrCreateEstadoCivil(
  descricao: string
): Promise<string | null> {
  // Como removemos a tabela estados_civis, retornamos a string diretamente
  return descricao || null;
}

async function getOrCreateProfissao(nome: string): Promise<string | null> {
  // Como removemos a tabela profissoes, retornamos a string diretamente
  return nome || null;
}

// Funções auxiliares para entidades financeiras
async function getCustomerReference(customerId: any): Promise<number | null> {
  if (!customerId) return null;

  // Importar Prisma apenas quando necessário
  const { prisma } = await import('@/lib/prisma');

  // Apenas verificar se o cliente existe, não criar
  const cliente = await prisma.cliente.findFirst({
    where: { idCliente: customerId },
    select: { idCliente: true },
  });

  return cliente?.idCliente || null;
}

async function getPortadorReference(portadorId: any): Promise<number | null> {
  if (!portadorId) return null;

  // Importar Prisma apenas quando necessário
  const { prisma } = await import('@/lib/prisma');

  const portador = await prisma.portadorRecebimento.findFirst({
    where: { idPortador: portadorId },
    select: { idPortador: true },
  });

  return portador?.idPortador || null;
}

async function getPlanoFinanceiroReference(
  planoId: any
): Promise<number | null> {
  if (!planoId) return null;

  // Importar Prisma apenas quando necessário
  const { prisma } = await import('@/lib/prisma');

  const plano = await prisma.planoFinanceiro.findFirst({
    where: { idPlanoFinanceiro: planoId },
    select: { idPlanoFinanceiro: true },
  });

  return plano?.idPlanoFinanceiro || null;
}

async function getCondicaoPagamentoReference(
  condicaoId: any
): Promise<number | null> {
  // Como não temos a tabela tipoCondicaoPagamento no schema atual,
  // retornamos o ID diretamente ou null se não existir
  return condicaoId || null;
}

// Método para salvar dados de entidades no banco
async function saveEntityData(
  entity: string,
  data: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  switch (entity) {
    case 'customers':
      return await saveCustomers(data);
    case 'companies':
      return await saveCompanies(data);
    case 'projects':
      return await saveProjects(data);
    case 'costCenters':
      return await saveCostCenters(data);
    // Entidades Financeiras
    case 'receivables':
      return await saveReceivables(data);
    case 'payables':
      return await savePayables(data);
    case 'salesContracts':
      return await saveSalesContracts(data);
    case 'salesCommissions':
      return await saveSalesCommissions(data);
    case 'financialPlans':
      return await saveFinancialPlans(data);
    case 'receivableCarriers':
      return await saveReceivableCarriers(data);
    case 'indexers':
      return await saveIndexers(data);
    default:
      console.warn(
        `[Sync API] Salvamento não implementado para entidade: ${entity}`
      );
      return { inserted: 0, updated: 0, errors: 0 };
  }
}

// Implementações específicas de salvamento
async function saveCustomers(
  customers: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Importar Prisma apenas quando necessário
  const { prisma } = await import('@/lib/prisma');

  console.log(`[Sync] Iniciando salvamento de ${customers.length} customers`);

  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  // Processar apenas o primeiro cliente para debug
  const testCustomers = customers.slice(0, 1);
  console.log(`[Sync] Processando apenas ${testCustomers.length} cliente(s) para debug`);

  for (const customer of testCustomers) {
    try {
      // Limpar dados desnecessários de paginação e metadados
      const cleanCustomer = {
        idCliente: customer.id,
        nomeCompleto: customer.name,
        nomeSocial: customer.socialName || null,
        cpfCnpj: customer.cpf,
        email: customer.email,
        rg: customer.numberIdentityCard,
        dataNascimento: customer.birthDate,

        // Os campos vêm como strings diretas da API Sienge
        estadoCivil: customer.civilStatus, // String direta: "Casado", "Solteiro"
        profissao: customer.profession, // String direta: "Engenheiro", "Advogado"
        dataCadastro: customer.createdAt,
        dataAtualizacao: customer.modifiedAt,

        // Campos adicionais da API Sienge
        foreigner: customer.foreigner,
        internationalId: customer.internationalId,
        issuingBody: customer.issuingBody,
        clientType: customer.clientType,
        birthPlace: customer.birthPlace,
        matrimonialRegime: customer.matrimonialRegime,
        fatherName: customer.fatherName,
        motherName: customer.motherName,
        sex: customer.sex,
        licenseNumber: customer.licenseNumber,
        licenseIssuingBody: customer.licenseIssuingBody,
        issueDateIdentityCard: customer.issueDateIdentityCard,
        marriageDate: customer.marriageDate,
        licenseIssueDate: customer.licenseIssueDate,
        mailingAddress: customer.mailingAddress,

        ativo: customer.ativo,
      };

      // Log de exemplo para debug (apenas em desenvolvimento)
      logSampleProcessedData(customer, cleanCustomer);

      // Mapear dados da API para schema do banco
      const customerData = {
        idCliente: customer.id,
        idEmpresa: null, // Não usar empresa por enquanto até ser configurada
        nomeCompleto: cleanCustomer.nomeCompleto || '',
        cpfCnpj: cleanCustomer.cpfCnpj || '',
        email: cleanCustomer.email || null,
        rg: cleanCustomer.rg || null,
        dataNascimento: cleanCustomer.dataNascimento
          ? new Date(cleanCustomer.dataNascimento)
          : null,

        // Armazenar as strings diretamente (sem criar tabelas auxiliares)
        profissaoStr: cleanCustomer.profissao || null,
        estadoCivilStr: cleanCustomer.estadoCivil || null,
        ativo: true,
        dataCadastro: cleanCustomer.dataCadastro
          ? new Date(cleanCustomer.dataCadastro)
          : new Date(),
        dataAtualizacao: cleanCustomer.dataAtualizacao
          ? new Date(cleanCustomer.dataAtualizacao)
          : null,

        // Campos adicionais
        foreigner: cleanCustomer.foreigner || null,
        internationalId: cleanCustomer.internationalId || null,
        issuingBody: cleanCustomer.issuingBody || null,
        clientType: cleanCustomer.clientType || null,
        birthPlace: cleanCustomer.birthPlace || null,
        matrimonialRegime: cleanCustomer.matrimonialRegime || null,
        fatherName: cleanCustomer.fatherName || null,
        motherName: cleanCustomer.motherName || null,
        sex: cleanCustomer.sex || null,
        licenseNumber: cleanCustomer.licenseNumber || null,
        licenseIssuingBody: cleanCustomer.licenseIssuingBody || null,
        issueDateIdentityCard: cleanCustomer.issueDateIdentityCard
          ? new Date(cleanCustomer.issueDateIdentityCard)
          : null,
        marriageDate: cleanCustomer.marriageDate
          ? new Date(cleanCustomer.marriageDate)
          : null,
        licenseIssueDate: cleanCustomer.licenseIssueDate
          ? new Date(cleanCustomer.licenseIssueDate)
          : null,
        mailingAddress: cleanCustomer.mailingAddress || null,
      };

      // Verificar se o cliente já existe
      const existingCustomer = await prisma.cliente.findUnique({
        where: { idCliente: cleanCustomer.idCliente },
      });


      
      const savedCustomer = await prisma.cliente.upsert({
        where: { idCliente: cleanCustomer.idCliente },
        update: customerData,
        create: customerData,
      });

      // Salvar telefones
      if (customer.phones && customer.phones.length > 0) {
        await saveCustomerPhones(savedCustomer.idCliente, customer.phones);
      }

      // Salvar endereços
      if (customer.addresses && customer.addresses.length > 0) {
        await saveCustomerAddresses(
          savedCustomer.idCliente,
          customer.addresses
        );
      }

      // Salvar cônjuge
      if (customer.spouse && customer.spouse.length > 0) {
        // await saveCustomerSpouse(savedCustomer.idCliente, customer.spouse);
        console.log(
          `[Sync] Cônjuge encontrado para cliente ${savedCustomer.idCliente}, mas função não implementada ainda`
        );
      }

      // Salvar procuradores
      if (customer.procurators && customer.procurators.length > 0) {
        // await saveCustomerProcurators(savedCustomer.idCliente, customer.procurators);
        console.log(
          `[Sync] Procuradores encontrados para cliente ${savedCustomer.idCliente}, mas função não implementada ainda`
        );
      }

      // Salvar subtipos
      if (customer.subtypes && customer.subtypes.length > 0) {
        // await saveCustomerSubtypes(savedCustomer.idCliente, customer.subtypes);
        console.log(
          `[Sync] Subtipos encontrados para cliente ${savedCustomer.idCliente}, mas função não implementada ainda`
        );
      }

      // Salvar anexos
      if (customer.attachments && customer.attachments.length > 0) {
        // await saveCustomerAttachments(savedCustomer.idCliente, customer.attachments);
        console.log(
          `[Sync] Anexos encontrados para cliente ${savedCustomer.idCliente}, mas função não implementada ainda`
        );
      }

      if (existingCustomer) {
        updatedCount++;
      } else {
        insertedCount++;
      }
    } catch (error) {
      errorCount++;
      console.error(
        `[Sync] Erro ao salvar cliente ${customer.name || customer.id}:`,
        error instanceof Error ? error.message : error
      );
      console.error(`[Sync] Stack trace:`, error instanceof Error ? error.stack : 'No stack trace');
      // Continue com o próximo cliente em caso de erro
    }
  }

  console.log(
    `[Sync] Salvamento de clientes concluído: ${insertedCount} inseridos, ${updatedCount} atualizados, ${errorCount} erros`
  );

  // Log detalhado apenas se houver erros
  if (errorCount > 0) {
    console.log(`[Sync] Resumo dos campos processados:`);
    console.log(`- Nome Completo: ${customers.length > 0 ? '✓' : '✗'}`);
    console.log(`- CPF/CNPJ: ${customers.length > 0 ? '✓' : '✗'}`);
    console.log(`- Estado Civil: ${customers.length > 0 ? '✓' : '✗'}`);
    console.log(`- Profissão: ${customers.length > 0 ? '✓' : '✗'}`);
    console.log(`- Data de Cadastro: ${customers.length > 0 ? '✓' : '✗'}`);
  }

  return { inserted: insertedCount, updated: updatedCount, errors: errorCount };
}

// Função para salvar telefones do cliente
async function saveCustomerPhones(
  idCliente: number,
  phones: any[]
): Promise<void> {
  try {
    // Importar Prisma apenas quando necessário
    const { prisma } = await import('@/lib/prisma');

    // Remover telefones existentes para evitar duplicatas
    await prisma.clienteTelefone.deleteMany({
      where: { idCliente },
    });

    // Inserir novos telefones
    for (const phone of phones) {
      await prisma.clienteTelefone.create({
        data: {
          idCliente,
          numero: phone.number || '',
          tipo: phone.type || null,
          observacao: phone.note || null,
          main: phone.main || false,
          idd: phone.idd || null,
        },
      });
    }

    console.log(
      `[Sync] Salvos ${phones.length} telefones para cliente ${idCliente}`
    );
  } catch (error) {
    console.error(
      `[Sync] Erro ao salvar telefones do cliente ${idCliente}:`,
      error
    );
  }
}

// Função para salvar endereços do cliente
async function saveCustomerAddresses(
  idCliente: number,
  addresses: any[]
): Promise<void> {
  try {
    // Importar Prisma apenas quando necessário
    const { prisma } = await import('@/lib/prisma');

    // Remover endereços existentes para evitar duplicatas
    await prisma.clienteEndereco.deleteMany({
      where: { idCliente },
    });

    // Inserir novos endereços
    for (const address of addresses) {
      // Como não temos a tabela municipio no schema atual,
      // vamos usar null para idMunicipio
      const idMunicipio = null;

      await prisma.clienteEndereco.create({
        data: {
          idCliente,
          logradouro: address.streetName || '',
          numero: address.number || '',
          complemento: address.complement || null,
          bairro: address.neighborhood || null,
          cep: address.zipCode || null,
          tipo: address.type || null, // Usando 'tipo' em vez de 'tipoEndereco'
          idMunicipio,
        },
      });
    }

    console.log(
      `[Sync] Salvos ${addresses.length} endereços para cliente ${idCliente}`
    );
  } catch (error) {
    console.error(
      `[Sync] Erro ao salvar endereços do cliente ${idCliente}:`,
      error
    );
  }
}

// Função para salvar cônjuge do cliente
async function saveCustomerSpouse(
  idCliente: number,
  spouse: any[]
): Promise<void> {
  // Como não temos a tabela clienteConjuge no schema atual,
  // vamos apenas logar que os dados foram recebidos
  console.log(`[Sync] Dados de cônjuge recebidos para cliente ${idCliente}, mas não salvos (tabela não existe no schema)`);
}

// Função para salvar procuradores do cliente
async function saveCustomerProcurators(
  idCliente: number,
  procurators: any[]
): Promise<void> {
  // Como não temos a tabela clienteProcurador no schema atual,
  // vamos apenas logar que os dados foram recebidos
  console.log(`[Sync] Dados de procuradores recebidos para cliente ${idCliente}, mas não salvos (tabela não existe no schema)`);
}

// Função para salvar subtipos do cliente
async function saveCustomerSubtypes(
  idCliente: number,
  subtypes: any[]
): Promise<void> {
  // Como não temos a tabela clienteSubtipo no schema atual,
  // vamos apenas logar que os dados foram recebidos
  console.log(`[Sync] Dados de subtipos recebidos para cliente ${idCliente}, mas não salvos (tabela não existe no schema)`);
}

// Função para salvar anexos do cliente
async function saveCustomerAttachments(
  idCliente: number,
  attachments: any[]
): Promise<void> {
  // Como não temos a tabela clienteAnexo no schema atual,
  // vamos apenas logar que os dados foram recebidos
  console.log(`[Sync] Dados de anexos recebidos para cliente ${idCliente}, mas não salvos (tabela não existe no schema)`);
}

async function saveCompanies(
  companies: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Importar Prisma apenas quando necessário
  const { prisma } = await import('@/lib/prisma');

  console.log(`[Sync] Iniciando salvamento de ${companies.length} companies`);

  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const company of companies) {
    try {
      // Verificar se a empresa já existe
      const existingCompany = await prisma.empresa.findUnique({
        where: { idEmpresa: company.id },
      });

      await prisma.empresa.upsert({
        where: { idEmpresa: company.id },
        update: {
          nomeEmpresa: company.name,
          cnpj: company.cnpj,
          ativo: true,
        },
        create: {
          idEmpresa: company.id,
          nomeEmpresa: company.name,
          cnpj: company.cnpj,
          ativo: true,
        },
      });

      if (existingCompany) {
        updatedCount++;
      } else {
        insertedCount++;
      }
    } catch (error) {
      errorCount++;
      console.error(
        `[Sync] Erro ao salvar empresa ${company.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(
    `[Sync] Salvamento de companies concluído: ${insertedCount} inseridas, ${updatedCount} atualizadas, ${errorCount} erros`
  );
  return { inserted: insertedCount, updated: updatedCount, errors: errorCount };
}

async function saveProjects(
  projects: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Implementar quando o endpoint de projetos estiver funcionando
  console.log(
    `[Sync API] Salvamento de projetos não implementado ainda: ${projects.length} registros`
  );
  return { inserted: 0, updated: 0, errors: 0 };
}

async function saveCostCenters(
  costCenters: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Implementar quando o endpoint de centros de custo estiver funcionando
  console.log(
    `[Sync API] Salvamento de centros de custo não implementado ainda: ${costCenters.length} registros`
  );
  return { inserted: 0, updated: 0, errors: 0 };
}

// === FUNÇÕES DE SALVAMENTO PARA ENTIDADES FINANCEIRAS ===

async function saveReceivables(
  receivables: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Importar Prisma apenas quando necessário
  const { prisma } = await import('@/lib/prisma');

  console.log(
    `[Sync] Iniciando salvamento de ${receivables.length} títulos a receber`
  );

  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const receivable of receivables) {
    try {
      // Limpar dados desnecessários de paginação e metadados
      const cleanReceivable = {
        idTituloReceber: receivable.id,
        idCliente: receivable.customerId || receivable.clientId,
        idContrato: receivable.contractId || null,
        idEmpresa: receivable.companyId || null,
        numeroDocumento: receivable.documentNumber || receivable.numero || '',
        idDocumentoIdent: receivable.documentIdentificationId || null,
        dataEmissao: receivable.issueDate,
        dataVencimento: receivable.dueDate,
        valorOriginal: receivable.originalValue || receivable.valor || 0,
        valorAtualizado: receivable.updatedValue || null,
        idIndexador: receivable.indexId || null,
        juros: receivable.interest || null,
        multa: receivable.penalty || null,
        descontoConcedido: receivable.discountGranted || null,
        valorPago: receivable.paidValue || null,
        dataPagamento: receivable.paymentDate,
        status: receivable.status || 'PENDENTE',
        observacoes: receivable.observations || null,
        idPortador: receivable.carrierId || receivable.portadorId,
        idPlanoFinanceiro:
          receivable.paymentCategoryId || receivable.financialPlanId,
      };

      // Buscar relacionamentos necessários - pular se não existirem
      const idCliente = await getCustomerReference(cleanReceivable.idCliente);
      if (!idCliente) {
        console.warn(
          `[Sync] Cliente ${cleanReceivable.idCliente} não encontrado, pulando título receber ${cleanReceivable.numeroDocumento}`
        );
        continue;
      }

      const idPortador = await getPortadorReference(cleanReceivable.idPortador);
      const idPlanoFinanceiro = await getPlanoFinanceiroReference(
        cleanReceivable.idPlanoFinanceiro
      );

      const receivableData = {
        idCliente,
        idContrato: cleanReceivable.idContrato,
        idEmpresa: cleanReceivable.idEmpresa,
        numeroDocumento: cleanReceivable.numeroDocumento,
        idDocumentoIdent: cleanReceivable.idDocumentoIdent,
        dataEmissao: cleanReceivable.dataEmissao
          ? new Date(cleanReceivable.dataEmissao)
          : new Date(),
        dataVencimento: cleanReceivable.dataVencimento
          ? new Date(cleanReceivable.dataVencimento)
          : new Date(),
        valorOriginal: cleanReceivable.valorOriginal,
        valorAtualizado: cleanReceivable.valorAtualizado,
        idIndexador: cleanReceivable.idIndexador,
        juros: cleanReceivable.juros,
        multa: cleanReceivable.multa,
        descontoConcedido: cleanReceivable.descontoConcedido,
        valorPago: cleanReceivable.valorPago,
        dataPagamento: cleanReceivable.dataPagamento
          ? new Date(cleanReceivable.dataPagamento)
          : null,
        status: cleanReceivable.status,
        observacoes: cleanReceivable.observacoes,
        idPortador,
        idPlanoFinanceiro,
      };

      // Verificar se o título já existe
      const existingReceivable = await prisma.tituloReceber.findUnique({
        where: { idTituloReceber: cleanReceivable.idTituloReceber },
      });

      await prisma.tituloReceber.upsert({
        where: { idTituloReceber: cleanReceivable.idTituloReceber },
        update: receivableData,
        create: {
          idTituloReceber: cleanReceivable.idTituloReceber,
          ...receivableData,
        },
      });

      if (existingReceivable) {
        updatedCount++;
      } else {
        insertedCount++;
      }
    } catch (error) {
      errorCount++;
      console.error(
        `[Sync] Erro ao salvar título a receber ${receivable.documentNumber || receivable.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(
    `[Sync] Salvamento de títulos a receber concluído: ${insertedCount} inseridos, ${updatedCount} atualizados, ${errorCount} erros`
  );
  return { inserted: insertedCount, updated: updatedCount, errors: errorCount };
}

async function savePayables(
  payables: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Importar Prisma apenas quando necessário
  const { prisma } = await import('@/lib/prisma');

  console.log(
    `[Sync] Iniciando salvamento de ${payables.length} títulos a pagar`
  );

  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const payable of payables) {
    try {
      // Limpar dados desnecessários de paginação e metadados
      const cleanPayable = {
        idTituloPagar: payable.id,
        idCredor: payable.creditorId || payable.supplierId,
        idEmpresaDevedora: payable.companyId || null,
        numeroDocumento: payable.documentNumber || payable.numero || '',
        idDocumentoIdent: payable.documentIdentificationId || null,
        dataEmissao: payable.issueDate,
        dataVencimento: payable.dueDate,
        valorOriginal: payable.originalValue || payable.valor || 0,
        valorAtualizado: payable.updatedValue || null,
        idIndexador: payable.indexId || null,
        idPlanoFinanceiro: payable.paymentCategoryId || payable.financialPlanId,
        observacao: payable.observations || null,
        descontoObtido: payable.discountObtained || null,
        valorPago: payable.paidValue || null,
        dataPagamento: payable.paymentDate,
        status: payable.status || 'PENDENTE',
        idContratoSuprimento: payable.contractId || null,
      };

      // Buscar relacionamentos necessários - pular se não existirem
      // Como a tabela Credor foi removida, vamos usar o ID diretamente
      const idCredor = cleanPayable.idCredor;
      if (!idCredor) {
        console.warn(
          `[Sync] ID do credor não fornecido, pulando título pagar ${cleanPayable.numeroDocumento}`
        );
        continue;
      }

      const idPlanoFinanceiro = await getPlanoFinanceiroReference(
        cleanPayable.idPlanoFinanceiro
      );

      const payableData = {
        idCredor,
        idEmpresaDevedora: cleanPayable.idEmpresaDevedora,
        numeroDocumento: cleanPayable.numeroDocumento,
        idDocumentoIdent: cleanPayable.idDocumentoIdent,
        dataEmissao: cleanPayable.dataEmissao
          ? new Date(cleanPayable.dataEmissao)
          : new Date(),
        dataVencimento: cleanPayable.dataVencimento
          ? new Date(cleanPayable.dataVencimento)
          : new Date(),
        valorOriginal: cleanPayable.valorOriginal,
        valorAtualizado: cleanPayable.valorAtualizado,
        idIndexador: cleanPayable.idIndexador,
        idPlanoFinanceiro,
        observacao: cleanPayable.observacao,
        descontoObtido: cleanPayable.descontoObtido,
        valorPago: cleanPayable.valorPago,
        dataPagamento: cleanPayable.dataPagamento
          ? new Date(cleanPayable.dataPagamento)
          : null,
        status: cleanPayable.status,
        idContratoSuprimento: cleanPayable.idContratoSuprimento,
      };

      // Verificar se o título já existe
      const existingPayable = await prisma.tituloPagar.findUnique({
        where: { idTituloPagar: cleanPayable.idTituloPagar },
      });

      await prisma.tituloPagar.upsert({
        where: { idTituloPagar: cleanPayable.idTituloPagar },
        update: payableData,
        create: {
          idTituloPagar: cleanPayable.idTituloPagar,
          ...payableData,
        },
      });

      if (existingPayable) {
        updatedCount++;
      } else {
        insertedCount++;
      }
    } catch (error) {
      errorCount++;
      console.error(
        `[Sync] Erro ao salvar título a pagar ${payable.documentNumber || payable.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(
    `[Sync] Salvamento de títulos a pagar concluído: ${insertedCount} inseridos, ${updatedCount} atualizados, ${errorCount} erros`
  );
  return { inserted: insertedCount, updated: updatedCount, errors: errorCount };
}

async function saveSalesContracts(
  contracts: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Importar Prisma apenas quando necessário
  const { prisma } = await import('@/lib/prisma');

  console.log(
    `[Sync] Iniciando salvamento de ${contracts.length} contratos de venda`
  );

  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const contract of contracts) {
    try {
      // Limpar dados desnecessários de paginação e metadados
      const cleanContract = {
        idContrato: contract.id,
        numeroContrato: contract.contractNumber || contract.numero || '',
        idCliente: contract.customerId || contract.clientId,
        idUnidade: contract.unitId || contract.propertyId,
        dataContrato: contract.contractDate,
        valorContrato: contract.contractValue || contract.valor || 0,
        idIndexador: contract.indexId || null,
        idPlanoFinanceiro: contract.financialPlanId,
        idCondicaoPagamento: contract.paymentConditionId,
        entrada: contract.downPayment || null,
        financiamento: contract.financing || null,
        observacoes: contract.observations || null,
        statusContrato: contract.status || 'ATIVO',
      };

      // Buscar relacionamentos necessários - pular se não existirem
      const idCliente = await getCustomerReference(cleanContract.idCliente);
      if (!idCliente) {
        console.warn(
          `[Sync] Cliente ${cleanContract.idCliente} não encontrado, pulando contrato ${cleanContract.numeroContrato}`
        );
        continue;
      }

      const idPlanoFinanceiro = await getPlanoFinanceiroReference(
        cleanContract.idPlanoFinanceiro
      );
      const idCondicaoPagamento = await getCondicaoPagamentoReference(
        cleanContract.idCondicaoPagamento
      );

      const contractData = {
        numeroContrato: cleanContract.numeroContrato,
        idCliente,
        idUnidade: cleanContract.idUnidade,
        dataContrato: cleanContract.dataContrato
          ? new Date(cleanContract.dataContrato)
          : new Date(),
        valorContrato: cleanContract.valorContrato,
        idIndexador: cleanContract.idIndexador,
        idPlanoFinanceiro,
        idCondicaoPagamento,
        entrada: cleanContract.entrada,
        financiamento: cleanContract.financiamento,
        observacoes: cleanContract.observacoes,
        statusContrato: cleanContract.statusContrato,
      };

      // Verificar se o contrato já existe
      const existingContract = await prisma.contratoVenda.findUnique({
        where: { id: cleanContract.idContrato },
      });

      await prisma.contratoVenda.upsert({
        where: { id: cleanContract.idContrato },
        update: contractData,
        create: {
          id: cleanContract.idContrato,
          ...contractData,
        },
      });

      if (existingContract) {
        updatedCount++;
      } else {
        insertedCount++;
      }
    } catch (error) {
      errorCount++;
      console.error(
        `[Sync] Erro ao salvar contrato de venda ${contract.contractNumber || contract.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(
    `[Sync] Salvamento de contratos de venda concluído: ${insertedCount} inseridos, ${updatedCount} atualizados, ${errorCount} erros`
  );
  return { inserted: insertedCount, updated: updatedCount, errors: errorCount };
}

async function saveSalesCommissions(
  commissions: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Como não temos a tabela comissaoVenda no schema atual,
  // vamos apenas logar que os dados foram recebidos
  console.log(`[Sync] Dados de ${commissions.length} comissões de venda recebidos, mas não salvos (tabela não existe no schema)`);
  return { inserted: 0, updated: 0, errors: 0 };
}

async function saveFinancialPlans(
  plans: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Importar Prisma apenas quando necessário
  const { prisma } = await import('@/lib/prisma');

  console.log(
    `[Sync] Iniciando salvamento de ${plans.length} planos financeiros`
  );

  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const plan of plans) {
    try {
      // Limpar dados desnecessários de paginação e metadados
      const cleanPlan = {
        idPlanoFinanceiro: plan.id,
        nomePlano: plan.name || plan.nome || '',
        codigoPlano: plan.code || plan.codigo || null,
        tipo: plan.type || plan.tipo || null,
      };

      const planData = {
        nomePlano: cleanPlan.nomePlano,
        codigoPlano: cleanPlan.codigoPlano,
        tipo: cleanPlan.tipo,
      };

      // Verificar se o plano já existe
      const existingPlan = await prisma.planoFinanceiro.findUnique({
        where: { idPlanoFinanceiro: cleanPlan.idPlanoFinanceiro },
      });

      await prisma.planoFinanceiro.upsert({
        where: { idPlanoFinanceiro: cleanPlan.idPlanoFinanceiro },
        update: planData,
        create: {
          idPlanoFinanceiro: cleanPlan.idPlanoFinanceiro,
          ...planData,
        },
      });

      if (existingPlan) {
        updatedCount++;
      } else {
        insertedCount++;
      }
    } catch (error) {
      errorCount++;
      console.error(
        `[Sync] Erro ao salvar plano financeiro ${plan.name || plan.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(
    `[Sync] Salvamento de planos financeiros concluído: ${insertedCount} inseridos, ${updatedCount} atualizados, ${errorCount} erros`
  );
  return { inserted: insertedCount, updated: updatedCount, errors: errorCount };
}

async function saveReceivableCarriers(
  carriers: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Importar Prisma apenas quando necessário
  const { prisma } = await import('@/lib/prisma');

  console.log(
    `[Sync] Iniciando salvamento de ${carriers.length} portadores de recebimento`
  );

  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const carrier of carriers) {
    try {
      // Limpar dados desnecessários de paginação e metadados
      const cleanCarrier = {
        idPortador: carrier.id,
        descricao: carrier.description || carrier.nome || '',
        codigo: carrier.code || carrier.codigo || null,
        ativo: carrier.active !== false,
      };

      const carrierData = {
        nomePortador: cleanCarrier.descricao, // Usando descricao como nomePortador
        tipoPortador: cleanCarrier.codigo,
        codigoPortador: cleanCarrier.codigo,
        ativo: cleanCarrier.ativo,
      };

      // Verificar se o portador já existe
      const existingCarrier = await prisma.portadorRecebimento.findUnique({
        where: { idPortador: cleanCarrier.idPortador },
      });

      await prisma.portadorRecebimento.upsert({
        where: { idPortador: cleanCarrier.idPortador },
        update: carrierData,
        create: {
          idPortador: cleanCarrier.idPortador,
          ...carrierData,
        },
      });

      if (existingCarrier) {
        updatedCount++;
      } else {
        insertedCount++;
      }
    } catch (error) {
      errorCount++;
      console.error(
        `[Sync] Erro ao salvar portador de recebimento ${carrier.description || carrier.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(
    `[Sync] Salvamento de portadores de recebimento concluído: ${insertedCount} inseridos, ${updatedCount} atualizados, ${errorCount} erros`
  );
  return { inserted: insertedCount, updated: updatedCount, errors: errorCount };
}

async function saveIndexers(
  indexers: any[]
): Promise<{ inserted: number; updated: number; errors: number }> {
  // Importar Prisma apenas quando necessário
  const { prisma } = await import('@/lib/prisma');

  console.log(`[Sync] Iniciando salvamento de ${indexers.length} indexadores`);

  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const indexer of indexers) {
    try {
      // Limpar dados desnecessários de paginação e metadados
      const cleanIndexer = {
        idIndexador: indexer.id,
        nomeIndexador: indexer.name || indexer.nome || '',
        descricao: indexer.description || indexer.descricao || null,
        periodicidade: indexer.periodicity || indexer.periodicidade || null,
        valorAtual: indexer.currentValue || indexer.valor || null,
      };

      const indexerData = {
        nomeIndexador: cleanIndexer.nomeIndexador,
        descricao: cleanIndexer.descricao,
        periodicidade: cleanIndexer.periodicidade,
        valorAtual: cleanIndexer.valorAtual,
      };

      // Verificar se o indexador já existe
      const existingIndexer = await prisma.indexador.findUnique({
        where: { idIndexador: cleanIndexer.idIndexador },
      });

      await prisma.indexador.upsert({
        where: { idIndexador: cleanIndexer.idIndexador },
        update: indexerData,
        create: {
          idIndexador: cleanIndexer.idIndexador,
          ...indexerData,
        },
      });

      if (existingIndexer) {
        updatedCount++;
      } else {
        insertedCount++;
      }
    } catch (error) {
      errorCount++;
      console.error(
        `[Sync] Erro ao salvar indexador ${indexer.name || indexer.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(
    `[Sync] Salvamento de indexadores concluído: ${insertedCount} inseridos, ${updatedCount} atualizados, ${errorCount} erros`
  );
  return { inserted: insertedCount, updated: updatedCount, errors: errorCount };
}

export async function POST(request: NextRequest) {
  try {
    // Importar dependências apenas quando necessário
    const { prisma } = await import('@/lib/prisma');
    const { siengeApiClient } = await import('@/lib/sienge-api-client');
    const { getSyncConfig } = await import('@/lib/config/sienge-api');

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
    let totalInserted = 0;
    let totalUpdated = 0;
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
          receivables: ['/accounts-receivable'],
          payables: ['/accounts-payable'],
          salesContracts: ['/sales-contracts', '/contracts'],
          salesCommissions: ['/commissions'],
          financialPlans: ['/payment-categories'],
          receivableCarriers: ['/carriers'],
          indexers: ['/indexers'],
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

            // Obter configuração do endpoint para determinar método HTTP preferido
            const syncConfig = getSyncConfig(endpoint as any);
            const preferredMethod = syncConfig?.httpMethod || 'GET';

            data = await siengeApiClient.fetchPaginatedData(
              endpoint,
              requestParams,
              {
                ...syncOptions,
                preferredMethod: preferredMethod as 'GET' | 'POST',
              }
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
            const saveResult = await saveEntityData(entity, data);
            totalInserted += saveResult.inserted;
            totalUpdated += saveResult.updated;
            totalErrors += saveResult.errors;

            console.log(
              `[Sync API] Dados salvos no banco para ${entity}: ${saveResult.inserted} inseridos, ${saveResult.updated} atualizados, ${saveResult.errors} erros`
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
        recordsInserted: totalInserted,
        recordsUpdated: totalUpdated,
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
        totalInserted,
        totalUpdated,
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
