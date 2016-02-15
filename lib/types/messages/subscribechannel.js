/* jshint -W097 */
/* globals require, module */
'use strict';

const util = require('util'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    MessageWriter = require('../../comms/messagewriter.js'),
    MessageReader = require('../../comms/messagereader.js');

const PACKET_VERSION = 1;

/**
 * Subscribe to a message channel
 * @param {String} sessionID the client's session ID
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {String} path The path of the message channel
 * @class
 * @constructor
 */
function SubscribeChannel(sessionID, requestID, path) {
    Message.call(this, MessageType.SUBSCRIBE_CHANNEL, PACKET_VERSION);

    this.sessionID = sessionID;
    this.requestID = requestID;
    this.path = path;
}

SubscribeChannel.prototype.toString = function() {
    return this.getMessageTypeName() + ': sessionId=' + this.sessionID +
        ', requestId=' + this.requestID +
        ', path=' + this.path;
};

SubscribeChannel.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeUUID(this.sessionID)
        .writeInt32(this.requestID)
        .writeString(this.path)
        .toBuffer();

    return this.serializeWithHeader(data);
};

SubscribeChannel.deserialize = function(buffer) {
    var instance = new SubscribeChannel();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.sessionID = reader.readUUID();
    instance.requestID = reader.readInt32();
    instance.path = reader.readString();

    return instance;
};

util.inherits(SubscribeChannel, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SUBSCRIBE_CHANNEL,
    SubscribeChannel);

module.exports = SubscribeChannel;
