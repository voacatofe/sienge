-- Script de inicialização do banco de dados PostgreSQL
-- Este script é executado automaticamente quando o container do PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Criar schema principal
CREATE SCHEMA IF NOT EXISTS sienge;

-- Tabela de configurações da API
CREATE TABLE IF NOT EXISTS sienge.api_config (
    id SERIAL PRIMARY KEY,
    subdomain VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de logs de sincronização
CREATE TABLE IF NOT EXISTS sienge.sync_logs (
    id SERIAL PRIMARY KEY,
    entity VARCHAR(50) NOT NULL,
    sync_started_at TIMESTAMP NOT NULL,
    sync_completed_at TIMESTAMP,
    records_processed INTEGER DEFAULT 0,
    records_inserted INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_errors INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'running',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS sienge.customers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    document VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS sienge.companies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    document VARCHAR(50),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS sienge.suppliers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    document VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de projetos
CREATE TABLE IF NOT EXISTS sienge.projects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    company_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES sienge.companies(id)
);

-- Tabela de centros de custo
CREATE TABLE IF NOT EXISTS sienge.cost_centers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    parent_id VARCHAR(50),
    level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de contas contábeis
CREATE TABLE IF NOT EXISTS sienge.chart_accounts (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    account_type VARCHAR(50),
    parent_id VARCHAR(50),
    level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_customers_name ON sienge.customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_document ON sienge.customers(document);
CREATE INDEX IF NOT EXISTS idx_customers_synced_at ON sienge.customers(synced_at);

CREATE INDEX IF NOT EXISTS idx_companies_name ON sienge.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_document ON sienge.companies(document);
CREATE INDEX IF NOT EXISTS idx_companies_synced_at ON sienge.companies(synced_at);

CREATE INDEX IF NOT EXISTS idx_suppliers_name ON sienge.suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_document ON sienge.suppliers(document);
CREATE INDEX IF NOT EXISTS idx_suppliers_synced_at ON sienge.suppliers(synced_at);

CREATE INDEX IF NOT EXISTS idx_projects_name ON sienge.projects(name);
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON sienge.projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_synced_at ON sienge.projects(synced_at);

CREATE INDEX IF NOT EXISTS idx_cost_centers_code ON sienge.cost_centers(code);
CREATE INDEX IF NOT EXISTS idx_cost_centers_parent_id ON sienge.cost_centers(parent_id);
CREATE INDEX IF NOT EXISTS idx_cost_centers_synced_at ON sienge.cost_centers(synced_at);

CREATE INDEX IF NOT EXISTS idx_chart_accounts_code ON sienge.chart_accounts(code);
CREATE INDEX IF NOT EXISTS idx_chart_accounts_parent_id ON sienge.chart_accounts(parent_id);
CREATE INDEX IF NOT EXISTS idx_chart_accounts_synced_at ON sienge.chart_accounts(synced_at);

CREATE INDEX IF NOT EXISTS idx_sync_logs_entity ON sienge.sync_logs(entity);
CREATE INDEX IF NOT EXISTS idx_sync_logs_sync_started_at ON sienge.sync_logs(sync_started_at);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sienge.sync_logs(status);

-- Inserir configuração padrão da API (será sobrescrita pela aplicação)
INSERT INTO sienge.api_config (subdomain, username, password_hash, is_active)
VALUES ('demo', 'demo_user', 'demo_hash', false)
ON CONFLICT DO NOTHING;

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION sienge.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger de updated_at em todas as tabelas principais
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON sienge.customers FOR EACH ROW EXECUTE FUNCTION sienge.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON sienge.companies FOR EACH ROW EXECUTE FUNCTION sienge.update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON sienge.suppliers FOR EACH ROW EXECUTE FUNCTION sienge.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON sienge.projects FOR EACH ROW EXECUTE FUNCTION sienge.update_updated_at_column();
CREATE TRIGGER update_cost_centers_updated_at BEFORE UPDATE ON sienge.cost_centers FOR EACH ROW EXECUTE FUNCTION sienge.update_updated_at_column();
CREATE TRIGGER update_chart_accounts_updated_at BEFORE UPDATE ON sienge.chart_accounts FOR EACH ROW EXECUTE FUNCTION sienge.update_updated_at_column();
