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

/**
 * A pong packet. Sent in response to a Ping.
 * @param {Number} sequenceNumber the sequence number that needs to be incremented and sent back in the Pong packet
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#pong|Pong}
 */
function Pong(sequenceNumber) {
    Message.call(this, MessageType.PONG, PACKET_VERSION);

    this.sequenceNumber = sequenceNumber;
}

Pong.prototype.toString = function() {
    return this.getMessageTypeName() + ': sequenceNumber=' + this.sequenceNumber;
};

util.inherits(Pong, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.PONG, Pong);

module.exports = Pong;
