/* jshint -W097 */
/* globals module */
'use strict';

/**
 * Important Firebase node names
 * @type {string}
 */
var FirebaseNodes = {
    /**
     * Root of all data stored and read by
     * devices
     */
    DATA_ROOT: 'data',
    /**
     * Root of all user session data
     */
    SESSION_ROOT: 'session',
    /**
     * Root of all messaging channels
     */
    CHANNEL_ROOT: 'channel',
    /**
     * Root of all registered clients
     */
    CLIENT_ROOT: 'client',
    /**
     * Internal Firebase connection state
     */
    CONNECTION: '.info/connected',
    /**
     * Internal server time offset value
     */
    SERVER_TIME_OFFSET: '.info/serverTimeOffset',

    ClientNodes: {
        /**
         * The client's secret
         */
        SECRET: 'secret',
        /**
         * The root connection node
         */
        CONNECTION: 'connection',
        /**
         * The client's unique ID
         */
        CLIENT_ID: 'id',

        ConnectionNodes: {

            /**
             * Whether or not this client is connected
             */
            CONNECTED: 'connected',

            /**
             * Time that the user connected to the FUB
             */
            CONNECTED_TIMESTAMP: 'connectedTimestamp',

            /**
             * Time that the user disconnected from the FUB
             */
            DISCONNECTED_TIMESTAMP: 'disconnectedTimestamp',

            /**
             * The client's remote IP
             */
            REMOTE_IP: 'remoteIP',

            /**
             * The client's remote port
             */
            REMOTE_PORT: 'remotePort',

            /**
             * Whether this is a UDP or WS connection
             */
            CONNECTION_TYPE: 'connectionType',

            /**
             * Which FUB host this user is connected to
             */
            CONNECTED_TO: 'connectedTo'

        },

        /**
         * List of active sessions that this client has open
         */
        ACTIVE_SESSIONS: 'activeSessions'
    },

    SessionsNodes: {
        /**
         * Marks the time that the session ended
         */
        END_TIME: 'endTime',
        /**
         * Indicates the client's connection status
         */
        CONNECTION_STATUS: 'connectionStatus'
    }
};

module.exports = FirebaseNodes;
