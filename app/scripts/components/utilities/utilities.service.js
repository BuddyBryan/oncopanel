/**
 * Service for the generic utilities required for showing data
 */
'use strict';

angular.module('matchminerUiApp')
    .factory('UtilitiesService',
      ['$http', '$resource', 'ENV',
        function ($http, $resource, ENV) {
          return $resource(ENV.endpoint, {
            'genomicFilterId': '@genomicFilterId'
          },
           {
              'convertGeneIdArrayToSymbol' : {
                'method': 'POST',
                'url': ENV.endpoint + '/utilities/geneConversion',
                isArray: false
              },
              'genomicFilterLookup' : {
                'method': 'POST',
                'url': ENV.endpoint + '/utilities/genomicFilterLookup',
                isArray: false
              },
              'intermediateMatchCount' : {
                'method': 'POST',
                'url': ENV.endpoint + '/utilities/intermediateMatchCount',
                isArray: false
              },
             'filterMatchCount' : {
                'method': 'GET',
                'url': ENV.endpoint + '/utilities/matchCount/:genomicFilterId',
                isArray: false
              }
          });
        }
      ]);

