/* jshint -W097 */
/* globals require, module */
'use strict';

const q = require('Q');

/**
 * Handles device authentication
 * @constructor
 * @class
 */
function AuthenticationService() {

    /**
     * Authenticate the user
     * @param {String} id the client ID
     * @param {String} secret the client secret
     * @param {RemoteInfo} remoteInfo the client's remote info
     * @returns {Promise<Boolean>} a promise to the authentication outcome
     */
    this.authenticate = function(/*id, secret, remoteInfo*/) {

        return q(true);
    };
}

module.exports =  AuthenticationService;
