/**
 * Sienge Data Warehouse Community Connector para Looker Studio
 * Versão 3.0 - Com novos campos normalizados e otimizações
 * Conecta diretamente à API Master /api/datawarehouse/master
 */

// ============================================
// CONFIGURAÇÃO PRINCIPAL
// ============================================
var CONFIG = {
  // URL da API - IMPORTANTE: Atualizar para produção
  API_URL: 'https://conector.catometrics.com.br/api/datawarehouse/master',

  // Admins autorizados (adicione emails conforme necessário)
  ADMIN_EMAILS: [
    'darlan@catofe.com.br'
  ],

  // Cache settings (em segundos)
  CACHE_DURATION: 1800, // 30 minutos

  // Limite de registros por request
  MAX_RECORDS: 50000
};

// ============================================
// FUNÇÕES OBRIGATÓRIAS DO LOOKER STUDIO
// ============================================

/**
 * Define o tipo de autenticação
 */
function getAuthType() {
  return {
    type: 'NONE'
  };
}

/**
 * Configurações do usuário (vazio para máxima automação)
 */
function getConfig() {
  return {
    configParams: []
  };
}

/**
 * Schema dos dados com TODOS os novos campos normalizados
 */
function getSchema(request) {
  var fields = [
    // =====================================
    // 📅 GRUPO: DIMENSÕES TEMPORAIS
    // =====================================
    {
      name: 'data_principal',
      label: 'Data Principal',
      dataType: 'STRING',
      group: 'Data',
      semantics: {
        conceptType: 'DIMENSION',
        semanticGroup: 'DATE_AND_TIME',
        semanticType: 'YEAR_MONTH_DAY'
      }
    },
    {
      name: 'ano',
      label: 'Ano',
      dataType: 'STRING',
      group: 'Data',
      semantics: {
        conceptType: 'DIMENSION',
        semanticGroup: 'DATE_AND_TIME',
        semanticType: 'YEAR'
      }
    },
    {
      name: 'trimestre',
      label: 'Trimestre',
      dataType: 'NUMBER',
      group: 'Data',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'mes',
      label: 'Mês',
      dataType: 'STRING',
      group: 'Data',
      semantics: {
        conceptType: 'DIMENSION',
        semanticGroup: 'DATE_AND_TIME',
        semanticType: 'MONTH'
      }
    },
    {
      name: 'ano_mes',
      label: 'Ano-Mês',
      dataType: 'STRING',
      group: 'Data',
      semantics: {
        conceptType: 'DIMENSION',
        semanticGroup: 'DATE_AND_TIME',
        semanticType: 'YEAR_MONTH'
      }
    },
    {
      name: 'nome_mes',
      label: 'Nome do Mês',
      dataType: 'STRING',
      group: 'Data',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },

    // =====================================
    // 🏢 GRUPO: EMPRESAS
    // =====================================
    {
      name: 'empresa_nome',
      label: 'Nome da Empresa',
      dataType: 'STRING',
      group: 'Empresas',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'empresa_cidade',
      label: 'Cidade da Empresa',
      dataType: 'STRING',
      group: 'Empresas',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'empresa_estado',
      label: 'Estado da Empresa',
      dataType: 'STRING',
      group: 'Empresas',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'empresa_regiao',
      label: 'Região da Empresa',
      dataType: 'STRING',
      group: 'Empresas',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'empresa_cnpj',
      label: 'CNPJ da Empresa',
      dataType: 'STRING',
      group: 'Empresas',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },

    // =====================================
    // 📋 GRUPO: CONTRATOS
    // =====================================
    {
      name: 'valor_contrato',
      label: 'Valor do Contrato',
      dataType: 'NUMBER',
      group: 'Contratos',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'CURRENCY_BRL',
        isReaggregatable: false
      }
    },
    {
      name: 'status_contrato',
      label: 'Status do Contrato',
      dataType: 'STRING',
      group: 'Contratos',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'tipo_contrato',
      label: 'Tipo do Contrato',
      dataType: 'STRING',
      group: 'Contratos',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'numero_contrato',
      label: 'Número do Contrato',
      dataType: 'STRING',
      group: 'Contratos',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'contratos_ativos',
      label: 'Contratos Ativos',
      dataType: 'BOOLEAN',
      group: 'Contratos',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'chaves_entregues',
      label: 'Chaves Entregues',
      dataType: 'BOOLEAN',
      group: 'Contratos',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'contratos_assinados',
      label: 'Contratos Assinados',
      dataType: 'BOOLEAN',
      group: 'Contratos',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'contratos_cancelados',
      label: 'Contratos Cancelados',
      dataType: 'BOOLEAN',
      group: 'Contratos',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'faixa_valor_contrato',
      label: 'Faixa de Valor do Contrato',
      dataType: 'STRING',
      group: 'Contratos',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },

    // =====================================
    // 💰 GRUPO: FINANCEIRO
    // =====================================
    {
      name: 'saldo_devedor',
      label: 'Saldo Devedor',
      dataType: 'NUMBER',
      group: 'Financeiro',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'CURRENCY_BRL',
        isReaggregatable: false
      }
    },
    {
      name: 'forma_pagamento',
      label: 'Forma de Pagamento',
      dataType: 'STRING',
      group: 'Financeiro',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'taxa_juros',
      label: 'Taxa de Juros (%)',
      dataType: 'NUMBER',
      group: 'Financeiro',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'PERCENT'
      }
    },
    {
      name: 'total_parcelas',
      label: 'Total de Parcelas',
      dataType: 'NUMBER',
      group: 'Financeiro',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'parcelas_pagas',
      label: 'Parcelas Pagas',
      dataType: 'NUMBER',
      group: 'Financeiro',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'percentual_pago',
      label: 'Percentual Pago (%)',
      dataType: 'NUMBER',
      group: 'Financeiro',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'PERCENT'
      }
    },
    {
      name: 'tem_financiamento',
      label: 'Tem Financiamento',
      dataType: 'BOOLEAN',
      group: 'Financeiro',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'status_pagamento',
      label: 'Status de Pagamento',
      dataType: 'STRING',
      group: 'Financeiro',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },

    // =====================================
    // 💵 GRUPO: COMISSÕES (NOVO)
    // =====================================
    {
      name: 'tem_comissao',
      label: 'Tem Comissão',
      dataType: 'BOOLEAN',
      group: 'Comissoes',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'valor_comissao',
      label: 'Valor da Comissão',
      dataType: 'NUMBER',
      group: 'Comissoes',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'CURRENCY_BRL',
        isReaggregatable: false
      }
    },
    {
      name: 'faixa_valor_comissao',
      label: 'Faixa de Valor de Comissão',
      dataType: 'STRING',
      group: 'Comissoes',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'percentual_comissao',
      label: 'Percentual de Comissão (%)',
      dataType: 'NUMBER',
      group: 'Comissoes',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'PERCENT'
      }
    },

    // =====================================
    // 📊 GRUPO: PERFORMANCE
    // =====================================
    {
      name: 'margem_bruta',
      label: 'Margem Bruta (%)',
      dataType: 'NUMBER',
      group: 'Performance',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'PERCENT'
      }
    },

    // =====================================
    // 👤 GRUPO: CLIENTES
    // =====================================
    {
      name: 'cliente_principal',
      label: 'Cliente Principal',
      dataType: 'STRING',
      group: 'Clientes',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'quantidade_clientes',
      label: 'Quantidade de Clientes',
      dataType: 'NUMBER',
      group: 'Clientes',
      semantics: {
        conceptType: 'METRIC'
      }
    },

    // =====================================
    // 🏗️ GRUPO: EMPREENDIMENTOS
    // =====================================
    {
      name: 'empreendimento_nome',
      label: 'Nome do Empreendimento',
      dataType: 'STRING',
      group: 'Empreendimentos',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'empreendimento_tipo',
      label: 'Tipo do Empreendimento',
      dataType: 'STRING',
      group: 'Empreendimentos',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },

    // =====================================
    // 🏠 GRUPO: UNIDADES
    // =====================================
    {
      name: 'unidade_tipo',
      label: 'Tipo da Unidade',
      dataType: 'STRING',
      group: 'Unidades',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'unidade_area',
      label: 'Área da Unidade (m²)',
      dataType: 'NUMBER',
      group: 'Unidades',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'faixa_area',
      label: 'Faixa de Área',
      dataType: 'STRING',
      group: 'Unidades',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },

    // =====================================
    // 📈 GRUPO: INDICADORES TEMPORAIS (NOVO)
    // =====================================
    {
      name: 'dias_atraso_entrega',
      label: 'Dias de Atraso na Entrega',
      dataType: 'NUMBER',
      group: 'Indicadores',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'dias_desde_contrato',
      label: 'Dias Desde o Contrato',
      dataType: 'NUMBER',
      group: 'Indicadores',
      semantics: {
        conceptType: 'METRIC'
      }
    },

    // =====================================
    // 🔍 GRUPO: METADADOS
    // =====================================
    {
      name: 'domain_type',
      label: 'Tipo de Domínio',
      dataType: 'STRING',
      group: 'Metadados',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'unique_id',
      label: 'ID Único',
      dataType: 'STRING',
      group: 'Metadados',
      semantics: {
        conceptType: 'DIMENSION'
      }
    }
  ];

  return {
    schema: fields
  };
}

