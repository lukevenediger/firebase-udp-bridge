/* jshint -W097 */
/* globals require, module, Math */
'use strict';

const _ = require('underscore'),
    MessageType = require('../lookups/messagetype.js'),
    RequestPacket = require('../types/requestpacket.js'),
    NullValue = require('../types/messages/nullvalue.js'),
    BooleanValue = require('../types/messages/booleanvalue.js'),
    FloatValue = require('../types/messages/floatvalue.js'),
    IntegerValue = require('../types/messages/integervalue.js'),
    StringValue = require('../types/messages/stringvalue.js'),
    UnsupportedValueTypeException = require('../types/exceptions/unsupportedvaluetypeexception.js'),
    BadPacketException = require('../types/exceptions/badpacketexception.js'),
    ErrorMessage = require('../types/messages/error.js'),
    ErrorCode = require('../lookups/errorcode.js');

/**
 * Handles converting messages to binary formats and back again
 * @class
 * @constructor
 */
function MessageFactory() {

    var handlers = {};

    /**
     * Check if a number is a floating-point number or not.
     * @param {Number} value the number
     * @returns {Boolean} true if the value is a floating point number.
     */
    function isFloat(value) {
        return Math.ceil(parseFloat(value)) === value;
    }

    /**
     * Check if a number is an integer or not.
     * @param {Number} value the number
     * @returns {boolean} true if the value is an integer.
     */
    function isInteger(value) {
        return (parseInt(value) === value);
    }


    /**
     * Register a constructor function as the handler for a message type
     * @param {Number} messageType the message type
     * @param {Function} clazz the constructor function
     */
    this.registerMessageTypeHandler = function(messageType, clazz) {
        if (handlers.hasOwnProperty(messageType)) {
            var messageTypeName = _.invert(MessageType)[messageType];
            throw new Error('Handler for ' + messageTypeName + ' aready exists.');
        }
        handlers[messageType] = clazz;
    };

    /**
     * Convert a binary buffer into a RequestPacket instance.
     * @param {Buffer} buffer the raw request
     * @param {RemoteInfo} remoteInfo info about the sender
     * @returns {RequestPacket} a packet
     * @throws {BadPacketException} if the data cannot be converted into a valid packet
     */
    this.deserialise = function(buffer, remoteInfo) {

        var type = buffer.readInt16LE();
        try {
            var message;
            if (handlers.hasOwnProperty(type)) {
                message = handlers[type].deserialize(buffer);
            } else {
                message = new ErrorMessage(ErrorCode.UNKNOWN_MESSAGE_TYPE);
            }
            return new RequestPacket(message, remoteInfo);
        } catch (error) {
            throw new BadPacketException(remoteInfo, buffer.length, error);
        }
    };

    /**
     * Create a value message based on the value type
     * @param {Number} requestID the caller's request ID
     * @param {*} value the value
     * @returns {FloatValue|IntegerValue|StringValue|NullValue}
     */
    this.createValueMessage = function(requestID, value) {
        if (_.isNull(value)) {
            return new NullValue(requestID);
        }
        else if (_.isBoolean(value)) {
            return new BooleanValue(requestID, value);
        }
        else if (isFloat(value)) {
            return new FloatValue(requestID, value);
        }
        else if (isInteger(value)) {
            return new IntegerValue(requestID, value);
        }
        else if (typeof value === 'string') {
            return new StringValue(requestID, value);
        }
        else {
            throw UnsupportedValueTypeException(value);
        }
    };
}

module.exports = new MessageFactory();

