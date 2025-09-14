#!/bin/bash

# Script para iniciar ambiente de DESENVOLVIMENTO do projeto Sienge
# Otimizado para desenvolvimento com hot reload e recursos limitados

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configurações
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE=".env.dev"
COMPOSE_FILE="docker-compose-dev.yml"

# Função para imprimir mensagens coloridas
print_header() {
    echo -e "${CYAN}🛠️  Sienge - Ambiente de DESENVOLVIMENTO${NC}"
    echo -e "${CYAN}=========================================${NC}"
    echo ""
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para configurar ambiente de desenvolvimento
setup_development_environment() {
    print_status "Configurando ambiente de desenvolvimento..."
    
    # Configurações padrão para desenvolvimento
    export NODE_ENV="development"
    export BUILD_TARGET="development"
    export POSTGRES_DB="${POSTGRES_DB:-sienge_dev}"
    export POSTGRES_USER="${POSTGRES_USER:-sienge_dev}"
    export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-dev_password}"
    export DB_PORT_EXTERNAL="${DB_PORT_EXTERNAL:-5433}"
    export APP_PORT_EXTERNAL="${APP_PORT_EXTERNAL:-3000}"
    export ADMINER_PORT_EXTERNAL="${ADMINER_PORT_EXTERNAL:-8080}"
    
    # Recursos limitados para desenvolvimento
    export DB_MEMORY_LIMIT="${DB_MEMORY_LIMIT:-512M}"
    export DB_CPU_LIMIT="${DB_CPU_LIMIT:-0.5}"
    export APP_MEMORY_LIMIT="${APP_MEMORY_LIMIT:-1G}"
    export APP_CPU_LIMIT="${APP_CPU_LIMIT:-1.0}"
    export ADMINER_MEMORY_LIMIT="${ADMINER_MEMORY_LIMIT:-256M}"
    export ADMINER_CPU_LIMIT="${ADMINER_CPU_LIMIT:-0.5}"
    
    # Configurações de sincronização para desenvolvimento (mais frequente)
    export SYNC_SCHEDULE="${SYNC_SCHEDULE:-*/5 * * * *}"  # A cada 5 minutos
    export SYNC_BATCH_SIZE="${SYNC_BATCH_SIZE:-50}"
    export SYNC_MAX_RETRIES="${SYNC_MAX_RETRIES:-1}"
}

