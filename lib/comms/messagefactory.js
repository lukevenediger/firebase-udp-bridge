/* jshint -W097 */
/* globals require, module */
'use strict';

const _ = require('underscore'),
    MessageHandlerRegistry = require('./messagehandlerregistry.js'),
    MessageType = require('../lookups/messagetype.js');

/**
 * Handles converting messages to binary formats and back again
 * @class
 * @constructor
 */
function MessageFactory() {

    var invertedMessageTypes = _.invert(MessageType);

    /**
     * Convert a binary buffer into a RequestPacket instance.
     * @param {Buffer} buffer the raw request
     * @returns {Message} a child instance of Message
     * @throws {BadPacketException} if the data cannot be converted into a valid packet
     */
    this.deserialise = function(buffer) {

        var rawJSON = buffer.readJSON();
        var obj = JSON.parse(rawJSON);
        var type = obj.type;

        // Make sure it's a message we understand
        if (type) {
            if (!invertedMessageTypes.hasOwnProperty(type)) {
                throw new Error('Unknown message type:' + type);
            }
        } else {
            throw new Error('Missing message type.');
        }

        var handler = MessageHandlerRegistry.getMessageHandler(type);

        if (!handler) {
           throw new Error('Unknown message type or missing message handler.');
        }

        return handler.deserialize(buffer);
    };
}

module.exports = new MessageFactory();

