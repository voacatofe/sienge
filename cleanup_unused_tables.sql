-- Script para remover tabelas não utilizadas do banco de dados Sienge
-- Execute este script com cuidado após fazer backup do banco de dados

-- Remover tabelas dependentes primeiro (por causa das foreign keys)
DROP TABLE IF EXISTS parcelas_contas_receber CASCADE;
DROP TABLE IF EXISTS contas_receber CASCADE;
DROP TABLE IF EXISTS titulos_receber CASCADE;
DROP TABLE IF EXISTS titulos_pagar CASCADE;
DROP TABLE IF EXISTS anexos_medicao_contrato CASCADE;
DROP TABLE IF EXISTS medicoes_contrato CASCADE;
DROP TABLE IF EXISTS movimentos_bancarios CASCADE;
DROP TABLE IF EXISTS diarios_obra CASCADE;
DROP TABLE IF EXISTS extratos_conta CASCADE;
DROP TABLE IF EXISTS ativos_fixos CASCADE;
DROP TABLE IF EXISTS sites CASCADE;

-- Remover tabelas de suporte
DROP TABLE IF EXISTS portadores_recebimento CASCADE;
DROP TABLE IF EXISTS planos_financeiros CASCADE;
DROP TABLE IF EXISTS indexadores CASCADE;
DROP TABLE IF EXISTS tipos_ocorrencia CASCADE;
DROP TABLE IF EXISTS tipos_diario_obra CASCADE;

-- Mensagem de confirmação
DO $$
BEGIN
    RAISE NOTICE 'Tabelas não utilizadas foram removidas com sucesso.';
    RAISE NOTICE 'Tabelas mantidas: empresas, clientes, empreendimentos, contratos_venda, unidades, webhooks, api_credentials, sync_logs';
END $$;