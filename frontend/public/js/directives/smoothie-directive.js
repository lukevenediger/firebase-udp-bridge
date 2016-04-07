/* jshint -W097 */
/* globals angular, SmoothieChart, TimeSeries */
'use strict';

angular.module('smoothie-directive', [])
    .directive('smoothieGrid', function() {
        return {
            template: '<canvas ng-transclude></canvas>',
            replace: true,
            transclude: true,
            restrict: 'E',

            scope: {
                background: '@',
                lineColor:  '@',
                lineWidth:  '@',
                labelColor: '@',
                minValue : '@'
            },

            controller: function($scope, $element) {
                this.canvas = $element[0];

                this.smoothie = new SmoothieChart({
                    grid: {
                        strokeStyle: $scope.lineColor || 'transparent',
                        fillStyle: $scope.background || 'transparent',
                        minValue : $scope.minValue || 0
                    },
                    labels: {
                        fillStyle: $scope.labelColor || 'transparent'
                    }
                });
            }
        };
    })

    .directive('timeSeries', function($interval) {
        return {
            restrict: 'E',
            require: '^smoothieGrid',

            scope: {
                rate:  '@',
                color: '@',
                width: '@',
                fill:  '@',
                callback: '&'
            },

            controller: function($scope) {
                $scope.rate = $scope.rate || 1000;
                $scope.line = new TimeSeries();
                $scope.callback = $scope.callback ? $scope.callback : function() { return false; };
            },

            link: function(scope, element, attrs, controller) {
                controller.smoothie.streamTo(controller.canvas, scope.rate);

                controller.smoothie.addTimeSeries(scope.line, {
                    strokeStyle: scope.color || 'green',
                    fillStyle: scope.fill,
                    lineWidth: scope.width || 2
                });

                var updateInterval = $interval(function() {
                    var point = scope.callback();
                    scope.line.append(point[0], point[1]);
                }, scope.rate);

                element.on('$destroy', function() {
                   $interval.cancel(updateInterval);
                });
            }
        };
    });
