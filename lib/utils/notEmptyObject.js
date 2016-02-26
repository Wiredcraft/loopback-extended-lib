'use strict';

/**
 * Shortcut. Is an object and has it's own properties.
 */
module.exports = function notEmptyObject(obj) {
  if (obj == null) return false;
  if (typeof obj !== 'object') return false;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return true;
  }
  return false;
};
