caribbeanWarApp.controller('worldCtrl', ['$scope', '$state', '$rootScope', 'connection', 'userStorage',
	function ($scope, $state, $rootScope, connection, userStorage) {

		if (!userStorage.status()) {
			connection.close();
			userStorage.reset();
			$state.go('login');
		}

		$scope.user = userStorage.get();

		$rootScope.$on('movementKey', function (event, command) {
			if (connection.status() && $scope.user.id) {
				connection.send('move', {
					type: command
				});
			}
		});

	}
]);
