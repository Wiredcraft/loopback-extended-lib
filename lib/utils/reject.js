'use strict';

var Promise = require('bluebird');
var httpError = require('./httpError');
var notEmptyObject = require('./notEmptyObject');
var notObjectOrIsEmpty = require('./notObjectOrIsEmpty');

module.exports = reject;

/**
 * Shortcut. Reject with an HTTP error.
 *
 * @return {Promise}
 */
function reject(error) {
  // In case it's an HTTP error or similar, where the message is the HTML body (a JSON object).
  var res = findErrorMessage(error);
  if (res) {
    return Promise.reject(httpError.apply(this, res));
  }
  return Promise.reject(httpError.apply(this, arguments));
}

/**
 * See if the error message is/has an error-like-object which has its message.
 */
function findErrorMessage(error) {
  if (notObjectOrIsEmpty(error) || notObjectOrIsEmpty(error.message)) {
    return null;
  }
  // The error message can have an error-like-object, and if not, fall-back to the message itself. The
  // reduce result needs to be an object, and will be used as the additional properties.
  // TODO: configurable possible keys?
  return [error, ['errors', 'error', 'data'].reduce(_reducer, error.message)];
}

/**
 * @private
 */
function _reducer(message, key) {
  var obj = message[key];
  // Can be an array.
  if (Array.isArray(obj)) {
    obj = obj[0];
  }
  if (notEmptyObject(obj) && obj.message != null) {
    return obj;
  }
  return message;
}
