var path = require('path');
var should = require('should');

var lib = require('../lib');
var DataSource = require('loopback-datasource-juggler').DataSource;

describe('The extended', function () {

  var app;
  var exampleRoot = path.resolve(__dirname, '../example/server');

  describe('Loopback', function () {

    it('should be there', function () {
      lib.extended.should.have.property('loopback').with.type('function');
    });

    it('can create an app', function () {
      app = lib.extended.loopback(exampleRoot);
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
      lib.extended.boot(app, exampleRoot).then(function () {
        app.should.have.property('dataSources').with.type('object');
        app.dataSources.should.have.property('db').instanceof(DataSource);
        done();
      }).catch(done);
    });

    it('can be used to add data sources', function (done) {
      lib.configs = lib.configs || {};
      lib.configs.dataSources = lib.configs.dataSources || {};
      lib.configs.dataSources.ipsum = require(path.resolve(exampleRoot, 'lib/configs/dataSources/ipsum'));
      lib.extended.boot(app, exampleRoot).then(function () {
        app.dataSources.should.have.property('ipsum').instanceof(DataSource);
        done();
      }).catch(done);
    });

    it('can be used to add data sources and the data source config can be a function', function (done) {
      lib.configs = lib.configs || {};
      lib.configs.dataSources = lib.configs.dataSources || {};
      lib.configs.dataSources.lorem = require(path.resolve(exampleRoot, 'lib/configs/dataSources/lorem'));
      lib.extended.boot(app, exampleRoot).then(function () {
        app.dataSources.should.have.property('lorem').instanceof(DataSource);
        done();
      }).catch(done);
    });

    it('can be used to add connectors', function (done) {
      lib.connectors = lib.connectors || {};
      lib.connectors.Lorem = function () {};
      lib.extended.boot(app, exampleRoot).then(function () {
        app.connectors.should.have.property('Lorem').with.type('function');
        done();
      }).catch(done);
    });

    it('can be used to add models (TODO)', function (done) {
      lib.configs = lib.configs || {};
      lib.configs.models = lib.configs.models || {};
      lib.configs.models.Lorem = {
        dataSource: 'db',
        public: false
      };
      lib.extended.boot(app, exampleRoot).then(function () {
        app.should.have.property('models').with.type('function');
        app.models.should.have.property('Lorem').with.type('function');
        done();
      }).catch(done);
    });

    it('can be used to add mixins (TODO)', function (done) {
      lib.extended.boot(app, exampleRoot).then(function () {
        app.should.have.property('registry').with.type('object');
        app.registry.should.have.property('modelBuilder').with.type('object');
        app.registry.modelBuilder.should.have.property('mixins').with.type('object');
        app.registry.modelBuilder.mixins.should.have.property('mixins').with.type('object');

        // Name is changed from `lorem` to `Lorem` for some reason...
        app.registry.modelBuilder.mixins.mixins.should.have.property('Lorem').with.type('function');
        done();
      }).catch(done);
    });

    it('cannot override user configs', function (done) {
      lib.configs = lib.configs || {};
      lib.configs.dataSources = lib.configs.dataSources || {};
      lib.configs.dataSources.db = {
        name: 'db',
        connector: 'null'
      };
      lib.extended.boot(app, exampleRoot).then(function () {
        app.dataSources.should.have.property('db').instanceof(DataSource);
        done();
      }).catch(done);
    });

  });

});
