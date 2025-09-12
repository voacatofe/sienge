import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const endpoints = {
      customers: {
        url: `${baseUrl}/api/data/customers`,
        description: 'Dados dos clientes',
        parameters: {
          page: 'Número da página (padrão: 1)',
          limit: 'Registros por página (padrão: 100)',
          search: 'Busca por nome, email ou CPF/CNPJ',
          active: 'Filtrar apenas ativos (true/false, padrão: true)'
        },
        example: `${baseUrl}/api/data/customers?page=1&limit=50&search=João&active=true`
      },
      companies: {
        url: `${baseUrl}/api/data/companies`,
        description: 'Dados das empresas',
        parameters: {
          page: 'Número da página (padrão: 1)',
          limit: 'Registros por página (padrão: 100)',
          search: 'Busca por nome da empresa ou CNPJ',
          active: 'Filtrar apenas ativos (true/false, padrão: true)'
        },
        example: `${baseUrl}/api/data/companies?page=1&limit=50&search=Empresa&active=true`
      },
      syncLogs: {
        url: `${baseUrl}/api/data/sync-logs`,
        description: 'Logs de sincronização',
        parameters: {
          page: 'Número da página (padrão: 1)',
          limit: 'Registros por página (padrão: 100)',
          entity: 'Filtrar por entidade (customers, companies, etc.)'
        },
        example: `${baseUrl}/api/data/sync-logs?page=1&limit=20&entity=customers`
      }
    };

    return NextResponse.json({
      success: true,
      message: 'API de dados do Sienge - Endpoints disponíveis',
      baseUrl,
      endpoints,
      powerBI: {
        instructions: 'Para usar no Power BI:',
        steps: [
          '1. Abra o Power BI Desktop',
          '2. Clique em "Obter Dados" > "Web"',
          '3. Cole a URL do endpoint desejado',
          '4. Configure os parâmetros conforme necessário',
          '5. Clique em "OK" para carregar os dados'
        ],
        examples: {
          customers: `${baseUrl}/api/data/customers?limit=1000`,
          companies: `${baseUrl}/api/data/companies?limit=1000`,
          syncLogs: `${baseUrl}/api/data/sync-logs?limit=1000`
        }
      },
      meta: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        documentation: `${baseUrl}/api/data/docs`
      }
    });

  } catch (error) {
    console.error('[Data API] Erro ao gerar documentação:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
