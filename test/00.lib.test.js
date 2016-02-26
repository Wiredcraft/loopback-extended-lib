var should = require('should');

var lib = require('../lib');

describe('The lib', function () {

  it('should be there', function () {
    lib.should.have.type('object');
    lib.should.have.property('extended').with.type('object');
    lib.should.have.property('utils').with.type('object');
  });

});
