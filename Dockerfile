# Dockerfile único otimizado para Dev e Prod
FROM node:18-alpine AS base

# Build arguments para controlar o ambiente
ARG NODE_ENV=production
ARG BUILD_TARGET=production

# Instalar dependências necessárias para o Alpine
RUN apk add --no-cache libc6-compat curl bash

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Stage 1: Instalar dependências baseado no ambiente
FROM base AS deps
RUN if [ "$BUILD_TARGET" = "development" ]; then \
        npm ci --ignore-scripts && npm cache clean --force; \
    else \
        npm ci --ignore-scripts && npm cache clean --force; \
    fi

# Stage 2: Build da aplicação (apenas para produção)
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Build sempre para produção (EasyPanel)
RUN npm run build

# Stage 3: Runtime
FROM base AS runner

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte INCLUINDO prisma/schema.prisma
COPY . .

# Copiar build de produção
COPY --from=builder /app/.next ./.next

# Garantir que o Prisma CLI está disponível
RUN npm install -g prisma@latest

# Copiar script de entrypoint
COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Criar diretório de logs
RUN mkdir -p logs && chown nextjs:nodejs logs

# Alterar proprietário dos arquivos
RUN chown -R nextjs:nodejs /app

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV PORT=3000
ENV NODE_ENV=${NODE_ENV}

# Definir entrypoint personalizado
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
