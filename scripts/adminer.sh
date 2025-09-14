#!/bin/bash

# Script para acesso ao Adminer
# Interface web para gerenciamento do banco de dados PostgreSQL

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
    echo -e "${CYAN}🗄️ Adminer - Acesso ao Banco de Dados${NC}"
    echo -e "${CYAN}=====================================${NC}"
    echo ""
    echo -e "${YELLOW}Uso:${NC}"
    echo -e "  ./scripts/adminer.sh [dev|prod]"
    echo ""
    echo -e "${YELLOW}Exemplos:${NC}"
    echo -e "  ${GREEN}./scripts/adminer.sh dev${NC}   # Acesso ao ambiente de desenvolvimento"
    echo -e "  ${GREEN}./scripts/adminer.sh prod${NC}  # Acesso ao ambiente de produção"
    echo ""
    echo -e "${YELLOW}Scripts principais:${NC}"
    echo -e "  ${GREEN}./scripts/start-dev.sh${NC}     # Script completo para desenvolvimento"
    echo -e "  ${GREEN}./scripts/start-prod.sh${NC}    # Script completo para produção"
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
    CONTAINER_NAME="sienge-adminer"
    COMPOSE_FILE="docker-compose.yml"
else
    if [ -f ".env.dev" ]; then
        export $(grep -v '^#' .env.dev | xargs)
    fi
    CONTAINER_NAME="sienge-adminer"
    COMPOSE_FILE="docker-compose-dev.yml"
fi

# Configurações baseadas no ambiente
if [ "$ENVIRONMENT" = "prod" ]; then
    DEFAULT_PORT=8080
    DB_PORT=${DB_PORT_EXTERNAL:-5432}
    DB_NAME=${POSTGRES_DB:-sienge_data}
    DB_USER=${POSTGRES_USER:-sienge_app}
    EMAIL=${ADMINER_EMAIL:-admin@sienge.local}
    PASSWORD=${ADMINER_PASSWORD:-senha_forte_adminer}
else
    DEFAULT_PORT=8080
    DB_PORT=${DB_PORT_EXTERNAL:-5433}
    DB_NAME=${POSTGRES_DB:-sienge_dev}
    DB_USER=${POSTGRES_USER:-sienge_dev}
    EMAIL=${ADMINER_EMAIL:-admin@sienge.local}
    PASSWORD=${ADMINER_PASSWORD:-admin123}
fi

# Obter porta configurada
PORT=${ADMINER_PORT_EXTERNAL:-$DEFAULT_PORT}

# Verificar se o container está rodando
if ! docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}" | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}❌ Container Adminer não está rodando!${NC}"
    echo ""
    echo -e "${YELLOW}Para iniciar o Adminer:${NC}"
    if [ "$ENVIRONMENT" = "prod" ]; then
        echo -e "  ${GREEN}./scripts/start-prod.sh start${NC}"
    else
        echo -e "  ${GREEN}./scripts/start-dev.sh start${NC}"
    fi
    echo ""
    echo -e "${YELLOW}Ou execute diretamente:${NC}"
    echo -e "  ${GREEN}docker-compose -f $COMPOSE_FILE up -d adminer${NC}"
    exit 1
fi

# Exibir informações de acesso
echo -e "${CYAN}🗄️ Adminer - Acesso Configurado${NC}"
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
echo -e "  ${GREEN}Sistema:${NC} PostgreSQL"
echo -e "  ${GREEN}Servidor:${NC} ${POSTGRES_HOST:-db}"
echo -e "  ${GREEN}Porta:${NC} ${POSTGRES_PORT:-5432}"
echo -e "  ${GREEN}Banco:${NC} $DB_NAME"
echo -e "  ${GREEN}Usuário:${NC} $DB_USER"
echo -e "  ${GREEN}Senha:${NC} ${POSTGRES_PASSWORD:-dev_password}"
echo ""
echo -e "${BLUE}🔧 Comandos Úteis:${NC}"
echo -e "  ${GREEN}Ver logs:${NC} docker logs $CONTAINER_NAME"
echo -e "  ${GREEN}Parar:${NC} docker-compose -f $COMPOSE_FILE stop adminer"
echo -e "  ${GREEN}Reiniciar:${NC} docker-compose -f $COMPOSE_FILE restart adminer"
echo ""

# Abrir automaticamente no navegador
echo -e "${GREEN}🌐 Abrindo Adminer no navegador...${NC}"
if command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:$PORT"
elif command -v open > /dev/null; then
    open "http://localhost:$PORT"
else
    echo -e "${YELLOW}💡 Abra manualmente: http://localhost:$PORT${NC}"
fi

echo -e "${CYAN}===============================${NC}"
