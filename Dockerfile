# Dockerfile único otimizado para Dev e Prod
FROM node:18-alpine AS base

# Build arguments para controlar o ambiente
ARG NODE_ENV=production
ARG BUILD_TARGET=production

# Instalar dependências necessárias para o Alpine
RUN apk add --no-cache libc6-compat curl bash netcat-openbsd

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Stage 1: Instalar dependências baseado no ambiente
FROM base AS deps
RUN if [ "$BUILD_TARGET" = "development" ]; then \
        npm ci --ignore-scripts && npm cache clean --force; \
    else \
        npm ci --include=dev --ignore-scripts && npm cache clean --force; \
    fi

# Stage 2: Build da aplicação (apenas para produção)
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Build com configurações otimizadas para resolver problemas de SSR
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runtime otimizado
FROM base AS runner

# Copiar apenas dependências de produção
COPY --from=builder /app/node_modules ./node_modules

# Copiar arquivos essenciais
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Copiar build de produção (sem standalone)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Garantir que o Prisma CLI está disponível
RUN npm install -g prisma@latest

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar script de entrypoint (como root) - ANTES de copiar scripts
COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copiar outros scripts necessários (mas não sobrescrever o entrypoint)
COPY --from=builder /app/scripts ./scripts

# Criar diretório de logs com permissões corretas para subdiretórios
RUN mkdir -p logs logs/sync-errors && chown -R nextjs:nodejs logs && chmod -R 755 logs

# Alterar proprietário dos arquivos (mas manter entrypoint como root)
RUN chown -R nextjs:nodejs /app
RUN chown root:root /usr/local/bin/docker-entrypoint.sh

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV PORT=3000
ENV NODE_ENV=${NODE_ENV}

# Definir entrypoint e comando padrão
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "start"]
