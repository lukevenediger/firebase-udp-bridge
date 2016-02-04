/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * Represents a boolean value.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {Boolean} value The boolean value
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#booleanvalue|Boolean Value}
 */
function BooleanValue(requestID, value) {
    Message.call(this, MessageType.BOOLEAN_VALUE, PACKET_VERSION);

    this.requestID = requestID;
    this.value = value;
}

BooleanValue.prototype.toString = function() {
    return this.getMessageTypeName() + ': request=' + this.requestID + ', value=' + this.value;
};

util.inherits(BooleanValue, Message);

module.exports = BooleanValue;
