# Como Adicionar Novos Endpoints do Sienge

Este guia explica como adicionar facilmente novos endpoints do Sienge ao sistema de sincronização automatizado.

## Sistema Automatizado

O sistema foi projetado para ser completamente automatizado. Você só precisa:

1. **Definir o mapeamento** no arquivo `endpoint-mappings.ts`
2. **O endpoint já funcionará automaticamente**

## Passo a Passo

### 1. Abrir o arquivo de mapeamentos

Abra o arquivo `endpoint-mappings.ts` na raiz do projeto.

### 2. Adicionar o novo endpoint

Use a função `addEndpointMapping()` para adicionar um novo endpoint:

```typescript
// Exemplo: Adicionando endpoint de "products"
addEndpointMapping('products', {
  model: 'produto', // Nome do modelo no Prisma
  primaryKey: 'idProduto', // Chave primária da tabela
  fieldMapping: {
    // Mapeamento: campo_da_api_sienge -> campo_do_banco
    id: 'idProduto',
    name: 'nomeProduto',
    description: 'descricao',
    price: { 
      field: 'preco', 
      transform: (val: any) => val ? parseFloat(val) : 0 
    },
    active: { 
      field: 'ativo', 
      transform: (val: any) => val !== false 
    },
    createdAt: { 
      field: 'dataCadastro', 
      transform: (val: any) => val ? new Date(val) : new Date() 
    }
  }
});
```

### 3. Tipos de Mapeamento

#### Mapeamento Simples
```typescript
name: 'nomeProduto' // Campo direto
```

#### Mapeamento com Transformação
```typescript
price: { 
  field: 'preco', 
  transform: (val: any) => val ? parseFloat(val) : 0 
}
```

#### Transformações Comuns

```typescript
// Para datas
createdAt: { 
  field: 'dataCadastro', 
  transform: (val: any) => val ? new Date(val) : new Date() 
}

// Para números
price: { 
  field: 'preco', 
  transform: (val: any) => val ? parseFloat(val) : 0 
}

// Para booleanos
active: { 
  field: 'ativo', 
  transform: (val: any) => val !== false 
}

// Para JSON/objetos
metadata: { 
  field: 'metadados', 
  transform: (val: any) => val || null 
}
```

## Exemplo Completo

Vamos adicionar um endpoint de "fornecedores":

```typescript
addEndpointMapping('suppliers', {
  model: 'fornecedor',
  primaryKey: 'idFornecedor',
  fieldMapping: {
    id: 'idFornecedor',
    name: 'nomeFornecedor',
    cnpj: 'cnpj',
    email: 'email',
    phone: 'telefone',
    address: 'endereco',
    active: { 
      field: 'ativo', 
      transform: (val: any) => val !== false 
    },
    registrationDate: { 
      field: 'dataRegistro', 
      transform: (val: any) => val ? new Date(val) : new Date() 
    },
    creditLimit: { 
      field: 'limiteCredito', 
      transform: (val: any) => val ? parseFloat(val) : 0 
    }
  }
});
```

## Testando o Novo Endpoint

Após adicionar o mapeamento, o endpoint já estará disponível automaticamente:

```bash
# Testar o novo endpoint
curl -X POST http://localhost:3000/api/sync/direct \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "suppliers",
    "data": [
      {
        "id": 1,
        "name": "Fornecedor Teste",
        "cnpj": "12345678000199",
        "email": "teste@fornecedor.com"
      }
    ]
  }'
```

## Verificando Endpoints Disponíveis

Para ver todos os endpoints configurados:

```typescript
import { getAllEndpointMappings } from './endpoint-mappings';

console.log(getAllEndpointMappings());
```

## Vantagens do Sistema

✅ **Automatizado**: Adicione apenas o mapeamento, o resto funciona automaticamente
✅ **Flexível**: Suporte a transformações de dados complexas
✅ **Reutilizável**: Mesmo código para todos os endpoints
✅ **Manutenível**: Configuração centralizada em um arquivo
✅ **Escalável**: Adicione quantos endpoints quiser
✅ **Type-safe**: Interfaces TypeScript para validação

## Estrutura dos Arquivos

```
├── app/api/sync/direct/
│   └── route.ts              # Lógica principal (não precisa modificar)
├── endpoint-mappings.ts      # Configurações dos endpoints (modificar aqui)
└── COMO_ADICIONAR_ENDPOINTS.md # Este guia
```

## Dicas Importantes

1. **Sempre teste** o novo endpoint após adicionar
2. **Use transformações** para converter tipos de dados corretamente
3. **Mantenha consistência** nos nomes dos campos
4. **Documente** mapeamentos complexos com comentários
5. **Verifique o schema Prisma** antes de mapear campos

Com este sistema, adicionar novos endpoints do Sienge é questão de minutos! 🚀