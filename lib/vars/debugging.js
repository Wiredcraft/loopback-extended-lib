'use strict';

const lib = require('../');

/**
 * Is debugging.
 */
module.exports = function(debug) {
  if (debug != null) {
    return Boolean(debug);
  }

  debug = lib.app.get('debug');
  if (debug != null) {
    return Boolean(debug);
  }

  debug = lib.app.get('debugging');
  if (debug != null) {
    return Boolean(debug);
  }

  return process.env.NODE_ENV !== 'production';
};
