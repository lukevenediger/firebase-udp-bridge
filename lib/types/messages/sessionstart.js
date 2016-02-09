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
 * Send the encrypted session key to the client
 * @param {String} sessionKey the session key
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#sessionstart|SessionStart}
 */
function SessionStart(secret) {
    Message.call(this, MessageType.SESSION_START, PACKET_VERSION);

    this.secret = secret;
}

SessionStart.prototype.toString = function() {
    return this.getMessageTypeName() + ': secret=' + this.secret;
};

SessionStart.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeString(this.secret)
        .toBuffer();

    return this.serializeWithHeader(data);
};

SessionStart.deserialize = function(buffer) {

    var instance = new SessionStart();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.secret = reader.readString();

    return instance;
};

util.inherits(SessionStart, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SESSION_START, SessionStart);

module.exports = SessionStart;
