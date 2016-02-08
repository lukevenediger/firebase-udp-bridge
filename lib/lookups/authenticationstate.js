/* jshint -W097 */
/* globals  module */
'use strict';

/**
 * A list of authentication states that a client moves through
 * while engaging with the FUB.
 * @type {String}
 */
var AuthenticationState = {
    /**
     * The client has not attempted to connect to the service
     */
    NOT_AUTHENTICATED: 'not-authenticated',
    /**
     * The client has requested authorisation and awaits a response
     */
    WAITING_FOR_AUTHENTICATION: 'waiting-for-authentication',
    /**
     * The client has been granted access and may proceed
     */
    AUTHENTICATED: 'authenticated',
    /**
     * The client has been denied access and may not proceed
     */
    ACCESS_DENIED: 'access-denied'
};

module.exports = AuthenticationState;
