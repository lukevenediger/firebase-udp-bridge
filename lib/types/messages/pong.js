/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * A pong packet.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#pong|Pong}
 */
function Pong() {
    Message.call(this, MessageType.PONG, PACKET_VERSION);
}

Pong.deserialize = function() {
    return new Pong();
};

util.inherits(Pong, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.PONG, Pong);

module.exports = Pong;
