/* jshint -W097 */
/* globals require, module */
'use strict';

const q = require('Q'),
    RequestPacket = require('../types/requestpacket.js'),
    MessageUtility = require('../comms/messageutility.js'),
    FirebaseUtility = require('../firebase/firebaseutility.js');

/**
 * Handles data reads and writes (not change events)
 * @param {Firebase} firebase the root firebase node
 * @constructor
 */
function QueryService(firebase) {

    /**
     * Gets a value at a node
     * @param {RequestPacket} packet the request packet
     * @returns {Promise} resolves to a response packet
     */
    this.get = function(packet) {
        return firebase.once(packet.message.path)
            .then(function onSnapshot(snapshot) {
                var message = MessageUtility.createValueMessage(packet.message.requestID,
                    snapshot.val());
                return new RequestPacket(message, packet.sender);
            });
    };

    /**
     * Set an integer value
     * @param {RequestPacket} packet the request packet
     * @returns {Promise} a promise to the node being updated
     */
    this.setInteger = function(packet) {
        var promise = FirebaseUtility
            .getDataChild(firebase, packet.message.path)
            .set(packet.message.value);
        return q(promise);
    };

    /**
     * Set a floating-point value
     * @param {RequestPacket} packet the request packet
     * @returns {Promise} a promise to the node being updated
     */
    this.setFloat = function(packet) {
        var promise = FirebaseUtility
            .getDataChild(firebase, packet.message.path)
            .set(packet.message.value);
        return q(promise);
    };

    /**
     * Sets a number value at a node
     * @param {RequestPacket} packet the request packet
     * @returns {Promise} resolves to a response message
     */
    this.setNumber = function(packet) {
        return firebase.child(packet.message.path)
            .set(packet.message.value)
            .then(function success() {
                // no response required
                return null;
            });
    };
}

module.exports = QueryService;
