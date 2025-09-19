# 📋 PLANO DE CORREÇÃO - TABELA CLIENTES

## 🎯 Objetivo

Alinhar a estrutura da tabela `clientes` com a resposta real da API do Sienge, removendo campos desnecessários e otimizando o mapeamento de sincronização.

## 📊 Análise Comparativa

### Campos a REMOVER (não existem na API):

1. `idEmpresa` - Campo sem dados (0% preenchido)
2. `clientType` - Não existe na API
3. `internationalId` - Não existe na API
4. `issueDateIdentityCard` - Não existe na API
5. `issuingBody` - Não existe na API
6. `licenseIssueDate` - Não existe na API
7. `licenseIssuingBody` - Não existe na API
8. `licenseNumber` - Não existe na API
9. `mailingAddress` - Não existe na API
10. `cityRegistrationNumber` - Não existe na API
11. `cnaeNumber` - Não existe na API
12. `contactName` - Parte do array contacts
13. `creaNumber` - Não existe na API
14. `establishmentDate` - Não existe na API
15. `note` - Não existe na API
16. `site` - Não existe na API
17. `shareCapital` - Não existe na API
18. `stateRegistrationNumber` - Não existe na API
19. `technicalManager` - Não existe na API
20. `activityId` - Não existe na API
21. `activityDescription` - Não existe na API
22. `estadoCivilStr` - Duplica civilStatus
23. `profissaoStr` - Duplica profession
24. `fantasyName` - Deve ser tradingName
25. `marriageDate` - Parte do objeto maritalStatus
26. `matrimonialRegime` - Parte do objeto maritalStatus

### Campos a ADICIONAR:

1. `personType` - Tipo de pessoa (PHYSICAL/LEGAL)
2. `tradingName` - Nome fantasia (PJ)
3. `corporateName` - Razão social (PJ)
4. `internalCode` - Código interno
5. `cnpj` - Campo específico para CNPJ (separado de cpfCnpj)
6. `civilStatus` - Estado civil (substituindo estadoCivilStr)
7. `profession` - Profissão (substituindo profissaoStr)
8. `maritalStatus` - Objeto com dados do casamento

### Campos a RENOMEAR:

- `nomeCompleto` → `name`

## 🔧 Etapas de Implementação

### Fase 1: Backup e Análise

1. ✅ Criar backup da estrutura atual
2. ✅ Analisar dados existentes nos campos a remover
3. ✅ Documentar impactos

### Fase 2: Alteração da Estrutura

1. ✅ Script SQL para remover campos desnecessários (`20_limpar_tabela_clientes.sql`)
2. ✅ Script SQL para adicionar novos campos (`20_limpar_tabela_clientes.sql`)
3. ✅ Script SQL para renomear campos existentes

### Fase 3: Atualização do Código

1. ✅ Novo mapeamento TypeScript (`customers-mapping-updated.ts`)
2. ⏳ Atualizar endpoint-mappings.ts principal
3. ⏳ Ajustar triggers e functions relacionadas

### Fase 4: Migração de Dados

1. ⏳ Executar scripts SQL no banco de produção
2. ⏳ Validar integridade dos dados
3. ⏳ Re-sincronizar dados da API se necessário

### Fase 5: Correção da View Core

1. ⏳ Ajustar JOINs para usar dados corretos
2. ⏳ Para clientes: usar dados do próprio cliente como "empresa"
3. ⏳ Para financeiro: obter empresa via apropriações (95% cobertura)

## 📈 Benefícios Esperados

1. **Redução de Complexidade**: -26 campos desnecessários
2. **Melhor Performance**: Menos colunas = queries mais rápidas
3. **Sincronização Mais Confiável**: Mapeamento 1:1 com API
4. **Dados Mais Precisos**: Sem duplicações ou campos vazios
5. **View Core Funcional**: Dados de empresa corretamente preenchidos

## ⚠️ Riscos e Mitigações

### Risco 1: Perda de Dados

- **Mitigação**: Backup completo antes de alterações

### Risco 2: Quebra de Dependências

- **Mitigação**: Análise de foreign keys e triggers

### Risco 3: Impacto em Aplicação

- **Mitigação**: Testes em ambiente de desenvolvimento

## 📝 Scripts Criados

1. **`sql/20_limpar_tabela_clientes.sql`**
   - Remove campos desnecessários
   - Adiciona campos novos
   - Ajusta índices

2. **`sql/21_atualizar_mapeamento_sync_clientes.sql`**
   - Documentação do novo mapeamento
   - Validação de estrutura

3. **`app/api/sync/direct/customers-mapping-updated.ts`**
   - Novo mapeamento TypeScript
   - Lógica de transformação atualizada
   - PostProcess para campos derivados

## ✅ Checklist de Execução

- [ ] Fazer backup do banco de produção
- [ ] Executar script 20 (limpeza de tabela)
- [ ] Executar script 21 (validação)
- [ ] Atualizar endpoint-mappings.ts
- [ ] Deploy do código atualizado
- [ ] Re-sincronizar dados de clientes
- [ ] Reconstruir view rpt_sienge_core
- [ ] Validar dashboards e relatórios
- [ ] Monitorar por 24h

## 📊 Métricas de Sucesso

- Redução de campos NULL de 60% para < 10%
- Performance de queries melhorada em > 20%
- 100% dos clientes com dados básicos preenchidos
- View Core com 95% de cobertura de empresa
- Zero erros de sincronização pós-migração

## 🚀 Próximos Passos

1. **IMEDIATO**: Executar scripts de limpeza
2. **HOJE**: Atualizar código e fazer deploy
3. **AMANHÃ**: Re-sincronizar e validar dados
4. **SEMANA**: Monitorar e ajustar se necessário
