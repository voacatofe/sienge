#!/bin/bash

# Script para inicializar ambiente de produção
# init-prod.sh

set -e

echo "🚀 Iniciando ambiente de produção do Sienge..."

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

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    print_error "Arquivo .env não encontrado. Por favor, configure suas variáveis de ambiente."
    print_status "Copie .env.example para .env e configure as credenciais:"
    print_status "  cp .env.example .env"
    print_status "  # Edite .env com suas credenciais reais"
    exit 1
fi

# Verificar se as credenciais estão configuradas
if grep -q "seu-subdominio" .env || grep -q "seu-usuario-api" .env || grep -q "sua-senha-api" .env; then
    print_error "Credenciais da API Sienge não foram configuradas!"
    print_status "Por favor, edite o arquivo .env e configure:"
    print_status "  SIENGE_SUBDOMAIN=seu-subdominio-real"
    print_status "  SIENGE_USERNAME=seu-usuario-api-real"
    print_status "  SIENGE_PASSWORD=sua-senha-api-real"
    exit 1
fi

print_success "Credenciais configuradas"

# Verificar se as senhas são seguras
if grep -q "senha_forte" .env; then
    print_warning "Senha padrão detectada! Considere usar uma senha mais segura para produção."
fi

# Parar containers existentes (se houver)
print_status "Parando containers existentes..."
docker-compose down 2>/dev/null || true

# Construir e iniciar containers
print_status "Construindo e iniciando containers de produção..."
docker-compose up --build -d

# Aguardar containers ficarem prontos
print_status "Aguardando containers ficarem prontos..."
sleep 15

# Verificar status dos containers
print_status "Verificando status dos containers..."
docker-compose ps

# Verificar health checks
print_status "Verificando health checks..."
sleep 10

# Testar conectividade
print_status "Testando conectividade..."

# Testar banco de dados
if docker-compose exec -T db pg_isready -U ${POSTGRES_USER:-sienge_app} -d ${POSTGRES_DB:-sienge_data} > /dev/null 2>&1; then
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
print_success "🎉 Ambiente de produção iniciado com sucesso!"
echo ""
echo "📋 Informações de acesso:"
echo "  🌐 Aplicação: http://localhost:${APP_PORT_EXTERNAL:-3000}"
echo "  🗄️  Banco de dados: localhost:${DB_PORT_EXTERNAL:-5432}"
echo "  📊 URL Externa BD: postgresql://${POSTGRES_USER:-sienge_app}:${POSTGRES_PASSWORD:-senha_forte}@localhost:${DB_PORT_EXTERNAL:-5432}/${POSTGRES_DB:-sienge_data}"
echo ""
echo "🔧 Comandos úteis:"
echo "  📝 Ver logs: docker-compose logs -f"
echo "  🛑 Parar: docker-compose down"
echo "  🔄 Reiniciar: docker-compose restart"
echo "  🧹 Limpar tudo: docker-compose down -v"
echo ""
echo "⚠️  IMPORTANTE PARA PRODUÇÃO:"
echo "  🔒 Configure firewall adequadamente"
echo "  🔐 Use senhas fortes"
echo "  📊 Configure backup do banco de dados"
echo "  📈 Configure monitoramento"
echo ""
print_status "Ambiente de produção pronto! 🚀"
