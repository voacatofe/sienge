'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface CredentialsFormData {
  subdomain: string;
  username: string;
  password: string;
}

interface ConfigurationSectionProps {
  onConfigurationChange: (isConfigured: boolean) => void;
  onSyncCompleted: (results: any[]) => void;
}

export function ConfigurationSection({
  onConfigurationChange,
  onSyncCompleted,
}: ConfigurationSectionProps) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'syncing' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [syncProgress, setSyncProgress] = useState<{
    [key: string]: 'pending' | 'syncing' | 'completed' | 'error';
  }>({});
  const [syncResults, setSyncResults] = useState<any[]>([]);

  const form = useForm<CredentialsFormData>({
    defaultValues: {
      subdomain: '',
      username: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  // Verificar se já existem configurações salvas
  useEffect(() => {
    checkExistingConfiguration();
  }, []);

  const checkExistingConfiguration = async () => {
    try {
      const response = await fetch('/api/config/credentials', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setIsConfigured(data.hasCredentials || false);
        onConfigurationChange(data.hasCredentials || false);

        if (data.hasCredentials && data.credentials) {
          reset({
            subdomain: data.credentials.subdomain || '',
            username: data.credentials.username || '',
            password: '',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao verificar configurações:', error);
    }
  };

  const onSubmit = async (data: CredentialsFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('syncing');
    setErrorMessage('');
    setSyncProgress({});
    setSyncResults([]);

    try {
      // 1. Salvar credenciais
      const credentialsResponse = await fetch('/api/config/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const credentialsResult = await credentialsResponse.json();

      if (!credentialsResponse.ok || !credentialsResult.success) {
        setSubmitStatus('error');
        setErrorMessage(
          credentialsResult.error || 'Erro ao salvar credenciais'
        );
        return;
      }

      // 2. Iniciar sincronização automática de todos os endpoints
      await syncAllEndpoints();
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(
        'Erro de conexão. Verifique se o servidor está funcionando.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const syncAllEndpoints = async () => {
    // Lista de todos os endpoints disponíveis
    const endpoints = [
      { id: 'customers', name: 'Clientes', path: '/customers' },
      { id: 'companies', name: 'Empresas', path: '/companies' },
      { id: 'enterprises', name: 'Empreendimentos', path: '/enterprises' },
      { id: 'units', name: 'Unidades', path: '/units' },
      {
        id: 'units-characteristics',
        name: 'Características de Unidade',
        path: '/units/characteristics',
      },
      {
        id: 'units-situations',
        name: 'Situações de Unidade',
        path: '/units/situations',
      },
      { id: 'income', name: 'Receitas', path: '/income' },
      {
        id: 'bank-movement',
        name: 'Movimentos Bancários',
        path: '/bank-movement',
      },
      {
        id: 'customer-extract-history',
        name: 'Extrato de Cliente',
        path: '/customer-extract-history',
      },
      {
        id: 'accounts-statements',
        name: 'Extrato de Contas',
        path: '/accounts-statements',
      },
      {
        id: 'sales-contracts',
        name: 'Contratos de Venda',
        path: '/sales-contracts',
      },
      { id: 'sales', name: 'Vendas', path: '/sales' },
      {
        id: 'supply-contracts-measurements-all',
        name: 'Medições de Contratos',
        path: '/supply-contracts/measurements/all',
      },
      {
        id: 'supply-contracts-measurements-attachments-all',
        name: 'Anexos de Medição',
        path: '/supply-contracts/measurements/attachments/all',
      },
      {
        id: 'construction-daily-report-event-type',
        name: 'Tipos de Ocorrência',
        path: '/construction-daily-report/event-type',
      },
      {
        id: 'construction-daily-report-types',
        name: 'Tipos de Diário de Obra',
        path: '/construction-daily-report/types',
      },
      { id: 'hooks', name: 'Webhooks', path: '/hooks' },
      { id: 'patrimony-fixed', name: 'Patrimônio', path: '/patrimony/fixed' },
    ];

    // Primeiro: testar conectividade com cada endpoint
    console.log('🔍 Testando conectividade com endpoints...');
    const validEndpoints: typeof endpoints = [];

    for (const endpoint of endpoints) {
      setSyncProgress(prev => ({ ...prev, [endpoint.id]: 'syncing' }));

      try {
        // Teste simples com limite baixo
        const testParams = new URLSearchParams({
          endpoint: endpoint.path,
          limit: '1', // Apenas 1 registro para teste
        });

        const testResponse = await fetch(`/api/sienge/proxy?${testParams}`);

        if (testResponse.ok) {
          const testResult = await testResponse.json();
          console.log(`🔍 Debug ${endpoint.name}:`, {
            success: testResult.success,
            dataLength: Array.isArray(testResult.data)
              ? testResult.data.length
              : 'não é array',
            dataType: typeof testResult.data,
            fullResponse: testResult,
          });

          if (testResult.success) {
            const dataLength = Array.isArray(testResult.data)
              ? testResult.data.length
              : 0;
            console.log(
              `✅ ${endpoint.name}: Acesso permitido (${dataLength} registros no teste)`
            );
            validEndpoints.push(endpoint);
            setSyncProgress(prev => ({ ...prev, [endpoint.id]: 'completed' }));
          } else {
            console.log(
              `❌ ${endpoint.name}: ${testResult.error || 'Erro desconhecido'}`
            );
            setSyncProgress(prev => ({ ...prev, [endpoint.id]: 'error' }));
          }
        } else {
          console.log(`❌ ${endpoint.name}: HTTP ${testResponse.status}`);
          setSyncProgress(prev => ({ ...prev, [endpoint.id]: 'error' }));
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: Erro de conexão`);
        setSyncProgress(prev => ({ ...prev, [endpoint.id]: 'error' }));
      }

      // Aguardar um pouco entre testes
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(
      `📊 Endpoints válidos encontrados: ${validEndpoints.length}/${endpoints.length}`
    );

    if (validEndpoints.length === 0) {
      setSubmitStatus('error');
      setErrorMessage('Nenhum endpoint está acessível com suas credenciais');
      return;
    }

    // Agora sincronizar apenas os endpoints válidos
    console.log('🔄 Iniciando sincronização dos endpoints válidos...');

    // Calcular data de 1 ano atrás
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const dateFilter = oneYearAgo.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    // Parâmetros específicos por endpoint
    const endpointParams: Record<string, Record<string, any>> = {
      customers: { limit: 1000 },
      companies: { limit: 100 },
      enterprises: { limit: 100 },
      units: { limit: 1000 },
      'units-characteristics': { limit: 100 },
      'units-situations': { limit: 100 },
      income: {
        startDate: dateFilter,
        endDate: today,
        selectionType: 'D',
        limit: 1000,
      },
      'bank-movement': { startDate: dateFilter, endDate: today, limit: 1000 },
      'customer-extract-history': {
        startDueDate: dateFilter,
        endDueDate: today,
        limit: 1000,
      },
      'accounts-statements': {
        startDate: dateFilter,
        endDate: today,
        limit: 1000,
      },
      'sales-contracts': { limit: 1000 },
      sales: {
        createdAfter: dateFilter,
        createdBefore: today,
        situation: 'SOLD',
        limit: 1000,
      },
      'supply-contracts-measurements-all': { limit: 1000 },
      'supply-contracts-measurements-attachments-all': {
        measurementStartDate: dateFilter,
        measurementEndDate: today,
        limit: 1000,
      },
      'construction-daily-report-event-type': { limit: 100 },
      'construction-daily-report-types': { limit: 100 },
      hooks: { limit: 100 },
      'patrimony-fixed': { limit: 1000 },
    };

    const results: any[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Sincronizar apenas os endpoints válidos
    for (const endpoint of validEndpoints) {
      setSyncProgress(prev => ({ ...prev, [endpoint.id]: 'syncing' }));

      try {
        const params = endpointParams[endpoint.id] || { limit: 1000 };
        const queryParams = new URLSearchParams({
          endpoint: endpoint.path,
          ...Object.entries(params).reduce(
            (acc, [key, value]) => {
              acc[key] = String(value);
              return acc;
            },
            {} as Record<string, string>
          ),
        });

        const response = await fetch(`/api/sienge/proxy?${queryParams}`);
        const result = await response.json();

        console.log(`🔄 Sincronização ${endpoint.name}:`, {
          success: result.success,
          dataLength: Array.isArray(result.data)
            ? result.data.length
            : 'não é array',
          dataType: typeof result.data,
          params: params,
          statusCode: response.status,
        });

        if (response.ok && result.success) {
          const data = Array.isArray(result.data) ? result.data : [];
          setSyncProgress(prev => ({ ...prev, [endpoint.id]: 'completed' }));
          results.push({
            endpoint: endpoint.name,
            path: endpoint.path,
            count: data.length,
            success: true,
          });
          successCount++;
        } else {
          setSyncProgress(prev => ({ ...prev, [endpoint.id]: 'error' }));
          results.push({
            endpoint: endpoint.name,
            path: endpoint.path,
            count: 0,
            success: false,
            error:
              result.error ||
              `HTTP ${response.status}: ${result.message || 'Erro desconhecido'}`,
            statusCode: response.status,
          });
          errorCount++;
        }
      } catch (error) {
        setSyncProgress(prev => ({ ...prev, [endpoint.id]: 'error' }));
        results.push({
          endpoint: endpoint.name,
          path: endpoint.path,
          count: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Erro de conexão',
        });
        errorCount++;
      }

      // Aguardar um pouco entre endpoints
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Adicionar endpoints que falharam no teste de conectividade
    const failedEndpoints = endpoints.filter(
      ep => !validEndpoints.some(ve => ve.id === ep.id)
    );
    for (const endpoint of failedEndpoints) {
      results.push({
        endpoint: endpoint.name,
        path: endpoint.path,
        count: 0,
        success: false,
        error:
          '403 Forbidden: Permission denied - Usuário não tem permissão para acessar este endpoint',
        statusCode: 403,
      });
      errorCount++;
    }

    setSyncResults(results);
    setIsConfigured(true);
    onConfigurationChange(true);
    onSyncCompleted(results);

    if (errorCount === 0) {
      setSubmitStatus('success');
    } else if (successCount > 0) {
      setSubmitStatus('success');
      setErrorMessage(
        `Sincronização parcial: ${successCount} sucessos, ${errorCount} erros`
      );
    } else {
      setSubmitStatus('error');
      setErrorMessage('Falha na sincronização de todos os endpoints');
    }
  };

  if (isConfigured && submitStatus === 'success') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Sincronização Concluída!
              </h3>
              <p className="text-gray-600">
                Dados sincronizados com sucesso da API Sienge
              </p>
            </div>
          </div>
        </div>

        {/* Resumo da sincronização */}
        <div
          className={`border rounded-lg p-4 mb-4 ${
            syncResults.filter(r => !r.success).length === 0
              ? 'bg-green-50 border-green-200'
              : syncResults.filter(r => r.success).length > 0
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-red-50 border-red-200'
          }`}
        >
          <h4
            className={`font-medium mb-2 ${
              syncResults.filter(r => !r.success).length === 0
                ? 'text-green-800'
                : syncResults.filter(r => r.success).length > 0
                  ? 'text-yellow-800'
                  : 'text-red-800'
            }`}
          >
            Resumo da Sincronização:
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Período:</span> Último ano
            </div>
            <div>
              <span className="font-medium">Endpoints:</span>{' '}
              {syncResults.length} testados
            </div>
            <div>
              <span className="font-medium">Sucessos:</span>{' '}
              {syncResults.filter(r => r.success).length}
            </div>
            <div>
              <span className="font-medium">Erros:</span>{' '}
              {syncResults.filter(r => !r.success).length}
            </div>
          </div>

          {/* Resumo de erros */}
          {syncResults.filter(r => !r.success).length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm">
                <span className="font-medium">Principais erros:</span>
                <ul className="mt-1 space-y-1 text-xs">
                  {Array.from(
                    new Set(
                      syncResults.filter(r => !r.success).map(r => r.error)
                    )
                  )
                    .slice(0, 3)
                    .map((error, index) => (
                      <li key={index} className="text-red-700">
                        • {error}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Lista de resultados */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-2">
            Resultados por Endpoint:
          </h4>
          {syncResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <span
                    className={`mr-3 text-lg ${result.success ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {result.success ? '✅' : '❌'}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {result.endpoint}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <code className="bg-white px-2 py-1 rounded text-xs">
                        {result.path}
                      </code>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {result.success ? (
                    <div className="text-sm text-green-700 font-medium">
                      {result.count} registros
                    </div>
                  ) : (
                    <div className="text-sm text-red-700">
                      <div className="font-medium">
                        {result.statusCode
                          ? `HTTP ${result.statusCode}`
                          : 'Erro'}
                      </div>
                      <div className="text-xs mt-1 max-w-xs break-words">
                        {result.error}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Configuração da API Sienge
          </h3>
          <p className="text-gray-600">
            Configure suas credenciais para sincronizar automaticamente todos os
            dados
          </p>
        </div>
      </div>

      {/* Informações sobre o período */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-blue-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="font-medium text-blue-800">
              Período de Sincronização
            </h4>
            <p className="text-sm text-blue-700">
              Os dados serão sincronizados automaticamente do{' '}
              <strong>último ano</strong> até hoje. Endpoints que requerem
              período específico usarão este filtro automaticamente.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Subdomain Field */}
        <div>
          <label
            htmlFor="subdomain"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subdomínio da API Sienge
          </label>
          <div className="relative">
            <input
              {...register('subdomain', {
                required: 'Subdomínio é obrigatório',
              })}
              type="text"
              id="subdomain"
              className={`block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.subdomain
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder="exemplo"
              disabled={isSubmitting}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">.sienge.com.br</span>
            </div>
          </div>
          {errors.subdomain && (
            <p className="mt-1 text-sm text-red-600">
              {errors.subdomain.message}
            </p>
          )}
        </div>

        {/* Username Field */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome de Usuário
          </label>
          <input
            {...register('username', {
              required: 'Nome de usuário é obrigatório',
            })}
            type="text"
            id="username"
            className={`block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Seu nome de usuário da API"
            disabled={isSubmitting}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Senha
          </label>
          <input
            {...register('password', { required: 'Senha é obrigatória' })}
            type="password"
            id="password"
            className={`block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Sua senha da API"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Status Messages */}
        {submitStatus === 'syncing' && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="animate-spin h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Sincronizando dados...
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Aguarde enquanto todos os endpoints são sincronizados
                  automaticamente
                </p>
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro na sincronização
                </h3>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sincronizando...
              </>
            ) : (
              'Configurar e Sincronizar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
