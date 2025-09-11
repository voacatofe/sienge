#!/bin/bash

# Script para testar a automação do schema setup
# Este script simula o processo de inicialização do container

set -e

echo "🧪 Testando automação do schema setup..."

# Carregar variáveis de ambiente do arquivo .env.dev
if [ -f .env.dev ]; then
    echo "📋 Carregando variáveis de ambiente do .env.dev..."
    export $(cat .env.dev | grep -v '^#' | xargs)
else
    echo "❌ Arquivo .env.dev não encontrado!"
    exit 1
fi

# Verificar se o banco está rodando
echo "🔍 Verificando se o banco de dados está rodando..."
if ! docker-compose -f docker-compose-dev.yml ps db | grep -q "Up"; then
    echo "🚀 Iniciando banco de dados..."
    docker-compose -f docker-compose-dev.yml up -d db
    
    echo "⏳ Aguardando banco estar pronto..."
    sleep 10
fi

# Executar o script de entrypoint localmente
echo "🔄 Executando script de entrypoint..."
bash scripts/docker-entrypoint.sh echo "Teste concluído!"

echo "✅ Teste da automação concluído com sucesso!"
