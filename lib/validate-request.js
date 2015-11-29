'use strict';

var validator = require('node-consumer-pact-validation');

/**
 * A simple syncronous function which receives a raw request body, headers and url
 * and asserts that they are as per the pact specification.  If it fails to match, 
 * it will throw an assertion error. 
 */
module.exports = function(expectedRequest, requestBody, headers, url){

    var actual = {
        headers: headers, 
        path: url,
    }; 

    try {
        actual.body = JSON.parse(requestBody);
    }
    catch(e){ //possibly not JSON ? 
        actual.body = requestBody;
    }

    //Throws if it fails to verify
    validator(expectedRequest, actual);
};
