/* jshint -W097 */
/* globals require, module */
'use strict';

var _ = require('underscore');

/**
 * Represents a message type
 */
var MessageType = {
    /**
     * Return the message type name
     * @param {Number} messageTypeId the message type ID
     * @returns {String}
     */
    getMessageTypeName: function(messageTypeId) {
        return _.invert(this)[messageTypeId];
    },
    PING: 1,
    PONG: 2,
    GET: 3,
    INTEGER_VALUE: 4,
    FLOAT_VALUE: 5,
    STRING_VALUE: 6,
    NULL_VALUE: 7,
    SUBSCRIBE: 8,
    UNSUBSCRIBE: 9,
    SET_INTEGER: 10,
    SET_FLOAT: 11,
    SET_STRING: 12,
    ERROR: 13,
    AUTHENTICATE: 14,
    SESSION_START: 15,
    LOG_INFO: 16
};

module.exports = MessageType;
