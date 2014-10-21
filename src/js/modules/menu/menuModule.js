caribbeanWarApp
	.directive('gameMenu', ['$state', function ($state) {
        return { 
            templateUrl: 'js/modules/menu/menu-template.html',
            restrict: 'E',
            scope:{},
            link:function($scope){
				$scope.options = [
					{
                        name:"Settings",
                        action:function(){

                        }
                    },
					{
                        name:"Exit",
                        action:function(){
                            $state.go('harbor');
                        }
                    }
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
    }]);