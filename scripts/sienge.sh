#!/bin/bash

# Script principal consolidado para gerenciar o projeto Sienge
# Substitui todos os scripts individuais

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
ENV_FILE=""
COMPOSE_FILE="docker-compose.yml"

# Função para imprimir mensagens coloridas
print_header() {
    echo -e "${CYAN}🚀 Sienge - Gerenciador Unificado${NC}"
    echo -e "${CYAN}=================================${NC}"
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

# Função para configurar ambiente
setup_environment() {
    local env="$1"
    
    case "$env" in
        "dev")
            ENV_FILE=".env.dev"
            export NODE_ENV="development"
            export BUILD_TARGET="development"
            export POSTGRES_DB="${POSTGRES_DB:-sienge_dev}"
            export POSTGRES_USER="${POSTGRES_USER:-sienge_dev}"
            export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-dev_password}"
            export DB_PORT_EXTERNAL="${DB_PORT_EXTERNAL:-5433}"
            export APP_PORT_EXTERNAL="${APP_PORT_EXTERNAL:-3000}"
            export PGADMIN_PORT_EXTERNAL="${PGADMIN_PORT_EXTERNAL:-8080}"
            export PGADMIN_EMAIL="${PGADMIN_EMAIL:-admin@sienge.local}"
            export PGADMIN_PASSWORD="${PGADMIN_PASSWORD:-admin123}"
            export PGADMIN_SERVER_MODE="False"
            export PGADMIN_MASTER_PASSWORD_REQUIRED="False"
            export DEV_VOLUMES=""
            export DB_MEMORY_LIMIT="512M"
            export DB_CPU_LIMIT="0.5"
            export APP_MEMORY_LIMIT="1G"
            export APP_CPU_LIMIT="1.0"
            export PGADMIN_MEMORY_LIMIT="512M"
            export PGADMIN_CPU_LIMIT="0.5"
            ;;
        "prod")
            ENV_FILE=".env"
            export NODE_ENV="production"
            export BUILD_TARGET="production"
            export POSTGRES_DB="${POSTGRES_DB:-sienge_data}"
            export POSTGRES_USER="${POSTGRES_USER:-sienge_app}"
            export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-senha_forte}"
            export DB_PORT_EXTERNAL="${DB_PORT_EXTERNAL:-5432}"
            export APP_PORT_EXTERNAL="${APP_PORT_EXTERNAL:-3000}"
            export PGADMIN_PORT_EXTERNAL="${PGADMIN_PORT_EXTERNAL:-8080}"
            export PGADMIN_EMAIL="${PGADMIN_EMAIL:-admin@sienge.local}"
            export PGADMIN_PASSWORD="${PGADMIN_PASSWORD:-senha_forte_pgadmin}"
            export PGADMIN_SERVER_MODE="True"
            export PGADMIN_MASTER_PASSWORD_REQUIRED="True"
            export DEV_VOLUMES=""
            export DB_MEMORY_LIMIT="1G"
            export DB_CPU_LIMIT="1.0"
            export APP_MEMORY_LIMIT="2G"
            export APP_CPU_LIMIT="2.0"
            export PGADMIN_MEMORY_LIMIT="1G"
            export PGADMIN_CPU_LIMIT="1.0"
            ;;
        *)
            print_error "Ambiente inválido: $env"
            exit 1
            ;;
    esac
}

