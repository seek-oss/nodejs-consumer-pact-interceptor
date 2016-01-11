'use strict';

/**
 *  Reads in the pact expectations and responds according to the specification.
 *
 *  @param {Object} pact The response portion of the pact object
 *  @param {Object} responseSpec The response object from MITM with which to communicate with.
 *  @return undefined - only side-effects
 */
module.exports = function(responseSpec, res){

    var body;
    var headers = responseSpec.headers;
    var statusCode = responseSpec.status;

    //Send statuscode and headers:
    res.writeHead(statusCode, headers);

    //Send body:
    if(responseSpec.body && typeof responseSpec.body === 'string'){
        body = responseSpec.body;
    }
    else if(responseSpec.body){ //Assume it's JSON
        body = JSON.stringify(responseSpec.body);
        res.end(body);
    }
    else { //No body to be sent
        res.end();
    }
};
