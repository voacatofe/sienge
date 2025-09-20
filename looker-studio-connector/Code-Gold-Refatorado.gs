/**
 * Sienge Looker Studio Gold Connector (refatorado compacto)
 * Implementa agrupamentos (Field.setGroup) e datas YYYYMMDD conforme
 * https://developers.google.com/looker-studio/connector/reference
 */
var CONNECTOR = DataStudioApp.createCommunityConnector();
var TYPES = CONNECTOR.FieldType;
var AGG = CONNECTOR.AggregationType;

var SETTINGS = {
  baseUrl: 'https://conector.catometrics.com.br/api/datawarehouse/gold',
  cacheSeconds: 3600,
  maxRows: 10000,
  sampleLimit: 25,
  debug: false
};

var API_OPTIONS = {
  financeiro: { endpoint: '/financeiro', label: 'Financeiro', defaultDimension: 'data_principal', defaultMetric: 'valor_extrato', defaultLimit: 1000 },
  clientes:   { endpoint: '/clientes',   label: 'Clientes',   defaultDimension: 'data_principal', defaultMetric: 'valor_total_contratos', defaultLimit: 500 },
  vendas:     { endpoint: '/vendas',     label: 'Vendas',     defaultDimension: 'data_principal', defaultMetric: 'valor_venda_total', defaultLimit: 500 },
  portfolio:  { endpoint: '/portfolio',  label: 'Portfolio',  defaultDimension: 'data_principal', defaultMetric: 'valor_unidade', defaultLimit: 500 }
};

var VALUE_RESOLVERS = {
  yearFromDate: function(record) {
    var d = formatDateForLooker(record.data_principal);
    return d ? d.slice(0, 4) : null;
  },
  monthFromDate: function(record) {
    var d = formatDateForLooker(record.data_principal);
    return d ? d.slice(4, 6) : null;
  },
  yearMonthFromDate: function(record) {
    var d = formatDateForLooker(record.data_principal);
    return d ? d.slice(0, 6) : null;
  }
};

var FIELD_BLUEPRINT = {
  common: [
    ['data_principal','Data principal','Data base do registro','Date','YEAR_MONTH_DAY','date','dimension',{defaultDimension:true}],
    ['ano','Ano','Ano derivado da data','Date','YEAR','text','dimension',{valueFn:'yearFromDate'}],
    ['mes','Mes','Mes derivado da data','Date','MONTH','text','dimension',{valueFn:'monthFromDate'}],
    ['ano_mes','Ano-Mes','Ano e mes para agregacoes','Date','YEAR_MONTH','text','dimension',{valueFn:'yearMonthFromDate'}],
    ['unique_id','ID unico','Identificador unico do registro','Identification','TEXT','text','dimension',{}],
    ['domain_type','Dominio','Dominio de negocio','Identification','TEXT','text','dimension',{}]
  ],
  financeiro: [
    ['valor_extrato','Valor extrato','Valor conforme extrato bancario','Finance','CURRENCY_BRL','number','metric',{aggregation:'SUM',defaultMetric:true}],
    ['valor_apropriado','Valor apropriado','Valor apos apropriacao contabil','Finance','CURRENCY_BRL','number','metric',{aggregation:'SUM'}],
    ['total_lancamentos','Total lancamentos','Quantidade de lancamentos','Volume','NUMBER','integer','metric',{aggregation:'SUM'}],
    ['centro_custo_nome','Centro de custo','Centro de custo responsavel','Structure','TEXT','text','dimension',{}]
  ],
  clientes: [
    ['cliente_id','ID cliente','Identificador unico do cliente','Identification','NUMBER','integer','dimension',{}],
    ['nome_completo','Nome cliente','Nome completo do cliente','Identification','TEXT','text','dimension',{}],
    ['valor_total_contratos','Valor total contratos','Soma dos contratos do cliente','Finance','CURRENCY_BRL','number','metric',{aggregation:'SUM',defaultMetric:true}],
    ['ativo','Ativo','Cliente ativo','Status','BOOLEAN','boolean','dimension',{}]
  ],
  vendas: [
    ['contrato_id','ID contrato','Identificador do contrato','Contract','NUMBER','integer','dimension',{}],
    ['valor_venda_total','Valor venda total','Valor total da venda','Finance','CURRENCY_BRL','number','metric',{aggregation:'SUM',defaultMetric:true}],
    ['percentual_pago','Percentual pago','Percentual do contrato pago','Installments','PERCENT','percent','metric',{aggregation:'AVG'}],
    ['data_contrato','Data contrato','Data de assinatura do contrato','Dates','YEAR_MONTH_DAY','date','dimension',{}]
  ],
  portfolio: [
    ['unidade_id','ID unidade','Identificador da unidade','Unit','NUMBER','integer','dimension',{}],
    ['valor_unidade','Valor unidade','Valor de venda da unidade','Value','CURRENCY_BRL','number','metric',{aggregation:'SUM',defaultMetric:true}],
    ['score_atratividade','Score atratividade','Score de atratividade 0-10','Quality','NUMBER','number','metric',{aggregation:'AVG'}],
    ['tem_contrato_vinculado','Tem contrato','Unidade vinculada a contrato','Status','BOOLEAN','boolean','dimension',{}]
  ]
};

