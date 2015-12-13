'use strict';

var r = require('request');

/**
 * A sample function which should POST off to the endpoint in accordance with the pact.
 * In practice this would be some client library whose function it is is to talk to the
 * provider.
 * @param {int} id The ID to fetch
 * @param {object} body The data to send to the server
 * @param {function} cb Standard node callback with signature of (err, result);
 */
module.exports = function(id, body, cb){

    var params = {
        url: "http://somedomain/some-resource/" + id,
        method: 'post',
        json: true,
        headers: {
            authorization: "some Auth header"
        },
        body: body
    }

    r(params, function(err, req, body){
        if(err) {
            console.error(err)
            cb(err)
        }
        else {
            cb(null, body);
        }
    });
};
