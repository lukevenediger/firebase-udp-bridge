'use strict';

var config = require('./configurationservice.js');

/**
 * Provides functions for handling data encryption and connection security.
 * @class
 * @constructor
 */
function SecurityService() {

    /***
     * Decrypt the session key
     * @param {String} encryptedKey the encrypted key
     * @returns {String} the decrypted key
     */
    this.decryptSessionKey = function(encryptedKey) {
        return encryptedKey;
    };
}

module.exports = new SecurityService();
