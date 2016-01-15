'use strict';

var _ = require('underscore'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js');


var PACKET_VERSION = 1,
    PACKET_LENGTH = 12;

/**
 * A ping packet.
 * @param {Number} sequenceNumber the sequence number that needs to be incremented and sent back in the Pong packet
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#ping|Ping Packet}
 */
function Ping(sequenceNumber) {
    this.sequenceNumber = sequenceNumber;

    _.extend(this, new Message(MessageType.PING, PACKET_VERSION, PACKET_LENGTH));
}


module.Exports = Ping;
