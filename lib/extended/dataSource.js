'use strict';

const debug = require('debug')('loopback:extended:dataSource');

const Promise = require('bluebird');

module.exports = extendedDataSource;

/**
 * Extend a dataSource.
 */
function extendedDataSource(dataSource) {
  dataSource.connectAsync = function() {
    // It can be in a connecting state.
    if (this.connecting) {
      return new Promise((resolve, reject) => {
        this.once('connected', (res) => {
          resolve(res);
        });
      });
    }
    return Promise.resolve(this.connect());
  };
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
