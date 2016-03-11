'use strict';

var debug = require('debug')('loopback:extended:compile');

var lib = require('../');
var mixable = require('mixable-object');

var boot = require('loopback-boot');
var compile = boot.compile;
var ConfigLoader = boot.ConfigLoader;

module.exports = extendedCompile;

/**
 * Merge the configs from lib with that from the config files, and in case conflict the config file
 * is overridden. For all possible config files, see the "Environment-specific configuration" doc.
 * @see node_modules/loopback-boot/lib/compiler.js
 * @see https://docs.strongloop.com/display/public/LB/Environment-specific+configuration
 */
function extendedCompile(options) {
  // Code from the original compile().
  options = options || {};
  if (typeof options === 'string') {
    options = { appRootDir: options };
  }
  var appRootDir = options.appRootDir = options.appRootDir || process.cwd();
  var env = options.env || process.env.NODE_ENV || 'development';

  // Load and mixin.
  if (!options.models) {
    var modelsRootDir = options.modelsRootDir || appRootDir;
    options.models = ConfigLoader.loadModels(modelsRootDir, env);
    mixinConfig(options, 'models');
  }

  // Load and mixin.
  if (!options.dataSources) {
    var dsRootDir = options.dsRootDir || appRootDir;
    options.dataSources = ConfigLoader.loadDataSources(dsRootDir, env);
    mixinConfig(options, 'dataSources');
  }

  // Load and mixin.
  if (!options.middleware) {
    var middlewareRootDir = appRootDir;
    options.middleware = ConfigLoader.loadMiddleware(appRootDir, env);
    mixinConfig(options, 'middleware');
  }

  // Load and mixin.
  if (!options.components) {
    var componentRootDir = appRootDir;
    options.components = ConfigLoader.loadComponents(componentRootDir, env);
    mixinConfig(options, 'components');
  }

  // The original compile().
  return compile(options);
}

/**
 * Mixin.
 */
function mixinConfig(options, key) {
  if (lib.configs && lib.configs[key]) {
    debug('loading the "%s" config files from lib.', key);
    options[key] = mixable(options[key]);
    options[key].mixin(lib.configs[key]);
  }
}
