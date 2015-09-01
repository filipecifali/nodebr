// Aqui é onde a magia acontece :-)
import server from './lib/server';
import config from 'config';
import log from './lib/log';

let inst = null;

log.info('Iniciando bootstrap do servidor HTTP');
server.start()
  .then(i => {
    inst = i;
    log.log('info', 'Servidor iniciado com sucesso na porta %s e na interface' +
      ' %s', config.hapi.connection.port, config.hapi.connection.host);
  });

// Vamos escutar se o sistema manda o servidor parar
process.on(config.server.signal, () => {
  log.log('info', 'O servidor recebeu o sinal %s, iniciando parada',
    config.server.signal);

  // Enviamos a instância criada para o método stop
  server.stop(inst)
    .then(() => {
      log.log('Servidor parou, finalizando processo.');
      process.exit();
    });
});
