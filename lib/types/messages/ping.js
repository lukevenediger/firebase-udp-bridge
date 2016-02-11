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
 * A ping packet.
 * @class
 * @constructor
 * @param {String} sessionID the client's session ID.
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#ping|Ping}
 */
function Ping(sessionID) {
    Message.call(this, MessageType.PING, PACKET_VERSION);

    this.sessionID = sessionID;
}

Ping.prototype.toString = function() {
    return this.getMessageTypeName();
};

Ping.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeUUID(this.sessionID)
        .toBuffer();

    return this.serializeWithHeader(data);
};

Ping.deserialize = function(buffer) {
    var instance = new Ping();
    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.sessionID = reader.readUUID();

    return instance;
};

util.inherits(Ping, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.PING, Ping);

module.exports = Ping;
