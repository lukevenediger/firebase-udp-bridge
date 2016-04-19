/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * A Set Once packet. Only sets the value if it doesn't exist already.
 * @param {String} sessionID the client session ID
 * @param {String} path Firebase node path to write to.
 * @param {*} value The new value to write at the path
 * @class
 * @constructor
 */
function SetOnce(sessionID, path, value) {
    Message.call(this, MessageType.SET_ONCE, PACKET_VERSION);

    this.sessionID = sessionID;
    this.path = path;
    this.value = value;
}

SetOnce.deserialize = function(raw) {
    return new SetOnce(raw.sessionID, raw.path, raw.value);
};

util.inherits(SetOnce, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SET_ONCE, SetOnce);

module.exports = SetOnce;
