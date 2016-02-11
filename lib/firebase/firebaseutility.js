/* jshint -W097 */
/* globals require, module */
'use strict';

var q = require('q'),
    FirebaseNodes = require('../lookups/firebasenodes.js');

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

    /**
     * Resolve a path to be rooted in the Data/ root node
     * @param {Firebase} firebase the firebase instance
     * @param {String} path the node path
     * @returns {Firebase} the child node
     */
    this.getDataChild = function(firebase, path) {
        if (path[0] === '/') {
            throw new Error("Path cannot start with '/'");
        }
        var parts = path.split('/');
        return firebase
            .root()
            .child(FirebaseNodes.DATA_ROOT)
            .child(path);
    }
}

module.exports = new FirebaseUtility();
