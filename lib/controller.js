'use strict';

var dgram = require('dgram'),
    colors = require('colors'),
    q = require('q'),
    MessageType = require('./lookups/messagetype.js'),
    UDPMessageListenSocket = require('./comms/udpmessagelistensocket.js');

/**
 * Creates a new Controller
 * @param {Number} port the listen port
 * @param {./SubscriptionService.js} subscriptionService the subscription service
 * @param {./QueryService.js} queryService the data query service
 * @param {./PresenceService.js} presenceService the client presence service
 * @param {./services/LogService.js} logService the client log service
 * @constructor
 */
function Controller(port,
                   subscriptionService,
                   queryService,
                   presenceService,
                   logService) {

    var fubSocket;

    function initialise() {

        // Create the FUB socket
        fubSocket = new FUBListenSocket(port);

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

        switch (type) {
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
                responsePromise = createErrorResponse(packet);
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

    initialise();

    // Public API
    return {
        /**
         * Start the UDP Bridge.
         */
        start: function() {
            fubSocket.listen();
        }
    }
}

module.exports = Controller;
