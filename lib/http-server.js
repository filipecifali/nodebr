import Hapi from 'hapi';
import bluebird from 'bluebird';

/**
 * HTTP server wrapper for Hapi
 */
class HttpServer {

  /**
   * Constructs HttpServer
   *
   * @param {Object[]} [plugins] An array of plugins to be injected into Hapi
   * @param {Number} [port=8080] The port where the server will be listening
   * @param {String} [host=localhost]
   */
  constructor(plugins = [], port = 8080, host = 'localhost') {

    /**
     * Holds the server instance for future usage
     * @type {Object}
     */
    this._instance = null;

    /**
     * Keep the default configuration
     * @type {Object}
     */
    this._config = {
      plugins: plugins,
      port: 8080,
      host: host
    };
  }

  /**
   * Register all plugins, spins the server and binds it to the port/interface
   * @return {Promise} A promise that is resolved when the server is online
   */
  start() {
    return bluebird.resolve().then(() => {
      if (this._instance) {
        throw new Error('The server is already running');
      }

      var defer = bluebird.defer();

      this._instance = new Hapi.Server();
      this._instance.connection({
        host: this._config.host,
        port: this._config.port
      });

      this._instance.register([].concat(this._config.plugins), err => {
        if (err) {
          return defer.reject(err);
        }

        this._instance.start(err => {
          if(err){
            return defer.reject(err);
          }

          defer.resolve();
        });
      });

      return defer.promise;
    });
  }

  /**
   * Unbind the server and shutdown it
   * @return {Promise} A promise that is resolved when the server is offline
   */
  stop() {
    return bluebird.resolve().then(() => {
      if (!this._instance) {
        throw new Error('The server is not running');
      }

      let defer = bluebird.defer();

      this._instance.stop(err => {
        if (err) {
          return defer.reject(err);
        }

        this._instance = null;
        defer.resolve();
      });

      return defer.promise;
    });
  }
}

export
default HttpServer;
