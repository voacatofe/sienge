import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Endpoint de documentação da API Sienge
 * Lista todos os endpoints disponíveis
 */
export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;

  const endpoints = {
    message: 'API Sienge - Endpoints de Bulk Data para Sincronização em Massa',
    documentation: `${baseUrl}/docs/BULK_DATA_GUIDE.md`,
    openapi: `${baseUrl}/api/sienge/openapi`,
    description:
      'Esta API foi otimizada exclusivamente para sincronização em massa (bulk data) com a API oficial do Sienge. Todos os endpoints retornam grandes volumes de dados para popular bancos de dados.',
    proxy: {
      description: 'Proxy para endpoints de bulk data da API Sienge',
      endpoint: `${baseUrl}/api/sienge/proxy`,
      method: 'GET/POST',
      example: `${baseUrl}/api/sienge/proxy?endpoint=/customers&limit=1000`,
      validation: 'Parâmetros obrigatórios são validados automaticamente',
      focus: 'Sincronização em massa - não requer IDs específicos de itens',
    },
    endpoints: {
      // ===== ENDPOINTS DE BULK DATA PARA SINCRONIZAÇÃO EM MASSA =====
      customers: {
        description: 'Busca lista completa de clientes (bulk data)',
        path: '/customers',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/customers&limit=1000&onlyActive=true`,
      },
      companies: {
        description: 'Busca lista completa de empresas (bulk data)',
        path: '/companies',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/companies&limit=1000`,
      },
      enterprises: {
        description: 'Busca lista completa de empreendimentos (bulk data)',
        path: '/enterprises',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/enterprises&limit=1000`,
      },
      units: {
        description: 'Busca lista completa de unidades (bulk data)',
        path: '/units',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/units&limit=1000`,
      },
      'units/characteristics': {
        description: 'Busca características de unidade (bulk data)',
        path: '/units/characteristics',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/units/characteristics&limit=1000`,
      },
      'units/situations': {
        description: 'Busca situações de unidade (bulk data)',
        path: '/units/situations',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/units/situations&limit=1000`,
      },
      'sales-contracts': {
        description: 'Busca contratos de venda (bulk data)',
        path: '/sales-contracts',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/sales-contracts&limit=1000`,
      },
      'construction-daily-report/event-type': {
        description: 'Busca tipos de ocorrência (bulk data)',
        path: '/construction-daily-report/event-type',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/construction-daily-report/event-type&limit=1000`,
      },
      'construction-daily-report/types': {
        description: 'Busca tipos de diário de obra (bulk data)',
        path: '/construction-daily-report/types',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/construction-daily-report/types&limit=1000`,
      },
      'patrimony/fixed': {
        description: 'Lista bens patrimoniais (bulk data)',
        path: '/patrimony/fixed',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/patrimony/fixed&limit=1000`,
      },
      hooks: {
        description: 'Consulta webhooks (bulk data)',
        path: '/hooks',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/hooks&limit=1000`,
      },
      // ===== ENDPOINTS DE DADOS FINANCEIROS POR PERÍODO =====
      bearers: {
        description: 'Busca lista completa de portadores (bulk data)',
        path: '/bearers',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/bearers&limit=1000`,
      },
      creditors: {
        description: 'Busca lista completa de credores (bulk data)',
        path: '/creditors',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/creditors&limit=1000`,
      },
      bills: {
        description: 'Busca títulos a pagar por período (bulk data)',
        path: '/bills',
        bulkData: true,
        required: ['startDate', 'endDate'],
        example: `${baseUrl}/api/sienge/proxy?endpoint=/bills&startDate=2024-01-01&endDate=2024-12-31`,
      },
      income: {
        description: 'Busca receitas por período (bulk data)',
        path: '/income',
        bulkData: true,
        required: ['startDate', 'endDate', 'selectionType'],
        example: `${baseUrl}/api/sienge/proxy?endpoint=/income&startDate=2024-01-01&endDate=2024-12-31&selectionType=D`,
      },
      'bank-movement': {
        description: 'Busca movimentos financeiros por período (bulk data)',
        path: '/bank-movement',
        bulkData: true,
        required: ['startDate', 'endDate'],
        example: `${baseUrl}/api/sienge/proxy?endpoint=/bank-movement&startDate=2024-01-01&endDate=2024-12-31`,
      },
      'customer-extract-history': {
        description: 'Busca extrato de cliente por período (bulk data)',
        path: '/customer-extract-history',
        bulkData: true,
        required: ['startDueDate', 'endDueDate'],
        example: `${baseUrl}/api/sienge/proxy?endpoint=/customer-extract-history&startDueDate=2024-01-01&endDueDate=2024-12-31`,
      },
      'accounts-statements': {
        description: 'Busca extrato de contas por período (bulk data)',
        path: '/accounts-statements',
        bulkData: true,
        required: ['startDate', 'endDate'],
        example: `${baseUrl}/api/sienge/proxy?endpoint=/accounts-statements&startDate=2024-01-01&endDate=2024-12-31`,
      },
      // ===== ENDPOINTS DE VENDAS E COMISSÕES =====
      sales: {
        description: 'Busca vendas por empreendimento e período (bulk data)',
        path: '/sales',
        bulkData: true,
        required: [
          'enterpriseId',
          'createdAfter',
          'createdBefore',
          'situation',
        ],
        example: `${baseUrl}/api/sienge/proxy?endpoint=/sales&enterpriseId=123&createdAfter=2024-01-01&createdBefore=2024-12-31&situation=SOLD`,
      },
      // ===== ENDPOINTS DE MEDIÇÕES E ANEXOS =====
      'supply-contracts/all': {
        description: 'Consulta todos os contratos de suprimento (bulk data)',
        path: '/supply-contracts/all',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/supply-contracts/all&limit=1000`,
      },
      'supply-contracts/measurements/all': {
        description: 'Consulta todas as medições de contratos (bulk data)',
        path: '/supply-contracts/measurements/all',
        bulkData: true,
        example: `${baseUrl}/api/sienge/proxy?endpoint=/supply-contracts/measurements/all&limit=1000`,
      },
      'supply-contracts/measurements/attachments/all': {
        description: 'Consulta anexos de medição por período (bulk data)',
        path: '/supply-contracts/measurements/attachments/all',
        bulkData: true,
        required: ['measurementStartDate', 'measurementEndDate'],
        example: `${baseUrl}/api/sienge/proxy?endpoint=/supply-contracts/measurements/attachments/all&measurementStartDate=2024-01-01&measurementEndDate=2024-12-31`,
      },
    },
  };

  return NextResponse.json(endpoints);
}
