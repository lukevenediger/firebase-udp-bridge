'use strict';

var q = require('q'),
    MessageType = require('./lookups/messagetype.js'),
    ResponseMessage = require('./types/responsemessage.js');
/**
 * Handles presence tracking for connected clients
 * @param {Firebase} firebase the root firebase node
 * @constructor
 */
function PresenceService(firebase) {

    // Public API
    return {
        /**
         * Handles a ping request
         * @param request the ping request
         * @param client the remote client
         * @returns {Promise} promise that resolves to a response message
         */
        ping: function(request, client) {
            var response = new ResponseMessage(MessageType.PONG, {
              sequenceNumber: request.sequenceNumber + 1
            });

            return q(response);
        }
    }
}

module.exports = PresenceService;
