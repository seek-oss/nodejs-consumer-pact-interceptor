'use strict';

var MITM = require('mitm');
var mitm = MITM();
var url = require('url');

function pactInterceptor(provider, consumer, interceptorUrl, cb){
    
    var urlToIntercept = url.parse(interceptorUrl);

    mitm.on("request", function(req, res) {
        if(req.headers.host === urlToIntercept.host && req.url === urlToIntercept.path){
            cb("something's not done");
        }
        else {
            console.log('Request not matching interceptor rules: ', req.headers.host + req.url)
        }
    });
}

function teardown(){
    mitm.disable();
}

module.exports = {
    start: pactInterceptor,
    teardown: teardown
};
