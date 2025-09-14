#!/bin/bash

# Script de entrypoint para inicialização automática do schema Prisma
# Este script é executado quando o container da aplicação é iniciado

set -e  # Sair em caso de erro

echo "🚀 Iniciando aplicação Sienge Data Sync..."

# Função para log com timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Função para aguardar o banco de dados estar disponível
wait_for_db() {
    log "⏳ Aguardando banco de dados estar disponível..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        # Usar curl para testar conectividade HTTP (mais simples que nc)
        if curl -f -s http://${POSTGRES_HOST:-db}:${POSTGRES_PORT:-5432} >/dev/null 2>&1 || \
           timeout 1 bash -c "</dev/tcp/${POSTGRES_HOST:-db}/${POSTGRES_PORT:-5432}" >/dev/null 2>&1; then
            log "✅ Banco de dados está disponível!"
            return 0
        fi
        
        log "🔄 Tentativa $attempt/$max_attempts - Banco ainda não disponível, aguardando..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log "❌ Erro: Banco de dados não ficou disponível após $max_attempts tentativas"
    return 1
}

# Função para executar migrações do Prisma
run_migrations() {
    log "🔄 Aplicando schema do Prisma ao banco de dados..."
    
    # Usar db push diretamente para garantir que o schema seja aplicado
    # db push é mais confiável em ambientes de produção quando não há migrações
    log "🔄 Executando prisma db push..."
    if npx prisma db push --accept-data-loss; then
        log "✅ Schema do banco de dados aplicado com sucesso!"
    else
        log "⚠️ Erro ao aplicar schema, tentando com force-reset..."
        # Em último caso, forçar reset (CUIDADO: isso apaga dados!)
        if npx prisma db push --force-reset; then
            log "⚠️ Schema aplicado com force-reset (dados foram resetados)!"
        else
            log "❌ Erro crítico ao aplicar schema do banco de dados"
            return 1
        fi
    fi
}

# Função para gerar o cliente Prisma
generate_client() {
    log "🔄 Gerando cliente Prisma..."
    npx prisma generate
    log "✅ Cliente Prisma gerado com sucesso!"
}

# Função para verificar a conexão com o banco
verify_connection() {
    log "🔍 Verificando conexão com o banco de dados..."
    
    if curl -f -s http://${POSTGRES_HOST:-db}:${POSTGRES_PORT:-5432} >/dev/null 2>&1 || \
       timeout 1 bash -c "</dev/tcp/${POSTGRES_HOST:-db}/${POSTGRES_PORT:-5432}" >/dev/null 2>&1; then
        log "✅ Conexão com banco de dados verificada!"
        return 0
    else
        log "❌ Erro: Não foi possível conectar ao banco de dados"
        return 1
    fi
}

# Função para mostrar informações do ambiente
show_environment() {
    log "📋 Informações do ambiente:"
    log "   NODE_ENV: ${NODE_ENV:-development}"
    log "   DATABASE_URL: ${DATABASE_URL:0:20}..." # Mostrar apenas início da URL por segurança
    log "   PORT: ${PORT:-3000}"
}

# Função principal
main() {
    log "🎯 Iniciando processo de inicialização..."
    
    # Mostrar informações do ambiente
    show_environment
    
    # Aguardar banco de dados estar disponível
    if ! wait_for_db; then
        log "❌ Falha na inicialização: Banco de dados não disponível"
        exit 1
    fi
    
    # Verificar conexão
    if ! verify_connection; then
        log "❌ Falha na inicialização: Não foi possível conectar ao banco"
        exit 1
    fi
    
    # Executar migrações
    if ! run_migrations; then
        log "❌ Falha na inicialização: Erro ao executar migrações"
        exit 1
    fi
    
    # Gerar cliente Prisma
    if ! generate_client; then
        log "❌ Falha na inicialização: Erro ao gerar cliente Prisma"
        exit 1
    fi
    
    log "✅ Inicialização concluída com sucesso!"
    log "🚀 Iniciando aplicação Next.js..."
    
    # Detectar se existe build standalone
    if [ -f "server.js" ]; then
        log "📦 Build standalone detectado, iniciando servidor otimizado..."
        exec node server.js
    elif [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
        log "📦 Build de produção detectado, iniciando em modo produção..."
        exec npm start
    else
        log "🔨 Build de produção não encontrado, fazendo build..."
        npm run build
        log "📦 Build concluído, iniciando em modo produção..."
        exec npm start
    fi
}

# Executar função principal com todos os argumentos passados
main "$@"
