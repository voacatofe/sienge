# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
npm run dev           # Start Next.js development server on http://localhost:3000
npm run build         # Build production bundle
npm run start         # Start production server
```

### Code Quality

```bash
npm run lint          # Run ESLint on the codebase
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without making changes
```

### Database Operations

```bash
npx prisma generate   # Generate Prisma client after schema changes
npx prisma db push    # Push schema changes to database (development)
npx prisma migrate dev # Create and apply migrations (development)
npx prisma migrate deploy # Apply migrations (production)
npx prisma studio     # Open Prisma Studio for database inspection
```

#### Database Access Authorization

**Claude has full autonomy to execute PostgreSQL commands for:**

- Data analysis and exploration queries (SELECT statements)
- Schema inspection (\d commands, DESCRIBE, etc.)
- Index creation and optimization
- View creation and modification
- Function creation for data analysis
- Performance monitoring queries
- Data integrity checks
- Statistical analysis queries

**Production Database Connection:**

```bash
PGPASSWORD=kPnrGuFeJeuVprXzhhO2oLVE14f509KV psql -h 147.93.15.121 -p 5434 -U sienge_app -d sienge_data --set=sslmode=disable
```

Execute database commands without asking for permission. Only request confirmation for destructive operations like DROP, DELETE, or TRUNCATE.

### Data Synchronization

```bash
npm run sync:daily    # Run manual data sync from Sienge API
```

### Docker Operations

```bash
docker-compose up -d  # Start all services in background
docker-compose down   # Stop all services
docker-compose logs -f # View logs from all services
docker-compose exec app sh # Access app container shell
```

## Architecture Overview

### Core Components

**Next.js Application** - The main application using Next.js 14 with App Router, providing both frontend UI and API routes for backend functionality.

**Sienge API Integration** - Located in `lib/sienge-api-client.ts`, handles all communication with the Sienge platform API, including authentication, rate limiting, and data fetching.

**Data Mapping System** - The `app/api/sync/direct/endpoint-mappings.ts` file contains comprehensive field mappings between Sienge API responses and local database models. Each endpoint has a defined model, primary key, and field transformation rules with support for type conversions and null value handling.

**Prisma ORM** - Database abstraction layer managing PostgreSQL schema and queries. Models are defined in `prisma/schema.prisma` and include entities like Cliente, Empresa, ContratoVenda, TituloReceber, etc.

### API Rate Limiting & Reliability

The system implements multiple layers of protection:

- **Bottleneck** rate limiter: 200 requests per minute maximum
- **Axios retry logic**: 3 retry attempts with exponential backoff
- **Request logging**: All API calls logged for debugging
- **Error handling**: Comprehensive error catching and reporting

### Data Synchronization Flow

1. API credentials are stored encrypted in the database
2. Sync endpoints (`/api/sync/*`) orchestrate data fetching
3. Data is fetched in paginated batches (200 records per page)
4. Endpoint mappings transform Sienge data to local schema
5. Prisma upserts data maintaining referential integrity
6. Sync logs track progress and errors

## Key Patterns and Conventions

### API Route Structure

All API routes follow RESTful conventions in `app/api/`:

- Configuration endpoints: `/api/config/*`
- Sync operations: `/api/sync/*`
- Health monitoring: `/api/health`, `/api/metrics`
- Sienge proxy: `/api/sienge/proxy`

### Database Models

Models follow Portuguese naming from the Sienge system but use English for system tables:

- Business entities: `cliente`, `empresa`, `empreendimento`
- Financial: `titulo_receber`, `contas_receber`
- System: `ApiCredentials`, `SyncLog`

### Error Handling

Consistent error response format:

```typescript
return NextResponse.json(
  { error: 'Error message', details: additionalInfo },
  { status: errorCode }
);
```

### Field Transformations

Common patterns in endpoint mappings:

- Date fields: Transform string to Date objects
- Boolean fields: Handle null/undefined as false
- Numeric fields: Parse strings to floats/integers
- Complex objects: Preserve as JSON or null

## Important Considerations

### Security

- API credentials are hashed before storage (bcrypt)
- Environment variables for sensitive configuration
- No credentials in code or logs
- CORS headers configured for production use

### Performance

- Pagination for large datasets (200 records max)
- Database indexes on frequently queried fields
- Connection pooling via Prisma
- Rate limiting to respect API quotas

### Data Integrity

- Upsert operations prevent duplicates
- Primary keys mapped from Sienge IDs
- Transactions for multi-table operations
- Sync logs for audit trail

## Task Master Integration

This project uses Task Master AI for task management. See `.taskmaster/CLAUDE.md` for workflow commands and guidelines. Key files:

- `.taskmaster/tasks/tasks.json` - Task definitions
- `.taskmaster/config.json` - AI model configuration
- `.mcp.json` - MCP server configuration for Claude Code integration

Use `task-master next` to find the next available task and `task-master set-status --id=<id> --status=done` to mark tasks complete.

## Testing Approach

### Test Organization

**IMPORTANT: All tests must be created and organized in the centralized `tests/` directory structure:**

```
tests/
├── api/           # Jest/TypeScript unit tests for API routes
├── scripts/       # Node.js/TypeScript integration test scripts
├── python/        # Python API test scripts
├── looker-studio/ # Google Apps Script tests
├── data/          # Test data files (JSON, mock data)
└── sql/           # SQL test scripts
```

### Testing Framework

Jest is configured via `jest.config.js` to run tests from the `tests/` directory:

- Pattern: `<rootDir>/tests/**/*.test.ts` and `<rootDir>/tests/**/*.test.tsx`
- Environment: `jest-environment-node`
- Setup: `jest.setup.js` for test configuration

### Test Categories

1. **API Route Tests** (`tests/api/`) - Jest unit tests with mocked dependencies:
   - Authentication and credentials validation
   - Sync endpoint functionality
   - Health monitoring and metrics
   - Error handling and edge cases

2. **Integration Scripts** (`tests/scripts/`) - End-to-end testing scripts:
   - Complete sync workflows
   - Database operation validation
   - New endpoint verification
   - Error recovery scenarios

3. **External API Tests** (`tests/python/`) - Python scripts for Sienge API testing:
   - Endpoint availability and response validation
   - Authentication flow testing
   - Rate limiting verification

4. **Test Data** (`tests/data/`) - Centralized test datasets:
   - Mock API responses
   - Sample database records
   - Test configuration files

### Key Testing Focus Areas

1. API integration reliability (mocked Sienge responses)
2. Data transformation accuracy (endpoint mappings)
3. Database operation integrity (Prisma transactions)
4. Rate limiting behavior under load

Run manual tests using the `/api/sienge/proxy` endpoint to verify API connectivity before full sync operations.

Always use the variables from [text](.env) to acess the postgres db in production

# ===========================================

# Banco de dados de Produção

# ===========================================

POSTGRES_DB_PROD
POSTGRES_USER_PROD
POSTGRES_PASSWORD_PROD
POSTGRES_HOST_PROD
POSTGRES_PORT_PROD

Não simplifique estruturas essenciais para o nosso banco de dados, somente para que os comandos funcionem, se você teve que simplificar é porque algo deu errado. Pare e investigue porque.
