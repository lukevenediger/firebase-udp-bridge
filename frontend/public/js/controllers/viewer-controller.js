app.controller('viewer-controller',  function ($rootScope, $scope, $firebaseObject, $stateParams) {
    
    $scope.deviceId = $stateParams.deviceId;
    $scope.min = 0;
    $scope.max = 100;

    var ref = (new Firebase("https://devicefub.firebaseio.com/data/")).child($scope.deviceId);
    $scope.data = $firebaseObject(ref);
    
    $scope.getNextValue = function() {
        var value = $scope.data ? $scope.data.something : null;
        return [new Date().getTime(),  value];
    };

    $scope.minValueSeries = function() {
        return [new Date().getTime(),  $scope.min];
    };
  
    $scope.maxValueSeries = function() {
        return [new Date().getTime(),  $scope.max];
    };    
});
