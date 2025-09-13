# Deploy no EasyPanel - Variáveis de Ambiente

## Variáveis Essenciais para Configurar no EasyPanel

### Banco de Dados PostgreSQL

```
POSTGRES_DB=sienge_data
POSTGRES_USER=sienge_app
POSTGRES_PASSWORD=[sua_senha_segura]
POSTGRES_HOST=db
POSTGRES_PORT=5432
DATABASE_URL=postgresql://sienge_app:[sua_senha_segura]@db:5432/sienge_data
```

### Configuração da Aplicação

```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://[seu-dominio].easypanel.host
```

### API Sienge (Configure com suas credenciais)

```
SIENGE_SUBDOMAIN=[seu-subdominio-sienge]
SIENGE_USERNAME=[seu-usuario-api-sienge]
SIENGE_PASSWORD=[sua-senha-api-sienge]
```

### Configurações de Sincronização (Opcionais)

```
SYNC_SCHEDULE=0 2 * * *
SYNC_BATCH_SIZE=200
SYNC_MAX_RETRIES=3
```

## Portas

- **Aplicação**: 3000
- **Adminer**: 8080
- **PostgreSQL**: 5432

## Passos para Deploy

1. **Criar novo projeto** no EasyPanel
2. **Configurar as variáveis** de ambiente listadas acima
3. **Fazer deploy** do código do repositório
4. **Acessar a aplicação** através da URL fornecida pelo EasyPanel
5. **Configurar credenciais** da API Sienge através da interface `/config`
6. **Testar sincronização** através da interface `/sync`

## URLs Importantes

- **Interface Principal**: `https://[seu-dominio].easypanel.host/`
- **Configuração**: `https://[seu-dominio].easypanel.host/config`
- **Sincronização**: `https://[seu-dominio].easypanel.host/sync`
- **API Health**: `https://[seu-dominio].easypanel.host/api/health`
- **Adminer (DB)**: `https://[seu-dominio].easypanel.host:8080`

## Observações

- As variáveis de ambiente devem ser configuradas no painel do EasyPanel
- Não é necessário arquivo `.env.production`
- O banco PostgreSQL será criado automaticamente
- O schema do banco será aplicado automaticamente no primeiro deploy
