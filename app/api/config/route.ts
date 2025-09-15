import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import {
  checkRateLimit,
  credentialsRateLimiter,
  createRateLimitHeaders,
} from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Função para validar credenciais contra a API Sienge (sem cache)
async function validateSiengeCredentialsDirect(
  subdomain: string,
  username: string,
  password: string
): Promise<boolean> {
  try {
    const baseURL = `https://api.sienge.com.br/${subdomain}/public/api/v1`;

    const response = await axios.get(`${baseURL}/customers`, {
      auth: {
        username,
        password,
      },
      params: {
        limit: 1, // Chamada mínima para validação
      },
      timeout: 5000, // Reduzido para 5 segundos
      // Desabilitar retry automático do axios
    });

    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Log apenas o código de status, nunca as credenciais
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Erro na validação Sienge API:', {
          status: error.response?.status,
          message: error.message,
          subdomain: subdomain, // Log apenas o subdomínio, não as credenciais
        });
      }

      // Retorna false para códigos de erro de autenticação/autorização
      return error.response?.status !== 401 && error.response?.status !== 403;
    }

    // Para outros tipos de erro, assume que as credenciais são inválidas
    return false;
  }
}

// Função para validar credenciais com cache
async function validateSiengeCredentials(
  subdomain: string,
  username: string,
  password: string
): Promise<boolean> {
  return validateCredentialsWithCache(
    subdomain,
    username,
    password,
    validateSiengeCredentialsDirect
  );
}

// Função para sanitizar dados de entrada
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Schema de validação para as credenciais
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

export async function POST(request: NextRequest) {
  try {
    // Verificar rate limiting
    const rateLimitResult = checkRateLimit(request, credentialsRateLimiter);

    if (!rateLimitResult.allowed) {
      const headers = createRateLimitHeaders(
        rateLimitResult.allowed,
        rateLimitResult.remaining,
        rateLimitResult.resetTime
      );

      return NextResponse.json(
        {
          success: false,
          message: 'Muitas tentativas. Tente novamente mais tarde.',
          retryAfter: Math.ceil(
            (rateLimitResult.resetTime - Date.now()) / 1000
          ),
        },
        {
          status: 429,
          headers,
        }
      );
    }

    const body = await request.json();

    // Validar dados de entrada
    const validationResult = credentialsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dados inválidos',
          errors: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { subdomain, username, password } = validationResult.data;

    // Sanitizar dados de entrada
    const sanitizedSubdomain = sanitizeInput(subdomain);
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    // Validar credenciais contra a API Sienge antes de salvar
    const isValidCredentials = await validateSiengeCredentials(
      sanitizedSubdomain,
      sanitizedUsername,
      sanitizedPassword
    );
    if (!isValidCredentials) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Credenciais inválidas ou sem permissão para acessar a API Sienge',
        },
        { status: 401 }
      );
    }

    // Criptografar a senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(sanitizedPassword, saltRounds);

    // Importar Prisma apenas quando necessário
    const { prisma } = await import('@/lib/prisma');

    // Verificar se já existem credenciais para este subdomínio
    const existingCredentials = await prisma.apiCredentials.findUnique({
      where: { subdomain: sanitizedSubdomain },
      select: {
        id: true,
        apiUser: true,
        apiPasswordHash: true,
      },
    });

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

      // Invalidar cache para este subdomínio
      credentialsCache.invalidateBySubdomain(sanitizedSubdomain);
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
    }

    // IMPLEMENTAÇÃO TEMPORÁRIA: Salvar senha em variável de ambiente de runtime
    // EM PRODUÇÃO: usar AWS Secrets Manager, Azure Key Vault, etc.
    const envKey = `SIENGE_PASSWORD_${sanitizedSubdomain.toUpperCase()}`;
    process.env[envKey] = sanitizedPassword;

    return NextResponse.json(
      {
        success: true,
        message: 'Credenciais salvas com sucesso',
      },
      {
        headers: createRateLimitHeaders(
          rateLimitResult.allowed,
          rateLimitResult.remaining,
          rateLimitResult.resetTime
        ),
      }
    );
  } catch (error) {
    // Log error for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(
        'Erro ao salvar credenciais:',
        error instanceof Error ? error.message : 'Erro desconhecido'
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Importar Prisma apenas quando necessário
    const { prisma } = await import('@/lib/prisma');

    const credentials = await prisma.apiCredentials.findFirst({
      select: {
        id: true,
        subdomain: true,
        apiUser: true,
        createdAt: true,
        updatedAt: true,
        // Não incluir apiPasswordHash por segurança
      },
    });

    return NextResponse.json({
      success: true,
      data: credentials,
    });
  } catch (error) {
    // Log error for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(
        'Erro ao buscar credenciais:',
        error instanceof Error ? error.message : 'Erro desconhecido'
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}
