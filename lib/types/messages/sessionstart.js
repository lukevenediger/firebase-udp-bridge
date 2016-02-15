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

/*
 * Send the encrypted session key to the client
 * @param {String} sessionKey the session key
 * @param {Number} serverTime the server timestamp
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#sessionstart|SessionStart}
 */
function SessionStart(sessionID, serverTime) {
    Message.call(this, MessageType.SESSION_START, PACKET_VERSION);

    this.sessionID = sessionID;
    this.serverTime = serverTime;
}

SessionStart.prototype.toString = function() {
    return this.getMessageTypeName() + ': sessionID=' + this.sessionID +
        ', serverTime=' + this.serverTime;
};

SessionStart.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeUUID(this.sessionID)
        .writeUInt64(this.serverTime)
        .toBuffer();

    return this.serializeWithHeader(data);
};

SessionStart.deserialize = function(buffer) {

    var instance = new SessionStart();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.sessionID = reader.readUUID();
    instance.serverTime = reader.readUInt64();

    return instance;
};

util.inherits(SessionStart, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SESSION_START, SessionStart);

module.exports = SessionStart;
