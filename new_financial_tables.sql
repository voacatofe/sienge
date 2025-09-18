-- Criar tabela portadores
CREATE TABLE IF NOT EXISTS "portadores" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    CONSTRAINT "portadores_pkey" PRIMARY KEY ("id")
);

-- Criar tabela credores
CREATE TABLE IF NOT EXISTS "credores" (
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
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "credores_pkey" PRIMARY KEY ("id")
);

-- Criar tabela titulos_pagar
CREATE TABLE IF NOT EXISTS "titulos_pagar" (
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
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "titulos_pagar_pkey" PRIMARY KEY ("id")
);

-- Criar tabela extrato_contas
CREATE TABLE IF NOT EXISTS "extrato_contas" (
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
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "extrato_contas_pkey" PRIMARY KEY ("id")
);

-- Criar tabela contratos_suprimento
CREATE TABLE IF NOT EXISTS "contratos_suprimento" (
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
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contratos_suprimento_pkey" PRIMARY KEY ("id")
);

-- Criar índices para credores
CREATE INDEX IF NOT EXISTS "credores_nome_idx" ON "credores"("nome");
CREATE INDEX IF NOT EXISTS "credores_cnpj_idx" ON "credores"("cnpj");
CREATE INDEX IF NOT EXISTS "credores_cpf_idx" ON "credores"("cpf");
CREATE INDEX IF NOT EXISTS "credores_ativo_idx" ON "credores"("ativo");

-- Criar índices para titulos_pagar
CREATE INDEX IF NOT EXISTS "titulos_pagar_credor_id_idx" ON "titulos_pagar"("credor_id");
CREATE INDEX IF NOT EXISTS "titulos_pagar_devedor_id_idx" ON "titulos_pagar"("devedor_id");
CREATE INDEX IF NOT EXISTS "titulos_pagar_data_emissao_idx" ON "titulos_pagar"("data_emissao");
CREATE INDEX IF NOT EXISTS "titulos_pagar_status_idx" ON "titulos_pagar"("status");
CREATE INDEX IF NOT EXISTS "titulos_pagar_origem_id_idx" ON "titulos_pagar"("origem_id");

-- Criar índices para extrato_contas
CREATE INDEX IF NOT EXISTS "extrato_contas_titulo_id_idx" ON "extrato_contas"("titulo_id");
CREATE INDEX IF NOT EXISTS "extrato_contas_data_idx" ON "extrato_contas"("data");
CREATE INDEX IF NOT EXISTS "extrato_contas_tipo_idx" ON "extrato_contas"("tipo");

-- Criar índices para contratos_suprimento
CREATE UNIQUE INDEX IF NOT EXISTS "contratos_suprimento_numero_contrato_key" ON "contratos_suprimento"("numero_contrato");
CREATE INDEX IF NOT EXISTS "contratos_suprimento_fornecedor_id_idx" ON "contratos_suprimento"("fornecedor_id");
CREATE INDEX IF NOT EXISTS "contratos_suprimento_empresa_id_idx" ON "contratos_suprimento"("empresa_id");
CREATE INDEX IF NOT EXISTS "contratos_suprimento_status_idx" ON "contratos_suprimento"("status");
CREATE INDEX IF NOT EXISTS "contratos_suprimento_data_contrato_idx" ON "contratos_suprimento"("data_contrato");

-- Adicionar foreign keys
ALTER TABLE "titulos_pagar" ADD CONSTRAINT "titulos_pagar_credor_id_fkey"
    FOREIGN KEY ("credor_id") REFERENCES "credores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "titulos_pagar" ADD CONSTRAINT "titulos_pagar_devedor_id_fkey"
    FOREIGN KEY ("devedor_id") REFERENCES "empresas"("idEmpresa") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "extrato_contas" ADD CONSTRAINT "extrato_contas_titulo_id_fkey"
    FOREIGN KEY ("titulo_id") REFERENCES "titulos_pagar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "contratos_suprimento" ADD CONSTRAINT "contratos_suprimento_fornecedor_id_fkey"
    FOREIGN KEY ("fornecedor_id") REFERENCES "credores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "contratos_suprimento" ADD CONSTRAINT "contratos_suprimento_empresa_id_fkey"
    FOREIGN KEY ("empresa_id") REFERENCES "empresas"("idEmpresa") ON DELETE SET NULL ON UPDATE CASCADE;