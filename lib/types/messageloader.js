/* jshint -W097 */
/* globals require */
'use strict';

// Load all message types (to force them to register)
require('./messages/authenticate.js');
require('./messages/error.js');
require('./messages/get.js');
require('./messages/loginfo.js');
require('./messages/ping.js');
require('./messages/push.js');
require('./messages/sessionstart.js');
require('./messages/set.js');
require('./messages/subscribe.js');
require('./messages/unsubscribe.js');
require('./messages/subscribechannel.js');
require('./messages/value.js');
