'use strict';

var debug = require('debug')('loopback:extended:boot');

var lib = require('../');
var compile = lib.extended.compile;

var Promise = require('bluebird');
var boot = require('loopback-boot');
var executeAsync = Promise.promisify(boot.execute);

module.exports = extendedBoot;

/**
 * Boot an app.
 * @return {Promise}
 * @see node_modules/loopback-boot/index.js
 */
function extendedBoot(app, options) {
  // @see node_modules/loopback-boot/lib/compiler.js
  options = options || {};
  if (typeof options === 'string') {
    options = { appRootDir: options };
  }

  // The lib can have custom connectors.
  if (lib.connectors) {
    var keys = Object.keys(lib.connectors);
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      debug('loading connector "%s" from lib.', key);
      app.connector(key, lib.connectors[key]);
    }
  }

  // For convenient.
  app.set('rootDir', options.appRootDir || process.cwd());

  // Code from the original boot().
  options.env = options.env || app.get('env');

  // Code from the original boot() but using the extended compile().
  var instructions = compile(options);

  // Code from the original boot() but using Promise.
  return executeAsync(app, instructions);
}
