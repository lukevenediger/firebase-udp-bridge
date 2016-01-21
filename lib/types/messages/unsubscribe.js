'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    util = require('util');

const PACKET_VERSION = 1;

/*
 * Cancel a previous subscription
 * @param {Number} requestID the subscription request ID
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#unsubscribe|Unsubscribe}
 */
function Unsubscribe(requestID) {
    Message.call(this, MessageType.SUBSCRIBE, PACKET_VERSION);

    this.requestID = requestID;
}

Error.prototype.toString = function() {
    return MessageType.getMessageTypeName(this.type) + ': requestId=' + this.requestID;
};

util.extend(Unsubscribe, Message);

module.Exports = Unsubscribe;
