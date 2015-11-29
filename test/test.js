'use strict';

var request = require('request');
var interceptor = require('../');
var expect = require('chai').expect;
var pact = require(__dirname + '/pact.json');

describe('Pact Interceptor: ', function(){

    var intercept;

    beforeEach(function(){
        intercept = interceptor(pact);
    });
            
    afterEach(function(){
        intercept.teardown(); 
    });

    describe.only('When receiving a request for which to create a pact', function(){

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

        it('Should intercept the request', function(){
            expect(pact).to.eql({foo: "baz"});
        });
    });

    describe('When receiving a request which is to be not intercepted', function(){

        var responseCode;
        var responseError; 
    
        beforeEach(function(done){
            
            intercept.start('http://some-other-url', function(err, pactData){
                responseError = err;
            });

            request.get('http://google.com', function(err, req, body){
                responseCode = req.statusCode;
                done(); 
            });
        });

        it('Should not intercept the request', function(){
            expect(responseCode).to.eql(400);
            expect(responseError).to.eql({
                "error": "recevied a request which was not part of the assertion",
                "url": "google.com/"
            });
        });
    });
});
