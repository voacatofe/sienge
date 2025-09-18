-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."api_credentials" (
    "id" SERIAL NOT NULL,
    "subdomain" TEXT NOT NULL,
    "api_user" TEXT NOT NULL,
    "api_password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "api_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sync_logs" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "syncStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncCompletedAt" TIMESTAMP(3),
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "recordsInserted" INTEGER NOT NULL DEFAULT 0,
    "recordsUpdated" INTEGER NOT NULL DEFAULT 0,
    "recordsErrors" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "apiCallsMade" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."empresas" (
    "idEmpresa" INTEGER NOT NULL,
    "nomeEmpresa" TEXT NOT NULL,
    "cnpj" TEXT,
    "inscricaoEstadual" TEXT,
    "inscricaoMunicipal" TEXT,
    "endereco" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "site" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3),

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("idEmpresa")
);

-- CreateTable
CREATE TABLE "public"."clientes" (
    "idCliente" INTEGER NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "nomeSocial" TEXT,
    "cpfCnpj" TEXT,
    "rg" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "nacionalidade" TEXT,
    "email" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idEmpresa" INTEGER,
    "estadoCivilStr" TEXT,
    "profissaoStr" TEXT,
    "foreigner" TEXT,
    "sex" TEXT,
    "birthPlace" TEXT,
    "clientType" TEXT,
    "dataAtualizacao" TIMESTAMP(3),
    "fatherName" TEXT,
    "internationalId" TEXT,
    "issueDateIdentityCard" TIMESTAMP(3),
    "issuingBody" TEXT,
    "licenseIssueDate" TIMESTAMP(3),
    "licenseIssuingBody" TEXT,
    "licenseNumber" TEXT,
    "mailingAddress" TEXT,
    "marriageDate" TIMESTAMP(3),
    "matrimonialRegime" TEXT,
    "motherName" TEXT,
    "cityRegistrationNumber" TEXT,
    "cnaeNumber" TEXT,
    "contactName" TEXT,
    "creaNumber" TEXT,
    "establishmentDate" TIMESTAMP(3),
    "fantasyName" TEXT,
    "note" TEXT,
    "site" TEXT,
    "shareCapital" DECIMAL(65,30),
    "stateRegistrationNumber" TEXT,
    "technicalManager" TEXT,
    "personType" TEXT,
    "activityId" INTEGER,
    "activityDescription" TEXT,
    "telefone_principal" TEXT,
    "telefone_principal_tipo" TEXT,
    "total_telefones" INTEGER DEFAULT 0,
    "endereco_principal" TEXT,
    "cidade_principal" TEXT,
    "estado_principal" TEXT,
    "cep_principal" TEXT,
    "total_enderecos" INTEGER DEFAULT 0,
    "tem_conjuge" BOOLEAN DEFAULT false,
    "nome_conjuge" TEXT,
    "cpf_conjuge" TEXT,
    "phones" JSONB,
    "addresses" JSONB,
    "procurators" JSONB,
    "contacts" JSONB,
    "subTypes" JSONB,
    "spouse" JSONB,
    "familyIncome" JSONB,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("idCliente")
);

