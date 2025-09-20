/**
 * Teste Isolado de Grupos - Looker Studio Connector
 * Para verificar se setGroup() funciona corretamente
 */

var cc = DataStudioApp.createCommunityConnector();

/**
 * Teste básico de grupo
 */
function testBasicGroup() {
  console.log('=== TESTE BÁSICO DE GRUPO ===');

  try {
    var fields = cc.getFields();
    var types = cc.FieldType;

    // Criar campos com grupos
    fields.newDimension()
      .setId('campo_temporal')
      .setName('Campo Temporal')
      .setType(types.TEXT)
      .setGroup('📅 Temporal');

    fields.newDimension()
      .setId('campo_identificacao')
      .setName('Campo Identificação')
      .setType(types.TEXT)
      .setGroup('🔑 Identificação');

    fields.newMetric()
      .setId('valor_teste')
      .setName('Valor Teste')
      .setType(types.NUMBER)
      .setGroup('💰 Valores');

    var schema = fields.build();
    console.log('Schema construído com', schema.length, 'campos');

    // Verificar grupos
    var grupos = {};
    for (var i = 0; i < schema.length; i++) {
      var campo = schema[i];
      console.log('Campo:', campo.name, 'Grupo:', campo.group || 'SEM GRUPO');

      if (campo.group) {
        grupos[campo.group] = (grupos[campo.group] || 0) + 1;
      }
    }

    console.log('\nResumo dos grupos:');
    for (var grupo in grupos) {
      console.log('- ' + grupo + ': ' + grupos[grupo] + ' campo(s)');
    }

    if (Object.keys(grupos).length > 0) {
      console.log('✅ setGroup() está funcionando!');
      return true;
    } else {
      console.log('❌ setGroup() NÃO está funcionando');
      return false;
    }

  } catch (e) {
    console.log('❌ Erro:', e.toString());
    return false;
  }
}

/**
 * Função de configuração mínima
 */
function getConfig() {
  var config = cc.getConfig();

  config.newInfo()
    .setId('info')
    .setText('Teste de Grupos');

  return config.build();
}

/**
 * Função de schema com grupos
 */
function getSchema() {
  var fields = cc.getFields();
  var types = cc.FieldType;

  // Campos com diferentes grupos
  fields.newDimension()
    .setId('data_campo')
    .setName('Data')
    .setType(types.YEAR_MONTH_DAY)
    .setDescription('Campo de data')
    .setGroup('📅 Temporal');

  fields.newDimension()
    .setId('id_campo')
    .setName('ID')
    .setType(types.NUMBER)
    .setDescription('Campo de identificação')
    .setGroup('🔑 Identificação');

  fields.newMetric()
    .setId('valor_campo')
    .setName('Valor')
    .setType(types.CURRENCY_BRL)
    .setDescription('Campo de valor')
    .setGroup('💰 Valores');

  return { schema: fields.build() };
}

/**
 * Autenticação (não requerida)
 */
function getAuthType() {
  return cc.newAuthTypeResponse()
    .setAuthType(cc.AuthType.NONE)
    .build();
}

/**
 * Dados mockados (não funcional)
 */
function getData(request) {
  return {
    schema: getSchema().schema,
    rows: []
  };
}