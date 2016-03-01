/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * A Set packet.
 * @param {String} sessionID the client session ID
 * @param {String} path Firebase node path to write to.
 * @param {*} value The new value to write at the path
 * @class
 * @constructor
 */
function Set(sessionID, path, value) {
    Message.call(this, MessageType.SET, PACKET_VERSION);

    this.sessionID = sessionID;
    this.path = path;
    this.value = value;
}

Set.deserialize = function(raw) {
    return new Set(raw.sessionID, raw.path, raw.value);
};

util.inherits(Set, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SET, Set);

module.exports = Set;
