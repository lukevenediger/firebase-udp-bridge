/* jshint -W097 */
/* globals require */
'use strict';

// Load all message types (to force them to register)
require('./messages/authenticate.js');
require('./messages/booleanvalue.js');
require('./messages/error.js');
require('./messages/floatvalue.js');
require('./messages/get.js');
require('./messages/integervalue.js');
require('./messages/loginfo.js');
require('./messages/nullvalue.js');
require('./messages/ping.js');
require('./messages/pong.js');
require('./messages/sessionstart.js');
require('./messages/setfloat.js');
require('./messages/setinteger.js');
require('./messages/setstring.js');
require('./messages/stringvalue.js');
require('./messages/subscribe.js');
require('./messages/unsubscribe.js');
