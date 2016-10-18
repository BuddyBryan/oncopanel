'use strict';

/**
 * @ngdoc function
 * @name matchminerUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the matchminerUiApp
 */
angular.module('matchminerUiApp')
  .controller('MainCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

     // Required variables
      $rootScope._teamId = 1;
      $rootScope._userId = 1;
  }]);
