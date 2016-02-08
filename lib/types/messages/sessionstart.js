/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageFactory = require('../../comms/messagefactory.js'),
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

util.inherits(SessionStart, Message);

// Register this message
MessageFactory.registerMessageTypeHandler(MessageType.SESSION_START, SessionStart);

module.exports = SessionStart;
