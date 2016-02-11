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
 * A get packet.
 * @param {String} sessionID the client session ID
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {String} path Firebase node path to read from.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#get|Get}
 */
function Get(sessionID, requestID, path) {
    Message.call(this, MessageType.GET, PACKET_VERSION);

    this.sessionID = sessionID;
    this.requestID = requestID;
    this.path = path;
}

Get.prototype.toString = function() {
    return this.getMessageTypeName() + ': requestID=' + this.requestID + ', path=' + this.path;
};

Get.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeUUID(this.sessionID)
        .writeInt32(this.requestID)
        .writeString(this.path)
        .toBuffer();

    return this.serializeWithHeader(data);
};

Get.deserialize = function(buffer) {
    var instance = new Get();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.sessionID = reader.readUUID();
    instance.requestID = reader.readInt32();
    instance.path = reader.readString();

    return instance;
};

util.inherits(Get, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.GET, Get);

module.exports = Get;
