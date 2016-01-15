'use strict';

var _ = require('underscore'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js');

var PACKET_VERSION = 1;

/*
 * Represents a String value.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {String} value The String value
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#stringvalue|String Value}
 */
function StringValue(requestID, value) {
    this.requestID = requestID;
    this.value = value;

    _.extend(this, new Message(MessageType.STRING_VALUE, PACKET_VERSION, value.length));
}


module.Exports = StringValue;


