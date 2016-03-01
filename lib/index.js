var Register = require('file-register');

// The lib.
var lib = Register();

// Register files.
lib.register(__dirname);

// Force context.
lib.assertSingleton = lib.assertSingleton.bind(lib);

// Export.
module.exports = lib;
