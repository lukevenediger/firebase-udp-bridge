/* jshint -W097 */
/* globals module */
'use strict';

/**
 * Holds information about a remote client
 * @constructor
 * @class
 * @param {String} address the remote client's address
 * @param {Number} port the remote client's origin port
 */
function RemoteInfo(address, port) {
    this.address = address;
    this.port = port;
}

/**
 * Return a string showing the ip and port of the remote endpoint.
 * @returns {string} <address>:<port>
 */
RemoteInfo.prototype.toString = function() {
    return this.address + ':' + this.port;
};

module.exports = RemoteInfo;
