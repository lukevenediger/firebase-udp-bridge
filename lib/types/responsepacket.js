/* jshint -W097 */
/* globals module */
'use strict';

/**
 * A FUB packet sent to a remote device
 * @param {Message} message the message
 * @param {RemoteInfo} recipient the recipient of this message
 * @constructor
 * @class
 */
function ResponsePacket(message, recipient) {

    this.message = message;
    this.recipient = recipient;
}

module.exports = ResponsePacket;
