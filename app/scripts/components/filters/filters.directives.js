'use strict';

angular.module('matchminerUiApp')
    .directive("formOnChange", function($parse){
      /**
       *  Form change directive.
       * Attach 'form-on-change' attribute to a form
       * form-on-change takes a callback function to call when a value has changed
       * in one of the input fields in the form
       * Ex: 'form-on-change="callback()"'
       *
       * It is possible to add a 'critical-match-change' attribute to the form element.
       * this boolean indicated whether the directive should only listen to changes
       * in input elements with a 'is-match-critical' attribute.
       *
       * Ex: '<form form-on-change critical-match-change="true" ...> </form>'
       *     '<input is-match-critical />'
       *
       * Note: This only works for input components
       **/
      return {
        require: "form",
        scope: {
          criticalMatchChangeElement: "=criticalMatchChange"
        },
        link: function(scope, element, attrs){
           console.log("Only critical components ", scope.criticalMatchChangeElement)
           var cb = $parse(attrs.formOnChange);
           element.on("change", function(e){
              if (scope.criticalMatchChangeElement) {
                if (!!$(e.target).is('[is-match-critical]')){
                  cb(scope);
                }
              } else {
                cb(scope);
              }
           });
        }
      }
    });

angular.module('matchminerUiApp')
    .directive("genomicFilterBadge", function(){
      {
        return {
          restrict: "E",
          scope: {
            filter: "="
          },
          template: "<md-chips><md-chip class='geneBadge' style='background-color: {{ filter.atomicRule.badgeColor }}; color: {{ filter.atomicRule.badgeTextColor || black}}'>{{ filter.atomicRule.label }}</md-chip></md-chips>"
        }
      }
    });

