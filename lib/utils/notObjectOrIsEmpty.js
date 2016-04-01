'use strict';

/**
 * Shortcut. Not an object or doesn't have it's own properties.
 */
module.exports = function notObjectOrIsEmpty(obj) {
  if (obj == null) return true;
  if (typeof obj !== 'object') return true;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
};
