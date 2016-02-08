/* jshint -W097 */
/* globals module, require */
'use strict';

const MessageType = require('../../lookups/messagetype.js'),
    MessageWriter = require('../../comms/messagewriter.js'),
    MessageReader = require('../../comms/messagereader.js'),
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
    return new MessageWriter()
        .writeInt16(this.type)
        .writeInt16(this.version)
        .writeInt32(data.length)
        .writeBuffer(data)
        .toBuffer();
};

/**
 * Set the message header properties from the buffer
 * @param {Buffer} buffer the raw message
 * @returns {Number} the length of the header
 */
Message.prototype.deserializeHeader = function(buffer) {
    var reader = new MessageReader(buffer);
    this.type = reader.readInt16();
    this.version = reader.readInt16();
    return reader.getCurrentOffset();
};

module.exports = Message;
