'use strict';

var MITM = require('mitm');
var url = require('url');

var validateRequest = require('./validate-request');
var respond = require('./respond-with-pact');

/**
 * @param {Object} mitm a mitm instance
 * @param {Object} pact A single pact object with a provider and consumer with which to form a reply from
 * @param {String} interceptorUrl The url with which to catch and form a reply on
 * @param {function} cb The callback with signature of (err, data)
 */
function pactInterceptor(mitm, pact, interceptorUrl, cb){

    if (typeof interceptorUrl === 'string'){
        var urlToIntercept = url.parse(interceptorUrl);
    }
    else if(interceptorUrl instanceof RegExp){
        var regexUrl = interceptorUrl;
    }
    var expectedRequest = pact.interactions[0].request;
    var expectedResponse = pact.interactions[0].response;

    mitm.on("request", function(req, res) {

        var matchesOnRegex = regexUrl && req.url.match(regexUrl);
        var matchesOnString = urlToIntercept && req.headers.host === urlToIntercept.host && req.url === urlToIntercept.path;

        if(matchesOnRegex || matchesOnString){
            var requestData = "";
            req.on('data', function(data){
                requestData += data;
            });
            req.on('end', function(){
                try {
                    validateRequest(pact, expectedRequest, requestData, req.headers, req.url, req.method);
                    respond(expectedResponse, res);
                    cb(null, pact);
                }
                catch(e){
                    cb(e);
                }
            });
        }
        else {
            console.warn('Request not matching interceptor rules: ', req.headers.host + req.url);
            res.statusCode = 400;
            res.end();
            cb({
                error: "recevied a request which was not part of the assertion",
                url: req.headers.host + req.url
            });
        }
    });
}

function teardown(mitm){
    mitm.disable();
}

module.exports = function(pact) {

    var mitm = MITM();

    return {
        start: pactInterceptor.bind(null, mitm, pact),
        teardown: teardown.bind(null, mitm)
    };
};
