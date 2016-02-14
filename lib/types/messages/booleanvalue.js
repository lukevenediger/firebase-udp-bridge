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

BooleanValue.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeInt32(this.requestID)
        .writeBoolean(this.value)
        .toBuffer();

    return this.serializeWithHeader(data);
};

BooleanValue.deserialize = function(buffer) {
    var instance = new BooleanValue();
    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.requestID = reader.readInt32();
    instance.value = reader.readBoolean();
    return instance;
};

util.inherits(BooleanValue, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.BOOLEAN_VALUE, BooleanValue);

module.exports = BooleanValue;
