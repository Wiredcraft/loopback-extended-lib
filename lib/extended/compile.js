'use strict';

var debug = require('debug')('loopback:extended:compile');

var lib = require('../');
var Joi = require('joi');
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

    // The `_meta` in the `options.models` will be deleted by the original `compile()`, and because
    // `options.models` is usually cached by `require()`, this makes the app and any new app not
    // possible to be reloaded. Cloning it here.
    if (options.models) {
      options.models = Object.assign({}, options.models);
    }
    mixinMeta(options.models._meta);
    console.log(options.models._meta);
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
function mixinConfig(configs, key) {
  if (lib.configs && lib.configs[key]) {
    debug('loading the "%s" config files from lib.', key);
    configs[key] = mixable(configs[key]);
    configs[key].mixin(lib.configs[key]);
  }
}

var schemaMeta = Joi.object({
  sources: Joi.array().required(),
  mixins: Joi.array().required()
}).required();

var schemaArray = Joi.array().items(Joi.string()).required();

/**
 * Mixin.
 */
function mixinMeta(modelMeta) {
  // Validate.
  Joi.assert(modelMeta, schemaMeta);

  // The value need to be an array of paths. Pushing them to the top of the config.
  if (lib.models) {
    Joi.assert(lib.models, schemaArray);
    for (var i = 0, len = lib.models.length; i < len; i++) {
      var item = lib.models[i];
      if (modelMeta.sources.indexOf(item) < 0) {
        modelMeta.sources.unshift(item);
      }
    }
  }

  // The value need to be an array of paths. Pushing them to the top of the config.
  if (lib.mixins) {
    Joi.assert(lib.mixins, schemaArray);
    for (var i = 0, len = lib.mixins.length; i < len; i++) {
      var item = lib.mixins[i];
      if (modelMeta.mixins.indexOf(item) < 0) {
        modelMeta.mixins.unshift(item);
      }
    }
  }
}
