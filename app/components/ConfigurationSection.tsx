'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface CredentialsFormData {
  subdomain: string;
  username: string;
  password: string;
}

interface ConfigurationSectionProps {
  onConfigurationChange: (isConfigured: boolean) => void;
}

export function ConfigurationSection({
  onConfigurationChange,
}: ConfigurationSectionProps) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const form = useForm<CredentialsFormData>({
    defaultValues: {
      subdomain: '',
      username: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  // Verificar se já existem configurações salvas
  useEffect(() => {
    checkExistingConfiguration();
  }, []);

  const checkExistingConfiguration = async () => {
    try {
      const response = await fetch('/api/config/credentials', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setIsConfigured(data.hasCredentials || false);
        onConfigurationChange(data.hasCredentials || false);

        if (data.hasCredentials && data.credentials) {
          reset({
            subdomain: data.credentials.subdomain || '',
            username: data.credentials.username || '',
            password: '',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao verificar configurações:', error);
    }
  };

  const onSubmit = async (data: CredentialsFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/config/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setIsConfigured(true);
        setShowForm(false);
        onConfigurationChange(true);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Erro ao salvar credenciais');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(
        'Erro de conexão. Verifique se o servidor está funcionando.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditConfiguration = () => {
    setShowForm(true);
    setSubmitStatus('idle');
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setSubmitStatus('idle');
    checkExistingConfiguration(); // Recarrega os dados originais
  };

  if (isConfigured && !showForm) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Configuração Completa
              </h3>
              <p className="text-gray-600">
                Credenciais da API Sienge configuradas e salvas
              </p>
            </div>
          </div>
          <button
            onClick={handleEditConfiguration}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Editar Configuração
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Configuração da API Sienge
          </h3>
          <p className="text-gray-600">
            Configure suas credenciais para conectar com a API do Sienge
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Subdomain Field */}
        <div>
          <label
            htmlFor="subdomain"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subdomínio da API Sienge
          </label>
          <div className="relative">
            <input
              {...register('subdomain', {
                required: 'Subdomínio é obrigatório',
              })}
              type="text"
              id="subdomain"
              className={`block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.subdomain
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder="exemplo"
              disabled={isSubmitting}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">.sienge.com.br</span>
            </div>
          </div>
          {errors.subdomain && (
            <p className="mt-1 text-sm text-red-600">
              {errors.subdomain.message}
            </p>
          )}
        </div>

        {/* Username Field */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome de Usuário
          </label>
          <input
            {...register('username', {
              required: 'Nome de usuário é obrigatório',
            })}
            type="text"
            id="username"
            className={`block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Seu nome de usuário da API"
            disabled={isSubmitting}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Senha
          </label>
          <input
            {...register('password', { required: 'Senha é obrigatória' })}
            type="password"
            id="password"
            className={`block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Sua senha da API"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Credenciais salvas com sucesso!
                </h3>
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
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
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao salvar credenciais
                </h3>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Salvando...
              </>
            ) : (
              'Salvar Credenciais'
            )}
          </button>

          {showForm && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
