/* jshint -W097 */
/* globals app */
'use strict';

app.controller('landing-controller',  function ($scope, $location, $mdToast) {

    $scope.viewDevice = function() {
        if ($scope.deviceId) {
            $location.path("/viewer/" + $scope.deviceId);
        } else {
            $mdToast.show($mdToast.simple().textContent('Please enter a device Id'));
        }
    };
});
