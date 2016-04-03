/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * A log message
 * @param {String} sessionID the session ID
 * @param {LogLevel} level the log message level
 * @param {String} module the client module
 * @param {String} message the log message
 * @constructor
 * @class
 */
function Log(sessionID, level, module, message) {
    Message.call(this, MessageType.LOG, PACKET_VERSION);

    this.sessionID = sessionID;
    this.level = level;
    this.module = module;
    this.message = message;
}

Log.deserialize = function(raw) {
    return new Log(raw.sessionID, raw.level, raw.module, raw.message);
};

util.inherits(Log, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.LOG, Log);

module.exports = Log;

