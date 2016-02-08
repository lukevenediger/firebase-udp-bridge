/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageFactory = require('../../comms/messagefactory.js'),
    util = require('util');

const PACKET_VERSION = 1;

/*
 * Notify the client that an error occurred
 * @param {String} path The Firebase path where the value will be saved.
 * @param {Number} errorCode The error code
 * @param {String} [description] Further information about the error
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#error|Error}
 */
function Error(errorCode, description) {
    Message.call(this, MessageType.ERROR, PACKET_VERSION);

    this.errorCode = errorCode;
    this.description = description;
}

Error.prototype.toString = function() {
    return this.getMessageTypeName() + ': [' + this.errorCode + '] ' + (this.description || '');
};

util.inherits(Error, Message);

// Register this message
MessageFactory.registerMessageTypeHandler(MessageType.ERROR, Error);

module.exports = Error;
