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
    return this.getMessageTypeName() + ': request=' + this.requestID + ', value=' + this.value;
};

util.inherits(FloatValue, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.FLOAT_VALUE, FloatValue);

module.exports = FloatValue;

