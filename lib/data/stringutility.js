/* jshint -W097 */
/* globals module */
'use strict';

/**
 * A collection of useful functions for working with Strings
 * @constructor
 * @class
 */
function StringUtility() {

    /**
     * Remove all null (0-byte) characters
     * @param {String} value the input string
     */
    this.trimNullCharacters  = function(value) {
        return value.replace(/\0/g, '');
    };
}

module.exports = new StringUtility();
