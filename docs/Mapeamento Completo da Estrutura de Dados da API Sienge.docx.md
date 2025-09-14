# Mapeamento Completo da Estrutura de Dados da API Sienge

## 🚀 Status de Implementação (Atualizado)

**Última Atualização:** $(date)

### ✅ **Endpoints Implementados e Corrigidos**

| Endpoint Sienge        | Status              | API Local                                     | Arquivo                                 |
| ---------------------- | ------------------- | --------------------------------------------- | --------------------------------------- |
| `/customers`           | ✅ **IMPLEMENTADO** | `/api/data/customers`                         | `app/api/data/customers/route.ts`       |
| `/companies`           | ✅ **IMPLEMENTADO** | `/api/data/companies`                         | `app/api/data/companies/route.ts`       |
| `/accounts-receivable` | ✅ **IMPLEMENTADO** | `/api/data/accounts-receivable`               | `app/api/data/receivables/route.ts`     |
| `/accounts-payable`    | ✅ **IMPLEMENTADO** | `/api/data/accounts-payable`                  | `app/api/data/payables/route.ts`        |
| `/sales-contracts`     | ✅ **IMPLEMENTADO** | `/api/data/sales-contracts`                   | `app/api/data/sales-contracts/route.ts` |
| `/commissions`         | ✅ **IMPLEMENTADO** | `/api/data/financial?type=commissions`        | `app/api/data/financial/route.ts`       |
| `/payment-categories`  | ✅ **IMPLEMENTADO** | `/api/data/financial?type=payment-categories` | `app/api/data/financial/route.ts`       |
| `/indexers`            | ✅ **IMPLEMENTADO** | `/api/data/financial?type=indexers`           | `app/api/data/financial/route.ts`       |
| `/carriers`            | ✅ **IMPLEMENTADO** | `/api/data/financial?type=carriers`           | `app/api/data/financial/route.ts`       |
| `/cost-centers`        | ✅ **IMPLEMENTADO** | `/api/data/financial?type=cost-centers`       | `app/api/data/financial/route.ts`       |
| `/departments`         | ✅ **IMPLEMENTADO** | `/api/data/financial?type=departments`        | `app/api/data/financial/route.ts`       |

### 🔧 **Correções Implementadas**

- ✅ **Endpoints corrigidos** conforme documentação oficial Sienge
- ✅ **Configurações centralizadas** em `lib/config/sienge-api.ts`
- ✅ **Meta endpoints atualizados** em todas as APIs
- ✅ **Case statements corrigidos** no endpoint unificado `/financial`
- ✅ **Mapeamentos ENTITY_TO_ENDPOINT** atualizados

### 📋 **Arquivos Modificados**

- ✅ `lib/config/sienge-api.ts` - Configurações centralizadas
- ✅ `app/api/data/receivables/route.ts` - Meta endpoint corrigido
- ✅ `app/api/data/payables/route.ts` - Meta endpoint corrigido
- ✅ `app/api/data/financial/route.ts` - Case statements e meta fields corrigidos

---

## Visão Geral da API Sienge

