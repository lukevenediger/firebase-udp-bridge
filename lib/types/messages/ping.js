/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * A ping packet.
 * @param {Number} sequenceNumber the sequence number that needs to be incremented and sent back in the Pong packet
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#ping|Ping}
 */
function Ping(sequenceNumber) {
    Message.call(this, MessageType.PING, PACKET_VERSION);

    this.sequenceNumber = sequenceNumber;
}

Ping.prototype.toString = function() {
    return this.getMessageTypeName() + ': sequenceNumber=' + this.sequenceNumber;
};

util.inherits(Ping, Message);

module.exports = Ping;
