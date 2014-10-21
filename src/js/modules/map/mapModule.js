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
            	};
            },
            controller:function($scope, $rootScope){
                $scope.showChat = false;

                $scope.toogleMap = function(event){
                    $scope.showChat = !$scope.showChat;
                    $scope.$apply();
                };

                $rootScope.$on('toogleMap', $scope.toogleMap);
            }    
        };
    });