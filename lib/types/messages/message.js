/* jshint -W097 */
/* globals module, require */
'use strict';

const MessageType = require('../../lookups/messagetype.js'),
    MessageBuilder = require('../../comms/messagebuilder.js'),
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

/**
 * Serialise the message and include the message header
 * @param {Buffer} data the payload
 * @returns {Buffer} the complete message with header
 */
Message.prototype.serializeWithHeader = function(data) {
    return new MessageBuilder()
        .writeInteger(this.type)
        .writeInteger(this.version)
        .writeInteger(data.length)
        .writeBuffer(data)
        .toBuffer();
};

module.exports = Message;
