# Configuração do Projeto Sienge

## Configuração das Variáveis de Ambiente

### 1. Credenciais da API Sienge
Edite o arquivo `.env` e configure as seguintes variáveis:

```bash
# Configurações da API Sienge
SIENGE_SUBDOMAIN=seu-subdominio-aqui
SIENGE_USERNAME=seu-usuario-api-aqui
SIENGE_PASSWORD=sua-senha-api-aqui
```

### 2. Configuração de Portas
Você pode personalizar tanto as portas externas quanto internas:

```bash
# Configurações de Portas
APP_PORT_EXTERNAL=3000    # Porta externa da aplicação Next.js
APP_PORT_INTERNAL=3000    # Porta interna da aplicação Next.js
DB_PORT_EXTERNAL=5432     # Porta externa do PostgreSQL
DB_PORT_INTERNAL=5432     # Porta interna do PostgreSQL
```

**Exemplos de uso:**
- **Portas diferentes:** `APP_PORT_EXTERNAL=3001` e `APP_PORT_INTERNAL=3000`
- **Portas iguais:** `APP_PORT_EXTERNAL=3000` e `APP_PORT_INTERNAL=3000` (padrão)

### 3. URL Externa da Base de Dados
A URL externa é construída automaticamente baseada nas suas configurações:

```bash
# Exemplo: Se DB_PORT_EXTERNAL=5433, a URL será:
postgresql://sienge_app:senha_forte@localhost:5433/sienge_data
```

**Importante:** A porta na URL externa sempre corresponde à porta externa configurada em `DB_PORT_EXTERNAL`.

## Como Executar

### 1. Configurar Credenciais
1. Copie o arquivo `.env.example` para `.env`
2. Edite o arquivo `.env` com suas credenciais reais
3. Configure as portas desejadas

### 2. Iniciar os Serviços
```bash
docker-compose up -d
```

### 3. Verificar Status
```bash
docker-compose ps
docker-compose logs -f
```

### 4. Acessar a Aplicação
- **Aplicação:** http://localhost:3000 (ou porta configurada em `APP_PORT_EXTERNAL`)
- **Banco de Dados:** localhost:5432 (ou porta configurada em `DB_PORT_EXTERNAL`)

## Configuração para Ferramentas BI

Para conectar ferramentas BI externas ao PostgreSQL:

1. **Host:** localhost (ou IP do servidor)
2. **Porta:** Valor configurado em `DB_PORT_EXTERNAL` (padrão: 5432)
3. **Database:** Valor configurado em `POSTGRES_DB` (padrão: sienge_data)
4. **Username:** Valor configurado em `POSTGRES_USER` (padrão: sienge_app)
5. **Password:** Valor configurado em `POSTGRES_PASSWORD`

### Exemplo de String de Conexão
```
# Se DB_PORT_EXTERNAL=5433:
postgresql://sienge_app:senha_forte@localhost:5433/sienge_data

# Se DB_PORT_EXTERNAL=5432 (padrão):
postgresql://sienge_app:senha_forte@localhost:5432/sienge_data
```

## Segurança

⚠️ **Importante:** 
- Nunca commite o arquivo `.env` com credenciais reais
- Use senhas fortes para produção
- Configure firewall adequadamente para acesso externo ao banco
- Considere usar SSL para conexões externas

## Troubleshooting

### Porta já em uso
Se as portas padrão estiverem em uso, altere no arquivo `.env`:
```bash
APP_PORT_EXTERNAL=3001
DB_PORT_EXTERNAL=5433
```

### Problemas de Conexão
1. Verifique se os containers estão rodando: `docker-compose ps`
2. Verifique os logs: `docker-compose logs`
3. Teste a conectividade: `docker-compose exec app curl http://localhost:3000/api/health`
