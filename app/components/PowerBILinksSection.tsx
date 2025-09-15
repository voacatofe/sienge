'use client';

import { useState, useEffect } from 'react';

interface PowerBILinksProps {
  completedGroups: string[];
}

interface DataSource {
  group: string;
  name: string;
  table: string;
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
          name: 'Títulos a Receber',
          table: 'titulo_receber',
          description: 'Dados completos de títulos a receber',
          icon: '📈',
          color: 'green',
        },
        {
          group: 'financial',
          name: 'Títulos a Pagar',
          table: 'titulo_pagar',
          description: 'Dados completos de títulos a pagar',
          icon: '📉',
          color: 'green',
        },
        {
          group: 'financial',
          name: 'Contratos de Venda',
          table: 'contrato_venda',
          description: 'Contratos de venda e comissões',
          icon: '📋',
          color: 'green',
        },
        {
          group: 'financial',
          name: 'Comissões',
          table: 'comissao_venda',
          description: 'Comissões de vendas',
          icon: '💰',
          color: 'green',
        }
      );
    }

    if (completedGroups.includes('customers')) {
      sources.push(
        {
          group: 'customers',
          name: 'Clientes',
          table: 'cliente',
          description: 'Base completa de clientes',
          icon: '👤',
          color: 'blue',
        },
        {
          group: 'customers',
          name: 'Credores',
          table: 'credor',
          description: 'Base de credores e fornecedores',
          icon: '🏪',
          color: 'blue',
        },
        {
          group: 'customers',
          name: 'Cônjuges',
          table: 'conjuge',
          description: 'Dados de cônjuges',
          icon: '👥',
          color: 'blue',
        }
      );
    }

    if (completedGroups.includes('registries')) {
      sources.push(
        {
          group: 'registries',
          name: 'Empresas',
          table: 'empresa',
          description: 'Dados das empresas',
          icon: '🏢',
          color: 'purple',
        },
        {
          group: 'registries',
          name: 'Empreendimentos',
          table: 'empreendimento',
          description: 'Dados dos empreendimentos',
          icon: '🏗️',
          color: 'purple',
        },
        {
          group: 'registries',
          name: 'Unidades',
          table: 'unidade_imobiliaria',
          description: 'Unidades imobiliárias',
          icon: '🏠',
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
    const dbHost = process.env.PRIMARY_DOMAIN || 'localhost';
    const dbPort = process.env.DB_PORT_EXTERNAL || '5432';
    const dbName = process.env.POSTGRES_DB || 'sienge_data';
    const dbUser = process.env.POSTGRES_USER || 'sienge_app';

    return `
# Como conectar diretamente ao PostgreSQL no Power BI

## Passo 1: Obter Dados
1. Abra o Power BI Desktop
2. Clique em "Obter Dados" > "Banco de dados" > "Banco de dados PostgreSQL"

## Passo 2: Configurar Conexão
1. Servidor: ${dbHost}:${dbPort}
2. Banco de dados: ${dbName}
3. Modo de conectividade: Importar
4. Clique em "OK"

## Passo 3: Autenticação
1. Selecione "Banco de dados" como tipo de autenticação
2. Usuário: ${dbUser}
3. Senha: [sua senha do POSTGRES_PASSWORD]
4. Clique em "Conectar"

## Tabelas Disponíveis:
${dataSources.map(source => `• ${source.name}: ${source.table}`).join('\n')}

## Dicas:
• Use consultas SQL personalizadas para filtrar dados específicos
• Exemplo: SELECT * FROM titulo_receber WHERE status = 'PENDENTE'
• Configure atualização automática para dados sempre atualizados
• Use relacionamentos entre tabelas para análises mais ricas
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
            Conexão Direta ao PostgreSQL
          </h3>
          <p className="text-gray-600">
            Conecte diretamente ao banco PostgreSQL para máxima performance
          </p>
        </div>
      </div>

      {/* Lista de tabelas disponíveis */}
      <div className="space-y-3 mb-6">
        {dataSources.map((source, index) => {
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
                    <code className="text-xs bg-white px-2 py-1 rounded border text-gray-700">
                      {source.table}
                    </code>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(source.table)}
                  className="ml-2 p-2 hover:bg-white rounded transition-colors"
                  title="Copiar nome da tabela"
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

        <button
          onClick={() => {
            const dbHost = process.env.PRIMARY_DOMAIN || 'localhost';
            const dbPort = process.env.DB_PORT_EXTERNAL || '5432';
            const dbName = process.env.POSTGRES_DB || 'sienge_data';
            const dbUser = process.env.POSTGRES_USER || 'sienge_app';
            const credentials = `Servidor: ${dbHost}:${dbPort}\nBanco: ${dbName}\nUsuário: ${dbUser}\nSenha: [sua senha do POSTGRES_PASSWORD]`;
            copyToClipboard(credentials);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Copiar Credenciais
        </button>
      </div>

      {/* Informações adicionais */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
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
