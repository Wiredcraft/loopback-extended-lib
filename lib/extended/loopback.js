'use strict';

const lib = require('../');
const Promise = require('bluebird');
const loopback = require('loopback');

module.exports = createApplication;

/**
 * Create a loopback application.
 *
 * @see node_modules/loopback/lib/loobpack.js
 */
function createApplication(options) {

  // A new app.
  const app = loopback(options);

  // Extending dataSource().
  app._dataSource = app.dataSource;

  /**
   * So that the config can be a function.
   */
  app.dataSource = function(name, config) {
    let dataSource;
    if (typeof config === 'function') {
      dataSource = this._dataSource.call(this, name, config(this));
    } else {
      dataSource = this._dataSource.call(this, name, config);
    }
    // Extend dataSource.
    return lib.extended.dataSource(dataSource);
  };

  /**
   * Shortcut. We need this so it can be tested.
   */
  app.boot = function(callback) {
    // The result of boot() is cached with a promise.
    if (this._boot == null) {
      this._boot = lib.extended.boot(this, options);
    }
    return this._boot.asCallback(callback);
  };

  /**
   * Shortcut. Disconnect all data sources.
   *
   * TODO: move to the `datasource` plugin?
   */
  app.disconnectAll = function disconnectAll(callback) {
    let disconnecting = {};
    for (let name in this.dataSources) {
      const dataSource = this.dataSources[name];
      const realName = dataSource.settings.name;
      if (realName != null && disconnecting[realName] == null) {
        disconnecting[realName] = dataSource.ensureDisconnect();
      }
    }
    return Promise.props(disconnecting).asCallback(callback);
  };

  /**
   * Give the plugins a chance to close or cleanup things.
   */
  app.close = function(callback) {
    // `context` is referenced by our extended `boot`.
    const context = Object.assign({}, this.context, {
      phases: ['close']
    });
    // return Promise.resolve(context.bootstrapper.run(context)).asCallback(callback);
    return this.disconnectAll().then(() => {
      return context.bootstrapper.run(context);
    }).asCallback(callback);
  };

  /**
   * Shortcut. Disconnect all data sources and then reboot app.
   */
  app.reboot = function reboot(callback) {
    return this.close().then(() => {
      this._boot = null;
      return this.boot();
    }).asCallback(callback);
  };

  return app;
}
