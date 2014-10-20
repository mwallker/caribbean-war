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
			console.log('esc');
		});

		KeyboardJS.on('m', function(){
			console.log('map');
		});
	}
]);