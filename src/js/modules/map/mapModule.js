caribbeanWarApp
	.directive('worldMap', function () {
        return { 
            templateUrl: 'js/modules/map/map-template.html',
            restrict: 'E',
            scope:{},
            link:function($scope){
            	$scope.position = {
            		x:0,
            		y:0
            	}
            }    
        };
    });