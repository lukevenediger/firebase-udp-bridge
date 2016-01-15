'use strict';

var _ = require('underscore'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js');

var PACKET_VERSION = 1,
    PACKET_LENGTH = 12;

/**
 * A pong packet. Sent in response to a Ping.
 * @param {Number} sequenceNumber the sequence number that needs to be incremented and sent back in the Pong packet
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#pong|Pong Packet}
 */
function Pong(sequenceNumber) {
    this.sequenceNumber = sequenceNumber;

    _.extend(this, new Message(MessageType.PONG, PACKET_VERSION, PACKET_LENGTH));
}


module.Exports = Pong;
