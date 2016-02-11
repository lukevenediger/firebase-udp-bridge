/* jshint -W097 */
/* globals require, module, console */
'use strict';

const EventEmitter = require('events'),
    util = require('util'),
    dgram = require('dgram'),
    q = require('q'),
    hexdump = require('hexdump-nodejs'),
    RequestPacket = require('../types/requestpacket.js'),
    BadPacketException = require('../types/exceptions/badpacketexception.js'),
    MessageFactory = require('./messagefactory.js'),
    RemoteInfo = require('../types/remoteinfo.js');

const PACKET = 'packet',
    BAD_PACKET = 'bad packet';

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
    var self = this;

    /**
     * Initialise the FUB
     * @returns {Promise} resolves once the socket is listening
     * @private
     */
    function initialise() {
        udp = dgram.createSocket('udp4');
        return initialiseSocket(port)
            .then(function onReady() {
                udp.on('message', onIncomingMessage);
                return udp.address();
            });
    }

    /**
     * Initialise the UDP socket and start listening for data
     * @param {Number} port the port to receive messages on
     * @returns {Promise} a promise that resolves to the UDP socket.
     * @private
     */
    function initialiseSocket(port) {
        var deferred = q.defer();

        udp.once('listening', function listening() {
            deferred.resolve(udp.address());
        });
        udp.bind(port);

        return deferred.promise;
    }

    /**
     * Decode an incoming message and emit an event
     * @param {Buffer} buffer the raw packet data
     * @param {Object} remoteInfo info about the sender
     * @private
     */
    function onIncomingMessage(buffer, remoteInfo) {
        // Force remote info into a type
        remoteInfo = new RemoteInfo(remoteInfo.address, remoteInfo.port);

        try {
            console.log('Received from ' + remoteInfo);
            console.log(hexdump(buffer));
            var message = MessageFactory.deserialise(buffer);
            self.emit(PACKET, new RequestPacket(message, remoteInfo));
        } catch (error) {
            self.emit(BAD_PACKET, new BadPacketException(remoteInfo, buffer.length, error));
            throw error;
        }
    }

    // Public API
    /**
     * Start listening for incoming messages.
     * @returns {Promise} resolves when the socket has started listening.
     */
    this.start = function() {
        return initialise();
    };

    /**
     * Send a message to a recipient
     * @param {Message} message the message
     * @param {Object} recipient the remote recipient
     * @returns {Promise} resolves when the send operation completes
     */
    this.sendPacket = function(message, recipient) {
        var buffer = message.serialize();
        console.log('Sending ' + message + ' to ' + recipient);
        console.log(hexdump(buffer));
        var deferred = q.defer();
        udp.send(buffer, 0, buffer.length, recipient.port, recipient.address, function complete(error) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    };
}
util.inherits(UDPMessageListenSocket, EventEmitter);

// Constants
UDPMessageListenSocket.PACKET = PACKET;
UDPMessageListenSocket.BAD_PACKET = BAD_PACKET;

module.exports = UDPMessageListenSocket;

