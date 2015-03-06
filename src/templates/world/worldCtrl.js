caribbeanWarApp.controller('worldCtrl', ['$scope', '$state', '$rootScope', 'connection', 'userStorage',
	function ($scope, $state, $rootScope, connection, userStorage) {

		if (!userStorage.status()) {
			connection.close();
			userStorage.reset();
			$state.go('login');
		}

		$scope.user = userStorage.get();

		$scope.sailsMode = 0;
		$scope.wheelMode = 0;

		$rootScope.$on('movementKey', function (event, command) {
			if (connection.status() && $scope.user.id) {
				connection.send('move', {
					type: command
				});
			}
		});

		$rootScope.$on('move', function (event, command) {
			switch (command.type) {
			case 'upward':
				$scope.sailsMode = Math.min($scope.sailsMode + 1, 3);
				break;
			case 'backward':
				$scope.sailsMode = Math.max($scope.sailsMode - 1, 0);
				break;
			case 'right':
				$scope.wheelMode = 1;
				break;
			case 'left':
				$scope.wheelMode = -1;
				break;
			case 'none':
				$scope.wheelMode = 0;
				break;
			default:
				break;
			}
		});

	}
]);
