/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
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

module.exports = SetFloat;
