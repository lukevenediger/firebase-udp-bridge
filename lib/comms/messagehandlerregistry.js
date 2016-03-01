/* jshint -W097 */
/* globals module */
'use strict';

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

        // Make sure it's got a deserialize method
        if (!clazz.deserialize) {
            throw new Error('Missing "deserialize" function on the handler class.');
        }

        var key = makeMessageTypeKey(messageType);
        if (handlers.hasOwnProperty(key)) {
            var messageTypeName = handlers[key];
            throw new Error('Handler for ' + messageTypeName + '(' + key + ') aready exists.');
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
