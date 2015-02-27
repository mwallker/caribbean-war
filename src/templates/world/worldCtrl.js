caribbeanWarApp.controller('worldCtrl', ['$scope', '$state', '$rootScope', 'connection', 'userStorage',
	function ($scope, $state, $rootScope, connection, userStorage) {
		console.log("World CTRL");

		if (!userStorage.status()) {
			connection.close();
			userStorage.reset();
			$state.go('login');
		}

		$scope.user = userStorage.get();
	}
]);
