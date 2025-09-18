'use client';

interface PowerBILinksProps {
  syncResults: any[];
}

export function PowerBILinksSection({ syncResults }: PowerBILinksProps) {
  if (syncResults.length === 0) {
    return null;
  }

  // URLs da API Master
  const baseUrl = process.env.NEXT_PUBLIC_PRIMARY_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_PRIMARY_DOMAIN}`
    : typeof window !== 'undefined'
      ? window.location.origin
      : '';

  // URLs das APIs disponíveis
  const apiUrls = {
    // API Master (domínios principais)
    master: `${baseUrl}/api/datawarehouse/master`,
    contratos: `${baseUrl}/api/datawarehouse/master?domain=contratos`,
    clientes: `${baseUrl}/api/datawarehouse/master?domain=clientes`,
    empreendimentos: `${baseUrl}/api/datawarehouse/master?domain=empreendimentos`,
    unidades: `${baseUrl}/api/datawarehouse/master?domain=unidades`,

    // API Financeira (novos domínios)
    financial: `${baseUrl}/api/datawarehouse/financial`,
    empresas: `${baseUrl}/api/datawarehouse/financial?domain=empresas`,
    centrosCusto: `${baseUrl}/api/datawarehouse/financial?domain=centro-custos`,
    planosFinanceiros: `${baseUrl}/api/datawarehouse/financial?domain=planos-financeiros`,
    extratosContas: `${baseUrl}/api/datawarehouse/financial?domain=extratos-contas`,
  };

  // Deployment ID do Looker Studio (configurável via variável de ambiente)
  const lookerDeploymentId =
    process.env.NEXT_PUBLIC_LOOKER_DEPLOYMENT_ID || 'SEU_DEPLOYMENT_ID';
  const lookerConnectorUrl = `https://lookerstudio.google.com/datasources/create?connectorId=${lookerDeploymentId}`;

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
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
            Conectores para BI Tools
          </h3>
          <p className="text-gray-600">
            Conecte seus dados ao Looker Studio ou Power BI com facilidade
          </p>
        </div>
      </div>

      {/* Instruções para Looker Studio */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-medium text-green-900 mb-3 flex items-center">
          📊 Google Looker Studio (Community Connector)
        </h4>

        {/* Link Direto */}
        <div className="mb-4 p-3 bg-white rounded border border-green-300">
          <p className="text-sm font-medium text-green-800 mb-2">
            🔗 Link Direto do Conector:
          </p>
          <div className="flex items-center gap-2">
            <code className="text-xs text-gray-800 break-all font-mono flex-1 p-2 bg-gray-50 rounded">
              {lookerConnectorUrl}
            </code>
            <button
              onClick={() => copyToClipboard(lookerConnectorUrl)}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 whitespace-nowrap"
            >
              Copiar
            </button>
          </div>
          {lookerDeploymentId === 'SEU_DEPLOYMENT_ID' && (
            <p className="text-xs text-red-600 mt-2">
              ⚠️ Configure a variável NEXT_PUBLIC_LOOKER_DEPLOYMENT_ID no
              EasyPanel
            </p>
          )}
        </div>

        {/* Método 1: Link Direto */}
        <div className="mb-4">
          <h5 className="font-semibold text-green-800 mb-2">
            🎯 Método 1: Link Direto (Recomendado)
          </h5>
          <ol className="text-sm text-green-700 space-y-1 ml-3">
            <li>1. Clique no link direto acima</li>
            <li>2. Looker Studio abre automaticamente</li>
            <li>
              3. Clique em <strong>{'Conectar'}</strong>
            </li>
            <li>4. Dados carregam automaticamente → Pronto!</li>
          </ol>
        </div>

        {/* Método 2: Dentro do Relatório */}
        <div className="mb-4">
          <h5 className="font-semibold text-green-800 mb-2">
            📝 Método 2: Dentro de um Relatório
          </h5>
          <ol className="text-sm text-green-700 space-y-1 ml-3">
            <li>1. Abra um relatório no Looker Studio</li>
            <li>
              2. Clique em <strong>{'Adicionar dados'}</strong>
            </li>
            <li>
              3. Selecione <strong>{'Partner connectors'}</strong>
            </li>
            <li>
              4. Clique em <strong>{'Crie seus próprios'}</strong>
            </li>
            <li>
              5. Cole o Deployment ID:{' '}
              <code className="bg-gray-200 px-1 rounded text-xs">
                {lookerDeploymentId}
              </code>
            </li>
            <li>6. Conecte e use os dados!</li>
          </ol>
        </div>

        <div className="p-2 bg-green-100 rounded text-xs text-green-700">
          ✅ <strong>Vantagens:</strong> Sem configuração manual • Grupos
          semânticos organizados • Um clique para conectar
        </div>
      </div>

      {/* Instruções para Power BI */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
          ⚡ Microsoft Power BI (Conector Web)
        </h4>

        {/* URLs Disponíveis */}
        <div className="mb-4 space-y-3">
          <h5 className="font-semibold text-yellow-800">
            🔗 URLs Disponíveis:
          </h5>

          {Object.entries({
            'Master - Todos os Domínios': apiUrls.master,
            'Master - Apenas Contratos': apiUrls.contratos,
            'Master - Apenas Clientes': apiUrls.clientes,
            'Master - Apenas Empreendimentos': apiUrls.empreendimentos,
            'Master - Apenas Unidades': apiUrls.unidades,
            'Financeiro - Todos os Domínios': apiUrls.financial,
            'Financeiro - Apenas Empresas': apiUrls.empresas,
            'Financeiro - Centros de Custo': apiUrls.centrosCusto,
            'Financeiro - Planos Financeiros': apiUrls.planosFinanceiros,
            'Financeiro - Extratos de Contas': apiUrls.extratosContas,
          }).map(([label, url]) => (
            <div
              key={label}
              className="p-2 bg-white rounded border border-yellow-300"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-yellow-800">
                  {label}:
                </span>
                <button
                  onClick={() => copyToClipboard(url)}
                  className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Copiar
                </button>
              </div>
              <code className="text-xs text-gray-700 break-all font-mono block mt-1">
                {url}
              </code>
            </div>
          ))}
        </div>

        {/* Passo a Passo */}
        <div className="mb-4">
          <h5 className="font-semibold text-yellow-800 mb-2">
            📋 Passo a Passo:
          </h5>
          <ol className="text-sm text-yellow-800 space-y-2">
            <li>
              1. Abra o <strong>Power BI Desktop</strong>
            </li>
            <li>
              2. Clique em <strong>{'Obter Dados'}</strong> →{' '}
              <strong>{'Web'}</strong>
            </li>
            <li>
              3. Cole uma das URLs acima no campo <strong>{'URL'}</strong>
            </li>
            <li>
              4. Clique em <strong>{'OK'}</strong> → aguarde carregamento
            </li>
            <li>
              5. No Navigator, selecione <strong>{'data'}</strong>
            </li>
            <li>
              6. Clique em <strong>{'Transformar Dados'}</strong> (Power Query)
            </li>
            <li>
              7. Expanda a coluna <strong>{'data'}</strong> para ver todos os
              campos
            </li>
            <li>8. Configure tipos de dados (datas, números, texto)</li>
            <li>
              9. Clique em <strong>{'Fechar e Aplicar'}</strong>
            </li>
          </ol>
        </div>

        <div className="p-2 bg-yellow-100 rounded text-xs text-yellow-700">
          💡 <strong>Dica:</strong> Use URLs específicas por domínio para
          análises focadas • Todos os dados dos últimos 12 meses
        </div>
      </div>

      {/* APIs e Domínios Disponíveis */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">
          🎯 Domínios e Dados Disponíveis
        </h4>

        <div className="space-y-6">
          {/* Domínios Master */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              📊 API Master (Domínios Principais)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-800">📋 Contratos:</span>
                <ul className="mt-1 text-gray-600 space-y-1 text-xs">
                  <li>• Valor, Status, Tipo de Contrato</li>
                  <li>• Contratos Ativos/Assinados</li>
                  <li>• Margem Bruta, Saldo Devedor</li>
                </ul>
              </div>

              <div>
                <span className="font-medium text-gray-800">👥 Clientes:</span>
                <ul className="mt-1 text-gray-600 space-y-1 text-xs">
                  <li>• Nome e dados do cliente principal</li>
                  <li>• Histórico de cadastros</li>
                </ul>
              </div>

              <div>
                <span className="font-medium text-gray-800">
                  🏗️ Empreendimentos:
                </span>
                <ul className="mt-1 text-gray-600 space-y-1 text-xs">
                  <li>• Nome e tipo do projeto</li>
                  <li>• Dados de desenvolvimento</li>
                </ul>
              </div>

              <div>
                <span className="font-medium text-gray-800">🏠 Unidades:</span>
                <ul className="mt-1 text-gray-600 space-y-1 text-xs">
                  <li>• Tipo, área e faixa de área</li>
                  <li>• Inventário imobiliário</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Domínios Financeiros */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              💰 API Financeira (Novos Domínios)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-800">🏢 Empresas:</span>
                <ul className="mt-1 text-gray-600 space-y-1 text-xs">
                  <li>• Nome, CNPJ, Inscrições</li>
                  <li>• Endereço e contatos</li>
                  <li>• Status ativo/inativo</li>
                </ul>
              </div>

              <div>
                <span className="font-medium text-gray-800">
                  🎯 Centros de Custo:
                </span>
                <ul className="mt-1 text-gray-600 space-y-1 text-xs">
                  <li>• Departamentos e setores</li>
                  <li>• Building sectors (JSON)</li>
                  <li>• Contas disponíveis</li>
                </ul>
              </div>

              <div>
                <span className="font-medium text-gray-800">
                  📊 Planos Financeiros:
                </span>
                <ul className="mt-1 text-gray-600 space-y-1 text-xs">
                  <li>• Categorias de contas</li>
                  <li>• Tipo: Receita/Despesa</li>
                  <li>• Flags: Redutora, Adiantamento</li>
                </ul>
              </div>

              <div>
                <span className="font-medium text-gray-800">
                  💳 Extratos de Contas:
                </span>
                <ul className="mt-1 text-gray-600 space-y-1 text-xs">
                  <li>• Movimentações financeiras</li>
                  <li>• Valores e tipos</li>
                  <li>• Vínculos com centro/plano</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dimensões Temporais */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              📅 Dimensões Temporais
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-800">
                  📅 Master API:
                </span>
                <ul className="mt-1 text-gray-600 space-y-1 text-xs">
                  <li>• Data, ano, trimestre, mês</li>
                  <li>• Últimos 12 meses automaticamente</li>
                </ul>
              </div>

              <div>
                <span className="font-medium text-gray-800">
                  📅 Financial API:
                </span>
                <ul className="mt-1 text-gray-600 space-y-1 text-xs">
                  <li>• Created_at, Updated_at</li>
                  <li>• Dados desde sincronização</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              <strong>📊 API Master:</strong> 1.235 registros (últimos 12 meses)
              |<strong> 🔄 Atualização:</strong> Diária às 6h |
              <strong> ⚡ Cache:</strong> 1 hora
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
            <p className="text-sm text-green-800">
              <strong>💰 API Financeira:</strong> 234 registros (tempo real) |
              <strong> 🔄 Atualização:</strong> Via sincronização |
              <strong> ⚡ Cache:</strong> 30 minutos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
