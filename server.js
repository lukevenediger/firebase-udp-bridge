#!/usr/bin/env node
'use strict';
/* jshint -W097 */
/* globals require */

const program = require('commander'),
    Firebase = require('firebase'),
    q = require('q'),
    winston = require('winston'),
    pkg = require('./package.json'),
    Controller = require('./lib/controller.js'),
    SubscriptionService = require('./lib/services/subscriptionservice.js'),
    PresenceService = require('./lib/services/presenceservice.js'),
    QueryService = require('./lib/services/queryservice.js'),
    AuthenticationService = require('./lib/services/authenticationservice.js'),
    SessionService = require('./lib/services/sessionservice.js'),
    LogService = require('./lib/services/logservice.js'),
    Presets = require('./lib/lookups/presets.js'),
    FirebaseUtility = require('./lib/firebase/firebaseutility.js'),
    UDPMessageListenSocket = require('./lib/comms/udpmessagelistensocket.js'),
    WSMessageListenSocket = require('./lib/comms/wsmessagelistensocket.js');

/**
 * The FUB Server
 * @constructor
 */
function Server() {

    var udpListenPort = Presets.udpListenPort,
        websocketListenPort = Presets.websocketListenPort,
        logglyToken;

    function initialize() {
        checkStartupParameters();
        checkForUpgrade();
        setupLogging();
        startService();
    }

    function checkStartupParameters() {
        program
            .version(pkg.version)
            .option('-p, --udpListenPort [number]', 'specifies the udp listen port (default: ' + udpListenPort + ')')
            .option('-w, --wsListenPort [number]', 'specifies the websocket listen port (default: ' + websocketListenPort + ')')
            .option('-f, --firebase [string]', 'specifies the firebase namespace')
            .option('-k, --secretkey [string]', 'specifies the Firebase secret key')
            .option('-l, --logglyToken [string]', 'specifies the Loggly client token')
            .parse(process.argv);

        if (!isNaN(parseFloat(program.udpListenPort)) && isFinite(program.udpListenPort)) {
            udpListenPort = program.udpListenPort;
        }

        if (!isNaN(parseFloat(program.websocketListenPort)) && isFinite(program.websocketListenPort)) {
            websocketListenPort = program.wsListenPort;
        }

        if (!program.firebase) {
            throw new Error('Must specify a Firebase namespace.');
        }
        program.firebase = 'https://' + program.firebase + '.firebaseio.com';

        if (!program.secretkey) {
            throw new Error('Must specify a Firebase secret key.');
        }

        logglyToken = program.logglyToken;
    }

    function checkForUpgrade() {
        require('check-update')({
            packageName: pkg.name,
            packageVersion: pkg.version,
            isCLI: true
        }, function (err, latestVersion, defaultMessage) {
            if (!err) {
                winston.info(defaultMessage);
            }
        });

        /*
         require('check-update-github')({name: pkg.name, currentVersion: pkg.version, user: 'lukevenediger', branch: 'master'}, function(err, latestVersion, defaultMessage){
         if(!err){
         console.log(defaultMessage);
         }
         });
         */
    }

    function setupLogging() {
        // Nothing to do for now.
    }

    function startService() {
        winston.info('Service starting up.');

        // Ensure that all messages are registered
        require('./lib/types/messageloader.js');

        var firebase = new Firebase(program.firebase),
            sessionService = new SessionService(firebase),
            subscriptionService = new SubscriptionService(firebase),
            presenceService = new PresenceService(Presets.timeToNextPingMilliseconds),
            queryService = new QueryService(firebase),
            authenticationService = new AuthenticationService(),
            logService = new LogService();

        var controller;

        FirebaseUtility.authWithCustomToken(firebase, program.secretkey)
            .then(function success() {
                winston.info('Connected to Firebase.');

                // Initialise the controller
                controller = new Controller(firebase,
                    subscriptionService,
                    queryService,
                    presenceService,
                    authenticationService,
                    sessionService,
                    logService);

                // Initialise the input channels
                var udp = new UDPMessageListenSocket(udpListenPort);
                var ws = new WSMessageListenSocket(websocketListenPort);

                // Link input channels to the controller
                udp.on(UDPMessageListenSocket.PACKET, controller.onIncomingPacket);
                ws.on(WSMessageListenSocket.PACKET, controller.onIncomingPacket);
                ws.on(WSMessageListenSocket.CONNECTION_CLOSED, controller.onConnectionClosed);

                return q.all(udp.listen(), ws.listen());
            })
            .then(function complete() {
                winston.info('Service has started.');
            })
            .done();
    }

    initialize();
}

new Server();

