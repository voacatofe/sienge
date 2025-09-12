# 🗄️ Configuração do pgAdmin - Administração do Banco de Dados

## 📋 Visão Geral

O **pgAdmin** é uma ferramenta de administração web para PostgreSQL que foi integrada ao projeto Sienge para facilitar a visualização e gerenciamento dos dados durante o desenvolvimento e produção.

## 🚀 Características

- ✅ **Interface Web Intuitiva**: Acesso via navegador
- ✅ **Visualização de Dados**: Tabelas, índices, relacionamentos
- ✅ **Execução de SQL**: Query editor integrado
- ✅ **Monitoramento**: Estatísticas de performance
- ✅ **Backup/Restore**: Ferramentas de manutenção
- ✅ **Segurança**: Configurações diferenciadas para dev/prod

## 🔧 Configuração

### Ambientes Disponíveis

| Ambiente | Container | Porta Padrão | Arquivo Compose |
|----------|-----------|--------------|-----------------|
| **Desenvolvimento** | `sienge-pgadmin-dev` | 8080 | `docker-compose-dev.yml` |
| **Produção** | `sienge-pgadmin` | 8080 | `docker-compose.yml` |

### Variáveis de Ambiente

Adicione ao seu arquivo `.env`:

```bash
# ===========================================
# CONFIGURAÇÕES DO PGADMIN
# ===========================================

# Credenciais de acesso
PGADMIN_EMAIL=admin@sienge.local
PGADMIN_PASSWORD=admin123

# Porta do pgAdmin
PGADMIN_PORT_EXTERNAL=8080
```

### Configurações de Segurança

#### Desenvolvimento
- ✅ **Server Mode**: `False` (acesso direto)
- ✅ **Master Password**: `False` (sem senha mestra)
- ✅ **Recursos**: Limitados (512MB RAM)

#### Produção
- ✅ **Server Mode**: `True` (modo servidor)
- ✅ **Master Password**: `True` (senha mestra obrigatória)
- ✅ **Recursos**: Ampliados (1GB RAM)

## 🎯 Como Usar

### 1. Iniciar o pgAdmin

#### Desenvolvimento
```powershell
# PowerShell
.\scripts\init-dev.ps1

# Ou diretamente
docker-compose -f docker-compose-dev.yml up -d pgadmin
```

#### Produção
```powershell
# PowerShell
.\scripts\init-prod.ps1

# Ou diretamente
docker-compose -f docker-compose.yml up -d pgadmin
```

### 2. Acessar o pgAdmin

#### Script Automático (Recomendado)
```powershell
# PowerShell
.\scripts\access-pgadmin.ps1

# Linux/macOS
./scripts/access-pgadmin.sh
```

#### Acesso Manual
1. Abra o navegador
2. Acesse: `http://localhost:8080`
3. Use as credenciais configuradas

### 3. Conectar ao Banco de Dados

#### Configuração da Conexão
- **Host**: `db` (nome do serviço no Docker)
- **Port**: `5432`
- **Database**: `sienge_dev` (dev) ou `sienge_data` (prod)
- **Username**: `sienge_dev` (dev) ou `sienge_app` (prod)
- **Password**: Conforme configurado no `.env`

## 📊 Funcionalidades Principais

### 1. **Dashboard**
- Visão geral do servidor
- Estatísticas de conexões
- Status dos bancos de dados

### 2. **Query Tool**
- Editor SQL avançado
- Autocompletar
- Formatação automática
- Histórico de queries

### 3. **Database Browser**
- Navegação em árvore
- Visualização de tabelas
- Estrutura de dados
- Relacionamentos

### 4. **Data Viewer**
- Visualização de dados
- Edição inline
- Filtros e ordenação
- Exportação de dados

### 5. **Schema Designer**
- Diagramas ER
- Visualização de relacionamentos
- Documentação automática

## 🔒 Segurança

### Desenvolvimento
- Acesso local apenas
- Credenciais simples (não use em produção)
- Sem autenticação adicional

### Produção
- **IMPORTANTE**: Configure credenciais fortes
- Use HTTPS em produção
- Restrinja acesso por IP se necessário
- Configure firewall adequadamente