-- CreateTable
CREATE TABLE "public"."contratos_venda" (
    "id" INTEGER NOT NULL,
    "companyId" INTEGER,
    "internalCompanyId" INTEGER,
    "companyName" TEXT,
    "enterpriseId" INTEGER,
    "internalEnterpriseId" INTEGER,
    "enterpriseName" TEXT,
    "receivableBillId" INTEGER,
    "cancellationPayableBillId" INTEGER,
    "contractDate" TIMESTAMP(3),
    "issueDate" TIMESTAMP(3),
    "accountingDate" TIMESTAMP(3),
    "expectedDeliveryDate" TIMESTAMP(3),
    "keysDeliveredAt" TIMESTAMP(3),
    "number" TEXT,
    "externalId" TEXT,
    "correctionType" TEXT,
    "situation" TEXT,
    "discountType" TEXT,
    "discountPercentage" DECIMAL(65,30),
    "value" DECIMAL(65,30),
    "totalSellingValue" DECIMAL(65,30),
    "cancellationDate" TIMESTAMP(3),
    "totalCancellationAmount" DECIMAL(65,30),
    "cancellationReason" TEXT,
    "financialInstitutionNumber" TEXT,
    "financialInstitutionDate" TIMESTAMP(3),
    "proRataIndexer" INTEGER,
    "interestType" TEXT,
    "interestPercentage" DECIMAL(65,30),
    "fineRate" DECIMAL(65,30),
    "lateInterestCalculationType" TEXT,
    "dailyLateInterestValue" DECIMAL(65,30),
    "containsRemadeInstallments" BOOLEAN,
    "specialClause" TEXT,
    "data_criacao_sienge" TIMESTAMP(3),
    "data_ultima_atualizacao_sienge" TIMESTAMP(3),
    "salesContractCustomers" JSONB,
    "cliente_principal_nome" TEXT,
    "cliente_principal_id" INTEGER,
    "total_clientes" INTEGER,
    "cliente_principal_participacao" DECIMAL(65,30),
    "tipo_contrato_cliente" TEXT,
    "salesContractUnits" JSONB,
    "paymentConditions" JSONB,
    "valor_total_contrato" DECIMAL(65,30),
    "valor_total_pago" DECIMAL(65,30),
    "saldo_devedor_total" DECIMAL(65,30),
    "total_condicoes_pagamento" INTEGER,
    "total_parcelas_contrato" INTEGER,
    "parcelas_pagas_contrato" INTEGER,
    "forma_pagamento_principal" TEXT,
    "indexador_principal" TEXT,
    "tem_financiamento" BOOLEAN,
    "percentual_pago" DECIMAL(65,30),
    "brokers" JSONB,
    "linkedCommissions" JSONB,
    "tem_comissao" BOOLEAN,
    "id_contrato_comissao" INTEGER,
    "total_comissoes" INTEGER,
    "valor_total_comissao" DECIMAL(65,30),
    "faixa_valor_comissao" TEXT,
    "percentual_comissao_sobre_contrato" DECIMAL(65,30),
    "links" JSONB,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3),

    CONSTRAINT "contratos_venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."empreendimentos" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "nomeComercial" TEXT,
    "observacaoEmpreendimento" TEXT,
    "cnpj" TEXT,
    "tipo" TEXT,
    "endereco" TEXT,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3),
    "criadoPor" TEXT,
    "modificadoPor" TEXT,
    "idEmpresa" INTEGER,
    "nomeEmpresa" TEXT,
    "idBaseCustos" INTEGER,
    "descricaoBaseCustos" TEXT,
    "idTipoObra" INTEGER,
    "descricaoTipoObra" TEXT,

    CONSTRAINT "empreendimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."unidades" (
    "id" INTEGER NOT NULL,
    "idEmpreendimento" INTEGER,
    "idContrato" INTEGER,
    "idIndexador" INTEGER,
    "nome" TEXT NOT NULL,
    "tipoImovel" TEXT,
    "observacao" TEXT,
    "estoqueComercial" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "matricula" TEXT,
    "dataEntrega" TIMESTAMP(3),
    "areaPrivativa" DECIMAL(65,30),
    "areaComum" DECIMAL(65,30),
    "areaTerreno" DECIMAL(65,30),
    "areaComumNaoProporcional" DECIMAL(65,30),
    "fracaoIdeal" DECIMAL(65,30),
    "fracaoIdealM2" DECIMAL(65,30),
    "fracaoVGV" DECIMAL(65,30),
    "quantidadeIndexada" DECIMAL(65,30),
    "adimplenciaPremiada" DECIMAL(65,30),
    "valorTerreno" DECIMAL(65,30),
    "pavimento" TEXT,
    "numeroContrato" TEXT,
    "areaUtil" DECIMAL(65,30),
    "valorIPTU" DECIMAL(65,30),
    "inscricaoImobiliaria" TEXT,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3),
    "scheduledDeliveryDate" TIMESTAMP(3),
    "total_unidades_filhas" INTEGER DEFAULT 0,
    "principal_unidade_filha" TEXT,
    "principal_unidade_filha_id" INTEGER,
    "total_agrupamentos" INTEGER DEFAULT 0,
    "agrupamento_principal" TEXT,
    "tipo_agrupamento_principal" TEXT,
    "total_valores_especiais" INTEGER DEFAULT 0,
    "valor_especial_total" DECIMAL(65,30) DEFAULT 0,
    "tipo_valor_especial_principal" TEXT,
    "total_links" INTEGER DEFAULT 0,
    "link_principal_tipo" TEXT,
    "link_principal_url" TEXT,
    "childunits" JSONB,
    "groupings" JSONB,
    "specialvalues" JSONB,
    "links" JSONB,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."webhooks" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "token" TEXT,
    "events" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contrato_clientes" (
    "id" SERIAL NOT NULL,
    "contrato_id" INTEGER NOT NULL,
    "cliente_sienge_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "is_spouse" BOOLEAN NOT NULL DEFAULT false,
    "participacao_percentual" DECIMAL(65,30),
    "ordem_no_contrato" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contrato_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contrato_unidades" (
    "id" SERIAL NOT NULL,
    "contrato_id" INTEGER NOT NULL,
    "unidade_sienge_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "participacao_percentual" DECIMAL(65,30),
    "tipo_unidade" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contrato_unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contrato_condicoes_pagamento" (
    "id" SERIAL NOT NULL,
    "contrato_id" INTEGER NOT NULL,
    "ordem_condicao" INTEGER NOT NULL,
    "tipo_condicao_id" TEXT,
    "tipo_condicao_nome" TEXT,
    "sequence_id" INTEGER,
    "order_number" INTEGER,
    "indexador_id" INTEGER,
    "indexador_nome" TEXT,
    "valor_total" DECIMAL(65,30),
    "valor_pago" DECIMAL(65,30),
    "saldo_devedor" DECIMAL(65,30),
    "valor_total_juros" DECIMAL(65,30),
    "numero_parcelas" INTEGER,
    "parcelas_abertas" INTEGER,
    "data_primeiro_pagamento" TIMESTAMP(3),
    "data_base" TIMESTAMP(3),
    "data_base_juros" TIMESTAMP(3),
    "percentual_juros" DECIMAL(65,30),
    "tipo_juros" TEXT,
    "periodo_carencia_meses" INTEGER,
    "status" TEXT,
    "status_condicao" TEXT,
    "pago_antes_aditivo" BOOLEAN,
    "portador_id" INTEGER,
    "portador_nome" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contrato_condicoes_pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cliente_telefones" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "ordem_telefone" INTEGER NOT NULL,
    "tipo" TEXT,
    "numero" TEXT,
    "codigo_pais" TEXT,
    "principal" BOOLEAN DEFAULT false,
    "observacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_telefones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cliente_enderecos" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "ordem_endereco" INTEGER NOT NULL,
    "tipo" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "codigo_cidade" INTEGER,
    "endereco_correspondencia" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cliente_procuradores" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "ordem_procurador" INTEGER NOT NULL,
    "nome" TEXT,
    "cpf" TEXT,
    "tipo" TEXT,
    "observacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_procuradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cliente_contatos" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "ordem_contato" INTEGER NOT NULL,
    "nome" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "tipo" TEXT,
    "observacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_contatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cliente_subtipos" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "ordem_subtipo" INTEGER NOT NULL,
    "subtipo" TEXT,
    "descricao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_subtipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cliente_renda_familiar" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "ordem_renda" INTEGER NOT NULL,
    "nome_parente" TEXT,
    "parentesco" TEXT,
    "valor_renda" DECIMAL(65,30),
    "observacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_renda_familiar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."unidade_filhas" (
    "id" SERIAL NOT NULL,
    "unidade_pai_id" INTEGER NOT NULL,
    "ordem_filha" INTEGER NOT NULL,
    "unidade_filha_id" INTEGER,
    "nome_unidade_filha" TEXT,
    "tipo_unidade_filha" TEXT,
    "area_unidade_filha" DECIMAL(65,30),
    "status_unidade_filha" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unidade_filhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."unidade_agrupamentos" (
    "id" SERIAL NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "ordem_agrupamento" INTEGER NOT NULL,
    "tipo_agrupamento" TEXT,
    "nome_agrupamento" TEXT,
    "descricao_agrupamento" TEXT,
    "codigo_agrupamento" TEXT,
    "nivel_hierarquia" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unidade_agrupamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."unidade_valores_especiais" (
    "id" SERIAL NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "ordem_valor" INTEGER NOT NULL,
    "tipo_valor" TEXT,
    "nome_valor" TEXT,
    "valor_monetario" DECIMAL(65,30),
    "moeda" TEXT DEFAULT 'BRL',
    "descricao_valor" TEXT,
    "data_referencia" TIMESTAMP(3),
    "status_valor" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unidade_valores_especiais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."unidade_links" (
    "id" SERIAL NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "ordem_link" INTEGER NOT NULL,
    "rel" TEXT,
    "href" TEXT,
    "tipo_link" TEXT,
    "descricao_link" TEXT,
    "ativo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unidade_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."portadores" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "portadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."credores" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "nome_fantasia" TEXT,
    "cpf" TEXT,
    "cnpj" TEXT,
    "fornecedor" TEXT,
    "corretor" TEXT,
    "funcionario" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "inscricao_estadual" TEXT,
    "tipo_inscricao_estadual" TEXT,
    "tipo_pagamento_id" INTEGER,
    "endereco_cidade_id" INTEGER,
    "endereco_cidade_nome" TEXT,
    "endereco_rua" TEXT,
    "endereco_numero" TEXT,
    "endereco_complemento" TEXT,
    "endereco_bairro" TEXT,
    "endereco_estado" TEXT,
    "endereco_cep" TEXT,
    "telefones" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."titulos_pagar" (
    "id" INTEGER NOT NULL,
    "devedor_id" INTEGER,
    "credor_id" INTEGER,
    "documento_identificacao_id" TEXT,
    "numero_documento" TEXT,
    "data_emissao" TIMESTAMP(3),
    "numero_parcelas" INTEGER,
    "valor_total_nota" DECIMAL(15,2),
    "observacoes" TEXT,
    "desconto" DECIMAL(15,2),
    "status" TEXT,
    "origem_id" TEXT,
    "usuario_cadastro_id" TEXT,
    "usuario_cadastro_nome" TEXT,
    "data_cadastro" TIMESTAMP(3),
    "usuario_alteracao_id" TEXT,
    "usuario_alteracao_nome" TEXT,
    "data_alteracao" TIMESTAMP(3),
    "numero_chave_acesso" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "titulos_pagar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."extrato_contas" (
    "id" INTEGER NOT NULL,
    "valor" DECIMAL(15,2),
    "data" TIMESTAMP(3) NOT NULL,
    "numero_documento" TEXT,
    "descricao" TEXT,
    "documento_id" TEXT,
    "tipo" TEXT,
    "data_reconciliacao" TIMESTAMP(3),
    "titulo_id" INTEGER,
    "numero_parcela" INTEGER,
    "origem_extrato" TEXT,
    "tipo_extrato" TEXT,
    "observacoes_extrato" TEXT,
    "categorias_orcamentarias" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extrato_contas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contratos_suprimento" (
    "id" SERIAL NOT NULL,
    "documento_id" TEXT,
    "numero_contrato" TEXT NOT NULL,
    "fornecedor_id" INTEGER,
    "cliente_id" INTEGER,
    "empresa_id" INTEGER,
    "empresa_nome" TEXT,
    "responsavel_id" TEXT,
    "responsavel_nome" TEXT,
    "status" TEXT,
    "status_id" TEXT,
    "status_aprovacao" TEXT,
    "autorizado" BOOLEAN NOT NULL DEFAULT false,
    "data_contrato" TIMESTAMP(3),
    "data_inicio" TIMESTAMP(3),
    "data_fim" TIMESTAMP(3),
    "objeto" TEXT,
    "observacoes_internas" TEXT,
    "tipo_contrato" TEXT,
    "tipo_registro" TEXT,
    "tipo_item" TEXT,
    "valor_total_mao_obra" DECIMAL(15,2),
    "valor_total_material" DECIMAL(15,2),
    "consistente" BOOLEAN NOT NULL DEFAULT true,
    "edificios" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contratos_suprimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_credentials_subdomain_key" ON "public"."api_credentials"("subdomain");

-- CreateIndex
CREATE INDEX "api_credentials_subdomain_idx" ON "public"."api_credentials"("subdomain");

-- CreateIndex
CREATE INDEX "api_credentials_is_active_idx" ON "public"."api_credentials"("is_active");

-- CreateIndex
CREATE INDEX "sync_logs_entityType_idx" ON "public"."sync_logs"("entityType");

-- CreateIndex
CREATE INDEX "sync_logs_status_idx" ON "public"."sync_logs"("status");

-- CreateIndex
CREATE INDEX "sync_logs_syncStartedAt_idx" ON "public"."sync_logs"("syncStartedAt");

-- CreateIndex
CREATE INDEX "sync_logs_entityType_status_idx" ON "public"."sync_logs"("entityType", "status");

-- CreateIndex
CREATE INDEX "empresas_nomeEmpresa_idx" ON "public"."empresas"("nomeEmpresa");

-- CreateIndex
CREATE INDEX "empresas_cnpj_idx" ON "public"."empresas"("cnpj");

-- CreateIndex
CREATE INDEX "empresas_ativo_idx" ON "public"."empresas"("ativo");

-- CreateIndex
CREATE INDEX "empresas_dataCadastro_idx" ON "public"."empresas"("dataCadastro");

-- CreateIndex
CREATE INDEX "clientes_nomeCompleto_idx" ON "public"."clientes"("nomeCompleto");

-- CreateIndex
CREATE INDEX "clientes_ativo_idx" ON "public"."clientes"("ativo");

-- CreateIndex
CREATE INDEX "clientes_dataCadastro_idx" ON "public"."clientes"("dataCadastro");

-- CreateIndex
CREATE INDEX "clientes_idEmpresa_idx" ON "public"."clientes"("idEmpresa");

-- CreateIndex
CREATE INDEX "clientes_nomeCompleto_ativo_idx" ON "public"."clientes"("nomeCompleto", "ativo");

-- CreateIndex
CREATE INDEX "clientes_idEmpresa_ativo_idx" ON "public"."clientes"("idEmpresa", "ativo");

-- CreateIndex
CREATE INDEX "clientes_dataAtualizacao_idx" ON "public"."clientes"("dataAtualizacao");

-- CreateIndex
CREATE INDEX "clientes_telefone_principal_idx" ON "public"."clientes"("telefone_principal");

-- CreateIndex
CREATE INDEX "clientes_cidade_principal_idx" ON "public"."clientes"("cidade_principal");

-- CreateIndex
CREATE INDEX "clientes_estado_principal_idx" ON "public"."clientes"("estado_principal");

-- CreateIndex
CREATE INDEX "clientes_tem_conjuge_idx" ON "public"."clientes"("tem_conjuge");

-- CreateIndex
CREATE INDEX "contratos_venda_number_idx" ON "public"."contratos_venda"("number");

-- CreateIndex
CREATE INDEX "contratos_venda_situation_idx" ON "public"."contratos_venda"("situation");

-- CreateIndex
CREATE INDEX "contratos_venda_contractDate_idx" ON "public"."contratos_venda"("contractDate");

-- CreateIndex
CREATE INDEX "contratos_venda_issueDate_idx" ON "public"."contratos_venda"("issueDate");

-- CreateIndex
CREATE INDEX "contratos_venda_enterpriseId_idx" ON "public"."contratos_venda"("enterpriseId");

-- CreateIndex
CREATE INDEX "contratos_venda_companyId_idx" ON "public"."contratos_venda"("companyId");

-- CreateIndex
CREATE INDEX "contratos_venda_externalId_idx" ON "public"."contratos_venda"("externalId");

-- CreateIndex
CREATE INDEX "contratos_venda_situation_contractDate_idx" ON "public"."contratos_venda"("situation", "contractDate");

-- CreateIndex
CREATE INDEX "contratos_venda_enterpriseId_situation_idx" ON "public"."contratos_venda"("enterpriseId", "situation");

-- CreateIndex
CREATE INDEX "empreendimentos_nome_idx" ON "public"."empreendimentos"("nome");

-- CreateIndex
CREATE INDEX "empreendimentos_tipo_idx" ON "public"."empreendimentos"("tipo");

-- CreateIndex
CREATE INDEX "empreendimentos_idEmpresa_idx" ON "public"."empreendimentos"("idEmpresa");

-- CreateIndex
CREATE INDEX "unidades_nome_idx" ON "public"."unidades"("nome");

-- CreateIndex
CREATE INDEX "unidades_idEmpreendimento_idx" ON "public"."unidades"("idEmpreendimento");

-- CreateIndex
CREATE INDEX "unidades_idContrato_idx" ON "public"."unidades"("idContrato");

-- CreateIndex
CREATE INDEX "unidades_estoqueComercial_idx" ON "public"."unidades"("estoqueComercial");

-- CreateIndex
CREATE INDEX "unidades_total_unidades_filhas_idx" ON "public"."unidades"("total_unidades_filhas");

-- CreateIndex
CREATE INDEX "unidades_total_agrupamentos_idx" ON "public"."unidades"("total_agrupamentos");

-- CreateIndex
CREATE INDEX "unidades_total_valores_especiais_idx" ON "public"."unidades"("total_valores_especiais");

-- CreateIndex
CREATE INDEX "unidades_agrupamento_principal_idx" ON "public"."unidades"("agrupamento_principal");

-- CreateIndex
CREATE INDEX "webhooks_url_idx" ON "public"."webhooks"("url");

-- CreateIndex
CREATE INDEX "contrato_clientes_contrato_id_idx" ON "public"."contrato_clientes"("contrato_id");

-- CreateIndex
CREATE INDEX "contrato_clientes_cliente_sienge_id_idx" ON "public"."contrato_clientes"("cliente_sienge_id");

-- CreateIndex
CREATE INDEX "contrato_clientes_is_main_idx" ON "public"."contrato_clientes"("is_main");

-- CreateIndex
CREATE INDEX "contrato_clientes_nome_idx" ON "public"."contrato_clientes"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "contrato_clientes_contrato_id_cliente_sienge_id_ordem_no_co_key" ON "public"."contrato_clientes"("contrato_id", "cliente_sienge_id", "ordem_no_contrato");

-- CreateIndex
CREATE INDEX "contrato_unidades_contrato_id_idx" ON "public"."contrato_unidades"("contrato_id");

-- CreateIndex
CREATE INDEX "contrato_unidades_unidade_sienge_id_idx" ON "public"."contrato_unidades"("unidade_sienge_id");

-- CreateIndex
CREATE INDEX "contrato_unidades_is_main_idx" ON "public"."contrato_unidades"("is_main");

-- CreateIndex
CREATE INDEX "contrato_unidades_nome_idx" ON "public"."contrato_unidades"("nome");

-- CreateIndex
CREATE INDEX "contrato_unidades_tipo_unidade_idx" ON "public"."contrato_unidades"("tipo_unidade");

-- CreateIndex
CREATE UNIQUE INDEX "contrato_unidades_contrato_id_unidade_sienge_id_key" ON "public"."contrato_unidades"("contrato_id", "unidade_sienge_id");

-- CreateIndex
CREATE INDEX "contrato_condicoes_pagamento_contrato_id_idx" ON "public"."contrato_condicoes_pagamento"("contrato_id");

-- CreateIndex
CREATE INDEX "contrato_condicoes_pagamento_tipo_condicao_id_idx" ON "public"."contrato_condicoes_pagamento"("tipo_condicao_id");

-- CreateIndex
CREATE INDEX "contrato_condicoes_pagamento_indexador_nome_idx" ON "public"."contrato_condicoes_pagamento"("indexador_nome");

-- CreateIndex
CREATE INDEX "contrato_condicoes_pagamento_status_condicao_idx" ON "public"."contrato_condicoes_pagamento"("status_condicao");

-- CreateIndex
CREATE INDEX "contrato_condicoes_pagamento_valor_total_idx" ON "public"."contrato_condicoes_pagamento"("valor_total");

-- CreateIndex
CREATE INDEX "contrato_condicoes_pagamento_saldo_devedor_idx" ON "public"."contrato_condicoes_pagamento"("saldo_devedor");

-- CreateIndex
CREATE UNIQUE INDEX "contrato_condicoes_pagamento_contrato_id_ordem_condicao_key" ON "public"."contrato_condicoes_pagamento"("contrato_id", "ordem_condicao");

-- CreateIndex
CREATE INDEX "cliente_telefones_cliente_id_idx" ON "public"."cliente_telefones"("cliente_id");

-- CreateIndex
CREATE INDEX "cliente_telefones_principal_idx" ON "public"."cliente_telefones"("principal");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_telefones_cliente_id_ordem_telefone_key" ON "public"."cliente_telefones"("cliente_id", "ordem_telefone");

-- CreateIndex
CREATE INDEX "cliente_enderecos_cliente_id_idx" ON "public"."cliente_enderecos"("cliente_id");

-- CreateIndex
CREATE INDEX "cliente_enderecos_endereco_correspondencia_idx" ON "public"."cliente_enderecos"("endereco_correspondencia");

-- CreateIndex
CREATE INDEX "cliente_enderecos_cidade_idx" ON "public"."cliente_enderecos"("cidade");

-- CreateIndex
CREATE INDEX "cliente_enderecos_estado_idx" ON "public"."cliente_enderecos"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_enderecos_cliente_id_ordem_endereco_key" ON "public"."cliente_enderecos"("cliente_id", "ordem_endereco");

-- CreateIndex
CREATE INDEX "cliente_procuradores_cliente_id_idx" ON "public"."cliente_procuradores"("cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_procuradores_cliente_id_ordem_procurador_key" ON "public"."cliente_procuradores"("cliente_id", "ordem_procurador");

-- CreateIndex
CREATE INDEX "cliente_contatos_cliente_id_idx" ON "public"."cliente_contatos"("cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_contatos_cliente_id_ordem_contato_key" ON "public"."cliente_contatos"("cliente_id", "ordem_contato");

-- CreateIndex
CREATE INDEX "cliente_subtipos_cliente_id_idx" ON "public"."cliente_subtipos"("cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_subtipos_cliente_id_ordem_subtipo_key" ON "public"."cliente_subtipos"("cliente_id", "ordem_subtipo");

-- CreateIndex
CREATE INDEX "cliente_renda_familiar_cliente_id_idx" ON "public"."cliente_renda_familiar"("cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_renda_familiar_cliente_id_ordem_renda_key" ON "public"."cliente_renda_familiar"("cliente_id", "ordem_renda");

-- CreateIndex
CREATE INDEX "unidade_filhas_unidade_pai_id_idx" ON "public"."unidade_filhas"("unidade_pai_id");

-- CreateIndex
CREATE INDEX "unidade_filhas_unidade_filha_id_idx" ON "public"."unidade_filhas"("unidade_filha_id");

-- CreateIndex
CREATE UNIQUE INDEX "unidade_filhas_unidade_pai_id_ordem_filha_key" ON "public"."unidade_filhas"("unidade_pai_id", "ordem_filha");

-- CreateIndex
CREATE INDEX "unidade_agrupamentos_unidade_id_idx" ON "public"."unidade_agrupamentos"("unidade_id");

-- CreateIndex
CREATE INDEX "unidade_agrupamentos_tipo_agrupamento_idx" ON "public"."unidade_agrupamentos"("tipo_agrupamento");

-- CreateIndex
CREATE UNIQUE INDEX "unidade_agrupamentos_unidade_id_ordem_agrupamento_key" ON "public"."unidade_agrupamentos"("unidade_id", "ordem_agrupamento");

-- CreateIndex
CREATE INDEX "unidade_valores_especiais_unidade_id_idx" ON "public"."unidade_valores_especiais"("unidade_id");

-- CreateIndex
CREATE INDEX "unidade_valores_especiais_tipo_valor_idx" ON "public"."unidade_valores_especiais"("tipo_valor");

-- CreateIndex
CREATE INDEX "unidade_valores_especiais_valor_monetario_idx" ON "public"."unidade_valores_especiais"("valor_monetario");

-- CreateIndex
CREATE UNIQUE INDEX "unidade_valores_especiais_unidade_id_ordem_valor_key" ON "public"."unidade_valores_especiais"("unidade_id", "ordem_valor");

-- CreateIndex
CREATE INDEX "unidade_links_unidade_id_idx" ON "public"."unidade_links"("unidade_id");

-- CreateIndex
CREATE INDEX "unidade_links_rel_idx" ON "public"."unidade_links"("rel");

-- CreateIndex
CREATE UNIQUE INDEX "unidade_links_unidade_id_ordem_link_key" ON "public"."unidade_links"("unidade_id", "ordem_link");

-- CreateIndex
CREATE INDEX "credores_nome_idx" ON "public"."credores"("nome");

-- CreateIndex
CREATE INDEX "credores_cnpj_idx" ON "public"."credores"("cnpj");

-- CreateIndex
CREATE INDEX "credores_cpf_idx" ON "public"."credores"("cpf");

-- CreateIndex
CREATE INDEX "credores_ativo_idx" ON "public"."credores"("ativo");

-- CreateIndex
CREATE INDEX "titulos_pagar_credor_id_idx" ON "public"."titulos_pagar"("credor_id");

-- CreateIndex
CREATE INDEX "titulos_pagar_devedor_id_idx" ON "public"."titulos_pagar"("devedor_id");

-- CreateIndex
CREATE INDEX "titulos_pagar_data_emissao_idx" ON "public"."titulos_pagar"("data_emissao");

-- CreateIndex
CREATE INDEX "titulos_pagar_status_idx" ON "public"."titulos_pagar"("status");

-- CreateIndex
CREATE INDEX "titulos_pagar_origem_id_idx" ON "public"."titulos_pagar"("origem_id");

-- CreateIndex
CREATE INDEX "extrato_contas_titulo_id_idx" ON "public"."extrato_contas"("titulo_id");

-- CreateIndex
CREATE INDEX "extrato_contas_data_idx" ON "public"."extrato_contas"("data");

-- CreateIndex
CREATE INDEX "extrato_contas_tipo_idx" ON "public"."extrato_contas"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_suprimento_numero_contrato_key" ON "public"."contratos_suprimento"("numero_contrato");

-- CreateIndex
CREATE INDEX "contratos_suprimento_fornecedor_id_idx" ON "public"."contratos_suprimento"("fornecedor_id");

-- CreateIndex
CREATE INDEX "contratos_suprimento_empresa_id_idx" ON "public"."contratos_suprimento"("empresa_id");

-- CreateIndex
CREATE INDEX "contratos_suprimento_status_idx" ON "public"."contratos_suprimento"("status");

-- CreateIndex
CREATE INDEX "contratos_suprimento_data_contrato_idx" ON "public"."contratos_suprimento"("data_contrato");

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_idEmpresa_fkey" FOREIGN KEY ("idEmpresa") REFERENCES "public"."empresas"("idEmpresa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contratos_venda" ADD CONSTRAINT "contratos_venda_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "public"."empreendimentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."unidades" ADD CONSTRAINT "unidades_idEmpreendimento_fkey" FOREIGN KEY ("idEmpreendimento") REFERENCES "public"."empreendimentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."unidades" ADD CONSTRAINT "unidades_idContrato_fkey" FOREIGN KEY ("idContrato") REFERENCES "public"."contratos_venda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contrato_clientes" ADD CONSTRAINT "contrato_clientes_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos_venda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contrato_unidades" ADD CONSTRAINT "contrato_unidades_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos_venda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contrato_condicoes_pagamento" ADD CONSTRAINT "contrato_condicoes_pagamento_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos_venda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cliente_telefones" ADD CONSTRAINT "cliente_telefones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("idCliente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cliente_enderecos" ADD CONSTRAINT "cliente_enderecos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("idCliente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cliente_procuradores" ADD CONSTRAINT "cliente_procuradores_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("idCliente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cliente_contatos" ADD CONSTRAINT "cliente_contatos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("idCliente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cliente_subtipos" ADD CONSTRAINT "cliente_subtipos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("idCliente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cliente_renda_familiar" ADD CONSTRAINT "cliente_renda_familiar_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("idCliente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."unidade_filhas" ADD CONSTRAINT "unidade_filhas_unidade_pai_id_fkey" FOREIGN KEY ("unidade_pai_id") REFERENCES "public"."unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."unidade_agrupamentos" ADD CONSTRAINT "unidade_agrupamentos_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."unidade_valores_especiais" ADD CONSTRAINT "unidade_valores_especiais_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."unidade_links" ADD CONSTRAINT "unidade_links_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."titulos_pagar" ADD CONSTRAINT "titulos_pagar_credor_id_fkey" FOREIGN KEY ("credor_id") REFERENCES "public"."credores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."titulos_pagar" ADD CONSTRAINT "titulos_pagar_devedor_id_fkey" FOREIGN KEY ("devedor_id") REFERENCES "public"."empresas"("idEmpresa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."extrato_contas" ADD CONSTRAINT "extrato_contas_titulo_id_fkey" FOREIGN KEY ("titulo_id") REFERENCES "public"."titulos_pagar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contratos_suprimento" ADD CONSTRAINT "contratos_suprimento_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."credores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contratos_suprimento" ADD CONSTRAINT "contratos_suprimento_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("idEmpresa") ON DELETE SET NULL ON UPDATE CASCADE;

