/* jshint -W097 */
/* globals require, module */
'use strict';

const q = require('Q'),
    SessionStart = require('../types/messages/sessionstart.js'),
    ResponsePacket = require('../types/responsepacket.js');

/**
 * Handles device authentication
 * @param {SessionService} sessionService the device session management service
 * @constructor
 * @class
 */
function AuthenticationService(sessionService) {

    /**
     * Validates a user's credentials
     * @param {String} id the user/device id
     * @param {String} secret the user's secret
     * @param {RemoteInfo} remoteInfo the sender
     * @returns {Promise<Boolean>} a promise to the validation result
     */
    function validateUser(/*id,
          secret,
          remoteInfo*/) {
        // For now all users are valid
        return q(true);
    }

    /**
     * Authenticate the user
     * @param {RequestPacket} packet
     * @returns {Promise} resolves to a response packet.
     */
    this.authenticate = function(packet) {

        return validateUser(packet.message.id,
                     packet.message.secret,
                     packet.sender)
            .then(function success() {
                return sessionService.startSession(packet.message.id,
                    packet.message.secret,
                    packet.sender);
            })
            .then(function success(sessionId) {
                var message = new SessionStart(sessionId);
                return new ResponsePacket(message, packet.sender);
            });
    };
}

module.exports =  AuthenticationService;
