/* jshint -W097 */
/* globals require, module */
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
    Error.call(this, this.getErrorMessageText());

    this.sender = sender;
    this.packetLength = packetLength;
    this.innerException = innerException;
}

/**
 * Return the error text
 * @returns {string}
 */
BadPacketException.prototype.getErrorMessageText = function() {
    return 'Could not decode ' +
        this.packetLength +
        ' byte packet from ' +
        this.sender;
};

BadPacketException.prototype.toString = function() {
    var text = this.getErrorMessageText();
    if (this.innerException) {
        text += ' Inner exception: ' + this.innerException.message;
    }
    return text;
};

util.inherits(BadPacketException, Error);

module.exports = BadPacketException;
