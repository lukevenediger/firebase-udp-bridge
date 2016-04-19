/**
 * Serves up the FUB site and developer tools
 * Created by lukevenediger on 2016/04/12.
 */

const express = require('express'),
    winston = require('winston');

/**
 * Create a new FUB WebService
 * @param {Number} listenPort the port to listen on
 * @param {String} staticRoot the root directory for static content
 * @constructor
 */
function WebService(listenPort, staticRoot) {

    var app = express();

    function initialise() {
        app.use('/', express.static(staticRoot));
    }

    /**
     * Start accepting web request
     */
    this.start = function() {
        app.listen(listenPort, function() {
            winston.info('WebService listening on port %s and serving from %s', listenPort, staticRoot);
        });
    };

    initialise();
}

module.exports = WebService;
