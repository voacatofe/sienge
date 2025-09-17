/**
 * Sienge Data Warehouse Community Connector para Looker Studio
 * Conecta diretamente à API Master unificada /api/datawarehouse/master
 * Grupos semânticos otimizados para análise no Looker Studio
 * Versão 2.0 - Alinhada com domínios reais
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

// 3. Schema dos dados (obrigatório) - estrutura baseada na API Master
function getSchema(request) {
  var fields = [
    // =====================================
    // 📅 GRUPO: DATA
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
        semanticType: 'CURRENCY_BRL'
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
        semanticType: 'CURRENCY_BRL'
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
    // ✅ GRUPO: CONVERSÕES
    // =====================================
    {
      name: 'contratos_cancelados',
      label: 'Contratos Cancelados',
      dataType: 'BOOLEAN',
      group: 'Conversoes',
      semantics: {
        conceptType: 'DIMENSION'
      }
    }
  ];

  return {
    schema: fields
  };
}

// 4. Buscar dados (obrigatório) - conecta à API Master
function getData(request) {
  try {
    console.log('Iniciando busca de dados...');
    console.log('Campos solicitados:', request.fields.map(function(f) { return f.name; }));

    // URL da API Master - todos os domínios unificados
    var API_URL = 'https://conector.catometrics.com.br/api/datawarehouse/master';

    // Buscar dados da API
    var response = UrlFetchApp.fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Sienge-Looker-Connector/2.0'
      },
      muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
      console.error('Erro na API:', response.getResponseCode());
      console.error('Resposta:', response.getContentText());
      throw new Error('API Error: ' + response.getResponseCode() + ' - ' + response.getContentText());
    }

    var jsonResponse = JSON.parse(response.getContentText());
    console.log('API retornou sucesso:', jsonResponse.success);
    console.log('Total de registros:', jsonResponse.data ? jsonResponse.data.length : 0);

    if (!jsonResponse.success || !jsonResponse.data) {
      console.error('API sem dados:', jsonResponse);
      throw new Error('API returned no data or error: ' + jsonResponse.message);
    }

    var apiData = jsonResponse.data;
    var requestedFieldIds = request.fields.map(function(field) {
      return field.name;
    });

    var rows = apiData.map(function(row) {
      return formatRowForLookerStudio(row, requestedFieldIds);
    });

    console.log('Total de linhas processadas:', rows.length);
    console.log('Amostra da primeira linha:', rows.length > 0 ? rows[0] : 'Sem dados');

    return {
      schema: request.fields,
      rows: rows
    };

  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Erro ao buscar dados da API Sienge Master: ' + error.message);
  }
}

// Função auxiliar para formatar dados para Looker Studio
function formatRowForLookerStudio(row, requestedFieldIds) {
  var formattedRow = [];

  requestedFieldIds.forEach(function(fieldId) {
    var value = null;

    // Mapear campos da API Master para o schema do Looker Studio
    switch (fieldId) {
      // Data
      case 'data_principal':
        // Formatar data para YYYYMMDD que o Looker Studio entende
        if (row['data_principal']) {
          // Remove hifens e pega apenas YYYYMMDD
          var dateStr = String(row['data_principal']).replace(/-/g, '').replace(/T.*/, '');
          value = dateStr.length >= 8 ? dateStr.substring(0, 8) : null;
          console.log('data_principal original:', row['data_principal'], '-> formatada:', value);
        } else {
          value = null;
        }
        break;
      case 'ano':
        // Converter para STRING como requerido pelo semantic type YEAR
        value = row['ano'] ? String(row['ano']) : null;
        break;
      case 'trimestre':
        value = row['trimestre'] || null;
        break;
      case 'mes':
        // Formatar mês com 2 dígitos como STRING
        if (row['mes']) {
          var mesNum = parseInt(row['mes']);
          value = mesNum < 10 ? '0' + mesNum : String(mesNum);
        } else {
          value = null;
        }
        break;
      case 'ano_mes':
        // Formatar para YYYYMM removendo o hífen
        if (row['ano_mes']) {
          value = String(row['ano_mes']).replace(/-/g, '');
          console.log('ano_mes original:', row['ano_mes'], '-> formatado:', value);
        } else {
          value = null;
        }
        break;
      case 'nome_mes':
        value = row['nome_mes'] || null;
        break;

      // Empresas
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

      // Contratos
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

      // Financeiro
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

      // Performance
      case 'margem_bruta':
        value = row['margem_bruta'] ? parseFloat(row['margem_bruta']) : 0;
        break;

      // Clientes
      case 'cliente_principal':
        value = row['cliente_principal'] || '';
        break;

      // Empreendimentos
      case 'empreendimento_nome':
        value = row['empreendimento_nome'] || '';
        break;
      case 'empreendimento_tipo':
        value = row['empreendimento_tipo'] || '';
        break;

      // Unidades
      case 'unidade_tipo':
        value = row['unidade_tipo'] || '';
        break;
      case 'unidade_area':
        value = row['unidade_area'] ? parseFloat(row['unidade_area']) : 0;
        break;
      case 'faixa_area':
        value = row['faixa_area'] || '';
        break;

      // Conversões
      case 'contratos_cancelados':
        value = Boolean(row['contratos_cancelados']);
        break;

      default:
        value = null;
    }

    formattedRow.push(value);
  });

  return formattedRow;
}

// Função de teste para verificar conectividade e formatação
function testConnection() {
  try {
    var API_URL = 'https://conector.catometrics.com.br/api/datawarehouse/master';
    var response = UrlFetchApp.fetch(API_URL);
    var data = JSON.parse(response.getContentText());

    console.log('✅ API Response:', data.success);
    console.log('📊 Records Found:', data.data ? data.data.length : 0);

    // Testar formatação de datas com primeiro registro
    if (data.data && data.data.length > 0) {
      var firstRow = data.data[0];
      console.log('\n📅 Teste de Formatação de Datas:');
      console.log('Original data_principal:', firstRow.data_principal);
      console.log('Formatado YYYYMMDD:', firstRow.data_principal ? String(firstRow.data_principal).replace(/-/g, '').substring(0, 8) : 'null');
      console.log('Original ano_mes:', firstRow.ano_mes);
      console.log('Formatado YYYYMM:', firstRow.ano_mes ? String(firstRow.ano_mes).replace(/-/g, '') : 'null');
      console.log('Ano como STRING:', String(firstRow.ano));
      console.log('Mês formatado:', firstRow.mes < 10 ? '0' + firstRow.mes : String(firstRow.mes));
    }

    return 'Connection successful! Version 2.0 - Master API with Date Formatting';
  } catch (error) {
    console.error('❌ Connection Error:', error);
    return 'Connection failed: ' + error.message;
  }
}