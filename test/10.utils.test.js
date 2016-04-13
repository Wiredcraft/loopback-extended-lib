var should = require('should');
var Joi = require('joi');

var lib = require('../lib');

describe('The utils', function () {

  describe('The not empty object shortcut', function () {

    it('should be there', function () {
      lib.utils.should.have.property('notEmptyObject').with.type('function');
    });

    it('can check a thing', function () {
      lib.utils.notEmptyObject({
        lorem: true
      }).should.equal(true);
    });

    it('can check a thing', function () {
      lib.utils.notEmptyObject({}).should.equal(false);
    });

    it('can check a thing', function () {
      lib.utils.notEmptyObject('lorem').should.equal(false);
    });

    it('can check a thing', function () {
      lib.utils.notEmptyObject(null).should.equal(false);
    });

  });

  describe('The not object or is empty shortcut', function () {

    it('should be there', function () {
      lib.utils.should.have.property('notObjectOrIsEmpty').with.type('function');
    });

    it('can check a thing', function () {
      lib.utils.notObjectOrIsEmpty({
        lorem: true
      }).should.equal(false);
    });

    it('can check a thing', function () {
      lib.utils.notObjectOrIsEmpty({}).should.equal(true);
    });

    it('can check a thing', function () {
      lib.utils.notObjectOrIsEmpty('lorem').should.equal(true);
    });

    it('can check a thing', function () {
      lib.utils.notObjectOrIsEmpty(null).should.equal(true);
    });

  });

  describe('The reject shortcut', function () {

    it('should be there', function () {
      lib.utils.should.have.property('reject').with.type('function');
    });

    it('can reject with an error code', function (done) {
      lib.utils.reject(404).then(function () {
        done(new Error('expected an error'));
      }).catch(function (err) {
        err.should.have.type('object');
        err.should.have.property('status', 404);
        done();
      }).catch(done);
    });

    it('can reject with an error', function (done) {
      var error = new Error('Lorem');
      error.status = 404;
      lib.utils.reject(error).then(function () {
        done(new Error('expected an error'));
      }).catch(function (err) {
        err.should.have.type('object');
        err.should.have.property('status', 404);
        err.should.have.property('message', 'Lorem');
        done();
      }).catch(done);
    });

    it('can reject with an error', function (done) {
      var error = new Error('Lorem');
      error.status = 404;
      error.code = 123;
      lib.utils.reject(error).then(function () {
        done(new Error('expected an error'));
      }).catch(function (err) {
        err.should.have.type('object');
        err.should.have.property('status', 404);
        err.should.have.property('code', 123);
        err.should.have.property('message', 'Lorem');
        done();
      }).catch(done);
    });

    it('can reject with an error', function (done) {
      var error = new Error();
      error.status = 404;
      error.message = {
        code: 123,
        message: 'Lorem'
      };
      lib.utils.reject(error).then(function () {
        done(new Error('expected an error'));
      }).catch(function (err) {
        err.should.have.type('object');
        err.should.have.property('status', 404);
        err.should.have.property('code', 123);
        err.should.have.property('message', 'Lorem');
        done();
      }).catch(done);
    });

    it('can reject with an error', function (done) {
      var error = new Error();
      error.status = 404;
      error.message = {
        error: {
          code: 123,
          message: 'Lorem'
        }
      };
      lib.utils.reject(error).then(function () {
        done(new Error('expected an error'));
      }).catch(function (err) {
        err.should.have.type('object');
        err.should.have.property('status', 404);
        err.should.have.property('code', 123);
        err.should.have.property('message', 'Lorem');
        done();
      }).catch(done);
    });

    it('can reject with an error', function (done) {
      var error = new Error();
      error.status = 404;
      error.message = {
        errors: [{
          code: 123,
          message: 'Lorem'
        }]
      };
      lib.utils.reject(error).then(function () {
        done(new Error('expected an error'));
      }).catch(function (err) {
        err.should.have.type('object');
        err.should.have.property('status', 404);
        err.should.have.property('code', 123);
        err.should.have.property('message', 'Lorem');
        done();
      }).catch(done);
    });

    it('can reject with an error', function (done) {
      var error = new Error();
      error.status = 404;
      error.message = {
        data: {
          code: 123,
          message: 'Lorem'
        }
      };
      lib.utils.reject(error).then(function () {
        done(new Error('expected an error'));
      }).catch(function (err) {
        err.should.have.type('object');
        err.should.have.property('status', 404);
        err.should.have.property('code', 123);
        err.should.have.property('message', 'Lorem');
        done();
      }).catch(done);
    });

  });

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

  describe('The value obtainer builder', function () {

    var schema = Joi.object({
      lorem: Joi.string().trim()
    });

    it('should be there', function () {
      lib.utils.should.have.property('valueObtainer').with.type('function');
    });

    it('can build a function', function () {
      lib.utils.valueObtainer('xxx', schema).should.have.type('function');
    });

    it('can build a function', function () {
      lib.utils.valueObtainer('xxx', schema, 'lorem').should.have.type('function');
    });

    it('can build a function', function () {
      lib.utils.valueObtainer(schema).should.have.type('function');
    });

    it('can build a function', function () {
      lib.utils.valueObtainer(schema, 'lorem').should.have.type('function');
    });

    it('can throw', function () {
      (function () {
        lib.utils.valueObtainer();
      }).should.throw();
    });

    it('can throw', function () {
      (function () {
        lib.utils.valueObtainer({}, 'lorem');
      }).should.throw();
    });

    it('can throw', function () {
      (function () {
        lib.utils.valueObtainer(Joi.string(), 'lorem');
      }).should.throw();
    });

    it('can throw', function () {
      (function () {
        lib.utils.valueObtainer('lorem', {}, 'lorem');
      }).should.throw();
    });

    describe('An obtainer', function () {

      var ensureLorem;

      it('can be created', function () {
        ensureLorem = lib.utils.valueObtainer('ensureLorem', schema, 'lorem');
        ensureLorem.should.have.type('function');
      });

      it('can validate and get value', function () {
        ensureLorem({
          lorem: 'lorem ipsum'
        }).should.equal('lorem ipsum');
      });

      it('can throw', function () {
        (function () {
          ensureLorem({
            lorem: 123
          });
        }).should.throw();
      });

      it('can throw', function () {
        (function () {
          ensureLorem({
            ipsum: 'lorem ipsum'
          });
        }).should.throw();
      });

      it('can throw', function () {
        (function () {
          ensureLorem('lorem');
        }).should.throw();
      });

    });

  });

});
