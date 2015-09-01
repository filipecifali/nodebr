// A partir do Hapi 9.x.x o envio de pastas e arquivos públicos passou
// a fazer parte de um plugin externo chamado inert
var inert = require('inert');
var log = require('../lib/log');

exports.register = function(server, options, next) {
  log.info('Carregando middleware inert');
  server.register(inert, next);
};

exports.register.attributes = {
  name: 'mongoose-mdlw',
  version: '1.0.0'
};
