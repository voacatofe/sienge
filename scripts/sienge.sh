#!/bin/bash

# Script principal para gerenciar o projeto Sienge
# scripts/sienge.sh

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_header() {
    echo -e "${CYAN}🚀 Sienge - Gerenciador de Ambientes${NC}"
    echo -e "${CYAN}=====================================${NC}"
    echo ""
}

print_command() {
    echo -e "${GREEN}$1${NC} - $2"
}

print_description() {
    echo -e "    ${BLUE}$1${NC}"
}

show_help() {
    print_header
    
    echo -e "${YELLOW}📋 Comandos Disponíveis:${NC}"
    echo ""
    
    echo -e "${YELLOW}🛠️  Desenvolvimento:${NC}"
    print_command "dev" "Iniciar ambiente de desenvolvimento"
    print_description "Inicia containers com hot reload e configurações de dev"
    echo ""
    
    print_command "dev-clean" "Iniciar ambiente de desenvolvimento (limpo)"
    print_description "Remove volumes antigos e inicia ambiente limpo"
    echo ""
    
    print_command "stop-dev" "Parar ambiente de desenvolvimento"
    print_description "Para todos os containers de desenvolvimento"
    echo ""
    
    print_command "stop-dev-clean" "Parar ambiente de desenvolvimento (limpo)"
    print_description "Para containers e remove volumes de desenvolvimento"
    echo ""
    
    print_command "logs-dev" "Visualizar logs de desenvolvimento"
    print_description "Mostra logs em tempo real do ambiente de desenvolvimento"
    echo ""
    
    echo -e "${YELLOW}🏭 Produção:${NC}"
    print_command "prod" "Iniciar ambiente de produção"
    print_description "Inicia containers otimizados para produção"
    echo ""
    
    print_command "stop-prod" "Parar ambiente de produção"
    print_description "Para todos os containers de produção"
    echo ""
    
    print_command "stop-prod-clean" "Parar ambiente de produção (limpo)"
    print_description "Para containers e remove volumes de produção (CUIDADO!)"
    echo ""
    
    print_command "logs-prod" "Visualizar logs de produção"
    print_description "Mostra logs em tempo real do ambiente de produção"
    echo ""
    
    echo -e "${YELLOW}💾 Backup e Restauração:${NC}"
    print_command "backup-dev" "Criar backup do banco de desenvolvimento"
    print_description "Cria backup do banco sienge_dev"
    echo ""
    
    print_command "backup-prod" "Criar backup do banco de produção"
    print_description "Cria backup do banco sienge_data"
    echo ""
    
    print_command "restore-dev <arquivo>" "Restaurar backup no ambiente de desenvolvimento"
    print_description "Restaura backup no banco sienge_dev"
    echo ""
    
    print_command "restore-prod <arquivo>" "Restaurar backup no ambiente de produção"
    print_description "Restaura backup no banco sienge_data"
    echo ""
    
    echo -e "${YELLOW}🗄️  Banco de Dados:${NC}"
    print_command "pgadmin-dev" "Abrir pgAdmin (desenvolvimento)"
    print_description "Abre pgAdmin para gerenciar banco de desenvolvimento"
    echo ""
    
    print_command "pgadmin-prod" "Abrir pgAdmin (produção)"
    print_description "Abre pgAdmin para gerenciar banco de produção"
    echo ""
    
    echo -e "${YELLOW}🔧 Utilitários:${NC}"
    print_command "status" "Verificar status dos ambientes"
    print_description "Mostra status de todos os containers"
    echo ""
    
    print_command "clean" "Limpar sistema Docker"
    print_description "Remove containers, volumes e imagens não utilizados"
    echo ""
    
    echo -e "${YELLOW}📚 Documentação:${NC}"
    print_command "docs" "Abrir documentação"
    print_description "Abre arquivos de documentação do projeto"
    echo ""
    
    echo -e "${CYAN}💡 Exemplos de uso:${NC}"
    echo -e "  ${GREEN}./scripts/sienge.sh dev${NC}                    # Iniciar desenvolvimento"
    echo -e "  ${GREEN}./scripts/sienge.sh prod${NC}                   # Iniciar produção"
    echo -e "  ${GREEN}./scripts/sienge.sh backup-prod${NC}            # Backup produção"
    echo -e "  ${GREEN}./scripts/sienge.sh restore-dev backup.sql${NC}  # Restaurar dev"
    echo ""
}

