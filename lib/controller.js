/* jshint -W097 */
/* globals require, module, console */
'use strict';

const colors = require('colors'),
    q = require('q'),
    MessageType = require('./lookups/messagetype.js'),
    UDPMessageListenSocket = require('./comms/udpmessagelistensocket.js'),
    Packet = require('./types/packet.js');

/**
 * Creates a new Controller
 * @param {Number} port the listen port
 * @param {SubscriptionService} subscriptionService the subscription service
 * @param {QueryService} queryService the data query service
 * @param {PresenceService} presenceService the client presence service
 * @param {AuthenticationService} authenticationService the client authentication service
 * @param {LogService} logService the client log service
 * @constructor
 */
function Controller(port,
                   subscriptionService,
                   queryService,
                   presenceService,
                   authenticationService,
                   logService) {

    var fubSocket;

    function initialise() {

        // Create the FUB socket
        fubSocket = new UDPMessageListenSocket(port);

        // Wire all the events
        fubSocket.on(UDPMessageListenSocket.PACKET, onIncomingPacket);
        fubSocket.on(UDPMessageListenSocket.BAD_PACKET, onBadPacket);

        fubSocket.start()
            .then(function started(address) {
                console.log('Server running at => ' + colors.green(address.address + ':' + address.port));
            });
    }

    /**
     * Called when a valid packet arrives
     * @param {Packet} packet the packet
     */
    function onIncomingPacket(packet) {

        console.log(packet.sender.address + ':' + packet.sender.port + ' - ' + packet.message.toString());

        var responsePromise;

        switch (packet.message.type) {
            case MessageType.AUTHENTICATE:
                responsePromise = authenticationService.authenticate(packet);
                break;
            case MessageType.PING:
                responsePromise = presenceService.ping(packet);
                break;
            case MessageType.SUBSCRIBE:
                responsePromise = subscriptionService.subscribe(packet);
                break;
            case MessageType.UNSUBSCRIBE:
                responsePromise = subscriptionService.unsubscribe(packet);
                break;
            case MessageType.GET:
                responsePromise = queryService.get(packet);
                break;
            case MessageType.SET_FLOAT:
                responsePromise = queryService.setFloat(packet);
                break;
            case MessageType.SET_INTEGER:
                responsePromise = queryService.setInteger(packet);
                break;
            case MessageType.SET_STRING:
                responsePromise = queryService.setString(packet);
                break;
            case MessageType.LOG_INFO:
                responsePromise = logService.logInfo(packet);
                break;
            default:
                responsePromise = createUnknownMessageTypeResponse(packet);
                break;
        }

        responsePromise
            .then(processResponse)
            .done();
    }

    /**
     * Handle the service response and send to the remote client if necessary.
     * @param {Packet} responsePacket the response packet
     */
    function processResponse(responsePacket) {
        if (responsePacket) {
            fubSocket.sendPacket(responsePacket.message, responsePacket.sender);
        }
    }

    /**
     * Handle when the socket receives an indecipherable packet
     * @param {BadPacketException} error a description of the error
     */
    function onBadPacket(error) {
        console.log('Bad packet: ' + error);
    }

    /**
     * Notify the client that we didn't understand their message type
     * @param packet the incoming packet
     * @returns {*} Promise that resolves to a response packet
     */
    function createUnknownMessageTypeResponse(packet) {
        console.log('Unknown message type: ' + packet.message.type);
        return q(new Packet());
    }

    initialise();

    // Public API
    return {
        /**
         * Start the UDP Bridge.
         */
        start: function() {
            fubSocket.listen();
        }
    };
}

module.exports = Controller;
