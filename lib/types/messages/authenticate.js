/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
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

Authenticate.prototype.toString = function() {
    return MessageType.getMessageTypeName(this.type) + 'id=' + this.id +
        ', secret=' + this.secret;
};

util.inherits(Authenticate, Message);

module.exports = Authenticate;
