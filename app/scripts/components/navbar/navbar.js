'use strict';

/**
 * @ngdoc function
 * @name matchminerUiApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the navbar
 */
angular.module('matchminerUiApp')
  .controller('NavbarCtrl', ['$scope', '$location', function ($scope, $location) {
    // Helper for active links.
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
  }]);
