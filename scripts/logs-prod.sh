#!/bin/bash

# Script para visualizar logs do ambiente de produção
# scripts/logs-prod.sh

echo "📝 Visualizando logs do ambiente de produção..."

# Cores para output
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se os containers estão rodando
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Nenhum container de produção está rodando."
    echo "Execute: ./scripts/init-prod.sh"
    exit 1
fi

print_status "Pressione Ctrl+C para sair dos logs"
echo ""

# Mostrar logs em tempo real
docker-compose logs -f
