/* jshint -W097 */
/* jshint unused:false */
/* globals require, module, process, console, setTimeout, clearTimeout */
'use strict';

const program = require('commander'),
    pkg = require('../package.json'),
    q = require('q'),
    Presets = require('../lib/lookups/presets.js'),
    MessageType = require('../lib/lookups/messagetype.js'),
    Authenticate = require('../lib/types/messages/authenticate.js'),
    RemoteInfo = require('../lib/types/remoteinfo.js'),
    UDPMessageListenSocket = require('../lib/comms/udpmessagelistensocket.js'),
    AuthenticationState = require('../lib/lookups/authenticationstate.js'),
    PingMessage = require('../lib/types/messages/ping.js'),
    SubscribeMessage = require('../lib/types/messages/subscribe.js'),
    FirebaseEventType = require('../lib/lookups/firebaseeventtype.js'),
    SetMessage = require('../lib/types/messages/set.js');

const AUTH_TIMEOUT_MILLISECONDS = 30000,
    PING_DELAY = 10000;

/**
 * Fully functional FUB test client.
 * @constructor
 */
function Client() {

    var remoteAddress,
        remotePort,
        localListenPort,
        deviceId,
        deviceSecret,
        sessionID,
        serverRemoteInfo,
        fubSocket,
        authDeferred,
        authDeferredTimeoutHandle,
        authState, // unauthenticated, waiting-for-auth, authenticated, rejected
        pingTimeoutHandle;

    /**
     * Initialise the client
     */
    function initialise() {

        // Ensure that all messages are registered
        require('../lib/types/messageloader.js');

        authState = AuthenticationState.NOT_AUTHENTICATED;

        validateStartupParameters();
        serverRemoteInfo = new RemoteInfo(remoteAddress, remotePort);
        initialiseSocket(localListenPort)
            .then(authenticate)
            .then(startPing)
            .then(sendCommand)
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

        // Ensure mandatory parameters
        if(!deviceId) {
            throw new Error('Must specify a device ID.');
        }
    }

    /**
     * Initialise the UDP socket and start listening for data
     * @param {Number} clientListenPort the port to receive messages on
     * @returns {Promise} a promise that resolves to the UDP socket.
     */
    function initialiseSocket(clientListenPort) {
        fubSocket = new UDPMessageListenSocket(clientListenPort);

        fubSocket.on(UDPMessageListenSocket.PACKET, onIncomingPacket);
        fubSocket.on(UDPMessageListenSocket.BAD_PACKET, onBadPacket);

        return fubSocket.start();
    }

    /**
     * Authenticate with the FUB and get a session key
     * @returns {Promise} a promise which resolves to the encrypted session key and the UDP socket
     */
    function authenticate() {
        authDeferred = q.defer();

        // Set up the auth timeout
        authDeferredTimeoutHandle = setTimeout(function onAuthTimeout() {
            authDeferred.reject(new Error('No authentication response, timed-out.'));
        }, AUTH_TIMEOUT_MILLISECONDS);

        // Send the authenticate packet
        authState = AuthenticationState.WAITING_FOR_AUTHENTICATION;
        var authenticate = new Authenticate(deviceId, deviceSecret);
        fubSocket.sendPacket(authenticate, serverRemoteInfo);

        return authDeferred.promise;
    }

    /**
     * Start a keep-alive ping so that the FUB knows
     * we're online
     */
    function startPing() {
        pingTimeoutHandle = setTimeout(onPingTimeout, PING_DELAY);
    }

    /**
     * Send a command
     */
    function sendCommand() {
        var message;

        message = new Set(sessionID,
            '/sensorA/timestamp',
            new Date().getTime());
        fubSocket.sendPacket(message, serverRemoteInfo);

        /*
        message = new SetIntegerMessage(sessionID,
            '/sensorA/reading/int',
            NumberUtility.nextRandomInt32());
        fubSocket.sendPacket(message, serverRemoteInfo);

        message = new SetIntegerMessage(sessionID,
            '/devices/TemperatureBox2/output/value1',
            28);
        fubSocket.sendPacket(message, serverRemoteInfo);


        message = new SetFloatMessage(sessionID,
            '/sensorA/reading/float',
            NumberUtility.nextRandomFloat());
        fubSocket.sendPacket(message, serverRemoteInfo);

        message = new GetMessage(sessionID,
            1,
            '/sensorA/reading/int');
        fubSocket.sendPacket(message, serverRemoteInfo);

        message = new GetMessage(sessionID,
            1,
            '/sensorA/reading/float');
        fubSocket.sendPacket(message, serverRemoteInfo);

        */

        message = new SubscribeMessage(sessionID,
            2,
            '/sensorA/reading/changeMe',
            FirebaseEventType.CHANGED);
        fubSocket.sendPacket(message, serverRemoteInfo);

        /*

        message = new LogInfoMessage(sessionID,
            'This is a log message.');
        fubSocket.sendPacket(message, serverRemoteInfo);

        message = new SubscribeChannelMessage(sessionID,
            9123,
            '/bell/1234');
        fubSocket.sendPacket(message, serverRemoteInfo);

        setTimeout(function() {
            message = new PushBooleanMessage(sessionID,
                '/bell/1234',
                true);
            fubSocket.sendPacket(message, serverRemoteInfo);
        }, 200);

        setTimeout(function() {
            message = new PushBooleanMessage(sessionID,
                '/bell/1234',
                true);
            fubSocket.sendPacket(message, serverRemoteInfo);
        }, 2000);

        message = new SetStringMessage(sessionID,
            '/sensorA/writing/string',
            'This is a string value');
        fubSocket.sendPacket(message, serverRemoteInfo);
        */
    }

    function onPingTimeout() {
        fubSocket.sendPacket(new PingMessage(sessionID), serverRemoteInfo)
            .then(function success() {
                startPing();
            });
    }

    /**
     * Process a message received from the FUB
     * @param {RequestPacket} packet the incoming packet
     */
    function onIncomingPacket(packet) {
        console.log(packet.sender.address + ':' + packet.sender.port + ' - ' + packet.message.toString());
        if (authState === AuthenticationState.WAITING_FOR_AUTHENTICATION) {
            handleIncomingAuthPacket(packet);
        } else {
            handleIncomingPacket(packet);
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
     * Handle a packet while waiting for an auth response
     * @param {RequestPacket} packet the incoming packet
     */
    function handleIncomingAuthPacket(packet) {
        // Clear the auth wait timeout
        clearTimeout(authDeferredTimeoutHandle);

        switch (packet.message.type) {
            case MessageType.SESSION_START:
                sessionID = packet.message.sessionID;
                authState = AuthenticationState.AUTHENTICATED;
                console.log('Authenticated. Session ID: ' + sessionID);
                authDeferred.resolve();
                break;
            case MessageType.ERROR:
                authState = AuthenticationState.ACCESS_DENIED;
                authDeferred.reject(packet.message);
                break;
        }
    }

    /**
     * Handle a normal FUB packet
     */
    function handleIncomingPacket() {
        console.log('Incoming packet.');
    }

    initialise();
}

module.exports = {
    run: function() {
        new Client();
    }
};
