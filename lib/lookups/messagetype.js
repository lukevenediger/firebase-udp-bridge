/* jshint -W097 */
/* globals module */
'use strict';

/**
 * Represents a message type
 */
var MessageType = {
    PING: 'ping',
    PONG: 'pong',
    GET: 'get',
    VALUE: 'value',
    SET: 'set',
    SET_ONCE: 'set_once',
    INCREMENT: 'increment',
    PUSH: 'push',
    SUBSCRIBE: 'subscribe',
    SUBSCRIBE_CHANNEL: 'subscribe_channel',
    UNSUBSCRIBE: 'unsubscribe',
    ERROR: 'error',
    AUTHENTICATE: 'authenticate',
    SESSION_START: 'session_start',
    LOG: 'log'
};

module.exports = MessageType;
