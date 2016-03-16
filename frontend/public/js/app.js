var app = angular.module('devicefub', ['ui.router', 'ngMaterial', 'firebase', 'smoothie-directive']);

app.run(['$location', '$rootScope', function($location, $rootScope) {
}]);


app.directive('file', function() {
    return {
        require:"ngModel",
        restrict: 'A',
        link: function($scope, el, attrs, ngModel){
            el.bind('change', function(event){
                var files = event.target.files;
                var file = files[0];

                ngModel.$setViewValue(file);
                $scope.$apply();
            });
        }
    };
});


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}