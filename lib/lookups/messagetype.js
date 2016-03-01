/* jshint -W097 */
/* globals module */
'use strict';

/**
 * Represents a message type
 */
var MessageType = {
    PING: 'ping',
    GET: 'get',
    SET: 'set',
    PUSH: 'push',
    SUBSCRIBE: 'subscribe',
    SUBSCRIBE_CHANNEL: 'subscribe_channel',
    UNSUBSCRIBE: 'unsubscribe',
    ERROR: 'error',
    AUTHENTICATE: 'authenticate',
    SESSION_START: 'session_start',
    LOG_INFO: 'log_info'
};

module.exports = MessageType;
