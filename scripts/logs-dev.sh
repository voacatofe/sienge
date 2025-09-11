#!/bin/bash

# Script para visualizar logs do ambiente de desenvolvimento
# scripts/logs-dev.sh

echo "📝 Visualizando logs do ambiente de desenvolvimento..."

# Cores para output
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se os containers estão rodando
if ! docker-compose -f docker-compose-dev.yml ps | grep -q "Up"; then
    echo "❌ Nenhum container de desenvolvimento está rodando."
    echo "Execute: ./scripts/init-dev.sh"
    exit 1
fi

print_status "Pressione Ctrl+C para sair dos logs"
echo ""

# Mostrar logs em tempo real
docker-compose -f docker-compose-dev.yml logs -f
