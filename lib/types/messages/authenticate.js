/* jshint -W097 */
/* globals require, module */
'use strict';

const Message = require('./message.js'),
    MessageType = require('../../lookups/messagetype.js'),
    MessageWriter = require('../../comms/messagewriter.js'),
    MessageReader = require('../../comms/messagereader.js'),
    MessageHandlerRegistry = require('../../comms/messagehandlerregistry.js'),
    util = require('util');

const PACKET_VERSION = 1;

/*
 * Authenticate and open a session with the FUB
 * @param {String} id the device ID
 * @param {String} secret an encrypted secret
 * @class
 * @constructor
 * @see {@link https://github.com/lukevenediger/firebase-udp-bridge/wiki#authenticate|Authenticate}
 */
function Authenticate(id, secret) {
    Message.call(this, MessageType.AUTHENTICATE, PACKET_VERSION);

    this.id = id;
    this.secret = secret;
}

Authenticate.prototype.toString = function() {
    return MessageType.getMessageTypeName(this.type) + 'id=' + this.id +
        ', secret=' + this.secret;
};

Authenticate.prototype.serialize = function() {
    var data = new MessageWriter()
        .writeString(this.id)
        .writeString(this.secret)
        .toBuffer();

    return this.serializeWithHeader(data);
};

Authenticate.deserialize = function(buffer) {

    var authenticate = new Authenticate();

    var currentPosition = authenticate.deserializeHeader(buffer);
    var reader = new MessageReader(buffer, currentPosition);
    this.id = reader.readString();
    this.secret = reader.readString();
};

util.inherits(Authenticate, Message);

// Register this message
MessageHandlerRegistry.registerMessageTypeHandler(MessageType.AUTHENTICATE, Authenticate);

module.exports = Authenticate;