# Função para carregar variáveis de ambiente
load_env() {
    setup_development_environment
    
    if [ -f "$ENV_FILE" ]; then
        print_status "Carregando variáveis de ambiente de $ENV_FILE..."
        # Carregar apenas linhas que contêm = e não são comentários
        while IFS= read -r line; do
            if [[ "$line" =~ ^[^#]*= ]]; then
                export "$line"
            fi
        done < "$ENV_FILE"
    else
        print_warning "Arquivo $ENV_FILE não encontrado. Usando valores padrão."
        print_status "Crie o arquivo .env.dev baseado no .env.example para configurações personalizadas"
    fi
}

# Função para verificar Docker
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está rodando. Por favor, inicie o Docker Desktop."
        exit 1
    fi
    print_success "Docker está rodando"
}

# Função para verificar configurações de desenvolvimento
check_development_config() {
    print_status "Verificando configurações de desenvolvimento..."
    
    # Verificar se não está usando porta de produção
    if [ "${DB_PORT_EXTERNAL}" = "5432" ]; then
        print_warning "ATENÇÃO: Usando porta 5432 (produção) para desenvolvimento!"
        print_status "Considere usar porta 5433 para evitar conflitos"
    fi
    
    print_success "Verificação de desenvolvimento concluída"
}

# Função para iniciar ambiente de desenvolvimento
start_development() {
    local clean="$1"
    
    print_header
    print_status "Iniciando ambiente de DESENVOLVIMENTO..."
    
    check_docker
    load_env
    check_development_config
    
    # Parar containers existentes
    print_status "Parando containers existentes..."
    docker-compose -f "$COMPOSE_FILE" down 2>/dev/null || true
    
    # Limpar volumes se solicitado
    if [ "$clean" = "true" ]; then
        print_warning "Removendo volumes de desenvolvimento..."
        docker-compose -f "$COMPOSE_FILE" down -v 2>/dev/null || true
    fi
    
    # Construir e iniciar containers
    print_status "Construindo e iniciando containers de desenvolvimento..."
    docker-compose -f "$COMPOSE_FILE" up --build -d
    
    # Aguardar containers ficarem prontos
    print_status "Aguardando containers ficarem prontos..."
    sleep 15
    
    # Verificar status
    print_status "Verificando status dos containers..."
    docker-compose -f "$COMPOSE_FILE" ps
    
    # Testar conectividade
    test_connectivity
    
    # Mostrar informações de acesso
    show_access_info
}

# Função para parar ambiente de desenvolvimento
stop_development() {
    local clean="$1"
    
    print_status "Parando ambiente de DESENVOLVIMENTO..."
    load_env
    
    if [ "$clean" = "true" ]; then
        print_status "Removendo volumes de desenvolvimento..."
        docker-compose -f "$COMPOSE_FILE" down -v
    else
        docker-compose -f "$COMPOSE_FILE" down
    fi
    
    print_success "Ambiente de desenvolvimento parado com sucesso!"
}

# Função para visualizar logs
show_logs() {
    print_status "Visualizando logs do ambiente de desenvolvimento..."
    load_env
    
    if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        print_error "Nenhum container está rodando."
        print_status "Execute: $0 start"
        exit 1
    fi
    
    print_status "Pressione Ctrl+C para sair dos logs"
    echo ""
    docker-compose -f "$COMPOSE_FILE" logs -f
}

# Função para backup do banco
backup_database() {
    print_status "Criando backup do banco de dados de desenvolvimento..."
    load_env
    
    # Configurar variáveis do banco
    local db_name="sienge_dev"
    local db_user="sienge_dev"
    local backup_dir="backups/dev"
    
    # Criar diretório de backup
    mkdir -p "$backup_dir"
    
    # Gerar nome do arquivo com timestamp
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$backup_dir/backup_${db_name}_${timestamp}.sql"
    
    # Verificar se os containers estão rodando
    if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        print_error "Containers não estão rodando. Execute primeiro: $0 start"
        exit 1
    fi
    
    # Criar backup
    docker-compose -f "$COMPOSE_FILE" exec -T db pg_dump -U "$db_user" "$db_name" > "$backup_file"
    
    if [ $? -eq 0 ]; then
        local file_size=$(du -h "$backup_file" | cut -f1)
        print_success "Backup criado com sucesso: $backup_file"
        print_status "Tamanho: $file_size"
    else
        print_error "Falha ao criar backup"
        exit 1
    fi
}

# Função para testar conectividade
test_connectivity() {
    print_status "Testando conectividade..."
    
    # Testar banco de dados
    if docker-compose -f "$COMPOSE_FILE" exec -T db pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" > /dev/null 2>&1; then
        print_success "Banco de dados está acessível"
    else
        print_error "Banco de dados não está acessível"
    fi
    
    # Testar aplicação
    if curl -f "http://localhost:${APP_PORT_EXTERNAL}/api/health" > /dev/null 2>&1; then
        print_success "Aplicação está acessível"
    else
        print_warning "Aplicação ainda não está acessível (pode estar inicializando)"
    fi
}

# Função para mostrar informações de acesso
show_access_info() {
    echo ""
    print_success "🎉 Ambiente de DESENVOLVIMENTO iniciado com sucesso!"
    echo ""
    echo "📋 Informações de acesso:"
    echo "  🌐 Aplicação: http://localhost:${APP_PORT_EXTERNAL}"
    echo "  🗄️  Banco de dados: localhost:${DB_PORT_EXTERNAL}"
    echo "  📊 Adminer: http://localhost:${ADMINER_PORT_EXTERNAL}"
    echo "  📊 URL Externa BD: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${DB_PORT_EXTERNAL}/${POSTGRES_DB}"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "  📝 Ver logs: $0 logs"
    echo "  🛑 Parar: $0 stop"
    echo "  🔄 Reiniciar: $0 restart"
    echo "  🧹 Limpar tudo: $0 stop --clean"
    echo "  💾 Backup: $0 backup"
    echo ""
    echo "🛠️  Recursos de desenvolvimento:"
    echo "   - Hot reload habilitado"
    echo "   - Logs detalhados"
    echo "   - Recursos limitados"
    echo "   - Sincronização frequente (5 min)"
    echo ""
}

# Função para mostrar ajuda
show_help() {
    print_header
    
    echo -e "${YELLOW}📋 Comandos Disponíveis:${NC}"
    echo ""
    
    echo -e "${YELLOW}🛠️  Desenvolvimento:${NC}"
    echo -e "  ${GREEN}start${NC}              - Iniciar ambiente de desenvolvimento"
    echo -e "  ${GREEN}start --clean${NC}     - Iniciar ambiente limpo (remove volumes)"
    echo -e "  ${GREEN}stop${NC}               - Parar ambiente de desenvolvimento"
    echo -e "  ${GREEN}stop --clean${NC}      - Parar e remover volumes"
    echo -e "  ${GREEN}restart${NC}           - Reiniciar ambiente"
    echo -e "  ${GREEN}logs${NC}               - Visualizar logs"
    echo ""
    
    echo -e "${YELLOW}💾 Backup:${NC}"
    echo -e "  ${GREEN}backup${NC}            - Backup do banco de desenvolvimento"
    echo ""
    
    echo -e "${CYAN}💡 Exemplos de uso:${NC}"
    echo -e "  ${GREEN}$0 start${NC}                    # Iniciar desenvolvimento"
    echo -e "  ${GREEN}$0 start --clean${NC}           # Iniciar limpo"
    echo -e "  ${GREEN}$0 backup${NC}                   # Backup desenvolvimento"
    echo ""
    echo -e "${BLUE}🛠️  Recursos de desenvolvimento:${NC}"
    echo -e "  ${BLUE}• Hot reload habilitado${NC}"
    echo -e "  ${BLUE}• Logs detalhados${NC}"
    echo -e "  ${BLUE}• Recursos limitados${NC}"
    echo -e "  ${BLUE}• Sincronização frequente${NC}"
    echo ""
}

# Função principal
main() {
    cd "$PROJECT_ROOT"
    
    case "$1" in
        "start")
            start_development "$2"
            ;;
        "stop")
            stop_development "$2"
            ;;
        "restart")
            stop_development "false"
            sleep 2
            start_development "false"
            ;;
        "logs")
            show_logs
            ;;
        "backup")
            backup_database
            ;;
        "help"|"-h"|"--help"|"")
            show_help
            ;;
        *)
            print_error "Comando não reconhecido: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@"
