/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * Holds a value as a result of an event or a get
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {*} value The value
 * @class
 * @constructor
 */
function Value(requestID, value) {
    Message.call(this, MessageType.VALUE, PACKET_VERSION);

    this.requestID = requestID;
    this.value = value;
}

Value.deserialize = function(raw) {
    return new Value(raw.requestID, raw.value);
};

util.inherits(Value, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.VALUE, Value);

module.exports = Value;
