'use strict';

var _ = require('underscore'),
    Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js');

var PACKET_VERSION = 1;

/*
 * Subscribe for value change events.
 * @param {Number} requestID A client-supplied request ID that will be included in the response.
 * @param {String} path The Firebase path to watch.
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#subscribe|Subscribe}
 */
function Subscribe(requestID, path) {
    this.requestID = requestID;
    this.path = path;

    _.extend(this, new Message(MessageType.SUBSCRIBE, PACKET_VERSION, path.length + 4));
}

module.Exports = Subscribe;
