'use strict';

var _ = require('underscore'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js');

var PACKET_VERSION = 1;

/*
 * Set an integer value.
 * @param {String} path The Firebase path where the value will be saved.
 * @param {Number} value The integer value.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#setinteger|SetInteger}
 */
function SetInteger(path, value) {
    this.path = path;
    this.value = value;

    _.extend(this, new Message(MessageType.SET_INTEGER, PACKET_VERSION, path.length + 4 + 4));
}

module.Exports = SetInteger;
