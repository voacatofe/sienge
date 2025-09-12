# Configuração do Adminer no EasyPanel

## 🚀 **Visão Geral**

O **Adminer** é uma interface web simples e eficiente para administração de bancos de dados PostgreSQL. É perfeito para monitorar a sincronização de dados do Sienge em produção no EasyPanel.

## 📋 **Vantagens do Adminer**

- ✅ **Interface Web**: Acesso direto via navegador
- ✅ **Leve**: Apenas 256MB de RAM
- ✅ **Rápido**: Inicialização em segundos
- ✅ **Completo**: Suporte total ao PostgreSQL
- ✅ **Seguro**: Integração nativa com Docker

## 🔧 **Configuração no EasyPanel**

### 1. **Deploy da Aplicação**

1. Faça upload do `docker-compose.yml` atualizado para o EasyPanel
2. O Adminer será iniciado automaticamente junto com os outros serviços
3. Porta configurada: **8080**

### 2. **Acesso ao Adminer**

**URL de Acesso:**

```
http://[seu-dominio]:8080
```

**Exemplo:**

```
http://sienge.easypanel.host:8080
```

### 3. **Dados de Conexão**

| Campo             | Valor                              |
| ----------------- | ---------------------------------- |
| **Sistema**       | PostgreSQL                         |
| **Servidor**      | `db`                               |
| **Usuário**       | `sienge_app`                       |
| **Senha**         | `kPnrGuFeJeuVprXzhhO2oLVE14f509KV` |
| **Base de dados** | `sienge_data`                      |

## 📊 **Monitoramento da Sincronização**

### **Tabela `sync_logs`**

Esta tabela contém o histórico completo de todas as sincronizações:

```sql
-- Ver últimas sincronizações
SELECT * FROM sync_logs
ORDER BY sync_started_at DESC
LIMIT 10;
```

**Campos importantes:**

- `status`: `running`, `completed`, `failed`
- `records_processed`: Total de registros processados
- `records_inserted`: Registros inseridos
- `records_updated`: Registros atualizados
- `records_errors`: Registros com erro
- `sync_started_at`: Início da sincronização
- `sync_completed_at`: Fim da sincronização

### **Tabelas de Dados**

- **`clientes`**: Dados dos clientes do Sienge
- **`empresas`**: Dados das empresas
- **`documentos`**: Documentos do Sienge

## 🔍 **Queries Úteis**

### **Contar Registros por Tabela**

```sql
SELECT 'clientes' as tabela, COUNT(*) as total FROM clientes
UNION ALL
SELECT 'empresas', COUNT(*) FROM empresas
UNION ALL
SELECT 'documentos', COUNT(*) FROM documentos;
```

### **Ver Sincronização Atual**

```sql
SELECT * FROM sync_logs
WHERE status = 'running'
ORDER BY sync_started_at DESC;
```

### **Estatísticas de Sincronização**

```sql
SELECT
    DATE(sync_started_at) as data,
    COUNT(*) as total_syncs,
    SUM(records_processed) as total_records,
    AVG(records_processed) as media_records
FROM sync_logs
WHERE sync_completed_at IS NOT NULL
GROUP BY DATE(sync_started_at)
ORDER BY data DESC;
```

### **Ver Erros de Sincronização**

```sql
SELECT * FROM sync_logs
WHERE status = 'failed'
ORDER BY sync_started_at DESC;
```

## 🛠️ **Funcionalidades do Adminer**

### **Visualização de Dados**

- Navegar por tabelas
- Visualizar registros
- Filtros e buscas
- Paginação automática

### **Execução de SQL**

- Editor SQL integrado
- Histórico de queries
- Resultados formatados
- Exportação de resultados

### **Estrutura do Banco**

- Ver esquemas
- Estrutura das tabelas
- Índices e constraints
- Relacionamentos

### **Administração**

- Criar/editar tabelas
- Inserir/editar dados
- Backup e restore
- Otimização

## 🔐 **Segurança**

### **Configurações de Produção**

- Adminer roda em container isolado
- Acesso apenas via rede interna
- Sem exposição de credenciais
- Logs de acesso

### **Recomendações**

- Use HTTPS em produção
- Configure firewall se necessário
- Monitore logs de acesso
- Faça backup regular dos dados

## 📈 **Monitoramento em Produção**

### **Métricas Importantes**

1. **Tempo de Sincronização**: Duração das sincronizações
2. **Volume de Dados**: Registros processados por dia
3. **Taxa de Erro**: Percentual de falhas
4. **Performance**: Velocidade de processamento

### **Alertas Recomendados**

- Sincronização com mais de 1 hora
- Taxa de erro acima de 5%
- Falha em sincronizações consecutivas
- Volume anômalo de dados

## 🚀 **Próximos Passos**

1. **Deploy**: Faça upload do docker-compose.yml no EasyPanel
2. **Teste**: Acesse o Adminer e configure a conexão
3. **Explore**: Navegue pelas tabelas e dados
4. **Monitore**: Configure queries de monitoramento
5. **Otimize**: Use os insights para melhorar a sincronização

## 📞 **Suporte**

Para dúvidas ou problemas:

- Verifique os logs do container Adminer
- Confirme as credenciais de conexão
- Teste a conectividade com o PostgreSQL
- Consulte a documentação do EasyPanel

---

**Adminer está pronto para uso em produção no EasyPanel!** 🎉
