'use strict';

/**
 * The base type for all messages
 * @param {Number} type The message type
 * @param {Number} version The message structure version
 * @param {Number} length The packet length (excluding Type and Version)
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#packet-header|Packet Header}
 */
function Message(type, version, length) {
    this.type = type;
    this.version = version;
    this.length = length;
}

module.Exports = Message;
