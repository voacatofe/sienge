import { NextRequest, NextResponse } from 'next/server';
import { siengeApiClient } from '@/lib/sienge-api-client';

export async function GET(request: NextRequest) {
  try {
    // Inicializar cliente da API
    await siengeApiClient.initialize();
    
    // Testar diferentes endpoints
    const endpoints = ['/customers', '/companies', '/projects', '/cost-centers'];
    const results: any = {};
    
    for (const endpoint of endpoints) {
      try {
        console.log(`[Test API] Testando endpoint: ${endpoint}`);
        
        // Fazer uma requisição simples para ver a estrutura da resposta
        const response = await siengeApiClient.fetchData(endpoint, { limit: 1 });
        
        results[endpoint] = {
          success: true,
          responseType: typeof response,
          responseKeys: Object.keys(response || {}),
          isArray: Array.isArray(response),
          sampleData: response
        };
        
        console.log(`[Test API] Resposta de ${endpoint}:`, {
          type: typeof response,
          keys: Object.keys(response || {}),
          isArray: Array.isArray(response)
        });
        
       } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
         const isPermissionError = errorMessage.includes('403');
         
         results[endpoint] = {
           success: false,
           error: errorMessage,
           isPermissionError,
           suggestion: isPermissionError ? 
             'Verifique as permissões do usuário da API no painel Sienge para este endpoint' : 
             'Verifique se o endpoint está correto e se as credenciais são válidas'
         };
         
         console.error(`[Test API] Erro em ${endpoint}:`, error);
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
