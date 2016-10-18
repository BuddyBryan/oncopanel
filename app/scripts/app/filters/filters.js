'use strict';

/**
 * @ngdoc function
 * @name matchminerUiApp.controllerMatchesCtrl:
 * @description
 * # MatchesCtrl
 * Matches Controller of the matchminerUiApp
 */
angular.module('matchminerUiApp')
  .controller('FilterWizardCtrl',
    [ '$scope', '$rootScope', '$document', '$q', 'VariantService',
      'FiltersService', 'ToastService', 'UtilitiesService',
      'PatientsService', '$mdDialog',
    function ($scope, $rootScope, $document, $q, VariantService,
              FiltersService, ToastService, UtilitiesService,
              PatientsService, $mdDialog
     ) {

      /*
       * Filter wizard
       */
      $scope.options = {};
      $scope.options.cancerTypes = {
        'all' : 'All Cancer Types',
        'specific' : 'Specific Cancer Type'
      };

      $scope.options.genders = {
        'null' : 'All',
        'male' : 'Male',
        'female' : 'Female'
      };

      $scope.genomicAlterations = {
        'SNP' : 'Mutation',
      //  'HA' : 'High Amplification',
      //  '2DEL' : 'Deletion',
        'DEL' : 'Deletion',
        'INS' : 'Insertion'
        //'TRL' : 'Fusion',
        //'WLD' : 'Wildtype'
      };

      // Required variables
      $scope._teamId = $rootScope._teamId || 1;
      $scope._userId = $rootScope._userId || 1;
      $scope._page = 0;
      $scope._size = 10;
      $scope._sort = '';
      $scope.currentPage = 1;

      $scope.query = {
        'size': $scope._size,
        'sort' : $scope._sort,
        'page': $scope._page
      };

      $scope._geneAutocompleteChange = function(gene) {
         if (!!gene) {
          console.log("Auto change gene ", gene);
          $scope.genomicFilter.variantRule.entrezGeneId = gene.entrezGeneId;

          if ($scope.genomicFilter.atomicRule.label === null) {
             $scope.genomicFilter.atomicRule.label = gene.hugoGeneSymbol;
          }
           console.log("calling fetch Inter Filter results ", $scope.genomicFilter);
           $scope.fetchIntermediateFilterResults($scope.genomicFilter);
         }
      }

      $scope.loadGeneData = function (query) {
          var data = {geneSymbol: query};
          return VariantService.queryHugoGeneSymbol(data).$promise.then( function(res){
             if (!!res._embedded.gene) {
                var geneArr = res._embedded.gene.map( function(i){
                  return {
                    'entrezGeneId' : i.entrezGeneId,
                    'hugoGeneSymbol' : i.hugoGeneSymbol
                  }
                });
                return geneArr;
             }
          });
      };

      $scope.loadOrganData = function (query) {
          var data = {
            columnName: 'primaryOrgan',
            columnValue: query
          };

          return PatientsService.queryPrimaryOrgan(data).$promise.then( function(res){
             console.log("PO ", res);
             return res;
          });
      };

      $scope.loadOncotreeData = function (query) {
          var data = {
            columnName: 'oncotreeDiagnosis',
            columnValue: query
          };

          return PatientsService.queryOncotreeDiagnosis(data).$promise.then( function(res){
             console.log("OT ", res);
             return res;
          });
      };

       $scope.loadProteinData = function (query) {
           console.log("gen dat : ", $scope.genomicFilter);
           var data = {
              proteinChange: query,
              entrezGeneId: $scope.genomicFilter.variantRule.entrezGeneId
           };
           return VariantService.queryProteinChange(data).$promise.then( function(res){
              console.log("Success! ", res);
              return res._embedded.variant.map( function(v) {
                return v.proteinChange;
              });
           });
       };

      $scope.loadTranscriptExonData = function (query) {
           console.log("gen dat : ", $scope.genomicFilter);
           var data = {
              transcriptExon: query,
              entrezGeneId: $scope.genomicFilter.variantRule.entrezGeneId
           };
           return VariantService.queryTranscriptExon(data).$promise.then( function(res){
              console.log("Success! ", res);
              return res._embedded.variant.map( function(v) {
                 return v.transcriptExon;
               });;
           });
       };

      /* Wizard navigation */
      $scope.nextTab = function() {
        $scope.selectedTab += 1;
      }

      $scope.previousTab = function() {
        $scope.selectedTab -= 1;
      }

      /*
       * Filters overview
       */
       $scope.filters = {};
       $scope.filterStates = {
          '-' : 'All',
          '0' : 'Inactive',
          '1' : 'Active'
       };

       $scope.filterStatuses = {
         '0' : {
          status : 'Inactive',
          toggleAction : 'Activate'
         },
         '1' : {
          status : 'Active',
          toggleAction : 'Deactivate'
         }
       };

      $scope.filterQuery = {};
      $scope.filterQuery.status = '-';

      var _successIntermediateFilterQuery = function(res) {
        console.log("Successfully retrieved intermediate genomic filter results ", res);
      };

      var _errorIntermediateFilterQuery = function(err) {
        console.log("Error while querying the intermediate genomic filters ", err);
        ToastService.warn("Error while fetching intermediate genomic filter data. ", err);
      }

        /**
         * Save a new genomicfilter created in the wizard and notify user
         */
       $scope.saveGenomicFilter = function(filter) {
          console.log("Saving genomic filter ", filter);
          console.log("Deleting variant classification for now");
          if (!!filter.patientRule && filter.patientRule.gender === 'null') {
            delete filter.patientRule.gender;
          }
          filter.status = 1;

          FiltersService.saveGenomicFilter(filter)
            .$promise
            .then( function (){
                // Show success msg
                ToastService.success("Successfully saved genomic filter");
                //$scope.clearForm();
                $mdDialog.cancel();
             })
            .then( $scope.loadAvailableFilters )
            .catch( function(err){
              console.log("caught err in promise ", err);
              ToastService.warn(err)
            });
       }

      /**
        * Update a previously stored genomicfilter in the backend and notify user
        */
       $scope.updateGenomicFilter = function(filter) {
          delete filter.variantRule['validProperties'];
          delete filter.patientRule['validProperties'];
          console.log("Deleting variant classification for now");

          FiltersService.updateGenomicFilter(filter)
            .$promise
            .then( function (){
                // Show success msg
                ToastService.success("Successfully updated genomic filter");
                // Clear form
                //$scope.clearForm();
                $mdDialog.cancel();
            })
            .then( $scope.loadAvailableFilters )
            .catch( function(err){
              console.log("caught err in promise ", err);
              ToastService.warn(err)
            });
       }

        /* Perform animated scroll to the Genomic Filter Table section */
       var _scrollToFilterTable = function() {
         var filtersTable = angular.element(document.getElementById('genomicFilterTable'));
         return $document.scrollToElementAnimated(filtersTable, 150, 500);
       }

        /* Perform animated scroll to the Genomic Filter Wizard section */
       var _scrollToFilterWizard = function() {
         var filtersWizard = angular.element(document.getElementById('genomicFilterWizard'));
         return $document.scrollToElementAnimated(filtersWizard, 150, 500);
       }

      $scope.toggleAlteration = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
      };
      $scope.hasAlteration = function (item, list) {
        if(!list) {
          list = [];
          //$scope.genomicFilter.variantRule.variantClassification = list;
        };

        return list.indexOf(item) > -1;
      };

      /*
       * Clear the scope genomicFilter object and result values to reset the form and scope to the initial state
       */
       $scope.clearForm = function() {
         $scope.genomicFilter = {};
         $scope.genomicFilter.atomicRule = {};
         $scope.genomicFilter.teamId = $scope._teamId;
         $scope.genomicFilter.userId = $scope._userId;
         $scope.genomicFilter.atomicRule = {};
         $scope.genomicFilter.atomicRule.badgeTextColor = "black";
         $scope.genomicFilter.variantRule = {};
         //$scope.genomicFilter.variantRule.variantClassification = [];
         $scope.data = {};
         $rootScope.loadedGenomicFilter = false;
       }

      var _errorQuery = function(err) {
        console.log("Error while querying the genomic filters ");
        ToastService.warn("Error while fetching genomic filters.");
      }

       $scope.isValidFilter = function(gf){
          if (!gf
              || !gf.atomicRule
              || !gf.atomicRule.label
              || !gf.atomicRule.description
              && (gf.variantRule.gene || gf.patientRule.cancerType != null)) {
                return false;
              }

          return true;
       }

      // Init on page load
      //$rootScope.clearForm();

      $scope.fetchIntermediateFilterResults = function(genomicFilter) {
        console.log("Fetching match data ", genomicFilter);
        if (!genomicFilter.variantRule && !genomicFilter.patientRule) {
          console.log("No rules to fetch for" , genomicFilter);
          return false;
        }

        // Sanitize validProperties from previously saved genomic filter

        ToastService.info("Updating match data preview");

        $('#emptyPlot').hide();
        $('#noPlotData').hide();
        $('#loadingPlot').show();

        /*
         * If genomic filter is loaded or a previously saved genomic filter
         * then do not change the status and just fetch the match results
         * If it is a new genomic filter then save the intermediate filter (status 2)
         * and count matches.
         */
        if ( $rootScope.loadedGenomicFilter || ( genomicFilter.status == 1 && genomicFilter.id)) {
          _filterMatchCount(genomicFilter)
            .then( function(filterCounts) {
              $scope.plotIntermediateMatchCounts(filterCounts);
            })
            .catch(_errorQuery);
        } else {
          // Force to intermediate status.
          genomicFilter.status = 2;
          FiltersService.saveGenomicFilter(genomicFilter)
            .$promise
            .then(function (gf){
              console.log("res ", gf);
              return _filterMatchCount(gf);
            })
           .then( function(filterCounts){
              console.log("Intermediate results. ", filterCounts);
              $scope.plotIntermediateMatchCounts(filterCounts);
            })
            .catch(_errorQuery);
        }

        console.log("Form updated console ", genomicFilter);
      }

      var _filterMatchCount = function(filter) {
        console.log("Filter ID", filter);
        var gf = {};
        gf.genomicFilterId = filter.genomicFilterId;
        return UtilitiesService.filterMatchCount(gf).$promise;
      }

        /*
         * Generate a plotly graph to plot the intermediate match results.
         * @param Object with matchcounts per filter category (AtomicRule, PatientRule, VariantRule)
         */
        $scope.plotIntermediateMatchCounts = function(matchCount) {
          var xAxis = [];
          var yAxis = [];

          /*
           * Filter didn't yield results. Show text.
           */
          if (matchCount.atomicRule == 0) {
            $('#loadingPlot').hide();
            $('#genomicFilterPlot').hide();
            $('#plotResults').show();
            $('#noPlotData').show();
            return false;
          }


          /* Check all the available filters */
          if (matchCount.hasOwnProperty('atomicRule')) {
            yAxis.push('Matches');
            xAxis.push(matchCount['atomicRule']);
          }

          if (matchCount.hasOwnProperty('patientRule') && matchCount.patientRule > 0) {
            yAxis.push('Demographic');
            xAxis.push(matchCount['patientRule']);
          }

          if (matchCount.hasOwnProperty('variantRule') && matchCount.variantRule > 0) {
            yAxis.push('Genomic');
            xAxis.push(matchCount['variantRule']);
          }

          	// define the trace.
        	var trace1 = {
          		x: xAxis,
          		y: yAxis,
          		name: 'Patient matching counts',
          		orientation: 'h',
          		marker: {
            		color: 'rgba(55,128,191,0.6)',
            		width: 0.55
          		},
          		type: 'bar'
        	};

        	// build data array.
        	var data = [trace1];

        	// set layout.
        	var layout = {
          		title: 'Genomic Filter Yield Statistics',
          		barmode: 'stack',
          		margin: {
          			l: 100
          		}
        	};

          if ($('#plotResults').is(":visible")) {
            $('#plotResults').hide();
          }

            $('#genomicFilterPlot').show();
        		// create the plot
          	Plotly.newPlot('genomicFilterPlot', data, layout);
        }

        /*
         * Filter wizard dialog
         */
         $scope.hide = function(){
           $mdDialog.hide();
         }

         $scope.cancel = function(){
           $mdDialog.cancel();
         }

      /*
       * If no genomic filter is loaded then initialize model
       */
      if (!$scope.genomicFilter) {
        $scope.clearForm();
      }
  }]);

