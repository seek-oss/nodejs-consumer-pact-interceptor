'use strict';

var intercept = require('./lib/interceptor');
var async = require('async');

/**
* @param {object} pact The pact specification
* @param {string/regex} The url to intercept
* @param {function} A function to make a http request that will be intercepted
* @param cb The callback to fire on *each* interaction
*/
module.exports = function(pact, url, setState, testSeriesCallback) {
  if(!pact || !pact.provider || !pact.consumer || !pact.provider.name || !pact.consumer.name) {
    throw "When creating an interceptor it's necessary to provide a consumer and provider";
  }
  else if(!pact.interactions || pact.interactions.length < 1){
    throw {
      error: "No interactions in pact found",
    };
  }
  else {

    var asyncArray = [];

    pact.interactions.forEach(function(interaction) {

      asyncArray.push(function(testCallback){
        let interceptor = intercept(pact);
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
        setState(null, interaction, function(err){
          //console.log("after interception", err)
        });
      })
    });

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
          else{
            console.log(index, " Test success: ", test.interaction.description);
            console.log("\t", test.interaction.provider_state);
          }
        });
        testSeriesCallback(null, results)
      }
    });
  }
};