A API do Sienge Plataforma é dividida em **APIs REST** (transacionais) e **APIs Bulk-Data** (consultas em massa). As APIs REST fornecem operações CRUD e retornos paginados para recursos como _Clientes, Credores, Títulos a Receber_ etc., enquanto as Bulk-Data permitem extrair grandes volumes de dados de uma só vez[\[1\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200200-api-rest-credores#:~:text=API%2C%C2%A0Application%C2%A0Programming%C2%A0Interface%20ou%20Interface%20de%20Programa%C3%A7%C3%A3o,a%C3%A7%C3%B5es%20que%20podem%20ser%20feitas)[\[2\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200931-como-entender-a-documentac%C3%A3o-das-apis-#:~:text=Plataforma%20ajuda,recursos%20para%20transacionar%20um). Cada endpoint normalmente retorna os dados em um formato estruturado com duas partes principais: uma lista de registros (campo _records_ ou similar) e metadados de paginação (como _totalRecords_, _offset_, _limit_ dentro de _resultSetMetadata_)[\[3\]](https://forum.xperiun.com/topic/359-conex%C3%A3o-com-apis-e-recursividade-sienge-api/#:~:text=Error%20fetching%20https%3A%2F%2Fforum.xperiun.com%2Ftopic%2F359). Dessa forma, ao consumir um endpoint de listagem, o desenvolvedor recebe os registros solicitados e informações sobre a quantidade total de dados disponíveis.

**Autenticação:** A autenticação às APIs é feita via HTTP Basic Auth (usuário e senha de API) ou outro mecanismo fornecido pelo Sienge. Como mencionado, você gerenciará a autenticação no seu aplicativo, então não detalharemos esse processo aqui. Basta notar que cada chamada requer credenciais válidas e que é possível configurar usuários de API e liberar permissões de endpoints específicos no painel do Sienge[\[4\]](https://ajuda.sienge.com.br/support/solutions/articles/153000245608--construpoint-integrac%C3%A3o-com-sienge-plataforma-parametrizac%C3%A3o#:~:text=7%20%E2%80%93%20Seguiremos%20com%20a,todos%20os%20listados%20a%20seguir).

**Organização por recursos:** A API é organizada por recursos correspondentes às entidades do sistema (p. ex. _Empresas_, _Clientes_, _Insumos_, _Títulos a Pagar_ etc). Cobriremos todos os recursos/endpoints relevantes, mapeando-os para tabelas, campos e relacionamentos em um banco Postgres via Prisma. Cada seção abaixo trata de um conjunto de endpoints relacionados e define as tabelas necessárias, com campos (colunas) e relações (chaves estrangeiras) adequados. Os nomes dos modelos e campos são apresentados em **Português** para facilitar para o time (conforme solicitado, sem seguir necessariamente convenções de nomenclatura específicas).

Antes de mergulhar nos detalhes por recurso, vale destacar que muitos endpoints de consulta (_GET_) fornecem filtros via query params e retornos paginados. Para armazenamento no banco, entretanto, consideramos tabelas completas contendo todos os registros daquele tipo. Endpoints de criação/atualização (_POST/PUT/PATCH_) correspondem a inserir ou alterar registros nessas tabelas.

## Cadastros Gerais e Tabelas Básicas

Esta seção aborda entidades básicas necessárias em múltiplos contextos do sistema, geralmente usadas para preencher listas de seleção ou como referência em outras tabelas.

### **Empresas (Companies)**

Recurso: **Empresas** – Representa as empresas cadastradas (a empresa principal usuária do sistema e eventualmente filiais ou empresas relacionadas, dependendo da configuração). Os endpoints permitem listar empresas e buscar por ID[\[5\]](https://api.sienge.com.br/docs/html-files/company-v1.html#:~:text=,ResultSetMetadata). A estrutura (modelo **Empresa**) inclui:  
\- **idEmpresa** (Integer, chave primária): Identificador único da empresa no Sienge[\[5\]](https://api.sienge.com.br/docs/html-files/company-v1.html#:~:text=,ResultSetMetadata).  
\- **nomeEmpresa** (String): Nome ou razão social da empresa.  
\- **cnpj** (String): CNPJ da empresa (se aplicável).  
\- **nomeFantasia** (String): Nome fantasia (apelido comercial).  
\- **codigoEmpresa** (String): Código interno ou número da empresa (se houver, ex: código usado em relatórios).  
\- **ativo** (Boolean): Indicador se a empresa está ativa.

_Relações:_ Uma Empresa pode relacionar-se com diversos outros registros. Por exemplo, Empresa é referenciada em **Empreendimentos** (Obras) que pertencem a ela, em **Títulos Financeiros** indicando a empresa devedora/credora, etc. No contexto de multi-empresa, muitos registros carregam o _companyId_. Como o subdomínio da URL da API identifica a empresa, possivelmente sua aplicação terá apenas uma empresa ativa, mas modelamos ainda assim a tabela Empresa caso seja necessário armazenar múltiplas.

### **Departamentos (Departments)**

Recurso: **Departamentos** – Departamentos internos da empresa. A API permite listar departamentos cadastrados. Modelo **Departamento** com campos:  
\- **idDepartamento** (Integer, PK): Identificador do departamento.  
\- **nomeDepartamento** (String): Nome do departamento.  
\- **codigoDepartamento** (String): Código ou sigla do departamento (se houver).

_Relações:_ Pode ser referenciado em alocações de custo (ex: distribuição de despesas por departamento). Na API de títulos a pagar há possibilidade de apropriar valores por departamento[\[6\]](https://docs.fluidapi.io/sienge#:~:text=,teste%20do%20fluxo%20com%20o), então um **Título** pode ter 0 ou mais departamentos associados (via tabela de relação, ver Títulos a Pagar).

### **Centro de Custos (Cost Centers)**

Recurso: **Centro de Custos** – Centros de custo para classificação de despesas/receitas. Endpoint GET /cost-centers lista os centros de custo cadastrados[\[7\]](https://suporteprevision.freshdesk.com/support/solutions/articles/153000240992-erro-de-permission-denied-#:~:text=,centers). Modelo **CentroCusto**:  
\- **idCentroCusto** (Integer, PK): ID do centro de custo.  
\- **nomeCentroCusto** (String): Nome do centro de custo.  
\- **codigoCentroCusto** (String): Código do centro de custo (geralmente uma sequência hierárquica).  
\- **ativo** (Boolean): Se o centro de custo está ativo para uso.

_Relações:_ Centros de custo aparecem na apropriação de títulos financeiros. Por exemplo, no lançamento de um título a pagar, pode-se distribuir o valor por centros de custo[\[6\]](https://docs.fluidapi.io/sienge#:~:text=,teste%20do%20fluxo%20com%20o). Assim, teremos uma tabela de ligação entre **Título** (financeiro) e **CentroCusto** para registrar as porcentagens/valores alocados (ver seção de Títulos a Pagar).

### **Indexadores (Indexes)**

Recurso: **Indexadores** – Índices econômicos usados para atualização monetária (ex: IGPM, INCC). A API de indexadores fornece lista e detalhes de indexadores[\[8\]](https://api.sienge.com.br/docs/html-files/bulk-data-income-v1.html#:~:text=Parcelas%20do%20Contas%20a%20Receber,bills)[\[9\]](https://www.youtube.com/watch?v=1Iwju7XyC88#:~:text=Trabalhando%20com%20API%27s%20no%20Power,um%20conjunto%20de%20padr%C3%B5es). Modelo **Indexador**:  
\- **idIndexador** (Integer, PK): Identificador do indexador.  
\- **nomeIndexador** (String): Nome do índice (por ex. _IGPM_).  
\- **descricao** (String): Descrição detalhada ou fórmula do índice (se fornecido).  
\- **periodicidade** (String): Periodicidade de atualização (mensal, anual, etc).  
\- **valorAtual** (Decimal): Último valor/taxa conhecido (opcional).

_Relações:_ Indexadores são referenciados em contratos e títulos que sofrem correção monetária. Ex: um contrato de venda pode ter um indexador para corrigir parcelas a vencer, um título a pagar pode referenciar um indexador específico (no payload de título a pagar há campo _indexid_ indicando o indexador aplicado[\[10\]](https://docs.fluidapi.io/sienge#:~:text=tostring%20,htmldate)). Portanto, **TítuloFinanceiro** terá campo estrangeiro **idIndexador**.

### **Parâmetros (Parameters)**

Recurso: **Parâmetros** – Endpoint para recuperar parâmetros gerais do sistema. O modelo **Parametro** pode ser abstraído como chave-valor de configuração. Campos possíveis:  
\- **chave** (String, PK composta ou própria): Nome do parâmetro (ex: FormaEmailRemetente).  
\- **valor** (String): Valor configurado.  
\- **descricao** (String): Descrição do parâmetro.

A API de Parâmetros provavelmente retorna um conjunto de configurações do sistema; armazenar isso localmente pode não ser essencial, mas se necessário, pode-se mapear em uma tabela simples. _Obs:_ Este recurso não exige relações complexas.

### **Estados Civis (Marital Status)**

Recurso: **Estados Civis** – Lista de estados civis disponíveis. Modelo **EstadoCivil**:  
\- **idEstadoCivil** (Integer, PK): ID do estado civil.  
\- **descricao** (String): Descrição (ex: Solteiro, Casado, etc).

Usado principalmente nos cadastros de cliente (Pessoa Física). **Cliente** terá um campo estrangeiro referenciando EstadoCivil.

### **Profissões (Professions)**

Recurso: **Profissões** – Profissões ocupacionais cadastradas. A API permite listar profissões, criar e buscar por ID[\[11\]](https://api.sienge.com.br/docs/html-files/professions-v1.html#:~:text=Profiss%C3%B5es,id%7D.%20Busca%20uma%20profiss%C3%A3o). Modelo **Profissao**:  
\- **idProfissao** (Integer, PK): Identificador da profissão.  
\- **nomeProfissao** (String): Nome/título da profissão (ex: Engenheiro, Arquiteto).  
\- **codigoProfissao** (String): Código ou sigla (se houver).

Clientes (Pessoa Física) podem referenciar profissões (ex: profissão do cliente ou cônjuge).

### **Tipos de Clientes (Customer Types)**

Recurso: **Tipos de Clientes** – Classificações de cliente. Poderia indicar, por exemplo, se é _Pessoa Física_ ou _Pessoa Jurídica_, ou categorias comerciais (Investidor, Comprador, etc). A documentação indica uma API de tipos de clientes[\[12\]](https://api.sienge.com.br/docs/html-files/customer-types-v1.html#:~:text=Tipos%20de%20Clientes%201.0.0%20,v1). Modelo **TipoCliente**:  
\- **idTipoCliente** (Integer, PK)  
\- **descricao** (String): Descrição do tipo (ex: Pessoa Física, Pessoa Jurídica).

Provavelmente este recurso distingue PF/PJ, embora a própria estrutura de **Cliente** também trate disso. Em todo caso, mapeamos para referência. **Cliente** terá **idTipoCliente**.

### **Tipos de Imóveis (Property Types)**

Recurso: **Tipo de Imóveis** – Tipos de unidade imobiliária. Endpoint GET /property-types fornece lista de tipos de imóvel (ex: Apartamento, Terreno)[\[13\]](https://api.sienge.com.br/docs/html-files/property-types-v1.html#:~:text=Busca%20uma%20lista%20de%20tipos,ResultSetMetadata). Modelo **TipoImovel**:  
\- **idTipoImovel** (Integer, PK)  
\- **descricao** (String): Descrição (ex: Apartamento, Casa, Terreno, Comercial etc).

Usado em **UnidadeImobiliaria** (descrita adiante) para categorizar a unidade.

### **Tipos de Condição de Pagamento**

Recurso: **Tipos de Condição de Pagamento** – Tipos padrão de condições (ex: A vista, Financiado, Parcelado em X vezes, etc). Modelo **TipoCondicaoPagamento**:  
\- **idTipoCondPag** (Integer, PK)  
\- **descricao** (String): Descrição da condição (ex: "Parcelado 24x", "Entrada \+ Financiamento").

No contexto de contratos de venda, pode haver referência a um tipo de condição padrão. Se o Sienge disponibiliza essa lista via API, armazenamos aqui e referenciamos em **ContratoVenda** ou **Reserva** conforme aplicável.

### **Planos Financeiros (Naturezas Financeiras)**

Recurso: **Planos Financeiros** – Representam as naturezas de receita/despesa (plano de contas gerencial, não confundir com contas contábeis). A API lista os planos financeiros disponíveis[\[14\]](https://api.sienge.com.br/docs/html-files/payment-categories-v1.html#:~:text=Planos%20Financeiros%201,de%20planos%20financeiros%20%C2%B7%20Models). Modelo **PlanoFinanceiro**:  
\- **idPlanoFinanceiro** (Integer, PK)  
\- **nomePlano** (String): Nome da natureza financeira (ex: _Receita de Venda Imóveis_, _Despesa Administrativa_).  
\- **codigoPlano** (String): Código hierárquico da natureza (ex: 1.2.03.04 conforme _natureza_ indicada).  
\- **tipo** (String): Indicador se é receita ou despesa, ou outra classificação.

_Relações:_ Em **Títulos a Pagar** e **Títulos a Receber**, o campo de _natureza_ financeira é representado por ID de PlanoFinanceiro. No exemplo de integração, o campo _paymentcategoriesid_ aparece para títulos a pagar[\[6\]](https://docs.fluidapi.io/sienge#:~:text=,teste%20do%20fluxo%20com%20o) – este corresponde ao **Plano Financeiro** vinculado à despesa.

### **Documentos (Identificação de Documentos)**

Recurso: **Documentos** – Refere-se à identificação de documentos financeiros, possivelmente tipos de documento fiscal/financeiro (por exemplo: Nota Fiscal, Fatura, Recibo). A API de Documentos lista identificações de documentos[\[15\]](https://api.sienge.com.br/docs/html-files/document-identification-v1.html#:~:text=Platform%20api.sienge.com.br%20%201.0.0.%20,v1.yaml%3Ftimestamp). Modelo **DocumentoIdentificacao**:  
\- **idDocumentoIdent** (String, PK): Código do tipo de documento (ex: "FFX", "NF", etc). _(Observação: pelo exemplo, parece ser um código alfanumérico)_[\[16\]](https://docs.fluidapi.io/sienge#:~:text=000%2F0001%2003%60%20%7D%7D,indexid).  
\- **descricao** (String): Descrição do tipo de documento (ex: _Nota Fiscal de Fornecedor_, _Fatura_, _Recibo_).

Este código é usado em títulos financeiros (campo _documentIdentificationId_ nos títulos a pagar[\[16\]](https://docs.fluidapi.io/sienge#:~:text=000%2F0001%2003%60%20%7D%7D,indexid)). Portanto **TituloFinanceiro** terá campo **idDocumentoIdent** referenciando esta tabela.

### **Municípios (Cities)**

Recurso: **Municípios** – Municípios para endereços. A API provavelmente lista cidades (e talvez estados) cadastrados. Modelo **Municipio**:  
\- **idMunicipio** (Integer, PK)  
\- **nome** (String)  
\- **codigoIBGE** (String): Código IBGE do município.  
\- **uf** (String): Estado (UF) do município.

**Endereço** (subentidade de clientes/credor/empresa) referenciará o município.

---

As tabelas acima são cadastros auxiliares. A seguir, abordaremos entidades principais de negócio: Clientes e Vendas, Fornecedores e Compras, Obras/Projetos e Financeiro. Cada subseção combina o entendimento dos endpoints e modelos envolvidos.

## Gestão de Clientes e Vendas

Esta seção abrange as entidades relacionadas aos **Clientes**, suas negociações (reservas e contratos de venda de unidades imobiliárias), e as contas a receber correspondentes.

### **Clientes (Customers)**

Recurso: **Clientes** – Representa os clientes/consumidores (pessoas físicas ou jurídicas). A API de Clientes permite listar clientes, bem como acessar sub-recursos do cliente: telefones, cônjuge, rendas familiares, endereços, anexos[\[17\]](https://api.sienge.com.br/docs/html-files/customers-v1.html#:~:text=Clientes,cliente%20%C2%B7%20Anexos%20do%20cliente). O modelo **Cliente** terá campos abrangendo informações gerais e estruturas separadas para Pessoa Física e Pessoa Jurídica:

- **idCliente** (Integer, PK): Identificador do cliente.

- **tipoCliente** (FK para TipoCliente): Indica se é PF ou PJ[\[17\]](https://api.sienge.com.br/docs/html-files/customers-v1.html#:~:text=Clientes,cliente%20%C2%B7%20Anexos%20do%20cliente).

- **nomeCompleto** (String): Nome completo (para pessoa física) ou Razão Social (para pessoa jurídica).

- **nomeSocial** (String): Nome social/apelido ou Nome Fantasia (se PJ).

- **cpfCnpj** (String): CPF (PF) ou CNPJ (PJ).

- **rg** (String, opcional): RG (pessoa física, se aplicável).

- **dataNascimento** (Date, PF): Data de nascimento (pessoa física).

- **nacionalidade** (String, PF): Nacionalidade[\[18\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200640-apoio-clientes-como-alterar-o-cadastro-de-cliente-atrav%C3%A9s-de-api-#:~:text=)[\[19\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200640-apoio-clientes-como-alterar-o-cadastro-de-cliente-atrav%C3%A9s-de-api-#:~:text=Aten%C3%A7%C3%A3o%21%C2%A0%C2%A0O%20campo%C2%A0%E2%80%9Cnacionalidade%E2%80%9D%C2%A0passar%C3%A1%20a%20ficar%20na,por%20meio%20da%20estrutura%20atual).

- **email** (String): E-mail de contato do cliente[\[18\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200640-apoio-clientes-como-alterar-o-cadastro-de-cliente-atrav%C3%A9s-de-api-#:~:text=)[\[19\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200640-apoio-clientes-como-alterar-o-cadastro-de-cliente-atrav%C3%A9s-de-api-#:~:text=Aten%C3%A7%C3%A3o%21%C2%A0%C2%A0O%20campo%C2%A0%E2%80%9Cnacionalidade%E2%80%9D%C2%A0passar%C3%A1%20a%20ficar%20na,por%20meio%20da%20estrutura%20atual).

- **estadoCivil** (FK para EstadoCivil, PF): Estado civil do cliente.

- **profissao** (FK para Profissao, PF): Profissão do cliente.

- **nomeConjuge** (String, PF, se não for mapeado como entidade separada): Nome do cônjuge, se casado. _(Nota: a API mais recente trata cônjuge como um sub-recurso separado)_.

- **ativo** (Boolean): Indica se o cadastro do cliente está ativo.

- **dataCadastro** (DateTime): Data de cadastro do cliente.

Sub-recursos do cliente de acordo com a API:

- **Telefones do cliente**: lista de telefones relacionados[\[17\]](https://api.sienge.com.br/docs/html-files/customers-v1.html#:~:text=Clientes,cliente%20%C2%B7%20Anexos%20do%20cliente). Modelo **ClienteTelefone** com campos: **idTelefone**, **idCliente** (FK), **numero** (String), **tipo** (String, ex: celular, fixo), **observacao** (ex: "WhatsApp"). Um cliente pode ter vários telefones.

- **Endereços do cliente**: endereços associados[\[17\]](https://api.sienge.com.br/docs/html-files/customers-v1.html#:~:text=Clientes,cliente%20%C2%B7%20Anexos%20do%20cliente). Modelo **ClienteEndereco**: **idEndereco**, **idCliente**, **logradouro**, **numero**, **complemento**, **bairro**, **cidade** (FK Municipio), **cep**, **tipoEndereco** (residencial, comercial, etc). Vários endereços por cliente.

- **Rendas Familiares do cliente**: fontes de renda declaradas[\[17\]](https://api.sienge.com.br/docs/html-files/customers-v1.html#:~:text=Clientes,cliente%20%C2%B7%20Anexos%20do%20cliente). Modelo **ClienteRenda**: **idRenda**, **idCliente**, **descricaoRenda** (ex: Salário, Aluguel), **valorMensal** (Decimal), **moeda** (BRL), **comprovada** (Boolean se comprovante apresentado). Várias rendas por cliente (PF).

- **Anexos do cliente**: documentos anexos (ex: cópia RG, comprovante residência)[\[17\]](https://api.sienge.com.br/docs/html-files/customers-v1.html#:~:text=Clientes,cliente%20%C2%B7%20Anexos%20do%20cliente). Modelo **ClienteAnexo**: **idAnexo**, **idCliente**, **tipoDocumento** (String, ex: RG, Comprovante), **urlArquivo** ou **binario** (dados do arquivo ou link).

- **Cônjuge do cliente**: a API possui um endpoint para consultar/alterar **cônjuge** do cliente[\[17\]](https://api.sienge.com.br/docs/html-files/customers-v1.html#:~:text=Clientes,cliente%20%C2%B7%20Anexos%20do%20cliente). O cônjuge pode ser tratado de duas formas no banco:

- **Abordagem 1:** Armazenar o cônjuge como parte do modelo Cliente (campos dedicados prefixedo, ex: _nomeConjuge_, _cpfConjuge_, _dataNascConjuge_, etc). Isso reflete a estrutura antiga da API.

- **Abordagem 2:** Armazenar em tabela separada **Conjuge** ligado 1-para-1 ao Cliente. Isso se alinha à nova API que trata cônjuge via endpoint /customers/{id}/spouse[\[20\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200640-apoio-clientes-como-alterar-o-cadastro-de-cliente-atrav%C3%A9s-de-api-#:~:text=dos%20c%C3%B4njuges%20vinculados%20a%20um,substitui%C3%A7%C3%A3o%C2%A0PUT%C2%A0conforme%20apresentado%20pela%20figura%20abaixo). Nesse caso, **Conjuge** teria campos similares ao cliente PF (nome, CPF, RG, data nascimento, nacionalidade, profissão etc.), e **Cliente** teria campo idConjuge apontando para a entidade.

Considerando manutenção, podemos implementar a tabela **Conjuge** separada. Assim, _Cliente (PF)_ se relaciona opcionalmente com um Conjuge (1:1). Para **Cliente (PJ)**, campos específicos como _nomeConjuge_ não se aplicam.

_Relações adicionais:_ Cliente se relaciona com **Reservas** e **Contratos de Venda** (um cliente pode ter várias reservas/contratos). Também está presente em **Títulos a Receber** como devedor (em geral, o cliente deve pagar). Caso o cliente seja também fornecedor (pouco provável no contexto, mas se fosse, seria registro duplicado em credores). Para evitar confusão, mantemos separado **Credor** abaixo.

### **Reservas de Unidades (Unit Reservations)**

Recurso: **Reservas de Unidades** – Representa a reserva (pré-venda) de uma unidade imobiliária para um cliente. A reserva geralmente precede um contrato de venda. Modelo **ReservaUnidade**:  
\- **idReserva** (Integer, PK)  
\- **idUnidade** (FK para UnidadeImobiliaria): Unidade reservada.  
\- **idCliente** (FK para Cliente): Cliente que fez a reserva.  
\- **dataReserva** (DateTime): Data/hora em que a reserva foi efetuada.  
\- **validadeReserva** (DateTime): Data de expiração da reserva (se houver prazo).  
\- **statusReserva** (String): Status atual (Ativa, Expirada, ConvertidaEmContrato, Cancelada).  
\- **observacoes** (String): Observações ou condições da reserva.

_Relações:_ Reserva liga Cliente e Unidade. Uma vez que a reserva se converte em contrato, possivelmente o registro de reserva é atualizado ou um contrato é criado referenciando a reserva. Se necessário, podemos incluir **idContratoVenda** na reserva quando virar venda.

### **Unidades de Imóveis (Real Estate Units)**

Recurso: **Unidades de Imóveis** – São as unidades comercializáveis nos empreendimentos (por ex, apartamentos, lotes, casas em um projeto). A API permite listar unidades ordenadas decrescentemente por ID e inserir novas unidades[\[21\]](https://api.sienge.com.br/docs/html-files/unit-v1.html#:~:text=API%20de%20Unidades%20de%20Im%C3%B3veis,unit). Modelo **UnidadeImobiliaria**:  
\- **idUnidade** (Integer, PK): Identificador da unidade.  
\- **codigoUnidade** (String): Código/número da unidade (ex: número do apto, lote).  
\- **idEmpreendimento** (FK para Empreendimento): A qual empreendimento (obra) a unidade pertence.  
\- **idTipoImovel** (FK para TipoImovel): Tipo da unidade (apartamento, etc).  
\- **bloco** (String, opcional): Identificação do bloco/torre, se aplicável.  
\- **andar** (Integer, opcional): Andar da unidade (se aplicável).  
\- **areaPrivativa** (Decimal, opcional): Área privativa da unidade.  
\- **areaTotal** (Decimal, opcional): Área total da unidade.  
\- **metragem** (Decimal, opcional): Outro campo de dimensão (caso usado).  
\- **valorTabela** (Decimal): Preço de tabela da unidade (sem descontos).  
\- **valorMinimo** (Decimal, opcional): Valor mínimo negociável.  
\- **statusUnidade** (String): Status atual (Disponível, Reservada, Vendida, etc).

_Relações:_ Unidade pertence a um **Empreendimento**. Pode ter **Reserva(s)** e **Contrato de Venda** associado quando vendida. Poderá também estar vinculada a **Contratos de Locação** se o empreendimento for de locação, mas normalmente unidades aqui referem-se a vendas.  
Além disso, unidades podem ter **Tabela de Preços** específicas por fase, mas assumiremos que o valor de tabela já reflete a tabela vigente.

### **Tabela de Preços (Price Tables)**

Recurso: **Tabela de Preços** – Pode referir-se a conjunto de valores atribuídos às unidades por período ou fase de obra. A API lista tabelas de preços disponíveis[\[22\]](https://api.sienge.com.br/docs/#:~:text=,69). Se for necessário armazenar: Modelo **TabelaPreco**:  
\- **idTabela** (Integer, PK)  
\- **nomeTabela** (String): Nome da tabela (ex: “Preço de Lançamento 2023”).  
\- **dataVigencia** (Date): Data de vigência inicial da tabela.  
\- **idEmpreendimento** (FK): Empreendimento ao qual se aplica (ou global).

Uma Tabela de Preços poderia relacionar-se com **UnidadeImobiliaria** para definir valores. Entretanto, dado que unidades já têm valor, essa tabela pode não ser imprescindível no banco local se os valores finais já estiverem nas unidades. Vamos mencionar, mas sem detalhar relações complexas (depende de uso).

### **Contratos de Vendas (Sales Contracts)**

Recurso: **Contratos de Vendas** – Representa a venda efetivada de uma unidade para um cliente. A API permite listar contratos de venda (e via Bulk, extrair todos)[\[23\]](https://api.sienge.com.br/docs/#:~:text=%2A%20Sobre%20APIs%20Bulk). Modelo **ContratoVenda**:  
\- **idContrato** (Integer, PK): Identificador do contrato de venda.  
\- **numeroContrato** (String): Número ou código do contrato.  
\- **idCliente** (FK para Cliente): Comprador.  
\- **idUnidade** (FK para UnidadeImobiliaria): Unidade vendida.  
\- **dataContrato** (Date): Data de assinatura do contrato.  
\- **valorContrato** (Decimal): Valor total do contrato (preço de venda).  
\- **idIndexador** (FK Indexador, opcional): Indexador para correção das parcelas, se houver.  
\- **idPlanoFinanceiro** (FK PlanoFinanceiro, opcional): Natureza financeira da receita (receita de venda).  
\- **idCondicaoPagamento** (FK TipoCondicaoPagamento): Condição de pagamento acordada.  
\- **entrada** (Decimal, opcional): Valor de entrada pago.  
\- **financiamento** (Decimal, opcional): Valor financiado (se houver financiamento externo).  
\- **observacoes** (String): Observações gerais.  
\- **statusContrato** (String): Status (Ativo, Distratado, etc).

_Relações:_ Contrato de Venda vincula Cliente e Unidade. A existência de um contrato normalmente implica que a unidade sai do status _Disponível_ para _Vendida_.  
Os **Títulos a Receber** (parcelas de pagamento) do contrato estão relacionados: cada parcela prevista pode ser registrada como um **Título a Receber** vinculado ao contrato e ao cliente. Dependendo de como o Sienge estrutura, pode haver uma tabela de **Parcelas do Contrato**, mas como a API já expõe _Títulos a Receber_, podemos utilizar essas entidades financeiras (ver próxima seção) para representar as parcelas do contrato.  
Além disso, **Comissões** de corretagem podem estar associadas ao contrato.

### **Comissões de Vendas (Sales Commissions)**

Recurso: **Comissões** – Refere-se a comissões pagas a vendedores/corretores sobre contratos de venda. Há API de _Comissões_ e _Comissões (Antigo)_ para listagem e cadastro[\[24\]](https://api.sienge.com.br/docs/#:~:text=,Contas%20Cont%C3%A1beis). Modelo **ComissaoVenda**:  
\- **idComissao** (Integer, PK)  
\- **idContrato** (FK para ContratoVenda): Contrato de venda que gerou a comissão.  
\- **nomeCorretor** ou **idCorretor** (String ou FK para um cadastro de corretor se houver): Identificação do corretor/parceiro.  
\- **percentual** (Decimal): Percentual da comissão sobre o valor.  
\- **valorComissao** (Decimal): Valor da comissão.  
\- **paga** (Boolean): Indicador se já foi paga.  
\- **dataPagamento** (Date, opcional): Data em que foi paga (se paga).

A API sugere operações de recuperação e mudança de situação[\[25\]](https://desenvolvedor.cvcrm.com.br/reference/distribuicaoleads#:~:text=API%20de%20Comiss%C3%B5es). Provavelmente comissões podem ser aprovadas/pagas via sistema. Para nosso modelo, é suficiente armazenar as informações básicas acima.

### **Reparcelamentos (Receivable Rescheduling)**

Recurso: **Reparcelamentos \- Contas a Receber** – Permite reescalonar parcelas de contratos (por exemplo, quando um cliente renegocia o plano de pagamento). Este endpoint indica a reprogramação de parcelas de títulos a receber[\[26\]](https://api.sienge.com.br/docs/#:~:text=,Reservas%20de%20Unidades). Poderíamos mapear um modelo **ReparcelamentoReceber**:  
\- **idReparcelamento** (Integer, PK)  
\- **idContrato** (FK ContratoVenda, ou idCliente \+ algum identificador de acordo)  
\- **dataReparcelamento** (Date)  
\- **motivo** (String): Motivo ou observação.

E talvez vincular aos novos títulos gerados. No entanto, para fins práticos, podemos não aprofundar esta tabela, bastando saber que novos **Títulos a Receber** substituirão os antigos. Assim, talvez seja suficiente atualizar/registrar as parcelas (títulos) alterados. Vamos deixar explícito que esse recurso existe mas não detalharemos a estrutura do reparcelamento no banco, pois ele se manifesta nos títulos financeiros.

### **Portadores (Meios de Recebimento)**

Recurso: **Portadores para o Contas a Receber** – Refere-se aos "portadores" ou meios de recebimento, possivelmente contas bancárias ou carteiras de cobrança associadas à empresa para receber pagamentos[\[27\]](https://api.sienge.com.br/docs/html-files/bearers-receivable-v1.html#:~:text=Portadores%20para%20o%20Contas%20a,Portadores). Modelo **PortadorRecebimento**:  
\- **idPortador** (Integer, PK)  
\- **descricao** (String): Nome do portador (ex: _Conta Banco do Brasil \- Agência X_)  
\- **codigo** (String): Código interno ou identificação (por ex, código da carteira de boleto).  
\- **ativo** (Boolean): Se está ativo para uso.

**Títulos a Receber** poderiam referenciar um Portador (ex: para saber em qual conta o cliente deve pagar, no caso de boleto bancário). Se a API de contratos de venda ou títulos a receber incluir campo de portador, mapeamos essa relação.

### **Antecipação de Parcelas**

Recurso: **Antecipação de Parcelas** – Permite registrar ou consultar antecipações de pagamento de parcelas (contas a receber). Por exemplo, um cliente decidindo pagar parcelas futuras antecipadamente. A API de Antecipação integra CRMs para antecipar parcelas[\[28\]](https://ajuda.sienge.com.br/support/solutions/articles/153000241163-quais-alterac%C3%B5es-foram-realizadas-no-endpoint-de-antecipac%C3%A3o-de-parcelas-#:~:text=Quais%20altera%C3%A7%C3%B5es%20foram%20realizadas%20no,). Podemos não criar uma tabela específica, pois conceitualmente isso resulta em liquidação (baixa) de títulos a receber antes da data. No banco, podemos tratar como um evento de pagamento vinculado às parcelas originais. Se fosse necessário, poderia haver um modelo **AntecipacaoParcela** com id, contrato ou cliente, valor antecipado, data, etc., mas provavelmente o controle é feito nos títulos a receber mesmo. Mencionamos para completude, mas não implementamos tabela separada.

### **Títulos do Contas a Receber (Receivable Titles)**

Recurso: **Títulos do Contas a Receber** – Representa os lançamentos a receber (parcelas de clientes). A API de Títulos a Receber permite listar títulos (possivelmente filtrados por período, contrato, etc)[\[29\]](https://api.sienge.com.br/docs/html-files/accounts-receivable-v1.html#:~:text=API%20de%20t%C3%ADtulos%20do%20contas,financeira%20do%20t%C3%ADtulo%20%C2%B7%20Models) e consultar detalhes como parcelas e apropriações financeiras. Estruturamos o modelo **TituloReceber** para armazenar cada título (parcela de contrato ou outra cobrança):

- **idTituloReceber** (Integer, PK): Identificador do título (boleto/fatura) no sistema.

- **idContrato** (FK ContratoVenda, opcional): Se vinculado a um contrato de venda específico.

- **idCliente** (FK Cliente): Devedor do título (cliente).

- **idEmpresa** (FK Empresa): Empresa credora (normalmente a sua própria empresa).

- **numeroDocumento** (String): Número do documento (ex: número do boleto ou fatura)[\[16\]](https://docs.fluidapi.io/sienge#:~:text=000%2F0001%2003%60%20%7D%7D,indexid).

- **idDocumentoIdent** (FK DocumentoIdentificacao): Tipo de documento (ex: "FFX" para fatura, etc)[\[16\]](https://docs.fluidapi.io/sienge#:~:text=000%2F0001%2003%60%20%7D%7D,indexid).

- **dataEmissao** (Date): Data de emissão do título[\[10\]](https://docs.fluidapi.io/sienge#:~:text=tostring%20,htmldate).

- **dataVencimento** (Date): Data de vencimento[\[30\]](https://docs.fluidapi.io/sienge#:~:text=,htmldate).

- **valorOriginal** (Decimal): Valor original do título (principal)[\[31\]](https://docs.fluidapi.io/sienge#:~:text=0%2C%20,default).

- **valorAtualizado** (Decimal, opcional): Valor atualizado (se corrigido por juros/indexador até o momento, ou com multas).

- **idIndexador** (FK Indexador, opcional): Indexador aplicado, se parcelamento for corrigido.

- **juros** (Decimal, opcional): Valor de juros acumulado (se em atraso).

- **multa** (Decimal, opcional): Valor de multa (se aplicável).

- **descontoConcedido** (Decimal, opcional): Valor de desconto concedido (ex: por antecipação ou negociação).

- **valorPago** (Decimal, opcional): Valor já pago (no caso de pagamento parcial ou recebimento registrado).

- **dataPagamento** (Date, opcional): Data de quitação (se pago).

- **status** (String): Status do título (Aberto/Pendente, Pago, Cancelado, Renegociado etc).

- **idPortador** (FK PortadorRecebimento, opcional): Portador (conta/carteira) para recebimento.

_Relações:_ O título a receber relaciona-se com Cliente e, se derivado de um contrato, com ContratoVenda e Unidade. Pode haver relação com **Recebimentos/Pagamentos** (se registrarmos pagamentos separadamente, mas podemos atualizar campos de pagamento no próprio título). Além disso, _Títulos a Receber_ podem ser associados a **Comissões** (por exemplo, uma comissão de corretor pode ser devida quando um título é pago; mas esse vínculo é indireto via contrato).

A API também menciona **Parcelas do título** e **Apropriação financeira do título**[\[29\]](https://api.sienge.com.br/docs/html-files/accounts-receivable-v1.html#:~:text=API%20de%20t%C3%ADtulos%20do%20contas,financeira%20do%20t%C3%ADtulo%20%C2%B7%20Models). Em contas a receber, "parcelas do título" pode se referir a pagamentos parcelados daquele título (por exemplo, se o título foi renegociado em parcelas) – mas é raro, geralmente o título já é a própria parcela. Pode se tratar do detalhamento de um título em múltiplos recebimentos. Nesse caso, poderíamos ter uma tabela de **RecebimentoParcelaReceber** para registrar pagamentos parciais.

**Bulk Data \- Parcelas do Contas a Receber:** Existe um endpoint Bulk que retorna todas as parcelas do contas a receber num período[\[8\]](https://api.sienge.com.br/docs/html-files/bulk-data-income-v1.html#:~:text=Parcelas%20do%20Contas%20a%20Receber,bills). Essas "parcelas" correspondem justamente aos títulos listados acima, possivelmente incluindo informações de pagamento. No banco, não há duplicata – usamos **TituloReceber** para todos.

### **Histórico de Cobranças e Relatórios de Recebíveis**

Além dos títulos, a API fornece alguns recursos auxiliares: \- **Histórico de Notificação de Cobranças** – registro de lembretes/envios de cobrança ao cliente[\[32\]](https://api.sienge.com.br/docs/#:~:text=,Hist%C3%B3rico%20de%20Notifica%C3%A7%C3%A3o%20de%20Cobran%C3%A7as). Podemos ter uma tabela **CobrancaNotificacao**: **idNotificacao**, **idCliente**, **dataEnvio**, **meio** (Email, SMS), **referencia** (qual título/período), **statusEntrega**. Serve para auditoria de comunicações.  
\- **Extrato de Cliente** – a API pode gerar um relatório de extrato (contendo todos os títulos e pagamentos do cliente) e enviar por e-mail[\[33\]](https://api.sienge.com.br/docs/#:~:text=,mail%20%20%2A%20%2028). Não há necessidade de tabela, pois extrato consolida dados de **TituloReceber** e pagamentos existentes, mas podemos armazenar logs de envio (ex: **ExtratoEmailLog** com id, cliente, dataEnvio, períodoCoberto).  
\- **Geração de Cobrança de Parcelas Vencidas** – provavelmente um endpoint para gerar documentos de cobrança (boletos/cartas) para todas parcelas atrasadas[\[34\]](https://api.sienge.com.br/docs/#:~:text=,Hist%C3%B3rico%20de%20Notifica%C3%A7%C3%A3o%20de%20Cobran%C3%A7as). Novamente, sem novos dados a armazenar além, possivelmente, de um log do evento.

- **Saldo Devedor Presente** – este endpoint calcula o saldo devedor presente de um contrato (soma das parcelas futuras descontadas ou atualizadas até a data presente)[\[35\]](https://api.sienge.com.br/docs/#:~:text=,52). _Saldo Devedor Presente do Cliente (Total)_ faz o mesmo em nível de cliente (todos contratos)[\[36\]](https://api.sienge.com.br/docs/#:~:text=,Total). Não é uma entidade armazenada, mas um cálculo on-the-fly sobre os títulos. Portanto, não vira tabela; podemos reproduzir via query quando necessário somando os **TituloReceber** em aberto de um cliente.

## Gestão de Fornecedores e Compras

Agora passamos aos recursos relacionados a fornecedores (credores) e ao processo de compras e contas a pagar da empresa.

### **Credores (Suppliers/Creditors)**

Recurso: **Credores** – Representa os fornecedores e credores da empresa (fornecedores de insumos, prestadores de serviço, etc.). A API de Credores permite obter dados dos credores e, conforme atualização, incluir informações bancárias deles[\[37\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200200-api-rest-credores#:~:text=A%20API%20POST%C2%A0%2Fcreditors%2F%7BcreditorId%7D%2Fbank,conta%2C%20benefici%C3%A1rios%2C%20entre%20outras%20informa%C3%A7%C3%B5es)[\[38\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200200-api-rest-credores#:~:text=A%20API%C2%A0GET%C2%A0%2Fcreditors%2F%7BcreditorId%7D%2Fbank,da%20conta%2C%20entre%20outras%20informa%C3%A7%C3%B5es). Modelo **Credor**:  
\- **idCredor** (Integer, PK): Identificador do credor.  
\- **tipoCredor** (String): Tipo (PJ ou PF, ou se é fornecedor, corretor, etc).  
\- **nomeCredor** (String): Nome ou Razão Social do credor.  
\- **cpfCnpj** (String): CPF/CNPJ do credor.  
\- **inscricaoEstadual** (String, opcional): Inscrição estadual (se PJ).  
\- **endereco** (campos de endereço similares ao do cliente, possivelmente extrair para tabela **CredorEndereco**).  
\- **contato** (String, opcional): Nome da pessoa de contato no credor.  
\- **telefoneContato** (String, opcional): Telefone principal.  
\- **emailContato** (String, opcional): Email de contato.  
\- **ativo** (Boolean): Se está ativo.  
\- **ehCorretor** (Boolean, opcional): Se este credor atua como corretor (no Sienge, corretores de vendas são cadastrados como credores do tipo corretor).

**Informações Bancárias do Credor:** A API recentemente adicionou endpoints para inserir/consultar os dados bancários de um credor[\[37\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200200-api-rest-credores#:~:text=A%20API%20POST%C2%A0%2Fcreditors%2F%7BcreditorId%7D%2Fbank,conta%2C%20benefici%C3%A1rios%2C%20entre%20outras%20informa%C3%A7%C3%B5es). Isso inclui banco, agência, número de conta, tipo de conta, beneficiário etc. Podemos modelar uma entidade separada **CredorInfoBancaria**:  
\- **idInfoBancaria** (Integer, PK)  
\- **idCredor** (FK Credor)  
\- **banco** (String ou código do banco)  
\- **agencia** (String)  
\- **conta** (String)  
\- **digitoConta** (String)  
\- **tipoConta** (String: Corrente/Poupança)  
\- **nomeBeneficiario** (String, se diferente do nome do credor)  
\- **cpfCnpjBeneficiario** (String, se aplicável)  
\- **ativa** (Boolean)

Um credor pode ter múltiplas contas bancárias cadastradas. A API POST /creditors/{credorId}/bank-informations insere uma nova conta bancária para o credor[\[37\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200200-api-rest-credores#:~:text=A%20API%20POST%C2%A0%2Fcreditors%2F%7BcreditorId%7D%2Fbank,conta%2C%20benefici%C3%A1rios%2C%20entre%20outras%20informa%C3%A7%C3%B5es), e GET /creditors/{credorId}/bank-informations lista todas[\[38\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200200-api-rest-credores#:~:text=A%20API%C2%A0GET%C2%A0%2Fcreditors%2F%7BcreditorId%7D%2Fbank,da%20conta%2C%20entre%20outras%20informa%C3%A7%C3%B5es). Portanto, modelamos InfoBancaria separado (relação 1:N Credor \-\> InfoBancaria).

_Relações:_ Credor relaciona-se com **Títulos a Pagar** como beneficiário/credor do pagamento. Ou seja, cada **TituloPagar** tem um **idCredor**. Credor também pode estar ligado a **Contratos de Suprimentos** (contratos com fornecedores) e **Pedidos de Compra** como fornecedor.

### **Solicitações de Compra (Purchase Requests)**

Recurso: **Solicitações de Compra** – Equivale ao registro inicial de uma requisição de compra de material/serviço antes da aprovação. A API /purchase-requests/ permite consultar solicitações pelo ID[\[39\]](https://ajuda.sienge.com.br/support/solutions/articles/153000226969-apis-solicitac%C3%B5es-de-compra#:~:text=APIs%20,compra%20atrav%C3%A9s%20de%20seu%20ID). Modelo **SolicitacaoCompra**:  
\- **idSolicitacao** (Integer, PK)  
\- **numeroSolicitacao** (String): Número da solicitação (código interno).  
\- **idEmpresa** (FK Empresa): Empresa solicitante (se multi-empresa).  
\- **idDepartamento** (FK Departamento): Departamento que solicita.  
\- **solicitante** (String): Nome do colaborador que fez a solicitação.  
\- **dataSolicitacao** (Date): Data da solicitação.  
\- **descricao** (String): Descrição geral ou objetivo.  
\- **status** (String): Status (Pendente, Aprovada, Atendida, etc).

A solicitação pode conter **itens solicitados** (lista de insumos e quantidades). Se necessário: tabela **SolicitacaoItem**: **idSolicitacaoItem**, **idSolicitacao**, **descricaoItem** (ou idInsumo se referenciar um cadastro de insumo), **quantidade**, **unidade**, **justificativa**.

### **Pedidos de Compra (Purchase Orders)**

Recurso: **Pedidos de Compra** – Após aprovação da solicitação e cotação, gera-se um pedido de compra ao fornecedor. A API de Pedidos de Compra permite listar e inserir pedidos. Modelo **PedidoCompra**:  
\- **idPedido** (Integer, PK)  
\- **numeroPedido** (String): Número do pedido.  
\- **idSolicitacao** (FK SolicitacaoCompra, opcional): Se originado de uma solicitação.  
\- **idCredor** (FK Credor): Fornecedor para quem o pedido foi emitido.  
\- **dataPedido** (Date): Data de emissão do pedido.  
\- **dataEntregaPrevista** (Date, opcional): Data prevista de entrega.  
\- **idEmpreendimento** (FK Empreendimento, opcional): Obra/empreendimento a que se destina (se compras para obras).  
\- **idDepartamento** (FK Departamento, opcional): Departamento responsável/solicitante.  
\- **valorTotal** (Decimal): Valor total do pedido (soma dos itens).  
\- **status** (String): Status do pedido (Aberto, Fechado, Cancelado, etc).

**Itens do Pedido:** Podemos ter **PedidoItem**: **idPedidoItem**, **idPedido**, **idInsumo** (FK Insumo, ver adiante), **descricaoItem** (texto do item se for livre), **quantidade**, **unidade**, **precoUnitario**, **valorTotalItem**.

### **Contratos do Suprimentos (Procurement Contracts)**

Recurso: **Contratos do Suprimentos** – Contratos formais com fornecedores (para obras ou fornecimentos contínuos). Modelo **ContratoSuprimento**:  
\- **idContratoSuprimento** (Integer, PK)  
\- **numeroContrato** (String)  
\- **idCredor** (FK Credor): Fornecedor contratado.  
\- **idEmpreendimento** (FK Empreendimento, opcional): Obra associada (no caso de contrato de empreitada).  
\- **dataInicio** (Date)  
\- **dataFim** (Date, opcional)  
\- **objeto** (String): Objeto do contrato (descrição do que será fornecido ou realizado).  
\- **valorContrato** (Decimal): Valor total contratado.  
\- **status** (String): Em vigor, Encerrado, etc.

Esse contrato pode gerar **Medições** mensais ou periódicas para pagamento, e **Títulos a Pagar** correspondentes.

### **Medição de Contrato (Contract Measurements)**

Recurso: **Medição de Contrato** – Refere-se ao progresso medido de um contrato de fornecimento ou empreitada, para fins de pagamento. Modelo **MedicaoContrato**:  
\- **idMedicao** (Integer, PK)  
\- **idContratoSuprimento** (FK ContratoSuprimento)  
\- **numeroMedicao** (Integer): Sequencial da medição (1,2,3,...)  
\- **dataMedicao** (Date): Data de referência da medição (fim do período medido).  
\- **percentualExecutado** (Decimal): Percentual executado até essa medição (cumulativo ou do período).  
\- **valorMedicao** (Decimal): Valor devido nessa medição (podemos calcular como percentual \* valorContrato se cumulativo, ou inserir diretamente).  
\- **aprovada** (Boolean): Indicador se medição foi aprovada para pagamento.

Uma medição aprovada geralmente gera um **Título a Pagar** para pagamento ao fornecedor.

### **Cotações de Preços (Price Quotes)**

Recurso: **Cotações de Preços** – Cotações obtidas de fornecedores para atender uma solicitação de compra. A API Bulk tem recurso para cotações[\[40\]](https://api.sienge.com.br/docs/#:~:text=,Extrato%20Cliente%20Hist%C3%B3rico). Podemos modelar **CotacaoPreco**:  
\- **idCotacao** (Integer, PK)  
\- **idSolicitacao** (FK SolicitacaoCompra): Solicitação referida.  
\- **idCredor** (FK Credor): Fornecedor que cotou.  
\- **dataCotacao** (Date): Data recebimento da cotação.  
\- **validaAte** (Date): Validade da proposta.  
\- **valorTotalCotado** (Decimal): Valor total cotado (soma dos itens).  
\- **condicoes** (String): Condições comerciais (ex: prazo de pagamento).  
\- **escolhida** (Boolean): Se essa cotação foi a escolhida para gerar o pedido.

**Itens da Cotação**: tabela **CotacaoItem** similar a PedidoItem, contendo preços ofertados por item, para comparar entre fornecedores.

### **Nota Fiscal de Compra (Purchase Invoice)**

Recurso: **Nota Fiscal de Compra** – Notas fiscais de entrada (compras) lançadas. A API de Nota Fiscal de Compra deve listar NFes de entrada[\[41\]](https://api.sienge.com.br/docs/#:~:text=,48). Modelo **NotaFiscalCompra**:  
\- **idNotaFiscal** (Integer, PK)  
\- **idCredor** (FK Credor): Fornecedor que emitiu a nota (remetente).  
\- **numeroNota** (String): Número da NF.  
\- **serie** (String): Série da NF.  
\- **chaveAcesso** (String, opcional): Chave de acesso da NF-e (44 dígitos, se eletrônica).  
\- **dataEmissao** (Date)  
\- **valorTotal** (Decimal)  
\- **idPedido** (FK PedidoCompra, opcional): Se vinculada a um pedido.  
\- **idContratoSuprimento** (FK, opcional): Se vinculada a um contrato (ex: medição).  
\- **status** (String): Status (Pendente lançamento, Lançada, Cancelada).

Poderíamos ter **NotaFiscalItem** para detalhar itens vs estoque, mas o nível de detalhe vai além do necessário para o mapeamento geral.

### **Informações Fiscais de Serviço – Contas a Pagar**

Recurso: **Informações Fiscais de Serviço \- Contas a Pagar** – Provavelmente detalha impostos retidos e outros dados fiscais de serviços tomados (ISS, INSS etc) vinculados a títulos a pagar[\[42\]](https://api.sienge.com.br/docs/#:~:text=,36). Ao lançar um título a pagar de serviço, há estrutura de impostos. Modelamos **TituloPagarImposto**:  
\- **idTituloPagar** (FK Título a Pagar)  
\- **tipoImposto** (String): Ex: ISS, INSS, IRRF, CSRF etc.  
\- **baseCalculo** (Decimal)  
\- **aliquota** (Decimal)  
\- **valorImposto** (Decimal)  
\- **retido** (Boolean): Se é imposto retido na fonte (true) ou a recolher (false).

Vários impostos por título. Esses dados podem vir pela API de Informações Fiscais.

### **Notas Fiscais Eletrônicas de Produto**

Recurso: **Notas Fiscais Eletrônicas de Produto** – Provavelmente NF-e de produto recebidas via integração SEFAZ ou upload[\[43\]](https://api.sienge.com.br/docs/html-files/nfe-api-v1.html#:~:text=Notas%20Fiscais%20Eletr%C3%B4nicas%20de%20Produto,Schemes). Pode ser semelhante à NotaFiscalCompra, ou uma visão consolidada das NFes eletrônicas. Talvez seja redundante armazenar se já cobrimos NotaFiscalCompra. De todo modo, podemos considerar que **NotaFiscalCompra** cobre tanto papel quanto eletrônica (diferenciando via chave). A API sugere que esse endpoint expõe as NF-es recebidas (possivelmente incluindo chaves, protocolos, situação de manifesto). Se precisássemos detalhes específicos (como situação do manifesto, se confirmada), poderíamos adicionar campos. Mas para esquema de dados principal, manter como acima.

### **Bens Imóveis (Fixed Assets \- Properties)**

Recurso: **Bens Imóveis** – Ativos imobilizados do tipo imóvel (terrenos, edifícios pertencentes à empresa, não confundir com unidades para venda). A API _Bens Imóveis_ lista ativos fixos imóveis[\[44\]](https://api.sienge.com.br/docs/#:~:text=,8). Modelo **BemImovel**:  
\- **idBemImovel** (Integer, PK)  
\- **descricao** (String): Descrição do bem (ex: Terreno Matriz, Escritório SP).  
\- **endereco** (campos de endereço se relevante)  
\- **valorAquisicao** (Decimal)  
\- **dataAquisicao** (Date)  
\- **vidaUtil** (Integer, meses ou anos, se calculam depreciação)  
\- **valorContabil** (Decimal, valor atual contabilizado, se mantido)

Esse módulo serve para controle patrimonial. Não tem muita relação com outros aqui exceto contabilidade (pode influenciar lançamentos contábeis de depreciação). Podemos mapear básico.

### **Bens Móveis (Fixed Assets \- Equipment)**

Recurso: **Bens Móveis** – Ativos imobilizados móveis (máquinas, veículos, equipamentos)[\[45\]](https://api.sienge.com.br/docs/html-files/fixed-assets-v1.html#:~:text=Sienge%20Platform%201.0.%20,v1.yaml%3Ftimestamp%3D1753730655). Modelo **BemMovel** é análogo: id, descrição, número de patrimônio, valor aquisição, data, etc.

### **Locação de Imóveis (Property Rentals)**

Recurso: **Locação de Imóveis** – Contratos de locação (quando a empresa atua alugando imóveis de sua propriedade para terceiros). A API permite consultar contratos de locação cadastrados[\[46\]](https://api.sienge.com.br/docs/#:~:text=,42). Modelo **ContratoLocacao**:  
\- **idContratoLocacao** (Integer, PK)  
\- **idBemImovel** (FK BemImovel ou UnidadeImobiliaria): Qual imóvel está sendo alugado. (Pode ser um bem do patrimônio ou até uma unidade de estoque não vendida sendo temporariamente alugada)  
\- **idCliente** (FK Cliente): Locatário (quem aluga, pode ser cliente).  
\- **dataInicio** (Date)  
\- **dataFim** (Date, se determinado)  
\- **valorAluguel** (Decimal): Valor mensal do aluguel.  
\- **periodicidadeReajuste** (String): Periodicidade de reajuste (anual, etc) e possivelmente índice.  
\- **idIndexador** (FK Indexador, se reajustado por índice)  
\- **garantia** (String): Tipo de garantia (Caução, Fiador, Seguro Fiança, etc).  
\- **ativo** (Boolean): Se contrato vigente.

Os **títulos a receber** de aluguel mensal seriam gerados no contas a receber possivelmente com um campo que referencia este contrato de locação.

### **Extrato de Contas (Account Statement)**

Recurso: **Extrato de contas** – Gera um extrato consolidado de todas as contas financeiras da empresa (contas correntes e caixa)[\[47\]](https://api.sienge.com.br/docs/#:~:text=,30). Provavelmente um relatório de movimentos. Não há entidade extra, pois isso deriva das movimentações de caixa e saldo, tratados a seguir.

## Financeiro e Contabilidade

Nesta seção final, mapeamos as entidades de **Contas a Pagar** (títulos e parcelas, relacionando-se com fornecedores), **Contabilidade** (contas contábeis, lançamentos, saldos) e **Tesouraria** (contas correntes, caixa, movimentos).

### **Títulos do Contas a Pagar (Payable Titles)**

Recurso: **Títulos do Contas a Pagar** – São os títulos a pagar (despesas, contas a pagar a fornecedores). A API permite listar, inserir e atualizar títulos[\[48\]](https://api.sienge.com.br/docs/html-files/bill-debt-v1.html#:~:text=T%C3%ADtulos%20a%20pagar,atualiza%C3%A7%C3%A3o%20de%20parcelas%20do%20t%C3%ADtulo). Modelo **TituloPagar** similar ao de receber, porém voltado para pagamentos:  
\- **idTituloPagar** (Integer, PK)  
\- **idCredor** (FK Credor): Fornecedor a quem devemos pagar (credor)[\[16\]](https://docs.fluidapi.io/sienge#:~:text=000%2F0001%2003%60%20%7D%7D,indexid).  
\- **idEmpresaDevedora** (FK Empresa): Empresa devedora (normalmente sua empresa; relevante se multi-empresa). No payload de exemplo aparece _debtorid_ representando a empresa devedora[\[16\]](https://docs.fluidapi.io/sienge#:~:text=000%2F0001%2003%60%20%7D%7D,indexid).  
\- **numeroDocumento** (String): Número do documento do título (ex: número da NF do fornecedor ou fatura interna)[\[16\]](https://docs.fluidapi.io/sienge#:~:text=000%2F0001%2003%60%20%7D%7D,indexid).  
\- **idDocumentoIdent** (FK DocumentoIdentificacao): Tipo do documento (ex: nota fiscal, fatura, recibo)[\[16\]](https://docs.fluidapi.io/sienge#:~:text=000%2F0001%2003%60%20%7D%7D,indexid).  
\- **dataEmissao** (Date): Data de emissão do título ou documento[\[10\]](https://docs.fluidapi.io/sienge#:~:text=tostring%20,htmldate).  
\- **dataVencimento** (Date): Data de vencimento para pagamento[\[30\]](https://docs.fluidapi.io/sienge#:~:text=,htmldate).  
\- **valorOriginal** (Decimal): Valor original do título[\[31\]](https://docs.fluidapi.io/sienge#:~:text=0%2C%20,default).  
\- **valorAtualizado** (Decimal, opcional): Valor atualizado (com juros, correção se houver).  
\- **idIndexador** (FK Indexador, opcional): Indexador aplicado (se título for corrigido monetariamente)[\[10\]](https://docs.fluidapi.io/sienge#:~:text=tostring%20,htmldate).  
\- **idPlanoFinanceiro** (FK PlanoFinanceiro): Natureza financeira da despesa (ex: natureza do gasto)[\[6\]](https://docs.fluidapi.io/sienge#:~:text=,teste%20do%20fluxo%20com%20o).  
\- **observacao** (String): Observações ou descrição da despesa (campo _notes_)[\[49\]](https://docs.fluidapi.io/sienge#:~:text=0%2C%20,costcenterid).  
\- **descontoObtido** (Decimal, opcional): Desconto obtido no pagamento (se antecipação, etc)[\[49\]](https://docs.fluidapi.io/sienge#:~:text=0%2C%20,costcenterid).  
\- **status** (String): Status (Aberto/Pendente, Pago, Cancelado).  
\- **valorPago** (Decimal): Valor já pago (se parcial ou liquidado).  
\- **dataPagamento** (Date, opcional): Data de pagamento efetuado.

_Relações:_  
**Parcelas do título a pagar:** Alguns títulos podem ser parcelados (ex: pagamento em várias vezes). A API menciona listagem de parcelas do título[\[48\]](https://api.sienge.com.br/docs/html-files/bill-debt-v1.html#:~:text=T%C3%ADtulos%20a%20pagar,atualiza%C3%A7%C3%A3o%20de%20parcelas%20do%20t%C3%ADtulo). Se um título tiver múltiplas parcelas, podemos representar cada parcela também como um **TituloPagar** separado vinculado por um campo **idTituloParcelaPai** (self FK) ou ter tabela **ParcelaTituloPagar**. No Sienge, talvez cada parcela seja um título em si, ou as parcelas são acessadas via outro endpoint. Para consistência, modelamos uma tabela **ParcelaTituloPagar**:  
\- **idParcela** (Integer, PK)  
\- **idTituloPagar** (FK TituloPagar principal)  
\- **numeroParcela** (Integer)  
\- **dataVencimentoParcela** (Date)  
\- **valorParcela** (Decimal)  
\- **valorPagoParcela** (Decimal)  
\- **dataPagamentoParcela** (Date, opcional)  
\- **statusParcela** (String)

Entretanto, poderíamos simplificar assumindo cada parcela é um TituloPagar independente (com mesmo número de documento talvez diferenciando parcela). Para evitar confusão, vamos supor que **TituloPagar** cobre parcelas individualmente (já que há inserção e listagem de título singular), e a _parcela do título_ é mais para consulta de parcelas vinculadas.

**Apropriação por Centro de Custo e Departamento:** No contas a pagar, pode-se ratear uma despesa em centros de custo e departamentos. O payload de exemplo mostra arrays _budgetcategories_ (centros de custo com naturezas) e _departmentscost_ (departamentos) associados ao título[\[50\]](https://docs.fluidapi.io/sienge#:~:text=,teste%20do%20fluxo%20com%20o). Modelamos:  
\- **TituloPagarCentroCusto** (tabela de alocação em centros de custo): **idTituloPagar**, **idCentroCusto**, **idPlanoFinanceiro**, **percentual** (ou valor)[\[50\]](https://docs.fluidapi.io/sienge#:~:text=,teste%20do%20fluxo%20com%20o). Um título pode ter várias linhas distribuindo seu valor entre diferentes centros de custo e naturezas financeiras.  
\- **TituloPagarDepartamento** (tabela de alocação por departamento): **idTituloPagar**, **idDepartamento**, **percentual**[\[6\]](https://docs.fluidapi.io/sienge#:~:text=,teste%20do%20fluxo%20com%20o). Permite dividir o valor entre departamentos internos.

**Impostos do título:** conforme acima, tabela **TituloPagarImposto** detalha ISS e outros impostos retidos para títulos de serviço.

**Parcelas a Pagar Bulk:** Existe Bulk API de parcelas de contas a pagar[\[51\]](https://api.sienge.com.br/docs/html-files/professions-v1.html#:~:text=1.0.0.%20%5B%20Base%20URL%3A%20api.sienge.com.br%2F%7Bsubdominio,v1.yaml%3Ftimestamp%3D1756217773). Semelhante às parcelas a receber, provavelmente extrai todos os TituloPagar ou suas parcelas no período. Armazenamos nos mesmos modelos já definidos (TituloPagar e/ou Parcelas).

### **Contas-Correntes (Bank Accounts)**

Recurso: **Contas-Correntes** – Representa as contas bancárias e de caixa da empresa (onde são realizados pagamentos e recebimentos). API lista contas-correntes cadastradas[\[52\]](https://api.sienge.com.br/docs/#:~:text=,Contratos%20de%20Vendas). Modelo **ContaCorrente**:  
\- **idConta** (Integer, PK)  
\- **descricao** (String): Nome da conta (ex: Banco X Conta 1234, Caixa Interno).  
\- **instituicao** (String): Nome do banco ou "Caixa Interno".  
\- **agencia** (String, se banco)  
\- **numeroConta** (String, se banco)  
\- **tipoConta** (String): Corrente, Poupança, Investimento, Caixa etc.  
\- **saldoInicial** (Decimal)  
\- **moeda** (String): Moeda (BRL).  
\- **ativa** (Boolean).

Essa tabela serve de referência para movimentos e saldos.

### **Saldo de Contas Correntes**

Recurso: **Saldo de Contas Correntes** – Fornece saldo atual das contas[\[53\]](https://api.sienge.com.br/docs/#:~:text=,Saldo%20Devedor%20Presente). Em vez de armazenar estaticamente (já temos saldo inicial e podemos calcular com movimentos), podemos atualizar periodicamente ou consultar via API. O modelo **ContaCorrente** já tem saldo inicial; podemos manter um campo **saldoAtual** que é atualizado conforme movimentos ou via sync da API.

### **Movimentos de Caixa e Bancos**

Recurso: **Movimentos de Caixa e Bancos** – Via Bulk, extrai todos os lançamentos de entrada/saída de dinheiro[\[54\]](https://api.sienge.com.br/docs/html-files/bulk-data-bank-movement-v1.html#:~:text=Movimentos%20de%20Caixa%20e%20Bancos,v1). Modelo **MovimentoFinanceiro**:  
\- **idMovimento** (Integer, PK)  
\- **idConta** (FK ContaCorrente)  
\- **dataMovimento** (DateTime)  
\- **descricao** (String): Descrição do movimento (ex: Pagamento NF 123, Recebimento Contrato X)  
\- **valor** (Decimal): Valor do movimento (positivo para crédito, negativo para débito, ou usar campo separado)  
\- **tipo** (String): "CRÉDITO" ou "DÉBITO" (ou indicar sinal pelo valor)  
\- **idTituloReceber** (FK opcional): Se origem de um título a receber recebido.  
\- **idTituloPagar** (FK opcional): Se refere a um pagamento efetuado.  
\- **conciliado** (Boolean): Se já conferido em extrato bancário, etc.

Essa tabela consolidará todos fluxos de caixa. A Bulk API pode ser utilizada para preencher essa tabela inicial e sincronizar regularmente.

### **Contas Contábeis (Chart of Accounts)**

Recurso: **Contas Contábeis** – O plano de contas contábil. A API de Contas Contábeis lista as contas contabilizadas[\[55\]](https://api.sienge.com.br/docs/html-files/accountancy-accounts-v1.html#:~:text=API%20de%20listagem%20de%20contas,%C2%B7%20Conta%20modificada%20%C2%B7%20Models). Modelo **ContaContabil**:  
\- **idContaContabil** (Integer, PK)  
\- **codigoConta** (String): Código da conta (geralmente numeração hierárquica).  
\- **nomeConta** (String): Nome da conta contábil.  
\- **tipoConta** (String): Ativo, Passivo, Receita, Despesa, etc (natureza contábil).  
\- **analitica** (Boolean): Se é conta analítica (sim, pode lançar valores) ou sintética (não lança).  
\- **idContaPai** (FK auto-relacionamento): Conta contábil pai (se sintética).

Será referenciada nos lançamentos contábeis. Provavelmente não diretamente usada nos endpoints transacionais além da listagem, mas importante para relatórios (Balancete, etc).

### **Lançamentos Contábeis (Accounting Entries)**

Recursos: **Lançamentos Contábeis (Contabilidade)** e **Lançamentos Contábeis (Integração Contábil)** – Representam as partidas contábeis registradas, seja diretamente (contabilidade) ou via integração de módulos[\[56\]](https://api.sienge.com.br/docs/#:~:text=,40). Modelo **LancamentoContabil**:  
\- **idLancamento** (Integer, PK)  
\- **dataLancamento** (Date)  
\- **numeroLote** (FK LoteContabil): Lote/batch ao qual pertence (ver próximo).  
\- **historico** (String): Histórico (descrição do lançamento).  
\- **valorDebito** (Decimal)  
\- **valorCredito** (Decimal)  
\- **idContaDebito** (FK ContaContabil, nullable se partida dupla for guardada separada)  
\- **idContaCredito** (FK ContaContabil, idem)

É comum ter _lançamento contábil_ subdividido em itens de débito e crédito. Podemos ter uma tabela **LancamentoContabilItem**: **idLancamento**, **idContaContabil**, **valor**, **tipo** (D/C). Mas como a API possivelmente fornece já a visão de partidas, mantemos simples ou adaptado conforme necessário.

### **Lotes Contábeis (Accounting Batches)**

Recurso: **Lotes Contábeis** – Conjuntos de lançamentos agrupados (ex: um lote por dia ou por origem)[\[57\]](https://api.sienge.com.br/docs/#:~:text=,44). Modelo **LoteContabil**:  
\- **idLote** (Integer, PK)  
\- **numeroLote** (String): Código do lote (geralmente numeração sequencial ou composta por data).  
\- **dataLote** (Date): Data de referência.  
\- **descricao** (String): Descrição do lote (ex: _Integração Contas a Pagar Jan/2025_).  
\- **origem** (String): Módulo ou origem (AP, AR, Folha, etc).  
\- **situacao** (String): Aberto, Fechado, Integrado.

Lançamentos contábeis referenciam seu lote. A API de integração contábil possivelmente insere lotes gerados pelos módulos.

### **Fechamento Contábil**

Recurso: **Fechamento Contábil** – Indica a execução do fechamento mensal/contábil[\[47\]](https://api.sienge.com.br/docs/#:~:text=,30). Pode não precisar tabela específica além de possivelmente flag em contas ou registro do último mês fechado. Se precisarmos: **FechamentoContabil** com **anoMes** e **dataExecucao**.

### **Balancete de Verificação**

Recurso: **Balancete de Verificação** – Gera um relatório de balancete. A API possivelmente retorna o balancete pronto (saldos por conta)[\[58\]](https://api.sienge.com.br/docs/#:~:text=,Bens%20m%C3%B3veis). Não vira tabela – mas os dados derivam de **ContaContabil** e saldos acumulados de **LancamentoContabil**. Podemos reproduzir via consulta se necessário.

### **Saldos Contábeis Consolidados**

Recurso: **Saldos Contábeis Consolidados por Centro de Custo** e **por Empresa** (Bulk)[\[59\]](https://api.sienge.com.br/docs/#:~:text=,84). Esses endpoints fornecem saldos acumulados de contas contábeis filtrados por centro de custo ou por empresa. Novamente, dados derivativos: combinam **LancamentoContabil** (valores) com **CentroCusto** ou empresas. Não armazenamos fixo, pois podemos calcular ou extrair sob demanda. Se necessário histórico, poderíamos ter **SaldoContabil** com dimensões (**idContaContabil**, **idCentroCusto**, **idEmpresa**, **periodo**, **saldo**), mas isso seria mais para data warehouse. No contexto transacional, não obrigatório.

### **Informe de Rendimentos \- Imposto de Renda**

Recurso: **Informe de Rendimentos** – Gera o informe anual de rendimentos pagos (por exemplo, a clientes que pagaram juros ou fornecedores que receberam, para IR). Baseia-se em **Títulos pagos** ao longo do ano. Não gera novas entidades além de compilar dados de pagamentos. Sem tabela adicional; apenas mencionamos que os dados viriam dos pagamentos registrados (por exemplo, total de juros pagos em 2024 a um cliente, etc.).

---

Com o mapeamento conceitual acima, cobrimos todos os recursos da API listados[\[60\]](https://api.sienge.com.br/docs/#:~:text=)[\[61\]](https://api.sienge.com.br/docs/#:~:text=,Contratos%20de%20Vendas) e suas estruturas de dados correspondentes. Abaixo fornecemos um exemplo de como esse modelo poderia ser definido em um **schema Prisma** (ORM Prisma para Node.js), em Português, incluindo campos e relacionamentos principais.

## Exemplo de schema.prisma

datasource db {  
 provider \= "postgresql"  
 url \= env("DATABASE_URL")  
}

generator client {  
 provider \= "prisma-client-js"  
}

// Empresas e cadastros gerais  
model Empresa {  
 idEmpresa Int @id @default(autoincrement())  
 nomeEmpresa String  
 cnpj String?  
 nomeFantasia String?  
 codigoEmpresa String?  
 ativo Boolean @default(true)  
 // Relacionamentos  
 empreendimentos Empreendimento\[\]  
 clientes Cliente\[\] @relation("EmpresaClientes")  
 // ... outros relacionamentos (títulos, etc)  
}

model Departamento {  
 idDepartamento Int @id @default(autoincrement())  
 nomeDepartamento String  
 codigoDepartamento String?  
 // Relacionamentos  
 // ex: títulos a pagar alocados  
 alocacoesDespesa TituloPagarDepartamento\[\]  
}

model CentroCusto {  
 idCentroCusto Int @id @default(autoincrement())  
 nomeCentroCusto String  
 codigoCentroCusto String?  
 ativo Boolean @default(true)  
 // Relacionamentos  
 alocacoesDespesa TituloPagarCentroCusto\[\]  
}

model Indexador {  
 idIndexador Int @id @default(autoincrement())  
 nomeIndexador String  
 descricao String?  
 periodicidade String?  
 valorAtual Decimal? @precision(18,6)  
 // Relacionamentos: contratos, títulos etc.  
 contratosVenda ContratoVenda\[\]  
 titulosReceber TituloReceber\[\]  
 titulosPagar TituloPagar\[\]  
}

model Parametro {  
 chave String @id  
 valor String  
 descricao String?  
}

model EstadoCivil {  
 idEstadoCivil Int @id @default(autoincrement())  
 descricao String  
 // Relacionamentos  
 clientes Cliente\[\]  
}

model Profissao {  
 idProfissao Int @id @default(autoincrement())  
 nomeProfissao String  
 codigoProfissao String?  
 clientes Cliente\[\] @relation("ProfissaoCliente")  
 conjuges Conjuge\[\] @relation("ProfissaoConjuge")  
}

model TipoCliente {  
 idTipoCliente Int @id @default(autoincrement())  
 descricao String  
 clientes Cliente\[\]  
}

model TipoImovel {  
 idTipoImovel Int @id @default(autoincrement())  
 descricao String  
 unidades UnidadeImobiliaria\[\]  
}

model TipoCondicaoPagamento {  
 idTipoCondPag Int @id @default(autoincrement())  
 descricao String  
 contratosVenda ContratoVenda\[\]  
}

model PlanoFinanceiro {  
 idPlanoFinanceiro Int @id @default(autoincrement())  
 nomePlano String  
 codigoPlano String?  
 tipo String? // Receita/Despesa  
 // Relacionamentos  
 titulosPagar TituloPagar\[\]  
 titulosReceber TituloReceber\[\]  
 alocacoesCCusto TituloPagarCentroCusto\[\]  
}

model DocumentoIdentificacao {  
 idDocumentoIdent String @id // códigos como "FFX", etc.  
 descricao String?  
 titulosReceber TituloReceber\[\]  
 titulosPagar TituloPagar\[\]  
}

model Municipio {  
 idMunicipio Int @id @default(autoincrement())  
 nome String  
 uf String  
 codigoIBGE String?  
 // Relacionamentos  
 enderecosCliente ClienteEndereco\[\]  
 enderecosCredor CredorEndereco\[\]  
}

// Clientes e relacionados  
model Cliente {  
 idCliente Int @id @default(autoincrement())  
 tipoCliente TipoCliente @relation(fields: \[idTipoCliente\], references: \[idTipoCliente\])  
 idTipoCliente Int  
 nomeCompleto String  
 nomeSocial String?  
 cpfCnpj String  
 rg String?  
 dataNascimento DateTime?  
 nacionalidade String?  
 email String?  
 estadoCivil EstadoCivil? @relation(fields: \[idEstadoCivil\], references: \[idEstadoCivil\])  
 idEstadoCivil Int?  
 profissao Profissao? @relation("ProfissaoCliente", fields: \[idProfissao\], references: \[idProfissao\])  
 idProfissao Int?  
 // cônjuge separado:  
 conjuge Conjuge? @relation(fields: \[idConjuge\], references: \[idConjuge\])  
 idConjuge Int?  
 ativo Boolean @default(true)  
 dataCadastro DateTime @default(now())  
 empresa Empresa? @relation("EmpresaClientes", fields: \[idEmpresa\], references: \[idEmpresa\])  
 idEmpresa Int?  
 // Relacionamentos \- telefones, enderecos, etc.  
 telefones ClienteTelefone\[\]  
 enderecos ClienteEndereco\[\]  
 rendas ClienteRenda\[\]  
 anexos ClienteAnexo\[\]  
 reservas ReservaUnidade\[\]  
 contratosVenda ContratoVenda\[\]  
 titulosReceber TituloReceber\[\]  
}

model ClienteTelefone {  
 idTelefone Int @id @default(autoincrement())  
 numero String  
 tipo String?  
 observacao String?  
 cliente Cliente @relation(fields: \[idCliente\], references: \[idCliente\])  
 idCliente Int  
}

model ClienteEndereco {  
 idEndereco Int @id @default(autoincrement())  
 logradouro String  
 numero String  
 complemento String?  
 bairro String?  
 cep String?  
 tipoEndereco String?  
 municipio Municipio? @relation(fields: \[idMunicipio\], references: \[idMunicipio\])  
 idMunicipio Int?  
 cliente Cliente @relation(fields: \[idCliente\], references: \[idCliente\])  
 idCliente Int  
}

model ClienteRenda {  
 idRenda Int @id @default(autoincrement())  
 descricaoRenda String  
 valorMensal Decimal @precision(18,2)  
 moeda String? @default("BRL")  
 comprovada Boolean?  
 cliente Cliente @relation(fields: \[idCliente\], references: \[idCliente\])  
 idCliente Int  
}

model ClienteAnexo {  
 idAnexo Int @id @default(autoincrement())  
 tipoDocumento String  
 urlArquivo String?  
 // se armazenar binário, ter campo Bytes  
 cliente Cliente @relation(fields: \[idCliente\], references: \[idCliente\])  
 idCliente Int  
}

model Conjuge {  
 idConjuge Int @id @default(autoincrement())  
 nomeCompleto String  
 cpf String?  
 rg String?  
 dataNascimento DateTime?  
 nacionalidade String?  
 email String?  
 profissao Profissao? @relation("ProfissaoConjuge", fields: \[idProfissao\], references: \[idProfissao\])  
 idProfissao Int?  
 cliente Cliente? @relation(fields: \[idCliente\], references: \[idCliente\])  
 idCliente Int? // assuming one-to-one from cliente side  
}

// Vendas (Unidades, Reservas, Contratos)  
model Empreendimento {  
 idEmpreendimento Int @id @default(autoincrement())  
 nome String  
 codigo String?  
 descricao String?  
 idEmpresa Int? // qual empresa é dona do empreendimento  
 empresa Empresa? @relation(fields: \[idEmpresa\], references: \[idEmpresa\])  
 // talvez localização (cidade, endereço da obra)  
 cidade String?  
 // Relacionamentos  
 unidades UnidadeImobiliaria\[\]  
 orcamentos OrcamentoObra\[\]  
 // etc: planejamentos, diário de obra, etc, que virão na seção de Obras  
}

model UnidadeImobiliaria {  
 idUnidade Int @id @default(autoincrement())  
 codigoUnidade String  
 empreendimento Empreendimento @relation(fields: \[idEmpreendimento\], references: \[idEmpreendimento\])  
 idEmpreendimento Int  
 tipoImovel TipoImovel @relation(fields: \[idTipoImovel\], references: \[idTipoImovel\])  
 idTipoImovel Int  
 bloco String?  
 andar Int?  
 areaPrivativa Decimal? @precision(10,2)  
 areaTotal Decimal? @precision(10,2)  
 valorTabela Decimal @precision(18,2)  
 valorMinimo Decimal? @precision(18,2)  
 statusUnidade String // Disponível, Reservada, Vendida...  
 reservas ReservaUnidade\[\]  
 contratoVenda ContratoVenda?  
}

model ReservaUnidade {  
 idReserva Int @id @default(autoincrement())  
 unidade UnidadeImobiliaria @relation(fields: \[idUnidade\], references: \[idUnidade\])  
 idUnidade Int  
 cliente Cliente @relation(fields: \[idCliente\], references: \[idCliente\])  
 idCliente Int  
 dataReserva DateTime @default(now())  
 validadeReserva DateTime?  
 statusReserva String? // Ativa, Expirada, etc  
 observacoes String?  
 contratoVenda ContratoVenda?  
}

model ContratoVenda {  
 idContrato Int @id @default(autoincrement())  
 numeroContrato String  
 cliente Cliente @relation(fields: \[idCliente\], references: \[idCliente\])  
 idCliente Int  
 unidade UnidadeImobiliaria @relation(fields: \[idUnidade\], references: \[idUnidade\])  
 idUnidade Int  
 dataContrato DateTime  
 valorContrato Decimal @precision(18,2)  
 indexador Indexador? @relation(fields: \[idIndexador\], references: \[idIndexador\])  
 idIndexador Int?  
 planoFinanceiro PlanoFinanceiro? @relation(fields: \[idPlanoFinanceiro\], references: \[idPlanoFinanceiro\])  
 idPlanoFinanceiro Int?  
 condicaoPagamento TipoCondicaoPagamento? @relation(fields: \[idTipoCondPag\], references: \[idTipoCondPag\])  
 idTipoCondPag Int?  
 entrada Decimal? @precision(18,2)  
 financiamento Decimal? @precision(18,2)  
 observacoes String?  
 statusContrato String  
 // Relacionamentos  
 titulosReceber TituloReceber\[\]  
 comissoes ComissaoVenda\[\]  
}

model ComissaoVenda {  
 idComissao Int @id @default(autoincrement())  
 contrato ContratoVenda @relation(fields: \[idContrato\], references: \[idContrato\])  
 idContrato Int  
 nomeCorretor String  
 percentual Decimal? @precision(5,2)  
 valorComissao Decimal @precision(18,2)  
 paga Boolean @default(false)  
 dataPagamento DateTime?  
}

// Contas a Receber  
model TituloReceber {  
 idTituloReceber Int @id @default(autoincrement())  
 contrato ContratoVenda? @relation(fields: \[idContrato\], references: \[idContrato\])  
 idContrato Int?  
 cliente Cliente @relation(fields: \[idCliente\], references: \[idCliente\])  
 idCliente Int  
 empresa Empresa? @relation(fields: \[idEmpresa\], references: \[idEmpresa\])  
 idEmpresa Int?  
 numeroDocumento String  
 documentoIdent DocumentoIdentificacao? @relation(fields: \[idDocumentoIdent\], references: \[idDocumentoIdent\])  
 idDocumentoIdent String?  
 dataEmissao DateTime  
 dataVencimento DateTime  
 valorOriginal Decimal @precision(18,2)  
 valorAtualizado Decimal? @precision(18,2)  
 indexador Indexador? @relation(fields: \[idIndexador\], references: \[idIndexador\])  
 idIndexador Int?  
 juros Decimal? @precision(18,2)  
 multa Decimal? @precision(18,2)  
 descontoConcedido Decimal? @precision(18,2)  
 valorPago Decimal? @precision(18,2)  
 dataPagamento DateTime?  
 status String  
 portador PortadorRecebimento? @relation(fields: \[idPortador\], references: \[idPortador\])  
 idPortador Int?  
}

model PortadorRecebimento {  
 idPortador Int @id @default(autoincrement())  
 descricao String  
 codigo String?  
 ativo Boolean @default(true)  
 titulosReceber TituloReceber\[\]  
}

// Contas a Pagar  
model TituloPagar {  
 idTituloPagar Int @id @default(autoincrement())  
 credor Credor @relation(fields: \[idCredor\], references: \[idCredor\])  
 idCredor Int  
 empresaDevedora Empresa? @relation(fields: \[idEmpresaDevedora\], references: \[idEmpresa\])  
 idEmpresaDevedora Int?  
 numeroDocumento String  
 documentoIdent DocumentoIdentificacao? @relation(fields: \[idDocumentoIdent\], references: \[idDocumentoIdent\])  
 idDocumentoIdent String?  
 dataEmissao DateTime  
 dataVencimento DateTime  
 valorOriginal Decimal @precision(18,2)  
 valorAtualizado Decimal? @precision(18,2)  
 indexador Indexador? @relation(fields: \[idIndexador\], references: \[idIndexador\])  
 idIndexador Int?  
 planoFinanceiro PlanoFinanceiro? @relation(fields: \[idPlanoFinanceiro\], references: \[idPlanoFinanceiro\])  
 idPlanoFinanceiro Int?  
 observacao String?  
 descontoObtido Decimal? @precision(18,2)  
 valorPago Decimal? @precision(18,2)  
 dataPagamento DateTime?  
 status String  
 // Relacionamentos  
 parcelas ParcelaTituloPagar\[\]  
 impostos TituloPagarImposto\[\]  
 alocacoesCentroCusto TituloPagarCentroCusto\[\]  
 alocacoesDepartamento TituloPagarDepartamento\[\]  
}

model ParcelaTituloPagar {  
 idParcela Int @id @default(autoincrement())  
 tituloPai TituloPagar @relation(fields: \[idTituloPagar\], references: \[idTituloPagar\])  
 idTituloPagar Int  
 numeroParcela Int  
 dataVencimentoParcela DateTime  
 valorParcela Decimal @precision(18,2)  
 valorPagoParcela Decimal? @precision(18,2)  
 dataPagamentoParcela DateTime?  
 statusParcela String  
}

model TituloPagarImposto {  
 idImposto Int @id @default(autoincrement())  
 titulo TituloPagar @relation(fields: \[idTituloPagar\], references: \[idTituloPagar\])  
 idTituloPagar Int  
 tipoImposto String  
 baseCalculo Decimal @precision(18,2)  
 aliquota Decimal @precision(5,2)  
 valorImposto Decimal @precision(18,2)  
 retido Boolean  
}

model TituloPagarCentroCusto {  
 // sem id próprio, relacionamento many-to-many com atributos  
 idTituloPagar Int  
 idCentroCusto Int  
 idPlanoFinanceiro Int  
 percentual Decimal? @precision(5,2)  
 valor Decimal? @precision(18,2)  
 titulo TituloPagar @relation(fields: \[idTituloPagar\], references: \[idTituloPagar\])  
 centro CentroCusto @relation(fields: \[idCentroCusto\], references: \[idCentroCusto\])  
 plano PlanoFinanceiro @relation(fields: \[idPlanoFinanceiro\], references: \[idPlanoFinanceiro\])  
 @@id(\[idTituloPagar, idCentroCusto, idPlanoFinanceiro\])  
}

model TituloPagarDepartamento {  
 idTituloPagar Int  
 idDepartamento Int  
 percentual Decimal? @precision(5,2)  
 valor Decimal? @precision(18,2)  
 titulo TituloPagar @relation(fields: \[idTituloPagar\], references: \[idTituloPagar\])  
 departamento Departamento @relation(fields: \[idDepartamento\], references: \[idDepartamento\])  
 @@id(\[idTituloPagar, idDepartamento\])  
}

// Fornecedores/Credores e Compras  
model Credor {  
 idCredor Int @id @default(autoincrement())  
 tipoCredor String?  
 nomeCredor String  
 cpfCnpj String  
 inscricaoEstadual String?  
 contato String?  
 telefoneContato String?  
 emailContato String?  
 ativo Boolean @default(true)  
 ehCorretor Boolean @default(false)  
 // Relacionamentos  
 enderecos CredorEndereco\[\]  
 contasBancarias CredorInfoBancaria\[\]  
 titulosPagar TituloPagar\[\]  
 pedidos PedidoCompra\[\]  
 contratosSuprimento ContratoSuprimento\[\]  
 notasFiscais NotaFiscalCompra\[\]  
 cotacoes CotacaoPreco\[\]  
}

model CredorEndereco {  
 idEndereco Int @id @default(autoincrement())  
 logradouro String  
 numero String  
 complemento String?  
 bairro String?  
 cep String?  
 municipio Municipio? @relation(fields: \[idMunicipio\], references: \[idMunicipio\])  
 idMunicipio Int?  
 credor Credor @relation(fields: \[idCredor\], references: \[idCredor\])  
 idCredor Int  
}

model CredorInfoBancaria {  
 idInfoBancaria Int @id @default(autoincrement())  
 credor Credor @relation(fields: \[idCredor\], references: \[idCredor\])  
 idCredor Int  
 banco String  
 agencia String  
 conta String  
 digitoConta String?  
 tipoConta String  
 nomeBeneficiario String?  
 cpfCnpjBeneficiario String?  
 ativa Boolean @default(true)  
}

model SolicitacaoCompra {  
 idSolicitacao Int @id @default(autoincrement())  
 numeroSolicitacao String  
 empresa Empresa? @relation(fields: \[idEmpresa\], references: \[idEmpresa\])  
 idEmpresa Int?  
 departamento Departamento? @relation(fields: \[idDepartamento\], references: \[idDepartamento\])  
 idDepartamento Int?  
 solicitante String  
 dataSolicitacao DateTime @default(now())  
 descricao String?  
 status String  
 itens SolicitacaoItem\[\]  
 pedido PedidoCompra?  
 cotacoes CotacaoPreco\[\]  
}

model SolicitacaoItem {  
 idSolicitacaoItem Int @id @default(autoincrement())  
 solicitacao SolicitacaoCompra @relation(fields: \[idSolicitacao\], references: \[idSolicitacao\])  
 idSolicitacao Int  
 descricaoItem String  
 quantidade Decimal @precision(18,4)  
 unidade String  
 justificativa String?  
}

model PedidoCompra {  
 idPedido Int @id @default(autoincrement())  
 numeroPedido String  
 solicitacao SolicitacaoCompra? @relation(fields: \[idSolicitacao\], references: \[idSolicitacao\])  
 idSolicitacao Int?  
 credor Credor @relation(fields: \[idCredor\], references: \[idCredor\])  
 idCredor Int  
 dataPedido DateTime  
 dataEntregaPrevista DateTime?  
 empreendimento Empreendimento? @relation(fields: \[idEmpreendimento\], references: \[idEmpreendimento\])  
 idEmpreendimento Int?  
 departamento Departamento? @relation(fields: \[idDepartamento\], references: \[idDepartamento\])  
 idDepartamento Int?  
 valorTotal Decimal @precision(18,2)  
 status String  
 itens PedidoItem\[\]  
 notasFiscais NotaFiscalCompra\[\]  
}

model PedidoItem {  
 idPedidoItem Int @id @default(autoincrement())  
 pedido PedidoCompra @relation(fields: \[idPedido\], references: \[idPedido\])  
 idPedido Int  
 descricaoItem String  
 quantidade Decimal @precision(18,4)  
 unidade String  
 precoUnitario Decimal @precision(18,4)  
 valorTotalItem Decimal @precision(18,2)  
}

model ContratoSuprimento {  
 idContratoSuprimento Int @id @default(autoincrement())  
 numeroContrato String  
 credor Credor @relation(fields: \[idCredor\], references: \[idCredor\])  
 idCredor Int  
 empreendimento Empreendimento? @relation(fields: \[idEmpreendimento\], references: \[idEmpreendimento\])  
 idEmpreendimento Int?  
 dataInicio DateTime  
 dataFim DateTime?  
 objeto String?  
 valorContrato Decimal @precision(18,2)  
 status String  
 medicoes MedicaoContrato\[\]  
 titulosPagar TituloPagar\[\] // titulos gerados deste contrato  
}

model MedicaoContrato {  
 idMedicao Int @id @default(autoincrement())  
 contrato ContratoSuprimento @relation(fields: \[idContratoSuprimento\], references: \[idContratoSuprimento\])  
 idContratoSuprimento Int  
 numeroMedicao Int  
 dataMedicao DateTime  
 percentualExecutado Decimal? @precision(5,2)  
 valorMedicao Decimal @precision(18,2)  
 aprovada Boolean @default(false)  
 tituloPagar TituloPagar?  
}

model CotacaoPreco {  
 idCotacao Int @id @default(autoincrement())  
 solicitacao SolicitacaoCompra @relation(fields: \[idSolicitacao\], references: \[idSolicitacao\])  
 idSolicitacao Int  
 credor Credor @relation(fields: \[idCredor\], references: \[idCredor\])  
 idCredor Int  
 dataCotacao DateTime  
 validaAte DateTime?  
 valorTotalCotado Decimal @precision(18,2)  
 condicoes String?  
 escolhida Boolean @default(false)  
 itens CotacaoItem\[\]  
}

model CotacaoItem {  
 idCotacaoItem Int @id @default(autoincrement())  
 cotacao CotacaoPreco @relation(fields: \[idCotacao\], references: \[idCotacao\])  
 idCotacao Int  
 descricaoItem String  
 quantidade Decimal @precision(18,4)  
 unidade String  
 precoUnitario Decimal @precision(18,4)  
 valorTotalItem Decimal @precision(18,2)  
}

// Notas fiscais  
model NotaFiscalCompra {  
 idNotaFiscal Int @id @default(autoincrement())  
 credor Credor @relation(fields: \[idCredor\], references: \[idCredor\])  
 idCredor Int  
 numeroNota String  
 serie String?  
 chaveAcesso String?  
 dataEmissao DateTime  
 valorTotal Decimal @precision(18,2)  
 pedido PedidoCompra? @relation(fields: \[idPedido\], references: \[idPedido\])  
 idPedido Int?  
 contratoSuprimento ContratoSuprimento? @relation(fields: \[idContratoSuprimento\], references: \[idContratoSuprimento\])  
 idContratoSuprimento Int?  
 status String  
}

// Patrimônio e Locação  
model BemImovel {  
 idBemImovel Int @id @default(autoincrement())  
 descricao String  
 endereco String?  
 valorAquisicao Decimal? @precision(18,2)  
 dataAquisicao DateTime?  
 vidaUtil Int?  
 valorContabil Decimal? @precision(18,2)  
 contratosLocacao ContratoLocacao\[\]  
}

model BemMovel {  
 idBemMovel Int @id @default(autoincrement())  
 descricao String  
 numeroPatrimonio String?  
 valorAquisicao Decimal? @precision(18,2)  
 dataAquisicao DateTime?  
 vidaUtil Int?  
 valorContabil Decimal? @precision(18,2)  
}

model ContratoLocacao {  
 idContratoLocacao Int @id @default(autoincrement())  
 bemImovel BemImovel @relation(fields: \[idBemImovel\], references: \[idBemImovel\])  
 idBemImovel Int  
 cliente Cliente @relation(fields: \[idCliente\], references: \[idCliente\])  
 idCliente Int  
 dataInicio DateTime  
 dataFim DateTime?  
 valorAluguel Decimal @precision(18,2)  
 periodicidadeReajuste String?  
 indexador Indexador? @relation(fields: \[idIndexador\], references: \[idIndexador\])  
 idIndexador Int?  
 garantia String?  
 ativo Boolean @default(true)  
 // títulos a receber gerados deste contrato de locação  
 // (poderíamos derivar via idContratoLocacao em TituloReceber se mantivéssemos campo)  
}

// Contas financeiras (bancárias e caixa)  
model ContaCorrente {  
 idConta Int @id @default(autoincrement())  
 descricao String  
 instituicao String?  
 agencia String?  
 numeroConta String?  
 tipoConta String  
 saldoInicial Decimal @precision(18,2) @default(0.0)  
 saldoAtual Decimal @precision(18,2)? // pode ser calculado ou atualizado  
 ativa Boolean @default(true)  
 movimentos MovimentoFinanceiro\[\]  
}

model MovimentoFinanceiro {  
 idMovimento Int @id @default(autoincrement())  
 conta ContaCorrente @relation(fields: \[idConta\], references: \[idConta\])  
 idConta Int  
 dataMovimento DateTime @default(now())  
 descricao String  
 valor Decimal @precision(18,2)  
 tipo String // "CRÉDITO" ou "DÉBITO"  
 idTituloReceber Int?  
 idTituloPagar Int?  
 conciliado Boolean @default(false)  
 // Podemos incluir relations to TituloReceber/Pagar if needed for cascade, but referencing by id is enough.  
}

// Contabilidade  
model ContaContabil {  
 idContaContabil Int @id @default(autoincrement())  
 codigoConta String  
 nomeConta String  
 tipoConta String  
 analitica Boolean @default(true)  
 contaPai ContaContabil? @relation("ContaContaPai", fields: \[idContaPai\], references: \[idContaContabil\])  
 idContaPai Int?  
 subContas ContaContabil\[\] @relation("ContaContaPai")  
 lancamentosDebito LancamentoContabilItem\[\] @relation("ContaDebito")  
 lancamentosCredito LancamentoContabilItem\[\] @relation("ContaCredito")  
}

model LancamentoContabil {  
 idLancamento Int @id @default(autoincrement())  
 dataLancamento DateTime  
 lote LoteContabil? @relation(fields: \[idLote\], references: \[idLote\])  
 idLote Int?  
 historico String  
 // Relação com itens  
 itens LancamentoContabilItem\[\]  
}

model LancamentoContabilItem {  
 idLancamento Int  
 idConta Int  
 tipo String // "D" ou "C"  
 valor Decimal @precision(18,2)  
 lancamento LancamentoContabil @relation(fields: \[idLancamento\], references: \[idLancamento\])  
 contaContabil ContaContabil @relation(fields: \[idConta\], references: \[idContaContabil\])  
 @@id(\[idLancamento, idConta, tipo\])  
}

model LoteContabil {  
 idLote Int @id @default(autoincrement())  
 numeroLote String  
 dataLote DateTime  
 descricao String?  
 origem String?  
 situacao String?  
 lancamentos LancamentoContabil\[\]  
}

_(O schema acima é ilustrativo, combinando todos os modelos mencionados. Dependendo das necessidades reais, algumas tabelas auxiliares poderiam ser ajustadas ou normalizadas de forma diferente. Porém, ele reflete fielmente o mapa de dados dos endpoints da API Sienge, incluindo todos os campos e relações essenciais para atender a integração.)_

**Fontes:** Este mapeamento foi construído com base na documentação pública da API Sienge[\[60\]](https://api.sienge.com.br/docs/#:~:text=)[\[61\]](https://api.sienge.com.br/docs/#:~:text=,Contratos%20de%20Vendas) e artigos de suporte relacionados que descrevem os recursos e campos (por exemplo, estrutura de clientes e cônjuge[\[20\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200640-apoio-clientes-como-alterar-o-cadastro-de-cliente-atrav%C3%A9s-de-api-#:~:text=dos%20c%C3%B4njuges%20vinculados%20a%20um,substitui%C3%A7%C3%A3o%C2%A0PUT%C2%A0conforme%20apresentado%20pela%20figura%20abaixo), payloads de títulos a pagar[\[62\]](https://docs.fluidapi.io/sienge#:~:text=000%2F0001%2003%60%20%7D%7D,natureza), endpoints de obras e integrações[\[63\]](https://ajuda.sienge.com.br/support/solutions/articles/153000245608--construpoint-integrac%C3%A3o-com-sienge-plataforma-parametrizac%C3%A3o#:~:text=)[\[64\]](https://suporteprevision.freshdesk.com/support/solutions/articles/153000240992-erro-de-permission-denied-#:~:text=,estimations%2F%7Bbuilding_id%7D%2Fsheets%2F%7Bbuilding_unit_id%7D%2Fitems), entre outros). Cada seção do modelo corresponde a endpoints documentados, garantindo que o desenvolvedor tenha um guia completo para implementar o esquema de banco de dados e o **schema.prisma** correspondente.

---

[\[1\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200200-api-rest-credores#:~:text=API%2C%C2%A0Application%C2%A0Programming%C2%A0Interface%20ou%20Interface%20de%20Programa%C3%A7%C3%A3o,a%C3%A7%C3%B5es%20que%20podem%20ser%20feitas) [\[37\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200200-api-rest-credores#:~:text=A%20API%20POST%C2%A0%2Fcreditors%2F%7BcreditorId%7D%2Fbank,conta%2C%20benefici%C3%A1rios%2C%20entre%20outras%20informa%C3%A7%C3%B5es) [\[38\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200200-api-rest-credores#:~:text=A%20API%C2%A0GET%C2%A0%2Fcreditors%2F%7BcreditorId%7D%2Fbank,da%20conta%2C%20entre%20outras%20informa%C3%A7%C3%B5es) API REST – Credores : Sienge Plataforma

[https://ajuda.sienge.com.br/support/solutions/articles/153000200200-api-rest-credores](https://ajuda.sienge.com.br/support/solutions/articles/153000200200-api-rest-credores)

[\[2\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200931-como-entender-a-documentac%C3%A3o-das-apis-#:~:text=Plataforma%20ajuda,recursos%20para%20transacionar%20um) Como entender a documentação das APIs? : Sienge Plataforma

[https://ajuda.sienge.com.br/support/solutions/articles/153000200931-como-entender-a-documentac%C3%A3o-das-apis-](https://ajuda.sienge.com.br/support/solutions/articles/153000200931-como-entender-a-documentac%C3%A3o-das-apis-)

[\[3\]](https://forum.xperiun.com/topic/359-conex%C3%A3o-com-apis-e-recursividade-sienge-api/#:~:text=Error%20fetching%20https%3A%2F%2Fforum.xperiun.com%2Ftopic%2F359) forum.xperiun.com

[https://forum.xperiun.com/topic/359-conex%C3%A3o-com-apis-e-recursividade-sienge-api/](https://forum.xperiun.com/topic/359-conex%C3%A3o-com-apis-e-recursividade-sienge-api/)

[\[4\]](https://ajuda.sienge.com.br/support/solutions/articles/153000245608--construpoint-integrac%C3%A3o-com-sienge-plataforma-parametrizac%C3%A3o#:~:text=7%20%E2%80%93%20Seguiremos%20com%20a,todos%20os%20listados%20a%20seguir) [\[63\]](https://ajuda.sienge.com.br/support/solutions/articles/153000245608--construpoint-integrac%C3%A3o-com-sienge-plataforma-parametrizac%C3%A3o#:~:text=) \[CONSTRUPOINT\] Integração com Sienge Plataforma \- Parametrização : Sienge Plataforma

[https://ajuda.sienge.com.br/support/solutions/articles/153000245608--construpoint-integrac%C3%A3o-com-sienge-plataforma-parametrizac%C3%A3o](https://ajuda.sienge.com.br/support/solutions/articles/153000245608--construpoint-integrac%C3%A3o-com-sienge-plataforma-parametrizac%C3%A3o)

[\[5\]](https://api.sienge.com.br/docs/html-files/company-v1.html#:~:text=,ResultSetMetadata) Empresas 1.0.0 \- Sienge Platform

[https://api.sienge.com.br/docs/html-files/company-v1.html](https://api.sienge.com.br/docs/html-files/company-v1.html)

[\[6\]](https://docs.fluidapi.io/sienge#:~:text=,teste%20do%20fluxo%20com%20o) [\[10\]](https://docs.fluidapi.io/sienge#:~:text=tostring%20,htmldate) [\[16\]](https://docs.fluidapi.io/sienge#:~:text=000%2F0001%2003%60%20%7D%7D,indexid) [\[30\]](https://docs.fluidapi.io/sienge#:~:text=,htmldate) [\[31\]](https://docs.fluidapi.io/sienge#:~:text=0%2C%20,default) [\[49\]](https://docs.fluidapi.io/sienge#:~:text=0%2C%20,costcenterid) [\[50\]](https://docs.fluidapi.io/sienge#:~:text=,teste%20do%20fluxo%20com%20o) [\[62\]](https://docs.fluidapi.io/sienge#:~:text=000%2F0001%2003%60%20%7D%7D,natureza) Sienge \- Docs Fluid

[https://docs.fluidapi.io/sienge](https://docs.fluidapi.io/sienge)

[\[7\]](https://suporteprevision.freshdesk.com/support/solutions/articles/153000240992-erro-de-permission-denied-#:~:text=,centers) [\[64\]](https://suporteprevision.freshdesk.com/support/solutions/articles/153000240992-erro-de-permission-denied-#:~:text=,estimations%2F%7Bbuilding_id%7D%2Fsheets%2F%7Bbuilding_unit_id%7D%2Fitems) Erro de "Permission denied" : Prevision

[https://suporteprevision.freshdesk.com/support/solutions/articles/153000240992-erro-de-permission-denied-](https://suporteprevision.freshdesk.com/support/solutions/articles/153000240992-erro-de-permission-denied-)

[\[8\]](https://api.sienge.com.br/docs/html-files/bulk-data-income-v1.html#:~:text=Parcelas%20do%20Contas%20a%20Receber,bills) Parcelas do Contas a Receber 1.0.0 \- Sienge Platform

[https://api.sienge.com.br/docs/html-files/bulk-data-income-v1.html](https://api.sienge.com.br/docs/html-files/bulk-data-income-v1.html)

[\[9\]](https://www.youtube.com/watch?v=1Iwju7XyC88#:~:text=Trabalhando%20com%20API%27s%20no%20Power,um%20conjunto%20de%20padr%C3%B5es) Trabalhando com API's no Power BI \- YouTube

[https://www.youtube.com/watch?v=1Iwju7XyC88](https://www.youtube.com/watch?v=1Iwju7XyC88)

[\[11\]](https://api.sienge.com.br/docs/html-files/professions-v1.html#:~:text=Profiss%C3%B5es,id%7D.%20Busca%20uma%20profiss%C3%A3o) [\[51\]](https://api.sienge.com.br/docs/html-files/professions-v1.html#:~:text=1.0.0.%20%5B%20Base%20URL%3A%20api.sienge.com.br%2F%7Bsubdominio,v1.yaml%3Ftimestamp%3D1756217773) API de profissões. \- Sienge

[https://api.sienge.com.br/docs/html-files/professions-v1.html](https://api.sienge.com.br/docs/html-files/professions-v1.html)

[\[12\]](https://api.sienge.com.br/docs/html-files/customer-types-v1.html#:~:text=Tipos%20de%20Clientes%201.0.0%20,v1) Tipos de Clientes 1.0.0 \- Sienge Platform

[https://api.sienge.com.br/docs/html-files/customer-types-v1.html](https://api.sienge.com.br/docs/html-files/customer-types-v1.html)

[\[13\]](https://api.sienge.com.br/docs/html-files/property-types-v1.html#:~:text=Busca%20uma%20lista%20de%20tipos,ResultSetMetadata) Tipo de Imóveis 1.0.0 \- Sienge Platform

[https://api.sienge.com.br/docs/html-files/property-types-v1.html](https://api.sienge.com.br/docs/html-files/property-types-v1.html)

[\[14\]](https://api.sienge.com.br/docs/html-files/payment-categories-v1.html#:~:text=Planos%20Financeiros%201,de%20planos%20financeiros%20%C2%B7%20Models) Planos Financeiros \- Sienge

[https://api.sienge.com.br/docs/html-files/payment-categories-v1.html](https://api.sienge.com.br/docs/html-files/payment-categories-v1.html)

[\[15\]](https://api.sienge.com.br/docs/html-files/document-identification-v1.html#:~:text=Platform%20api.sienge.com.br%20%201.0.0.%20,v1.yaml%3Ftimestamp) Documentos API para listagem de documentos \- Sienge Platform

[https://api.sienge.com.br/docs/html-files/document-identification-v1.html](https://api.sienge.com.br/docs/html-files/document-identification-v1.html)

[\[17\]](https://api.sienge.com.br/docs/html-files/customers-v1.html#:~:text=Clientes,cliente%20%C2%B7%20Anexos%20do%20cliente) Clientes 1.0.0 \- Sienge Platform

[https://api.sienge.com.br/docs/html-files/customers-v1.html](https://api.sienge.com.br/docs/html-files/customers-v1.html)

[\[18\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200640-apoio-clientes-como-alterar-o-cadastro-de-cliente-atrav%C3%A9s-de-api-#:~:text=) [\[19\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200640-apoio-clientes-como-alterar-o-cadastro-de-cliente-atrav%C3%A9s-de-api-#:~:text=Aten%C3%A7%C3%A3o%21%C2%A0%C2%A0O%20campo%C2%A0%E2%80%9Cnacionalidade%E2%80%9D%C2%A0passar%C3%A1%20a%20ficar%20na,por%20meio%20da%20estrutura%20atual) [\[20\]](https://ajuda.sienge.com.br/support/solutions/articles/153000200640-apoio-clientes-como-alterar-o-cadastro-de-cliente-atrav%C3%A9s-de-api-#:~:text=dos%20c%C3%B4njuges%20vinculados%20a%20um,substitui%C3%A7%C3%A3o%C2%A0PUT%C2%A0conforme%20apresentado%20pela%20figura%20abaixo) Apoio : Clientes \- Como alterar o cadastro de cliente através de API? : Sienge Plataforma

[https://ajuda.sienge.com.br/support/solutions/articles/153000200640-apoio-clientes-como-alterar-o-cadastro-de-cliente-atrav%C3%A9s-de-api-](https://ajuda.sienge.com.br/support/solutions/articles/153000200640-apoio-clientes-como-alterar-o-cadastro-de-cliente-atrav%C3%A9s-de-api-)

[\[21\]](https://api.sienge.com.br/docs/html-files/unit-v1.html#:~:text=API%20de%20Unidades%20de%20Im%C3%B3veis,unit) API de Unidades de Imóveis \- Sienge Platform

[https://api.sienge.com.br/docs/html-files/unit-v1.html](https://api.sienge.com.br/docs/html-files/unit-v1.html)

[\[22\]](https://api.sienge.com.br/docs/#:~:text=,69) [\[23\]](https://api.sienge.com.br/docs/#:~:text=%2A%20Sobre%20APIs%20Bulk) [\[24\]](https://api.sienge.com.br/docs/#:~:text=,Contas%20Cont%C3%A1beis) [\[26\]](https://api.sienge.com.br/docs/#:~:text=,Reservas%20de%20Unidades) [\[32\]](https://api.sienge.com.br/docs/#:~:text=,Hist%C3%B3rico%20de%20Notifica%C3%A7%C3%A3o%20de%20Cobran%C3%A7as) [\[33\]](https://api.sienge.com.br/docs/#:~:text=,mail%20%20%2A%20%2028) [\[34\]](https://api.sienge.com.br/docs/#:~:text=,Hist%C3%B3rico%20de%20Notifica%C3%A7%C3%A3o%20de%20Cobran%C3%A7as) [\[35\]](https://api.sienge.com.br/docs/#:~:text=,52) [\[36\]](https://api.sienge.com.br/docs/#:~:text=,Total) [\[40\]](https://api.sienge.com.br/docs/#:~:text=,Extrato%20Cliente%20Hist%C3%B3rico) [\[41\]](https://api.sienge.com.br/docs/#:~:text=,48) [\[42\]](https://api.sienge.com.br/docs/#:~:text=,36) [\[44\]](https://api.sienge.com.br/docs/#:~:text=,8) [\[46\]](https://api.sienge.com.br/docs/#:~:text=,42) [\[47\]](https://api.sienge.com.br/docs/#:~:text=,30) [\[52\]](https://api.sienge.com.br/docs/#:~:text=,Contratos%20de%20Vendas) [\[53\]](https://api.sienge.com.br/docs/#:~:text=,Saldo%20Devedor%20Presente) [\[56\]](https://api.sienge.com.br/docs/#:~:text=,40) [\[57\]](https://api.sienge.com.br/docs/#:~:text=,44) [\[58\]](https://api.sienge.com.br/docs/#:~:text=,Bens%20m%C3%B3veis) [\[59\]](https://api.sienge.com.br/docs/#:~:text=,84) [\[60\]](https://api.sienge.com.br/docs/#:~:text=) [\[61\]](https://api.sienge.com.br/docs/#:~:text=,Contratos%20de%20Vendas) Sienge Platform

[https://api.sienge.com.br/docs/](https://api.sienge.com.br/docs/)

[\[25\]](https://desenvolvedor.cvcrm.com.br/reference/distribuicaoleads#:~:text=API%20de%20Comiss%C3%B5es) Retorna a distribuição dos leads

[https://desenvolvedor.cvcrm.com.br/reference/distribuicaoleads](https://desenvolvedor.cvcrm.com.br/reference/distribuicaoleads)

[\[27\]](https://api.sienge.com.br/docs/html-files/bearers-receivable-v1.html#:~:text=Portadores%20para%20o%20Contas%20a,Portadores) Portadores para o Contas a Receber \- Sienge Platform

[https://api.sienge.com.br/docs/html-files/bearers-receivable-v1.html](https://api.sienge.com.br/docs/html-files/bearers-receivable-v1.html)

[\[28\]](https://ajuda.sienge.com.br/support/solutions/articles/153000241163-quais-alterac%C3%B5es-foram-realizadas-no-endpoint-de-antecipac%C3%A3o-de-parcelas-#:~:text=Quais%20altera%C3%A7%C3%B5es%20foram%20realizadas%20no,) Quais alterações foram realizadas no endpoint de Antecipação de ...

[https://ajuda.sienge.com.br/support/solutions/articles/153000241163-quais-alterac%C3%B5es-foram-realizadas-no-endpoint-de-antecipac%C3%A3o-de-parcelas-](https://ajuda.sienge.com.br/support/solutions/articles/153000241163-quais-alterac%C3%B5es-foram-realizadas-no-endpoint-de-antecipac%C3%A3o-de-parcelas-)

[\[29\]](https://api.sienge.com.br/docs/html-files/accounts-receivable-v1.html#:~:text=API%20de%20t%C3%ADtulos%20do%20contas,financeira%20do%20t%C3%ADtulo%20%C2%B7%20Models) API de títulos do contas a receber. \- Sienge Platform

[https://api.sienge.com.br/docs/html-files/accounts-receivable-v1.html](https://api.sienge.com.br/docs/html-files/accounts-receivable-v1.html)

[\[39\]](https://ajuda.sienge.com.br/support/solutions/articles/153000226969-apis-solicitac%C3%B5es-de-compra#:~:text=APIs%20,compra%20atrav%C3%A9s%20de%20seu%20ID) APIs \- Solicitações de compra \- Suporte : Sienge Plataforma

[https://ajuda.sienge.com.br/support/solutions/articles/153000226969-apis-solicitac%C3%B5es-de-compra](https://ajuda.sienge.com.br/support/solutions/articles/153000226969-apis-solicitac%C3%B5es-de-compra)

[\[43\]](https://api.sienge.com.br/docs/html-files/nfe-api-v1.html#:~:text=Notas%20Fiscais%20Eletr%C3%B4nicas%20de%20Produto,Schemes) Notas Fiscais Eletrônicas de Produto 1.0.0 \- Sienge

[https://api.sienge.com.br/docs/html-files/nfe-api-v1.html](https://api.sienge.com.br/docs/html-files/nfe-api-v1.html)

[\[45\]](https://api.sienge.com.br/docs/html-files/fixed-assets-v1.html#:~:text=Sienge%20Platform%201.0.%20,v1.yaml%3Ftimestamp%3D1753730655) Sienge Platform

[https://api.sienge.com.br/docs/html-files/fixed-assets-v1.html](https://api.sienge.com.br/docs/html-files/fixed-assets-v1.html)

[\[48\]](https://api.sienge.com.br/docs/html-files/bill-debt-v1.html#:~:text=T%C3%ADtulos%20a%20pagar,atualiza%C3%A7%C3%A3o%20de%20parcelas%20do%20t%C3%ADtulo) API de títulos do contas a pagar. \- Sienge Platform

[https://api.sienge.com.br/docs/html-files/bill-debt-v1.html](https://api.sienge.com.br/docs/html-files/bill-debt-v1.html)

[\[54\]](https://api.sienge.com.br/docs/html-files/bulk-data-bank-movement-v1.html#:~:text=Movimentos%20de%20Caixa%20e%20Bancos,v1) Movimentos de Caixa e Bancos 1.0.0 \- Sienge Platform

[https://api.sienge.com.br/docs/html-files/bulk-data-bank-movement-v1.html](https://api.sienge.com.br/docs/html-files/bulk-data-bank-movement-v1.html)

[\[55\]](https://api.sienge.com.br/docs/html-files/accountancy-accounts-v1.html#:~:text=API%20de%20listagem%20de%20contas,%C2%B7%20Conta%20modificada%20%C2%B7%20Models) API de listagem de contas contábeis \- Sienge Platform

[https://api.sienge.com.br/docs/html-files/accountancy-accounts-v1.html](https://api.sienge.com.br/docs/html-files/accountancy-accounts-v1.html)
