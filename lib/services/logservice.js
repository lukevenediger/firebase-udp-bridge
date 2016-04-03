/* jshint -W097 */
/* globals require, module */
'use strict';

var q = require('q'),
    winston = require('winston'),
    _ = require('underscore'),
    LogLevel = require('../lookups/loglevel.js'),
    LogSource = require('../lookups/logsource.js');

/**
 * Provides logging capabilities for connected clients
 * @constructor
 * @class
 */
function LogService() {

    var invertedLogLevels = _.invert(LogLevel);

    /**
     * Log a message from the client
     * @param {RequestPacket} packet the request packet
     * @return {Promise} a promise
     */
    this.log = function(packet) {
        // Make sure we have a valid log level
        if (invertedLogLevels.hasOwnProperty(packet.message.level)) {
            winston.log(
                packet.message.level,
                packet.message.message,
                {
                    source: LogSource.REMOTE_CLIENT,
                    module: packet.message.module,
                    sessionID: packet.message.sessionID,
                    remoteAddress: packet.sender.address
                }
            );
        } else {
            throw new Error('Invalid or undefined log level: ' + packet.message.level);
        }
        return q();
    };
}

module.exports = LogService;
