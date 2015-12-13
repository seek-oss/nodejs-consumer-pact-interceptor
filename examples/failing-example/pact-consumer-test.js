'use strict';

var intercept = require('../..');
var pact = require('./post-pact.json');
var interceptor = intercept(pact);
var client = require('./sample-consumer-client');
var expect = require('chai').expect;

describe('Pact consumer test', function(){

    var response;

    before(function(done){

        interceptor.start('http://somedomain/some-resource/1234', function(err, pactData){
            if(err)
                throw err;
        });

        client(1234, { foo: "bar"}, function(err, res){
            if(err){
                throw err;
            }
            else {
                response = res;
                done();
            }
        });
    });

    after(function(){
        interceptor.teardown();
    });

    it('should pass pact verification and return data as expected', function(){
        expect(response).to.eql("\\../");
    });
});
