'use strict';

var MessageType = require('./lookups/messagetype.js');

/**
 * Provides utility functions for handling messages
 * @constructor
 */
function MessageUtility() {

    var messageId = 1;

    return {
        /**
         * Get the message type for this message
         * @param {ServiceMessage} serviceMessage the message
         * @returns {string} the message type
         */
        getMessageType: function(serviceMessage) {
            for (var key in MessageType) {
                var value = MessageType
                if (MessageType.hasOwnProperty(key) && serviceMessage[MessageType[key]]) {
                   return MessageType[key];
                }
            }
        },
        /**
         * Get the next available message ID
         * @returns {number} the message ID
         */
        nextMessageId: function() {
            messageId += 1;
            return messageId;
        },
        /**
         * Convert a float to an int32
         * @param {Number} float a float
         * @returns {Number} an integer
         */
        floatToInt32: function(float) {
            return Math.floor(float * 1000);
        }
    }
}

module.exports = new MessageUtility();

