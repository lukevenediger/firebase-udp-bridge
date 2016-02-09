/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    MessageWriter = require('../../comms/messagewriter.js'),
    MessageReader = require('../../comms/messagereader.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * Represents an integer value.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {Number} value The integer value
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#integervalue|Integer Value}
 */
function IntegerValue(requestID, value) {
    Message.call(this, MessageType.INTEGER_VALUE, PACKET_VERSION);

    this.requestID = requestID;
    this.value = value;
}

IntegerValue.prototype.toString = function() {
    return this.getMessageTypeName() + ': request=' + this.requestID + ', value=' + this.value;
};

util.inherits(IntegerValue, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.INTEGER_VALUE, IntegerValue);

module.exports = IntegerValue;
