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
    return this.getMessageTypeName() + ': request=' + this.requestID + ', value=' + this.value;
};

StringValue.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeInt32(this.requestID)
        .writeString(this.value)
        .toBuffer();

    return this.serializeWithHeader(data);
};

StringValue.deserialize = function(buffer) {
    var instance = new StringValue();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.requestID = reader.readInt32();
    instance.value = reader.readString();

    return instance;
};

util.inherits(StringValue, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.STRING_VALUE, StringValue);

module.exports = StringValue;


