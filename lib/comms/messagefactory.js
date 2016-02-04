/* jshint -W097 */
/* globals require, module, Math */
'use strict';

const _ = require('underscore'),
    Packet = require('../types/packet.js'),
    NullValue = require('../types/messages/nullvalue.js'),
    BooleanValue = require('../types/messages/booleanvalue.js'),
    FloatValue = require('../types/messages/floatvalue.js'),
    IntegerValue = require('../types/messages/integervalue.js'),
    StringValue = require('../types/messages/stringvalue.js'),
    UnsupportedValueTypeException = require('../types/exceptions/unsupportedvaluetypeexception.js');

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
     * Convert a binary buffer into a Packet instance.
     * @param {Buffer} buffer the raw request
     * @param {RemoteInfo} remoteInfo info about the sender
     * @returns {Packet} a packet
     * @throws {BadPacketException} if the data cannot be converted into a valid packet
     */
    this.deserialise = function(buffer, remoteInfo) {
        var a = buffer + remoteInfo;
        return new Packet(a);
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

