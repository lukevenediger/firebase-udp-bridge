/* jshint -W097 */
/* globals require, module */
'use strict';

const q = require('q'),
    uuid = require('node-uuid'),
    Firebase = require('firebase'),
    FirebaseUtility = require('../firebase/firebaseutility.js'),
    DeviceConnectionStatus = require('../lookups/deviceconnectionstatus.js'),
    ConnectionType = require('../lookups/connectiontype.js'),
    FirebaseNodes = require('../lookups/firebasenodes.js'),
    FirebaseEvent = require('../lookups/firebaseevent.js'),
    PongMessage = require('../types/messages/pong.js'),
    ErrorMessage = require('../types/messages/error.js'),
    ErrorCode = require('../lookups/errorcode.js');

/**
 * Manages user sessions
 * @param {Firebase} firebase the firebase client
 * @constructor
 * @class
 */
function SessionService(firebase) {

    var activeConnections = {};

    function initialize() {
    }

    /**
     * Generate a session ID
     * @param {String} id the device ID
     * @param {String} secret the device secret
     * @returns {String} a new session ID
     */
    function generateSessionID(/*id, secret*/) {
        return uuid.v4();
    }

    /**
     * Start a session for this remote device
     * @param {String} id the device ID
     * @param {String} secret the device secret
     * @param {RemoteInfo} remoteInfo the user's remote info
     * @returns {Promise<String>} a promise to the session ID
     */
    this.startSession = function(id, secret, remoteInfo) {

        var sessionId = generateSessionID(id, secret);

        // Create a new session object
        var userSession = {
            id: id,
            address: remoteInfo.address,
            port: remoteInfo.port,
            startTime: Firebase.ServerValue.TIMESTAMP,
            lastTouch: Firebase.ServerValue.TIMESTAMP,
            connectionStatus: DeviceConnectionStatus.ONLINE
        };

        var sessionPromise = FirebaseUtility.getSessionRoot(firebase)
            .child(sessionId)
            .set(userSession);

        var clientPromise = FirebaseUtility.getClientRoot(firebase)
            .child(id)
            .child(FirebaseNodes.ClientNodes.ACTIVE_SESSIONS)
            .child(sessionId)
            .set(true);

        var activeSessionPromise = FirebaseUtility.getClientRoot(firebase)
            .child(id)
            .child(FirebaseNodes.ClientNodes.ACTIVE_SESSIONS)
            .child(sessionId)
            .onDisconnect()
            .remove();

        // Set the endTime if we lose connection
        var endTimePromise = FirebaseUtility.getSessionRoot(firebase)
            .child(sessionId)
            .child(FirebaseNodes.SessionsNodes.END_TIME)
            .onDisconnect()
            .set(Firebase.ServerValue.TIMESTAMP);

        // Set the connection status if we lose connection
        var connectionStatusPromise = FirebaseUtility.getSessionRoot(firebase)
            .child(sessionId)
            .child(FirebaseNodes.SessionsNodes.CONNECTION_STATUS)
            .onDisconnect()
            .set(DeviceConnectionStatus.OFFLINE);

        // Save the connection info so that we can end a session on a disconnect
        if (remoteInfo.connectionType === ConnectionType.TCP) {
            activeConnections[remoteInfo.connectionId] = sessionId;
        }

        // Set up the session and client data, then hook the disconnect handlers
        // and finally return the session ID
        return q.all([
                sessionPromise,
                clientPromise
            ])
            .then(q.all([
                activeSessionPromise,
                endTimePromise,
                connectionStatusPromise
            ]))
            .then(function success() {
                return sessionId;
            });
    };

    /**
     * Close this session and clean up
     * @param {String} sessionId the session ID
     * @returns {Promise} a promise that resolves once the session has been cleaned up
     */
    this.endSession = function(sessionId) {

        // Get the client ID
        return q(FirebaseUtility.getSessionRoot(firebase)
            .child(sessionId)
            .child('id')
            .once(FirebaseEvent.VALUE)
            .then(function (snapshot) {
                return snapshot.val();
            })
            .then(function (clientId) {

                // Remove from the list of active sessions
                var clientPromise = FirebaseUtility.getClientRoot(firebase)
                    .child(clientId)
                    .child(FirebaseNodes.ClientNodes.ACTIVE_SESSIONS)
                    .child(sessionId)
                    .remove();

                // Mark session as offline
                var sessionStatusPromise = FirebaseUtility.getSessionRoot(firebase)
                    .child(sessionId)
                    .child(FirebaseNodes.SessionsNodes.CONNECTION_STATUS)
                    .set(DeviceConnectionStatus.OFFLINE);

                // Specify the session end time
                var sessionEndTimePromise = FirebaseUtility.getSessionRoot(firebase)
                    .child(sessionId)
                    .child(FirebaseNodes.SessionsNodes.END_TIME)
                    .set(Firebase.ServerValue.TIMESTAMP);

                return q.all([sessionStatusPromise, sessionEndTimePromise, clientPromise]);

                // TODO: Log metrics about the session here
                // TODO: Log a closure reason - timeout, connection closed etc
            }));

    };

    /**
     * Close a session based on the socket connection ID
     * @param {String} connectionId the socket connection ID
     * @returns {Promise} a promise that resolves when the session is removed
     */
    this.endSessionForConnection = function(connectionId) {
        var sessionID = activeConnections[connectionId];
        if (sessionID) {
            delete activeConnections[connectionId];
            return this.endSession(sessionID)
                .then(function success() {
                    return sessionID;
                });
        } else {
            return q();
        }
    };

    /**
     * Checks if a connection is associated with a session
     * @param {String} connectionId the unique connection ID
     * @returns {boolean} true if the connection is linked to a session, false otherwise
     */
    this.hasSession = function(connectionId) {
        return activeConnections.hasOwnProperty(connectionId);
    };

    /**
     * Update the last-touch timestamp for this user
     * @param {RemoteInfo} remoteInfo the client's remote connection info
     * @param {String} sessionId the client's session Id
     * @returns {Promise} a promise to the last touch time being updated on the server
     */
    this.updateLastTouch = function(remoteInfo, sessionId) {
        return q(FirebaseUtility.getSessionRoot(firebase)
            .child(sessionId)
            .child(FirebaseNodes.SessionsNodes.LAST_TOUCH)
            .set(Firebase.ServerValue.TIMESTAMP));
    };

    /**
     * Handles a ping request
     * @param {RequestPacket} packet
     * @returns {Promise<ResponsePacket>}
     */
    this.ping = function(packet) {
        var response;
        if (packet.message.sessionId) {
            response = packet.reply(new PongMessage());
        } else {
            response = packet.reply(new ErrorMessage(ErrorCode.MISSING_SESSION_ID, 'Missing Session ID'));
        }
        return q(response);
    };

    initialize();
}

module.exports = SessionService;
