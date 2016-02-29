'use strict';

var Joi = require('joi');

module.exports = valueObtainer;

/**
 * Function builder.
 *
 * Build a function that validates a value and returns it, optionally (if path
 * given when it's built) it can validate a sub-value and return the sub-value.
 *
 * @param  {String} fnName Optional, the name for the generated function
 * @param  {Object} schema A Joi schema
 * @param  {String} path   Same as for Joi.reach(schema, path)
 * @return {Function}
 */
function valueObtainer(fnName, schema, path) {
  // Function name is optional.
  if (fnName == null || typeof fnName === 'object') {
    path = schema;
    schema = fnName;
    fnName = 'ensureValue';
  }

  // Validate schema.
  schema = Joi.compile(schema);

  // Path is optional.
  if (path == null) {
    // Validate the value.
    var body = 'return Joi.attempt(value, schema);\n';
  } else {
    // Validate path.
    Joi.assert(path, Joi.string().trim());
    var parts = path.split('.');

    // Get sub-schema.
    schema = Joi.reach(schema, path);

    // Build a new top-level schema.
    for (var i = parts.length - 1; i >= 0; i--) {
      var keys = {};
      keys[parts[i]] = schema.required();
      schema = Joi.object(keys).unknown();
    }

    // Validate the top-level value.
    var body = 'var res = Joi.attempt(value, schema);\n';

    // Get the target value.
    for (var i = 0, len = parts.length; i < len; i++) {
      body += 'res = res["' + parts[i] + '"];\n';
    }
    body += 'return res;\n';
  }

  // Build a function generator and run it.
  var generator = new Function('Joi', 'schema',
    'return function ' + fnName + '(value) {\n' + body + '};\n');
  return generator(Joi, schema);
}
