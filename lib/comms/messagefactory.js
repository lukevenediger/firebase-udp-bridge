/* jshint -W097 */
/* globals require, module */
'use strict';

const MessageHandlerRegistry = require('./messagehandlerregistry.js'),
    RequestPacket = require('../types/requestpacket.js'),
    BadPacketException = require('../types/exceptions/badpacketexception.js'),
    ErrorMessage = require('../types/messages/error.js'),
    ErrorCode = require('../lookups/errorcode.js');

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

        var type = buffer.readInt16LE();
        try {
            var message;
            var handler = MessageHandlerRegistry.getMessageHandler(type);
            if (handler) {
                message = handler.deserialize(buffer);
            } else {
                message = new ErrorMessage(ErrorCode.UNKNOWN_MESSAGE_TYPE);
            }
            return message;
        } catch (error) {
            throw new BadPacketException(remoteInfo, buffer.length, error);
        }
    };
}

module.exports = new MessageFactory();

