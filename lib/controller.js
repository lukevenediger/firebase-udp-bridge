/* jshint -W097 */
/* globals require, module, console */
'use strict';

const q = require('q'),
    MessageType = require('./lookups/messagetype.js'),
    UDPMessageListenSocket = require('./comms/udpmessagelistensocket.js'),
    ResponsePacket = require('./types/responsepacket.js'),
    ErrorMessage = require('./types/messages/error.js'),
    ErrorCodes = require('./lookups/errorcode.js');

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

    }

    /**
     * Called when a valid packet arrives
     * @param {RequestPacket} packet the packet
     */
    function onIncomingPacket(packet) {

        console.log(packet.sender.address + ':' + packet.sender.port + ' - ' + packet.message.toString());

        var responsePromise;

        switch (packet.message.type) {
            case MessageType.AUTHENTICATE:
                responsePromise = authenticationService.authenticate(packet);
                break;
            case MessageType.PING:
                // Do nothing (will be handled after the switch block)
                responsePromise = q();
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
                responsePromise = q(createUnknownMessageTypeMessage(packet));
                break;
        }

        if (packet.message.sessionID) {
            // Update last-touch for this user
            responsePromise
                .then(function() {
                    return presenceService.updateLastTouch(packet.message.sessionID);
                });
        }

        // Process the response
        responsePromise
            .then(processResponse)
            .done();
    }

    /**
     * Handle the service response and send to the remote client if necessary.
     * @param {ResponsePacket} responsePacket the response message
     * @returns {Promise<undefined>} resolves when the response has been sent
     */
    function processResponse(responsePacket) {
        if (responsePacket) {
            return fubSocket.sendPacket(responsePacket.message, responsePacket.recipient);
        } else {
            return q();
        }
    }

    /**
     * Handle when the socket receives an indecipherable packet
     * @param {BadPacketException} error a description of the error
     */
    function onBadPacket(error) {
        console.log('Bad packet: ' + error);
        return fubSocket.sendPacket(
            new ErrorMessage(ErrorCodes.BAD_PACKET_FORMAT),
            error.sender
        );
    }

    /**
     * Notify the client that we didn't understand their message type
     * @param {RequestPacket} requestPacket the incoming packet
     * @returns {*} Promise that resolves to a response packet
     */
    function createUnknownMessageTypeMessage(requestPacket) {
        console.log('Unknown message type: ' + requestPacket.message.type);
        return new ResponsePacket(new ErrorMessage(ErrorCodes.UNKNOWN_ERROR),
            requestPacket.sender);
    }

    initialise();

    /**
     * Start the UDP Bridge.
     * @returns {Promise}
     */
    this.start = function() {
        return fubSocket.start();
    };

    /**
     * Start processing packets
     */
    this.online = function() {
        // Wire all the events
        fubSocket.on(UDPMessageListenSocket.PACKET, onIncomingPacket);
        fubSocket.on(UDPMessageListenSocket.BAD_PACKET, onBadPacket);
    };

    /**
     * Get the address that we're receiving packets on
     * @returns {RemoteInfo} the host and port
     */
    this.getSocketAddress = function() {
        return fubSocket.getSocketAddress();
    };
}

module.exports = Controller;
