/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageFactory = require('../../comms/messagefactory.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * An info message
 * @param {String} message the log message
 * @constructor
 * @class
 */
function LogInfo(message) {
    Message.call(this, MessageType.LOG_INFO, PACKET_VERSION);

    this.message = message;
}

LogInfo.prototype.toString = function() {
    return this.getMessageTypeName() + ': ' + this.message;
};

util.inherits(LogInfo, Message);

// Register this message
MessageFactory.registerMessageTypeHandler(MessageType.LOG_INFO, LogInfo);

module.exports = LogInfo;

