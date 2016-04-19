/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * Update a numeric value by the increment (positive or negative)
 * @param {String} sessionID the client session ID
 * @param {String} path Firebase node path to update
 * @param {Number} [value] the value to increment by
 * @constructor
 */
function Increment(sessionID, path, value) {
    Message.call(this, MessageType.INCREMENT, PACKET_VERSION);

    this.sessionID = sessionID;
    this.path = path;
    this.value = value;
}

Increment.deserialize = function(raw) {
    return new Increment(raw.sessionID, raw.path, raw.value);
};

util.inherits(Increment, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.INCREMENT, Increment);

module.exports = Increment;
