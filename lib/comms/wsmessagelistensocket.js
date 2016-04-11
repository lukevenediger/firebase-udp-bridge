/* jshint -W097 */
/* globals require, module, setTimeout, clearTimeout */
'use strict';

const EventEmitter = require('events'),
    util = require('util'),
    q = require('q'),
    uuid = require('node-uuid'),
    WebSocketServer = require('ws').Server,
    winston = require('winston'),
    MessageFactory = require('./messagefactory.js'),
    RequestPacket = require('./../types/requestpacket.js'),
    RemoteInfo = require('./../types/remoteinfo.js'),
    ErrorMessage = require('./../types/messages/error.js'),
    ConnectionType = require('../lookups/connectiontype.js');

const PACKET = 'packet',
    BAD_PACKET = 'bad packet',
    CONNECTION_CLOSED = 'connection closed',
    SOCKET_INACTIVE = 'socket inactive';

/**
 * Gives downstream services a chance to react to a connection
 * that has become inactive
 * @param {Function} onCloseCallback callback to signal that the socket must be closed
 * @param {Function} onIgnoreCallback callback to signal that it can be ignored
 * @constructor
 */
function ConnectionInactivityResponse(onCloseCallback, onIgnoreCallback) {

    /**
     * Close the connection
     */
    this.closeConnection = function() {
        onCloseCallback();
    };

    /**
     * Ignore this event
     */
    this.ignore = function() {
        onIgnoreCallback();
    };
}

/**
 * Handles communication with the remote client
 * @param {WebSocket} ws the connected client socket
 * @param {RemoteInfo} remoteInfo the remote client host and port
 * @param {Number} inactivityTimeoutMS time to wait before raising an inactivity event
 * @param {Function} onRequestPacketCallback called when the client sends a new packet
 * @param {Function} onConnectionClosedCallback called when the client connection is closed
 * @param {Function} onInactivityCallback called when there has been no traffic on the connection for longer than the inactivity period
 * @constructor
 */
function WSConnectionHandler(ws,
                             remoteInfo,
                             inactivityTimeoutMS,
                             onRequestPacketCallback,
                             onConnectionClosedCallback,
                             onInactivityCallback) {

    var inactivityTimeoutHandle;

    function initialise() {
        // Hook up all events
        ws.on('message', onMessage);
        ws.on('close', onClose);
        ws.on('error', onError);
        ws.on('ping', onPing);
        ws.on('pong', onPong);

        restartInactivityTimeout();
    }

    function onMessage(data) {
        try {
            winston.info('Received: ' + data);
            var message = MessageFactory.deserializeString(data);
            var requestPacket = new RequestPacket(message, remoteInfo, sendReply);
            onRequestPacketCallback(requestPacket);

            restartInactivityTimeout();
        } catch (error) {
            winston.error(error);
            var responseError = new ErrorMessage(0, 'Sorry, we could not process your request.');
            sendReply(responseError);
        }
    }

    function onClose() {
        onConnectionClosedCallback(remoteInfo);
    }

    function onError(error) {
        winston.info('Error occurred' + error);
    }

    function onPing() {
    }

    function onPong() {
    }

    function sendReply(message) {
        var json = JSON.stringify(message);
        winston.info('Sending ' + json);
        ws.send(json, function complete(error) {
            if (error) {
                handleError(error);
            }
        });
    }

    function handleError(error) {
        winston.info('Error occurred' + error);
    }

    function closeSocket() {
        clearTimeout(inactivityTimeoutHandle);
        ws.close();
    }

    function ignoreInactivityEvent() {
        restartInactivityTimeout();
    }

    /**
     * Clear the previous timeout and start a new timeout
     */
    function restartInactivityTimeout() {
        if (inactivityTimeoutHandle) {
            clearTimeout(inactivityTimeoutHandle);
        }
        // Start the inactivity timeout handle
        inactivityTimeoutHandle = setTimeout(onInactivityCallbackInternal,
            inactivityTimeoutMS);
    }

    function onInactivityCallbackInternal() {
        onInactivityCallback(
            remoteInfo,
            new ConnectionInactivityResponse(closeSocket, ignoreInactivityEvent)
        );
    }

    initialise();
}

/**
 * A Websocket listener that can process FUB packets
 * @param {Number} port the listen port
 * @param {Number} inactivityTimeoutMS time to wait before raising an inactivity event
 * @constructor
 */
function WSMessageListenSocket(port,
                               inactivityTimeoutMS) {
    EventEmitter.call(this);

    var server,
        self = this;

    /**
     * Initialise the socket
     * @returns {Promise} a promise that's resolved when the server is listening for traffic
     */
    function initialise() {
        server = new WebSocketServer({port: port});
        server.on('connection', onConnection);
        winston.info('WS: Listening on ' + port);

        return q();
    }

    /**
     * Handle a new web socket connection
     * @param {WebSocket} ws the client websocket
     */
    function onConnection(ws) {
        var remoteInfo = new RemoteInfo(ws._socket.remoteAddress,
            ws._socket.remotePort,
            ConnectionType.TCP,
            uuid.v4());

        winston.info('Incoming connection from ' + remoteInfo);
        new WSConnectionHandler(ws,
            remoteInfo,
            inactivityTimeoutMS,
            onRequestPacket,
            onConnectionClosed,
            onSocketInactivity);
    }

    /**
     * Called when a websocket has a packet from a client
     * @param {RequestPacket} requestPacket the request packet
     */
    function onRequestPacket(requestPacket) {
        self.emit(PACKET, requestPacket);
    }

    /**
     * Called when a websocket connection has closed
     * @param {RemoteInfo} remoteInfo the client's network information
     */
    function onConnectionClosed(remoteInfo) {
        self.emit(CONNECTION_CLOSED, remoteInfo);
    }

    /**
     * Called when a socket has not received any packets for the
     * specified inactivityTimeoutMS period
     * @param {RemoteInfo} remoteInfo
     * @param {ConnectionInactivityResponse} connectionInactivityResponse a response object used to decide what to do with the connection
     */
    function onSocketInactivity(remoteInfo, connectionInactivityResponse) {
        self.emit(SOCKET_INACTIVE, remoteInfo, connectionInactivityResponse);
    }

    /**
     * Start listening for traffic
     * @returns {Promise} a promise that resolves when the server is ready
     */
    this.listen = function() {
        return initialise();
    };
}

util.inherits(WSMessageListenSocket, EventEmitter);

WSMessageListenSocket.PACKET = PACKET;
WSMessageListenSocket.BAD_PACKET = BAD_PACKET;
WSMessageListenSocket.CONNECTION_CLOSED = CONNECTION_CLOSED;
WSMessageListenSocket.SOCKET_INACTIVE = SOCKET_INACTIVE;

module.exports = WSMessageListenSocket;
