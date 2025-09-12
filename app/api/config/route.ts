import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validationResult = credentialsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Dados inválidos',
          errors: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { subdomain, username, password } = validationResult.data;

    // Criptografar a senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Verificar se já existem credenciais para este subdomínio
    const existingCredentials = await prisma.apiCredentials.findUnique({
      where: { subdomain },
      select: {
        id: true,
        apiUser: true,
        apiPasswordHash: true
      }
    });

    if (existingCredentials) {
      // Atualizar credenciais existentes
      await prisma.apiCredentials.update({
        where: { id: existingCredentials.id },
        data: {
          apiUser: username,
          apiPasswordHash: hashedPassword,
          updatedAt: new Date()
        }
      });
    } else {
      // Criar novas credenciais
      await prisma.apiCredentials.create({
        data: {
          subdomain,
          apiUser: username,
          apiPasswordHash: hashedPassword
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Credenciais salvas com sucesso'
    });

  } catch (error) {
    console.error('Erro ao salvar credenciais:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const credentials = await prisma.apiCredentials.findFirst({
      select: {
        id: true,
        subdomain: true,
        apiUser: true,
        createdAt: true,
        updatedAt: true
        // Não incluir apiPasswordHash por segurança
      }
    });

    return NextResponse.json({
      success: true,
      data: credentials
    });

  } catch (error) {
    console.error('Erro ao buscar credenciais:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
