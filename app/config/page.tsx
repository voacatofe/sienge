'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CredentialsForm from './components/CredentialsForm';
import { CredentialsData } from './types';

// Schema de validação para as credenciais
const credentialsSchema = z.object({
  subdomain: z.string()
    .min(1, 'Subdomínio é obrigatório')
    .regex(/^[a-zA-Z0-9-]+$/, 'Subdomínio deve conter apenas letras, números e hífens')
    .max(50, 'Subdomínio deve ter no máximo 50 caracteres'),
  username: z.string()
    .min(1, 'Nome de usuário é obrigatório')
    .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
    .max(100, 'Nome de usuário deve ter no máximo 100 caracteres'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(200, 'Senha deve ter no máximo 200 caracteres')
});

type CredentialsFormData = z.infer<typeof credentialsSchema>;

export default function ConfigPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<CredentialsFormData>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      subdomain: '',
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data: CredentialsFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar credenciais');
      }

      setSubmitStatus('success');
      form.reset();
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Configuração de Credenciais
          </h1>
          <p className="text-lg text-gray-600">
            Configure suas credenciais da API Sienge para sincronização de dados
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <CredentialsForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            submitStatus={submitStatus}
            errorMessage={errorMessage}
          />
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Segurança dos Dados
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Suas credenciais são criptografadas antes do armazenamento e nunca são 
                  exibidas em texto plano. Utilizamos as melhores práticas de segurança 
                  para proteger suas informações.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
