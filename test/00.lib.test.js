const should = require('should');

const lib = require('../lib');

describe('The lib', () => {

  it('should be there', () => {
    lib.should.have.type('object');
    lib.should.have.property('extended').with.type('object');
    lib.should.have.property('utils').with.type('object');
  });

  it('can assert singleton', () => {
    lib.should.have.property('assertSingleton').with.type('function');
    lib.assertSingleton(lib);
    (() => {
      lib.assertSingleton();
    }).should.throw();
  });

});
