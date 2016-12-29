'use strict';

const assert = require('assert');

module.exports = assertSingleton;

/**
 * Just a check.
 */
function assertSingleton(lib) {
  assert(lib === this, 'Fatal: Different register instances got required.' +
    ' Please try `npm dedupe` or `npm find-dupes`.');
}
