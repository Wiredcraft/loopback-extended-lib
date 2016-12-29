'use strict';

const debug = require('debug')('loopback:extended:dataSource');

const Promise = require('bluebird');

module.exports = extendedDataSource;

/**
 * Extend a dataSource.
 */
function extendedDataSource(dataSource) {
  dataSource.connectAsync = Promise.promisify(dataSource.connect, { context: dataSource });
  dataSource.disconnectAsync = Promise.promisify(dataSource.disconnect, { context: dataSource });

  /**
   * Disposer.
   */
  dataSource.disposer = function() {
    return this.connectAsync().disposer(() => {
      debug('disconnecting %s', this.settings.name);
      return this.disconnectAsync();
    });
  };

  /**
   * Wait for the connection and disconnect.
   */
  dataSource.ensureDisconnect = function(res) {
    return Promise.using(this.disposer(), () => res != null ? res : true);
  };
}
