'use client'

import { useLoading, useError, useSyncStatus } from '../context/AppContext'

export function StatusIndicator() {
  const { isLoading, setLoading } = useLoading()
  const { error, clearError } = useError()
  const { syncStatus, setSyncStatus } = useSyncStatus()

  const handleTestSync = () => {
    setLoading(true)
    clearError()
    
    // Simular sincronização
    setSyncStatus({ isRunning: true, progress: 0 })
    
    const interval = setInterval(() => {
      setSyncStatus(prev => ({
        ...prev,
        progress: Math.min((prev?.progress || 0) + 10, 100)
      }))
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setLoading(false)
      setSyncStatus({ 
        isRunning: false, 
        progress: 100,
        lastSync: new Date()
      })
    }, 2000)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Status do Sistema
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Carregando:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
          }`}>
            {isLoading ? 'Sim' : 'Não'}
          </span>
        </div>

        {error && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Erro:</span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
              {error}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Sincronização:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            syncStatus.isRunning ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {syncStatus.isRunning ? 'Em andamento' : 'Parada'}
          </span>
        </div>

        {syncStatus.isRunning && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${syncStatus.progress}%` }}
            ></div>
          </div>
        )}

        {syncStatus.lastSync && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Última sincronização:</span>
            <span className="text-xs text-gray-500">
              {syncStatus.lastSync.toLocaleString('pt-BR')}
            </span>
          </div>
        )}

        <button
          onClick={handleTestSync}
          disabled={isLoading}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Sincronizando...' : 'Testar Sincronização'}
        </button>
      </div>
    </div>
  )
}
