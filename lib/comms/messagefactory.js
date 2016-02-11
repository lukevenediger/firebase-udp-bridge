/* jshint -W097 */
/* globals require, module */
'use strict';

const MessageHandlerRegistry = require('./messagehandlerregistry.js'),
    ErrorMessage = require('../types/messages/error.js'),
    ErrorCode = require('../lookups/errorcode.js'),
    MessageReader = require('../comms/messagereader.js');

/**
 * Handles converting messages to binary formats and back again
 * @class
 * @constructor
 */
function MessageFactory() {

    /**
     * Convert a binary buffer into a RequestPacket instance.
     * @param {Buffer} buffer the raw request
     * @returns {Message} a child instance of Message
     * @throws {BadPacketException} if the data cannot be converted into a valid packet
     */
    this.deserialise = function(buffer) {

        // Validate the packet start control code
        new MessageReader(buffer).validatePacketStart();

        var message,
            type = buffer.readInt16LE(),
            handler = MessageHandlerRegistry.getMessageHandler(type);

        if (handler) {
            message = handler.deserialize(buffer);
        } else {
            message = new ErrorMessage(ErrorCode.UNKNOWN_MESSAGE_TYPE);
        }
        return message;
    };
}

module.exports = new MessageFactory();

