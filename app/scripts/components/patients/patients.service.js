/**
 * Service for the patient data resource accessors
 */
'use strict';

angular.module('matchminerUiApp')
    .factory('PatientsService',
      ['$http', '$resource', 'ENV',
        function ($http, $resource, ENV) {
          return $resource(ENV.endpoint, {
              columnName: '@columnName',
              columnValue: '@columnValue'
          },
           {
              'queryPrimaryOrgan' : {
                'method': 'GET',
                'url': ENV.endpoint + '/utilities/distinct/patient',
                isArray: true
              },
              'queryOncotreeDiagnosis' : {
                'method': 'GET',
                'url': ENV.endpoint + '/utilities/distinct/patient',
                isArray: true
              }
          });
        }
      ]);

