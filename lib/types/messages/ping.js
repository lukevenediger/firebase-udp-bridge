/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * A ping packet.
 * @class
 * @constructor
 * @param {String} sessionID the client's session ID.
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#ping|Ping}
 */
function Ping(sessionID) {
    Message.call(this, MessageType.PING, PACKET_VERSION);

    this.sessionID = sessionID;
}

Ping.deserialize = function(raw) {
    return new Ping(raw.sessionID);
};

util.inherits(Ping, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.PING, Ping);

module.exports = Ping;
