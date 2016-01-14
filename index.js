'use strict';

var intercept = require('./lib/interceptor');
var async = require('async');
var _ = require('lodash')

/**
* @param {string} providerState A state in pact under test
* @param {object} pact The pact specification
* @param {string/regex} The url to intercept
* @param {function} setState The client state
* @param testSeriesCallback The callback to return test results
*/
module.exports = function(providerState, pact, url, setState, testSeriesCallback) {
  if(!pact || !pact.provider || !pact.consumer || !pact.provider.name || !pact.consumer.name) {
    throw "When creating an interceptor it's necessary to provide a consumer and provider";
  }
  else if(!pact.interactions || pact.interactions.length < 1){
    throw {
      error: "No interactions in pact found",
    };
  }
  else if(_.some(pact.interactions, {provider_state: providerState})) { // provider state exists
    var interaction = _.find(pact.interactions, function(o) { return o.provider_state == providerState; });
    var asyncArray = [];

    asyncArray.push(function(testCallback){
      var interceptor = intercept(pact);
      interceptor.start(url, interaction, function(err) {
        if(err){ // There was a failure in pact assertion(s)
          interceptor.teardown();
          testCallback(null, {
            interaction: interaction,
            failure: err
          });
        }
        else {
          interceptor.teardown();
          testCallback(null, {
            interaction: interaction,
            failure: false
          });
        }
      });
      setState();
    })

    async.series(asyncArray, function(err, results){
      if(err){
        console.error("series failure", err);
      }
      else {
        results.forEach(function(test, index){
          if(test.failure){
            console.log(index, " Test failure: ", test.failure.message);
            console.log("\t", test.interaction.description);
            console.log(test.interaction.provider_state);
            console.log(test.failure);
          }
          // else{
          //   console.log(index, " Test success: ", test.interaction.description);
          //   console.log("\t", test.interaction.provider_state);
          // }
        });
        testSeriesCallback(null, results)
      }
    });
  }
  else {
    throw "No matching provider_state found in pact";
  }
};
