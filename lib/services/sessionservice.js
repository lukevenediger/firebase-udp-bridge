/* jshint -W097 */
/* globals require, module */
'use strict';

const q = require('q'),
    uuid = require('node-uuid'),
    Firebase = require('firebase'),
    FirebaseUtility = require('../firebase/firebaseutility.js'),
    DeviceConnectionStatus = require('../lookups/deviceconnectionstatus.js');

/**
 * Manages user sessions
 * @param {Firebase} firebase the firebase client
 * @constructor
 * @class
 */
function SessionService(firebase) {

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
        var sessionRoot = FirebaseUtility.getSessionRoot(firebase);

        var sessionId = generateSessionID(id, secret);

        // Create a new session object
        var userSession = {
            id: id,
            address: remoteInfo.address,
            port: remoteInfo.port,
            startTime: Firebase.ServerValue.TIMESTAMP,
            connectionStatus: DeviceConnectionStatus.ONLINE
        };

        var fbPromise = sessionRoot
            .child(sessionId)
            .set(userSession)
            .then(function success() {
                return sessionId;
            });
        return q(fbPromise);
    };

    initialize();
}

module.exports = SessionService;
