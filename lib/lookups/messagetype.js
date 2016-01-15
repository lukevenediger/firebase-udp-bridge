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
    SUBSCRIBE: 8,
    UNSUBSCRIBE: 9,
    SET_INTEGER: 10,
    SET_FLOAT: 11,
    SET_STRING: 12,
    ERROR: 13
};

module.exports = MessageType;
