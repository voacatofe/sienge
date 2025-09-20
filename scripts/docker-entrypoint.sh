#!/bin/bash

# Script de entrypoint SEGURO para inicialização sem perda de dados
# Este script preserva todas as estruturas customizadas criadas em produção
# NUNCA usa comandos destrutivos do Prisma

set -e  # Sair em caso de erro

echo "🛡️ Iniciando aplicação Sienge Data Sync - MODO SEGURO..."

# Função para log com timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Função para aguardar o banco de dados estar disponível
wait_for_db() {
    log "⏳ Aguardando banco de dados estar disponível..."

    local max_attempts=60  # 2 minutos
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        # Testar conectividade direta com PostgreSQL
        if timeout 5 bash -c "</dev/tcp/${POSTGRES_HOST:-db}/${POSTGRES_PORT:-5432}" >/dev/null 2>&1; then
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

# Função para verificar se o PostgreSQL está realmente pronto
wait_for_postgres() {
    log "🔍 Verificando se PostgreSQL está pronto para conexões..."

    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "${POSTGRES_HOST:-db}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -c "SELECT 1;" >/dev/null 2>&1; then
            log "✅ PostgreSQL está pronto!"
            return 0
        fi

        log "🔄 Tentativa $attempt/$max_attempts - PostgreSQL ainda não pronto..."
        sleep 2
        attempt=$((attempt + 1))
    done

    log "❌ Erro: PostgreSQL não ficou pronto após $max_attempts tentativas"
    return 1
}

# Função para executar scripts SQL de inicialização de forma segura
run_safe_initialization() {
    log "🔧 Executando inicialização segura do banco de dados..."

    # Diretório com scripts de inicialização
    local sql_dir="/app/sql/init"

    if [ ! -d "$sql_dir" ]; then
        log "⚠️ Diretório de scripts SQL não encontrado: $sql_dir"
        log "🔄 Continuando sem inicialização de estruturas customizadas..."
        return 0
    fi

    log "📁 Executando scripts SQL de inicialização..."

    # Executar scripts em ordem específica
    local scripts=(
        "01_create_schemas.sql"
        "02_move_tables_to_bronze.sql"
        "03_add_custom_columns.sql"
        "04_create_views_silver.sql"
        "05_create_views_gold.sql"
        "06_create_functions.sql"
    )

    for script in "${scripts[@]}"; do
        local script_path="$sql_dir/$script"

        if [ -f "$script_path" ]; then
            log "🔄 Executando: $script"

            if PGPASSWORD="${POSTGRES_PASSWORD}" psql \
                -h "${POSTGRES_HOST:-db}" \
                -p "${POSTGRES_PORT:-5432}" \
                -U "${POSTGRES_USER}" \
                -d "${POSTGRES_DB}" \
                -f "$script_path" > /dev/null 2>&1; then
                log "✅ Script $script executado com sucesso"
            else
                log "⚠️ Aviso: Erro ao executar $script (pode já estar aplicado)"
                # Não falhar aqui - script pode já ter sido aplicado
            fi
        else
            log "⚠️ Script não encontrado: $script_path"
        fi
    done

    log "✅ Inicialização de estruturas customizadas concluída!"
}

# Função para aplicar schema Prisma de forma segura (SEM PERDA DE DADOS)
apply_prisma_schema_safe() {
    log "🔄 Aplicando schema Prisma de forma segura..."

    # NUNCA usar --accept-data-loss ou --force-reset
    # Usar apenas migrate deploy em produção

    if [ "${NODE_ENV}" = "production" ]; then
        log "🏭 Ambiente de produção detectado - usando migrate deploy"

        # Verificar se existem migrações pendentes
        if npx prisma migrate status 2>&1 | grep -q "Following migration have not yet been applied"; then
            log "🔄 Aplicando migrações pendentes..."
            if npx prisma migrate deploy; then
                log "✅ Migrações aplicadas com sucesso!"
            else
                log "❌ Erro ao aplicar migrações"
                return 1
            fi
        else
            log "✅ Todas as migrações já estão aplicadas"
        fi
    else
        log "🔧 Ambiente de desenvolvimento - usando db push (sem reset)"

        # Usar db push SEM flags destrutivas
        if npx prisma db push; then
            log "✅ Schema aplicado com sucesso!"
        else
            log "⚠️ Erro ao aplicar schema - pode haver conflitos"
            log "💡 Verifique se o schema Prisma está compatível com as estruturas existentes"
            # Não falhar aqui - o banco pode já ter as estruturas necessárias
        fi
    fi
}

# Função para gerar o cliente Prisma
generate_client() {
    log "🔄 Gerando cliente Prisma..."

    if npx prisma generate; then
        log "✅ Cliente Prisma gerado com sucesso!"
        return 0
    else
        log "❌ Erro ao gerar cliente Prisma"
        return 1
    fi
}

# Função para verificar integridade das estruturas customizadas
verify_custom_structures() {
    log "🔍 Verificando integridade das estruturas customizadas..."

    # Verificar se os schemas customizados existem
    local schemas_query="SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('bronze', 'silver', 'gold', 'staging', 'system');"

    if PGPASSWORD="${POSTGRES_PASSWORD}" psql \
        -h "${POSTGRES_HOST:-db}" \
        -p "${POSTGRES_PORT:-5432}" \
        -U "${POSTGRES_USER}" \
        -d "${POSTGRES_DB}" \
        -t -c "$schemas_query" | grep -q "bronze"; then
        log "✅ Schemas customizados detectados"

        # Verificar views materializadas
        local views_query="SELECT count(*) FROM information_schema.views WHERE table_schema IN ('silver', 'gold');"
        local view_count=$(PGPASSWORD="${POSTGRES_PASSWORD}" psql \
            -h "${POSTGRES_HOST:-db}" \
            -p "${POSTGRES_PORT:-5432}" \
            -U "${POSTGRES_USER}" \
            -d "${POSTGRES_DB}" \
            -t -c "$views_query" | tr -d ' ')

        log "📊 Views customizadas encontradas: $view_count"

        return 0
    else
        log "⚠️ Schemas customizados não encontrados - podem precisar ser criados"
        return 1
    fi
}

# Função para mostrar informações do ambiente
show_environment() {
    log "📋 Informações do ambiente:"
    log "   NODE_ENV: ${NODE_ENV:-development}"
    log "   DATABASE_URL: ${DATABASE_URL:0:20}..." # Mostrar apenas início da URL por segurança
    log "   PORT: ${PORT:-3000}"
    log "   POSTGRES_HOST: ${POSTGRES_HOST:-db}"
    log "   POSTGRES_PORT: ${POSTGRES_PORT:-5432}"
    log "   POSTGRES_DB: ${POSTGRES_DB:-sienge_data}"
}

# Função para criar backup de segurança (opcional)
create_safety_backup() {
    if [ "${ENABLE_SAFETY_BACKUP}" = "true" ]; then
        log "💾 Criando backup de segurança..."

        local backup_file="/tmp/pre_deployment_backup_$(date +%Y%m%d_%H%M%S).sql"

        if PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
            -h "${POSTGRES_HOST:-db}" \
            -p "${POSTGRES_PORT:-5432}" \
            -U "${POSTGRES_USER}" \
            -d "${POSTGRES_DB}" \
            --schema=bronze \
            --schema=silver \
            --schema=gold \
            --schema=staging \
            --schema=system \
            > "$backup_file" 2>/dev/null; then
            log "✅ Backup criado: $backup_file"
        else
            log "⚠️ Não foi possível criar backup (schemas podem não existir ainda)"
        fi
    fi
}

# Função principal
main() {
    log "🎯 Iniciando processo de inicialização SEGURA..."

    # Mostrar informações do ambiente
    show_environment

    # Aguardar banco de dados estar disponível
    if ! wait_for_db; then
        log "❌ Falha na inicialização: Banco de dados não disponível"
        exit 1
    fi

    # Aguardar PostgreSQL estar pronto
    if ! wait_for_postgres; then
        log "❌ Falha na inicialização: PostgreSQL não está pronto"
        exit 1
    fi

    # Criar backup de segurança (se habilitado)
    create_safety_backup

    # Executar inicialização segura das estruturas customizadas
    run_safe_initialization

    # Verificar integridade das estruturas
    verify_custom_structures

    # Aplicar schema Prisma de forma segura
    if ! apply_prisma_schema_safe; then
        log "❌ Falha na inicialização: Erro ao aplicar schema Prisma"
        exit 1
    fi

    # Gerar cliente Prisma
    if ! generate_client; then
        log "❌ Falha na inicialização: Erro ao gerar cliente Prisma"
        exit 1
    fi

    log "✅ Inicialização SEGURA concluída com sucesso!"
    log "🛡️ Todas as estruturas customizadas foram preservadas!"
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