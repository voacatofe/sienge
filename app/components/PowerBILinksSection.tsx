'use client';

import { useState, useEffect } from 'react';

interface PowerBILinksProps {
  completedGroups: string[];
}

interface DataSource {
  group: string;
  name: string;
  endpoint: string;
  description: string;
  icon: string;
  color: string;
}

export function PowerBILinksSection({ completedGroups }: PowerBILinksProps) {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Detectar a URL base atual
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const getDataSources = (): DataSource[] => {
    const sources: DataSource[] = [];

    if (completedGroups.includes('financial')) {
      sources.push(
        {
          group: 'financial',
          name: 'Resumo Financeiro',
          endpoint: '/api/data/financial',
          description: 'Visão geral de todas as entidades financeiras',
          icon: '💰',
          color: 'green',
        },
        {
          group: 'financial',
          name: 'Títulos a Receber',
          endpoint: '/api/data/financial?type=receivables',
          description: 'Dados completos de títulos a receber',
          icon: '📈',
          color: 'green',
        },
        {
          group: 'financial',
          name: 'Títulos a Pagar',
          endpoint: '/api/data/financial?type=payables',
          description: 'Dados completos de títulos a pagar',
          icon: '📉',
          color: 'green',
        },
        {
          group: 'financial',
          name: 'Contratos de Venda',
          endpoint: '/api/data/financial?type=sales-contracts',
          description: 'Contratos de venda e comissões',
          icon: '📋',
          color: 'green',
        }
      );
    }

    if (completedGroups.includes('customers')) {
      sources.push(
        {
          group: 'customers',
          name: 'Resumo Clientes',
          endpoint: '/api/data/customers-group',
          description: 'Visão geral de clientes e credores',
          icon: '👥',
          color: 'blue',
        },
        {
          group: 'customers',
          name: 'Clientes Detalhados',
          endpoint: '/api/data/customers-group?type=customers',
          description: 'Base completa de clientes',
          icon: '👤',
          color: 'blue',
        },
        {
          group: 'customers',
          name: 'Credores',
          endpoint: '/api/data/customers-group?type=creditors',
          description: 'Base de credores e fornecedores',
          icon: '🏪',
          color: 'blue',
        }
      );
    }

    if (completedGroups.includes('registries')) {
      sources.push(
        {
          group: 'registries',
          name: 'Cadastros Básicos',
          endpoint: '/api/data/registries',
          description: 'Resumo de cadastros fundamentais',
          icon: '📊',
          color: 'purple',
        },
        {
          group: 'registries',
          name: 'Empresas',
          endpoint: '/api/data/registries?type=companies',
          description: 'Dados das empresas',
          icon: '🏢',
          color: 'purple',
        }
      );
    }

    return sources;
  };

  const dataSources = getDataSources();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Você pode adicionar um toast aqui
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const generatePowerBIInstructions = () => {
    return `
# Como conectar no Power BI

## Passo 1: Obter Dados
1. Abra o Power BI Desktop
2. Clique em "Obter Dados" > "Web"

## Passo 2: Configurar Conexão
1. Cole uma das URLs abaixo na caixa de URL
2. Clique em "OK"
3. Na tela de autenticação, selecione "Anônimo" (nossas APIs são públicas)

## Passo 3: Configurar Consulta (Opcional)
1. No Editor de Consultas, você pode expandir os campos "data", "pagination" e "meta"
2. Selecione apenas os campos que precisa
3. Configure filtros adicionais se necessário

## URLs Disponíveis:
${dataSources.map(source => `• ${source.name}: ${baseUrl}${source.endpoint}`).join('\n')}

## Dicas:
• Use os endpoints com parâmetros para filtrar dados específicos
• Exemplo: ${baseUrl}/api/data/financial?type=receivables&status=PENDENTE
• Para paginação: adicione &page=1&limit=100
• Para busca: adicione &search=termo
    `;
  };

  if (completedGroups.length === 0) {
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
            Links para Power BI
          </h3>
          <p className="text-gray-600">
            URLs das APIs sincronizadas para conectar no Power BI
          </p>
        </div>
      </div>

      {/* Lista de endpoints disponíveis */}
      <div className="space-y-3 mb-6">
        {dataSources.map((source, index) => {
          const fullUrl = `${baseUrl}${source.endpoint}`;
          const colorClasses = {
            green: 'bg-green-50 text-green-700 border-green-200',
            blue: 'bg-blue-50 text-blue-700 border-blue-200',
            purple: 'bg-purple-50 text-purple-700 border-purple-200',
          };

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${colorClasses[source.color as keyof typeof colorClasses]}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <span className="text-xl mr-3">{source.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{source.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {source.description}
                    </p>
                    <code className="text-xs bg-white px-2 py-1 rounded border text-gray-700 break-all">
                      {fullUrl}
                    </code>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(fullUrl)}
                  className="ml-2 p-2 hover:bg-white rounded transition-colors"
                  title="Copiar URL"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botões de ação */}
      <div className="flex gap-3">
        <button
          onClick={() => copyToClipboard(generatePowerBIInstructions())}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Copiar Instruções Completas
        </button>

        <a
          href="/api/data/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          Ver Documentação
        </a>
      </div>

      {/* Informações adicionais */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">
          💡 Dicas para Power BI:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • Use <strong>Obter Dados &gt; Web</strong> no Power BI Desktop
          </li>
          <li>
            • Selecione autenticação <strong>Anônima</strong>
          </li>
          <li>
            • Expanda o campo <strong>&quot;data&quot;</strong> para acessar os
            registros
          </li>
          <li>
            • Configure <strong>atualização automática</strong> para dados
            sempre atualizados
          </li>
          <li>
            • Use parâmetros na URL para filtrar dados (ex:
            ?status=PENDENTE&page=1&limit=1000)
          </li>
        </ul>
      </div>
    </div>
  );
}
