/* jshint -W097 */
/* globals require, module */
'use strict';

const Packet = require('../types/requestpacket.js'),
    MessageFactory = require('../comms/messagefactory.js');

/**
 * Handles data reads and writes (not change events)
 * @param {Firebase} firebase the root firebase node
 * @constructor
 */
function QueryService(firebase) {

    /**
     * Gets a value at a node
     * @param {Packet} packet the request packet
     * @returns {Promise} resolves to a response packet
     */
    this.get = function(packet) {
        return firebase.once(packet.message.path)
            .then(function onSnapshot(snapshot) {
                var message = MessageFactory.createValueMessage(packet.message.requestID,
                    snapshot.val());
                return new Packet(message, packet.sender);
            });
    };

    /**
     * Sets a number value at a node
     * @param {Packet} packet the request packet
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
