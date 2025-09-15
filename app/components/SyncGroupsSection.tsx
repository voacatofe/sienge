'use client';

import { useState, useEffect } from 'react';

interface EntityGroup {
  id: string;
  name: string;
  description: string;
  entities: string[];
  icon: string;
  color: string;
}

interface SyncGroupsSectionProps {
  isConfigured: boolean;
  onSyncCompleted: (completedGroups: string[]) => void;
}

const ENTITY_GROUPS: EntityGroup[] = [
  {
    id: 'basic-data',
    name: 'Dados Básicos',
    description: 'Clientes, empresas, empreendimentos e unidades',
    entities: [
      'customers',
      'companies',
      'enterprises',
      'units',
      'units-characteristics',
      'units-situations',
    ],
    icon: '🏢',
    color: 'blue',
  },
  {
    id: 'financial-data',
    name: 'Dados Financeiros',
    description: 'Receitas, movimentos bancários e extratos por período',
    entities: [
      'income',
      'bank-movement',
      'customer-extract-history',
      'accounts-statements',
    ],
    icon: '💰',
    color: 'green',
  },
  {
    id: 'sales-data',
    name: 'Dados de Vendas',
    description: 'Contratos de venda e vendas por empreendimento',
    entities: ['sales-contracts', 'sales'],
    icon: '📊',
    color: 'purple',
  },
  {
    id: 'construction-data',
    name: 'Dados de Obra',
    description: 'Medições, anexos e relatórios de obra',
    entities: [
      'supply-contracts-measurements-all',
      'supply-contracts-measurements-attachments-all',
      'construction-daily-report-event-type',
      'construction-daily-report-types',
    ],
    icon: '🏗️',
    color: 'orange',
  },
  {
    id: 'system-data',
    name: 'Dados do Sistema',
    description: 'Webhooks, patrimônio e tipos de ocorrência',
    entities: ['hooks', 'patrimony-fixed'],
    icon: '⚙️',
    color: 'gray',
  },
];

