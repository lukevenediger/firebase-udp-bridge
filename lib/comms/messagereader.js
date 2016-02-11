/* jshint -W097 */
/* globals module, require */
'use strict';

const uuid = require('node-uuid'),
    ControlCodes = require('../lookups/controlcodes.js'),
    MissingMessageStartException = require('../types/exceptions/missingmessagestartexception.js');

const UUID_LENGTH = 16;

/**
 * Forward-only message reader
 * @param {Buffer} buffer the raw data buffer
 * @param {Number} offset the position in the buffer to start reading from
 * @constructor
 * @class
 */
function MessageReader(buffer, offset) {

    offset = offset || 0;

    /**
     * Reads the packet start code and validates
     * that it is correct.
     */
    this.validatePacketStart = function() {
        var value = buffer.readInt8(offset);
        offset += 1;

        if (value !== ControlCodes.PACKET_START) {
            throw new MissingMessageStartException();
        }
    };

    /**
     * Read an int16 (LE) and advance the offset
     * @returns {Number} an int16 value
     */
    this.readInt16 = function() {
        var value = buffer.readInt16LE(offset);
        offset += 4;
        return value;
    };

    /**
     * Read an int32 (LE) and advance the offset
     * @returns {Number} an int32 value
     */
    this.readInt32 = function() {
        var value = buffer.readInt32LE(offset);
        offset += 4;
        return value;
    };

    /**
     * Read a string by first checking for string length, and then
     * extracting the string from the buffer.
     * @returns {String}
     */
    this.readStringWithLength = function() {
        var length = this.readInt32();
        var stringValue = buffer.toString('utf8', offset, offset + length);
        offset += length;
        return stringValue;
    };

    /**
     * Read the remaining bytes in the buffer as a string
     * @returns {String} the decoded string
     */
    this.readString = function() {
        return buffer.toString('utf8', offset);
    };

    /**
     * Read a 16-byte UUID and send it out as a string
     * @returns {String} the uuid in string form
     */
    this.readUUID = function() {
        var uuidBuffer = buffer.slice(offset, offset + UUID_LENGTH);
        offset += UUID_LENGTH;
        return uuid.unparse(uuidBuffer);
    };

    /**
     * Get the current position in the buffer
     * @returns {Number} the current buffer position
     */
    this.getCurrentOffset = function() {
        return offset;
    };
}

module.exports = MessageReader;
