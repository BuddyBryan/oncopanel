/**
 * Service for the filter overview
 */

'use strict';

angular.module('matchminerUiApp')
    .factory('FiltersService',
      ['$http', '$resource', 'ENV',
        function ($http, $resource, ENV) {
          return $resource(ENV.apiEndpoint + '/genomicFilter/:id', {
            'id': '@genomicFilterId',
            'teamId' : '@teamId'
          }, {
              'findAll': {
                method: 'GET',
                isArray: false
              },
              'findAllNonTemp': {
                url: ENV.apiEndpoint + '/genomicFilter/search/findByTeamIdNotTemp?teamId=:teamId',
                method: 'GET',
                isArray: false
              },
              'findOne': {
                method: 'GET',
                isArray: false
              },
              'updateGenomicFilter': {
                method: 'PUT',
                isArray: false
              },
              'saveGenomicFilter': {
                method: 'POST',
                isArray: false
              }
          });
        }
      ]);

