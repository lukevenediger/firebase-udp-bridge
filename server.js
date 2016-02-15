#!/usr/bin/env node
'use strict';
/* jshint -W097 */
/* globals require */

/**
 * The FUB Server
 * @constructor
 */
function Server() {

    var program = require('commander'),
        colors = require('colors'),
        Firebase = require('firebase'),
        pkg = require('./package.json'),
        Controller = require('./lib/controller.js'),
        SubscriptionService = require('./lib/services/subscriptionservice.js'),
        PresenceService = require('./lib/services/presenceservice.js'),
        QueryService = require('./lib/services/queryservice.js'),
        AuthenticationService = require('./lib/services/authenticationservice.js'),
        SessionService = require('./lib/services/sessionservice.js'),
        LogService = require('./lib/services/logservice.js'),
        Presets = require('./lib/lookups/presets.js'),
        FirebaseUtility = require('./lib/firebase/firebaseutility.js');

    var listenPort = Presets.serverListenPort;

    function initialize() {
        checkStartupParameters();
        checkForUpgrade();
        startService();
    }

    function checkStartupParameters() {
        program
            .version(pkg.version)
            .option('-p, --port [number]', 'specifies the port (default: ' + listenPort + ')')
            .option('-f, --firebase [string]', 'specifies the firebase namespace')
            .option('-k, --secretkey [string]', 'specifies the Firebase secret key')
            .parse(process.argv);

        if (!isNaN(parseFloat(program.port)) && isFinite(program.port)) {
            listenPort = program.port;
        }

        if (!program.firebase) {
            throw new Error('Must specify a Firebase namespace.');
        }
        program.firebase = 'https://' + program.firebase + '.firebaseio.com';

        if (!program.secretkey) {
            throw new Error('Must specify a Firebase secret key.');
        }
    }

    function checkForUpgrade() {
        require('check-update')({
            packageName: pkg.name,
            packageVersion: pkg.version,
            isCLI: true
        }, function (err, latestVersion, defaultMessage) {
            if (!err) {
                console.log(defaultMessage);
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

    function startService() {
        // Ensure that all messages are registered
        require('./lib/types/messageloader.js');

        var firebase = new Firebase(program.firebase),
            sessionService = new SessionService(firebase),
            subscriptionService = new SubscriptionService(firebase),
            presenceService = new PresenceService(Presets.timeToNextPingMilliseconds),
            queryService = new QueryService(firebase),
            authenticationService = new AuthenticationService(),
            logService = new LogService();

        console.log('Server starting up...');

        var controller;

        FirebaseUtility.authWithCustomToken(firebase, program.secretkey)
            .then(function success() {
                controller = new Controller(listenPort,
                    firebase,
                    subscriptionService,
                    queryService,
                    presenceService,
                    authenticationService,
                    sessionService,
                    logService);

                console.log('Connected to firebase.');
                return controller.start();
            })
            .then(function success() {
                controller.online();
                var address = controller.getSocketAddress();
                console.log('Server running at => ' + colors.green(address));
            });
/*
        controller.start()
            .then(function success() {
                return FirebaseUtility.authWithCustomToken(firebase, program.secretkey);
            })
            .then(function success() {
                console.log('Connected to firebase.');
                controller.online();
                var address = controller.getSocketAddress();
                console.log('Server running at => ' + colors.green(address));
            })
            .done();
            */
    }

    initialize();
}

new Server();

