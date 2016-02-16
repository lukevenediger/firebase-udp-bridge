/* jshint -W097 */
/* globals module */
'use strict';

/**
 * Represents a message type
 */
var MessageType = {
    PING: 1,
    PONG: 2,
    GET: 3,
    INTEGER_VALUE: 4,
    FLOAT_VALUE: 5,
    STRING_VALUE: 6,
    NULL_VALUE: 7,
    BOOLEAN_VALUE: 17,
    SUBSCRIBE: 8,
    UNSUBSCRIBE: 9,
    SET_INTEGER: 10,
    SET_FLOAT: 11,
    SET_STRING: 12,
    ERROR: 13,
    AUTHENTICATE: 14,
    SESSION_START: 15,
    LOG_INFO: 16,
    SUBSCRIBE_CHANNEL: 18,
    PUSH_BOOLEAN: 19
};

module.exports = MessageType;
