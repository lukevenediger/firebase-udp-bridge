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
}

NullValue.prototype.toString = function() {
    return this.getMessageTypeName() + ': request=' + this.requestID;
};

NullValue.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeInt32(this.requestID)
        .toBuffer();

    return this.serializeWithHeader(data);
};

NullValue.deserialize = function(buffer) {
    var instance = new NullValue();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.requestID = reader.readInt32();

    return instance;
};

util.inherits(NullValue, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.NULL_VALUE, NullValue);

module.exports = NullValue;
