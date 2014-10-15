angular.module('caribbean-war')
    .directive('loader', function (){
    	return { 
            templateUrl: 'js/modules/loader/loader-template.html',
            restrict: 'E',
            scope:{},
            controller: function ($scope, $element, $attrs, events) {

            	$scope.loading = function(condition){

            	};

                events.subscribe('loading', $scope.loading, $scope);
            }           
        }
    });