caribbeanWarApp.controller('worldCtrl', ['$scope', '$state', '$rootScope', 'connection', 'userStorage',
	function ($scope, $state, $rootScope, connection, userStorage) {

		if (!userStorage.status()) {
			$rootScope.$emit('close', false);
		}

		$scope.user = userStorage.get();

		$scope.sailsMode = 0;
		$scope.wheelMode = 0;
		$scope.baseHealth = userStorage.getShip().hp || 0;
		$scope.currentHealth = $scope.baseHealth;

		$scope.position = {};

		$scope.hit = function (damage) {
			$scope.currentHealth -= damage || 100;
		};

		$rootScope.$on('hit', function (event, details) {
			$scope.hit(details.damage);
		});

		$rootScope.$on('miss', function (event, details) {
			//miss actions
		});

		$rootScope.$on('movementKey', function (event, command) {
			if (connection.status() && $scope.user.id) {
				connection.send('move', {
					type: command
				});
			}
		});

		$rootScope.$on('move', function (event, command) {
			if ($scope.user.id != command.id) return;
			switch (command.type) {
			case 'upward':
				$scope.sailsMode = Math.min($scope.sailsMode + 1, 3);
				$('#sails').width(($scope.sailsMode * 100 / 3) + '%');
				break;
			case 'backward':
				$scope.sailsMode = Math.max($scope.sailsMode - 1, 0);
				$('#sails').width(($scope.sailsMode * 100 / 3) + '%');
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

		$rootScope.$on('position', function (event, details) {
			$('#coordXS').text(details.x.toFixed(2));
			$('#coordYS').text(details.y.toFixed(2));
			$('#coordAlphaS').text(details.alpha.toFixed(2));

			update(function () {
				$scope.position = details;
			});

		});

		function update(fn) {
			var phase = $scope.$root.$$phase;

			if (phase == '$apply' || phase == '$digest') {
				if (fn && (typeof (fn) === 'function')) {
					fn();
				}
			} else {
				$scope.$apply(fn);
			}
		}
	}
]);
