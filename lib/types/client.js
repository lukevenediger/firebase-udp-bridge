'use strict';

var ProtocolProvider = require('./../protocolprovider.js'),
    ServiceMessage = ProtocolProvider.createServiceMessage();

/**
 * Represents a connected client
 * @param {String} address the client address
 * @param {Number} port the client port
 * @param {Socket} server a server socket
 * @constructor
 */
function Client(address, port, server) {

    return {
        /**
         * Send a message to the client
         * @param {String} type the type of message to send
         * @param {*} message the message
         */
       send: function(type, message) {
           var serviceMessage = new ServiceMessage();
           serviceMessage.set(type, message);
           var outgoingBuffer = serviceMessage.encodeNB();
           server.send(outgoingBuffer, 0, outgoingBuffer.length, port, address);
       }
    };
}

module.exports = Client;
