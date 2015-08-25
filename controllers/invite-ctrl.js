// API para controle de invites do Slack
var Joi = require('joi');
var log = require('../lib/log');
var config = require('config');
var Boom = require('boom');
var client = require('request-promise');

exports.register = function(server, options, next) {

  // Envia a nossa página inicial
  server.route({
    method: 'POST',
    path: '/api/v1/invite',
    handler: function(request, reply) {
      client.post(config.slack.endpoint + '/users.admin.invite', {
        form: {
          token: config.slack.token,
          email: request.payload.email
        }
      })
        .then(function() {
          reply({
            success: true
          }).code(201);
        })
        .catch(function(err) {
          log.log('error', 'Ocorreu um erro ao requisitar um invite %s',
            err.message, err.stack);
          reply(Boom.wrap(err));
        });
    },
    config: {
      validate: {
        payload: {
          email: Joi.string().email().required()
        }
      }
    }
  });

  next();
};

exports.register.attributes = {
  name: 'invite-ctrl',
  version: '1.0.0'
};
