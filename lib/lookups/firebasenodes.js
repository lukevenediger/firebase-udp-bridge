/* jshint -W097 */
/* globals module */
'use strict';

/**
 * Important Firebase node names
 * @type {string}
 */
var FirebaseNodes = {
    /**
     * Root of all data stored and read by
     * devices
     */
    DATA_ROOT: 'data',
    /**
     * Root of all user session data
     */
    SESSION_ROOT: 'session',
    /**
     * Root of all messaging channels
     */
    CHANNEL_ROOT: 'channel',



    CONNECTION: '.info/connected',
    SERVER_TIME_OFFSET: '.info/serverTimeOffset'
};

module.exports = FirebaseNodes;
