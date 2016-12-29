'use strict';

const lib = require('../');
const loopback = require('loopback');

module.exports = createApplication;

/**
 * Create a loopback application.
 *
 * @see node_modules/loopback/lib/loobpack.js
 */
function createApplication(options) {

  // A new app.
  const app = loopback();

  // Extending dataSource().
  app._dataSource = app.dataSource;

  /**
   * So that the config can be a function.
   */
  app.dataSource = function(name, config) {
    if (typeof config === 'function') {
      return this._dataSource.call(this, name, config(this));
    };
    return this._dataSource.call(this, name, config);
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

  return app;
}
