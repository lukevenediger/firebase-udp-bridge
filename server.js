#!/usr/bin/env node
'use strict';

/* jshint -W097 */
/* globals require */

var program = require('commander'),
    //colors = require('colors'),
    Firebase = require('firebase'),
    pkg = require('./package.json'),
    Controller = require('./lib/controller.js'),
    SubscriptionService = require('./lib/services/subscriptionservice.js'),
    PresenceService = require('./lib/services/presenceservice.js'),
    QueryService = require('./lib/services/queryservice.js'),
    AuthenticationService = require('./lib/services/authenticationservice.js'),
    LogService = require('./lib/services/logservice.js');

var listenPort = 11000;

function checkStartupParameters() {
    program
        .version(pkg.version)
        .option('-p, --port [number]', 'specifies the port (default: ' + listenPort + ')')
        .parse(process.argv);

    if (!isNaN(parseFloat(program.port)) && isFinite(program.port)){
        listenPort = program.port;
    }
}

function checkForUpgrade() {
    require('check-update')({packageName: pkg.name, packageVersion: pkg.version, isCLI: true}, function(err, latestVersion, defaultMessage){
        if(!err){
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
    var firebase = new Firebase('https://fub-dev.firebaseio.com/'),
        subscriptionService = new SubscriptionService(firebase),
        presenceService = new PresenceService(firebase),
        queryService = new QueryService(firebase),
        authenticationService = new AuthenticationService(firebase),
        logService = new LogService();

    var controller = new Controller(listenPort,
        subscriptionService,
        queryService,
        presenceService,
        authenticationService,
        logService);

    controller.start();
}

checkStartupParameters();
checkForUpgrade();
startService();
