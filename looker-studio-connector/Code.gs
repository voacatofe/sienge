/**
 * Sienge Data Warehouse Community Connector para Looker Studio
 * Conecta diretamente à API Master unificada /api/datawarehouse/master
 * Acesso a todos os domínios: contratos, financeiro, movimentos
 * Sem autenticação necessária - acesso automático
 */

// 1. Tipo de autenticação (obrigatório)
function getAuthType() {
  return {
    type: 'NONE'
  };
}

// 2. Configurações do usuário (obrigatório) - vazio para máxima automação
function getConfig() {
  return {
    configParams: []
  };
}

// 3. Schema dos dados (obrigatório) - estrutura baseada na sua API
function getSchema(request) {
  var fields = [
    // Dimensões Temporais
    {
      name: 'data_principal',
      label: 'Data Principal',
      dataType: 'STRING',
      group: 'Data',
      semantics: {
        conceptType: 'DIMENSION',
        semanticType: 'YEAR_MONTH_DAY'
      }
    },
    {
      name: 'ano',
      label: 'Ano',
      dataType: 'NUMBER',
      group: 'Tempo de Venda',
      semantics: {
        conceptType: 'DIMENSION',
        semanticType: 'YEAR'
      }
    },
    {
      name: 'trimestre',
      label: 'Trimestre',
      dataType: 'STRING',
      group: 'Tempo de Venda',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'mes',
      label: 'Mês',
      dataType: 'NUMBER',
      group: 'Mês',
      semantics: {
        conceptType: 'DIMENSION',
        semanticType: 'MONTH'
      }
    },
    {
      name: 'ano_mes',
      label: 'Ano-Mês',
      dataType: 'STRING',
      group: 'Mês',
      semantics: {
        conceptType: 'DIMENSION',
        semanticType: 'YEAR_MONTH'
      }
    },
    {
      name: 'nome_mes',
      label: 'Nome do Mês',
      dataType: 'STRING',
      group: 'Mês',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },

    // Dimensões Geográficas
    {
      name: 'empresa_regiao',
      label: 'Região da Empresa',
      dataType: 'STRING',
      group: 'Região da Empresa',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'empresa_estado',
      label: 'Estado da Empresa',
      dataType: 'STRING',
      group: 'Estado da Empresa',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'empresa_cidade',
      label: 'Cidade da Empresa',
      dataType: 'STRING',
      group: 'Cidade da Empresa',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'empresa_nome',
      label: 'Nome da Empresa',
      dataType: 'STRING',
      group: 'Nome da Empresa',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },

    // Dimensões de Negócio
    {
      name: 'empreendimento_nome',
      label: 'Nome do Empreendimento',
      dataType: 'STRING',
      group: 'Nome do Empreendimento',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'empreendimento_tipo',
      label: 'Tipo do Empreendimento',
      dataType: 'STRING',
      group: 'Tipo de Contrato',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'unidade_tipo',
      label: 'Tipo da Unidade',
      dataType: 'STRING',
      group: 'Tipo da Unidade',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'unidade_faixa_area',
      label: 'Faixa de Área da Unidade',
      dataType: 'STRING',
      group: 'Faixa de Área da Unidade',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cliente_principal',
      label: 'Cliente Principal',
      dataType: 'STRING',
      group: 'Cliente Principal',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },

    // Métricas de Performance
    {
      name: 'performance_valor_contrato',
      label: 'Valor do Contrato',
      dataType: 'NUMBER',
      group: 'Performance - Valor Contrato',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'CURRENCY_BRL'
      }
    },
    {
      name: 'performance_valor_venda_total',
      label: 'Valor Total de Venda',
      dataType: 'NUMBER',
      group: 'Performance - Valor Venda Total',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'CURRENCY_BRL'
      }
    },
    {
      name: 'performance_valor_por_m2',
      label: 'Valor por M²',
      dataType: 'NUMBER',
      group: 'Performance - Valor por M²',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'CURRENCY_BRL'
      }
    },
    {
      name: 'performance_margem_bruta_percent',
      label: 'Margem Bruta (%)',
      dataType: 'NUMBER',
      group: 'Performance - Margem Bruta (%)',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'PERCENT'
      }
    },
    {
      name: 'performance_tempo_venda_dias',
      label: 'Tempo de Venda (dias)',
      dataType: 'NUMBER',
      group: 'Performance - Tempo Venda (dias)',
      semantics: {
        conceptType: 'METRIC'
      }
    },

    // Métricas de Conversão
    {
      name: 'conversions_status_contrato',
      label: 'Status do Contrato',
      dataType: 'STRING',
      group: 'Conversões - Status Contrato',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'conversions_contratos_ativos',
      label: 'Contratos Ativos',
      dataType: 'BOOLEAN',
      group: 'Conversões - Contratos Ativos',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'conversions_contratos_cancelados',
      label: 'Contratos Cancelados',
      dataType: 'BOOLEAN',
      group: 'Conversões - Contratos Cancelados',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'conversions_chaves_entregues',
      label: 'Chaves Entregues',
      dataType: 'BOOLEAN',
      group: 'Chaves Entregues',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'conversions_contratos_assinados',
      label: 'Contratos Assinados',
      dataType: 'BOOLEAN',
      group: 'Contratos Assinados',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },

    // Métricas Financeiras
    {
      name: 'financial_desconto_percent',
      label: 'Desconto (%)',
      dataType: 'NUMBER',
      group: 'Desconto (%)',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'PERCENT'
      }
    },
    {
      name: 'financial_valor_desconto',
      label: 'Valor do Desconto',
      dataType: 'NUMBER',
      group: 'Desconto (%)',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'CURRENCY_BRL'
      }
    },
    {
      name: 'financial_forma_pagamento',
      label: 'Forma de Pagamento',
      dataType: 'STRING',
      group: 'Forma de Pagamento',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'financial_taxa_juros_percent',
      label: 'Taxa de Juros (%)',
      dataType: 'NUMBER',
      group: 'Taxa de Juros (%)',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'PERCENT'
      }
    },
    {
      name: 'financial_total_parcelas',
      label: 'Total de Parcelas',
      dataType: 'NUMBER',
      group: 'Total de Parcelas',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'financial_saldo_devedor',
      label: 'Saldo Devedor',
      dataType: 'NUMBER',
      group: 'Saldo Devedor',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'CURRENCY_BRL'
      }
    },

    // Métricas de Segmentação
    {
      name: 'segmentation_faixa_valor',
      label: 'Faixa de Valor',
      dataType: 'STRING',
      group: 'Faixa de Valor',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'segmentation_canal_venda',
      label: 'Canal de Venda',
      dataType: 'STRING',
      group: 'Canal de Venda',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'segmentation_tipo_contrato',
      label: 'Tipo de Contrato',
      dataType: 'STRING',
      semantics: {
        conceptType: 'DIMENSION'
      }
    }
  ];

  return {
    schema: fields
  };
}

