'use strict';

require('should');

const lib = require('../example/server/lib');

describe('The example', () => {

  let app;
  let vars;

  describe('App', () => {

    it('should be there', () => {
      lib.should.have.property('app').which.is.Function();
      app = lib.app;
    });

    it('can boot itself', (done) => {
      app.should.have.property('boot').which.is.Function();
      app.boot(done);
    });

  });

  describe('Variables', () => {

    it('should be there', () => {
      lib.should.have.property('vars').which.is.Object();
      vars = lib.vars;
      vars.should.have.property('namespace').which.is.Function();
      vars.should.have.property('debugging').which.is.Function();
    });

    it('can build a namespace', () => {
      app.set('namespace', 'lorem:%s');
      vars.namespace('lorem').should.equal('lorem:lorem');
    });

    it('can build a namespace', () => {
      app.set('namespace', 'example:%s');
      vars.namespace('lorem').should.equal('example:lorem');
    });

    it('can tell we are debugging', () => {
      vars.debugging().should.equal(true);
    });

    it('can tell we are debugging', () => {
      vars.debugging(true).should.equal(true);
    });

    it('can tell we are debugging', () => {
      vars.debugging(false).should.equal(false);
    });

    it('can tell we are debugging', () => {
      app.set('debug', true);
      vars.debugging().should.equal(true);
    });

    it('can tell we are debugging', () => {
      app.set('debug', false);
      vars.debugging().should.equal(false);
    });

  });

});
