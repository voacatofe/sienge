'use client';

import { useState, useEffect } from 'react';
import { StatusIndicator } from './StatusIndicator';

interface SyncStatusData {
  id: string;
  status: string;
  isRunning: boolean;
  progress: number;
  recordsProcessed: number;
  recordsInserted: number;
  recordsUpdated: number;
  recordsErrors: number;
  apiCallsMade: number;
  startedAt: string;
  completedAt?: string;
  duration: number;
}

interface SyncStatusProps {
  onSyncComplete?: () => void;
}

export function SyncStatus({ onSyncComplete }: SyncStatusProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/sync/status');
      const data = await response.json();

      if (data.success) {
        setSyncStatus(data.sync);
        setError(null);

        // Se a sincronização terminou, chamar callback
        if (!data.sync.isRunning && onSyncComplete) {
          onSyncComplete();
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erro ao buscar status da sincronização');
      console.error('Erro ao buscar status:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelSync = async () => {
    try {
      const response = await fetch('/api/sync/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      });

      const data = await response.json();
      if (data.success) {
        // Recarregar status após cancelamento
        await fetchStatus();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erro ao cancelar sincronização');
      console.error('Erro ao cancelar:', err);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Se há sincronização em andamento, atualizar a cada 5 segundos
    const interval = setInterval(() => {
      if (syncStatus?.isRunning) {
        fetchStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [syncStatus?.isRunning]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-2 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
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
            <h3 className="text-sm font-medium text-red-800">Erro</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!syncStatus) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">Nenhuma sincronização encontrada</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'blue';
      case 'completed':
        return 'green';
      case 'completed_with_errors':
        return 'yellow';
      case 'cancelled':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'Em andamento';
      case 'completed':
        return 'Concluída';
      case 'completed_with_errors':
        return 'Concluída com erros';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Status da Sincronização
        </h3>
        <div className="flex items-center space-x-2">
          <StatusIndicator />
          <span className="text-sm font-medium text-gray-700">
            {getStatusText(syncStatus.status)}
          </span>
        </div>
      </div>

      {syncStatus.isRunning && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>{syncStatus.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${syncStatus.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {syncStatus.recordsProcessed.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Processados</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {syncStatus.recordsInserted.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Inseridos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {syncStatus.recordsUpdated.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Atualizados</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {syncStatus.recordsErrors.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Erros</div>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span>Chamadas de API:</span>
          <span className="font-medium">{syncStatus.apiCallsMade}</span>
        </div>
        <div className="flex justify-between">
          <span>Duração:</span>
          <span className="font-medium">{syncStatus.duration} minutos</span>
        </div>
        <div className="flex justify-between">
          <span>Iniciado em:</span>
          <span className="font-medium">
            {new Date(syncStatus.startedAt).toLocaleString('pt-BR')}
          </span>
        </div>
        {syncStatus.completedAt && (
          <div className="flex justify-between">
            <span>Concluído em:</span>
            <span className="font-medium">
              {new Date(syncStatus.completedAt).toLocaleString('pt-BR')}
            </span>
          </div>
        )}
      </div>

      {syncStatus.isRunning && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={cancelSync}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Cancelar Sincronização
          </button>
        </div>
      )}
    </div>
  );
}
