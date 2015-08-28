var Joi = require('joi');
var badge = require('../lib/badge');
var bluebird = require('bluebird');
var cache = require('memory-cache');
var log = require('../lib/log');
var config = require('config');
var Boom = require('boom');
var client = require('request-promise');
var gm = require('gm').subClass({
  imageMagick: true
});

// Mimetype mapping
var mimes = {
  png: 'image/png',
  jpg: 'image/jpg',
  svg: 'image/svg+xml'
};

exports.register = function(server, options, next) {

  // Envia a nossa página inicial
  server.route({
    method: 'GET',
    path: '/api/v1/badge/users',
    handler: function(request, reply) {

      // Verifica se a imagem está em cache
      var cached = cache.get('badge.' + request.query.type);
      if (cached)
        return reply(cached).type(mimes[request.query.type]);

      console.log(cached);

      client.get(config.slack.endpoint + '/rtm.start', {
        qs: {
          token: config.slack.token,
          simple_latest: 1,
          no_unreads: 1
        },
        json: true
      })
        .then(function(res) {

          // Conta o total de pessoas
          var total = res.users.length;
          var online = res.users.filter(function(member) {
            return member.presence !== 'away';
          }).length;

          // Cria o SVG e tranforma em imagem estática
          return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>' +
            badge(total, online).toHTML();
        })
        .then(function(svg) {
          // Se a requisição pedir por SVG, apenas avançamos
          // para o próximo passo
          if (request.query.type === 'svg')
            return svg;

          // Cria uma imagem a partir do SVG
          var def = bluebird.defer();

          gm(new Buffer(svg), 'badge.svg')
            .options({
              imageMagick: true
            })
            .setFormat(request.query.type)
            .toBuffer(def.callback);

          return def.promise;
        })
        .then(function(image) {
          // Guarda a imagem em cache
          cache.put('badge.' + request.query.type, image, 60000);

          // Responde
          reply(image)
            .type(mimes[request.query.type]);
        })
        .catch(function(err) {
          log.log('error', 'Erro ao gerar a badge %s', err.message, err.stack);
          reply(Boom.wrap(err));
        });
    },
    config: {
      validate: {
        query: {
          type: Joi.only(['svg', 'png', 'jpg']).default('png')
        }
      }
    }
  });

  next();
};

exports.register.attributes = {
  name: 'badge-ctrl',
  version: '1.0.0'
};