/**
 * Buscar dados da API
 */
function getData(request) {
  try {
    console.log('=== INÍCIO DA BUSCA DE DADOS ===');
    console.log('Campos solicitados:', request.fields.map(function(f) { return f.name; }));

    // Tentar usar cache primeiro
    var cache = CacheService.getUserCache();
    var cacheKey = 'sienge_data_' + Utilities.computeDigest(
      Utilities.DigestAlgorithm.MD5,
      JSON.stringify(request.fields)
    );

    var cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('✅ Dados encontrados no cache');
      var parsedCache = JSON.parse(cachedData);
      return parsedCache;
    }

    // Buscar dados da API
    console.log('📡 Buscando dados da API:', CONFIG.API_URL);

    var response = UrlFetchApp.fetch(CONFIG.API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Sienge-Looker-Connector/3.0'
      },
      muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
      console.error('❌ Erro na API:', response.getResponseCode());
      console.error('Resposta:', response.getContentText());
      throw new Error('API Error: ' + response.getResponseCode());
    }

    var jsonResponse = JSON.parse(response.getContentText());
    console.log('✅ API retornou sucesso:', jsonResponse.success);
    console.log('📊 Total de registros:', jsonResponse.data ? jsonResponse.data.length : 0);

    if (!jsonResponse.success || !jsonResponse.data) {
      console.error('❌ API sem dados:', jsonResponse);
      throw new Error('API returned no data: ' + (jsonResponse.message || 'Unknown error'));
    }

    var apiData = jsonResponse.data;

    // Limitar registros se necessário
    if (apiData.length > CONFIG.MAX_RECORDS) {
      console.log('⚠️ Limitando registros de', apiData.length, 'para', CONFIG.MAX_RECORDS);
      apiData = apiData.slice(0, CONFIG.MAX_RECORDS);
    }

    var requestedFieldIds = request.fields.map(function(field) {
      return field.name;
    });

    // Processar dados
    var rows = apiData.map(function(row) {
      return formatRowForLookerStudio(row, requestedFieldIds);
    });

    console.log('✅ Total de linhas processadas:', rows.length);

    var result = {
      schema: request.fields,
      rows: rows
    };

    // Salvar no cache
    try {
      cache.put(cacheKey, JSON.stringify(result), CONFIG.CACHE_DURATION);
      console.log('💾 Dados salvos no cache por', CONFIG.CACHE_DURATION, 'segundos');
    } catch (e) {
      console.error('⚠️ Erro ao salvar cache:', e);
    }

    return result;

  } catch (error) {
    console.error('❌ Erro ao buscar dados:', error);
    throw new Error('Erro ao buscar dados da API Sienge: ' + error.message);
  }
}

