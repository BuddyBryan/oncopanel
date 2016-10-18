'use strict';

/**
 * @ngdoc function
 * @name matchminerUiApp.controllerMatchesCtrl:
 * @description
 * # PatientsCtrl
 * Patient Controller of the matchminerUiApp
 */
var patients = angular.module('matchminerUiApp')
  .controller('PatientsCtrl',
      ['$scope', '$document', '$mdDialog', function($scope, $document, $mdDialog) {

    $scope.sidebarToggle = true;
}])
  .controller('SidebarCtrl',
    ['$scope', '$document', function($scope, $document) {

    /* Perform animated scroll to one of the section */
   $scope.scrollToMenuSection = function(section) {
      console.log("Scrolling to ", section);
     var scrollSection = angular.element(document.getElementById(section));
     return $document.scrollToElementAnimated(scrollSection, 150, 500);
   }
}]);




