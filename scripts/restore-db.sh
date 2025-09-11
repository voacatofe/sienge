#!/bin/bash

# Script para restaurar backup do banco de dados
# scripts/restore-db.sh

set -e

echo "🔄 Restaurando backup do banco de dados..."

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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar argumentos
if [ $# -lt 2 ]; then
    print_error "Uso: $0 <ambiente> <arquivo_backup>"
    print_status "Exemplos:"
    print_status "  $0 dev backups/dev/backup_sienge_dev_20240101_120000.sql"
    print_status "  $0 prod backups/prod/backup_sienge_data_20240101_120000.sql"
    exit 1
fi

ENVIRONMENT="$1"
BACKUP_FILE="$2"

# Verificar se o arquivo de backup existe
if [ ! -f "$BACKUP_FILE" ]; then
    print_error "Arquivo de backup não encontrado: $BACKUP_FILE"
    exit 1
fi

# Configurar variáveis baseadas no ambiente
if [ "$ENVIRONMENT" = "dev" ]; then
    COMPOSE_FILE="docker-compose-dev.yml"
    DB_NAME="sienge_dev"
    DB_USER="sienge_dev"
else
    COMPOSE_FILE="docker-compose.yml"
    DB_NAME="sienge_data"
    DB_USER="sienge_app"
fi

print_warning "ATENÇÃO: Esta operação irá SUBSTITUIR todos os dados do banco $DB_NAME!"
print_warning "Certifique-se de que você tem um backup atual antes de continuar."

read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Operação cancelada."
    exit 0
fi

print_status "Restaurando backup do arquivo: $BACKUP_FILE"

# Verificar se os containers estão rodando
if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
    print_error "Containers não estão rodando. Execute primeiro:"
    if [ "$ENVIRONMENT" = "dev" ]; then
        print_error "./scripts/init-dev.sh"
    else
        print_error "./scripts/init-prod.sh"
    fi
    exit 1
fi

# Restaurar backup
print_status "Restaurando dados..."
docker-compose -f "$COMPOSE_FILE" exec -T db psql -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    print_success "Backup restaurado com sucesso!"
    print_status "Banco $DB_NAME foi restaurado com os dados do arquivo $BACKUP_FILE"
else
    print_error "Falha ao restaurar backup"
    exit 1
fi

print_success "Restauração concluída! 🔄"
