'use strict';

var _ = require('underscore'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js');

var PACKET_VERSION = 1,
    PACKET_LENGTH = 4;

/*
 * Cancel a previous subscription
 * @param {Number} requestID the subscription request ID
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#unsubscribe|Unsubscribe}
 */
function Unsubscribe(requestID) {
    this.requestID = requestID;

    _.extend(this, new Message(MessageType.UNSUBSCRIBE, PACKET_VERSION, PACKET_LENGTH));
}

module.Exports = Unsubscribe;
