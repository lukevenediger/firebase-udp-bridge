'use strict';

/**
 * Create a new error message
 * @param {ErrorCode} code the error code
 * @param {String} [description] additional info about this error
 * @constructor
 */
function ErrorMessage(code, description) {
    this.code = code;
    this.description = description;
}

module.exports = ErrorMessage;
