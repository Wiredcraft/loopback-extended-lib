var should = require('should');

var lib = require('../lib');

describe('The utils', function () {

  describe('The REST data source config builder', function () {

    it('should be there', function () {
      lib.utils.should.have.property('restDataSourceConfig').with.type('function');
    });

    it('can create a config', function () {
      lib.utils.restDataSourceConfig({}).should.deepEqual({
        connector: 'rest',
        debug: false,
        options: {
          json: true,
          headers: {
            accept: 'application/vnd.api+json',
            'content-type': 'application/vnd.api+json'
          }
        },
        crud: false,
        operations: []
      });
    });

    it('can create a config', function () {
      lib.utils.restDataSourceConfig({
        debug: true,
        options: {
          strictSSL: false,
          headers: {
            accept: 'application/json',
            'content-type': 'application/json'
          }
        }
      }).should.deepEqual({
        connector: 'rest',
        debug: true,
        options: {
          json: true,
          strictSSL: false,
          headers: {
            accept: 'application/json',
            'content-type': 'application/json'
          }
        },
        crud: false,
        operations: []
      });
    });

    it('can create a config', function () {
      lib.utils.restDataSourceConfig({}, [{
        template: {
          method: 'GET',
          url: 'http://somewhere/something/{someId}'
        },
        functions: {
          getSomething: ['someId']
        }
      }]).should.deepEqual({
        connector: 'rest',
        debug: false,
        options: {
          json: true,
          headers: {
            accept: 'application/vnd.api+json',
            'content-type': 'application/vnd.api+json'
          }
        },
        crud: false,
        operations: [{
          template: {
            method: 'GET',
            url: 'http://somewhere/something/{someId}',
            json: true,
            headers: {
              accept: 'application/vnd.api+json',
              'content-type': 'application/vnd.api+json'
            }
          },
          functions: {
            getSomething: ['someId']
          }
        }]
      });
    });

    it('can create a config', function () {
      lib.utils.restDataSourceConfig({
        debug: true,
        options: {
          strictSSL: false,
          headers: {
            accept: 'application/json',
            'content-type': 'application/json'
          }
        }
      }, [{
        template: {
          method: 'GET',
          url: 'http://somewhere/something/{someId}'
        },
        functions: {
          getSomething: ['someId']
        }
      }]).should.deepEqual({
        connector: 'rest',
        debug: true,
        options: {
          json: true,
          strictSSL: false,
          headers: {
            accept: 'application/json',
            'content-type': 'application/json'
          }
        },
        crud: false,
        operations: [{
          template: {
            method: 'GET',
            url: 'http://somewhere/something/{someId}',
            json: true,
            strictSSL: false,
            headers: {
              accept: 'application/json',
              'content-type': 'application/json'
            }
          },
          functions: {
            getSomething: ['someId']
          }
        }]
      });
    });

  });

});
