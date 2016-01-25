/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    util = require('util');

const PACKET_VERSION = 1;

/*
 * Set an integer value.
 * @param {String} path The Firebase path where the value will be saved.
 * @param {Number} value The integer value.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#setinteger|SetInteger}
 */
function SetInteger(path, value) {
    Message.call(this, MessageType.SET_INTEGER, PACKET_VERSION);

    this.path = path;
    this.value = value;
}

SetInteger.prototype.toString = function() {
    return MessageType.getMessageTypeName(this.type) + ': path=' + this.path + ', value=' + this.value;
};

util.extend(SetInteger, Message);

module.Exports = SetInteger;
