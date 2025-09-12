'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SyncEntity {
  name: string;
  endpoint: string;
  description: string;
  enabled: boolean;
}

export default function SyncPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [syncProgress, setSyncProgress] = useState(0);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState<Record<string, boolean>>({
    customers: true,
    companies: true,
    projects: true,
    costCenters: true,
  });

  useEffect(() => {
    // Verificar se existem credenciais salvas
    checkCredentials();
  }, []);

  const checkCredentials = async () => {
    try {
      const response = await fetch('/api/config');
      const result = await response.json();
      setHasCredentials(result.success && result.data !== null);
    } catch (error) {
      setHasCredentials(false);
    }
  };

  const entities: SyncEntity[] = [
    {
      name: 'Clientes',
      endpoint: 'customers',
      description: 'Sincronizar lista de clientes da empresa',
      enabled: true
    },
    {
      name: 'Empresas',
      endpoint: 'companies',
      description: 'Sincronizar dados da empresa/filiais',
      enabled: true
    },
    {
      name: 'Projetos',
      endpoint: 'projects',
      description: 'Sincronizar empreendimentos e obras',
      enabled: true
    },
    {
      name: 'Centros de Custo',
      endpoint: 'costCenters',
      description: 'Sincronizar estrutura organizacional',
      enabled: true
    }
  ];

  const handleEntityToggle = (endpoint: string) => {
    setSelectedEntities(prev => ({
      ...prev,
      [endpoint]: !prev[endpoint]
    }));
  };

  const handleSync = async () => {
    setIsLoading(true);
    setSyncStatus('Iniciando sincronização...');
    setSyncProgress(0);

    try {
      const entitiesToSync = entities
        .filter(e => selectedEntities[e.endpoint])
        .map(e => e.endpoint);

      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entities: entitiesToSync
        })
      });

      const result = await response.json();

      if (result.success) {
        setSyncStatus('Sincronização concluída com sucesso!');
        setSyncProgress(100);
        
        // Mostrar resumo
        if (result.summary) {
          const { totalProcessed, totalErrors } = result.summary;
          setSyncStatus(
            `Sincronização concluída: ${totalProcessed} registros processados` +
            (totalErrors > 0 ? `, ${totalErrors} erros` : '')
          );
        }
      } else {
        setSyncStatus(`Erro: ${result.message}`);
      }
      
    } catch (error) {
      setSyncStatus('Erro durante a sincronização');
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao início
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Sincronização de Dados
          </h1>
          <p className="text-gray-600 mt-2">
            Selecione as entidades que deseja sincronizar com a API Sienge
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Entities Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Entidades Disponíveis
            </h2>
            
            <div className="space-y-3">
              {entities.map((entity) => (
                <label
                  key={entity.endpoint}
                  className="flex items-start cursor-pointer hover:bg-gray-50 p-3 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={selectedEntities[entity.endpoint]}
                    onChange={() => handleEntityToggle(entity.endpoint)}
                    disabled={!entity.enabled || isLoading}
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-gray-900">{entity.name}</span>
                    <p className="text-sm text-gray-600">{entity.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleSync}
              disabled={isLoading || !Object.values(selectedEntities).some(v => v)}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sincronizando...' : 'Iniciar Sincronização'}
            </button>

            {!hasCredentials && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Nenhuma credencial configurada. 
                  <Link href="/config" className="ml-1 font-medium underline">
                    Configure suas credenciais primeiro
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Status Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Status da Sincronização
            </h2>

            {syncStatus && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">{syncStatus}</p>
                {isLoading && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${syncProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Recent Sync Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Informações</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• A sincronização pode demorar alguns minutos</li>
                <li>• Não feche esta página durante o processo</li>
                <li>• Os dados existentes serão atualizados</li>
                <li>• Novos registros serão adicionados</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              <Link
                href="/dashboard"
                className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ver Dashboard
              </Link>
              <Link
                href="/logs"
                className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ver Logs de Sincronização
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}