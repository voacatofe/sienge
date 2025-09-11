#!/bin/bash

# Script para backup do banco de dados
# scripts/backup-db.sh

set -e

echo "💾 Criando backup do banco de dados..."

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

# Verificar se o ambiente está rodando
if [ "$1" = "dev" ]; then
    COMPOSE_FILE="docker-compose-dev.yml"
    DB_NAME="sienge_dev"
    DB_USER="sienge_dev"
    BACKUP_DIR="backups/dev"
else
    COMPOSE_FILE="docker-compose.yml"
    DB_NAME="sienge_data"
    DB_USER="sienge_app"
    BACKUP_DIR="backups/prod"
fi

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

# Gerar nome do arquivo com timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql"

print_status "Criando backup do banco $DB_NAME..."

# Verificar se os containers estão rodando
if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
    print_error "Containers não estão rodando. Execute primeiro:"
    if [ "$1" = "dev" ]; then
        print_error "./scripts/init-dev.sh"
    else
        print_error "./scripts/init-prod.sh"
    fi
    exit 1
fi

# Criar backup
docker-compose -f "$COMPOSE_FILE" exec -T db pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    print_success "Backup criado com sucesso: $BACKUP_FILE"
    
    # Mostrar tamanho do arquivo
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    print_status "Tamanho do backup: $FILE_SIZE"
    
    # Mostrar estatísticas
    print_status "Estatísticas do backup:"
    echo "  📁 Arquivo: $BACKUP_FILE"
    echo "  📊 Tamanho: $FILE_SIZE"
    echo "  🗄️  Banco: $DB_NAME"
    echo "  👤 Usuário: $DB_USER"
    echo "  📅 Data: $(date)"
    
else
    print_error "Falha ao criar backup"
    exit 1
fi

print_success "Backup concluído! 💾"
