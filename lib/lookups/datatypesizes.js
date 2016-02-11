/* jshint -W097 */
/* globals module */
'use strict';

/**
 * The size (in bytes) of data types used in the FUB packets.
 * @type {{STRING: number}}
 */
var DataTypeSizes = {
    STRING: 256,
    UUID: 16
};

module.exports = DataTypeSizes;
