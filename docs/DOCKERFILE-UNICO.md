# 🐳 Dockerfile Único - Desenvolvimento e Produção

## 🎯 **Por que um Dockerfile único?**

Você estava certo! Não precisamos de dois Dockerfiles separados. A nova abordagem usa **um Dockerfile único** que funciona para ambos os ambientes através de **build args** e **variáveis de ambiente**.

## ✅ **Vantagens da Nova Abordagem**

1. **🔧 Manutenção Simplificada:** Um único arquivo para manter
2. **📦 DRY Principle:** Não repetimos código desnecessariamente
3. **🎛️ Flexibilidade:** Controla comportamento via build args
4. **🚀 Eficiência:** Build mais rápido e otimizado
5. **📚 Simplicidade:** Estrutura mais limpa e fácil de entender

## 🔧 **Como Funciona**

### **Build Args**
```dockerfile
ARG NODE_ENV=production
ARG BUILD_TARGET=production
```

### **Instalação Condicional de Dependências**
```dockerfile
RUN if [ "$BUILD_TARGET" = "development" ]; then \
        npm ci && npm cache clean --force; \
    else \
        npm ci --only=production && npm cache clean --force; \
    fi
```

### **Comando Condicional**
```dockerfile
CMD if [ "$NODE_ENV" = "development" ]; then \
        npm run dev; \
    else \
        npm run build && npm start; \
    fi
```

## 🛠️ **Configuração nos Docker Compose**

### **Desenvolvimento (`docker-compose-dev.yml`)**
```yaml
app:
  build:
    context: .
    dockerfile: Dockerfile
    args:
      NODE_ENV: development
      BUILD_TARGET: development
```

### **Produção (`docker-compose.yml`)**
```yaml
app:
  build:
    context: .
    dockerfile: Dockerfile
    args:
      NODE_ENV: production
      BUILD_TARGET: production
```

## 📋 **Comportamentos por Ambiente**

### **Desenvolvimento**
- ✅ Instala **todas as dependências** (incluindo devDependencies)
- ✅ Executa `npm run dev` (hot reload)
- ✅ Logs detalhados
- ✅ Recursos limitados
- ✅ Volumes montados para código fonte

### **Produção**
- ✅ Instala **apenas dependências de produção**
- ✅ Executa `npm run build && npm start`
- ✅ Build otimizado
- ✅ Recursos completos
- ✅ Código compilado dentro da imagem

## 🔄 **Migração Realizada**

### **Arquivos Removidos:**
- ❌ `Dockerfile.dev` (desnecessário)

### **Arquivos Renomeados:**
- 📁 `Dockerfile` → `Dockerfile.original` (backup)
- 📁 `Dockerfile.unified` → `Dockerfile` (novo)

### **Arquivos Atualizados:**
- 🔧 `docker-compose-dev.yml` (usa build args)
- 🔧 `docker-compose.yml` (usa build args)
- 📚 `README-AMBIENTES.md` (documentação atualizada)

## 🚀 **Como Usar**

### **Desenvolvimento**
```bash
# Usa build args para desenvolvimento
docker-compose -f docker-compose-dev.yml up --build
```

### **Produção**
```bash
# Usa build args para produção
docker-compose up --build
```

### **Build Manual**
```bash
# Desenvolvimento
docker build --build-arg NODE_ENV=development --build-arg BUILD_TARGET=development -t sienge-dev .

# Produção
docker build --build-arg NODE_ENV=production --build-arg BUILD_TARGET=production -t sienge-prod .
```

## 🎯 **Resultado**

Agora temos:
- ✅ **Um Dockerfile único** que funciona para ambos os ambientes
- ✅ **Configuração via build args** para controlar comportamento
- ✅ **Estrutura mais limpa** e fácil de manter
- ✅ **Compatibilidade total** com EasyPanel e Docker Desktop
- ✅ **Princípio DRY** aplicado corretamente

## 💡 **Benefícios para EasyPanel**

O EasyPanel vai funcionar perfeitamente porque:
- ✅ Usa o `docker-compose.yml` padrão (produção)
- ✅ Build args são passados automaticamente
- ✅ Não há conflitos entre ambientes
- ✅ Estrutura mais simples para deploy

Obrigado por questionar a necessidade de dois Dockerfiles! A nova abordagem é muito mais elegante e maintível. 🎉
