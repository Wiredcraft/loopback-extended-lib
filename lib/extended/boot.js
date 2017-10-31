'use strict';

const Promise = require('bluebird');
const boot = require('loopback-boot');

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

  // For convenience.
  app.set('rootDir', options.appRootDir || process.cwd());

  // Use the original boot() but always return Promise.
  return Promise.resolve(boot(app, options)).then((context) => {
    // For convenience.
    app.context = context;
    return context;
  });
}
