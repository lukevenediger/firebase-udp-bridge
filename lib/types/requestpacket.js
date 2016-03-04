/* jshint -W097 */
/* globals module */
'use strict';

/**
 * A FUB packet received from a remote device
 * @param {Message} message the message
 * @param {RemoteInfo} sender the sender
 * @param {Function} replyFunction a function that can be called to send a reply
 * @constructor
 * @class
 */
function RequestPacket(message, sender, replyFunction) {

    this.message = message;
    this.sender = sender;

    /**
     * Prepare a reply message for the remote client
     * @param {Message} replyMessage the message to send
     */
    this.reply = function(replyMessage) {
        return new ResponsePacket(replyMessage, sender, replyFunction);
    };
}

/**
 * A FUB packet sent to a remote device
 * @param {Message} message the message
 * @param {RemoteInfo} recipient the recipient of this message
 * @param {Function} replyFunction a function that can be called to send a reply
 * @constructor
 * @class
 */
function ResponsePacket(message, recipient, replyFunction) {

    this.message = message;
    this.recipient = recipient;

    /**
     * Send the response to the client
     */
    this.send = function() {
        replyFunction(this.message);
    };
}

module.exports = RequestPacket;
