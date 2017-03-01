'use strict';

const util = require('util');
const lib = require('../');

// Default.
const NAMESPACE = 'namespace:%s';

/**
 * Namespace for the project.
 */
module.exports = function(name) {
  return util.format(lib.app.get('namespace') || NAMESPACE, name);
};
