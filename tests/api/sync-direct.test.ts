/**
 * Testes para o endpoint de sincronização direta
 */

import { NextRequest } from 'next/server';
import { POST } from '../../app/api/sync/direct/route';

// Mock do Prisma
jest.mock('../../lib/prisma-singleton', () => ({
  prisma: {
    syncLog: {
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock do cliente Sienge
jest.mock('../../lib/sienge-api-client', () => ({
  siengeApiClient: {
    isInitialized: jest.fn(),
    initialize: jest.fn(),
    fetchPaginatedData: jest.fn(),
  },
}));

// Mock dos endpoint mappings
jest.mock('../../app/api/sync/direct/endpoint-mappings', () => ({
  hasEndpointMapping: jest.fn(),
  getEndpointMapping: jest.fn(),
}));

// Mock do logger
jest.mock('../../lib/logger', () => ({
  createContextLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  })),
}));

describe('/api/sync/direct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve sincronizar endpoint válido com sucesso', async () => {
    const { prisma } = require('../../lib/prisma-singleton');
    const { siengeApiClient } = require('../../lib/sienge-api-client');
    const { hasEndpointMapping, getEndpointMapping } = require('../../app/api/sync/direct/endpoint-mappings');

    const requestBody = {
      endpoint: '/customers',
      limit: 100,
    };

    const mockApiData = [
      { id: 1, name: 'Cliente 1', cpfCnpj: '123.456.789-00' },
      { id: 2, name: 'Cliente 2', cpfCnpj: '987.654.321-00' },
    ];

    const mockMapping = {
      model: 'cliente',
      primaryKey: 'id',
      fieldMapping: {
        id: 'id',
        name: 'nome',
        cpfCnpj: 'cpfCnpj',
      },
    };

    // Setup mocks
    siengeApiClient.isInitialized.mockReturnValue(true);
    siengeApiClient.fetchPaginatedData.mockResolvedValue(mockApiData);
    hasEndpointMapping.mockReturnValue(true);
    getEndpointMapping.mockReturnValue(mockMapping);

    prisma.syncLog.create.mockResolvedValue({ id: 1 });
    prisma.syncLog.update.mockResolvedValue({});

    const request = new NextRequest('http://localhost:3000/api/sync/direct', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.recordsProcessed).toBe(2);
    expect(siengeApiClient.fetchPaginatedData).toHaveBeenCalledWith('/customers', {
      limit: 100,
      offset: 0,
    });
  });

  it('deve rejeitar endpoint sem mapeamento', async () => {
    const { hasEndpointMapping } = require('../../app/api/sync/direct/endpoint-mappings');

    const requestBody = {
      endpoint: '/invalid-endpoint',
    };

    hasEndpointMapping.mockReturnValue(false);

    const request = new NextRequest('http://localhost:3000/api/sync/direct', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Endpoint não suportado ou sem mapeamento definido');
  });

  it('deve validar parâmetros obrigatórios', async () => {
    const requestBody = {}; // Missing endpoint

    const request = new NextRequest('http://localhost:3000/api/sync/direct', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Endpoint é obrigatório');
  });

  it('deve inicializar cliente Sienge se necessário', async () => {
    const { siengeApiClient } = require('../../lib/sienge-api-client');
    const { hasEndpointMapping, getEndpointMapping } = require('../../app/api/sync/direct/endpoint-mappings');

    const requestBody = {
      endpoint: '/customers',
    };

    // Cliente não inicializado
    siengeApiClient.isInitialized.mockReturnValue(false);
    siengeApiClient.initialize.mockResolvedValue(undefined);
    siengeApiClient.fetchPaginatedData.mockResolvedValue([]);
    hasEndpointMapping.mockReturnValue(true);
    getEndpointMapping.mockReturnValue({
      model: 'cliente',
      primaryKey: 'id',
      fieldMapping: {},
    });

    const request = new NextRequest('http://localhost:3000/api/sync/direct', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    await POST(request);

    expect(siengeApiClient.initialize).toHaveBeenCalled();
  });

  it('deve lidar com erros de API externa', async () => {
    const { siengeApiClient } = require('../../lib/sienge-api-client');
    const { hasEndpointMapping } = require('../../app/api/sync/direct/endpoint-mappings');

    const requestBody = {
      endpoint: '/customers',
    };

    siengeApiClient.isInitialized.mockReturnValue(true);
    siengeApiClient.fetchPaginatedData.mockRejectedValue(new Error('API connection failed'));
    hasEndpointMapping.mockReturnValue(true);

    const request = new NextRequest('http://localhost:3000/api/sync/direct', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Erro durante a sincronização');
  });
});