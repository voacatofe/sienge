#!/bin/bash

# Script para parar ambiente de produção
# scripts/stop-prod.sh

set -e

echo "🛑 Parando ambiente de produção do Sienge..."

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

# Parar containers de produção
print_status "Parando containers de produção..."
docker-compose down

print_success "Ambiente de produção parado com sucesso!"

# Opção para limpar volumes também
if [ "$1" = "--clean" ] || [ "$1" = "-c" ]; then
    print_warning "ATENÇÃO: Isso irá remover TODOS os dados do banco de produção!"
    read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Removendo volumes de produção..."
        docker-compose down -v
        print_success "Volumes removidos!"
    else
        print_status "Operação cancelada."
    fi
fi

print_status "Ambiente de produção parado! 🛑"
