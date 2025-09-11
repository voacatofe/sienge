# Configurações de Portas - Exemplos

Este documento fornece exemplos de configurações de portas para diferentes cenários de uso.

## Configurações Padrão

### Desenvolvimento
- **Aplicação**: 3000
- **PostgreSQL**: 5432
- **pgAdmin**: 8080

### Produção
- **Aplicação**: 3000
- **PostgreSQL**: 5432
- **pgAdmin**: 8080

## Cenário 1: Portas Padrão (Externas = Internas)
```bash
# .env
APP_PORT_EXTERNAL=3000
APP_PORT_INTERNAL=3000
DB_PORT_EXTERNAL=5432
DB_PORT_INTERNAL=5432
PGADMIN_PORT_EXTERNAL=8080
```

**Resultado:**
- Aplicação: http://localhost:3000
- Banco: localhost:5432
- pgAdmin: http://localhost:8080
- URL Externa: `postgresql://sienge_app:senha_forte@localhost:5432/sienge_data`
- Docker Mapping: `3000:3000`, `5432:5432`, `8080:80`

## Cenário 2: Portas Externas Diferentes das Internas
```bash
# .env
APP_PORT_EXTERNAL=3001
APP_PORT_INTERNAL=3000
DB_PORT_EXTERNAL=5433
DB_PORT_INTERNAL=5432
PGADMIN_PORT_EXTERNAL=8081
```

**Resultado:**
- Aplicação: http://localhost:3001
- Banco: localhost:5433
- pgAdmin: http://localhost:8081
- URL Externa: `postgresql://sienge_app:senha_forte@localhost:5433/sienge_data`
- Docker Mapping: `3001:3000`, `5433:5432`, `8081:80`

## Cenário 3: Apenas Banco com Porta Externa Diferente
```bash
# .env
APP_PORT_EXTERNAL=3000  # Mantém padrão
APP_PORT_INTERNAL=3000  # Mantém padrão
DB_PORT_EXTERNAL=5434   # Personalizada
DB_PORT_INTERNAL=5432   # Mantém padrão
PGADMIN_PORT_EXTERNAL=8080  # Mantém padrão
```

**Resultado:**
- Aplicação: http://localhost:3000
- Banco: localhost:5434
- pgAdmin: http://localhost:8080
- URL Externa: `postgresql://sienge_app:senha_forte@localhost:5434/sienge_data`
- Docker Mapping: `3000:3000`, `5434:5432`, `8080:80`

## Cenário 4: Portas Internas Personalizadas
```bash
# .env
APP_PORT_EXTERNAL=3000
APP_PORT_INTERNAL=8080  # Interna personalizada
DB_PORT_EXTERNAL=5432
DB_PORT_INTERNAL=3306   # Interna personalizada
PGADMIN_PORT_EXTERNAL=8080
```

**Resultado:**
- Aplicação: http://localhost:3000
- Banco: localhost:5432
- pgAdmin: http://localhost:8080
- URL Externa: `postgresql://sienge_app:senha_forte@localhost:5432/sienge_data`
- Docker Mapping: `3000:8080`, `5432:3306`, `8080:80`

## Docker Compose Mapping
```yaml
# Para DB_PORT_EXTERNAL=5433 e DB_PORT_INTERNAL=5432:
ports:
  - '5433:5432'  # Externa:Interna

# Para APP_PORT_EXTERNAL=3001 e APP_PORT_INTERNAL=3000:
ports:
  - '3001:3000'  # Externa:Interna

# Para PGADMIN_PORT_EXTERNAL=8081:
ports:
  - '8081:80'    # Externa:Interna (pgAdmin sempre usa porta 80 internamente)
```

**Explicação:**
- **Porta Externa** = Porta acessível do host (para ferramentas BI, navegador, etc.)
- **Porta Interna** = Porta dentro do container (onde o serviço realmente roda)
- A URL externa sempre usa a porta externa
- pgAdmin sempre usa porta 80 internamente (padrão da imagem)

## Verificação de Portas

### Windows (PowerShell)
```powershell
# Verificar portas em uso
netstat -an | findstr :3000
netstat -an | findstr :5432
netstat -an | findstr :8080

# Verificar processos usando as portas
Get-NetTCPConnection -LocalPort 3000
Get-NetTCPConnection -LocalPort 5432
Get-NetTCPConnection -LocalPort 8080
```

### Linux/macOS
```bash
# Verificar portas em uso
lsof -i :3000
lsof -i :5432
lsof -i :8080

# Verificar processos usando as portas
netstat -tulpn | grep :3000
netstat -tulpn | grep :5432
netstat -tulpn | grep :8080
```

## Scripts de Acesso Rápido

### Acesso ao pgAdmin
```bash
# PowerShell
.\scripts\access-pgadmin.ps1

# Linux/macOS
./scripts/access-pgadmin.sh
```

### Iniciar Ambiente
```bash
# Desenvolvimento
.\scripts\init-dev.ps1  # Windows
./scripts/init-dev.sh   # Linux/macOS

# Produção
.\scripts\init-prod.ps1 # Windows
./scripts/init-prod.sh  # Linux/macOS
```
