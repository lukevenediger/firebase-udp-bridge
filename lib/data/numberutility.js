/* jshint -W097 */
/* globals module, Math */
'use strict';

/**
 * A collection of useful functions for working with Numbers
 * @constructor
 * @class
 */
function NumberUtility() {

    /**
     * Generate a random number inclusively between min and max
     * Graciously stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
     * @param {Number} min inclusive starting point
     * @param {Number} max inclusive ending point
     * @returns {Number} random number
      */
    this.nextRandom = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Generate a random int32 number
     * @returns {Number} a random number inclusively between 0 and 2147483647
     */
    this.nextRandomInt32  = function() {
        return this.nextRandom(0, 2147483647);
    };
}

module.exports = new NumberUtility();
