/* jshint -W097 */
/* globals require, module */
'use strict';


/**
 * The base type for all messages
 * @param {Number} type The message type
 * @param {Number} version The message structure version
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#packet-header|Packet Header}
 */
function Message(type, version) {
    this.type = type;
    this.version = version;
}

module.Exports = Message;
