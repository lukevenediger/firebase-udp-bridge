'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * A pong packet. Sent in response to a Ping.
 * @param {Number} sequenceNumber the sequence number that needs to be incremented and sent back in the Pong packet
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#pong|Pong Packet}
 */
function Pong(sequenceNumber) {
    Message.call(this, MessageType.PONG, PACKET_VERSION);

    this.sequenceNumber = sequenceNumber;
}

Pong.prototype.toString = function() {
    return MessageType.getMessageTypeName(this.type) + ': sequenceNumber=' + this.sequenceNumber;
};

util.extend(Pong, Message);

module.Exports = Pong;
