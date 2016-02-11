/* jshint -W097 */
/* globals require, module */
'use strict';

const MessageHandlerRegistry = require('./messagehandlerregistry.js'),
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

        var reader = new MessageReader(buffer);

        // Validate the packet start control code
        reader.validatePacketStart();

        var type = reader.readInt16(),
            handler = MessageHandlerRegistry.getMessageHandler(type);

        if (!handler) {
           throw new Error('Unknown message type or missing message handler.');
        }
        return handler.deserialize(buffer);
    };
}

module.exports = new MessageFactory();

