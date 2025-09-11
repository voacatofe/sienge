# Exemplos de Configuração de Portas

## Cenário 1: Portas Padrão (Externas = Internas)
```bash
# .env
APP_PORT_EXTERNAL=3000
APP_PORT_INTERNAL=3000
DB_PORT_EXTERNAL=5432
DB_PORT_INTERNAL=5432
```

**Resultado:**
- Aplicação: http://localhost:3000
- Banco: localhost:5432
- URL Externa: `postgresql://sienge_app:senha_forte@localhost:5432/sienge_data`
- Docker Mapping: `3000:3000` e `5432:5432`

## Cenário 2: Portas Externas Diferentes das Internas
```bash
# .env
APP_PORT_EXTERNAL=3001
APP_PORT_INTERNAL=3000
DB_PORT_EXTERNAL=5433
DB_PORT_INTERNAL=5432
```

**Resultado:**
- Aplicação: http://localhost:3001
- Banco: localhost:5433
- URL Externa: `postgresql://sienge_app:senha_forte@localhost:5433/sienge_data`
- Docker Mapping: `3001:3000` e `5433:5432`

## Cenário 3: Apenas Banco com Porta Externa Diferente
```bash
# .env
APP_PORT_EXTERNAL=3000  # Mantém padrão
APP_PORT_INTERNAL=3000  # Mantém padrão
DB_PORT_EXTERNAL=5434   # Personalizada
DB_PORT_INTERNAL=5432   # Mantém padrão
```

**Resultado:**
- Aplicação: http://localhost:3000
- Banco: localhost:5434
- URL Externa: `postgresql://sienge_app:senha_forte@localhost:5434/sienge_data`
- Docker Mapping: `3000:3000` e `5434:5432`

## Cenário 4: Portas Internas Personalizadas
```bash
# .env
APP_PORT_EXTERNAL=3000
APP_PORT_INTERNAL=8080  # Interna personalizada
DB_PORT_EXTERNAL=5432
DB_PORT_INTERNAL=3306   # Interna personalizada
```

**Resultado:**
- Aplicação: http://localhost:3000
- Banco: localhost:5432
- URL Externa: `postgresql://sienge_app:senha_forte@localhost:5432/sienge_data`
- Docker Mapping: `3000:8080` e `5432:3306`

## Docker Compose Mapping
```yaml
# Para DB_PORT_EXTERNAL=5433 e DB_PORT_INTERNAL=5432:
ports:
  - '5433:5432'  # Externa:Interna

# Para APP_PORT_EXTERNAL=3001 e APP_PORT_INTERNAL=3000:
ports:
  - '3001:3000'  # Externa:Interna
```

**Explicação:**
- **Porta Externa** = Porta acessível do host (para ferramentas BI, navegador, etc.)
- **Porta Interna** = Porta dentro do container (onde o serviço realmente roda)
- A URL externa sempre usa a porta externa