angular.module('matchminerUiApp')
  .controller('FiltersCtrl',
    [ '$scope', '$rootScope', '$q', '$mdDialog', 'FiltersService', 'ToastService', 'UtilitiesService',
    function ($scope, $rootScope, $q, $mdDialog, FiltersService, ToastService, UtilitiesService
     ) {
      $rootScope.loadedGenomicFilter = false;
      $scope._teamId = $rootScope._teamId || 1;
      $scope._userId = $rootScope._userId || 1;
      $scope._page = 0;
      $scope._size = 10;
      $scope._sort = '';
      $scope.currentPage = 1;

      $scope.query = {
        'size': $scope._size,
        'sort' : $scope._sort,
        'page': $scope._page
      };

      /**
       * Load all the previously stored genomic filters using the resource.
       * returns: promise
       */
      $scope.loadAvailableFilters = function() {
        var deferred = $q.defer();

        console.log("Loading filters");
        // Query available filters
        var q = {
          'teamId': Number($scope._teamId)
        }
        console.log(q);
        return FiltersService.findAllNonTemp(q).$promise.then(_successFilterQuery, _errorQuery).$promise;
      }

       /*
        * Handle server side ordering of one of the columns.
        */
       $scope.onOrderChange = function (order) {
         $scope.query.sort = $scope.sortOrder.charAt(0) == '-' ? order.substr(1) +',asc' : order+',desc';
         return FiltersService.findAll($scope.query, $scope.successQuery, $scope._errorQuery).$promise;
       };

       /*
        * Handle pagination of the md-data-table and query backend
        */
       $scope.onPaginationChange = function (page, limit) {
         $scope.query.page = page-1;
         $scope.query.size = limit;
         return FiltersService.findAll($scope.query, $scope._successQuery, $scope._errorQuery).$promise;
       };

      var _successFilterQuery = function(res) {
        console.log("Successfully queried the genomic filters ", res);
        $scope.totalElements = res.page.totalElements;
        $scope.currentPage = res.page.number+1;
        $scope.filters = res._embedded.genomicFilter;
      };

      var _errorQuery = function(err) {
        console.log("Error while querying the genomic filters ");
        ToastService.warn("Error while fetching genomic filters.");
      }

      /*
       * Filter wizard dialog
       */
       $scope.showWizardDialog = function() {
         $mdDialog.show({
           scope: $scope,
           preserveScope: true,
           templateUrl: 'scripts/app/filters/filterwizard.html',
           parent: angular.element(document.body),
           clickOutsideToClose: false
         });
       };

      $scope.statusChange = function(filter) {
        console.log("Changing status to ", filter);
        var gf = {};
        gf.genomicFilterId = filter.genomicFilterId;
        gf.status = filter.status;
        gf.teamId = filter.teamId;
        gf.userId = filter.userId;

        var state = filter.status === 0 ? "deactivated" : "activated";
        var stateNoun = filter.status === 0 ? "deactivating" : "activating";

        FiltersService.updateGenomicFilter(gf)
          .$promise
          .then( $scope.loadAvailableFilters )
          .then( function (){
            // Show update success msg
            ToastService.success("Successfully " + state + " the genomic filter");
          })
          .catch( function(err){
            console.log("caught err in promise ", err);
            ToastService.warn("Error while " + stateNoun + " the genomic filter");
          });
       }

       /*
        * Utilities Section
        * Load scope and wizard with a previously persisted and retrieved genomic filter
        */
       $scope.loadEditGenomicFilter = function(filter) {
          console.log("Editing filter", filter);
          console.log("Removing validProperties from loading object.");
          $scope.clearForm();

          if (!!filter.variantRule) {
            delete filter.variantRule['validProperties'];
          }

          if (!!filter.patientRule.validProperties) {
            delete filter.patientRule['validProperties'];
          }
          $scope.genomicFilter = filter;

          // Convert entrezGeneId to hugoGeneSymbol
          if (filter.variantRule.entrezGeneId) {
            var entrezId = filter.variantRule.entrezGeneId;
            new UtilitiesService([entrezId]).$convertGeneIdArrayToSymbol( function(res) {
              $scope.data.selectedGene = {
                entrezGeneId : entrezId,
                hugoGeneSymbol: res[entrezId]
              }
            });
          }

          $rootScope.loadedGenomicFilter = true;
          //_scrollToFilterWizard();

          $scope.genomicFilter = filter;

          ToastService.success("Successfully loaded genomic filter");
          $scope.showWizardDialog();
       }

       $scope.clearForm = function() {
         $scope.genomicFilter = {};
         $scope.genomicFilter.atomicRule = {};
         $scope.genomicFilter.teamId = $scope._teamId;
         $scope.genomicFilter.userId = $scope._userId;
         $scope.genomicFilter.atomicRule = {};
         $scope.genomicFilter.atomicRule.badgeTextColor = "black";
         $scope.genomicFilter.variantRule = {};
         //$scope.genomicFilter.variantRule.variantClassification = [];
         $scope.data = {};
         $rootScope.loadedGenomicFilter = false;
       }

      /* Init data used in page */
      $scope.loadAvailableFilters();
 }]);
