/**
 * Service for the matching overview
 */

'use strict';

angular.module('matchminerUiApp')
    .factory('MatchesService',
      ['$http', '$resource', 'ENV',
        function ($http, $resource, ENV) {
          return $resource(ENV.apiEndpoint + '/match/', {
              matchId: '@matchId',
              teamId: '@teamId',
              userId: '@userId',
              filterStatus: '@filterStatus',
              matchStatus: '@matchStatus'
          }, {
              'findAll': {
                method: 'GET',
                isArray: false
              },
              'findByStatus': {
                method: 'GET',
                url: ENV.apiEndpoint + '/match/search/findByStatus?teamId=:teamId&matchStatus=:matchStatus&filterStatus=:filterStatus',
                isArray: false
              },
               'update': {
                method: 'PATCH',
                isArray: false
              }
          });
        }
      ]);

