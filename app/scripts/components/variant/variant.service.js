/**
 * Service for accessing the Genes Resource
 */

'use strict';

angular.module('matchminerUiApp')
    .factory('VariantService',
      ['$http', '$resource', 'ENV',
        function ($http, $resource, ENV) {
          return $resource(ENV.apiEndpoint, {
            geneSymbol : '@geneSymbol',
            transcriptExon: '@transcriptExon',
            proteinChange: '@proteinChange',
            entrezGeneId: '@entrezGeneId'
          }, {
              'findAll': {
                url: ENV.apiEndpoint + '/gene',
                method: 'GET',
                isArray: false,
                cancellable: true
              },
              'queryHugoGeneSymbol' : {
                url: ENV.apiEndpoint + '/gene/search/searchHugo?hugoGeneSymbol=:geneSymbol',
                method: 'GET',
                isArray: false,
                cancellable: true
              },
              'queryProteinChange' : {
                url: ENV.apiEndpoint + '/variant/search/searchProteinChange?proteinChange=:proteinChange&entrezGeneId=:entrezGeneId',
                method: 'GET',
                isArray: false,
                cancellable: true
              },
              'queryTranscriptExon' : {
                url: ENV.apiEndpoint + '/variant/search/searchTranscriptExon?transcriptExon=:transcriptExon&entrezGeneId=:entrezGeneId',
                method: 'GET',
                isArray: false,
                cancellable: true
              }
          });
        }
      ]);

