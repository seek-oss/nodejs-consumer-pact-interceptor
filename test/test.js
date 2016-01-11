'use strict';

// FIXME Make this code DRYer,
// The GET and POST examples are essentially duplicated code.
// I was generating tests in a loop over the pact examples, but
// mocha was getting confused (as was I).

var request = require('request');
var expect = require('chai').expect;
var request = require('request');

describe('Pact Interceptor: - simple GET request', function(){

    describe('When receiving a request for which to create a pact', function(){

        var pactSpec = require('./simple-GET-pact.json');

        var pact;
        var interceptor;
        var intercept;
        var httpReq;
        var httpBody;

        beforeEach(function(){
            interceptor = require('../');
            intercept = interceptor(pactSpec);
        });

        afterEach(function(){
            intercept.teardown();
        });

        describe('When the request matches the specification and a regex', function(){

            beforeEach(function(done){
                intercept.start(/.*/, function(err, pactData){
                    if(err) {
                        done(err);
                    }
                    else {
                        pact = pactData;
                    }
                });

                var params = {
                    method: pactSpec.interactions[0].request.method,
                    url: "http://somedomain.com" + pactSpec.interactions[0].request.path,
                    headers: pactSpec.interactions[0].request.headers,
                    body: pactSpec.interactions[0].request.body,
                    json: true
                };

                request(params, function(err, req, body){
                    if(err) {
                        done(err);
                    }
                    else {
                        httpReq = req;
                        httpBody = body;
                        done();
                    }
                });
            });

            it('Should intercept the request and provide the specified statusCode', function(){
                expect(httpReq.statusCode).to.eql(pactSpec.interactions[0].response.status);
            });

            for(var header in pactSpec.interactions[0].response.headers) {
                it('Should provide appropriate response header: ' + header, function(){
                    expect(httpReq.headers[header]).to.eql(pactSpec.interactions[0].response.headers[header]);
                });
            }

            it('Should provide appropriate response body', function(){
                expect(httpBody).to.eql(pactSpec.interactions[0].response.body);
            });

            it('Should intercept the request and return the pact object after verification', function(){
                expect(pact).to.eql(pactSpec);
            });

        });
        describe('When the request matches the specification', function(){

            beforeEach(function(done){
                intercept.start("http://somedomain.com" + pactSpec.interactions[0].request.path, function(err, pactData){
                    if(err) {
                        done(err);
                    }
                    else {
                        pact = pactData;
                    }
                });

                var params = {
                    method: pactSpec.interactions[0].request.method,
                    url: "http://somedomain.com" + pactSpec.interactions[0].request.path,
                    headers: pactSpec.interactions[0].request.headers,
                    body: pactSpec.interactions[0].request.body,
                    json: true
                };

                request(params, function(err, req, body){
                    if(err) {
                        done(err);
                    }
                    else {
                        httpReq = req;
                        httpBody = body;
                        done();
                    }
                });
            });

            it('Should intercept the request and provide the specified statusCode', function(){
                expect(httpReq.statusCode).to.eql(pactSpec.interactions[0].response.status);
            });

            for(var header in pactSpec.interactions[0].response.headers) {
                it('Should provide appropriate response header: ' + header, function(){
                    expect(httpReq.headers[header]).to.eql(pactSpec.interactions[0].response.headers[header]);
                });
            }

            it('Should provide appropriate response body', function(){
                expect(httpBody).to.eql(pactSpec.interactions[0].response.body);
            });

            it('Should intercept the request and return the pact object after verification', function(){
                expect(pact).to.eql(pactSpec);
            });

        });

        describe('When the request fails to match the expectation', function(){

            var assertionErr;

            describe(': because of a failure to match method', function(){

                beforeEach(function(done){

                    intercept.start("http://somedomain.com" + pactSpec.interactions[0].request.path, function(err, pactData){
                        if(err) {
                            assertionErr = err;
                            done();
                        }
                        else {
                            done("The test did not yield an error object");
                        }
                    });

                    var params = {
                        method: "put",
                        url: "http://somedomain.com" + pactSpec.interactions[0].request.path,
                        headers: pactSpec.interactions[0].request.headers,
                        body: pactSpec.interactions[0].request.body,
                        json: true
                    };

                    request(params, function(err, req, body){
                        //should never get here
                        if(err) {
                            console.log(err);
                        }
                    });
                });

                it('should show what the expectation should have been', function(){
                    expect(assertionErr.expected).to.equal("get");
                });

                it('Should list the failure (method) in this case as the "actual" result', function(){
                    expect(assertionErr.actual).to.equal('PUT');
                });

                it('should provide a message about what\'s wrong', function(){
                    expect(assertionErr.message).to.equal('HTTP Methods are not equal');
                });

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
});

describe('Pact Interceptor: - simple POST request', function(){

    describe('When receiving a request for which to create a pact', function(){

        var pactSpec = require(__dirname + '/post-pact.json');

        var pact;
        var interceptor;
        var intercept;
        var httpReq;
        var httpBody;

        beforeEach(function(){
            interceptor = require('../');
            intercept = interceptor(pactSpec);
        });

        afterEach(function(){
            intercept.teardown();
        });

        describe('When the request matches the specification', function(){

            beforeEach(function(done){
                intercept.start("http://somedomain.com" + pactSpec.interactions[0].request.path, function(err, pactData){
                    if(err) {
                        done(err);
                    }
                    else {
                        pact = pactData;
                    }
                });

                var params = {
                    method: pactSpec.interactions[0].request.method,
                    url: "http://somedomain.com" + pactSpec.interactions[0].request.path,
                    headers: pactSpec.interactions[0].request.headers,
                    body: pactSpec.interactions[0].request.body,
                    json: true
                };

                request(params, function(err, req, body){
                    if(err) {
                        done(err);
                    }
                    else {
                        httpReq = req;
                        httpBody = body;
                        done();
                    }
                });
            });

            it('Should intercept the request and provide the specified statusCode', function(){
                expect(httpReq.statusCode).to.eql(pactSpec.interactions[0].response.status);
            });

            for(var header in pactSpec.interactions[0].response.headers) {
                it('Should provide appropriate response header: ' + header, function(){
                    expect(httpReq.headers[header]).to.eql(pactSpec.interactions[0].response.headers[header]);
                });
            }

            it('Should provide appropriate response body', function(){
                expect(httpBody).to.eql(pactSpec.interactions[0].response.body);
            });

            it('Should intercept the request and return the pact object after verification', function(){
                expect(pact).to.eql(pactSpec);
            });

        });

        describe('When the request fails to match the expectation', function(){

            var assertionErr;

            describe('because of a failure to match method', function(){

                beforeEach(function(done){

                    intercept.start("http://somedomain.com" + pactSpec.interactions[0].request.path, function(err, pactData){
                        if(err) {
                            assertionErr = err;
                            done();
                        }
                        else {
                            done("The test did not yield an error object");
                        }
                    });

                    var params = {
                        method: "put",
                        url: "http://somedomain.com" + pactSpec.interactions[0].request.path,
                        headers: pactSpec.interactions[0].request.headers,
                        body: pactSpec.interactions[0].request.body,
                        json: true
                    };

                    request(params, function(err, req, body){
                        //should never get here
                        if(err) {
                            console.log(err);
                        }
                    });
                });

                it('should show what the expectation should have been', function(){
                    expect(assertionErr.expected).to.equal("post");
                });

                it('Should list the failure (method) in this case as the "actual" result', function(){
                    expect(assertionErr.actual).to.equal('PUT');
                });

                it('should provide a message about what\'s wrong', function(){
                    expect(assertionErr.message).to.equal('HTTP Methods are not equal');
                });
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
});
