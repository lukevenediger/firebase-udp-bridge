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
 * @param {String} module the client module
 * @param {String} message the log message
 * @constructor
 * @class
 */
function Log(sessionID, module, message) {
    Message.call(this, MessageType.LOG, PACKET_VERSION);

    this.sessionID = sessionID;
    this.module = module;
    this.message = message;
}

LogInfo.deserialize = function(raw) {
    return new LogInfo(raw.sessionID, raw.module, raw.message);
};

util.inherits(Log, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.LOG, Log);

module.exports = Log;

