/* jshint -W097 */
/* globals require, module */
'use strict';

const util = require('util');

/**
 * Thrown when trying to wrap a value that is not a supported type
 * @param {*} value the input value
 * @constructor
 * @class
 * @extends Error
 */
function UnsupportedValueTypeException(value) {
    Error.call(this, 'Value type "' + (typeof value) + '" is not supported.');

    this.valueType = typeof value;
}

util.inherits(UnsupportedValueTypeException, Error);

module.exports = UnsupportedValueTypeException;
