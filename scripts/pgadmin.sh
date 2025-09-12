#!/bin/bash

# Script para acesso ao pgAdmin
# Chamado pelo script principal sienge.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configurações padrão
ENVIRONMENT="dev"

# Função de ajuda
show_help() {
    echo -e "${CYAN}🗄️ pgAdmin - Acesso ao Banco de Dados${NC}"
    echo -e "${CYAN}=====================================${NC}"
    echo ""
    echo -e "${YELLOW}Uso:${NC}"
    echo -e "  ./scripts/pgadmin.sh [dev|prod]"
    echo ""
    echo -e "${YELLOW}Exemplos:${NC}"
    echo -e "  ${GREEN}./scripts/pgadmin.sh dev${NC}   # Acesso ao ambiente de desenvolvimento"
    echo -e "  ${GREEN}./scripts/pgadmin.sh prod${NC}  # Acesso ao ambiente de produção"
    echo ""
}

# Processar argumentos
if [ "$1" = "dev" ] || [ "$1" = "prod" ]; then
    ENVIRONMENT="$1"
elif [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
elif [ -n "$1" ]; then
    echo -e "${RED}❌ Ambiente inválido: $1${NC}"
    echo -e "${BLUE}Use 'dev' ou 'prod'${NC}"
    exit 1
fi

# Carregar variáveis de ambiente
if [ "$ENVIRONMENT" = "prod" ]; then
    if [ -f ".env" ]; then
        export $(grep -v '^#' .env | xargs)
    fi
    CONTAINER_NAME="sienge-pgadmin"
    COMPOSE_FILE="docker-compose.yml"
else
    if [ -f ".env.dev" ]; then
        export $(grep -v '^#' .env.dev | xargs)
    fi
    CONTAINER_NAME="sienge-pgadmin-dev"
    COMPOSE_FILE="docker-compose.yml"
fi

# Configurações baseadas no ambiente
if [ "$ENVIRONMENT" = "prod" ]; then
    DEFAULT_PORT=8080
    DB_PORT=${DB_PORT_EXTERNAL:-5432}
    DB_NAME=${POSTGRES_DB:-sienge_data}
    DB_USER=${POSTGRES_USER:-sienge_app}
    EMAIL=${PGADMIN_EMAIL:-admin@sienge.local}
    PASSWORD=${PGADMIN_PASSWORD:-senha_forte_pgadmin}
else
    DEFAULT_PORT=8080
    DB_PORT=${DB_PORT_EXTERNAL:-5433}
    DB_NAME=${POSTGRES_DB:-sienge_dev}
    DB_USER=${POSTGRES_USER:-sienge_dev}
    EMAIL=${PGADMIN_EMAIL:-admin@sienge.local}
    PASSWORD=${PGADMIN_PASSWORD:-admin123}
fi

# Obter porta configurada
PORT=${PGADMIN_PORT_EXTERNAL:-$DEFAULT_PORT}

# Verificar se o container está rodando
if ! docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}" | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}❌ Container pgAdmin não está rodando!${NC}"
    echo ""
    echo -e "${YELLOW}Para iniciar o pgAdmin:${NC}"
    echo -e "  ${GREEN}./scripts/sienge.sh $ENVIRONMENT${NC}"
    echo ""
    echo -e "${YELLOW}Ou execute diretamente:${NC}"
    echo -e "  ${GREEN}docker-compose -f $COMPOSE_FILE up -d pgadmin${NC}"
    exit 1
fi

# Exibir informações de acesso
echo -e "${CYAN}🗄️ pgAdmin - Acesso Configurado${NC}"
echo -e "${CYAN}===============================${NC}"
echo ""
echo -e "${BLUE}🌐 URL de Acesso:${NC}"
echo -e "  ${GREEN}http://localhost:$PORT${NC}"
echo ""
echo -e "${BLUE}🔐 Credenciais:${NC}"
echo -e "  ${GREEN}Email:${NC} $EMAIL"
echo -e "  ${GREEN}Senha:${NC} $PASSWORD"
echo ""
echo -e "${BLUE}📊 Configuração do Banco de Dados:${NC}"
echo -e "  ${GREEN}Host:${NC} ${POSTGRES_HOST:-db}"
echo -e "  ${GREEN}Porta:${NC} ${POSTGRES_PORT:-5432}"
echo -e "  ${GREEN}Banco:${NC} $DB_NAME"
echo -e "  ${GREEN}Usuário:${NC} $DB_USER"
echo ""
echo -e "${BLUE}🔧 Comandos Úteis:${NC}"
echo -e "  ${GREEN}Ver logs:${NC} docker logs $CONTAINER_NAME"
echo -e "  ${GREEN}Parar:${NC} docker-compose -f $COMPOSE_FILE stop pgadmin"
echo -e "  ${GREEN}Reiniciar:${NC} docker-compose -f $COMPOSE_FILE restart pgadmin"
echo ""

# Abrir automaticamente no navegador
echo -e "${GREEN}🌐 Abrindo pgAdmin no navegador...${NC}"
if command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:$PORT"
elif command -v open > /dev/null; then
    open "http://localhost:$PORT"
else
    echo -e "${YELLOW}💡 Abra manualmente: http://localhost:$PORT${NC}"
fi

echo -e "${CYAN}===============================${NC}"

