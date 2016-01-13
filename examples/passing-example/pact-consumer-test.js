'use strict';

var intercept = require('../..');
var pact = require('./post-pact.json');
var client = require('./sample-consumer-client');
var expect = require('chai').expect;

describe('When the request matches the specification', function(){
    before(function(){
      var response;

      var setState = function(err, interaction, cb){
        client(1234, { foo: "baz"}, function(err, res){
            if(err){
                throw err;
            }
            else {
                response = res;
                done();
            }
        });
      };

      intercept(pact, /.*/, setState, function(err, testResults){
        if(err){
          console.error(err); //Failure in setting up tests
        }
      });
    });

    it('should pass pact verification and return data as expected', function(){
        expect(response).to.eql("\\../");
    });
});
