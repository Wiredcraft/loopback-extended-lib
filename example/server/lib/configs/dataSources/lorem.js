'use strict';

var lib = require('../../');
var utils = lib.utils;

module.exports = function config(app) {

  var API = app.get('loremApi');

  var dataSource = utils.restDataSourceConfig({
    baseURL: API,
    options: {
      headers: {
        'x-custom-header': '{customHeader}'
      },
      timeout: parseInt(app.get('loremApiTimeout'), 10)
    }
  }, [{
    template: {
      method: 'GET',
      url: API + '/lorems/{loremId}'
    },
    functions: {
      getLorem: ['customHeader', 'loremId']
    }
  }]);

  return dataSource;
};
