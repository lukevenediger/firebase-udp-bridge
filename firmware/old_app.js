/**
 * Check for the latest sensor software
 */

/* globals Plite, print, Sys, Http, File, Wifi */

/* jshint ignore:start */
function Plite(n){function t(n,e,i){n&&n.then?n.then(function(n){t(n,e,i)})["catch"](function(n){t(n,i,i)}):e(n)}function e(n){u=function(t,e){try{n(t,e)}catch(i){e(i)}},r(),r=void 0}function i(n){e(function(t,e){e(n)})}function c(n){e(function(t){t(n)})}function o(n,t){var e=r;r=function(){e(),u(n,t)}}var u,f=function(){},r=f,l={then:function(n){var t=u||o;return Plite(function(e,i){t(function(t){e(n(t))},i)})},"catch":function(n){var t=u||o;return Plite(function(e,i){t(e,function(t){i(n(t))})})},resolve:function(n){!u&&t(n,c,i)},reject:function(n){!u&&t(n,i,i)}};return n&&n(l.resolve,l.reject),l}Plite.resolve=function(n){return Plite(function(t){t(n)})},Plite.reject=function(n){return Plite(function(t,e){e(n)})},Plite.race=function(n){return n=n||[],Plite(function(t,e){var i=n.length;if(!i)return t();for(var c=0;i>c;++c){var o=n[c];o&&o.then&&o.then(t)["catch"](e)}})},Plite.all=function(n){return n=n||[],Plite(function(t,e){function i(){--u<=0&&t(n)}function c(t,c){t&&t.then?t.then(function(t){n[c]=t,i()})["catch"](e):i()}var o=n.length,u=o;if(!o)return t();for(var f=0;o>f;++f)c(n[f],f)})},"object"==typeof module&&"function"!=typeof define&&(module.exports=Plite);
/* jshint ignore:end */

/**
 * Ensures that the device is always running the latest firmware
 * @param {String} fubAddress the ip or hostname of the FUB
 * @constructor
 * @class
 */
function SensorAutoUpgrade(fubAddress) {

    function fetchRemoteFile(filename) {
        print('fetchRemoteFile: Fetching ' + filename);

        return new Plite(function(resolve, reject) {

            print('fetchRemoteFile: begin HTTP request');

            Http.get({
                    host: fubAddress,
                    path: '/' + filename
                },
                function complete(response, error) {

                    print('fetchRemoteFile: starting to process response');

                    if (error) {
                        print('fetchRemoteFile: Error: ' + error);
                        reject(error);
                    } else {
                        var body = response.body;
                        print('fetchRemoteFile: response is ' + body);
                        var handle = File.open(filename, 'w');
                        handle.write(body);
                        handle.close();
                        resolve();
                    }
                })
                .end();
        });
    }

    function getFileAsJSON(filename) {
        print('getFileAsJSON: getting ' + filename);
        var handle = File.open(filename);
        if (handle) {
            var raw = handle.readAll();
            print('Parsing: ' + raw);
            handle.close();
            if (raw.length > 0) {
                return JSON.parse(raw);
            }
        } else {
            print('getFileAsJSON: file not found: ' + filename);
        }
    }

    function fetchLatestAndReboot(filename) {
        print('fetchLatestAndReboot: getting ' + filename);
        fetchRemoteFile(filename)
            .then(function success() {
                print('fetchLatestAndReboot: done. Rebooting...');
                Sys.reboot();
            });
    }

    function initialise() {

        print('initialise: Getting local manifest');
        // Get the local manifest
        var localManifest = getFileAsJSON('manifest.json') || {};

        // Get the remote manifest
        print('initialise: Getting remote manifest');
        fetchRemoteFile('manifest.json')
            .then(function success() {
                var remoteManifest = getFileAsJSON('manifest.json');

                print('initialise: Local is: ' + JSON.stringify(localManifest));
                print('initialise: Remote is: ' + JSON.stringify(remoteManifest));

                if (localManifest.version !== remoteManifest.version) {
                    print('initialise: version is different, upgrading...');
                    fetchLatestAndReboot(remoteManifest.app);
                } else {
                    print('Starting the app: ' + remoteManifest.app);
                    File.eval(remoteManifest.app);
                }

            });
    }

    initialise();
}

print('Ready. My IP is ' + Wifi.ip());
