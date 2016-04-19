/* jshint -W097 */
/* globals require, module */
'use strict';

const q = require('q'),
    _ = require('underscore'),
    FirebaseUtility = require('../firebase/firebaseutility.js'),
    ValueMessage = require('../types/messages/value.js'),
    FUBConstants = require('../lookups/fubconstants.js'),
    FirebaseEvent = require('../lookups/firebaseevent.js'),
    Firebase = require('firebase');

/**
 * Handles data reads and writes (not change events)
 * @param {Firebase} firebase the root firebase node
 * @constructor
 */
function QueryService(firebase) {

    /**
     * Gets a value at a node
     * @param {RequestPacket} packet the request packet
     * @returns {Promise<ResponsePacket>} resolves to a response packet
     */
    this.get = function(packet) {
        var promise = FirebaseUtility
            .getDataChild(firebase, packet.message.path)
            .once('value')
            .then(function success(snapshot) {
                var message = new ValueMessage(packet.message.requestID,
                    snapshot.val());
                return packet.reply(message);
            });

        return q(promise);
    };

    /**
     * Set a value at a node
     * @param {RequestPacket} packet the request packet
     * @returns {Promise} a promise to the node being updated
     */
    this.set = function(packet) {
        // Check if this is a timestamp
        var value;
        if (packet.message.value === FUBConstants.TIMESTAMP) {
            value = Firebase.ServerValue.TIMESTAMP;
        } else {
            value = packet.message.value;
        }

        var promise = FirebaseUtility
            .getDataChild(firebase, packet.message.path)
            .set(value);
        return q(promise);
    };

    /**
     * Set a value at a node only if it hasn't
     * been set before
     * @param {RequestPacket} packet the request packet
     * @returns {Promise} a promise to the node value being set
     */
    this.setOnce = function(packet) {
        var self = this;
        var promise = FirebaseUtility
            .getDataChild(firebase, packet.message.path)
            .once(FirebaseEvent.VALUE)
            .then(function success(snapshot) {
                if (!snapshot.exists()) {
                    return self.set(packet);
                }
            });
        return q(promise);
    };

    /**
     * Increment a node by a numeric value (positive or negative)
     * @param packet
     */
    this.increment = function(packet) {

        // Make sure the value is a number
        var delta = packet.message.value || 1;
        if (!_.isNumber(delta)) {
            throw new Error('Input value is not a number.');
        }

        var promise = FirebaseUtility.getDataChild(firebase, packet.message.path)
            .once(FirebaseEvent.VALUE)
            .then(function success(snapshot) {
                // Normalise the value to 0 if it doesn't exist
                var presentNumber = snapshot.val() || 0;
                return snapshot.ref().set(presentNumber + delta);
            });

        return q(promise);
    };
}

module.exports = QueryService;
