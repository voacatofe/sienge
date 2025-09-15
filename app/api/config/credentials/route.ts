import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import axios from 'axios';

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

// Função para validar credenciais contra a API Sienge
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
        limit: 1,
      },
      timeout: 5000,
    });

    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na validação Sienge API:', {
        status: error.response?.status,
        message: error.message,
        subdomain: subdomain,
      });
      return error.response?.status !== 401 && error.response?.status !== 403;
    }
    return false;
  }
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados de entrada
    const validationResult = credentialsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { subdomain, username, password } = validationResult.data;

    // Sanitizar dados
    const sanitizedSubdomain = sanitizeInput(subdomain);
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    // Validar credenciais contra a API Sienge
    const isValid = await validateSiengeCredentialsDirect(
      sanitizedSubdomain,
      sanitizedUsername,
      sanitizedPassword
    );

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error:
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

    // Verificar se já existem credenciais
    const existingCredentials = await prisma.apiCredentials.findUnique({
      where: { subdomain: sanitizedSubdomain },
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

    // Salvar senha em variável de ambiente temporária
    const envKey = `SIENGE_PASSWORD_${sanitizedSubdomain.toUpperCase()}`;
    process.env[envKey] = sanitizedPassword;

    // Invalidar cache
    const { credentialsCache } = await import('@/lib/cache/credentials-cache');
    credentialsCache.invalidateBySubdomain(sanitizedSubdomain);

    return NextResponse.json({
      success: true,
      message: 'Credenciais salvas com sucesso',
    });
  } catch (error) {
    console.error('Erro ao salvar credenciais:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
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
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      hasCredentials: !!credentials,
      credentials: credentials
        ? {
            subdomain: credentials.subdomain,
            username: credentials.apiUser,
            isActive: credentials.isActive,
            createdAt: credentials.createdAt,
            updatedAt: credentials.updatedAt,
          }
        : null,
    });
  } catch (error) {
    console.error('Erro ao buscar credenciais:', error);
    return NextResponse.json(
      {
        success: false,
        hasCredentials: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}
