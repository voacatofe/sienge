'use client';

import { useState } from 'react';
import { ConfigurationSection } from './components/ConfigurationSection';
import { PowerBILinksSection } from './components/PowerBILinksSection';

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