function getAuthType() {
  return { type: 'NONE' };
}

function isAdminUser() {
  return true;
}

function getConfig(request) {
  var config = CONNECTOR.getConfig();
  var select = config.newSelectSingle()
    .setId('api_source')
    .setName('Fonte de dados Gold')
    .setHelpText('Escolha qual conjunto de dados deseja usar.')
    .setAllowOverride(true);

  for (var key in API_OPTIONS) {
    if (API_OPTIONS.hasOwnProperty(key)) {
      select.addOption(config.newOptionBuilder().setLabel(API_OPTIONS[key].label).setValue(key));
    }
  }

  config.newCheckbox()
    .setId('use_cache')
    .setName('Usar cache de 1 hora')
    .setHelpText('Mantem os dados no CacheService por ate 1 hora.')
    .setAllowOverride(true);

  config.setDateRangeRequired(true);
  config.setIsSteppedConfig(false);
  return config.build();
}

function getSchema(request) {
  var apiKey = resolveApiKey(request);
  var defs = buildDefinitions(apiKey);
  var fields = buildFieldSchema(defs, API_OPTIONS[apiKey]);
  return { schema: fields.build() };
}

function getData(request) {
  var apiKey = resolveApiKey(request);
  var defs = buildDefinitions(apiKey);
  var option = API_OPTIONS[apiKey];
  var schemaBuilder = buildFieldSchema(defs, option);
  var requestedIds = (request.fields || []).map(function(field) { return field.name; });
  if (!requestedIds.length) {
    requestedIds = defs.map(function(def) { return def.id; });
  }
  var schema = schemaBuilder.forIds(requestedIds).build();
  var fieldOrder = schema.map(function(field) { return field.name; });

  var queryInfo = buildQueryInfo(request, option);
  var apiResult = fetchApiData(apiKey, queryInfo, shouldUseCache(request));
  var rows = buildRows(apiResult.data || [], fieldOrder, defs);

  var response = { schema: schema, rows: rows };
  if (apiResult.nextPageToken) {
    response.nextPageToken = apiResult.nextPageToken;
  }
  return response;
}

function resolveApiKey(request) {
  var params = request && request.configParams ? request.configParams : {};
  return API_OPTIONS.hasOwnProperty(params.api_source) ? params.api_source : 'financeiro';
}

function buildDefinitions(apiKey) {
  var base = FIELD_BLUEPRINT.common.concat(FIELD_BLUEPRINT[apiKey] || []);
  return base.map(function(entry) {
    var options = entry[7] || {};
    var def = {
      id: entry[0],
      name: entry[1],
      description: entry[2],
      group: entry[3],
      type: TYPES[entry[4]],
      valueType: entry[5],
      role: entry[6],
      aggregationKey: options.aggregation || null,
      defaultDimension: !!options.defaultDimension,
      defaultMetric: !!options.defaultMetric,
      valueFn: options.valueFn ? VALUE_RESOLVERS[options.valueFn] : null,
      path: options.path || entry[0]
    };
    if (def.role === 'metric' && def.aggregationKey) {
      def.aggregation = AGG[def.aggregationKey];
    }
    return def;
  });
}

