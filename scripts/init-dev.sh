#!/bin/bash

# Script para inicializar ambiente de desenvolvimento
# init-dev.sh

set -e

echo "🚀 Iniciando ambiente de desenvolvimento do Sienge..."

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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    print_error "Docker não está rodando. Por favor, inicie o Docker Desktop."
    exit 1
fi

print_success "Docker está rodando"

# Verificar se o arquivo .env.dev existe
if [ ! -f ".env.dev" ]; then
    print_warning "Arquivo .env.dev não encontrado. Criando a partir do .env.example..."
    cp .env.example .env.dev
    print_success "Arquivo .env.dev criado"
fi

# Verificar se o arquivo .env existe (para produção)
if [ ! -f ".env" ]; then
    print_warning "Arquivo .env não encontrado. Criando a partir do .env.example..."
    cp .env.example .env
    print_success "Arquivo .env criado"
fi

# Parar containers existentes (se houver)
print_status "Parando containers existentes..."
docker-compose -f docker-compose-dev.yml down 2>/dev/null || true

# Remover volumes antigos (opcional - descomente se quiser limpar dados)
# print_status "Removendo volumes antigos..."
# docker volume rm sienge_postgres-dev-data 2>/dev/null || true

# Construir e iniciar containers
print_status "Construindo e iniciando containers de desenvolvimento..."
docker-compose -f docker-compose-dev.yml --env-file .env.dev up --build -d

# Aguardar containers ficarem prontos
print_status "Aguardando containers ficarem prontos..."
sleep 10

# Verificar status dos containers
print_status "Verificando status dos containers..."
docker-compose -f docker-compose-dev.yml ps

# Verificar health checks
print_status "Verificando health checks..."
sleep 5

# Testar conectividade
print_status "Testando conectividade..."

# Testar banco de dados
if docker-compose -f docker-compose-dev.yml exec -T db pg_isready -U ${POSTGRES_USER:-sienge_dev} -d ${POSTGRES_DB:-sienge_dev} > /dev/null 2>&1; then
    print_success "Banco de dados está acessível"
else
    print_error "Banco de dados não está acessível"
fi

# Testar aplicação
if curl -f http://localhost:${APP_PORT_EXTERNAL:-3000}/api/health > /dev/null 2>&1; then
    print_success "Aplicação está acessível"
else
    print_warning "Aplicação ainda não está acessível (pode estar inicializando)"
fi

# Mostrar informações de acesso
echo ""
print_success "🎉 Ambiente de desenvolvimento iniciado com sucesso!"
echo ""
echo "📋 Informações de acesso:"
echo "  🌐 Aplicação: http://localhost:${APP_PORT_EXTERNAL:-3000}"
echo "  🗄️  Banco de dados: localhost:${DB_PORT_EXTERNAL:-5432}"
echo "  📊 URL Externa BD: postgresql://${POSTGRES_USER:-sienge_dev}:${POSTGRES_PASSWORD:-dev_password}@localhost:${DB_PORT_EXTERNAL:-5432}/${POSTGRES_DB:-sienge_dev}"
echo ""
echo "🔧 Comandos úteis:"
echo "  📝 Ver logs: docker-compose -f docker-compose-dev.yml logs -f"
echo "  🛑 Parar: docker-compose -f docker-compose-dev.yml down"
echo "  🔄 Reiniciar: docker-compose -f docker-compose-dev.yml restart"
echo "  🧹 Limpar tudo: docker-compose -f docker-compose-dev.yml down -v"
echo ""
print_status "Ambiente de desenvolvimento pronto! 🚀"
