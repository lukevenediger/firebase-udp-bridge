/**
 * Created by lukevenediger on 2016/03/08.
 */

/* jshint ignore:start */
// PLite - promises library
function Plite(n){function t(n,e,i){n&&n.then?n.then(function(n){t(n,e,i)})["catch"](function(n){t(n,i,i)}):e(n)}function e(n){u=function(t,e){try{n(t,e)}catch(i){e(i)}},r(),r=void 0}function i(n){e(function(t,e){e(n)})}function c(n){e(function(t){t(n)})}function o(n,t){var e=r;r=function(){e(),u(n,t)}}var u,f=function(){},r=f,l={then:function(n){var t=u||o;return Plite(function(e,i){t(function(t){e(n(t))},i)})},"catch":function(n){var t=u||o;return Plite(function(e,i){t(e,function(t){i(n(t))})})},resolve:function(n){!u&&t(n,c,i)},reject:function(n){!u&&t(n,i,i)}};return n&&n(l.resolve,l.reject),l}Plite.resolve=function(n){return Plite(function(t){t(n)})},Plite.reject=function(n){return Plite(function(t,e){e(n)})},Plite.race=function(n){return n=n||[],Plite(function(t,e){var i=n.length;if(!i)return t();for(var c=0;i>c;++c){var o=n[c];o&&o.then&&o.then(t)["catch"](e)}})},Plite.all=function(n){return n=n||[],Plite(function(t,e){function i(){--u<=0&&t(n)}function c(t,c){t&&t.then?t.then(function(t){n[c]=t,i()})["catch"](e):i()}var o=n.length,u=o;if(!o)return t();for(var f=0;o>f;++f)c(n[f],f)})},"object"==typeof module&&"function"!=typeof define&&(module.exports=Plite);
// interval function - alternative to setInterval
function interval(func,wait,times){var interv=function(w,t){return function(){if(typeof t==="undefined"||t-->0){setTimeout(interv,w);try{func.call(null);} catch(e){t=0;throw e.toString();}}};}(wait,times);setTimeout(interv,wait);};
/* jshint ignore:end */

function dumpFile(filename) {
    var h = File.open(filename);
    print(h.readAll());
    h.close();
}

function Sensor() {

    var ws,
        deviceID = Sys.conf.clubby.device_id;

    function initialise() {
        connectToFUB()
            .then(startAuth)
            .then(loop)
            .catch(function (err) {
                print ('Oops: ' + err);
            });
    }

    function connectToFUB() {
        return new Plite(function (resolve, reject) {
            print('Connecting to the FUB...');
            ws = new WebSocket('ws://192.168.0.6:22000');
            print ('Here 1');
            ws.onopen = function() {
                print('Connected.');
                resolve();
            };
            ws.onclose = function() {
                print('Disconnected.');
            };
            ws.onerror = function(e) {
                print('Error: ' + e);
            }
        });
    }

    function startAuth() {
        return new Plite(function (resolve, reject) {
            print('Setting up onmessage');
            ws.onmessage = function (event) {
                print ('Got: ' + event.data);
                resolve();
            };
            print('Sending authentication packet');
            print('Device ID is ' + deviceID);
            var auth = {
                type: 'authenticate',
                id: deviceID
            };
            send(auth);
        });
    }

    function loop() {
        setTimeout(function () {
            send({
                type: 'set',
                sessionID: 'sessionID',
                path: '/' + deviceID + '/light',
                value: ADC.read(0)
            });
            loop();
        }, 500);
    }

    function send(data) {
        var rawPayload = JSON.stringify(data);
        print('Sending ' + rawPayload);
        ws.send(rawPayload);
    }

    function onMessage(event) {
        print('Got: ' + event.data);
    }

    initialise();
}

Wifi.changed(function (status) {
    print('Wifi status' + status);
});
