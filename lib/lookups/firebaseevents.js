/* jshint -W097 */
/* globals  module */
'use strict';

/**
 * Event types used when querying data on Firebase
 */
var FirebaseEvents = {
    VALUE: 'value',
    CHILD_ADDED: 'child_added',
    CHILD_REMOVED: 'child_removed',
    CHILD_CHANGED: 'child_changed'
};

module.exports = FirebaseEvents;
