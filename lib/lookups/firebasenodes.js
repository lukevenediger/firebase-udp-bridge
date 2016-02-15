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
    CONNECTION: '.info/connected',
    SERVER_TIME_OFFSET: '.info/serverTimeOffset'
};

module.exports = FirebaseNodes;
