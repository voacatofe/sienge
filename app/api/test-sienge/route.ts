import { NextRequest, NextResponse } from 'next/server';
import { siengeApiClient } from '@/lib/sienge-api-client';

export async function GET(request: NextRequest) {
  try {
    // Inicializar cliente da API
    await siengeApiClient.initialize();
    
    // Testar diferentes endpoints com fallbacks
    const endpointGroups = {
      'customers': ['/customers'],
      'companies': ['/companies'],
      'projects': ['/buildings', '/constructions', '/empreendimentos', '/projects'],
      'cost-centers': ['/cost-centers', '/departments']
    };
    
    const results: any = {};
    
    for (const [entity, endpoints] of Object.entries(endpointGroups)) {
      results[entity] = {};
      
      for (const endpoint of endpoints) {
        try {
          console.log(`[Test API] Testando endpoint: ${endpoint} para entidade: ${entity}`);
          
          // Fazer uma requisição simples para ver a estrutura da resposta
          const response = await siengeApiClient.fetchData(endpoint, { limit: 1 });
          
          results[entity][endpoint] = {
            success: true,
            responseType: typeof response,
            responseKeys: Object.keys(response || {}),
            isArray: Array.isArray(response),
            sampleData: response,
            status: 'OK'
          };
          
          console.log(`[Test API] Sucesso em ${endpoint}:`, {
            type: typeof response,
            keys: Object.keys(response || {}),
            isArray: Array.isArray(response)
          });
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
          const isPermissionError = errorMessage.includes('403');
          const isMethodError = errorMessage.includes('405');
          
          results[entity][endpoint] = {
            success: false,
            error: errorMessage,
            isPermissionError,
            isMethodError,
            suggestion: isPermissionError ? 
              'Verifique as permissões do usuário da API no painel Sienge para este endpoint' : 
              isMethodError ?
              'Este endpoint pode não existir ou usar método HTTP diferente' :
              'Verifique se o endpoint está correto e se as credenciais são válidas'
          };
          
          console.warn(`[Test API] Falha em ${endpoint}: ${errorMessage}`);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Teste de endpoints concluído',
      results
    });
    
  } catch (error) {
    console.error('[Test API] Erro geral:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro ao testar API Sienge',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
