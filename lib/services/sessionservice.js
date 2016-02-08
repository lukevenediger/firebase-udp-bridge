/* jshint -W097 */
/* globals require, module */
'use strict';

const q = require('Q');

/**
 * Manages user sessions
 * @constructor
 */
function SessionService() {

    /**
     * Start a session for this remote device
     * @param {String} id the device ID
     * @param {String} secret the device secret
     * @param {RemoteInfo} remoteInfo the user's remote info
     * @returns {Promise<String} a promise to the session ID
     */
    this.startSession = function(/*id, secret, remoteInfo*/) {
        // For now, everyone gets a random session ID
        return q(new Date().getTime().toString());
    };
}

module.exports = SessionService;
