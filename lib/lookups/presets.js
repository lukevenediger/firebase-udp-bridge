/* jshint -W097 */
/* globals module */
'use strict';

/**
 * Server default and preset values
 */
var Presets = {
    udpListenPort: 21000,
    websocketListenPort: 22000,
    serverAddress: 'localhost',
    timeToNextPingMilliseconds: 10000,
    inactivityTimeoutMS: 30 * 1000 /* 30 seconds */
};

module.exports = Presets;
