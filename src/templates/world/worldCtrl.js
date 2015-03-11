caribbeanWarApp.controller('worldCtrl', ['$scope', '$state', '$rootScope', 'connection', 'userStorage',
	function ($scope, $state, $rootScope, connection, userStorage) {

		if (!userStorage.status()) {
			$rootScope.$emit("close", false);
		}

		$scope.user = userStorage.get();

		$scope.sailsMode = 0;
		$scope.wheelMode = 0;
		$scope.baseHealth = userStorage.getShip().hp || 0;
		$scope.currentHealth = $scope.baseHealth;

		$scope.hit = function () {
			$scope.currentHealth -= 10;
		};

		$rootScope.$on('hit', function (event, details){
			$scope.hit();
		});

		$rootScope.$on('miss', function (event, details){
			//miss actions
		});

		$rootScope.$on('shoot', function (event, details){
			//some shoot actions
		});

		$rootScope.$on('exitWorld', function (event){
			//connection.send('exitWorld', '');
			$state.go('harbor');
		});

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
