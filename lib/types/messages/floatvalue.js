'use strict';

var _ = require('underscore'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js');

var PACKET_VERSION = 1,
    PACKET_LENGTH = 16;

/**
 * Represents a floating-point value.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {Number} value The floating-point value
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#floatvalue|Float Value}
 */
function FloatValue(requestID, value) {
    this.requestID = requestID;
    this.value = value;

    _.extend(this, new Message(MessageType.FLOAT_VALUE, PACKET_VERSION, PACKET_LENGTH));
}


module.Exports = FloatValue;

