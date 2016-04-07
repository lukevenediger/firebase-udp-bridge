/* jshint -W097 */
/* globals module */
'use strict';

/**
 * Holds information about a remote client
 * @constructor
 * @class
 * @param {String} address the remote client's address
 * @param {Number} port the remote client's origin port
 * @param {ConnectionType} connectionType the socket connection type (TCP/UDP)
 * @param {String} [connectionId] the unique connection identifier
 */
function RemoteInfo(address, port, connectionType, connectionId) {
    this.address = address;
    this.port = port;
    this.connectionType = connectionType;
    this.connectionId = connectionId;
}

/**
 * Return a string showing the ip and port of the remote endpoint.
 * @returns {string} <connectionType>://<address>:<port>
 */
RemoteInfo.prototype.toString = function() {
    return this.connectionType + '://' + this.address + ':' + this.port;
};

module.exports = RemoteInfo;
