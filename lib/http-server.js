import Hapi from 'hapi';
import bluebird from 'bluebird';

/**
 * Classe responsável por gerenciar servidores HTTP 
 */
class HttpServer {

  /**
   * Constrói a classe HttpServer
   *
   * @param {Object[]} [plugins] Uma array com todos os plugins a serem
   * incluidos na instancia do servidor
   * @param {Number} [port=8080] A porta ao qual esta instancia estará
   * escutando por requisições
   * @param {String} [host=localhost] Em qual interface escutar por requisições
   */
  constructor(plugins = [], port = 8080, host = 'localhost') {
    /**
     * Guarda o servidor quando o mesmo está operando 
     * @type {Object}
     */
    this._instance = null;

    /**
     * Configurações da instancia
     * @type {Object}
     */
    this._config = {
      plugins: plugins,
      port: 8080,
      host: host
    };
  }

  /**
   * Inicia a instancia e binda o servidor à porta e host selecionados
   */
  start() {
    return bluebird.method(() => {
     if(this._instance)
      throw new Error('Este servidor já está rodando');
 
     var defer = bluebird.defer();

     this._instance = new Hapi.Server();
     this._instance.connection({
       host: this._config.host,
       port: this._config.port
     });

     this._instance.register(this._config.plugins, err => {
       if(err)
         return defer.reject(err);

       this._instance.start(defer.callback);
     });

     return defer.promise; 
    })();
  }

  /**
   * Para a instancia e libera a porta que estava sendo utilizada
   */
  stop() {
    return bluebird.method(() => {
      if(!this._instance)
        throw new Error('O servidor não está rodando');

      var defer = bluebird.defer();
      
      this._instance.stop(err => {
        if(err)
          return defer.reject(err);

        this._instance = null;
        defer.resolve();
      });

      return defer.promise;
    })();
  }
}

export default HttpServer;
