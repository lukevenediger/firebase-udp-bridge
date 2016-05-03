var FUBConstants = {
    TIMESTAMP: 'fub:timestamp'
};

function FUBConnection(fubServer, applicationID, deviceID) {
    var ws,
        sessionID,
        serverTime,
        attempts = 1,
        isSocketReady = false;

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
                    isSocketReady = true;
                })
                .catch(function failed(error) {
                    print ('Authentication failed: ' + error);
                    reconnect();
                });
        };

        ws.onerror = function(error) {
            print('Error: ' + error);
        };

        ws.onclose = function () {
            print('Closed.');
            isSocketReady = false;
            reconnect();
        };

        function reconnect() {
            print('Reconnecting...');
            var time = generateInterval(attempts);
            print('Waiting ' + time + 'ms to reconnect...');
            setTimeout(function () {
                // We've tried to reconnect so increment the attempts by 1
                attempts++;

                // Connection has closed so try to reconnect every 10 seconds.
                createWebSocket();
            }, time);
        }

        function generateInterval (k) {
            return Math.min(30000, k * 1000);
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

    function onIncomingMessage(raw) {
        print('Got: ' + raw.data);
    }

    function send(message, override) {
        if (isSocketReady || override) {
            print('Socket is ready. ');
            print('Stringifying ' + message);
            var raw = JSON.stringify(message);
            print('Sending ' + raw);
            ws.send(raw);
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

    this.connect = function() {
        createWebSocket();
    };

    this.getSessionID = function() {
        return sessionID;
    };

    this.set = function(path, value) {
        if (isSocketReady) {
            send({
                type: MessageType.SET,
                path: path,
                value: value
            });
        }
    };

    this.setOnce = function(path, value) {
        if (isSocketReady) {
            send({
                type: MessageType.SET_ONCE,
                path: path,
                value: value
            });
        }
    };

    this.increment = function(path, value) {
        if (isSocketReady) {
            send({
                type: MessageType.INCREMENT,
                path: path,
                value: value
            });
        }
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
}
