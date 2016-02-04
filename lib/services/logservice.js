/* jshint -W097 */
/* globals module, console */
'use strict';

/**
 * Provides logging capabilities for connected clients
 * @constructor
 * @class
 */
function LogService() {

    /**
     * Log an info message
     * @param {Object} sender the remote client
     * @param {String} message the log message
     */
    this.logInfo = function(sender, message) {
        console.log('[INFO ' + sender.address + ':' + sender.port + '] ' + message);
    };
}

module.exports = LogService;
