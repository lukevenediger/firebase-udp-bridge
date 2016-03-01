/* jshint -W097 */
/* globals module, require, JSON */
'use strict';

const MessageType = require('../../lookups/messagetype.js'),
    _ = require('underscore');

/**
 * The base type for all messages
 * @param {Number} type The message type
 * @param {Number} version The message structure version
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#packet-header|Packet Header}
 */
function Message(type, version) {
    this.type = type;
    this.version = version;
}

/**
 * Return the message type name
 * @returns {String}
 */
Message.prototype.getMessageTypeName = function() {
    return _.invert(MessageType)[this.type];
};

Message.prototype.toString = function() {
    return JSON.stringify(this);
};

module.exports = Message;