/**
 * Formatar dados para Looker Studio com TODOS os campos novos
 */
function formatRowForLookerStudio(row, requestedFieldIds) {
  var formattedRow = [];

  requestedFieldIds.forEach(function(fieldId) {
    var value = null;

    switch (fieldId) {
      // ===== DIMENSÕES TEMPORAIS =====
      case 'data_principal':
        if (row['data_principal']) {
          var dateStr = String(row['data_principal']).replace(/[-T]/g, '').substring(0, 8);
          value = dateStr.length >= 8 ? dateStr : null;
        }
        break;

      case 'ano':
        value = row['ano'] ? String(row['ano']) : null;
        break;

      case 'trimestre':
        value = row['trimestre'] || null;
        break;

      case 'mes':
        if (row['mes']) {
          var mesNum = parseInt(row['mes']);
          value = mesNum < 10 ? '0' + mesNum : String(mesNum);
        }
        break;

      case 'ano_mes':
        if (row['ano_mes']) {
          value = String(row['ano_mes']).replace(/-/g, '');
        }
        break;

      case 'nome_mes':
        value = row['nome_mes'] || null;
        break;

      // ===== EMPRESAS =====
      case 'empresa_nome':
        value = row['empresa_nome'] || '';
        break;

      case 'empresa_cidade':
        value = row['empresa_cidade'] || '';
        break;

      case 'empresa_estado':
        value = row['empresa_estado'] || '';
        break;

      case 'empresa_regiao':
        value = row['empresa_regiao'] || '';
        break;

      case 'empresa_cnpj':
        value = row['empresa_cnpj'] || '';
        break;

      // ===== CONTRATOS =====
      case 'valor_contrato':
        value = row['valor_contrato'] ? parseFloat(row['valor_contrato']) : 0;
        break;

      case 'status_contrato':
        value = row['status_contrato'] || '';
        break;

      case 'tipo_contrato':
        value = row['tipo_contrato'] || '';
        break;

      case 'numero_contrato':
        value = row['numero_contrato'] || '';
        break;

      case 'contratos_ativos':
        value = Boolean(row['contratos_ativos']);
        break;

      case 'chaves_entregues':
        value = Boolean(row['chaves_entregues']);
        break;

      case 'contratos_assinados':
        value = Boolean(row['contratos_assinados']);
        break;

      case 'contratos_cancelados':
        value = Boolean(row['contratos_cancelados']);
        break;

      case 'faixa_valor_contrato':
        value = row['faixa_valor_contrato'] || '';
        break;

      // ===== FINANCEIRO =====
      case 'saldo_devedor':
        value = row['saldo_devedor'] ? parseFloat(row['saldo_devedor']) : 0;
        break;

      case 'forma_pagamento':
        value = row['forma_pagamento'] || '';
        break;

      case 'taxa_juros':
        value = row['taxa_juros'] ? parseFloat(row['taxa_juros']) : 0;
        break;

      case 'total_parcelas':
        value = row['total_parcelas'] ? parseInt(row['total_parcelas']) : 0;
        break;

      case 'parcelas_pagas':
        value = row['parcelas_pagas'] ? parseInt(row['parcelas_pagas']) : 0;
        break;

      case 'percentual_pago':
        value = row['percentual_pago'] ? parseFloat(row['percentual_pago']) : 0;
        break;

      case 'tem_financiamento':
        value = Boolean(row['tem_financiamento']);
        break;

      case 'status_pagamento':
        value = row['status_pagamento'] || '';
        break;

      // ===== COMISSÕES (NOVO) =====
      case 'tem_comissao':
        value = Boolean(row['tem_comissao']);
        break;

      case 'valor_comissao':
        value = row['valor_comissao'] ? parseFloat(row['valor_comissao']) : 0;
        break;

      case 'faixa_valor_comissao':
        value = row['faixa_valor_comissao'] || '';
        break;

      case 'percentual_comissao':
        value = row['percentual_comissao'] ? parseFloat(row['percentual_comissao']) : 0;
        break;

      // ===== PERFORMANCE =====
      case 'margem_bruta':
        value = row['margem_bruta'] ? parseFloat(row['margem_bruta']) : 0;
        break;

      // ===== CLIENTES =====
      case 'cliente_principal':
        value = row['cliente_principal'] || '';
        break;

      case 'quantidade_clientes':
        value = row['quantidade_clientes'] ? parseInt(row['quantidade_clientes']) : 0;
        break;

      // ===== EMPREENDIMENTOS =====
      case 'empreendimento_nome':
        value = row['empreendimento_nome'] || '';
        break;

      case 'empreendimento_tipo':
        value = row['empreendimento_tipo'] || '';
        break;

      // ===== UNIDADES =====
      case 'unidade_tipo':
        value = row['unidade_tipo'] || '';
        break;

      case 'unidade_area':
        value = row['unidade_area'] ? parseFloat(row['unidade_area']) : 0;
        break;

      case 'faixa_area':
        value = row['faixa_area'] || '';
        break;

      // ===== INDICADORES (NOVO) =====
      case 'dias_atraso_entrega':
        value = row['dias_atraso_entrega'] ? parseInt(row['dias_atraso_entrega']) : null;
        break;

      case 'dias_desde_contrato':
        value = row['dias_desde_contrato'] ? parseInt(row['dias_desde_contrato']) : null;
        break;

      // ===== METADADOS =====
      case 'domain_type':
        value = row['domain_type'] || '';
        break;

      case 'unique_id':
        value = row['unique_id'] || '';
        break;

      default:
        value = null;
    }

    formattedRow.push(value);
  });

  return formattedRow;
}

