'use strict';

var _ = require('underscore'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js');

var PACKET_VERSION = 1;

/**
 * A get packet.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {String} path Firebase node path to read from.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#get|Get Packet}
 */
function Get(requestID, path) {
    this.requestID = requestID;
    this.path = path;

    _.extend(this, new Message(MessageType.GET, PACKET_VERSION, path.length));
}


module.Exports = Get;