# Função para carregar variáveis de ambiente
load_env() {
    local env="$1"
    setup_environment "$env"
    
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

# Função para iniciar ambiente
start_environment() {
    local env="$1"
    local clean="$2"
    
    print_header
    print_status "Iniciando ambiente $env..."
    
    check_docker
    load_env "$env"
    
    # Parar containers existentes
    print_status "Parando containers existentes..."
    docker-compose -f "$COMPOSE_FILE" down 2>/dev/null || true
    
    # Limpar volumes se solicitado
    if [ "$clean" = "true" ]; then
        print_warning "Removendo volumes antigos..."
        docker-compose -f "$COMPOSE_FILE" down -v 2>/dev/null || true
    fi
    
    # Construir e iniciar containers
    print_status "Construindo e iniciando containers..."
    docker-compose -f "$COMPOSE_FILE" up --build -d
    
    # Aguardar containers ficarem prontos
    print_status "Aguardando containers ficarem prontos..."
    sleep 15
    
    # Verificar status
    print_status "Verificando status dos containers..."
    docker-compose -f "$COMPOSE_FILE" ps
    
    # Testar conectividade
    test_connectivity "$env"
    
    # Mostrar informações de acesso
    show_access_info "$env"
}

# Função para parar ambiente
stop_environment() {
    local env="$1"
    local clean="$2"
    
    print_status "Parando ambiente $env..."
    load_env "$env"
    
    if [ "$clean" = "true" ]; then
        if [ "$env" = "prod" ]; then
            print_warning "ATENÇÃO: Isso irá remover TODOS os dados do banco de produção!"
            read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                print_status "Operação cancelada."
                return
            fi
        fi
        print_status "Removendo volumes..."
        docker-compose -f "$COMPOSE_FILE" down -v
    else
        docker-compose -f "$COMPOSE_FILE" down
    fi
    
    print_success "Ambiente $env parado com sucesso!"
}

# Função para visualizar logs
show_logs() {
    local env="$1"
    
    print_status "Visualizando logs do ambiente $env..."
    load_env "$env"
    
    if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        print_error "Nenhum container está rodando."
        print_status "Execute: $0 start $env"
        exit 1
    fi
    
    print_status "Pressione Ctrl+C para sair dos logs"
    echo ""
    docker-compose -f "$COMPOSE_FILE" logs -f
}

# Função para backup do banco
backup_database() {
    local env="$1"
    
    print_status "Criando backup do banco de dados $env..."
    load_env "$env"
    
    # Configurar variáveis do banco
    local db_name db_user backup_dir
    if [ "$env" = "dev" ]; then
        db_name="sienge_dev"
        db_user="sienge_dev"
        backup_dir="backups/dev"
    else
        db_name="sienge_data"
        db_user="sienge_app"
        backup_dir="backups/prod"
    fi
    
    # Criar diretório de backup
    mkdir -p "$backup_dir"
    
    # Gerar nome do arquivo com timestamp
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$backup_dir/backup_${db_name}_${timestamp}.sql"
    
    # Verificar se os containers estão rodando
    if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        print_error "Containers não estão rodando. Execute primeiro: $0 start $env"
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

# Função para restaurar backup
restore_database() {
    local env="$1"
    local backup_file="$2"
    
    if [ -z "$backup_file" ]; then
        print_error "Arquivo de backup não especificado"
        print_status "Uso: $0 restore $env <arquivo_backup>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Arquivo de backup não encontrado: $backup_file"
        exit 1
    fi
    
    print_status "Restaurando backup do arquivo: $backup_file"
    load_env "$env"
    
    # Configurar variáveis do banco
    local db_name db_user
    if [ "$env" = "dev" ]; then
        db_name="sienge_dev"
        db_user="sienge_dev"
    else
        db_name="sienge_data"
        db_user="sienge_app"
    fi
    
    print_warning "ATENÇÃO: Esta operação irá SUBSTITUIR todos os dados do banco $db_name!"
    read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Operação cancelada."
        return
    fi
    
    # Verificar se os containers estão rodando
    if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        print_error "Containers não estão rodando. Execute primeiro: $0 start $env"
        exit 1
    fi
    
    # Restaurar backup
    docker-compose -f "$COMPOSE_FILE" exec -T db psql -U "$db_user" -d "$db_name" < "$backup_file"
    
    if [ $? -eq 0 ]; then
        print_success "Backup restaurado com sucesso!"
    else
        print_error "Falha ao restaurar backup"
        exit 1
    fi
}

# Função para testar conectividade
test_connectivity() {
    local env="$1"
    
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
    local env="$1"
    
    echo ""
    print_success "🎉 Ambiente $env iniciado com sucesso!"
    echo ""
    echo "📋 Informações de acesso:"
    echo "  🌐 Aplicação: http://localhost:${APP_PORT_EXTERNAL}"
    echo "  🗄️  Banco de dados: localhost:${DB_PORT_EXTERNAL}"
    echo "  📊 pgAdmin: http://localhost:${PGADMIN_PORT_EXTERNAL}"
    echo "  📊 URL Externa BD: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST_EXTERNAL:-localhost}:${DB_PORT_EXTERNAL}/${POSTGRES_DB}"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "  📝 Ver logs: $0 logs $env"
    echo "  🛑 Parar: $0 stop $env"
    echo "  🔄 Reiniciar: $0 restart $env"
    echo "  🧹 Limpar tudo: $0 stop $env --clean"
    echo ""
}

# Função para mostrar status
show_status() {
    print_header
    
    echo -e "${YELLOW}📊 Status dos Ambientes:${NC}"
    echo ""
    
    # Verificar desenvolvimento
    echo -e "${BLUE}🛠️  Desenvolvimento:${NC}"
    if docker-compose -f "$COMPOSE_FILE" --env-file .env.dev ps 2>/dev/null | grep -q "Up"; then
        echo -e "  ${GREEN}✅ Rodando${NC}"
    else
        echo -e "  ${RED}❌ Parado${NC}"
    fi
    
    # Verificar produção
    echo -e "${BLUE}🏭 Produção:${NC}"
    if docker-compose -f "$COMPOSE_FILE" --env-file .env ps 2>/dev/null | grep -q "Up"; then
        echo -e "  ${GREEN}✅ Rodando${NC}"
    else
        echo -e "  ${RED}❌ Parado${NC}"
    fi
    echo ""
}

# Função para mostrar ajuda
show_help() {
    print_header
    
    echo -e "${YELLOW}📋 Comandos Disponíveis:${NC}"
    echo ""
    
    echo -e "${YELLOW}🛠️  Desenvolvimento:${NC}"
    echo -e "  ${GREEN}start dev${NC}          - Iniciar ambiente de desenvolvimento"
    echo -e "  ${GREEN}start dev --clean${NC}  - Iniciar ambiente limpo (remove volumes)"
    echo -e "  ${GREEN}stop dev${NC}           - Parar ambiente de desenvolvimento"
    echo -e "  ${GREEN}stop dev --clean${NC}  - Parar e remover volumes"
    echo -e "  ${GREEN}logs dev${NC}            - Visualizar logs"
    echo -e "  ${GREEN}restart dev${NC}        - Reiniciar ambiente"
    echo ""
    
    echo -e "${YELLOW}🏭 Produção:${NC}"
    echo -e "  ${GREEN}start prod${NC}         - Iniciar ambiente de produção"
    echo -e "  ${GREEN}stop prod${NC}          - Parar ambiente de produção"
    echo -e "  ${GREEN}stop prod --clean${NC} - Parar e remover volumes (CUIDADO!)"
    echo -e "  ${GREEN}logs prod${NC}          - Visualizar logs"
    echo -e "  ${GREEN}restart prod${NC}       - Reiniciar ambiente"
    echo ""
    
    echo -e "${YELLOW}💾 Backup e Restauração:${NC}"
    echo -e "  ${GREEN}backup dev${NC}         - Backup do banco de desenvolvimento"
    echo -e "  ${GREEN}backup prod${NC}        - Backup do banco de produção"
    echo -e "  ${GREEN}restore dev <arquivo>${NC} - Restaurar backup em dev"
    echo -e "  ${GREEN}restore prod <arquivo>${NC} - Restaurar backup em prod"
    echo ""
    
    echo -e "${YELLOW}🔧 Utilitários:${NC}"
    echo -e "  ${GREEN}status${NC}             - Verificar status dos ambientes"
    echo -e "  ${GREEN}clean${NC}              - Limpar sistema Docker"
    echo -e "  ${GREEN}pgadmin dev${NC}        - Abrir pgAdmin (desenvolvimento)"
    echo -e "  ${GREEN}pgadmin prod${NC}       - Abrir pgAdmin (produção)"
    echo ""
    
    echo -e "${CYAN}💡 Exemplos de uso:${NC}"
    echo -e "  ${GREEN}$0 start dev${NC}                    # Iniciar desenvolvimento"
    echo -e "  ${GREEN}$0 start prod${NC}                  # Iniciar produção"
    echo -e "  ${GREEN}$0 backup prod${NC}                 # Backup produção"
    echo -e "  ${GREEN}$0 restore dev backup.sql${NC}      # Restaurar dev"
    echo ""
}

# Função para abrir pgAdmin
open_pgadmin() {
    local env="$1"
    
    load_env "$env"
    
    # Verificar se o container está rodando
    if ! docker-compose -f "$COMPOSE_FILE" ps pgadmin | grep -q "Up"; then
        print_error "Container pgAdmin não está rodando!"
        print_status "Execute: $0 start $env"
        exit 1
    fi
    
    print_status "Abrindo pgAdmin para ambiente $env..."
    print_status "URL: http://localhost:${PGADMIN_PORT_EXTERNAL}"
    print_status "Email: ${PGADMIN_EMAIL}"
    print_status "Senha: ${PGADMIN_PASSWORD}"
    
    # Abrir no navegador
    if command -v xdg-open > /dev/null; then
        xdg-open "http://localhost:${PGADMIN_PORT_EXTERNAL}"
    elif command -v open > /dev/null; then
        open "http://localhost:${PGADMIN_PORT_EXTERNAL}"
    else
        print_warning "Abra manualmente: http://localhost:${PGADMIN_PORT_EXTERNAL}"
    fi
}

# Função principal
main() {
    cd "$PROJECT_ROOT"
    
    case "$1" in
        "start")
            start_environment "$2" "$3"
            ;;
        "stop")
            stop_environment "$2" "$3"
            ;;
        "restart")
            stop_environment "$2" "false"
            sleep 2
            start_environment "$2" "false"
            ;;
        "logs")
            show_logs "$2"
            ;;
        "backup")
            backup_database "$2"
            ;;
        "restore")
            restore_database "$2" "$3"
            ;;
        "status")
            show_status
            ;;
        "clean")
            check_docker
            print_status "Limpando sistema Docker..."
            docker system prune -f
            print_success "Limpeza concluída!"
            ;;
        "pgadmin")
            open_pgadmin "$2"
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
