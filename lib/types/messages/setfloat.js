'use strict';

var _ = require('underscore'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js');

var PACKET_VERSION = 1;

/*
 * Set a floating-point value.
 * @param {String} path The Firebase path where the value will be saved.
 * @param {Number} value The floating-point value.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#setfloat|SetFloat}
 */
function SetFloat(path, value) {
    this.path = path;
    this.value = value;

    _.extend(this, new Message(MessageType.SET_FLOAT, PACKET_VERSION, path.length + 4 + 4));
}

module.Exports = SetFloat;
