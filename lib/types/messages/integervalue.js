'use strict';

var _ = require('underscore'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js');

var PACKET_VERSION = 1,
    PACKET_LENGTH = 16;

/**
 * Represents an integer value.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {Number} value The integer value
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#integervalue|Integer Value}
 */
function IntegerValue(requestID, value) {
    this.requestID = requestID;
    this.value = value;

    _.extend(this, new Message(MessageType.INTEGER_VALUE, PACKET_VERSION, PACKET_LENGTH));
}


module.Exports = IntegerValue;
