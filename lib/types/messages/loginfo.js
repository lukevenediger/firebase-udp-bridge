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

LogInfo.prototype.toString = function() {
    return this.getMessageTypeName() + ': ' + this.message;
};

LogInfo.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeUUID(this.sessionID)
        .writeString(this.message)
        .toBuffer();

    return this.serializeWithHeader(data);
};

LogInfo.deserialize = function(buffer) {
    var instance = new LogInfo();

    var currentPosition = instance.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    instance.sessionID = reader.readUUID();
    instance.message = reader.readString();

    return instance;
};

util.inherits(LogInfo, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.LOG_INFO, LogInfo);

module.exports = LogInfo;

