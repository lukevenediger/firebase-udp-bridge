'use strict';

/**
 * A list of firebase event types
 * See https://www.firebase.com/docs/web/api/query/on.html
 * @type {{CHANGED: number}}
 */
var FirebaseEventType = {
    CHANGED: 1 // maps to Firebase's "value" event
};

module.exports = FirebaseEventType;
