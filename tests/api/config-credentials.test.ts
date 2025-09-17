/**
 * Testes para o endpoint de credenciais de configuração
 */

import { NextRequest } from 'next/server';
import { GET, POST } from '../../app/api/config/credentials/route';

// Mock do Prisma
jest.mock('../../lib/prisma-singleton', () => ({
  prisma: {
    apiCredentials: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock do cliente Sienge
jest.mock('../../lib/sienge-api-client', () => ({
  siengeApiClient: {
    testCredentials: jest.fn(),
  },
}));

// Mock do logger
jest.mock('../../lib/logger', () => ({
  createContextLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  })),
}));

describe('/api/config/credentials', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('deve retornar credenciais existentes sem dados sensíveis', async () => {
      const { prisma } = require('../../lib/prisma-singleton');

      const mockCredentials = {
        id: 1,
        subdomain: 'test-company',
        username: 'testuser',
        isValid: true,
        lastValidatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.apiCredentials.findFirst.mockResolvedValue(mockCredentials);

      const request = new NextRequest('http://localhost:3000/api/config/credentials');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.subdomain).toBe('test-company');
      expect(data.data.username).toBe('testuser');
      expect(data.data.password).toBeUndefined(); // Senha não deve estar presente
      expect(data.data.hashedPassword).toBeUndefined(); // Hash não deve estar presente
    });

    it('deve retornar dados vazios quando não há credenciais', async () => {
      const { prisma } = require('../../lib/prisma-singleton');

      prisma.apiCredentials.findFirst.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/config/credentials');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual({});
    });
  });

  describe('POST', () => {
    it('deve criar novas credenciais com sucesso', async () => {
      const { prisma } = require('../../lib/prisma-singleton');
      const { siengeApiClient } = require('../../lib/sienge-api-client');
      const bcrypt = require('bcrypt');

      const requestBody = {
        subdomain: 'new-company',
        username: 'newuser',
        password: 'newpassword123',
      };

      // Mock successful credential test
      siengeApiClient.testCredentials.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('hashed-password');
      prisma.apiCredentials.findFirst.mockResolvedValue(null);
      prisma.apiCredentials.create.mockResolvedValue({
        id: 1,
        subdomain: 'new-company',
        username: 'newuser',
        isValid: true,
      });

      const request = new NextRequest('http://localhost:3000/api/config/credentials', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Credenciais salvas com sucesso');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 12);
    });

    it('deve atualizar credenciais existentes', async () => {
      const { prisma } = require('../../lib/prisma-singleton');
      const { siengeApiClient } = require('../../lib/sienge-api-client');
      const bcrypt = require('bcrypt');

      const requestBody = {
        subdomain: 'existing-company',
        username: 'existinguser',
        password: 'updatedpassword123',
      };

      const existingCredentials = { id: 1, subdomain: 'old-company' };

      siengeApiClient.testCredentials.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('hashed-updated-password');
      prisma.apiCredentials.findFirst.mockResolvedValue(existingCredentials);
      prisma.apiCredentials.update.mockResolvedValue({
        id: 1,
        subdomain: 'existing-company',
        username: 'existinguser',
        isValid: true,
      });

      const request = new NextRequest('http://localhost:3000/api/config/credentials', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Credenciais atualizadas com sucesso');
    });

    it('deve rejeitar credenciais inválidas', async () => {
      const { siengeApiClient } = require('../../lib/sienge-api-client');

      const requestBody = {
        subdomain: 'invalid-company',
        username: 'invaliduser',
        password: 'wrongpassword',
      };

      siengeApiClient.testCredentials.mockResolvedValue(false);

      const request = new NextRequest('http://localhost:3000/api/config/credentials', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Credenciais inválidas');
    });

    it('deve validar campos obrigatórios', async () => {
      const requestBody = {
        subdomain: '',
        username: 'user',
        // password missing
      };

      const request = new NextRequest('http://localhost:3000/api/config/credentials', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.details).toContain('Subdomínio é obrigatório');
    });
  });
});