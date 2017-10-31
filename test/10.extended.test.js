'use strict';

require('should');
const path = require('path');

const lib = require('../lib');

describe('The extended', () => {

  let app;
  const exampleRoot = path.resolve(__dirname, '../example/server');

  describe('Loopback', () => {

    it('should be there', () => {
      lib.extended.should.have.property('loopback').which.is.Function();
    });

    it('can create an app', () => {
      app = lib.extended.loopback(exampleRoot);
      app.should.be.Function();
    });

    it('can boot itself', (done) => {
      app.should.have.property('boot').which.is.Function();
      app.boot(done);
    });

    it('can boot itself (Promise style)', () => {
      app.should.have.property('boot').which.is.Function();
      return app.boot();
    });

    it('should have the root', () => {
      app.get('rootDir').should.equal(exampleRoot);
    });

    it('can disconnect all data sources', (done) => {
      app.should.have.property('disconnectAll').which.is.Function();
      app.disconnectAll(done);
    });

    it('can reboot', (done) => {
      app.should.have.property('reboot').which.is.Function();
      app.reboot(done);
    });

    it('can close', (done) => {
      app.should.have.property('close').which.is.Function();
      app.close(done);
    });

  });
});
