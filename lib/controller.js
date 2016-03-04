/* jshint -W097 */
/* globals require, module, console */
'use strict';

const q = require('q'),
    MessageType = require('./lookups/messagetype.js'),
    ErrorMessage = require('./types/messages/error.js'),
    ErrorCodes = require('./lookups/errorcode.js'),
    FirebaseUtility = require('./firebase/firebaseutility.js'),
    SessionStartMessage = require('./types/messages/sessionstart.js');

/**
 * Creates a new Controller
 * @param {Firebase} firebase the firebase client
 * @param {SubscriptionService} subscriptionService the subscription service
 * @param {QueryService} queryService the data query service
 * @param {PresenceService} presenceService the client presence service
 * @param {AuthenticationService} authenticationService the client authentication service
 * @param {SessionService} sessionService the session management service
 * @param {LogService} logService the client log service
 * @constructor
 */
function Controller(firebase,
                    subscriptionService,
                    queryService,
                    presenceService,
                    authenticationService,
                    sessionService,
                    logService) {


    /**
     * Notify the client that we didn't understand their message type
     * @param {RequestPacket} requestPacket the incoming packet
     * @returns {*} Promise that resolves to a response packet
     */
    function createUnknownMessageTypeResponse(requestPacket) {
        console.log('Unknown message type: ' + requestPacket.message.type);
        var errorMessage = new ErrorMessage(ErrorCodes.UNKNOWN_ERROR);
        return requestPacket.reply(errorMessage);
    }

    /**
     * Authenticates a user and starts a new session
     * @param {RequestPacket} requestPacket the request
     * @return {Promise<ResponsePacket>} a promise to the response packet
     */
    function authenticateUser(requestPacket) {

        return authenticationService.authenticate(requestPacket.message.id,
                requestPacket.message.secret,
                requestPacket.sender)
            .then(function success() {

                var sessionIDPromise = sessionService.startSession(
                    requestPacket.message.id,
                    requestPacket.message.secret,
                    requestPacket.sender);

                var serverTimePromise = FirebaseUtility.getFirebaseServerTime(firebase);

                return q.all([sessionIDPromise, serverTimePromise]);
            })
            .spread(function (sessionID, serverTime) {

                var sessionStartMessage = new SessionStartMessage(sessionID,
                    serverTime);
                return requestPacket.reply(sessionStartMessage);
            });
    }

    /**
     * Called when a valid packet arrives
     * @param {RequestPacket} packet the packet
     */
    this.onIncomingPacket = function(packet) {

        console.log(packet.sender.address + ':' + packet.sender.port + ' - ' + packet.message.toString());

        var responsePromise;

        switch (packet.message.type) {
            case MessageType.AUTHENTICATE:
                responsePromise = authenticateUser(packet);
                break;
            case MessageType.PING:
                // Do nothing (will be handled after the switch block)
                responsePromise = q();
                break;
            case MessageType.SUBSCRIBE:
                responsePromise = subscriptionService.subscribe(packet);
                break;
            case MessageType.SUBSCRIBE_CHANNEL:
                responsePromise = subscriptionService.subscribeChannel(packet);
                break;
            case MessageType.UNSUBSCRIBE:
                responsePromise = subscriptionService.unsubscribe(packet);
                break;
            case MessageType.GET:
                responsePromise = queryService.get(packet);
                break;
            case MessageType.SET:
                responsePromise = queryService.set(packet);
                break;
            case MessageType.PUSH:
                responsePromise = subscriptionService.push(packet);
                break;
            case MessageType.LOG_INFO:
                responsePromise = logService.logInfo(packet.message.message,
                    packet.sender);
                break;
            default:
                responsePromise = q(createUnknownMessageTypeResponse(packet));
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
            .then(function processResponse(responsePacket) {
                if (responsePacket) {
                    responsePacket.send();
                }
            })
            .done();
    };
}

module.exports = Controller;
