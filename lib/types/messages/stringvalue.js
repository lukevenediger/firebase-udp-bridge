/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    util = require('util');

const PACKET_VERSION = 1;

/*
 * Represents a String value.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {String} value The String value
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#stringvalue|String Value}
 */
function StringValue(requestID, value) {
    Message.call(this, MessageType.STRING_VALUE, PACKET_VERSION);

    this.requestID = requestID;
    this.value = value;
}

StringValue.prototype.toString = function() {
    return MessageType.getMessageTypeName(this.type) + ': request=' + this.requestID + ', value=' + this.value;
};

util.extend(StringValue, Message);

module.Exports = StringValue;


