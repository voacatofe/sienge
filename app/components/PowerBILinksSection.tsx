'use client';

interface PowerBILinksProps {
  syncResults: any[];
}

export function PowerBILinksSection({ syncResults }: PowerBILinksProps) {
  if (syncResults.length === 0) {
    return null;
  }

  // URL da API do Data Warehouse
  const baseUrl = process.env.NEXT_PUBLIC_PRIMARY_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_PRIMARY_DOMAIN}`
    : typeof window !== 'undefined'
      ? window.location.origin
      : '';
  const dataWarehouseUrl = `${baseUrl}/api/datawarehouse/vendas`;

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(dataWarehouseUrl);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
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
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            API do Data Warehouse
          </h3>
          <p className="text-gray-600">
            Conecte via API REST para máxima flexibilidade e atualizações
            automáticas
          </p>
        </div>
      </div>

      {/* URL da API */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
        <h4 className="font-medium text-blue-900 mb-2">🔗 URL da API:</h4>
        <div className="bg-white p-3 rounded border border-blue-300">
          <code className="text-sm text-gray-800 break-all font-mono">
            {dataWarehouseUrl}
          </code>
          <button
            onClick={copyToClipboard}
            className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Copiar
          </button>
        </div>
        <p className="text-xs text-blue-700 mt-2">
          ✅ Dados dos últimos 12 meses automaticamente | ✅ Atualização diária
          às 6h | ✅ Cache de 1 hora
        </p>
      </div>

      {/* Instruções para Looker Studio */}
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2 flex items-center">
          📊 Para Looker Studio (Community Connector):
        </h4>
        <div className="p-3 bg-white rounded border border-green-300 mb-3">
          <p className="text-sm font-medium text-green-800 mb-2">
            🔗 Link Direto do Conector (após deploy):
          </p>
          <code className="text-xs text-gray-800 break-all font-mono">
            https://lookerstudio.google.com/datasources/create?connectorId=SEU_DEPLOYMENT_ID
          </code>
          <p className="text-xs text-green-700 mt-1">
            ℹ️ Substitua SEU_DEPLOYMENT_ID pelo ID gerado no Google Apps Script
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <h5 className="font-semibold text-green-800 mb-1">
              📋 Para Administradores:
            </h5>
            <ol className="text-sm text-green-700 space-y-1 ml-3">
              <li>
                1. Acesse <strong>script.google.com</strong>
              </li>
              <li>2. Crie novo projeto com nosso código do conector</li>
              <li>3. Faça deploy como &#34;Aplicativo da web&#34;</li>
              <li>4. Copie o Deployment ID e gere o link direto</li>
            </ol>
          </div>

          <div>
            <h5 className="font-semibold text-green-800 mb-1">
              👥 Para Usuários Finais:
            </h5>
            <ol className="text-sm text-green-700 space-y-1 ml-3">
              <li>1. Clique no link direto do conector</li>
              <li>2. Looker Studio abre automaticamente</li>
              <li>
                3. Clique em &#34;Conectar&#34; → dados carregam automaticamente
              </li>
              <li>4. Pronto! Crie seus relatórios</li>
            </ol>
          </div>
        </div>

        <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-700">
          ✅ <strong>Vantagens:</strong> Sem configuração manual • Dados
          automáticos dos últimos 12 meses • Um clique para conectar
        </div>
      </div>

      {/* Instruções para Power BI */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
          ⚡ Para Power BI:
        </h4>
        <ol className="text-sm text-yellow-800 space-y-2">
          <li>
            1. Abra o Power BI Desktop e clique em{' '}
            <strong>&#34;Obter Dados&#34;</strong>
          </li>
          <li>
            2. Selecione <strong>&#34;Web&#34;</strong> na lista de conectores
          </li>
          <li>
            3. Cole a URL da API no campo <strong>&#34;URL&#34;</strong>
          </li>
          <li>
            4. Clique em <strong>&#34;OK&#34;</strong> e aguarde o carregamento
          </li>
          <li>
            5. No Navigator, selecione <strong>&#34;data&#34;</strong> e clique
            em <strong>&#34;Transformar Dados&#34;</strong>
          </li>
          <li>
            6. No Power Query, expanda a coluna <strong>&#34;data&#34;</strong>
          </li>
          <li>7. Configure tipos de dados para colunas de data e valores</li>
          <li>
            8. Clique em <strong>&#34;Fechar e Aplicar&#34;</strong>
          </li>
        </ol>
      </div>

      {/* Resumo dos dados da API */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">
          📈 Dados Disponíveis na API:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-800">
              📊 Métricas de Performance:
            </span>
            <ul className="mt-1 text-gray-600 space-y-1">
              <li>• Valor Contrato e Vendas</li>
              <li>• Margem Bruta e Tempo de Venda</li>
              <li>• Valor por M²</li>
            </ul>
          </div>
          <div>
            <span className="font-medium text-gray-800">
              💰 Métricas Financeiras:
            </span>
            <ul className="mt-1 text-gray-600 space-y-1">
              <li>• Descontos e Formas de Pagamento</li>
              <li>• Taxa de Juros e Parcelas</li>
              <li>• Saldo Devedor</li>
            </ul>
          </div>
          <div>
            <span className="font-medium text-gray-800">
              📅 Dimensões Temporais:
            </span>
            <ul className="mt-1 text-gray-600 space-y-1">
              <li>• Data, Ano, Trimestre, Mês</li>
              <li>• Últimos 12 meses automaticamente</li>
            </ul>
          </div>
          <div>
            <span className="font-medium text-gray-800">
              🏢 Dimensões de Negócio:
            </span>
            <ul className="mt-1 text-gray-600 space-y-1">
              <li>• Empresas e Empreendimentos</li>
              <li>• Unidades e Clientes</li>
              <li>• Status e Tipos de Contrato</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
