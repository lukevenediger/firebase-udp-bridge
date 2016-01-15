#!/usr/bin/env node
'use strict';

var program = require('commander'),
    colors = require('colors'),
    Firebase = require('firebase'),
    pkg = require('./package.json'),
    UDPBridge = require('./lib/udpbridge.js'),
    SubscriptionService = require('./lib/subscriptionservice.js'),
    PresenceService = require('./lib/presenceservice.js'),
    QueryService = require('./lib/queryservice.js');

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
    var firebase = new Firebase('https://devicefub.firebaseio.com/'),
        subscriptionService = new SubscriptionService(firebase),
        presenceService = new PresenceService(),
        queryService = new QueryService(firebase);

    var udpBridge = new UDPBridge(listenPort,
        subscriptionService,
        queryService,
        presenceService);
}

checkStartupParameters();
checkForUpgrade();
startService();
