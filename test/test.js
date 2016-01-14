'use strict';
// FIXME Make this code DRYer,
// The GET and POST examples are essentially duplicated code.
// I was generating tests in a loop over the pact examples, but
// mocha was getting confused (as was I).

var request = require('request');
var expect = require('chai').expect;
var verify  = require('../index.js');
var _ = require('lodash')
var pact = require('./simple-GET-pact.json');

describe('When the provider receives a post request', function(){
    var response;
    var providerState = 'The provider receives a post request';

    before(function(done){
      var params = {
          method: "post",
          url: "http://somedomain.com/blah",
          headers: { authorization: "some auth header for post" },
          json: true,
          body: {
              "some post data": [
                  {
                      "id": "1234",
                      "status": "new"
                  }
              ]
          }
      };

      var setState = function(){
        request(params, function(err, res){
            if(err) {
              console.log(err);
            }
            else {
                response = res;
            }
        });
      };

      verify(providerState, pact, /.*/, setState, function(err, testResults){
        if(err){
          console.error(err); //Failure in setting up tests
        }
        done();
      });
    });

    it('Should intercept the request and provide the specified statusCode', function(){
      var interaction = _.find(pact.interactions, function(o) { return o.provider_state == providerState; });

      expect(response.body).to.eql(interaction.response.body);
      expect(response.statusCode).to.equal(interaction.response.status);
    });
});

describe('When the provider receives a request for resource 1234', function(){
    var response;
    var providerState = 'The provider has resource 1234 available';

    before(function(done){
      var params = {
          method: "get",
          url: "http://somedomain.com/1234",
          headers: { authorization: "header 1234" },
          json: true
      };

      var setState = function(){
        request(params, function(err, res){
            if(err) {
              console.log(err);
            }
            else {
                response = res;
            }
        });
      };

      verify(providerState, pact, /.*/, setState, function(err, testResults){
        if(err){
          console.error(err); //Failure in setting up tests
        }
        done();
      });
    });

    it('Should intercept the request and provide the specified statusCode', function(){
      var interaction = _.find(pact.interactions, function(o) { return o.provider_state == providerState; });

      expect(response.body).to.eql(interaction.response.body);
      expect(response.statusCode).to.equal(interaction.response.status);
    });
});

describe('When the provider receives a request for resource abcd', function(){
    var response;
    var providerState = 'The provider has resource abcd available';

    before(function(done){
      var params = {
          method: "get",
          url: "http://somedomain.com/abcd",
          headers: { authorization: "header abcd" },
          json: true
      };

      var setState = function(){
        request(params, function(err, res){
            if(err) {
              console.log(err);
            }
            else {
                response = res;
            }
        });
      };

      verify(providerState, pact, /.*/, setState, function(err, testResults){
        if(err){
          console.error(err); //Failure in setting up tests
        }
        done();
      });
    });

    it('Should intercept the request and provide the specified statusCode', function(){
      var interaction = _.find(pact.interactions, function(o) { return o.provider_state == providerState; });

      expect(response.body).to.eql(interaction.response.body);
      expect(response.statusCode).to.equal(interaction.response.status);
    });
});

describe('When the provider returns a 404', function(){
    var response;
    var providerState = 'The provider returns 404';

    before(function(done){
      var params = {
          method: "get",
          url: "http://somedomain.com/snap",
          headers: { authorization: "some auth header" },
          json: true
      };

      var setState = function(){
        request(params, function(err, res){
            if(err) {
              console.log(err);
            }
            else {
                response = res;
            }
        });
      };

      verify(providerState, pact, /.*/, setState, function(err, testResults){
        if(err){
          console.error(err); //Failure in setting up tests
        }
        done();
      });
    });

    it('Should intercept the request and provide the specified statusCode', function(){
      var interaction = _.find(pact.interactions, function(o) { return o.provider_state == providerState; });

      expect(response.body).to.eql(interaction.response.body);
      expect(response.statusCode).to.equal(interaction.response.status);
    });
});
