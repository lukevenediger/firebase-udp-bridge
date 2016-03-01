/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/*
 * Cancel a previous subscription
 * @param {String} sessionID the client's session ID
 * @param {Number} requestID the subscription request ID
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#unsubscribe|Unsubscribe}
 */
function Unsubscribe(sessionID, requestID) {
    Message.call(this, MessageType.SUBSCRIBE, PACKET_VERSION);

    this.sessionID = sessionID;
    this.requestID = requestID;
}

Unsubscribe.deserialize = function(raw) {
    return new Unsubscribe(raw.sessionID, raw.requestID);
};

util.inherits(Unsubscribe, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.UNSUBSCRIBE, Unsubscribe);

module.exports = Unsubscribe;
