
0.5.1 / 2017-10-31
==================

  * Added `app.close()`.

0.5.0 / 2017-10-30
==================

  * Removed ability to extend boot from lib and updata loopback-boot to 3.x.

0.4.1 / 2017-03-01
==================

  * Updated modules and readme. Added "vars".

0.4.0 / 2016-12-29
==================

  * Deprecated utils.restDataSourceConfig (use lib-rest).
  * Extended data source with the ability to disconnect with Bluebird disposer.
  * var -> const/let.
  * Removed utils.reject (use handle-http-error) and some shortcut utils.

0.3.5 / 2016-10-12
==================

  * The utils `valueObtainer ` was refactored to a new module `value-obtainer`; use it.

0.3.4 / 2016-09-13
==================

  * Updated the example with latest Loopback.
  * The utils `notEmptyObject` and `notObjectOrIsEmpty` were refactored to a new module `not-empty-object`; use it.
  * Updated modules. Switched to JSCS Grunt preset with minimal tweaks.

0.3.3 / 2016-04-13
==================

  * Allow `reject()` to be used with HTTP errors when the error message is an object.

0.3.2 / 2016-04-01
==================

  * Minor coding style improvement.
  * Added the `rootDir` var to app for convenient.
  * Added a new shortcut: `notObjectOrIsEmpty()`.

0.3.1 / 2016-03-23
==================

  * User configs override lib configs, instead of the other way.

0.3.0 / 2016-03-22
==================

  * No more magically adding models and mixins; requires a proper config for now; maybe later.

0.2.1 / 2016-03-15
==================

  * Removed a console.log()...

0.2.0 / 2016-03-15
==================

  * Allow lib to come with actual models and mixins. Use the example as the test fixture.
  * Better example.
  * Merge the lib configs with the config files instead of the options, to keep consistency with the original API.
  * Simplified example.
  * Moved config files from lib to lib.cofings, for less confusion.

0.1.3 / 2016-03-01
==================

  * Added utils.reject() as a shortcut.

0.1.2 / 2016-03-01
==================

  * Added lib.assertSingleton() as a safeguard.

0.1.1 / 2016-02-29
==================

  * Dropped node 0.12 support because of Joi.
  * Added valueObtainer() as a function builder.
  * Added utils.notEmptyObject() which is just a shortcut.
  * Added utils.restDataSourceConfig() which is used to build configs.

0.1.0 / 2016-02-23
==================

* First release.
