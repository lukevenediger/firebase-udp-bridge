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
 * Subscribe for value change events.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {String} path The Firebase path to watch.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#subscribe|Subscribe}
 */
function Subscribe(sessionID, requestID, path) {
    Message.call(this, MessageType.SUBSCRIBE, PACKET_VERSION);

    this.sessionID = sessionID;
    this.requestID = requestID;
    this.path = path;
}

Subscribe.prototype.toString = function() {
    return this.getMessageTypeName() + ': requestId=' + this.requestID + ', path=' + this.path;
};

Subscribe.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeUUID(this.sessionID)
        .writeInt32(this.requestID)
        .writeString(this.path)
        .toBuffer();

    return this.serializeWithHeader(data);
};

Subscribe.deserialize = function(buffer) {
    var instance = new Subscribe();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.sessionID = reader.readUUID();
    instance.requestID = reader.readInt32();
    instance.path = reader.readString();

    return instance;
};

util.inherits(Subscribe, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SUBSCRIBE, Subscribe);

module.exports = Subscribe;
