'use strict';

var FirebaseUtility = require('./firebaseutility.js');

/**
 * Handles data reads and writes (not change events)
 * @param {Firebase} rootFirebase the root firebase node
 * @constructor
 */
function QueryService(rootFirebase) {

    // Public API
    return {
        /**
         * Gets a value at a node
         * @param message the request message
         * @param client the remote client
         * @returns {Promise} resolves to a response message
         */
        get: function(message, client) {
        },
        /**
         * Sets a number value at a node
         * @param message the request message
         * @param client the remote client
         * @returns {Promise} resolves to a response message
         */
        setNumber: function(message, client) {
            return FirebaseUtility.set(rootFirebase.child(message.path), message.value);
        }
    };
}

module.exports = QueryService;
