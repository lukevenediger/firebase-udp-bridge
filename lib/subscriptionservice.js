'use strict';

var SubscriptionEventType = require('./lookups/subscriptioneventtype.js'),
    ErrorMessage = require('./types/errmsg.js'),
    ErrorCode = require('./lookups/errorcode.js'),
    MessageType = require('./lookups/messagetype.js'),
    FirebaseEventType = require('./lookups/firebaseeventtype.js'),
    MessageUtility = require('./messageutility.js'),
    q = require('q')

/**
 * Handles all subscription requests to watch for data changes
 * @param {Firebase} rootFirebase the root node
 * @constructor
 */
function SubscriptionService(rootFirebase) {

    return {
        /**
         * Subscribe to a node
         * @param message the subscription request
         * @param {Client} client the request client
         * @returns {Promise} resolves to a response message
         */
        subscribe: function(message, client) {

            var target = rootFirebase.child(message.path);

            var firebaseEvent;
            switch(message.eventType) {
                case SubscriptionEventType.CHANGED:
                    firebaseEvent = 'value';
                    break;
                default:
                    return new ErrorMessage(ErrorCode.INVALID_SUBSCRIPTION_EVENT_TYPE, message.eventType);
            }

            var handlerFunction = target.on(firebaseEvent, function(snapshot) {
                var value = MessageUtility.floatToInt32(snapshot.val());
                client.send(MessageType.NUMBER_EVENT, {
                    subscriptionId: message.subscriptionId,
                    eventType: FirebaseEventType.CHANGED,
                    value: value
                });
            });

            return q();
        },
        /**
         * Unsubscribe from a node
         * @param message the unsubscribe request
         * @param client the request client
         * @returns {Promise} resolves to a response message
         */
        unsubscribe: function(message, client) {
        }
    };
}

module.exports = SubscriptionService;
