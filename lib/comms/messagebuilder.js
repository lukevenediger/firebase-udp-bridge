/* jshint -W097 */
/* globals require, module */
'use strict';

const Buffer = require('buffer').Buffer;

/**
 * Provides a way to build the raw binary message data
 * @constructor
 * @class
 */
function MessageBuilder() {

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

    this.writeString = function(value) {
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

    this.writeInteger = function(value) {
        // Normalise the value
        value = value || 0;

        var buffer = new Buffer(4);
        buffer.writeInt32LE(value);
        saveToMainBuffer(buffer);
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

module.exports = MessageBuilder;
