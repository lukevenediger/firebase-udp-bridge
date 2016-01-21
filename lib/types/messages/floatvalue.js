'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * Represents a floating-point value.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {Number} value The floating-point value
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#floatvalue|Float Value}
 */
function FloatValue(requestID, value) {
    Message.call(this, MessageType.FLOAT_VALUE, PACKET_VERSION);

    this.requestID = requestID;
    this.value = value;
}

FloatValue.prototype.toString = function() {
    return MessageType.getMessageTypeName(this.type) + ': request=' + this.requestID + ', value=' + this.value;
};

util.extend(FloatValue, Message);

module.Exports = FloatValue;

