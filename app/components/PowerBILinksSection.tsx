'use client';

interface PowerBILinksProps {
  syncResults: any[];
}

export function PowerBILinksSection({ syncResults }: PowerBILinksProps) {
  if (syncResults.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
          <svg
            className="w-5 h-5 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Conexão Direta ao PostgreSQL
          </h3>
          <p className="text-gray-600">
            Conecte diretamente ao banco PostgreSQL para máxima performance
          </p>
        </div>
      </div>

      {/* Informações de conexão */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">
          💡 Dicas para Conexão Direta:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • Use <strong>Obter Dados &gt; Banco de dados PostgreSQL</strong>
          </li>
          <li>
            • Servidor:{' '}
            <strong>
              {process.env.PRIMARY_DOMAIN || 'localhost'}:
              {process.env.DB_PORT_EXTERNAL || '5432'}
            </strong>
          </li>
          <li>
            • Banco: <strong>{process.env.POSTGRES_DB || 'sienge_data'}</strong>
          </li>
          <li>
            • Usuário:{' '}
            <strong>{process.env.POSTGRES_USER || 'sienge_app'}</strong>
          </li>
          <li>
            • Modo: <strong>Importar</strong> para melhor performance
          </li>
          <li>
            • Configure <strong>atualização automática</strong> para dados
            sempre atualizados
          </li>
          <li>
            • Use <strong>consultas SQL personalizadas</strong> para filtrar
            dados específicos
          </li>
        </ul>
      </div>
    </div>
  );
}