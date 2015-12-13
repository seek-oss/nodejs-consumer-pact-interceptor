'use strict';

/**
 *  Reads in the pact expectations and responds according to the specification.
 *
 *  @param {Object} pact The response portion of the pact object
 *  @param {Object} responseSpec The response object from MITM with which to communicate with.
 *  @return undefined - only side-effects
 */
module.exports = function(responseSpec, res){
    res.statusCode = responseSpec.status;
    res.writeHead(200, responseSpec.headers);
    res.end(JSON.stringify(responseSpec.body));
};
