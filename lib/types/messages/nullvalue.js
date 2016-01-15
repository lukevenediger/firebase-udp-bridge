'use strict';

var _ = require('underscore'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js');

var PACKET_VERSION = 1,
    PACKET_LENGTH = 4;

/*
 * Represents a Null value.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#nullvalue|Null Value}
 */
function NullValue(requestID) {
    this.requestID = requestID;
    this.value = value;

    _.extend(this, new Message(MessageType.NULL_VALUE, PACKET_VERSION, PACKET_LENGTH));
}

module.Exports = NullValue;
