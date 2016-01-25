/* jshint -W097 */
/* globals require, module */
'use strict';

/**
 * Provides logging capabilities for connected clients
 * @constructor
 * @class
 */
function LogService() {

    return {
        /**
         * Log an info message
         * @param {Object} sender the remote client
         * @param {String} message the log message
         */
        logInfo: function(sender, message) {
            console.log('[INFO ' + sender.address + ':' + sender.port + '] ' + message);
        }
    }
}

module.exports = LogService;
