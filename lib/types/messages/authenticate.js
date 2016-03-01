/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/*
 * Authenticate and open a session with the FUB
 * @param {String} id the device ID
 * @param {String} secret an encrypted secret
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#authenticate|Authenticate}
 */
function Authenticate(id, secret) {
    Message.call(this, MessageType.AUTHENTICATE, PACKET_VERSION);

    this.id = id;
    this.secret = secret;
}

Authenticate.deserialize = function(raw) {
    return new Authenticate(raw.id, raw.secret);
};

util.inherits(Authenticate, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.AUTHENTICATE, Authenticate);

module.exports = Authenticate;
