/* jshint -W097 */
/* globals require, module */
'use strict';

const util = require('util'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js');

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

SessionStart.deserialize = function(raw) {
    return new SessionStart(raw.sessionID, raw.serverTime);
};

util.inherits(SessionStart, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SESSION_START, SessionStart);

module.exports = SessionStart;
