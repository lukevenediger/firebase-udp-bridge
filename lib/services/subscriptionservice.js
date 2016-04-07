/* jshint -W097 */
/* globals require, module */
'use strict';

const q = require('q'),
    EventEmitter = require('events'),
    util = require('util'),
    Firebase = require('firebase'),
    FirebaseEventType = require('../lookups/firebaseeventtype.js'),
    FirebaseEvent = require('../lookups/firebaseevent.js'),
    FirebaseUtility = require('../firebase/firebaseutility.js'),
    ValueMessage = require('../types/messages/value.js');

const DATA_CHANGED = 'data-changed';

/**
 * Handles all subscription requests to watch for data changes
 * @param {Firebase} firebase the root node
 * @constructor
 */
function SubscriptionService(firebase) {
    EventEmitter.call(this);

    //var activeSubscriptions = {};

    /**
     * Subscribe to a node
     * @param {RequestPacket} requestPacket the subscription packet
     * @returns {Promise} resolves once the subscription is active
     */
    this.subscribe = function(requestPacket) {

        var message = requestPacket.message;
        var target = FirebaseUtility.getDataChild(firebase, message.path);

        var firebaseEvent;
        switch(message.eventType) {
            case FirebaseEventType.CHANGED:
                firebaseEvent = 'value';
                break;
            default:
                throw new Error('Invalid Firebase event type.');
        }

        target.on(firebaseEvent, function(snapshot) {
            var valueMessage = new ValueMessage(message.requestID, snapshot.val());
            requestPacket.reply(valueMessage).send();
        });

        return q();
    };

    /**
     * Subscribe a user to a channel
     * @param {RequestPacket} requestPacket the request
     * @returns {Promise} resolves once the subscription is active
     */
    this.subscribeChannel = function(requestPacket) {

        var message = requestPacket.message;
        var target = FirebaseUtility.getChannelRoot(firebase)
            .child(message.path);

        return FirebaseUtility.getFirebaseServerTime(firebase)
            .then(function success(serverTime) {

                // Subscribe to the event
                target.on(FirebaseEvent.t CHILD_ADDED, function(snapshot) {

                    var eventData = snapshot.val();
                    if (eventData.dateAdded >= serverTime) {

                        var valueMessage = new ValueMessage(message.requestID,
                            eventData.value);
                        requestPacket.reply(valueMessage).send();
                    }

                    // Remove the message
                    snapshot.ref().remove();
                });
            });
    };

    /**
     * Unsubscribe from a node
     * @param message the unsubscribe request
     * @param client the request client
     * @returns {Promise} resolves to a response message
     */
    this.unsubscribe = function() {
    };

    /**
     * Push a value into a channel
     * @param {RequestPacket} requestPacket
     */
    this.push = function(requestPacket) {
        var message = requestPacket.message;
        var target = FirebaseUtility.getChannelRoot(firebase)
            .child(message.path);

        var valueData = {
            dateAdded: Firebase.ServerValue.TIMESTAMP,
            value: message.value
        };

        var deferred = q.defer();
        target.push(valueData, function complete(error) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    };
}

util.inherits(SubscriptionService, EventEmitter);

// Constants
SubscriptionService.DATA_CHANGED = DATA_CHANGED;

module.exports = SubscriptionService;