/**
 * Verificar se usuário é admin
 */
function isAdminUser() {
  try {
    var userEmail = Session.getEffectiveUser().getEmail();
    console.log('Verificando acesso admin para:', userEmail);

    var isAdmin = CONFIG.ADMIN_EMAILS.indexOf(userEmail) !== -1;
    console.log('É admin?', isAdmin);

    return isAdmin;
  } catch (error) {
    console.error('Erro ao verificar usuário admin:', error);
    return false;
  }
}

/**
 * Função de teste para verificar conectividade
 */
function testConnection() {
  try {
    console.log('=== TESTE DE CONEXÃO ===');
    console.log('URL da API:', CONFIG.API_URL);

    var response = UrlFetchApp.fetch(CONFIG.API_URL);
    var data = JSON.parse(response.getContentText());

    console.log('✅ Resposta da API:', data.success);
    console.log('📊 Total de registros:', data.data ? data.data.length : 0);

    // Testar formatação com primeiro registro
    if (data.data && data.data.length > 0) {
      var firstRow = data.data[0];
      console.log('\n=== TESTE DE CAMPOS NOVOS ===');
      console.log('tem_comissao:', firstRow.tem_comissao);
      console.log('valor_comissao:', firstRow.valor_comissao);
      console.log('faixa_valor_comissao:', firstRow.faixa_valor_comissao);
      console.log('percentual_comissao:', firstRow.percentual_comissao);
      console.log('tem_financiamento:', firstRow.tem_financiamento);
      console.log('percentual_pago:', firstRow.percentual_pago);
      console.log('status_pagamento:', firstRow.status_pagamento);
      console.log('dias_desde_contrato:', firstRow.dias_desde_contrato);
    }

    return '✅ Conexão bem-sucedida! Versão 3.0 com campos normalizados';

  } catch (error) {
    console.error('❌ Erro na conexão:', error);
    return '❌ Erro na conexão: ' + error.message;
  }
}

/**
 * Função para debug - listar todos os campos disponíveis
 */
function debugAvailableFields() {
  try {
    var response = UrlFetchApp.fetch(CONFIG.API_URL);
    var data = JSON.parse(response.getContentText());

    if (data.data && data.data.length > 0) {
      var fields = Object.keys(data.data[0]);
      console.log('=== CAMPOS DISPONÍVEIS NA API ===');
      fields.forEach(function(field) {
        console.log('- ' + field + ': ' + typeof data.data[0][field]);
      });
      return fields;
    }
  } catch (error) {
    console.error('Erro ao listar campos:', error);
    return [];
  }
}