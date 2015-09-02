// Aqui é onde a magia acontece :-)
import HttpServer from './lib/http-server';
import config from 'config';
import log from './lib/log';
import middlewares from './middlewares';
import controlelrs from './controllers';

let {host, port} = config.hapi.connection;
let plugins = middlewares.concat(controlelrs);
let server = new HttpServer(plugins, port, host);

log.info('Iniciando servidor http');
server.start()
  .then(() => log.info(`Servidor iniciado em http://${host}:${port}`));

// Vamos escutar se o sistema manda o servidor parar
process.on(config.server.signal, () => {
  log.info(`Sinal de parada ${config.server.signal} recebido`);

  // Enviamos a instância criada para o método stop
  server.stop()
    .then(() => {
      log.info('Servidor HTTP parou, até mais!');
      process.exit();
    });
});
