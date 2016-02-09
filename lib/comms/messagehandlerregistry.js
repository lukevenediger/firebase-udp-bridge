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
     * Convert a message type
     * @param messageType
     * @returns {string} the message key
     */
    function makeMessageTypeKey(messageType) {
        return '_' + messageType;
    }

    /**
     * Register a constructor function as the handler for a message type
     * @param {Number} messageType the message type
     * @param {Function} clazz the constructor function
     */
    this.registerMessageTypeHandler = function(messageType, clazz) {
        var key = makeMessageTypeKey(messageType);
        if (handlers.hasOwnProperty(key)) {
            var messageTypeName = _.invert(MessageType)[key];
            throw new Error('Handler for ' + messageTypeName + ' aready exists.');
        }
        handlers[key] = clazz;
    };

    /**
     * Get the handler constructor function for this message type
     * @param {Number} messageType the message type
     * @returns {Message} a constructor function for this message type
     */
    this.getMessageHandler = function(messageType) {
        return handlers[makeMessageTypeKey(messageType)];
    };
}

module.exports = new MessageHandlerRegistry();