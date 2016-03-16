app.config(['$stateProvider', '$httpProvider', '$urlRouterProvider',function($stateProvider, $httpProvider, $urlRouterProvider) {

  $stateProvider
    .state('default', {
        templateUrl: 'views/container-view.html'
    })
    .state('landing-state', {
        parent: 'default',
        url: "/",
        templateUrl: 'views/landing.html',
        controller : 'landing-controller'
    })
    .state('viewer-state', {
        parent: 'default',
        url: "/viewer/{deviceId}",
        templateUrl: 'views/viewer.html',
        controller : 'viewer-controller',
    })

    $urlRouterProvider.otherwise(function($injector, $location) {
        $location.path("");
    });
}]);
