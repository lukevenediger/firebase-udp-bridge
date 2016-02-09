/* jshint -W097 */
/* globals require, module */
'use strict';

const _ = require('underscore'),
    MessageType = require('../lookups/messagetype.js');

/**
 * Keeps a mapping of the handler for each message type
 * @constructor
 * @class
 */
function MessageHandlerRegistry() {
    var handlers = {};

    /**
     * Register a constructor function as the handler for a message type
     * @param {Number} messageType the message type
     * @param {Function} clazz the constructor function
     */
    this.registerMessageTypeHandler = function(messageType, clazz) {
        if (handlers.hasOwnProperty(messageType)) {
            var messageTypeName = _.invert(MessageType)[messageType];
            throw new Error('Handler for ' + messageTypeName + ' aready exists.');
        }
        handlers[messageType] = clazz;
    };

    /**
     * Get the handler constructor function for this message type
     * @param {Number} messageType the message type
     * @returns {Message} a constructor function for this message type
     */
    this.getMessageHandler = function(messageType) {
        return handlers[messageType];
    };
}

module.exports = new MessageHandlerRegistry();
