'use strict';

module.exports = function(config){

    var interceptor = require('./lib/interceptor');
    if(!config.provider || !config.consumer) {
        throw "When creating an interceptor it's necessary to provide a consumer and provider" 
    }

    return {
        start: interceptor.start.bind(null, config.provider, config.consumer),
        teardown: interceptor.teardown
    };
};
