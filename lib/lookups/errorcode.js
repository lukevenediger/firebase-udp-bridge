/* jshint -W097 */
/* globals module */
'use strict';

var ErrorCode = {
    UNKNOWN_ERROR: 1,
    INTERNAL_ERROR: 2,
    UNKNOWN_MESSAGE_TYPE: 3,
    INVALID_SUBSCRIPTION_EVENT_TYPE: 4,
    MISSING_SESSION_ID: 5
};

module.exports = ErrorCode;
