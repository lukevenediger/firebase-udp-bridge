function Sensor() {

    var fub,
        //fubServer = 'ws://192.168.0.196:22000',
        fubServer = 'ws://devicefub.com:22000',
        applicationID = 'smart',
        deviceID = Sys.conf.clubby.device_id;


    function initialise() {
        initialiseHardware();

        fub = new FUBConnection(fubServer, applicationID, deviceID);
        fub.connect();
        loop();
    }

    function initialiseHardware() {
        print('Intialising pins...');
        // Ultrasonic sensor
        GPIO.setmode(Pins.ULTRASONIC_TRIGGER, PinMode.OUTPUT, PullupMode.LOW);
        GPIO.setmode(Pins.ULTRASONIC_ECHO, PinMode.INPUT, PullupMode.LOW);

    }

    function loop() {
        print('Starting loop...');

        setTimeout(function() {
            // Save the start time
            fub.setOnce('/' + deviceID + '/sessionStart', FUBConstants.TIMESTAMP);
            // Increment the run count
            fub.increment('/' + deviceID + '/runCount');
        }, 10000);

        function innerLoop() {
            setTimeout(function () {

                // Send light sensor
                fub.set('/' + deviceID + '/light/spot', ADC.read(0));

                // Send ultrasonic
                var distanceMM = GPIO.read(Pins.ULTRASONIC_TRIGGER, Pins.ULTRASONIC_ECHO);
                fub.set('/' + deviceID + '/distance/spot', distanceMM);

                // Save the counter
                fub.set('/' + deviceID + '/lastUpdated', FUBConstants.TIMESTAMP);

                innerLoop();

            }, 1000);
        }
        innerLoop();
    }

    initialise();
}

setTimeout(function () {
    print('Version 6');
    print('Starting in 10 seconds');

    setTimeout(function() {
        new Sensor();
    }, 10000);
}, 1000);

