var should = require('should');

var lib = require('../lib');
var DataSource = require('loopback-datasource-juggler').DataSource;

describe('The extended', function () {

  var app;

  describe('Loopback', function () {

    it('should be there', function () {
      lib.extended.should.have.property('loopback').with.type('function');
    });

    it('can create an app', function () {
      app = lib.extended.loopback();
      app.should.have.type('function');
    });

    it('can boot itself', function (done) {
      app.should.have.property('boot').with.type('function');
      app.boot(done);
    });

  });

  describe('Boot', function () {

    it('should be there', function () {
      lib.extended.should.have.property('boot').with.type('function');
    });

    it('can boot an app', function (done) {
      lib.extended.boot(app).then(function () {
        app.should.have.property('dataSources').deepEqual({});
        done();
      }).catch(done);
    });

    it('can be used to replace data sources', function (done) {
      lib.dataSources = lib.dataSources || {};
      lib.dataSources.db = {
        name: 'db',
        connector: 'memory'
      };
      lib.extended.boot(app).then(function () {
        app.dataSources.should.have.property('db').instanceof(DataSource);
        done();
      }).catch(done);
    });

    it('can be used to replace data sources and the data source config can be a function', function (done) {
      lib.dataSources = lib.dataSources || {};
      lib.dataSources.db = function () {
        return {
          name: 'db',
          connector: 'memory'
        };
      };
      lib.extended.boot(app).then(function () {
        app.dataSources.should.have.property('db').instanceof(DataSource);
        done();
      }).catch(done);
    });

    it('can be used to add connectors', function (done) {
      lib.connectors = lib.connectors || {};
      lib.connectors.Lorem = function () {};
      lib.extended.boot(app).then(function () {
        app.connectors.should.have.property('Lorem').with.type('function');
        done();
      }).catch(done);
    });

  });

});
