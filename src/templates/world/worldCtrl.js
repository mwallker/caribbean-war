caribbeanWarApp.controller('worldCtrl', ['$scope', '$state', '$rootScope', 'connection', 'userStorage',
	function ($scope, $state, $rootScope, connection, userStorage) {
		//var canvas = $('#renderCanvas');

		if (!userStorage.status()) {
			connection.close();
			userStorage.reset();
			$state.go('login');
		}

		$scope.user = userStorage.get();
		/*
				canvas.on('movementKey', function (event, data) {

				});
		*/
	}
]);
