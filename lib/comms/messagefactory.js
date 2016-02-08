/* jshint -W097 */
/* globals require, module, Math */
'use strict';

const _ = require('underscore'),
    Packet = require('../types/requestpacket.js'),
    NullValue = require('../types/messages/nullvalue.js'),
    BooleanValue = require('../types/messages/booleanvalue.js'),
    FloatValue = require('../types/messages/floatvalue.js'),
    IntegerValue = require('../types/messages/integervalue.js'),
    StringValue = require('../types/messages/stringvalue.js'),
    UnsupportedValueTypeException = require('../types/exceptions/unsupportedvaluetypeexception.js'),
    BadPacketException = require('../types/exceptions/badpacketexception.js');

/**
 * Handles converting messages to binary formats and back again
 * @class
 * @constructor
 */
function MessageFactory() {

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
     * Read an int16 (LE) and advance the offset
     * @param {Buffer} buffer the input buffer
     * @param {Number} currentOffset the current stream position
     * @returns {Number} an int16 value
     */
    function readInt16(buffer, currentOffset) {
        var value = buffer.readInt16LE(currentOffset);
        currentOffset += 4;
        return value;
    }

    /**
     * Read an int32 (LE) and advance the offset
     * @param {Buffer} buffer the input buffer
     * @param {Number} currentOffset the current stream position
     * @returns {Number} an int32 value
     */
    function readInt32(buffer, currentOffset) {
        var value = buffer.readInt32LE(currentOffset);
        currentOffset += 4;
        return value;
    }

    /**
     * Convert a binary buffer into a RequestPacket instance.
     * @param {Buffer} buffer the raw request
     * @param {RemoteInfo} remoteInfo info about the sender
     * @returns {RequestPacket} a packet
     * @throws {BadPacketException} if the data cannot be converted into a valid packet
     */
    this.deserialise = function(buffer, remoteInfo) {
        var currentOffset = 0;
        try {
            var type = readInt16(buffer, currentOffset);
            var version = readInt16(buffer, currentOffset);
        } catch (error) {
            throw new BadPacketException(remoteInfo, buffer.length, error);
        }
        return new Packet();
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