export function SyncGroupsSection({
  isConfigured,
  onSyncCompleted,
}: SyncGroupsSectionProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState<
    'idle' | 'syncing' | 'completed' | 'error'
  >('idle');
  const [syncProgress, setSyncProgress] = useState<{
    [key: string]: 'pending' | 'syncing' | 'completed' | 'error';
  }>({});
  const [syncResults, setSyncResults] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSelectAll = () => {
    if (selectedGroups.length === ENTITY_GROUPS.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(ENTITY_GROUPS.map(group => group.id));
    }
  };

  const startSync = async () => {
    if (selectedGroups.length === 0) return;

    setSyncStatus('syncing');
    setSyncResults([]);
    setErrorMessage('');

    // Inicializar progresso
    const initialProgress: {
      [key: string]: 'pending' | 'syncing' | 'completed' | 'error';
    } = {};
    selectedGroups.forEach(groupId => {
      initialProgress[groupId] = 'pending';
    });
    setSyncProgress(initialProgress);

    try {
      const completedGroups: string[] = [];

      for (const groupId of selectedGroups) {
        setSyncProgress(prev => ({ ...prev, [groupId]: 'syncing' }));

        const group = ENTITY_GROUPS.find(g => g.id === groupId);
        if (!group) continue;

        try {
          // Mapear entidades para endpoints da API Sienge (apenas os que existem)
          const endpointMap: Record<string, string[]> = {
            customers: ['/customers'],
            companies: ['/companies'],
            enterprises: ['/enterprises'],
            units: ['/units'],
            'units-characteristics': ['/units/characteristics'],
            'units-situations': ['/units/situations'],
            income: ['/income'],
            'bank-movement': ['/bank-movement'],
            'customer-extract-history': ['/customer-extract-history'],
            'accounts-statements': ['/accounts-statements'],
            'sales-contracts': ['/sales-contracts'],
            sales: ['/sales'],
            'supply-contracts-measurements-all': [
              '/supply-contracts/measurements/all',
            ],
            'supply-contracts-measurements-attachments-all': [
              '/supply-contracts/measurements/attachments/all',
            ],
            'construction-daily-report-event-type': [
              '/construction-daily-report/event-type',
            ],
            'construction-daily-report-types': [
              '/construction-daily-report/types',
            ],
            hooks: ['/hooks'],
            'patrimony-fixed': ['/patrimony/fixed'],
          };

          // Calcular data de 1 ano atrás para filtros
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          const dateFilter = oneYearAgo.toISOString().split('T')[0]; // YYYY-MM-DD

          let totalRecords = 0;
          const groupResults: any[] = [];

          // Processar cada entidade do grupo
          for (const entity of group.entities) {
            const endpoints = endpointMap[entity];
            if (!endpoints) continue;

            // Parâmetros específicos por entidade com filtro de data
            const entityParams: Record<string, Record<string, any>> = {
              customers: {
                limit: 1000,
              },
              companies: {
                limit: 100,
              },
              enterprises: {
                limit: 100,
              },
              units: {
                limit: 1000,
              },
              'units-characteristics': {
                limit: 100,
              },
              'units-situations': {
                limit: 100,
              },
              income: {
                startDate: dateFilter,
                endDate: new Date().toISOString().split('T')[0],
                selectionType: 'D',
                limit: 1000,
              },
              'bank-movement': {
                startDate: dateFilter,
                endDate: new Date().toISOString().split('T')[0],
                limit: 1000,
              },
              'customer-extract-history': {
                startDueDate: dateFilter,
                endDueDate: new Date().toISOString().split('T')[0],
                limit: 1000,
              },
              'accounts-statements': {
                startDate: dateFilter,
                endDate: new Date().toISOString().split('T')[0],
                limit: 1000,
              },
              'sales-contracts': {
                limit: 1000,
              },
              sales: {
                createdAfter: dateFilter,
                createdBefore: new Date().toISOString().split('T')[0],
                situation: 'SOLD',
                limit: 1000,
              },
              'supply-contracts-measurements-all': {
                limit: 1000,
              },
              'supply-contracts-measurements-attachments-all': {
                measurementStartDate: dateFilter,
                measurementEndDate: new Date().toISOString().split('T')[0],
                limit: 1000,
              },
              'construction-daily-report-event-type': {
                limit: 100,
              },
              'construction-daily-report-types': {
                limit: 100,
              },
              hooks: {
                limit: 100,
              },
              'patrimony-fixed': {
                limit: 1000,
              },
            };

            // Tentar cada endpoint até encontrar um que funcione
            let entityData: any[] = [];
            let successfulEndpoint = '';

            for (const endpoint of endpoints) {
              try {
                const params = entityParams[entity] || {};
                const queryParams = new URLSearchParams({
                  endpoint,
                  ...Object.entries(params).reduce(
                    (acc, [key, value]) => {
                      acc[key] = String(value);
                      return acc;
                    },
                    {} as Record<string, string>
                  ),
                });

                const response = await fetch(
                  `/api/sienge/proxy?${queryParams}`
                );
                const result = await response.json();

                if (response.ok && result.success) {
                  entityData = Array.isArray(result.data) ? result.data : [];
                  successfulEndpoint = endpoint;
                  break;
                }
              } catch (error) {
                console.warn(
                  `Falha com endpoint ${endpoint} para ${entity}:`,
                  error
                );
                continue;
              }
            }

            if (entityData.length > 0) {
              totalRecords += entityData.length;
              groupResults.push({
                entity,
                endpoint: successfulEndpoint,
                count: entityData.length,
                data: entityData,
              });
            }
          }

          if (totalRecords > 0) {
            setSyncProgress(prev => ({ ...prev, [groupId]: 'completed' }));
            completedGroups.push(groupId);
            setSyncResults(prev => [
              ...prev,
              {
                groupId,
                group: group.name,
                result: {
                  success: true,
                  totalRecords,
                  entities: groupResults,
                },
              },
            ]);
          } else {
            setSyncProgress(prev => ({ ...prev, [groupId]: 'error' }));
            setErrorMessage(
              prev =>
                prev + `Nenhum dado encontrado para o grupo ${group.name}. `
            );
          }
        } catch (error) {
          setSyncProgress(prev => ({ ...prev, [groupId]: 'error' }));
          setErrorMessage(
            prev =>
              prev +
              `Erro no grupo ${group.name}: ${
                error instanceof Error ? error.message : 'Erro desconhecido'
              }. `
          );
        }

        // Aguardar um pouco entre grupos
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setSyncStatus('completed');
      onSyncCompleted(completedGroups);
    } catch (error) {
      setSyncStatus('error');
      setErrorMessage('Erro geral na sincronização');
    }
  };

  const resetSync = () => {
    setSyncStatus('idle');
    setSyncProgress({});
    setSyncResults([]);
    setErrorMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center mb-6">
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Sincronização Direta da API Sienge
          </h3>
          <p className="text-gray-600">
            Selecione os grupos de dados que deseja sincronizar diretamente da
            API Sienge (último ano)
          </p>
        </div>
      </div>

      {syncStatus === 'idle' && (
        <>
          {/* Controles de seleção */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedGroups.length} de {ENTITY_GROUPS.length} grupos
              selecionados
            </span>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              {selectedGroups.length === ENTITY_GROUPS.length
                ? 'Desmarcar Todos'
                : 'Selecionar Todos'}
            </button>
          </div>

          {/* Lista de grupos */}
          <div className="grid gap-4 mb-6">
            {ENTITY_GROUPS.map(group => {
              const isSelected = selectedGroups.includes(group.id);
              const colorClasses = {
                green: 'border-green-200 bg-green-50 text-green-700',
                blue: 'border-blue-200 bg-blue-50 text-blue-700',
                purple: 'border-purple-200 bg-purple-50 text-purple-700',
              };

              return (
                <div
                  key={group.id}
                  onClick={() => handleGroupSelection(group.id)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${
                      isSelected
                        ? `${colorClasses[group.color as keyof typeof colorClasses]} border-opacity-100 bg-opacity-100`
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className="flex items-center flex-1">
                      <span className="text-2xl mr-3">{group.icon}</span>
                      <div>
                        <h4
                          className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}
                        >
                          {group.name}
                        </h4>
                        <p
                          className={`text-sm ${isSelected ? 'text-gray-700' : 'text-gray-600'}`}
                        >
                          {group.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {group.entities.length} entidades
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                        isSelected
                          ? 'border-current bg-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botão de sincronização */}
          <button
            onClick={startSync}
            disabled={selectedGroups.length === 0}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              selectedGroups.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            }`}
          >
            Iniciar Sincronização ({selectedGroups.length} grupos)
          </button>
        </>
      )}

      {syncStatus === 'syncing' && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Sincronizando Dados...
            </h4>
            <p className="text-gray-600">
              Por favor, aguarde enquanto os dados são sincronizados
            </p>
          </div>

          {ENTITY_GROUPS.map(group => {
            if (!selectedGroups.includes(group.id)) return null;

            const status = syncProgress[group.id];
            const statusConfig = {
              pending: {
                icon: '⏳',
                text: 'Aguardando',
                color: 'text-gray-500',
              },
              syncing: {
                icon: '🔄',
                text: 'Sincronizando...',
                color: 'text-blue-600',
              },
              completed: {
                icon: '✅',
                text: 'Concluído',
                color: 'text-green-600',
              },
              error: { icon: '❌', text: 'Erro', color: 'text-red-600' },
            };

            return (
              <div
                key={group.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-xl mr-3">{group.icon}</span>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{group.name}</h5>
                  <p className="text-sm text-gray-600">
                    {group.entities.length} entidades
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">{statusConfig[status].icon}</span>
                  <span
                    className={`text-sm font-medium ${statusConfig[status].color}`}
                  >
                    {statusConfig[status].text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {syncStatus === 'completed' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Sincronização Concluída!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  {syncResults.length} grupos sincronizados com sucesso
                </p>
                <div className="mt-2 text-xs text-green-600">
                  {syncResults.map((result, index) => (
                    <div key={index}>
                      {result.group}: {result.result.totalRecords} registros
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={resetSync}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Nova Sincronização
          </button>
        </div>
      )}

      {syncStatus === 'error' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
                  Erro na Sincronização
                </h3>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>

          <button
            onClick={resetSync}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
}
