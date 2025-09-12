# Sienge Data Sync Application

Uma aplicação containerizada (Docker-Compose) para automatizar a extração de dados da plataforma Sienge e torná-los acessíveis localmente através de um banco PostgreSQL.

## 🎯 Visão Geral

Este projeto visa desenvolver uma solução que permite:

- **Configuração simples** de credenciais da API Sienge através de interface web
- **Sincronização automática** diária dos dados principais do Sienge
- **Armazenamento estruturado** em PostgreSQL para consultas eficientes
- **Acesso externo** para ferramentas de BI e análise (Power BI, Tableau, etc.)
- **Monitoramento** do status das sincronizações

## 🏗️ Arquitetura

### Componentes Principais

- **Frontend**: Next.js 13+ com App Router e React
- **Backend**: API Routes integradas ao Next.js
- **Banco de Dados**: PostgreSQL 15+ com Prisma ORM
- **Administração DB**: DbVisualizer para gerenciamento visual
- **Containerização**: Docker-Compose para orquestração
- **Scheduler**: node-cron para sincronização automática

### Entidades Sincronizadas

- **Clientes** - Lista de clientes da empresa
- **Empresas** - Dados da empresa/filiais
- **Fornecedores** - Lista de fornecedores
- **Projetos** - Empreendimentos e obras
- **Centros de Custo** - Estrutura organizacional
- **Contas Contábeis** - Plano de contas

## 🚀 Instalação e Configuração

### Pré-requisitos

- Docker e Docker-Compose instalados
- Porta 3000 disponível (frontend)
- Porta 5432 disponível (PostgreSQL)
- DbVisualizer instalado (opcional - para administração visual do banco)
- Credenciais de API do Sienge
- Conexão de internet estável

### Configuração Inicial

1. **Clone o repositório**

   ```bash
   git clone <repository-url>
   cd sienge
   ```

2. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

3. **Inicie os serviços**

   ```bash
   docker-compose up -d
   ```

4. **Acesse a aplicação**
   - Frontend: http://localhost:3000
   - PostgreSQL: localhost:5432
   - pgAdmin: http://localhost:8080

### Configuração da API Sienge

1. Acesse http://localhost:3000
2. Preencha o formulário com:
   - **Subdomínio** do seu Sienge (ex: minhaempresa)
   - **Usuário de API** (credenciais específicas de API)
   - **Senha de API** (não são as credenciais de login padrão)
3. O sistema validará as credenciais automaticamente

## 📊 Uso dos Dados

### Acesso via pgAdmin (Recomendado)

Para visualização e gerenciamento dos dados, use o pgAdmin:

1. **Acesse**: http://localhost:8080
2. **Login**: Use as credenciais configuradas no `.env`
3. **Conecte ao banco**: Configure a conexão com PostgreSQL
4. **Explore os dados**: Visualize tabelas, execute queries, monitore performance

**Scripts de acesso rápido:**

```bash
# Acesso via script principal
./scripts/sienge.sh pgadmin-dev   # Desenvolvimento
./scripts/sienge.sh pgadmin-prod  # Produção

# Ou diretamente
./scripts/pgadmin.sh dev
./scripts/pgadmin.sh prod
```

### Acesso Direto ao PostgreSQL

Após a configuração inicial, os dados estarão disponíveis no PostgreSQL:

- **Host**: localhost
- **Porta**: 5432
- **Database**: sienge_data
- **Usuário**: sienge_app
- **Senha**: (conforme configurado no .env)

### Exemplos de Consultas

```sql
-- Listar todos os clientes
SELECT * FROM customers ORDER BY name;

-- Contar registros por entidade
SELECT
  'customers' as entity, COUNT(*) as total FROM customers
UNION ALL
SELECT
  'companies' as entity, COUNT(*) as total FROM companies;

-- Verificar última sincronização
SELECT entity, sync_started_at, records_processed, status
FROM sync_logs
ORDER BY sync_started_at DESC;
```

## 🔄 Sincronização

### Automática

- **Frequência**: Diária às 2:00 AM
- **Configuração**: Via variável `SYNC_SCHEDULE` no .env
- **Logs**: Disponíveis no dashboard e tabela `sync_logs`

### Manual

- Acesse o dashboard em http://localhost:3000
- Clique em "Sincronizar Agora"
- Monitore o progresso em tempo real

## 📈 Monitoramento

### Dashboard

- Status da última sincronização
- Contadores de registros por entidade
- Logs de erro e alertas
- Conectividade com API Sienge

### Logs

- Histórico completo de sincronizações
- Detalhes de erros e falhas
- Métricas de performance
- Uso de quota da API

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
sienge/
├── app/                 # Aplicação Next.js
├── prisma/             # Schema e migrações do banco
├── docker-compose.yml  # Orquestração dos serviços
├── .env.example        # Template de variáveis
└── README.md          # Este arquivo
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar migrações
npx prisma migrate dev

# Reset do banco de dados
npx prisma migrate reset
```

## 🔒 Segurança

- **Credenciais**: Armazenadas com hash bcrypt
- **Comunicação**: HTTPS obrigatório para API Sienge
- **Banco**: SSL habilitado para conexões externas
- **Containers**: Execução como usuário não-root
- **Logs**: Sem exposição de dados sensíveis

## 📋 Limitações da API Sienge

- **Rate Limit**: 200 requisições por minuto
- **Quota Diária**: 100 chamadas (plano gratuito)
- **Paginação**: Máximo 200 registros por requisição
- **Autenticação**: Basic Auth obrigatória

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Erro de conexão com API Sienge**
   - Verifique se as credenciais estão corretas
   - Confirme se o subdomínio está correto
   - Teste a conectividade de rede

2. **Falha na sincronização**
   - Verifique os logs no dashboard
   - Confirme se a quota da API não foi excedida
   - Teste a conectividade com o banco

3. **Dados não aparecem**
   - Aguarde a próxima sincronização automática
   - Execute uma sincronização manual
   - Verifique os logs de erro

### Logs e Debug

```bash
# Ver logs dos containers
docker-compose logs -f

# Ver logs específicos do app
docker-compose logs -f app

# Ver logs do banco
docker-compose logs -f db
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:

- Abra uma issue no GitHub
- Consulte a documentação da API Sienge
- Verifique os logs de erro no dashboard

---

**Desenvolvido com ❤️ para facilitar a integração com dados do Sienge**
