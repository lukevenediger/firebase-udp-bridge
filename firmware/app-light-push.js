/* globals FUBConnection, setTimeout, print, Sys, GPIO, Witty, PinMode, PullupMode */

function LightPush() {

    var fub,
        fubServer = 'ws://192.168.0.9:22000',
        applicationID = 'smart',
        deviceID = Sys.conf.clubby.device_id;


    function initialise() {
        print('initialising in 1 second');
        setTimeout(function() {
            initialiseHardware();
        }, 1000);

        print('creating a fub instance');
        fub = new FUBConnection(fubServer, applicationID, deviceID);

        // Subscribe to events
        print('subscribing to an event');
        fub.on(FUBEvent.CONNECTED, onConnected);

        print('connecting in 1 second...');
        setTimeout(function() {
            fub.connect();
        }, 1000);
    }

    function onConnected() {
        print('Connected!');
        fub.subscribeChannel('/light/red', onRedLightFlash);
        print('Subscribed to channel');
    }

    function initialiseHardware() {
        print('initialiseHardware');
        GPIO.setMode(Witty.RGB_RED, PinMode.OUTPUT, PullupMode.LOW);
        GPIO.setMode(Witty.RGB_GREEN, PinMode.OUTPUT, PullupMode.LOW);
        GPIO.setMode(Witty.RGB_BLUE, PinMode.OUTPUT, PullupMode.LOW);
        GPIO.write(Witty.RGB_RED, false);
        GPIO.write(Witty.RGB_GREEN, false);
        GPIO.write(Witty.RGB_BLUE, false);
    }

    function onRedLightFlash() {
        GPIO.write(Witty.RGB_RED, true);
        setTimeout(function() {
            GPIO.write(Witty.RGB_RED, false);
        }, 200);
    }

    initialise();
}

setTimeout(function () {
    print('Light sensor.');
    print('Starting in 10 seconds...');

    setTimeout(function() {
        print('Starting up...');
        new LightPush();
    }, 10000);
}, 1000);

