
> migration.sql:509:CREATE TABLE "public"."portadores" (
  migration.sql:510:    "id" INTEGER NOT NULL,
  migration.sql:511:    "nome" TEXT NOT NULL,
  migration.sql:512:
  migration.sql:513:    CONSTRAINT "portadores_pkey" PRIMARY KEY ("id")
  migration.sql:514:);
  migration.sql:515:
  migration.sql:516:-- CreateTable
  migration.sql:517:CREATE TABLE "public"."credores" (
  migration.sql:518:    "id" INTEGER NOT NULL,
  migration.sql:519:    "nome" TEXT NOT NULL,
  migration.sql:520:    "nome_fantasia" TEXT,
  migration.sql:521:    "cpf" TEXT,
  migration.sql:522:    "cnpj" TEXT,
  migration.sql:523:    "fornecedor" TEXT,
  migration.sql:524:    "corretor" TEXT,
  migration.sql:525:    "funcionario" TEXT,
  migration.sql:526:    "ativo" BOOLEAN NOT NULL DEFAULT true,
  migration.sql:527:    "inscricao_estadual" TEXT,
  migration.sql:528:    "tipo_inscricao_estadual" TEXT,
  migration.sql:529:    "tipo_pagamento_id" INTEGER,
  migration.sql:530:    "endereco_cidade_id" INTEGER,
  migration.sql:531:    "endereco_cidade_nome" TEXT,
  migration.sql:532:    "endereco_rua" TEXT,
  migration.sql:533:    "endereco_numero" TEXT,
  migration.sql:534:    "endereco_complemento" TEXT,
  migration.sql:535:    "endereco_bairro" TEXT,
  migration.sql:536:    "endereco_estado" TEXT,
  migration.sql:537:    "endereco_cep" TEXT,
  migration.sql:538:    "telefones" JSONB,
  migration.sql:539:    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  migration.sql:540:    "updated_at" TIMESTAMP(3) NOT NULL,
  migration.sql:541:
  migration.sql:542:    CONSTRAINT "credores_pkey" PRIMARY KEY ("id")
  migration.sql:543:);
  migration.sql:544:
  migration.sql:545:-- CreateTable
  migration.sql:546:CREATE TABLE "public"."titulos_pagar" (
  migration.sql:547:    "id" INTEGER NOT NULL,
  migration.sql:548:    "devedor_id" INTEGER,
  migration.sql:549:    "credor_id" INTEGER,
  migration.sql:550:    "documento_identificacao_id" TEXT,
  migration.sql:551:    "numero_documento" TEXT,
  migration.sql:552:    "data_emissao" TIMESTAMP(3),
  migration.sql:553:    "numero_parcelas" INTEGER,
  migration.sql:554:    "valor_total_nota" DECIMAL(15,2),
  migration.sql:555:    "observacoes" TEXT,
  migration.sql:556:    "desconto" DECIMAL(15,2),
  migration.sql:557:    "status" TEXT,
  migration.sql:558:    "origem_id" TEXT,
  migration.sql:559:    "usuario_cadastro_id" TEXT,
  migration.sql:560:    "usuario_cadastro_nome" TEXT,
  migration.sql:561:    "data_cadastro" TIMESTAMP(3),
  migration.sql:562:    "usuario_alteracao_id" TEXT,
  migration.sql:563:    "usuario_alteracao_nome" TEXT,
  migration.sql:564:    "data_alteracao" TIMESTAMP(3),
  migration.sql:565:    "numero_chave_acesso" TEXT,
  migration.sql:566:    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  migration.sql:567:    "updated_at" TIMESTAMP(3) NOT NULL,
  migration.sql:568:
  migration.sql:569:    CONSTRAINT "titulos_pagar_pkey" PRIMARY KEY ("id")
  migration.sql:570:);
  migration.sql:571:
  migration.sql:572:-- CreateTable
  migration.sql:573:CREATE TABLE "public"."extrato_contas" (
  migration.sql:574:    "id" INTEGER NOT NULL,
  migration.sql:575:    "valor" DECIMAL(15,2),
  migration.sql:576:    "data" TIMESTAMP(3) NOT NULL,
  migration.sql:577:    "numero_documento" TEXT,
  migration.sql:578:    "descricao" TEXT,
  migration.sql:579:    "documento_id" TEXT,
  migration.sql:580:    "tipo" TEXT,
  migration.sql:581:    "data_reconciliacao" TIMESTAMP(3),
  migration.sql:582:    "titulo_id" INTEGER,
  migration.sql:583:    "numero_parcela" INTEGER,
  migration.sql:584:    "origem_extrato" TEXT,
  migration.sql:585:    "tipo_extrato" TEXT,
  migration.sql:586:    "observacoes_extrato" TEXT,
  migration.sql:587:    "categorias_orcamentarias" JSONB,
  migration.sql:588:    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  migration.sql:589:    "updated_at" TIMESTAMP(3) NOT NULL,
  migration.sql:590:
  migration.sql:591:    CONSTRAINT "extrato_contas_pkey" PRIMARY KEY ("id")
  migration.sql:592:);
  migration.sql:593:
  migration.sql:594:-- CreateTable
  migration.sql:595:CREATE TABLE "public"."contratos_suprimento" (
  migration.sql:596:    "id" SERIAL NOT NULL,
  migration.sql:597:    "documento_id" TEXT,
  migration.sql:598:    "numero_contrato" TEXT NOT NULL,
  migration.sql:599:    "fornecedor_id" INTEGER,
  migration.sql:600:    "cliente_id" INTEGER,
  migration.sql:601:    "empresa_id" INTEGER,
  migration.sql:602:    "empresa_nome" TEXT,
  migration.sql:603:    "responsavel_id" TEXT,
  migration.sql:604:    "responsavel_nome" TEXT,
  migration.sql:605:    "status" TEXT,
  migration.sql:606:    "status_id" TEXT,
  migration.sql:607:    "status_aprovacao" TEXT,
  migration.sql:608:    "autorizado" BOOLEAN NOT NULL DEFAULT false,
  migration.sql:609:    "data_contrato" TIMESTAMP(3),
  migration.sql:610:    "data_inicio" TIMESTAMP(3),
  migration.sql:611:    "data_fim" TIMESTAMP(3),
  migration.sql:612:    "objeto" TEXT,
  migration.sql:613:    "observacoes_internas" TEXT,
  migration.sql:614:    "tipo_contrato" TEXT,
  migration.sql:615:    "tipo_registro" TEXT,
  migration.sql:616:    "tipo_item" TEXT,
  migration.sql:617:    "valor_total_mao_obra" DECIMAL(15,2),
  migration.sql:618:    "valor_total_material" DECIMAL(15,2),
  migration.sql:619:    "consistente" BOOLEAN NOT NULL DEFAULT true,
  migration.sql:620:    "edificios" JSONB,
  migration.sql:621:    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  migration.sql:622:    "updated_at" TIMESTAMP(3) NOT NULL,
  migration.sql:623:
  migration.sql:624:    CONSTRAINT "contratos_suprimento_pkey" PRIMARY KEY ("id")
  migration.sql:625:);
  migration.sql:626:
  migration.sql:627:-- CreateIndex
  migration.sql:628:CREATE UNIQUE INDEX "api_credentials_subdomain_key" ON "public"."api_credentials"("subdomain");
  migration.sql:629:
  migration.sql:630:-- CreateIndex
  migration.sql:631:CREATE INDEX "api_credentials_subdomain_idx" ON "public"."api_credentials"("subdomain");
  migration.sql:632:
  migration.sql:633:-- CreateIndex
  migration.sql:634:CREATE INDEX "api_credentials_is_active_idx" ON "public"."api_credentials"("is_active");
  migration.sql:635:
  migration.sql:636:-- CreateIndex
  migration.sql:637:CREATE INDEX "sync_logs_entityType_idx" ON "public"."sync_logs"("entityType");
  migration.sql:638:
  migration.sql:639:-- CreateIndex
  migration.sql:640:CREATE INDEX "sync_logs_status_idx" ON "public"."sync_logs"("status");
  migration.sql:641:
  migration.sql:642:-- CreateIndex
  migration.sql:643:CREATE INDEX "sync_logs_syncStartedAt_idx" ON "public"."sync_logs"("syncStartedAt");
  migration.sql:644:
  migration.sql:645:-- CreateIndex
  migration.sql:646:CREATE INDEX "sync_logs_entityType_status_idx" ON "public"."sync_logs"("entityType", "status");
  migration.sql:647:
  migration.sql:648:-- CreateIndex
  migration.sql:649:CREATE INDEX "empresas_nomeEmpresa_idx" ON "public"."empresas"("nomeEmpresa");
  migration.sql:650:
  migration.sql:651:-- CreateIndex
  migration.sql:652:CREATE INDEX "empresas_cnpj_idx" ON "public"."empresas"("cnpj");
  migration.sql:653:
  migration.sql:654:-- CreateIndex
  migration.sql:655:CREATE INDEX "empresas_ativo_idx" ON "public"."empresas"("ativo");
  migration.sql:656:
  migration.sql:657:-- CreateIndex
  migration.sql:658:CREATE INDEX "empresas_dataCadastro_idx" ON "public"."empresas"("dataCadastro");
  migration.sql:659:
  migration.sql:660:-- CreateIndex
  migration.sql:661:CREATE INDEX "clientes_nomeCompleto_idx" ON "public"."clientes"("nomeCompleto");
  migration.sql:662:
  migration.sql:663:-- CreateIndex
  migration.sql:664:CREATE INDEX "clientes_ativo_idx" ON "public"."clientes"("ativo");
  migration.sql:665:
  migration.sql:666:-- CreateIndex
  migration.sql:667:CREATE INDEX "clientes_dataCadastro_idx" ON "public"."clientes"("dataCadastro");
  migration.sql:668:
  migration.sql:669:-- CreateIndex
  migration.sql:670:CREATE INDEX "clientes_idEmpresa_idx" ON "public"."clientes"("idEmpresa");
  migration.sql:671:
  migration.sql:672:-- CreateIndex
  migration.sql:673:CREATE INDEX "clientes_nomeCompleto_ativo_idx" ON "public"."clientes"("nomeCompleto", "ativo");
  migration.sql:674:
  migration.sql:675:-- CreateIndex
  migration.sql:676:CREATE INDEX "clientes_idEmpresa_ativo_idx" ON "public"."clientes"("idEmpresa", "ativo");
  migration.sql:677:
  migration.sql:678:-- CreateIndex
  migration.sql:679:CREATE INDEX "clientes_dataAtualizacao_idx" ON "public"."clientes"("dataAtualizacao");
  migration.sql:680:
  migration.sql:681:-- CreateIndex
  migration.sql:682:CREATE INDEX "clientes_telefone_principal_idx" ON "public"."clientes"("telefone_principal");
  migration.sql:683:
  migration.sql:684:-- CreateIndex
  migration.sql:685:CREATE INDEX "clientes_cidade_principal_idx" ON "public"."clientes"("cidade_principal");
  migration.sql:686:
  migration.sql:687:-- CreateIndex
  migration.sql:688:CREATE INDEX "clientes_estado_principal_idx" ON "public"."clientes"("estado_principal");
  migration.sql:689:
  migration.sql:690:-- CreateIndex
  migration.sql:691:CREATE INDEX "clientes_tem_conjuge_idx" ON "public"."clientes"("tem_conjuge");
  migration.sql:692:
  migration.sql:693:-- CreateIndex
  migration.sql:694:CREATE INDEX "contratos_venda_number_idx" ON "public"."contratos_venda"("number");
  migration.sql:695:
  migration.sql:696:-- CreateIndex
  migration.sql:697:CREATE INDEX "contratos_venda_situation_idx" ON "public"."contratos_venda"("situation");
  migration.sql:698:
  migration.sql:699:-- CreateIndex
  migration.sql:700:CREATE INDEX "contratos_venda_contractDate_idx" ON "public"."contratos_venda"("contractDate");
  migration.sql:701:
  migration.sql:702:-- CreateIndex
  migration.sql:703:CREATE INDEX "contratos_venda_issueDate_idx" ON "public"."contratos_venda"("issueDate");
  migration.sql:704:
  migration.sql:705:-- CreateIndex
  migration.sql:706:CREATE INDEX "contratos_venda_enterpriseId_idx" ON "public"."contratos_venda"("enterpriseId");
  migration.sql:707:
  migration.sql:708:-- CreateIndex
  migration.sql:709:CREATE INDEX "contratos_venda_companyId_idx" ON "public"."contratos_venda"("companyId");



