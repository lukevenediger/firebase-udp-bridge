/* jshint -W097 */
/* globals require, module */
'use strict';

const util = require('util'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js');

const PACKET_VERSION = 1;

/**
 * Subscribe to a message channel
 * @param {String} sessionID the client's session ID
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {String} path The path of the message channel
 * @class
 * @constructor
 */
function SubscribeChannel(sessionID, requestID, path) {
    Message.call(this, MessageType.SUBSCRIBE_CHANNEL, PACKET_VERSION);

    this.sessionID = sessionID;
    this.requestID = requestID;
    this.path = path;
}

SubscribeChannel.deserialize = function(raw) {
    return new SubscribeChannel(raw.sessionID, raw.requestID, raw.path);
};

util.inherits(SubscribeChannel, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.SUBSCRIBE_CHANNEL,
    SubscribeChannel);

module.exports = SubscribeChannel;
