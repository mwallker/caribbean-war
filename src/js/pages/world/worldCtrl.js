caribbeanWarApp.controller('worldCtrl', ['$scope', '$state', '$rootScope', 'connection', 'userStorage', 'shipControl', 
	function ($scope, $state, $rootScope, connection, userStorage, shipControl) {
		console.log("World CTRL");

		if(!userStorage.status()){
			connection.close();
			userStorage.reset();
			$state.go('login');
		}

		$scope.user = userStorage.get();
		$scope.showMenu = false;
		$scope.showMap = false;

		$scope.options = [
            {
                name:"Resume",
                action:function(){
                    $scope.showMenu = false;
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

		$scope.toogleMap = function(){
			$scope.showMap = !$scope.showMap;		
        };

		$scope.toogleMenu = function(){
			$scope.showMenu = !$scope.showMenu;
		};

		//Keyboard events
		KeyboardJS.on('esc', function(){
			$scope.toogleMenu();
		});

		KeyboardJS.on('m', function(){
			if(!$("input").is(':focus')){
				$scope.showMenu = !$scope.showMenu;
				console.log($scope.showMenu);
			}
		});                                
	}
]);