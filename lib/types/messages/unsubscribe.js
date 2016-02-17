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
 * Cancel a previous subscription
 * @param {String} sessionID the client's session ID
 * @param {Number} requestID the subscription request ID
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#unsubscribe|Unsubscribe}
 */
function Unsubscribe(sessionID, requestID) {
    Message.call(this, MessageType.SUBSCRIBE, PACKET_VERSION);

    this.sessionID = sessionID;
    this.requestID = requestID;
}

Unsubscribe.prototype.toString = function() {
    return this.getMessageTypeName() + ': requestId=' + this.requestID;
};

Unsubscribe.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeUUID(this.sessionID)
        .writeInt32(this.requestID)
        .toBuffer();
    return this.serializeWithHeader(data);
};

Unsubscribe.prototype.deserialize = function(buffer) {
    var instance = new Unsubscribe();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.sessionID = reader.readUUID();
    instance.requestID = reader.readInt32();
    return instance;
};

util.inherits(Unsubscribe, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.UNSUBSCRIBE, Unsubscribe);

module.exports = Unsubscribe;
