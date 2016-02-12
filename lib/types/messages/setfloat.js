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
 * Set a floating-point value.
 * @param {String} sessionID the device's session ID
 * @param {String} path The Firebase path where the value will be saved.
 * @param {Number} value The floating-point value.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#setfloat|SetFloat}
 */
function SetFloat(sessionID, path, value) {
    Message.call(this, MessageType.SET_FLOAT, PACKET_VERSION);

    this.sessionID = sessionID;
    this.path = path;
    this.value = value;
}

SetFloat.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeUUID(this.sessionID)
        .writeString(this.path)
        .writeFloat(this.value)
        .toBuffer();
    return this.serializeWithHeader(data);
};

SetFloat.deserialize = function(buffer) {
    var instance = new SetFloat();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.sessionID = reader.readUUID();
    instance.path = reader.readString();
    instance.value = reader.readInt32();

    return instance;
};

SetFloat.prototype.toString = function() {
    return this.getMessageTypeName() + ': path=' + this.path + ', value=' + this.value;
};

util.inherits(SetFloat, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SET_FLOAT, SetFloat);

module.exports = SetFloat;
