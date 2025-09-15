# Configuração de Variáveis de Ambiente no EasyPanel

Este documento explica como configurar as variáveis de ambiente necessárias para o funcionamento correto da aplicação no EasyPanel.

## Variáveis Obrigatórias para o Frontend

Para que as informações de conexão do banco de dados sejam exibidas corretamente no componente PowerBI Links, você deve configurar as seguintes variáveis no EasyPanel:

### 1. Informações do Domínio
```
NEXT_PUBLIC_PRIMARY_DOMAIN=seu-dominio.com
```
**Exemplo:** `app.meusite.com` ou `localhost` para desenvolvimento

### 2. Porta Externa do Banco
```
NEXT_PUBLIC_DB_PORT_EXTERNAL=5432
```
**Padrão:** `5432` (porta padrão do PostgreSQL)

### 3. Nome do Banco de Dados
```
NEXT_PUBLIC_POSTGRES_DB=sienge_data
```
**Padrão:** `sienge_data` para produção ou `sienge_dev` para desenvolvimento

### 4. Usuário do Banco
```
NEXT_PUBLIC_POSTGRES_USER=sienge_app
```
**Padrão:** `sienge_app` para produção ou `sienge_dev` para desenvolvimento

## Como Configurar no EasyPanel

### Passo 1: Acessar as Configurações do Serviço
1. Faça login no seu painel EasyPanel
2. Navegue até o seu projeto/aplicação
3. Clique na aba **"Environment"** ou **"Variáveis de Ambiente"**

### Passo 2: Adicionar as Variáveis
Adicione cada uma das variáveis listadas acima com seus respectivos valores:

```
NEXT_PUBLIC_PRIMARY_DOMAIN=seu-dominio.com
NEXT_PUBLIC_DB_PORT_EXTERNAL=5432
NEXT_PUBLIC_POSTGRES_DB=sienge_data
NEXT_PUBLIC_POSTGRES_USER=sienge_app
```

### Passo 3: Salvar e Fazer Deploy
1. Clique em **"Save"** ou **"Salvar"** para aplicar as configurações
2. Clique em **"Deploy"** para que as mudanças tenham efeito na aplicação

## ⚠️ Importante

- **Prefixo NEXT_PUBLIC_**: Todas as variáveis que precisam ser acessíveis no frontend (client-side) devem ter o prefixo `NEXT_PUBLIC_`
- **Rebuild Necessário**: Após alterar variáveis `NEXT_PUBLIC_`, é necessário fazer um novo deploy/build da aplicação
- **Segurança**: Nunca coloque informações sensíveis (senhas, chaves de API) em variáveis `NEXT_PUBLIC_` pois elas ficam visíveis no código JavaScript do navegador

## Exemplo de Configuração Completa

Para um ambiente de produção típico:

```env
# Domínio da aplicação
NEXT_PUBLIC_PRIMARY_DOMAIN=meuapp.easypanel.host

# Porta do banco (geralmente a mesma do EasyPanel)
NEXT_PUBLIC_DB_PORT_EXTERNAL=5432

# Nome do banco de produção
NEXT_PUBLIC_POSTGRES_DB=sienge_data

# Usuário do banco de produção
NEXT_PUBLIC_POSTGRES_USER=sienge_app
```

## Verificação

Após configurar e fazer o deploy, acesse a seção "PowerBI Links" na sua aplicação. As informações de conexão devem aparecer corretamente com os valores configurados no EasyPanel.

Se ainda aparecerem os valores padrão (localhost, etc.), verifique se:
1. As variáveis foram salvas corretamente no EasyPanel
2. O deploy foi executado após a configuração
3. O prefixo `NEXT_PUBLIC_` está presente em todas as variáveis