'use strict';

require('should');

const lib = require('../lib');

describe('The lib', () => {

  it('should be there', () => {
    lib.should.be.Object();
    lib.should.have.property('extended').which.is.Object();
  });

  it('can assert singleton', () => {
    lib.should.have.property('assertSingleton').which.is.Function();
    lib.assertSingleton(lib);
    (() => {
      lib.assertSingleton();
    }).should.throw();
  });

  it('should have a default app', () => {
    lib.should.have.property('app').which.is.Function();
  });

});