show_status() {
    print_header
    
    echo -e "${YELLOW}📊 Status dos Ambientes:${NC}"
    echo ""
    
    echo -e "${BLUE}🛠️  Desenvolvimento:${NC}"
    if docker-compose -f docker-compose-dev.yml ps | grep -q "Up"; then
        echo -e "  ${GREEN}✅ Rodando${NC}"
        docker-compose -f docker-compose-dev.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        echo -e "  ${CYAN}🌐 Acessos:${NC}"
        echo -e "    ${GREEN}App:${NC} http://localhost:3000"
        echo -e "    ${GREEN}pgAdmin:${NC} http://localhost:8080"
        echo -e "    ${GREEN}PostgreSQL:${NC} localhost:5433"
    else
        echo -e "  ${RED}❌ Parado${NC}"
    fi
    echo ""
    
    echo -e "${BLUE}🏭 Produção:${NC}"
    if docker-compose ps | grep -q "Up"; then
        echo -e "  ${GREEN}✅ Rodando${NC}"
        docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        echo -e "  ${CYAN}🌐 Acessos:${NC}"
        echo -e "    ${GREEN}App:${NC} http://localhost:3000"
        echo -e "    ${GREEN}pgAdmin:${NC} http://localhost:8080"
        echo -e "    ${GREEN}PostgreSQL:${NC} localhost:5432"
    else
        echo -e "  ${RED}❌ Parado${NC}"
    fi
    echo ""
}

# Verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker não está rodando. Por favor, inicie o Docker Desktop.${NC}"
        exit 1
    fi
}

# Processar comandos
case "$1" in
    "dev")
        check_docker
        ./scripts/init-dev.sh
        ;;
    "dev-clean")
        check_docker
        ./scripts/init-dev.sh --clean
        ;;
    "stop-dev")
        ./scripts/stop-dev.sh
        ;;
    "stop-dev-clean")
        ./scripts/stop-dev.sh --clean
        ;;
    "logs-dev")
        ./scripts/logs-dev.sh
        ;;
    "prod")
        check_docker
        ./scripts/init-prod.sh
        ;;
    "stop-prod")
        ./scripts/stop-prod.sh
        ;;
    "stop-prod-clean")
        ./scripts/stop-prod.sh --clean
        ;;
    "logs-prod")
        ./scripts/logs-prod.sh
        ;;
    "backup-dev")
        ./scripts/backup-db.sh dev
        ;;
    "backup-prod")
        ./scripts/backup-db.sh prod
        ;;
    "restore-dev")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Arquivo de backup não especificado${NC}"
            echo -e "${BLUE}Uso: ./scripts/sienge.sh restore-dev <arquivo>${NC}"
            exit 1
        fi
        ./scripts/restore-db.sh dev "$2"
        ;;
    "restore-prod")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Arquivo de backup não especificado${NC}"
            echo -e "${BLUE}Uso: ./scripts/sienge.sh restore-prod <arquivo>${NC}"
            exit 1
        fi
        ./scripts/restore-db.sh prod "$2"
        ;;
    "pgadmin-dev")
        ./scripts/pgadmin.sh dev
        ;;
    "pgadmin-prod")
        ./scripts/pgadmin.sh prod
        ;;
    "status")
        show_status
        ;;
    "clean")
        check_docker
        echo -e "${YELLOW}🧹 Limpando sistema Docker...${NC}"
        docker system prune -f
        echo -e "${GREEN}✅ Limpeza concluída!${NC}"
        ;;
    "docs")
        echo -e "${BLUE}📚 Abrindo documentação...${NC}"
        if command -v code >/dev/null 2>&1; then
            code README-AMBIENTES.md CONFIGURACAO.md EXEMPLOS_PORTAS.md
        else
            echo -e "${YELLOW}Arquivos de documentação disponíveis:${NC}"
            echo -e "  ${GREEN}README-AMBIENTES.md${NC} - Guia de ambientes"
            echo -e "  ${GREEN}CONFIGURACAO.md${NC} - Configuração detalhada"
            echo -e "  ${GREEN}EXEMPLOS_PORTAS.md${NC} - Exemplos de portas"
        fi
        ;;
    "help"|"-h"|"--help"|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Comando não reconhecido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
