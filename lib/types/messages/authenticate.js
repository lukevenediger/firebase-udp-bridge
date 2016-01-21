'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    util = require('util');

const PACKET_VERSION = 1;

/*
 * Authenticate and open a session with the FUB
 * @param {String} secret an encrypted secret
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#authenticate|Authenticate}
 */
function Authenticate(secret) {
    Message.call(this, MessageType.AUTHENTICATE, PACKET_VERSION);

    this.secret = secret;
}

Authenticate.prototype.toString = function() {
    return MessageType.getMessageTypeName(this.type) + 'secret=' + this.secret;
};

util.extend(Authenticate, Message);

module.Exports = Authenticate;
