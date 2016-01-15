#!/usr/bin/env node
'use strict';

var program = require('commander'),
    pkg = require('./package.json'),
    dgram = require('dgram'),
    colors = require('colors'),
    MessageUtility = require('./lib/messageutility.js'),
    MessageType = require('./lib/lookups/messagetype.js'),
    ProtocolProvider = require('./lib/protocolprovider.js'),
    ServiceMessage = ProtocolProvider.createServiceMessage(),
    _ = require('underscore');

var serverAddress = '10.4.108.22',
    remotePort = 11000,
    listenPort = remotePort + 1,
    request = 'p',
    lastPingSequenceNumber = 9128,
    deviceId = 'box0001',
    udp;

function checkStartupParameters() {

    program
        .version(pkg.version)
        .option('-s, --server [string]', 'specifies the target ip address (default: localhost)')
        .option('-p, --remotePort [number]', 'specifies the target port (default: ' + remotePort + ')')
        .option('-l, --listenPort [number]', 'specifies the local listen port (default: ' + listenPort + ')')
        .option('-r, --request [string]', 'specify the request to execute')
        .parse(process.argv);

    function isIntegerParam(param) {
        return !isNaN(parseFloat(param)) && isFinite(param);
    }

    if (program.server) { serverAddress = program.server; }
    if (program.request) { request = program.request; }
    if (isIntegerParam(program.remotePort)) { remotePort = program.remotePort; }
    if (isIntegerParam(program.listenPort)) { listenPort = program.listenPort; }
}

function start() {
    udp = dgram.createSocket('udp4');

    udp.on('listening', function() {
        var address = udp.address();
        console.log('Client listening at\n  => ' + colors.green(address.address + ':' + listenPort));
    });
    udp.on('message', onIncomingPacket);
    udp.bind(listenPort);

    processCommand();
}

function onIncomingPacket(incomingBuffer, rInfo) {
    var message = ServiceMessage.decode(incomingBuffer);
    var messageType = MessageUtility.getMessageType(message);
    console.log(messageType + ' from ' + rInfo.address + ':' + rInfo.port + ' - ' + message.encodeJSON());
}

function processCommand() {
    var parts = request.split('-');
    switch (parts[0]) {
        case 'p':
            sendPingPacket();
            break;
        case 's':
            sendSubscribePacket();
            break;
        case 'g':
            sendGetPacket();
            break;
        case 'f':
            sendSetNumberPacket();
            break;
        case 'm':
            var messageText = program.args.join(' ');
            sendLogMessagePacket(messageText);
            break;
        default:
            console.log('(p)ing, (s)ubscribe, (g)et, set(n)umber, send(m)message');
            break;
    }
}

function sendMessage(message, type, messageId) {
    var serviceMessage = new ServiceMessage();
    serviceMessage.set(type, message);
    if (messageId) {
        serviceMessage.set('messageId', messageId)
    }
    var buffer = serviceMessage.encodeNB();
    udp.send(buffer, 0, buffer.length, remotePort, serverAddress, function complete() {
        console.log(type + ' to ' + serverAddress + ':' + remotePort + ' - ' + serviceMessage.encodeJSON());
    });
}

function sendPingPacket() {
    var ping = {
        sequenceNumber: lastPingSequenceNumber
    };
    sendMessage(ping, MessageType.PING);
}

function sendSubscribePacket() {
    var subscribe = {
        path: 'devices/' + deviceId + '/input/value1',
        subscriptionId: 1234
    };
    sendMessage(subscribe, MessageType.SUBSCRIBE, MessageUtility.nextMessageId())
}

function sendSetNumberPacket() {
    var setNumber = {
        path: 'devices/TemperatureBox1/output/value1',
        value: 26
    };
    sendMessage(setNumber, MessageType.SET_NUMBER);
}

function sendLogMessagePacket(message) {
    var packet = {
        deviceId: deviceId,
        text: message
    };
    sendMessage(packet, MessageType.LOG_MESSAGE);
}

checkStartupParameters();
start();
