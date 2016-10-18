/**
 * Service for the generic utilities required for showing data
 */
'use strict';

angular.module('matchminerUiApp')
    .factory('ToastService',
      ['$http', '$mdToast',
        function ($http, $mdToast) {
          return {
              'success' : function (msg, delay) {
                  var d = delay || 3000;
                  $mdToast.show(
                    $mdToast.simple()
                      .content(msg)
                      .theme("success-toast")
                      .position("top right")
                      .hideDelay(d)
                  );
              },
              'warn' : function (msg, delay) {
                  var d = delay || 3000;
                  $mdToast.show(
                    $mdToast.simple()
                      .content(msg)
                      .theme("warn-toast")
                      .position("top right")
                      .hideDelay(d)
                  );
              },
              'info' : function (msg, delay) {
                  var d = delay || 3000;
                  $mdToast.show(
                    $mdToast.simple()
                      .content(msg)
                      .theme("neutral-toast")
                      .position("top right")
                      .hideDelay(d)
                  );
              }
          }
        }
      ]);

