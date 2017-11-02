'use strict';

const debug = require('debug')('loopback:extended:app');

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
    // Cached with a promise.
    if (this._boot != null) {
      debug('boot cached');
      return this._boot.asCallback(callback);
    }
    // May wait for the close.
    debug('booting');
    if (this._close != null) {
      this._boot = this._close.then(() => {
        return lib.extended.boot(this, options);
      });
      // Cleanup.
      this._close = null;
    } else {
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
    // Cached with a promise.
    if (this._close != null) {
      debug('close cached');
      return this._close.asCallback(callback);
    }
    // May wait for the boot.
    if (this._boot != null) {
      debug('closing');
      this._close = this._boot.then(() => {
        // `context` is referenced by our extended `boot`.
        const context = Object.assign({}, this.context, {
          phases: ['close']
        });
        // return Promise.resolve(context.bootstrapper.run(context)).asCallback(callback);
        return this.disconnectAll().then(() => {
          return context.bootstrapper.run(context);
        });
      });
      // Cleanup.
      this._boot = null;
    } else {
      // Nothing to close.
      debug('not booted');
      this._close = Promise.resolve();
    }
    return this._close.asCallback(callback);
  };

  /**
   * Shortcut. Close and boot.
   */
  app.reboot = function reboot(callback) {
    this.close();
    return this.boot().asCallback(callback);
  };

  return app;
}
