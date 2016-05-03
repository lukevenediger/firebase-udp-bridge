/**
 * Created by lukevenediger on 2016/03/08.
 */

/* globals Plite, print, Sys, setTimeout, File, Wifi, WebSocket, ADC, GPIO, micros, usleep */


var Pins = {
    ULTRASONIC_TRIGGER: 5,
    ULTRASONIC_ECHO: 4
};

function Sensor() {

    var fub,
        fubServer = 'ws://192.168.1.204:22000',
        deviceID = Sys.conf.clubby.device_id;


    function initialise() {
        initialiseHardware();

        fub = new FUBConnection(fubServer, deviceID);

        ensureWifi()
            .then(function success() {
                //fub.connect();
                loop();
            })
            .catch(function (err) {
                print ('Oops: ' + err);
            });
    }

    function initialiseHardware() {
        print('Intialising pins...');
        // Ultrasonic sensor
        var result1 = GPIO.setmode(Pins.ULTRASONIC_TRIGGER, PinMode.OUTPUT, PullupMode.LOW);
        var result2 = GPIO.setmode(Pins.ULTRASONIC_ECHO, PinMode.INTERRUPT, PullupMode.LOW);
        print('Done: ' + result1 + ', ' + result2);
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

    /**
     * Get a distance measurement
     * @returns {Promise<Number>} a promise to the distance in millimeters
     */
    function readUltrasonicSensor() {
        print ('prepping to read ultrasonic sensor.');

        return new Plite(function (resolve) {
            var startTime;

            function waitForLow() {
                print('waiting for low');
                startTime = micros();
                /*
                GPIO.setisr(Pins.ULTRASONIC_ECHO,
                    InterruptType.ENABLE_ON_LOW_LEVEL,
                    reportResult);
                    */
            }

            function reportResult() {
                print('working out duration');
                GPIO.setisr(Pins.ULTRASONIC_ECHO,
                    InterruptType.DISABLE_INTERRUPTS);

                var duration = micros() - startTime;
                print ('Duration is ' + duration);
                var distance = 0;
                if (duration > 0) {
                    distance = (duration / 2) / 291;
                }
                print ('Distance is ' + distance);
                resolve(distance);
            }

            print('waiting for high');
            GPIO.setisr(Pins.ULTRASONIC_ECHO,
                InterruptType.ENABLE_ON_ANY_EDGE,
                waitForLow);

            print('Starting to read ultrasonic sensor.');
            GPIO.write(Pins.ULTRASONIC_TRIGGER, false);
            usleep(4);
            GPIO.write(Pins.ULTRASONIC_TRIGGER, true);
            usleep(10);
            GPIO.write(Pins.ULTRASONIC_TRIGGER, false);
            print('Done');

        });
    }

    function loop() {
        setTimeout(function () {
            // Send light sensor
            //fub.set('/' + deviceID + '/value', ADC.read(0));
            readUltrasonicSensor().then(function success(reading) {
                print('Distance is ' + reading + 'mm');
                //fub.set('/' + deviceID + '/distance', reading);
                loop();
            });
        }, 1000);
    }

    initialise();
}

// new Sensor();

function initPins() {
    // Ultrasonic sensor
    GPIO.setmode(Pins.ULTRASONIC_TRIGGER, PinMode.OUTPUT, PullupMode.LOW);
    GPIO.setmode(Pins.ULTRASONIC_ECHO, PinMode.INPUT, PullupMode.LOW);

    GPIO.write(Pins.ULTRASONIC_TRIGGER, false);
}

function triggerAndWait() {
    initPins();
    var startTime,
        duration = 0,
        loopDuration,
        timeoutPeriodMicroseconds = 5000000,
        interruptCount = 0;

    GPIO.setisr(Pins.ULTRASONIC_ECHO, InterruptType.ENABLE_ON_ANY_EDGE, function fired(pin, level) {
        interruptCount += 1;
        if (duration === 0) {
            duration = micros();
        } else {
            duration = micros() - duration;
        }
    });

    setTimeout(function() {
        print('Distance: ' + (duration / 57) + 'cm');
        print('Interrupts fired: ' + interruptCount);
    }, 5000);

    //print('Starting to read ultrasonic sensor.');
    GPIO.write(Pins.ULTRASONIC_TRIGGER, false);
    usleep(10);
    GPIO.write(Pins.ULTRASONIC_TRIGGER, true);
    usleep(10);
    GPIO.write(Pins.ULTRASONIC_TRIGGER, false);
   // print('Done');

    //print ('Starting to watch for a high signal');


    /*
    // Wait for it to go up
    loopDuration = micros();
    while (true) {
        if (GPIO.read(Pins.ULTRASONIC_ECHO)) {
            startTime = micros();
            break;
        }
        if (micros() - loopDuration > timeoutPeriodMicroseconds) {
            print ('Timed out waiting for high signal');
            return false;
        }
    }

    print ('Waiting for it to go low');

    loopDuration = micros();
    while (true) {
        if (!GPIO.read(Pins.ULTRASONIC_ECHO)) {
            duration = micros() - startTime;
            break;
        }
        if (micros() - loopDuration > timeoutPeriodMicroseconds) {
            print ('Timed out waiting for low signal');
            return false;
        }
    }
    print ('Distance: ' + (duration / 57) + 'cm');
    */
}

setTimeout(function () {
    print('Version 6');
}, 1000);


function readValue() {
    var high = GPIO.read(Pins.ULTRASONIC_ECHO);
    print('Pin is ' + (high ? 'high' : 'low'));
}
