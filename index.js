'use strict';

var interceptor = require('./lib/interceptor');

module.exports = function(pact){

    if(!pact || !pact.provider || !pact.consumer || !pact.provider.name || !pact.consumer.name) {
        throw "When creating an interceptor it's necessary to provide a consumer and provider";
    }
    else if(!pact.interactions || pact.interactions.length < 1){
        throw {
            error: "No interactions in pact found",
        };
    }
    else if(pact.interactions.length > 1){
        throw {
            error: "No more than a single interaction per provider is currently supported",
            found: pact.interactions.length
        };
    }

    return interceptor(pact);
};
