/* jshint -W097 */
/* globals require, module */
'use strict';

var q = require('q'),
    MessageType = require('./../lookups/messagetype.js'),
    Message = require('../types/messages/message.js'),
    Packet = require('../types/requestpacket.js');
/**
 * Handles presence tracking for connected clients
 * @constructor
 */
function PresenceService() {

    /**
     * Handles a ping request
     * @param {Packet} request the ping request
     * @param {RemoteInfo} client the remote client
     * @returns {Promise} promise that resolves to a ResponsePacket
     */
    this.ping = function(request, client) {
        var message = new Message(MessageType.PONG, {
            sequenceNumber: request.sequenceNumber + 1
        });

        var packet = new Packet(message, client);

        return q(packet);
    };
}

module.exports = PresenceService;
