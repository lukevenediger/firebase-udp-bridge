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
     * Validate the raw message object
     * @param {Object} rawObject the raw object
     */
    function validate(rawObject) {

        var type = rawObject.type;

        // Make sure it's a message we understand
        if (type) {
            if (!invertedMessageTypes.hasOwnProperty(type)) {
                throw new Error('Unknown message type:' + type);
            }
        } else {
            throw new Error('Missing message type.');
        }
    }

    /**
     * Convert the raw object to a Message instance
     * @param {Object} rawObject
     * @returns {Message} a child instance of Message
     */
    function convertToMessage(rawObject) {

        var handler = MessageHandlerRegistry.getMessageHandler(rawObject.type);

        if (!handler) {
            throw new Error('Unknown message type or missing message handler.');
        }

        return handler.deserialize(rawObject);
    }

    /**
     * Convert a binary buffer into a RequestPacket instance.
     * @param {Buffer} buffer the raw request
     * @returns {Message} a child instance of Message
     * @throws {BadPacketException} if the data cannot be converted into a valid packet
     */
    this.deserialise = function(buffer) {
        var rawJSON = buffer.toString();
        var obj = JSON.parse(rawJSON);
        validate(obj);
        return convertToMessage(obj);
    };

    /**
     * Deserialize a raw JSON string
     * @param {String} rawJSON the raw JSON string
     * @returns {Message} a message instance
     */
    this.deserializeString = function(rawJSON) {
        var obj = JSON.parse(rawJSON);
        validate(obj);
        return convertToMessage(obj);
    };
}

module.exports = new MessageFactory();

