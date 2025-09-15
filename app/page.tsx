'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PowerBILinksSection } from './components/PowerBILinksSection';

// Carregar ConfigurationSection dinamicamente para evitar problemas de SSR
const ConfigurationSection = dynamic(
  () => import('./components/ConfigurationSection').then(mod => ({ default: mod.ConfigurationSection })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }
);

export default function Home() {
  const [syncCompleted, setSyncCompleted] = useState(false);
  const [syncResults, setSyncResults] = useState<any[]>([]);

  const handleConfigurationChange = () => {
    // Callback para quando a configuração mudar (se necessário no futuro)
  };

  const handleSyncCompleted = (results: any[]) => {
    setSyncCompleted(true);
    setSyncResults(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sienge Data Sync
          </h1>
          <p className="text-lg text-gray-600">
            Sincronização automática de dados da API Sienge para análise no
            Power BI
          </p>
        </header>

        {/* Configuration Section */}
        <ConfigurationSection
          onConfigurationChange={handleConfigurationChange}
          onSyncCompleted={handleSyncCompleted}
        />

        {/* Power BI Links Section */}
        {syncCompleted && <PowerBILinksSection syncResults={syncResults} />}

        {/* Footer */}
        <footer className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Desenvolvido com ❤️ para facilitar a integração com dados do Sienge
          </p>
        </footer>
      </div>
    </div>
  );
}
