/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * An info message
 * @param {String} sessionID the session ID
 * @param {String} message the log message
 * @constructor
 * @class
 */
function LogInfo(sessionID, message) {
    Message.call(this, MessageType.LOG_INFO, PACKET_VERSION);

    this.sessionID = sessionID;
    this.message = message;
}

LogInfo.deserialize = function(raw) {
    return new LogInfo(raw.sessionID, raw.message);
};

util.inherits(LogInfo, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.LOG_INFO, LogInfo);

module.exports = LogInfo;

