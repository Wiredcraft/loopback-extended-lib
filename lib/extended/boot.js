'use strict';

const debug = require('debug')('loopback:extended:boot');

const lib = require('../');
const compile = lib.extended.compile;

const Promise = require('bluebird');
const boot = require('loopback-boot');
const executeAsync = Promise.promisify(boot.execute);

module.exports = extendedBoot;

/**
 * Boot an app.
 *
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
    for (let key in lib.connectors) {
      debug('loading connector "%s" from lib.', key);
      app.connector(key, lib.connectors[key]);
    }
  }

  // For convenient.
  app.set('rootDir', options.appRootDir || process.cwd());

  // Code from the original boot().
  options.env = options.env || app.get('env');

  // Code from the original boot() but using the extended compile().
  const instructions = compile(options);

  // Code from the original boot() but using Promise.
  return executeAsync(app, instructions);
}