### Recomendações de Segurança
```bash
# Para produção, use senhas complexas:
PGADMIN_PASSWORD=Senh@Muit0F0rt3!2024
PGADMIN_EMAIL=admin@seudominio.com
```

## 🛠️ Comandos Úteis

### Verificar Status
```bash
# Ver containers rodando
docker ps | grep pgadmin

# Ver logs do pgAdmin
docker logs sienge-pgadmin-dev  # desenvolvimento
docker logs sienge-pgadmin      # produção
```

### Gerenciar Container
```bash
# Parar pgAdmin
docker-compose -f docker-compose-dev.yml stop pgadmin

# Reiniciar pgAdmin
docker-compose -f docker-compose-dev.yml restart pgadmin

# Remover container (dados preservados)
docker-compose -f docker-compose-dev.yml rm -f pgadmin
```

### Backup dos Dados do pgAdmin
```bash
# Backup das configurações
docker cp sienge-pgadmin-dev:/var/lib/pgadmin ./backup/pgadmin-config-dev
```

## 🐛 Troubleshooting

### Problema: pgAdmin não inicia
**Solução:**
```bash
# Verificar logs
docker logs sienge-pgadmin-dev

# Verificar se a porta está livre
netstat -an | findstr :8080

# Reiniciar com rebuild
docker-compose -f docker-compose-dev.yml up -d --force-recreate pgadmin
```

### Problema: Não consegue conectar ao banco
**Solução:**
1. Verificar se o PostgreSQL está rodando
2. Verificar credenciais no `.env`
3. Testar conexão direta: `docker exec -it sienge-db-dev psql -U sienge_dev -d sienge_dev`

### Problema: Erro de permissão
**Solução:**
```bash
# Verificar permissões do volume
docker exec -it sienge-pgadmin-dev ls -la /var/lib/pgadmin

# Recriar volume se necessário
docker-compose -f docker-compose-dev.yml down
docker volume rm sienge_pgadmin-dev-data
docker-compose -f docker-compose-dev.yml up -d pgadmin
```

## 📈 Monitoramento

### Métricas Importantes
- **Uso de Memória**: Monitorar limite de 512MB (dev) / 1GB (prod)
- **Conexões**: Verificar conexões simultâneas
- **Performance**: Tempo de resposta das queries

### Logs Relevantes
```bash
# Logs do pgAdmin
docker logs -f sienge-pgadmin-dev

# Logs do PostgreSQL
docker logs -f sienge-db-dev
```

## 🔄 Integração com o Projeto

### Fluxo de Desenvolvimento
1. **Desenvolvimento**: Use pgAdmin para verificar dados
2. **Debugging**: Execute queries para investigar problemas
3. **Validação**: Confirme estruturas de dados
4. **Documentação**: Use diagramas para documentar schema

### Integração com Scripts
O pgAdmin se integra perfeitamente com os scripts existentes:
- `init-dev.ps1` / `init-dev.sh`: Inicia pgAdmin junto com outros serviços
- `access-pgadmin.ps1` / `access-pgadmin.sh`: Acesso rápido ao pgAdmin
- Scripts de backup podem incluir configurações do pgAdmin

## 📚 Recursos Adicionais

### Links Úteis
- [Documentação Oficial do pgAdmin](https://www.pgadmin.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker pgAdmin Image](https://hub.docker.com/r/dpage/pgadmin4)

### Extensões Recomendadas
- **Query History**: Histórico de queries executadas
- **Data Masking**: Mascaramento de dados sensíveis
- **Backup Manager**: Gerenciamento de backups

---

## ✅ Checklist de Configuração

- [ ] pgAdmin configurado no `docker-compose-dev.yml`
- [ ] pgAdmin configurado no `docker-compose.yml`
- [ ] Variáveis de ambiente configuradas no `.env`
- [ ] Scripts de acesso criados e testados
- [ ] Conexão com banco de dados funcionando
- [ ] Credenciais de produção configuradas com segurança
- [ ] Documentação atualizada

---

**🎉 Agora você tem uma ferramenta completa para administrar seu banco de dados PostgreSQL!**

