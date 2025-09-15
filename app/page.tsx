'use client';

import { useState } from 'react';
import { ConfigurationSection } from './components/ConfigurationSection';
import { SyncGroupsSection } from './components/SyncGroupsSection';
import { PowerBILinksSection } from './components/PowerBILinksSection';

export default function Home() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [completedGroups, setCompletedGroups] = useState<string[]>([]);

  const handleConfigurationChange = (configured: boolean) => {
    setIsConfigured(configured);
  };

  const handleSyncCompleted = (groups: string[]) => {
    setCompletedGroups(groups);
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
            Sincronização direta de dados da API Sienge para análise no Power BI
          </p>
        </header>

        {/* Configuration Section */}
        <ConfigurationSection
          onConfigurationChange={handleConfigurationChange}
        />

        {/* Sync Groups Section */}
        <SyncGroupsSection
          isConfigured={isConfigured}
          onSyncCompleted={handleSyncCompleted}
        />

        {/* Power BI Links Section */}
        {completedGroups.length > 0 && (
          <PowerBILinksSection completedGroups={completedGroups} />
        )}

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
