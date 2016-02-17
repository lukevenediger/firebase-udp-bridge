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
 * Set a string value.
 * @param {String} sessionID the client session ID
 * @param {String} path The Firebase path where the value will be saved.
 * @param {String} value The String value
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#setstring|SetString}
 */
function SetString(sessionID, path, value) {
    Message.call(this, MessageType.SET_STRING, PACKET_VERSION);

    this.sessionID = sessionID;
    this.path = path;
    this.value = value;
}

SetString.prototype.toString = function() {
    return this.getMessageTypeName() + ': path=' + this.path + ', value=' + this.value;
};

SetString.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeUUID(this.sessionID)
        .writeString(this.path)
        .writeString(this.value)
        .toBuffer();

    return this.serializeWithHeader(data);
};

SetString.deserialize = function(buffer) {
    var instance = new SetString();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.sessionID = reader.readUUID();
    instance.path = reader.readString();
    instance.value = reader.readString();

    return instance;
};

util.inherits(SetString, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SET_STRING, SetString);

module.exports = SetString;
