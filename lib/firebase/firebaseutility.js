/* jshint -W097 */
/* globals require, module */
'use strict';

var q = require('q');

/**
 * Helper functions for working with Firebase
 * @constructor
 * @class
 */
function FirebaseUtility() {

    /**
     * Authenticate the client using a custom token
     * @param {Firebase} firebase the firebase token
     * @param {String} token the auth token
     * @returns {Promise<null>} the promise of an authentication outcome
     */
    this.authWithCustomToken = function (firebase, token) {
        var deferred = q.defer();

        firebase.authWithCustomToken(token,
            function complete(error) {
                if (error) {
                    q.reject(error);
                } else {
                    q.resolve();
                }
            });

        return deferred.promise;
    };
}

module.exports = new FirebaseUtility();
