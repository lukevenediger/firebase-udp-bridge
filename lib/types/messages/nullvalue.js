/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    util = require('util');

const PACKET_VERSION = 1;

/*
 * Represents a Null value.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#nullvalue|Null Value}
 */
function NullValue(requestID) {
    Message.call(this, MessageType.NULL_VALUE, PACKET_VERSION);

    this.requestID = requestID;
    this.value = value;
}

IntegerValue.prototype.toString = function() {
    return MessageType.getMessageTypeName(this.type) + ': request=' + this.requestID;
};

util.extend(NullValue, Message);

module.Exports = NullValue;
