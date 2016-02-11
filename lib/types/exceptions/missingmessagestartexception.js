/* jshint -W097 */
/* globals require, module */
'use strict';

const util = require('util');

/**
 * Thrown when a message buffer doesn't start with the correct control code
 * @constructor
 */
function MissingMessageStartException() {
    Error.call(this, 'Message did not start with the correct control code.');
}

util.inherits(MissingMessageStartException, Error);

module.exports = MissingMessageStartException;
