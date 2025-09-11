# 🔒 Documentação de Segurança - Campos Sensíveis e Índices

## 📋 Resumo das Implementações

Este documento descreve as implementações de segurança e otimização de performance realizadas no schema Prisma da aplicação Sienge Data Sync.

## 🛡️ Campos Sensíveis Identificados e Protegidos

### 1. **ApiCredentials**
- **Campo**: `apiPasswordHash`
- **Tipo**: String
- **Proteção**: Hash bcrypt/argon2 da senha da API
- **Comentário**: `// SENSITIVE: Hash bcrypt/argon2 da senha da API`

### 2. **Empresa**
- **Campo**: `cnpj`
- **Tipo**: String?
- **Proteção**: Criptografia AES-256
- **Comentário**: `// SENSITIVE: CNPJ da empresa - criptografado`

### 3. **Cliente**
- **Campo**: `cpfCnpj`
- **Tipo**: String
- **Proteção**: Criptografia AES-256
- **Comentário**: `// SENSITIVE: CPF/CNPJ do cliente - criptografado`

### 4. **Conjuge**
- **Campo**: `cpf`
- **Tipo**: String?
- **Proteção**: Criptografia AES-256
- **Comentário**: `// SENSITIVE: CPF do cônjuge - criptografado`

### 5. **Credor**
- **Campo**: `cpfCnpj`
- **Tipo**: String
- **Proteção**: Criptografia AES-256
- **Comentário**: `// SENSITIVE: CPF/CNPJ do credor - criptografado`

### 6. **CredorInfoBancaria**
- **Campo**: `cpfCnpjBeneficiario`
- **Tipo**: String?
- **Proteção**: Criptografia AES-256
- **Comentário**: `// SENSITIVE: CPF/CNPJ do beneficiário - criptografado`

## 📊 Índices Implementados para Performance

### **Total de Índices Criados**: 140 índices

### **Categorias de Índices**:

#### 1. **Índices de Busca por Nome**
- `clientes_nomeCompleto_idx`
- `credores_nomeCredor_idx`
- `empresas_nomeEmpresa_idx`
- `municipios_nome_idx`
- `profissoes_nomeProfissao_idx`
- `departamentos_nomeDepartamento_idx`
- `centros_custo_nomeCentroCusto_idx`

#### 2. **Índices de Status/Filtros**
- `clientes_ativo_idx`
- `credores_ativo_idx`
- `empresas_ativo_idx`
- `centros_custo_ativo_idx`
- `sync_logs_status_idx`

#### 3. **Índices de Data**
- `clientes_dataCadastro_idx`
- `sync_logs_syncStartedAt_idx`

#### 4. **Índices de Relacionamento**
- `clientes_idEmpresa_idx`
- `clientes_idTipoCliente_idx`
- `conjuges_idCliente_idx`
- `credor_info_bancaria_idCredor_idx`

#### 5. **Índices Compostos**
- `clientes_nomeCompleto_ativo_idx`
- `clientes_idEmpresa_ativo_idx`
- `credores_nomeCredor_ativo_idx`
- `empresas_nomeEmpresa_ativo_idx`
- `municipios_nome_uf_idx`
- `sync_logs_entityType_status_idx`

#### 6. **Índices de Códigos**
- `empresas_codigoEmpresa_idx`
- `departamentos_codigoDepartamento_idx`
- `centros_custo_codigoCentroCusto_idx`
- `profissoes_codigoProfissao_idx`
- `planos_financeiros_codigoPlano_idx`
- `municipios_codigoIBGE_idx`

## 🔧 Migration Aplicada

**Arquivo**: `prisma/migrations/20250911214921_add_security_indexes/migration.sql`

**Status**: ✅ Aplicada com sucesso

**Comandos Executados**:
```bash
npx prisma migrate dev --name add_security_indexes
```

## 🧪 Testes de Performance

### **Scripts de Teste Criados**:
1. **`scripts/test-indexes.sql`** - Consultas EXPLAIN ANALYZE
2. **`scripts/test-indexes.ps1`** - Script PowerShell para execução

### **Como Executar os Testes**:
```powershell
.\scripts\test-indexes.ps1
```

### **O que Verificar**:
- ✅ **Index Scan** vs **Seq Scan** nos resultados do EXPLAIN ANALYZE
- ✅ Tempos de execução otimizados
- ✅ Uso dos índices monitorado com `pg_stat_user_indexes`

## 📈 Benefícios Esperados

### **Segurança**:
- ✅ Campos sensíveis identificados e marcados
- ✅ Preparação para implementação de criptografia
- ✅ Documentação clara dos campos críticos

### **Performance**:
- ✅ Consultas por nome otimizadas (busca de clientes, credores, etc.)
- ✅ Filtros por status acelerados
- ✅ Consultas temporais melhoradas
- ✅ Relacionamentos otimizados
- ✅ Consultas compostas eficientes

## 🚀 Próximos Passos

### **Implementação de Criptografia**:
1. Implementar funções de criptografia AES-256 na aplicação
2. Criar middleware para criptografar/descriptografar campos sensíveis
3. Implementar validação de formato para CPF/CNPJ
4. Adicionar logs de auditoria para acesso a dados sensíveis

### **Monitoramento**:
1. Configurar alertas para consultas lentas
2. Monitorar uso dos índices com `pg_stat_user_indexes`
3. Implementar métricas de performance
4. Configurar backup automático dos dados criptografados

## 📚 Referências

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [AES-256 Encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
