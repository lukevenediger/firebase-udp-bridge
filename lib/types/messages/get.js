/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    util = require('util');

const PACKET_VERSION = 1;

/**
 * A get packet.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {String} path Firebase node path to read from.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#get|Get}
 */
function Get(requestID, path) {
    Message.call(this, MessageType.GET, PACKET_VERSION);

    this.requestID = requestID;
    this.path = path;
}

Get.prototype.toString = function() {
    return this.getMessageTypeName() + ': requestID=' + this.requestID + ', path=' + this.path;
};

util.inherits(Get, Message);

module.exports = Get;
