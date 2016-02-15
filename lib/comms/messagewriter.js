/* jshint -W097 */
/* globals require, module */
'use strict';

const Buffer = require('buffer').Buffer,
    uuid = require('node-uuid'),
    ControlCodes = require('../lookups/controlcodes.js'),
    DataTypeSizes = require('../lookups/datatypesizes.js');

/**
 * Provides a way to build the raw binary message data
 * @constructor
 * @class
 */
function MessageWriter() {

    var mainBuffer;

    function initialise() {
    }

    /**
     * Save the incoming buffer to the main buffer.
     * @param {Buffer} buffer the incoming buffer
     */
    function saveToMainBuffer(buffer) {
        if (mainBuffer) {
            mainBuffer = Buffer.concat([mainBuffer, buffer]);
        } else {
            mainBuffer = buffer;
        }
    }

    /**
     * Write the packet start code
     * @returns {MessageWriter} this writer
     */
    this.writePacketStart = function() {
        var buffer = new Buffer(1);
        buffer.writeInt8(ControlCodes.PACKET_START);
        saveToMainBuffer(buffer);
        return this;
    };

    /**
     * Write a string to a 256-byte buffer
     * @param {String} value the string, cannot be longer than 256 bytes.
     * @returns {MessageWriter} this writer
     */
    this.writeString = function(value) {
        // Normalise the value
        value = value || '';

        // Length cannot exceed 256
        if (value.length > DataTypeSizes.STRING) {
            throw new Error('String cannot be longer than ' +
                DataTypeSizes.STRING +
                ' characters.');
        }

        var buffer = new Buffer(DataTypeSizes.STRING);
        buffer.fill(0);
        buffer.write(value);
        saveToMainBuffer(buffer);
        return this;
    };

    /**
     * Write a 2-byte integer
     * @param {Number} value the integer
     * @returns {MessageWriter} this writer
     */
    this.writeInt16 = function(value) {
        // Normalise the value
        value = value || 0;

        var buffer = new Buffer(4);
        buffer.writeInt16BE(value);
        saveToMainBuffer(buffer);
        return this;
    };

    /**
     * Write a 4-byte integer
     * @param {Number} value the integer
     * @returns {MessageWriter} this writer
     */
    this.writeInt32 = function(value) {
        // Normalise the value
        value = value || 0;

        var buffer = new Buffer(4);
        buffer.writeInt32BE(value);
        saveToMainBuffer(buffer);
        return this;
    };

    /**
     * Write an unsigned (positive) int64 value
     * @param {Number} value the integer
     * @returns {MessageWriter} this writer
     */
    this.writeUInt64 = function(value) {
        var buffer = new Buffer(DataTypeSizes.UINT_64);
        buffer.fill(0);
        buffer.writeUIntBE(value, 0, DataTypeSizes.UINT_64);
        saveToMainBuffer(buffer);
        return this;
    };

    /**
     * Write a 32-bit float
     * @param {Number} value the float value
     * @returns {MessageWriter} this writer
     */
    this.writeFloat = function(value) {
        // normalise the value
        value = value || 0;
        var buffer = new Buffer(4);
        buffer.writeFloatBE(value);
        saveToMainBuffer(buffer);
        return this;
    };

    /**
     * Write a 16-byte unique identifier
     * @param {String} value the UUID in string form
     * @returns {MessageWriter} this writer
     */
    this.writeUUID = function(value) {
        var buffer = new Buffer(DataTypeSizes.UUID);
        uuid.parse(value, buffer);
        saveToMainBuffer(buffer);
        return this;
    };

    /**
     * Write a boolean value
     * @param {Boolean} value the boolean value
     * @returns {MessageWriter} this writer
     */
    this.writeBoolean = function(value) {
        var buffer = new Buffer(DataTypeSizes.BOOLEAN);
        buffer.writeUIntBE(value ? 1 : 0, 0, 1);
        saveToMainBuffer(buffer);
        return this;
    };

    /**
     * Write a raw buffer
     * @param {Buffer} buffer the buffer
     * @returns {MessageWriter} this writer
     */
    this.writeBuffer = function(buffer) {
        saveToMainBuffer(buffer);
        return this;
    };

    /**
     * Return the current buffer
     * @returns {Buffer} the buffer
     */
    this.toBuffer = function() {
        return mainBuffer;
    };

    initialise();
}

module.exports = MessageWriter;
