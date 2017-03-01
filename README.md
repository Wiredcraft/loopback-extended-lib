# Loopback Extended Lib

[![Build Status](https://travis-ci.org/Wiredcraft/loopback-extended-lib.svg?branch=master)](https://travis-ci.org/Wiredcraft/loopback-extended-lib) [![Coverage Status](https://coveralls.io/repos/github/Wiredcraft/loopback-extended-lib/badge.svg?branch=master)](https://coveralls.io/github/Wiredcraft/loopback-extended-lib?branch=master)

Extend Loopback in random ways, and put everything in a lib.

See the example for a full functioning Loopback project.

## What's included

### The idea

For a single project, we have:

- A single `lib`.
- A single `app`, which must be at `lib.app`, and can be used anywhere (with a `lib = require('path/to/lib')`).
- The `app` has a root directory that never changes, and it can `boot()` itself.

### The "lib"

You usually have a `lib` directory in your project, with an `index.js` file in it, which would look like:

```js
// The lib.
const lib = require('loopback-extended-lib');
// Register files.
lib.register(__dirname);
// Export.
module.exports = lib;
```

It can register files multiple times, and the same files would be overridden. For more details, see [file-register](https://github.com/Wiredcraft/file-register)

### The "extended"

- `lib.extended.loopback()` can be used to generate an `app`, which is supposed to be used exactly once for one project. See the example for more details.
- `app.boot()` can be used to boot the `app`, which will only boot once (multiple calls would return a cached promise).
- `app.reboot()` can be used to "reboot" the `app`. Usually it's only used in tests. Be careful that this can break the connections to the data sources.

### The "vars"

Some global variable getters/generators that are usually useful. For more details read the source code - they are short.

- `lib.vars.debugging()` can tell if we are in the debugging mode.
- `lib.vars.namespace()` can build a string in the format `[project namespace]:[local namespace]`, similar to what people usually use with the `debug` module, and is usually used in debug and log etc.
