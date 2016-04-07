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
    FirebaseEvent = require('../lookups/firebaseevent.js');

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
            .push(sessionId);

        // Save the connection info so that we can end a session on a disconnect
        if (remoteInfo.connectionType === ConnectionType.TCP) {
            activeConnections[remoteInfo.connectionId] = sessionId;
        }

        // Execute the session promise and the client promise before returning the new session ID
        return q.all(sessionPromise, clientPromise)
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

                var clientPromise = FirebaseUtility.getClientRoot()
                    .child(clientId)
                    .child(FirebaseNodes.ClientNodes.ACTIVE_SESSIONS)
                    .child(sessionId)
                    .remove();

                // Close the session
                var sessionPromise = FirebaseUtility.getSessionRoot(firebase)
                    .child(sessionId)
                    .remove();

                return q.all(sessionPromise, clientPromise);

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
            return this.endSession(sessionID);
        } else {
            return q();
        }
    };

    initialize();
}

module.exports = SessionService;
