'use client';

import { useState, useEffect } from 'react';
import { formatSaoPauloDateTime } from '@/lib/date-helper';

interface SyncLog {
  id: number;
  entityType: string;
  startedAt: string;
  completedAt: string | null;
  status: string;
  recordsProcessed: number;
  recordsInserted: number;
  recordsUpdated: number;
  recordsErrors: number;
  duration: number;
  errorMessage?: string | null;
}

interface SyncLogsHistoryProps {
  isVisible: boolean;
}

export function SyncLogsHistory({ isVisible }: SyncLogsHistoryProps) {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isVisible) {
      fetchLogs();
    }
  }, [isVisible]);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/sync/status?limit=20');
      const data = await response.json();

      if (data.success && data.data.syncs) {
        setLogs(data.data.syncs);
      } else {
        setError('Erro ao carregar histórico de sincronizações');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro ao buscar logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      completed_with_errors: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
      error: 'bg-red-100 text-red-800 border-red-200',
    };

    const statusText = {
      completed: 'Concluído',
      completed_with_errors: 'Concluído c/ Erros',
      in_progress: 'Em Progresso',
      cancelled: 'Cancelado',
      error: 'Erro',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          statusStyles[status as keyof typeof statusStyles] ||
          statusStyles.error
        }`}
      >
        {statusText[status as keyof typeof statusText] || status}
      </span>
    );
  };

  const formatEntityType = (entityType: string) => {
    const entityLabels = {
      customers: 'Clientes',
      companies: 'Empresas',
      enterprises: 'Empreendimentos',
      units: 'Unidades',
      'sales-contracts': 'Contratos de Venda',
      'cost-centers': 'Centros de Custo',
      'payment-categories': 'Planos Financeiros',
      'accounts-statements': 'Extratos de Contas',
      hooks: 'Webhooks',
      'units-situations': 'Situações de Unidade',
    };

    return entityLabels[entityType as keyof typeof entityLabels] || entityType;
  };

  const formatDuration = (duration: number) => {
    if (duration < 60) {
      return `${duration}s`;
    } else {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}m ${seconds}s`;
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Histórico de Sincronizações
            </h3>
            <p className="text-gray-600">
              Últimas 20 sincronizações realizadas (horário de Brasília)
            </p>
          </div>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma sincronização encontrada</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Iniciado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concluído
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registros
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duração
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatEntityType(log.entityType)}
                    </div>
                    <div className="text-sm text-gray-500">#{log.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatSaoPauloDateTime(new Date(log.startedAt))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.completedAt
                      ? formatSaoPauloDateTime(new Date(log.completedAt))
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(log.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {log.recordsProcessed.toLocaleString('pt-BR')}
                      </span>
                      {log.recordsErrors > 0 && (
                        <span className="text-xs text-red-600">
                          {log.recordsErrors} erros
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(log.duration)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
