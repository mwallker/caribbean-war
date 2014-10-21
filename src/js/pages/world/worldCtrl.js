caribbeanWarApp.controller('worldCtrl', ['$scope', '$state', '$rootScope', 'connection', 'userStorage', 'shipControl', 
	function ($scope, $state, $rootScope, connection, userStorage, shipControl) {
		console.log("World CTRL");

		$scope.user = userStorage.get();

		if(!userStorage.status()){
			connection.close();
			userStorage.reset();
			$state.go('login');
		}

		//Keyboard events
		KeyboardJS.on('esc', function(){
			$rootScope.$emit('toogleMenu');
		});

		KeyboardJS.on('m', function(){
			if(!$("input").is(':focus')){
				$rootScope.$emit('toogleMap');	
			}
		});
	}
]);