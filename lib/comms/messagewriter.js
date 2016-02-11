/* jshint -W097 */
/* globals require, module */
'use strict';

const Buffer = require('buffer').Buffer,
    uuid = require('node-uuid'),
    ControlCodes = require('../lookups/controlcodes.js');

/**
 * Provides a way to build the raw binary message data
 * @constructor
 * @class
 */
function MessageWriter() {

    var mainBuffer;

    function initialise() {
    }

    function saveToMainBuffer(buffer) {
        if (mainBuffer) {
            mainBuffer = Buffer.concat([mainBuffer, buffer]);
        } else {
            mainBuffer = buffer;
        }
    }

    this.writePacketStart = function() {
        var buffer = new Buffer(1);
        buffer.writeInt8(ControlCodes.PACKET_START);
        saveToMainBuffer(buffer);
        return this;
    };

    this.writeString = function(value) {
        // Normalise the value
        value = value || '';
        var buffer = new Buffer(value.length);
        buffer.write(value);
        saveToMainBuffer(buffer);
        return this;
    };

    this.writeStringWithLength = function(value) {
        // Normalise the value
        value = value || '';

        var buffer = new Buffer(value.length + 4);
        buffer.writeInt32LE(value.length);
        if (value.length > 0) {
            buffer.write(value, 4);
        }
        saveToMainBuffer(buffer);
        return this;
    };

    this.writeInt16 = function(value) {
        // Normalise the value
        value = value || 0;

        var buffer = new Buffer(4);
        buffer.writeInt16LE(value);
        saveToMainBuffer(buffer);
        return this;
    };

    this.writeInt32 = function(value) {
        // Normalise the value
        value = value || 0;

        var buffer = new Buffer(4);
        buffer.writeInt32LE(value);
        saveToMainBuffer(buffer);
        return this;
    };

    this.writeUUID = function(value) {
        var buffer = new Buffer(16);
        uuid.parse(value, buffer);
        this.writeBuffer(buffer);
        return this;
    };

    this.writeBuffer = function(buffer) {
        saveToMainBuffer(buffer);
        return this;
    };

    this.toBuffer = function() {
        return mainBuffer;
    };

    initialise();
}

module.exports = MessageWriter;
