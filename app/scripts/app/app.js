'use strict';

/**
 * @ngdoc overview
 * @name matchminerUiApp
 * @description
 * # matchminerUiApp
 *
 * Main module of the application.
 */
angular
  .module('matchminerUiApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'md.data.table',
    'ngMaterial',
    'angular-loading-bar',
    'color.picker',
    'duScroll',
    '$q-spread',
    'matchminer-configuration'
  ])
  .config([ '$routeProvider', 'cfpLoadingBarProvider', '$mdThemingProvider',
            function ($routeProvider, cfpLoadingBarProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('blue-grey');

    /* Register Toast themes stylings for notifications */
    $mdThemingProvider.theme('neutral-toast');
    $mdThemingProvider.theme('success-toast');
    $mdThemingProvider.theme('warn-toast');

    $routeProvider
      .when('/', {
        templateUrl: 'scripts/app/main/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/matches', {
        templateUrl: 'scripts/app/matches/matches.html',
        controller: 'MatchesCtrl',
        controllerAs: 'matches'
      })
      .when('/filters', {
        templateUrl: 'scripts/app/filters/filters.html',
        controller: 'FiltersCtrl',
        controllerAs: 'filters'
      })
      .when('/patientsB', {
        templateUrl: 'scripts/app/patients/patientsB.html',
        controller: 'PatientsCtrl',
        controllerAs: 'patients'
      })
      .when('/patientsL', {
        templateUrl: 'scripts/app/patients/patientsL.html',
        controller: 'PatientsCtrl',
        controllerAs: 'patients'
      })
      .when('/patientsM', {
        templateUrl: 'scripts/app/patients/patientsM.html',
        controller: 'PatientsCtrl',
        controllerAs: 'patients'
      })
      .when('/about', {
        templateUrl: 'scripts/app/about/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });

      // Disable the loading bar spinner
      cfpLoadingBarProvider.includeSpinner = false;
  }]);
