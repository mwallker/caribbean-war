caribbeanWarApp
	.directive('gameMenu', function () {
        return { 
            templateUrl: 'js/modules/menu/menu-template.html',
            restrict: 'E',
            scope:{},
            link:function($scope){
				$scope.options = [
					"Settings",
					"Exit"
				];
            },
            controller:function($scope, $rootScope){
            	$scope.showMenu = false;

                $scope.toogleMenu = function(event){
                    $scope.showMenu = !$scope.showMenu;
                    $scope.$apply();
                };

                $rootScope.$on('toogleMenu', $scope.toogleMenu);
            }    
        };
    });