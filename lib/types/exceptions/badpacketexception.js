'use strict';

const util = require('util');

/**
 * Thrown when a packet can't be decoded to a known format.
 * @param {Object} sender The address and port of the sender
 * @param {Number} packetLength the size of the packet in bytes
 * @param {Error} [innerException] the cause of the error
 * @constructor
 * @class
 * @extends Error
 */
function BadPacketException(sender, packetLength, innerException) {
    Error.call(this, 'Could not decode ' + packetLength + ' byte packet from ' + sender.address + ':' + sender.port);

    this.sender = sender;
    this.packetLength = packetLength;
    this.innerException = innerException;
}

util.inherits(BadPacketException, Error);

module.exports = BadPacketException;
