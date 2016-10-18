'use strict';

/**
 * @ngdoc function
 * @name matchminerUiApp.controllerMatchesCtrl:
 * @description
 * # MatchesCtrl
 * Matches Controller of the matchminerUiApp
 */
angular.module('matchminerUiApp')
  .controller('MatchesCtrl',
      ['$scope', '$rootScope', '$q', 'MatchesService', 'UtilitiesService', 'ToastService',
      function ($scope, $rootScope, $q, MatchesService, UtilitiesService, ToastService) {

    // Datatable selected matches
    $scope.selectedMatches = [];

    // Available statuses
    $scope.matchStatusesState = {
      0 : "New",
      1 : "Archived",
      2 : "Flagged"
    };

    $scope.matchStatusChange = {
      0 : {
        state : "New",
        action : {
          1 : "Mark as archived",
          2 : "Mark as flagged"
        }
      },
      1 : {
        state : "Archived",
        action : {
          0 : "Mark as new",
          2 : "Mark as flagged"
        }
      },
      2 : {
        state : "Flagged",
        action : {
          0 : "Mark as new",
          1 : "Mark as archived"
        }
      }
    }

    $scope.alterationTypes = {
      'HA' : 'Amplification',
      '2DEL' : 'Deletion',
      'TRL' : 'Translocation'
    };

    // Required variables
    $scope._teamId = $rootScope._teamId || 1;
    $scope._matchStatus = 0;
    $scope._filterStatus = 1; /* Always only query active filters */
    $scope._page = 0;
    $scope._size = 10;
    $scope._sort = '';
    $scope.currentPage = 1;
    $scope.matches = 0;
    $scope.matchMap = {};
    $scope.geneMap = {};

    $scope.query = {
      'teamId': $scope._teamId,
      'matchStatus': $scope._matchStatus,
      'filterStatus' : $scope._filterStatus,
      'size': $scope._size,
      'sort' : $scope._sort,
      'page': $scope._page
    };

    $scope.filter = {};
    $scope.filter.show = false;

    console.log("Loading matchesservice");

    $scope.loadMatches = function(isSelect) {
      if (!!isSelect ) {
        return MatchesService.findByStatus($scope.query, $scope.success, $scope._error).$promise;
      }
    }

  /*
   * MD Data table functions
   */
  // Backend has successfully been queried and update the frontend model.
  // The actual data is stored in the _embedded.match object
  $scope.success = function(result) {
    $scope.totalElements = result.page.totalElements;
    $scope.currentPage = result.page.number+1;
    $scope.matches = result._embedded.match;
    var geneLookup = [];
    var genomicFilters = [];

    angular.forEach($scope.matches, function(m, i) {
      $scope.matchMap[m.id] = m;
      geneLookup.push(m.geneId);
      genomicFilters.push(m.genomicFilterId);
    });

    return $q.all([
      _hugoGeneSymbolLookup(geneLookup),
      _genomicFilterLookup(genomicFilters)
    ])
    .spread( function(geneMap, filters){
      $scope.geneMap = geneMap;
      $scope.genomicFilters = filters;
    })
    .catch($scope._error);
  }

  var _hugoGeneSymbolLookup = function(geneLookup) {
    var deferred = $q.defer();
    return new UtilitiesService(geneLookup).$convertGeneIdArrayToSymbol();
  }

  var _genomicFilterLookup = function(filters) {
    var deferred = $q.defer();
    return new UtilitiesService(filters).$genomicFilterLookup();
  }

  // Callback method for when a match model has been successfully updated.
  $scope.successUpdate = function(result) {
    ToastService.success("Successfully updated match status");
    $scope.loadMatches(true);
  }

  $scope._error = function(err) {
    console.log("An error occurred ", err);
    ToastService.warn("An error occurred while retrieving data. ", err);
  }

  // in the future we may see a few built in alternate headers but in the mean time
  // you can implement your own search header and do something like
  $scope.search = function (predicate) {
    $scope.filter = predicate;
    $scope.deferred = MatchesService.findByStatus($scope.query, $scope.success, $scope._error).$promise;
  };

  /*
   * Handle server side ordering of one of the columns.
   */
  $scope.onOrderChange = function (order) {
    $scope.query.sort = $scope.sortOrder.charAt(0) == '-' ? order.substr(1) +',asc' : order+',desc';
    return MatchesService.findByStatus($scope.query, $scope.success, $scope._error).$promise;
  };

  /*
   * Handle pagination of the md-data-table and query backend
   */
  $scope.onPaginationChange = function (page, limit) {
    $scope.query.page = page-1;
    $scope.query.size = limit;
    return MatchesService.findByStatus($scope.query, $scope.success, $scope._error).$promise;
  };

  /*
   * Update a Match
   * only when the status has changed.
   */
  $scope.updateStatus = function(match) {
    // Update only if status has changed.
    if (match.matchStatus != $scope.matchMap[match.id].matchStatus) {
      return new MatchesService(match).$update($scope.successUpdate, $scope._error);
    }
  }

  /*
   * Initial page load
   */
  $scope.loadMatches();
}]);
