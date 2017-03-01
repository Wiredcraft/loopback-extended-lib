'use strict';

require('should');
const path = require('path');

const lib = require('../lib');
const DataSource = require('loopback-datasource-juggler').DataSource;

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

    it('can boot itself', (done) => {
      app.should.have.property('boot').which.is.Function();
      app.boot().then(done, done);
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

  });

  describe('Boot', () => {

    it('should be there', () => {
      lib.extended.should.have.property('boot').which.is.Function();
    });

    it('can boot an app', (done) => {
      lib.extended.boot(app, exampleRoot).then(() => {
        app.should.have.property('dataSources').which.is.Object();
        app.dataSources.should.have.property('db').instanceof(DataSource);
        done();
      }).catch(done);
    });

    it('can be used to add data sources', (done) => {
      lib.configs = lib.configs || {};
      lib.configs.dataSources = {};
      lib.configs.dataSources.ipsum = require(path.resolve(exampleRoot, 'lib/configs/dataSources/ipsum'));
      lib.extended.boot(app, exampleRoot).then(() => {
        app.dataSources.should.have.property('ipsum').instanceof(DataSource);
        done();
      }).catch(done);
    });

    it('can be used to add data sources and the data source config can be a function', (done) => {
      lib.configs = lib.configs || {};
      lib.configs.dataSources = {};
      lib.configs.dataSources.lorem = require(path.resolve(exampleRoot, 'lib/configs/dataSources/lorem'));
      lib.extended.boot(app, exampleRoot).then(() => {
        app.dataSources.should.have.property('lorem').instanceof(DataSource);
        done();
      }).catch(done);
    });

    it('can be used to add connectors', (done) => {
      lib.connectors = lib.connectors || {};
      lib.connectors.Lorem = () => {};
      lib.extended.boot(app, exampleRoot).then(() => {
        app.connectors.should.have.property('Lorem').which.is.Function();
        done();
      }).catch(done);
    });

    it('can be used to add models (TODO)', (done) => {
      lib.configs = lib.configs || {};
      lib.configs.models = {};
      lib.configs.models.Lorem = {
        dataSource: 'db',
        public: false
      };
      lib.extended.boot(app, exampleRoot).then(() => {
        app.should.have.property('models').which.is.Function();
        app.models.should.have.property('Lorem').which.is.Function();
        done();
      }).catch(done);
    });

    it('can be used to add mixins (TODO)', (done) => {
      lib.extended.boot(app, exampleRoot).then(() => {
        app.should.have.property('registry').which.is.Object();
        app.registry.should.have.property('modelBuilder').which.is.Object();
        app.registry.modelBuilder.should.have.property('mixins').which.is.Object();
        app.registry.modelBuilder.mixins.should.have.property('mixins').which.is.Object();

        // Name is changed from `lorem` to `Lorem` for some reason...
        app.registry.modelBuilder.mixins.mixins.should.have.property('Lorem').which.is.Function();
        done();
      }).catch(done);
    });

    it('cannot override user configs', (done) => {
      lib.configs = lib.configs || {};
      lib.configs.dataSources = {};
      lib.configs.dataSources.db = {
        name: 'db',
        connector: 'null'
      };
      lib.extended.boot(app, exampleRoot).then(() => {
        app.dataSources.should.have.property('db').instanceof(DataSource);
        done();
      }).catch(done);
    });

  });

});
