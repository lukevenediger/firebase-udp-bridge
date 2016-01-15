'use strict';

var q = require('q');

function FirebaseUtility() {

    return {
        /**
         * Sets the value at a node
         * @param {Firebase} target the firebase node
         * @param {*} value the value to save on the target
         * @returns {*|promise}
         */
        set: function(target, value) {
            var deferred = q.defer();

            target.set(value, function complete(error) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve();
                }
            });

            return deferred.promise;
        },
        /**
         * Gets the value at the node
         * @param {Firebase} target the firebase node
         * @returns {*|promise} a promise that resolves to the value
         */
        get: function(target) {
            var deferred = q.defer();

            target.once('value',
                function success(snapshot) {
                    deferred.resolve(snapshot.val());
                },
                function failure(error) {
                    deferred.reject(error);
                }
            );

            return deferred.promise;
        }
    };
}

module.exports = new FirebaseUtility();
