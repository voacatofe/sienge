/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Desabilitar verificação estrita do TypeScript e ESLint durante build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Otimizações de build
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Output standalone para melhor performance em containers
  output: 'standalone',
  // Configuração para resolver problemas de CORS em desenvolvimento
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
