/**
 * Created by lukevenediger on 2016/03/08.
 */

/* globals Plite, print, Sys, setTimeout, File, Wifi, WebSocket, ADC, GPIO, micros, usleep */

/* jshint ignore:start */
// PLite - promises library
function Plite(n){function t(n,e,i){n&&n.then?n.then(function(n){t(n,e,i)})["catch"](function(n){t(n,i,i)}):e(n)}function e(n){u=function(t,e){try{n(t,e)}catch(i){e(i)}},r(),r=void 0}function i(n){e(function(t,e){e(n)})}function c(n){e(function(t){t(n)})}function o(n,t){var e=r;r=function(){e(),u(n,t)}}var u,f=function(){},r=f,l={then:function(n){var t=u||o;return Plite(function(e,i){t(function(t){e(n(t))},i)})},"catch":function(n){var t=u||o;return Plite(function(e,i){t(e,function(t){i(n(t))})})},resolve:function(n){!u&&t(n,c,i)},reject:function(n){!u&&t(n,i,i)}};return n&&n(l.resolve,l.reject),l}Plite.resolve=function(n){return Plite(function(t){t(n)})},Plite.reject=function(n){return Plite(function(t,e){e(n)})},Plite.race=function(n){return n=n||[],Plite(function(t,e){var i=n.length;if(!i)return t();for(var c=0;i>c;++c){var o=n[c];o&&o.then&&o.then(t)["catch"](e)}})},Plite.all=function(n){return n=n||[],Plite(function(t,e){function i(){--u<=0&&t(n)}function c(t,c){t&&t.then?t.then(function(t){n[c]=t,i()})["catch"](e):i()}var o=n.length,u=o;if(!o)return t();for(var f=0;o>f;++f)c(n[f],f)})},"object"==typeof module&&"function"!=typeof define&&(module.exports=Plite);
/* jshint ignore:end */

function dumpFile(filename) {
    var h = File.open(filename);
    print(h.readAll());
    h.close();
}

function micros() {
    return Sys.time() * 1000 * 1000;
}

/**
 * Work out the average of an array of values
 * @param array
 * @returns {number}
 */
function average(array) {
    if (array.length === 0) {
        return 0;
    }
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum / array.length;
}

function FUBConnection(fubServer, deviceID) {
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

var Pins = {
    ULTRASONIC_TRIGGER: 5,
    ULTRASONIC_ECHO: 4
};

var PinMode = {
    INPUT_AND_OUTPUT: 0,
    INPUT: 1,
    OUTPUT: 2,
    INTERRUPT: 3
};

var InterruptType = {
    DISABLE_INTERRUPTS: 0,
    ENABLE_ON_POSITIVE_EDGE: 1,
    ENABLE_ON_NEGATIVE_EDGE: 2,
    ENABLE_ON_ANY_EDGE: 3,
    ENABLE_ON_LOW_LEVEL: 4,
    ENABLE_ON_HIGH_LEVEL: 5,
    BUTTON_MODE: 6
};

var PullupMode = {
    FLOATING: 0,
    HIGH: 1,
    LOW: 2
};

function Sensor() {

    var fub,
        fubServer = 'ws://192.168.0.8:22000',
        deviceID = Sys.conf.clubby.device_id;


    function initialise() {
        fub = new FUBConnection(fubServer, deviceID);

        ensureWifi()
            .then(function success() {
                fub.connect();
                loop();
            })
            .catch(function (err) {
                print ('Oops: ' + err);
            });
    }

    function ensureWifi() {
        return Plite(function (resolve) {
            function checkWifi() {
                setTimeout(function() {
                    var status = Wifi.status();
                    print('Wifi status: ' + status);
                    if (Wifi.status() === 'got ip') {
                        print('My IP is ' + Wifi.ip());
                        resolve();
                    } else {
                        checkWifi();
                    }
                }, 2000);
            }
            checkWifi();
        });
    }

    function loop() {
        var sample = [];

        setInterval(function() {
            var light = ADC.read(0);
            sample.push(light);
            // Work on a 5 second average
            if (sample.length > 10) {
                sample.shift();
            }
            print(sample);
            // Set the spot value
            fub.set('/' + deviceID + '/lightSensor/spot', ADC.read(0));
            // Set the rolling 5 second average
            fub.set('/' + deviceID + '/lightSensor/moving5SecondAverage', average(sample));
        }, 500);
    }

    initialise();
}

// new Sensor();

setTimeout(function () {
    print('Light Version 1');
}, 1000);

