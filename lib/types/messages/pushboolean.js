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
 * Push a boolean value to a channel
 * @param {String} sessionID the client session ID
 * @param {String} channelPath the target channel path
 * @param {Boolean} value the value to push
 * @constructor
 */
function PushBoolean(sessionID, channelPath, value) {
    Message.call(this, MessageType.PUSH_BOOLEAN, PACKET_VERSION);

    this.sessionID = sessionID;
    this.channelPath = channelPath;
    this.value = value;
}

PushBoolean.prototype.toString = function() {
    return this.getMessageTypeName() + ': channelPath=' + this.channelPath +
            ', sessionID=' + this.sessionID +
            ', value=' + this.value;
};

PushBoolean.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeUUID(this.sessionID)
        .writeString(this.channelPath)
        .writeBoolean(this.value)
        .toBuffer();

    return this.serializeWithHeader(data);
};

PushBoolean.deserialize = function(buffer) {
    var instance = new PushBoolean();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.sessionID = reader.readUUID();
    instance.channelPath = reader.readString();
    instance.value = reader.readBoolean();

    return instance;
};

util.inherits(PushBoolean, Message);

MessageHandlerRegistry.registerMessageTypeHandler(MessageType.PUSH_BOOLEAN, PushBoolean);

module.exports = PushBoolean;
