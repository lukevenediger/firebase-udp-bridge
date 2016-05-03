/**
 * Created by lukevenediger on 2016/05/03.
 */

function micros() {
    return Sys.time() * 1000 * 1000;
}

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
