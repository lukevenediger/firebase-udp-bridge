/* jshint -W097 */
/* globals require, module, console */
'use strict';

const EventEmitter = require('events'),
    util = require('util'),
    q = require('q'),
    WebSocketServer = require('ws').Server,
    MessageFactory = require('./messagefactory.js'),
    RequestPacket = require('./../types/requestpacket.js'),
    RemoteInfo = require('./../types/remoteinfo.js'),
    ErrorMessage = require('./../types/messages/error.js');

const PACKET = 'packet',
    BAD_PACKET = 'bad packet';

/**
 * Handles communication with the remote client
 * @param {Websocket} ws the connected client socket
 * @param {RemoteInfo} remoteInfo the remote client host and port
 * @param {Function} onRequestPacketCallback called when the client sends a new packet
 * @constructor
 */
function WSConnectionHandler(ws, remoteInfo, onRequestPacketCallback) {

    function initialise() {
        // Hook up all events
        ws.on('message', onMessage);
        ws.on('close', onClose);
        ws.on('error', onError);
        ws.on('ping', onPing);
        ws.on('pong', onPong);
    }

    function onMessage(data) {
        try {
            var message = MessageFactory.deserializeString(data);
            var requestPacket = new RequestPacket(message, remoteInfo, sendReply);
            onRequestPacketCallback(requestPacket);
        } catch (error) {
            var error = new ErrorMessage(0, 'Sorry, we could not process your request.');
            sendReply(error);
        }
    }

    function onClose() {
    }

    function onError(error) {
        console.log('Error occurred' + error);
    }

    function onPing() {
    }

    function onPong() {
    }

    function sendReply(message) {
        var json = JSON.stringify(message);
        ws.send(json, function complete(error) {
            if (error) {
                handleError(error);
            }
        });
    }

    function handleError(error) {
        console.log('Error occurred' + error);
    }

    initialise();
}

/**
 * A Websocket listener that can process FUB packets
 * @param {Number} port the listen port
 * @constructor
 */
function WSMessageListenSocket(port) {
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
        console.log('WS: Listening on ' + port);

        return q();
    }

    /**
     * Handle a new web socket connection
     * @param {WebSocket} ws the client websocket
     */
    function onConnection(ws) {
        var remoteInfo = new RemoteInfo(ws._socket.remoteAddress,
            ws._socket.remotePort);
        console.log('Incoming connection from ' + remoteInfo);
        new WSConnectionHandler(ws, remoteInfo, onRequestPacket);
    }

    /**
     * Called when a websocket has a packet from a client
     * @param {RequestPacket} requestPacket the request packet
     */
    function onRequestPacket(requestPacket) {
        self.emit(PACKET, requestPacket);
    }

    /**
     * Start listening for traffic
     * @returns {Promise} a promise that resolves when the server is ready
     */
    this.listen = function() {
        return initialise();
    }
}

util.inherits(WSMessageListenSocket, EventEmitter);

WSMessageListenSocket.PACKET = PACKET;
WSMessageListenSocket.BAD_PACKET = BAD_PACKET;

module.exports = WSMessageListenSocket;
