'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    util = require('util');

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

util.extend(LogInfo, Message);

module.exports = LogInfo;

