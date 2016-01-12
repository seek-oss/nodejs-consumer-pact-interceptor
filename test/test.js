'use strict';
// FIXME Make this code DRYer,
// The GET and POST examples are essentially duplicated code.
// I was generating tests in a loop over the pact examples, but
// mocha was getting confused (as was I).

var request = require('request');
var expect = require('chai').expect;
var intercept  = require('../index.js');

var pactSpec = require('./simple-GET-pact.json');
var httpReq;
var httpBody;

describe('When the request matches the specification', function(){
    before(function(){
      var params = {
          method: "get",
          url: "http://somedomain.com",
          headers: { authorization: "some Auth header" },
          json: true
      };

      var setState = function(err, interaction, cb){
        request(params, function(err, req, body){
            if(err) {
                //done(err);
            }
            else {
                httpReq = req;
                httpBody = body;
            }
        });
      };

      intercept(pactSpec, /.*/, setState, function(err, testResults){
        if(err){
          console.error(err); //Failure in setting up tests
        }
      });
    });

    it('Should intercept the request and provide the specified statusCode', function(){
        expect(httpReq.statusCode).to.eql(pactSpec.interactions[0].response.status);
    });
});