function buildFieldSchema(defs, option) {
  var fields = CONNECTOR.getFields();
  defs.forEach(function(def) {
    var builder = def.role === 'metric' ? fields.newMetric() : fields.newDimension();
    builder.setId(def.id).setName(def.name).setDescription(def.description).setType(def.type);
    if (def.group) {
      builder.setGroup(def.group);
    }
    if (def.aggregation) {
      builder.setAggregation(def.aggregation);
    }
  });
  var metrics = defs.filter(function(d) { return d.role === 'metric'; });
  var defaultDimension = option.defaultDimension || defs[0].id;
  var defaultMetric = option.defaultMetric || (metrics.length ? metrics[0].id : null);
  fields.setDefaultDimension(defaultDimension);
  if (defaultMetric) {
    fields.setDefaultMetric(defaultMetric);
  }
  return fields;
}

function buildRows(records, fieldOrder, defs) {
  var defIndex = {};
  defs.forEach(function(def) { defIndex[def.id] = def; });
  return records.map(function(record) {
    var values = fieldOrder.map(function(id) {
      var def = defIndex[id];
      if (!def) {
        return null;
      }
      var raw = def.valueFn ? def.valueFn(record) : readValue(record, def.path);
      return coerceValue(def, raw);
    });
    return { values: values };
  });
}

function readValue(record, path) {
  if (!record || !path) {
    return null;
  }
  var segments = String(path).split('.');
  var current = record;
  for (var i = 0; i < segments.length; i++) {
    if (current == null) {
      return null;
    }
    current = current[segments[i]];
  }
  return current === undefined ? null : current;
}

function coerceValue(def, value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  switch (def.valueType) {
    case 'date':
      return formatDateForLooker(value);
    case 'number':
      return toNumber(value);
    case 'integer':
      var num = toNumber(value);
      return num === null ? null : Math.round(num);
    case 'percent':
      var pct = toNumber(value);
      if (pct === null) { return null; }
      return pct > 1 ? pct / 100 : pct;
    case 'boolean':
      return toBoolean(value);
    default:
      return String(value);
  }
}

function shouldUseCache(request) {
  var params = request && request.configParams ? request.configParams : {};
  if (params.hasOwnProperty('use_cache')) {
    return params.use_cache === true || params.use_cache === 'true';
  }
  return true;
}

function buildQueryInfo(request, option) {
  var sample = request.scriptParams && request.scriptParams.sampleExtraction;
  var limit = sample ? SETTINGS.sampleLimit : (request.pageSize || option.defaultLimit || SETTINGS.sampleLimit);
  limit = Math.min(limit, SETTINGS.maxRows);
  var offset = request.pageToken ? parseInt(request.pageToken, 10) : 0;
  if (isNaN(offset) || offset < 0) {
    offset = 0;
  }
  var params = ['limit=' + limit];
  if (offset > 0) {
    params.push('offset=' + offset);
  }
  if (request.dateRange && request.dateRange.startDate && request.dateRange.endDate) {
    var normalized = normalizeDateRange(request.dateRange);
    if (normalized) {
      params.push('data_inicio=' + normalized.start);
      params.push('data_fim=' + normalized.end);
    }
  }
  return { query: params.join('&'), limit: limit, offset: offset };
}

function normalizeDateRange(range) {
  var start = formatDateForApi(range.startDate);
  var end = formatDateForApi(range.endDate);
  if (!start || !end) {
    return null;
  }
  return { start: start, end: end };
}

