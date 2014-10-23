caribbeanWarApp
	.directive('gameMenu', ['$state', 'connection', function ($state, connection) {
        return { 
            templateUrl: 'js/modules/menu/menu-template.html',
            restrict: 'E',
            scope:{},
            link:function($scope, $rootScope){
				$scope.options = [
                    {
                        name:"Resume",
                        action:function(){
                            $scope.showMenu = true;
                        }
                    },
					{
                        name:"Settings",
                        action:function(){

                        }
                    },
					{
                        name:"Exit",
                        action:function(){
                            connection.send("exitWorld", {});
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