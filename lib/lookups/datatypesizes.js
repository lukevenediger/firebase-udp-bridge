/* jshint -W097 */
/* globals module */
'use strict';

/**
 * The size (in bytes) of data types used in the FUB packets.
 * @type {{STRING: number}}
 */
var DataTypeSizes = {
    STRING: 256,
    UUID: 16,
    BOOLEAN: 2,
    INT_16: 2,
    INT_32: 4,
    UINT_64: 8,
    CONTROL_CODE: 2,
    FLOAT: 4
};

module.exports = DataTypeSizes;
