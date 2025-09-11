#!/bin/bash

# Script para parar ambiente de desenvolvimento
# scripts/stop-dev.sh

set -e

echo "🛑 Parando ambiente de desenvolvimento do Sienge..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Parar containers de desenvolvimento
print_status "Parando containers de desenvolvimento..."
docker-compose -f docker-compose-dev.yml down

print_success "Ambiente de desenvolvimento parado com sucesso!"

# Opção para limpar volumes também
if [ "$1" = "--clean" ] || [ "$1" = "-c" ]; then
    print_status "Removendo volumes de desenvolvimento..."
    docker-compose -f docker-compose-dev.yml down -v
    print_success "Volumes removidos!"
fi

print_status "Ambiente de desenvolvimento parado! 🛑"