function fetchApiData(apiKey, queryInfo, useCache) {
  var option = API_OPTIONS[apiKey];
  var url = SETTINGS.baseUrl + option.endpoint + (queryInfo.query ? '?' + queryInfo.query : '');
  var cacheKey = 'gold:' + apiKey + ':' + Utilities.base64Encode(url).substring(0, 80);
  if (useCache) {
    var cache = CacheService.getScriptCache();
    var cached = cache.get(cacheKey);
    if (cached) {
      try {
        var parsed = JSON.parse(cached);
        parsed.nextPageToken = getNextPageToken(parsed.data, queryInfo);
        return parsed;
      } catch (err) {
        logDebug('Falha ao ler cache: ' + err);
      }
    }
  }
  var response = UrlFetchApp.fetch(url, {
    method: 'get',
    muteHttpExceptions: true,
    headers: { 'Accept': 'application/json', 'User-Agent': 'Sienge-Looker-Connector/2025' }
  });
  if (response.getResponseCode() !== 200) {
    throwConnectorError('Erro HTTP ' + response.getResponseCode() + ' ao consultar ' + option.label);
  }
  var payload;
  try {
    payload = JSON.parse(response.getContentText());
  } catch (err) {
    throwConnectorError('Resposta invalida da API Gold.');
  }
  if (payload && payload.success === false) {
    throwConnectorError(payload.message || payload.error || 'Erro desconhecido da API.');
  }
  var result = {
    data: Array.isArray(payload && payload.data) ? payload.data : [],
    nextPageToken: getNextPageToken(payload && payload.data, queryInfo)
  };
  if (useCache) {
    try {
      CacheService.getScriptCache().put(cacheKey, JSON.stringify({ data: result.data }), SETTINGS.cacheSeconds);
    } catch (err) {
      logDebug('Falha ao salvar cache: ' + err);
    }
  }
  return result;
}

function getNextPageToken(data, queryInfo) {
  if (!Array.isArray(data) || data.length < queryInfo.limit) {
    return null;
  }
  var nextOffset = queryInfo.offset + data.length;
  if (nextOffset >= SETTINGS.maxRows) {
    return null;
  }
  return String(nextOffset);
}

function formatDateForLooker(value) {
  if (!value && value !== 0) {
    return null;
  }
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, 'UTC', 'yyyyMMdd');
  }
  var text = String(value).trim();
  if (!text) {
    return null;
  }
  var digits = text.replace(/[^0-9]/g, '');
  if (digits.length >= 8) {
    var candidate = digits.slice(0, 8);
    if (isValidDate(candidate)) {
      return candidate;
    }
  }
  var fallback = new Date(text.replace('T', ' ').replace('Z', ''));
  if (!isNaN(fallback.getTime())) {
    return Utilities.formatDate(fallback, 'UTC', 'yyyyMMdd');
  }
  return null;
}

function formatDateForApi(value) {
  var normalized = formatDateForLooker(value);
  if (!normalized) {
    return null;
  }
  return normalized.slice(0, 4) + '-' + normalized.slice(4, 6) + '-' + normalized.slice(6, 8);
}

function isValidDate(yyyymmdd) {
  if (!yyyymmdd || yyyymmdd.length !== 8) {
    return false;
  }
  var year = parseInt(yyyymmdd.slice(0, 4), 10);
  var month = parseInt(yyyymmdd.slice(4, 6), 10) - 1;
  var day = parseInt(yyyymmdd.slice(6, 8), 10);
  var date = new Date(Date.UTC(year, month, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day;
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'number') {
    return isFinite(value) ? value : null;
  }
  var text = String(value).trim();
  if (!text) {
    return null;
  }
  var normalized = text.replace(/\s+/g, '');
  if (normalized.indexOf(',') > -1 && normalized.indexOf('.') > -1) {
    normalized = normalized.replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
  } else if (normalized.indexOf(',') > -1) {
    normalized = normalized.replace(',', '.');
  }
  var parsed = Number(normalized);
  return isFinite(parsed) ? parsed : null;
}

function toBoolean(value) {
  if (value === true || value === false) {
    return value;
  }
  var text = String(value).trim().toLowerCase();
  return ['true','1','s','sim','y','yes'].indexOf(text) !== -1;
}

function throwConnectorError(message) {
  CONNECTOR.newUserError().setText(message).throwException();
}

function logDebug(message) {
  if (SETTINGS.debug) {
    console.log('[GOLD] ' + message);
  }
}
