/* globals Plite, setTimeout, clearTimeout, print, WebSocket */

var FUBConstants = {
    TIMESTAMP: 'fub:timestamp'
};

/**
 * List of FUB events
 */
var FUBEvent = {
    CONNECTED: 'connected'
};

/**
 * A FUB connection
 * @param {String} fubServer the FUB socket address
 * @param {String} applicationID the application ID
 * @param {String} deviceID the device ID
 * @constructor
 */
function FUBConnection(fubServer, applicationID, deviceID) {
    var ws,
        sessionID,
        serverTime,
        attempts = 1,
        isSocketReady = false,
        subscriptions = {},
        openRequests = {},
        subscriptionCounter = 0,
        events = {};

    var AUTH_TIMEOUT = 10000;

    var MessageType = {
        PING: 'ping',
        GET: 'get',
        VALUE: 'value',
        SET: 'set',
        SET_ONCE: 'set_once',
        INCREMENT: 'increment',
        PUSH: 'push',
        SUBSCRIBE: 'subscribe',
        SUBSCRIBE_CHANNEL: 'subscribe_channel',
        UNSUBSCRIBE: 'unsubscribe',
        ERROR: 'error',
        AUTHENTICATE: 'authenticate',
        SESSION_START: 'session_start',
        LOG: 'log'
    };

    var LogLevel = {
        INFO: 'info',
        WARN: 'warn',
        ERROR: 'error'
    };

    function createWebSocket () {
        print('Connection attempt ' + attempts);
        ws = new WebSocket(fubServer);

        ws.onopen = function () {
            // reset the tries back to 1 since we have a new connection opened.
            attempts = 1;

            // Proceed with auth
            authenticate()
                .then(function success(sID, sTime) {
                    print('Authenticated. SessionID: ' + sID);

                    sessionID = sID;
                    serverTime = sTime;
                    ws.onmessage = onIncomingMessage;

                    // Mark ourselves as ready to communicate
                    isSocketReady = true;
                    fireEvent(FUBEvent.CONNECTED);
                })
                .catch(function failed(error) {
                    print('Authentication failed: ' + error);
                    reconnect();
                });
        };

        ws.onerror = function (error) {
            print('Error: ' + error);
        };

        ws.onclose = function () {
            print('Closed.');
            isSocketReady = false;
            reconnect();
        };

        function reconnect() {
            print('Reconnecting...');
            var time = Math.min(30000, attempts * 1000);
            print('Waiting ' + time + 'ms to reconnect...');
            setTimeout(function () {
                // We've tried to reconnect so increment the attempts by 1
                attempts++;

                // Connection has closed so try to reconnect every 10 seconds.
                createWebSocket();
            }, time);
        }
    }

    function authenticate() {
        return Plite(function (resolve, reject) {

            var authSuccessful = false;
            // Set up a timeout that will fire if we don't
            // get an auth response in time
            setTimeout(function expired() {
                if (!authSuccessful) {
                    reject('Auth request timed out.');
                }
            }, AUTH_TIMEOUT);

            ws.onmessage = function(raw) {
                print(raw);
                print('Got auth response: ' + raw.data);
                authSuccessful = true;
                var message = JSON.parse(raw.data);
                if (message.type === MessageType.SESSION_START) {
                    resolve(message.sessionID, message.serverTime);
                } else {
                    reject('Unexpected response: ' + raw);
                }
            };

            print('Sending auth packet');
            send({
                type: MessageType.AUTHENTICATE,
                app: applicationID,
                id: deviceID
            }, true);
        });
    }

    function onIncomingMessage(message) {
        print('Got: ' + message.data);

        switch (message.type)  {
            case MessageType.VALUE:
                handleValueMessage(message);
                break;
        }
    }

    function handleValueMessage(message) {
        var request = openRequests[message.requestID];
        if (request) {
            // Fire the callback
            request.callback(message.value);
            // See if we need to remove it
            if (request.deleteOnComplete) {
                delete openRequests[message.requestID];
            }
        }
    }

    function send(message, override) {
        if (isSocketReady || override) {
            print('Sending a ' + message.type + ' message.');
            print(message);
            /*
            var raw = JSON.stringify(message);
            print('Sending ' + raw);
            ws.send(raw);
            */
        } else {
            print('Ignoring send - socket is not ready.');
        }
    }

    function log(level, module, message) {
        send({
            type: MessageType.LOG,
            version: 1,
            sessionID: sessionID,
            level: level,
            module: module,
            message: message
        });
    }

    function fireEvent(eventName) {
        if (events[eventName]) {
            events[eventName]();
        }
    }

    /**
     * Connect to the FUB and authenticate
     * @returns {Promise} a promise to the active, authenticated connection
     */
    this.connect = function() {
        return createWebSocket();
    };

    this.getSessionID = function() {
        return sessionID;
    };

    this.set = function(path, value) {
        send({
            type: MessageType.SET,
            path: path,
            value: value
        });
    };

    this.setOnce = function(path, value) {
        send({
            type: MessageType.SET_ONCE,
            path: path,
            value: value
        });
    };

    this.increment = function(path, value) {
        send({
            type: MessageType.INCREMENT,
            path: path,
            value: value
        });
    };

    /**
     * Subscribe to a message channel
     * @param {String} path the channel path
     * @param {Function} callback a function to call when a message arrives
     */
    this.subscribeChannel = function(path, callback) {
        subscriptionCounter += 1;
        subscriptions[path] = {
            requestID: subscriptionCounter
        };
        openRequests[subscriptionCounter] = {
            callback: callback,
            deleteOnComplete: false
        };

        // Issue the subscription request
        send({
            type: MessageType.SUBSCRIBE_CHANNEL,
            path: path,
            sessionID: sessionID,
            requestID: subscriptionCounter
        });
    };

    /**
     * Unsubscribe from a channel or node
     * @param {String} path the node or channel path
     */
    this.unsubscribe = function() {
    };

    this.logInfo = function(module, message) {
        log(LogLevel.INFO, module, message);
    };

    this.logWarn = function(module, message) {
        log(LogLevel.WARN, module, message);
    };

    this.logError = function(module, message) {
        log(LogLevel.ERROR, module, message);
    };

    /**
     * Subscribe to an event
     */
    this.on = function(eventName, callback) {
        events[eventName] = callback;
    };
}
