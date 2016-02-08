/* jshint -W097 */
/* globals module */
'use strict';

/**
 * A FUB packet received from a remote device
 * @param {Message} message the message
 * @param {RemoteInfo} sender the sender
 * @constructor
 * @class
 */
function Packet(message, sender) {

    this.message = message;
    this.sender = sender;
}

module.exports = Packet;
