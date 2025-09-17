import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { apiSuccess, apiError, withErrorHandler } from '@/lib/api-response';
import { createContextLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma-singleton';

const credentialsLogger = createContextLogger('CREDENTIALS');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Schema de validação
const credentialsSchema = z.object({
  subdomain: z
    .string()
    .min(1, 'Subdomínio é obrigatório')
    .regex(
      /^[a-zA-Z0-9-]+$/,
      'Subdomínio deve conter apenas letras, números e hífens'
    )
    .max(50, 'Subdomínio deve ter no máximo 50 caracteres'),
  username: z
    .string()
    .min(1, 'Nome de usuário é obrigatório')
    .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
    .max(100, 'Nome de usuário deve ter no máximo 100 caracteres'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(200, 'Senha deve ter no máximo 200 caracteres'),
});

/**
 * Valida credenciais contra a API Sienge
 */
async function validateSiengeCredentialsDirect(
  subdomain: string,
  username: string,
  password: string
): Promise<boolean> {
  try {
    const baseURL = `https://api.sienge.com.br/${subdomain}/public/api/v1`;

    credentialsLogger.debug('Validating Sienge credentials', {
      subdomain,
      username,
      baseURL,
    });

    const response = await axios.get(`${baseURL}/companies`, {
      auth: {
        username,
        password,
      },
      params: {
        limit: 1,
      },
      timeout: 10000, // Aumentado timeout para 10s
    });

    credentialsLogger.info('Sienge credentials validated successfully', {
      subdomain,
      status: response.status,
    });

    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      credentialsLogger.error('Sienge API validation failed', error, {
        status: error.response?.status,
        subdomain: subdomain,
      });

      // Considerar válido se não for erro de autenticação
      return error.response?.status !== 401 && error.response?.status !== 403;
    }

    credentialsLogger.error('Unexpected error during Sienge validation', error);
    return false;
  }
}

/**
 * Sanitiza input do usuário
 */
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Salva ou atualiza credenciais
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const body = await request.json();

    // Validar dados de entrada
    const validationResult = credentialsSchema.safeParse(body);
    if (!validationResult.success) {
      credentialsLogger.warn('Invalid credentials data provided', {
        errors: validationResult.error.issues,
      });

      return apiError(
        'VALIDATION_ERROR',
        'Dados de credenciais inválidos',
        400,
        validationResult.error.issues
      );
    }

    const { subdomain, username, password } = validationResult.data;

    // Sanitizar dados
    const sanitizedSubdomain = sanitizeInput(subdomain);
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    credentialsLogger.info('Processing credentials update', {
      subdomain: sanitizedSubdomain,
      username: sanitizedUsername,
    });

    // Validar credenciais contra a API Sienge
    const isValid = await validateSiengeCredentialsDirect(
      sanitizedSubdomain,
      sanitizedUsername,
      sanitizedPassword
    );

    if (!isValid) {
      credentialsLogger.warn('Invalid Sienge credentials provided', {
        subdomain: sanitizedSubdomain,
        username: sanitizedUsername,
      });

      return apiError(
        'AUTHENTICATION_ERROR',
        'Credenciais inválidas ou sem permissão para acessar a API Sienge',
        401
      );
    }

    // Criptografar a senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(sanitizedPassword, saltRounds);

    // Verificar se já existem credenciais
    const existingCredentials = await prisma.apiCredentials.findUnique({
      where: { subdomain: sanitizedSubdomain },
    });

    let operation: string;

    if (existingCredentials) {
      // Atualizar credenciais existentes
      await prisma.apiCredentials.update({
        where: { id: existingCredentials.id },
        data: {
          apiUser: sanitizedUsername,
          apiPasswordHash: hashedPassword,
          isActive: true,
          updatedAt: new Date(),
        },
      });
      operation = 'updated';
    } else {
      // Criar novas credenciais
      await prisma.apiCredentials.create({
        data: {
          subdomain: sanitizedSubdomain,
          apiUser: sanitizedUsername,
          apiPasswordHash: hashedPassword,
          isActive: true,
        },
      });
      operation = 'created';
    }

    // Salvar senha em variável de ambiente temporária
    const envKey = `SIENGE_PASSWORD_${sanitizedSubdomain.toUpperCase()}`;
    process.env[envKey] = sanitizedPassword;

    // Invalidar cache se disponível
    try {
      const { credentialsCache } = await import(
        '@/lib/cache/credentials-cache'
      );
      credentialsCache.invalidateBySubdomain(sanitizedSubdomain);
    } catch (error) {
      // Cache não implementado ainda, ignorar erro
      credentialsLogger.debug('Credentials cache not available', error);
    }

    credentialsLogger.info(`Credentials ${operation} successfully`, {
      subdomain: sanitizedSubdomain,
      username: sanitizedUsername,
      operation,
    });

    return apiSuccess(
      {
        subdomain: sanitizedSubdomain,
        username: sanitizedUsername,
        operation,
        isActive: true,
      },
      `Credenciais ${operation === 'created' ? 'salvas' : 'atualizadas'} com sucesso`
    );
  }, 'CREDENTIALS_POST');
}

/**
 * Busca credenciais existentes
 */
export async function GET() {
  return withErrorHandler(async () => {
    credentialsLogger.debug('Fetching existing credentials');

    const credentials = await prisma.apiCredentials.findFirst({
      select: {
        id: true,
        subdomain: true,
        apiUser: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const hasCredentials = !!credentials;

    credentialsLogger.info('Credentials fetch completed', {
      hasCredentials,
      subdomain: credentials?.subdomain,
    });

    return apiSuccess(
      {
        hasCredentials,
        credentials: credentials
          ? {
              subdomain: credentials.subdomain,
              username: credentials.apiUser,
              isActive: credentials.isActive,
              createdAt: credentials.createdAt,
              updatedAt: credentials.updatedAt,
            }
          : null,
      },
      hasCredentials
        ? 'Credenciais encontradas'
        : 'Nenhuma credencial configurada',
      undefined,
      'short' // Cache por 1 minuto
    );
  }, 'CREDENTIALS_GET');
}
