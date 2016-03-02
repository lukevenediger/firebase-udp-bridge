/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * Push data to a message channel.
 * @param {String} sessionID the client session ID
 * @param {String} path Firebase node path to read from.
 * @param {*} value The value to push into the message queue
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#get|Get}
 */
function Push(sessionID, path, value) {
    Message.call(this, MessageType.PUSH, PACKET_VERSION);

    this.sessionID = sessionID;
    this.path = path;
    this.value = value;
}

Push.deserialize = function(raw) {
    return new Push(raw.sessionID, raw.path, raw.value);
};

util.inherits(Push, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.PUSH, Push);

module.exports = Push;