// 4. Buscar dados (obrigatório) - conecta à sua API
function getData(request) {
  try {
    // URL da sua API - substitua pelo domínio correto
    var API_URL = 'https://conector.catometrics.com.br/api/datawarehouse/master?domain=contratos';

    // Buscar dados da API
    var response = UrlFetchApp.fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Sienge-Looker-Connector/1.0'
      },
      muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
      throw new Error('API Error: ' + response.getResponseCode() + ' - ' + response.getContentText());
    }

    var jsonResponse = JSON.parse(response.getContentText());

    if (!jsonResponse.success || !jsonResponse.data) {
      throw new Error('API returned no data or error: ' + jsonResponse.message);
    }

    var apiData = jsonResponse.data;
    var requestedFieldIds = request.fields.map(function(field) {
      return field.name;
    });

    var rows = apiData.map(function(row) {
      return formatRowForLookerStudio(row, requestedFieldIds);
    });

    return {
      schema: request.fields,
      rows: rows
    };

  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Erro ao buscar dados da API Sienge: ' + error.message);
  }
}

// Função auxiliar para formatar dados para Looker Studio
function formatRowForLookerStudio(row, requestedFieldIds) {
  var formattedRow = [];

  requestedFieldIds.forEach(function(fieldId) {
    var value = null;

    switch (fieldId) {
      // Dimensões Temporais
      case 'data_contrato':
        value = row['data_contrato'] || null;
        break;
      case 'ano':
        value = row['ano'] || null;
        break;
      case 'trimestre':
        value = row['trimestre'] || null;
        break;
      case 'mes':
        value = row['mes'] || null;
        break;
      case 'ano_mes':
        value = row['ano_mes'] || null;
        break;
      case 'nome_mes':
        value = row['nome_mes'] || null;
        break;

      // Dimensões Geográficas
      case 'empresa_regiao':
        value = row['empresa_regiao'] || null;
        break;
      case 'empresa_estado':
        value = row['empresa_estado'] || null;
        break;
      case 'empresa_cidade':
        value = row['empresa_cidade'] || null;
        break;
      case 'empresa_nome':
        value = row['empresa_nome'] || null;
        break;

      // Dimensões de Negócio
      case 'empreendimento_nome':
        value = row['empreendimento_nome'] || null;
        break;
      case 'empreendimento_tipo':
        value = row['empreendimento_tipo'] || null;
        break;
      case 'unidade_tipo':
        value = row['unidade_tipo'] || null;
        break;
      case 'unidade_faixa_area':
        value = row['unidade_faixa_area'] || null;
        break;
      case 'cliente_principal':
        value = row['cliente_principal'] || null;
        break;

      // Métricas de Performance
      case 'performance_valor_contrato':
        value = parseFloat(row['Performance — Valor Contrato']) || 0;
        break;
      case 'performance_valor_venda_total':
        value = parseFloat(row['Performance — Valor Venda Total']) || 0;
        break;
      case 'performance_valor_por_m2':
        value = parseFloat(row['Performance — Valor por M²']) || 0;
        break;
      case 'performance_margem_bruta_percent':
        value = parseFloat(row['Performance — Margem Bruta (%)']) || 0;
        break;
      case 'performance_tempo_venda_dias':
        value = parseFloat(row['Performance — Tempo Venda (dias)']) || 0;
        break;

      // Métricas de Conversão
      case 'conversions_status_contrato':
        value = row['Conversions — Status Contrato'] || null;
        break;
      case 'conversions_contratos_ativos':
        value = Boolean(row['Conversions — Contratos Ativos']);
        break;
      case 'conversions_contratos_cancelados':
        value = Boolean(row['Conversions — Contratos Cancelados']);
        break;
      case 'conversions_chaves_entregues':
        value = Boolean(row['Conversions — Chaves Entregues']);
        break;
      case 'conversions_contratos_assinados':
        value = Boolean(row['Conversions — Contratos Assinados']);
        break;

      // Métricas Financeiras
      case 'financial_desconto_percent':
        value = parseFloat(row['Financial — Desconto (%)']) || 0;
        break;
      case 'financial_valor_desconto':
        value = parseFloat(row['Financial — Valor Desconto']) || 0;
        break;
      case 'financial_forma_pagamento':
        value = row['Financial — Forma Pagamento'] || null;
        break;
      case 'financial_taxa_juros_percent':
        value = parseFloat(row['Financial — Taxa Juros (%)']) || 0;
        break;
      case 'financial_total_parcelas':
        value = parseInt(row['Financial — Total Parcelas']) || 0;
        break;
      case 'financial_saldo_devedor':
        value = parseFloat(row['Financial — Saldo Devedor']) || 0;
        break;

      // Métricas de Segmentação
      case 'segmentation_faixa_valor':
        value = row['Segmentation — Faixa Valor'] || null;
        break;
      case 'segmentation_canal_venda':
        value = row['Segmentation — Canal Venda'] || null;
        break;
      case 'segmentation_tipo_contrato':
        value = row['Segmentation — Tipo Contrato'] || null;
        break;

      default:
        value = null;
    }

    formattedRow.push(value);
  });

  return formattedRow;
}

// Função de teste para verificar conectividade
function testConnection() {
  try {
    var API_URL = 'https://conector.catometrics.com.br/api/datawarehouse/master?domain=contratos';
    var response = UrlFetchApp.fetch(API_URL);
    var data = JSON.parse(response.getContentText());

    console.log('✅ API Response:', data.success);
    console.log('📊 Records Found:', data.data ? data.data.length : 0);
    console.log('📈 Metadata:', data.metadata);

    return 'Connection successful!';
  } catch (error) {
    console.error('❌ Connection Error:', error);
    return 'Connection failed: ' + error.message;
  }
}