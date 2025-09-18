/**
 * Testes para o endpoint de health check
 */

import { NextRequest } from 'next/server';
import { GET } from '../../app/api/health/route';

// Mock do Prisma
jest.mock('../../lib/prisma-singleton', () => ({
  prisma: {
    $queryRaw: jest.fn(),
  },
  checkDBHealth: jest.fn(),
}));

// Mock do cliente Sienge
jest.mock('../../lib/sienge-api-client', () => ({
  siengeApiClient: {
    isInitialized: jest.fn(),
    initialize: jest.fn(),
    testConnection: jest.fn(),
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

describe('/api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar status healthy quando todos os serviços estão funcionando', async () => {
    const { checkDBHealth } = require('../../lib/prisma-singleton');
    const { siengeApiClient } = require('../../lib/sienge-api-client');

    // Mock successful responses
    checkDBHealth.mockResolvedValue({ status: 'healthy', responseTime: 25 });
    siengeApiClient.isInitialized.mockReturnValue(true);
    siengeApiClient.testConnection.mockResolvedValue(true);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.status).toBe('healthy');
    expect(data.services.database.status).toBe('healthy');
    expect(data.services.sienge_api.status).toBe('healthy');
  });

  it('deve retornar status degraded quando database está offline', async () => {
    const { checkDBHealth } = require('../../lib/prisma-singleton');
    const { siengeApiClient } = require('../../lib/sienge-api-client');

    // Mock database failure
    checkDBHealth.mockRejectedValue(new Error('Connection refused'));
    siengeApiClient.isInitialized.mockReturnValue(true);
    siengeApiClient.testConnection.mockResolvedValue(true);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.success).toBe(false);
    expect(data.status).toBe('degraded');
    expect(data.services.database.status).toBe('unhealthy');
    expect(data.services.sienge_api.status).toBe('healthy');
  });

  it('deve retornar status degraded quando Sienge API está offline', async () => {
    const { checkDBHealth } = require('../../lib/prisma-singleton');
    const { siengeApiClient } = require('../../lib/sienge-api-client');

    // Mock API failure
    checkDBHealth.mockResolvedValue({ status: 'healthy', responseTime: 25 });
    siengeApiClient.isInitialized.mockReturnValue(false);
    siengeApiClient.initialize.mockRejectedValue(
      new Error('API connection failed')
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.success).toBe(false);
    expect(data.status).toBe('degraded');
    expect(data.services.database.status).toBe('healthy');
    expect(data.services.sienge_api.status).toBe('unhealthy');
  });

  it('deve incluir informações do sistema na resposta', async () => {
    const { checkDBHealth } = require('../../lib/prisma-singleton');
    const { siengeApiClient } = require('../../lib/sienge-api-client');

    checkDBHealth.mockResolvedValue({ status: 'healthy', responseTime: 25 });
    siengeApiClient.isInitialized.mockReturnValue(true);
    siengeApiClient.testConnection.mockResolvedValue(true);

    const response = await GET();
    const data = await response.json();

    expect(data.system).toBeDefined();
    expect(data.system.memory).toBeDefined();
    expect(data.system.uptime).toBeDefined();
    expect(data.system.environment).toBeDefined();
    expect(data.timestamp).toBeDefined();
  });
});
