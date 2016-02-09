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

/*
 * Set a floating-point value.
 * @param {String} path The Firebase path where the value will be saved.
 * @param {Number} value The floating-point value.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#setfloat|SetFloat}
 */
function SetFloat(path, value) {
    Message.call(this, MessageType.SET_FLOAT, PACKET_VERSION);

    this.path = path;
    this.value = value;
}

SetFloat.prototype.toString = function() {
    return this.getMessageTypeName() + ': path=' + this.path + ', value=' + this.value;
};

util.inherits(SetFloat, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SET_FLOAT, SetFloat);

module.exports = SetFloat;
