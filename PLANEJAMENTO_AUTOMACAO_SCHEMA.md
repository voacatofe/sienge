# Planejamento de Implementação - Automação de Schema Prisma

## Visão Geral

Este documento apresenta o planejamento completo para implementar soluções de automação na criação e manutenção do schema Prisma no projeto Sienge, baseado na análise da estrutura atual e nas melhores práticas identificadas.

## Análise da Estrutura Atual

### Pontos Fortes Identificados

- **Schema Prisma bem estruturado** com 20+ modelos organizados
- **Mapeamento genérico existente** (`generic-data-mapper.ts`) com configurações flexíveis
- **Documentação OpenAPI completa** com 20 endpoints YAML disponíveis
- **Scripts de automação** já implementados (daily-sync.js, PowerShell scripts)
- **Ambiente Docker** configurado para desenvolvimento e produção

### Gaps Identificados

- Processo manual de criação de novos modelos Prisma
- Falta de validação automática entre schema e API
- Ausência de geração automática de DTOs/interfaces
- Sincronização manual entre documentação OpenAPI e código

## Estratégia de Implementação

### Fase 1: Preparação do Ambiente

**Objetivo**: Configurar ferramentas e dependências necessárias

**Ações**:

1. Instalar OpenAPI Generator CLI
2. Configurar scripts PowerShell de automação
3. Criar estrutura de diretórios para arquivos gerados
4. Implementar sistema de backup automático

### Fase 2: Scripts de Automação

**Objetivo**: Criar ferramentas para geração automática

**Componentes**:

- `generate-prisma-models.ps1` - Geração de modelos Prisma a partir de OpenAPI
- `sync-api-schema.ps1` - Sincronização entre API e schema
- `validate-schema.ps1` - Validação de consistência
- `generate-types.ps1` - Geração de tipos TypeScript

### Fase 3: Pipeline Automatizado

**Objetivo**: Integrar automação no workflow de desenvolvimento

**Funcionalidades**:

- Detecção automática de mudanças nos YAMLs
- Geração incremental de modelos
- Validação de breaking changes
- Atualização automática do generic-data-mapper

### Fase 4: Sistema de Validação

**Objetivo**: Garantir qualidade e consistência

**Validações**:

- Compatibilidade entre schema Prisma e API
- Verificação de tipos e relacionamentos
- Testes automáticos de sincronização
- Relatórios de divergências

## Estrutura de Arquivos Proposta

```
sienge/
├── automation/
│   ├── scripts/
│   │   ├── generate-prisma-models.ps1
│   │   ├── sync-api-schema.ps1
│   │   ├── validate-schema.ps1
│   │   └── generate-types.ps1
│   ├── templates/
│   │   ├── prisma-model.template
│   │   └── typescript-interface.template
│   ├── generated/
│   │   ├── models/
│   │   ├── types/
│   │   └── validators/
│   └── config/
│       ├── openapi-generator.json
│       └── field-mappings.json
├── prisma/
│   ├── schema.prisma (existente)
│   └── generated/ (novos modelos)
└── lib/
    ├── generic-data-mapper.ts (existente)
    └── generated-mappers/ (novos mapeadores)
```

## Scripts PowerShell Detalhados

### 1. generate-prisma-models.ps1

```powershell
# Função: Gerar modelos Prisma a partir de OpenAPI YAML
# Entrada: Arquivo YAML específico ou todos os YAMLs
# Saída: Modelos Prisma no diretório generated/
```

### 2. sync-api-schema.ps1

```powershell
# Função: Sincronizar schema existente com mudanças na API
# Entrada: Comparação entre schema atual e YAMLs
# Saída: Schema atualizado com novos campos/modelos
```

### 3. validate-schema.ps1

```powershell
# Função: Validar consistência entre schema e API
# Entrada: Schema Prisma e documentação OpenAPI
# Saída: Relatório de divergências e sugestões
```

### 4. generate-types.ps1

```powershell
# Função: Gerar tipos TypeScript e interfaces
# Entrada: Schema Prisma atualizado
# Saída: Arquivos .d.ts e interfaces para o frontend
```

## Dependências Necessárias

### NPM Packages

```json
{
  "@openapitools/openapi-generator-cli": "^2.7.0",
  "prisma-json-schema-generator": "^5.0.0",
  "swagger-to-prisma": "^1.0.0",
  "yaml": "^2.3.0",
  "ajv": "^8.12.0"
}
```

### PowerShell Modules

- `powershell-yaml` - Para parsing de arquivos YAML
- `Invoke-RestMethod` - Para validação de endpoints

## Integração com Componentes Existentes

### Schema Prisma (schema.prisma)

- Manter modelos existentes intactos
- Adicionar novos modelos em seção separada
- Implementar versionamento de schema

### Generic Data Mapper (generic-data-mapper.ts)

- Estender configurações existentes
- Adicionar mapeamentos automáticos gerados
- Manter compatibilidade com código atual

### Scripts de Sincronização

- Integrar com daily-sync.js existente
- Adicionar validações pré-sincronização
- Implementar rollback automático em caso de erro

## Endpoints Prioritários para Automação

1. **customers-v1.yaml** - Base de clientes (já mapeado)
2. **company-v1.yaml** - Dados da empresa
3. **accounts-receivable-v1.yaml** - Contas a receber
4. **sales-contracts-v1.yaml** - Contratos de venda
5. **enterprise-v1.yaml** - Dados empresariais

## Cronograma de Implementação

### Semana 1-2: Preparação

- Configuração do ambiente
- Instalação de dependências
- Criação da estrutura de diretórios

### Semana 3-4: Scripts Básicos

- Desenvolvimento dos scripts PowerShell
- Testes com endpoints prioritários
- Validação de geração de modelos

### Semana 5-6: Integração

- Integração com workflow existente
- Testes de sincronização automática
- Ajustes no generic-data-mapper

### Semana 7-8: Validação e Refinamento

- Sistema de validação completo
- Testes de regressão
- Documentação final

## Benefícios Esperados

### Produtividade

- **Redução de 80%** no tempo de criação de novos modelos
- **Eliminação de erros manuais** na tipagem de campos
- **Sincronização automática** entre API e banco de dados

### Qualidade

- **Validação automática** de consistência
- **Testes automatizados** de integridade
- **Documentação sempre atualizada**

### Manutenibilidade

- **Código gerado padronizado**
- **Versionamento automático** de schemas
- **Rollback seguro** em caso de problemas

## Considerações de Segurança

- Backup automático antes de modificações
- Validação de permissões de arquivo
- Logs detalhados de todas as operações
- Ambiente de teste isolado para validações

## Próximos Passos

1. **Aprovação do planejamento** pela equipe
2. **Configuração do ambiente** de desenvolvimento
3. **Implementação da Fase 1** (preparação)
4. **Testes piloto** com endpoint customers
5. **Rollout gradual** para demais endpoints

---

**Documento criado em**: $(Get-Date -Format "dd/MM/yyyy HH:mm")
**Versão**: 1.0
**Autor**: Assistente de Automação Sienge
