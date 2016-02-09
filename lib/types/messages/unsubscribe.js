/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    MessageWriter = require('../../comms/messagewriter.js'),
    MessageReader = require('../../comms/messagereader.js'),
    util = require('util');

const PACKET_VERSION = 1;

/*
 * Cancel a previous subscription
 * @param {Number} requestID the subscription request ID
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#unsubscribe|Unsubscribe}
 */
function Unsubscribe(requestID) {
    Message.call(this, MessageType.SUBSCRIBE, PACKET_VERSION);

    this.requestID = requestID;
}

Unsubscribe.prototype.toString = function() {
    return this.getMessageTypeName() + ': requestId=' + this.requestID;
};

util.inherits(Unsubscribe, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.UNSUBSCRIBE, Unsubscribe);

module.exports = Unsubscribe;
