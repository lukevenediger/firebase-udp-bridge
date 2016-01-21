'use strict';

const EventEmitter = require('events'),
    util = require('util'),
    dgram = require('dgram'),
    q = require('q'),
    Packet = require('../types/packet.js'),
    BadPacketException = require('../types/exceptions/badpacketexception.js');

/**
 * A UDP listen socket that decodes incoming messages and emits event packets
 * @param {Number} port the listen port
 * @constructor
 * @class
 * @extends EventEmitter
 */
function UDPMessageListenSocket(port) {
    EventEmitter.call(this);

    var udp;

    function initialise() {
        udp = dgram.createSocket('udp4');
        initialiseSocket(port)
            .then(function onReady() {
                udp.on('message', onIncomingMessage);
                return udp.address();
            });
    }

    /**
     * Initialise the UDP socket and start listening for data
     * @param {Number} port the port to receive messages on
     * @returns {Promise} a promise that resolves to the UDP socket.
     */
    function initialiseSocket(port) {
        var deferred = q.deferred();

        udp.once('listening', function listening() {
            var address = udp.address();
            console.log('Client listening at\n  => ' + colors.green(address.address + ':' + clientListenPort));
            deferred.resolve();
        });
        udp.bind(port);

        return deferred.promise;
    }

    /**
     * Decode an incoming message and emit an event
     * @param {Buffer} buffer the raw packet data
     * @param {Object} remoteInfo info about the sender
     */
    function onIncomingMessage(buffer, remoteInfo) {
        try {
            var message = MessageFactory.deserialise(buffer);
            this.emit(PACKET, new Packet(message, remoteInfo));
        } catch (error) {
            this.emit(BAD_PACKET, new BadPacketException(remoteInfo, buffer.length, error));
        }
    }

    // Public API
    return {
        /**
         * Start listening for incoming messages.
         * @returns {Promise} resolves when the socket has started listening.
         */
        start: function() {
            return initialise();
        },
        /**
         * Send a message to a recipient
         * @param {Message} message the message
         * @param {Object} recipient the remote recipient
         * @returns {Promise} resolves when the send operation completes
         */
        sendPacket: function(message, recipient) {
            var buffer = MessageFactory.serialise(message);
            var deferred = q.defer();
            udp.send(buffer, 0, buffer.length, recipient.port, recipient.address, function complete(error) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve();
                }
            });
            return deferred.promise;
        }
    }
}
util.inherits(UDPMessageListenSocket, EventEmitter);

// Constants
UDPMessageListenSocket.BAD_PACKET = 'bad packet';
UDPMessageListenSocket.PACKET = 'packet';

module.exports = UDPMessageListenSocket;

