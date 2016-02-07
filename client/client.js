/* jshint -W097 */
/* globals require, module, process, console, setTimeout, clearTimeout */
'use strict';

const program = require('commander'),
    pkg = require('../package.json'),
    dgram = require('dgram'),
    colors = require('colors'),
    q = require('q'),
    Presets = require('../lib/lookups/presets.js'),
    MessageType = require('../lib/lookups/messagetype.js'),
    MessageFactory = require('../lib/comms/messagefactory.js'),
    SecurityService = require('../lib/services/securityservice.js'),
    Authenticate = require('../lib/types/messages/authenticate.js');

const AUTH_TIMEOUT_MILLISECONDS = 30000;

/**
 * Fully functional FUB test client.
 * @constructor
 */
function Client() {

    var remoteAddress,
        remotePort,
        localListenPort,
        deviceId,
        deviceSecret;

    /**
     * Initialise the client
     */
    function initialise() {
        validateStartupParameters();
        initialiseSocket(localListenPort)
            .then(authenticate)
            .then(runMessageLoop)
            .catch(handleServerError)
            .done();
    }

    /**
     * Ensure that the user has passed in valid startup arguments.
     */
    function validateStartupParameters() {
        program
            .version(pkg.version)
            .option('-s, --server [string]', 'the FUB server address (default: ' + Presets.serverAddress + ')')
            .option('-p, --port [number]', 'the FUB server port (default: ' + Presets.serverListenPort + ')')
            .option('-k, --secretKey [string]', 'the secret key assigned to the client (default: none)')
            .option('-i, --identity [string]', 'the client\'s identity (default: none)')
            .option('-r, --request [string]', 'specify the request to execute (default: get /fub/version)')
            .parse(process.argv);

        // Apply defaults if needed
        remoteAddress = program.server || Presets.serverAddress;
        remotePort = program.port || Presets.serverListenPort;
        deviceId = program.identity;
        deviceSecret = program.secretKey;
        localListenPort = remotePort + 1;
    }

    /**
     * Initialise the UDP socket and start listening for data
     * @param {Number} clientListenPort the port to receive messages on
     * @returns {Promise} a promise that resolves to the UDP socket.
     */
    function initialiseSocket(clientListenPort) {
        var deferred = q.defer();
        var udp = dgram.createSocket('udp4');

        udp.once('listening', function listening() {
            var address = udp.address();
            console.log('Client listening at\n  => ' + colors.green(address.address + ':' + clientListenPort));
            deferred.resolve(udp);
        });
        udp.bind(clientListenPort);

        return deferred.promise;
    }

    /**
     * Authenticate with the FUB and get a session key
     * @param {Socket} udp the client socket
     * @returns {Promise} a promise which resolves to the encrypted session key and the UDP socket
     */
    function authenticate(udp) {
        var authDeferred = q.defer();

        // Set up the auth timeout
        var authTimeoutHandle = setTimeout(function onAuthTimeout() {
            authDeferred.reject(udp, new Error('No authentication response, timed-out.'));
        }, AUTH_TIMEOUT_MILLISECONDS);

        udp.once('message', function handleAuthResponse(incomingBuffer, remoteInfo) {
            var response = MessageFactory.deserialise(incomingBuffer, remoteInfo);
            if (response.type === MessageType.SESSION_START) {
                var sessionKey = SecurityService.decryptSessionKey(response.secret);
                authDeferred.resolve(udp, sessionKey);
            } else if (response.type === MessageType.ERROR) {
                authDeferred.reject(udp, response);
            } else {
                authDeferred.reject(udp, new Error('Invalid server response.'));
            }
            clearTimeout(authTimeoutHandle);
        });

        // Send the authenticate packet
        var authenticate = new Authenticate(deviceId, deviceSecret);

        return authDeferred.promise;
    }

    /**
     * Start the client-server message loop
     * @param {Socket} udp the udp client
     * @param {String} sessionKey the session key
     * @returns {Promise} a promise that resolves when the session ends.
     */
    function runMessageLoop(udp, sessionKey) {

        udp.on('message', function onHandleMessage(incomingBuffer, remoteInfo) {
            handleMessage(udp, sessionKey, incomingBuffer, remoteInfo);
        });

    }

    /**
     * Process a message received from the FUB
     * @param udp
     * @param sessionKey
     * @param incomingBuffer
     * @param remoteInfo
     */
    function handleMessage(udp, sessionKey, incomingBuffer, remoteInfo) {
        var serverMessage = MessageFactory.deserialise(incomingBuffer);
        console.log('Received ' + MessageFactory.getMessageTypeName(serverMessage) + ' from ' +
            remoteInfo.address + ':' + remoteInfo.Port + ' - ' + serverMessage.toString());
    }

    /**
     * Called when the server sends an error response or something goes wrong.
     * @param {Error} error the error that occurred
     */
    function handleServerError(error) {
        console.log('Server error: ' + error);
    }

    initialise();
}


module.exports = {
    run: function() {
        new Client();
    }
};
