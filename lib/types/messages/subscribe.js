/* jshint -W097 */
/* globals require, module */
'use strict';

const util = require('util'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js');

const PACKET_VERSION = 1;

/*
 * Subscribe for value change events.
 * @param {String} sessionID The client's session ID
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {String} path The Firebase path to watch.
 * @param {Number} eventType the type of event to subscribe to
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#subscribe|Subscribe}
 */
function Subscribe(sessionID, requestID, path, eventType) {
    Message.call(this, MessageType.SUBSCRIBE, PACKET_VERSION);

    this.sessionID = sessionID;
    this.requestID = requestID;
    this.path = path;
    this.eventType = eventType;
}

Subscribe.deserialize = function(raw) {
    return new Subscribe(raw.sessionID, raw.requestID, raw.path, raw.eventType);
};

util.inherits(Subscribe, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SUBSCRIBE, Subscribe);

module.exports = Subscribe;
