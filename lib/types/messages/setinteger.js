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
 * Set an integer value.
 * @param {String} sessionID the session ID
 * @param {String} path The Firebase path where the value will be saved.
 * @param {Number} value The integer value.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#setinteger|SetInteger}
 */
function SetInteger(sessionID, path, value) {
    Message.call(this, MessageType.SET_INTEGER, PACKET_VERSION);

    this.sessionID = sessionID;
    this.path = path;
    this.value = value;
}

SetInteger.prototype.toString = function() {
    return this.getMessageTypeName() + ': path=' + this.path + ', value=' + this.value;
};

SetInteger.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeUUID(this.sessionID)
        .writeString(this.path)
        .writeInt32(this.value)
        .toBuffer();

    return this.serializeWithHeader(data);
};

SetInteger.deserialize = function(buffer) {
    var instance  = new SetInteger();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    reader.sessionID = reader.readUUID();
    this.path = reader.readString();
    this.value = reader.readInt32();

    return instance;
};

util.inherits(SetInteger, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SET_INTEGER, SetInteger);

module.exports = SetInteger;
