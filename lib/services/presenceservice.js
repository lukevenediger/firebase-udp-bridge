/* jshint -W097 */
/* globals require, module, setTimeout */
'use strict';

const q = require('q');

/**
 * Handles presence tracking for connected clients
 * @param {Number} pingDelayMS an acceptable time to wait for a ping from the client
 * @constructor
 * @class
 */
function PresenceService(pingDelayMS) {

    var presenceCheckTimeoutHandle;

    function initialize() {
        presenceCheckTimeoutHandle = setTimeout(tick, pingDelayMS / 2);
    }

    function tick() {
        // Do nothing. This will become where we search for all
        // devices that haven't pinged us after a set time
        // and update their connection status.
    }

    /**
     * Update the last-activity timestamp for this session
     * @param {String} sessionID the session ID
     * @returns {Promise<null>} resolves after the update has completed.
     */
    this.updateLastTouch = function() {
        return q();
    };

    initialize();
}

module.exports = PresenceService;
