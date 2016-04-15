'use strict';

var mixin = require('mixable-object').mixin;
var merge = require('mixable-object').merge;

/**
 * Build a piece of config object for a REST data source.
 *
 * @param  {Object} config
 * @param  {Object} operations
 * @return {Object}
 */
module.exports = function restDataSourceConfig(config, operations) {
  var dataSource = merge.call({
    connector: 'rest',
    debug: false,
    options: {
      json: true,
      headers: {
        accept: 'application/vnd.api+json',
        'content-type': 'application/vnd.api+json'
      }
    },

    // Required to have DAO methods attached so the models can have CRUD methods.
    // However the methods are not flexible enough so we usually don't use it.
    // @see require('loopback-connector-rest').initialize()
    crud: false,

    operations: []
  }, config);

  // Operations.
  if (operations != null) {
    // Also copy data source options to each operations.
    for (var i = 0, len = operations.length; i < len; i++) {
      dataSource.operations.push(merge.call({
        template: mixin.call({}, dataSource.options)
      }, operations[i]));
    }
  }

  return dataSource;
};
