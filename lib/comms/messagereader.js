/* jshint -W097 */
/* globals module */
'use strict';

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
     * Read a chunk of the buffer as a UTF8 string
     * @returns {String} the decoded string
     */
    this.readString = function() {
        var length = this.readInt32();
        var stringValue = buffer.toString('utf8', offset, length);
        offset += length;
        return stringValue;
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
