/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * A get packet.
 * @param {String} sessionID the client session ID
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {String} path Firebase node path to read from.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#get|Get}
 */
function Get(sessionID, requestID, path) {
    Message.call(this, MessageType.GET, PACKET_VERSION);

    this.sessionID = sessionID;
    this.requestID = requestID;
    this.path = path;
}

Get.deserialize = function(raw) {
    return new Get(raw.sessionID, raw.requestID, raw.path);
};

util.inherits(Get, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.GET, Get);

module.exports = Get;
