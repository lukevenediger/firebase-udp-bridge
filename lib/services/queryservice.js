/* jshint -W097 */
/* globals require, module */
'use strict';

const q = require('Q'),
    FirebaseUtility = require('../firebase/firebaseutility.js'),
    ValueMessage = require('../types/messages/value.js');

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
        var promise = FirebaseUtility
            .getDataChild(firebase, packet.message.path)
            .set(packet.message.value);
        return q(promise);
    };
}

module.exports = QueryService;
