/* jshint -W097 */
/* globals module, require */
'use strict';

const uuid = require('node-uuid'),
    ControlCodes = require('../lookups/controlcodes.js'),
    DataTypeSizes = require('../lookups/datatypesizes.js'),
    StringUtility = require('../data/stringutility.js'),
    MissingMessageStartException = require('../types/exceptions/missingmessagestartexception.js');

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
        var value = buffer.readInt16BE(offset);
        offset += 2;
        return value;
    };

    /**
     * Read an int32 (LE) and advance the offset
     * @returns {Number} an int32 value
     */
    this.readInt32 = function() {
        var value = buffer.readInt32BE(offset);
        offset += 4;
        return value;
    };

    /**
     * Read an unsigned int 64
     * @returns {Number} an unsigned int64
     */
    this.readUInt64 = function() {
        var value = buffer.readUIntBE(offset, DataTypeSizes.UINT_64);
        offset += DataTypeSizes.UINT_64;
        return value;
    };

    /**
     * Read the remaining bytes in the buffer as a string
     * @returns {String} the decoded string
     */
    this.readString = function() {
        var value = buffer.toString('utf8', offset, offset + DataTypeSizes.STRING);
        offset += DataTypeSizes.STRING;
        return StringUtility.trimNullCharacters(value);
    };

    /**
     * Read a 16-byte UUID and send it out as a string
     * @returns {String} the uuid in string form
     */
    this.readUUID = function() {
        var uuidBuffer = buffer.slice(offset, offset + DataTypeSizes.UUID);
        offset += DataTypeSizes.UUID;
        return uuid.unparse(uuidBuffer);
    };

    /**
     * Read a 4-byte floating point number
     * @returns {Number} the floating-point number
     */
    this.readFloat = function() {
        var value = buffer.readFloatBE(offset, offset + 4);
        offset += 4;
        return value;
    };

    /**
     * Read a single byte as a boolean value
     * @returns {boolean} true if the byte value is 1
     */
    this.readBoolean = function() {
        var value = buffer.readUIntBE(offset, DataTypeSizes.BOOLEAN);
        offset += DataTypeSizes.BOOLEAN;
        return value === 1;
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
