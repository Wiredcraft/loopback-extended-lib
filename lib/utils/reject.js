'use strict';

var Promise = require('bluebird');
var httpError = require('./httpError');

module.exports = reject;

/**
 * Shortcut. Reject with an HTTP error.
 * @return {Promise}
 */
function reject() {
  return Promise.reject(httpError.apply(this, arguments));
}
