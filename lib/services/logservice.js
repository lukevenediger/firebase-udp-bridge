/* jshint -W097 */
/* globals require, module, console */
'use strict';

var q = require('Q');

/**
 * Provides logging capabilities for connected clients
 * @constructor
 * @class
 */
function LogService() {

    /**
     * Log an info message
     * @param {String} message the message text
     * @param {RemoteInfo} sender the sender's host and port
     * @return {Promise} a promise
     */
    this.logInfo = function(message, sender) {
        console.log('[INFO ' + sender.address + ':' + sender.port + '] ' + message);
        return q();
    };
}

module.exports = LogService;
