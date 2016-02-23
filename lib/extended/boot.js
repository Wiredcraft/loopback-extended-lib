'use strict';

var debug = require('debug')('loopback:extended:boot');

var lib = require('../');
var mixable = require('mixable-object');
var Promise = require('bluebird');
var boot = require('loopback-boot');
var bootAsync = Promise.promisify(boot);

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

  // The lib can be used to replace the config files.
  var keys = ['models', 'dataSources', 'middleware', 'components'];
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    if (lib[key]) {
      debug('loading the %s config files from lib (which replace the loopback ones).', key);
      options[key] = mixable(options[key]);
      options[key].mixin(lib[key]);
    }
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

  return bootAsync(app, options);
}
