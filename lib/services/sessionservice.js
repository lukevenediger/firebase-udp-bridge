/* jshint -W097 */
/* globals require, module */
'use strict';

const q = require('Q'),
    uuid = require('node-uuid');

/**
 * Manages user sessions
 * @constructor
 * @class
 */
function SessionService() {

    function initialize() {
    }

    /**
     * Start a session for this remote device
     * @param {String} id the device ID
     * @param {String} secret the device secret
     * @param {RemoteInfo} remoteInfo the user's remote info
     * @returns {Promise<String>} a promise to the session ID
     */
    this.startSession = function(/*id, secret, remoteInfo*/) {
        return q(uuid.v4());
    };

    initialize();
}

module.exports = SessionService;
