'use strict';

var request = require('request');
var interceptor = require('../');
var expect = require('chai').expect;

describe('Pact Interceptor: ', function(){

    var pact;
    var intercept;

    beforeEach(function(){
        intercept = interceptor({
            provider: "some provider", 
            consumer: "some consumer"
        });
    });

    afterEach(function(){
        intercept.teardown();
    });

    describe('When receiving a request for which to create a pact', function(){

        beforeEach(function(done){
            
            intercept.start('http://google.com/foo', function(err, pactData){
                if(err) {
                    done(err);
                }
                else {
                    pact = pactData; 
                }
            });

            request.get('http://google.com/foo', function(err, req, body){
                if(err) {
                    done(err);
                }
                else {
                    done(); 
                }
            });
        });

        afterEach(function(){
            intercept.teardown();
        });

        it('Should intercept the request', function(){
            expect(pact).to.eql({foo: "baz"});
        });
    });

    describe('When receiving a request which is to be not intercepted', function(){

        var responseCode;

        beforeEach(function(done){
            
            intercept.start('http://some-other-url', function(err, pactData){
                if(err) {
                    done(err);
                }
                else {
                    pact = pactData; 
                }
            });

            request.get('http://google.com', function(err, req, body){
                if(err) {
                    done(err);
                }
                else {
                    responseCode = req.statusCode;
                    done(); 
                }
            });
        });

        afterEach(function(){
            intercept.teardown();
        });

        it('Should not intercept the request', function(){
            expect(pact).to.be.undefined;
            expect(responseCode).to.equal(200);
        });
    });
});
