/* jshint -W097 */
/* globals require, module */
'use strict';

const q = require('q'),
    winston = require('winston'),
    MessageType = require('./lookups/messagetype.js'),
    ErrorMessage = require('./types/messages/error.js'),
    ErrorCodes = require('./lookups/errorcode.js'),
    FirebaseUtility = require('./firebase/firebaseutility.js'),
    SessionStartMessage = require('./types/messages/sessionstart.js'),
    LogLevel = require('./lookups/loglevel.js');

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
        winston.error('Unknown message type: ' + requestPacket.message.type);
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
     * Dispatch a packet to the appropriate service
     * @param {RequestPacket} packet the request packet
     * @returns {Promise<ResponsePacket>} a promise to a response
     */
    function processPacket(packet) {

        var responsePromise;

        switch (packet.message.type) {
            case MessageType.AUTHENTICATE:
                responsePromise = authenticateUser(packet);
                break;
            case MessageType.PING:
                responsePromise = sessionService.ping(packet);
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
            case MessageType.SET_ONCE:
                responsePromise = queryService.setOnce(packet);
                break;
            case MessageType.INCREMENT:
                responsePromise = queryService.increment(packet);
                break;
            case MessageType.PUSH:
                responsePromise = subscriptionService.push(packet);
                break;
            case MessageType.LOG:
                responsePromise = logService.log(packet);
                break;
            default:
                responsePromise = q(createUnknownMessageTypeResponse(packet));
                break;
        }

        if (packet.message.sessionID) {
            // Add a step on the end of the chain
            responsePromise.then(function() {
                // Update last-touch for this user
                return sessionService.updateLastTouch(
                    packet.sender,
                    packet.message.sessionID);
            });
        }

        return responsePromise;
    }


    /**
     * Called when a valid packet arrives
     * @param {RequestPacket} requestPacket the packet
     */
    this.onIncomingPacket = function(requestPacket) {

        try {
            processPacket(requestPacket)
                .then(function processResponse(responsePacket) {
                    if (responsePacket) {
                        responsePacket.send();
                    }
                })
                .done();
        } catch (error) {
            winston.error('Error processing this request.');
            winston.error(error);

            // Try tell the client that something went wrong.
            try {
                requestPacket
                    .reply(new ErrorMessage(0, 'Sorry, your request could not be processed.'))
                    .send();
            } catch (_) {
                // Do nothing.
            }
        }
    };

    /**
     * Notify the controller that a remote connection has closed
     * @param {RemoteInfo} remoteInfo the remote host's network information
     */
    this.onConnectionClosed = function(remoteInfo) {
        if (remoteInfo.connectionId) {
            sessionService.endSessionForConnection(remoteInfo.connectionId);
        }
    };

    /**
     * Notify the controller that the connection has not had any activity
     * for some time
     * @param {RemoteInfo} remoteInfo the client connection's remote info
     * @param {ConnectionInactivityResponse} connectionInactivityResponse a response object used to decide what to do with the connection
     */
    this.onConnectionInactive = function(remoteInfo, connectionInactivityResponse) {

        // End the session associated with this connection
        sessionService.endSessionForConnection(remoteInfo.connectionId)
            .then(function success(sessionID) {

                // End the websocket connection
                connectionInactivityResponse.closeConnection();

                if (sessionID) {
                    winston.log(LogLevel.INFO, 'Closed connection %s and session %s', remoteInfo, sessionID);
                } else {
                    winston.log(LogLevel.INFO, 'Closed connection %s', remoteInfo);
                }
            })
            .done();
    };
}

module.exports = Controller;
