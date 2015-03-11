angular.module('caribbean-war').controller('harborCtrl', function ($scope, $rootScope, $state, connection, userStorage) {
	//SCENE INIT
	if (!userStorage.status()) {
		$rootScope.$emit('close', false);
	} else {
		$scope.user = userStorage.get();
		$scope.ships = userStorage.get().ships;

		$scope.selectedShip = (($scope.ships && $scope.ships.length) ? $scope.ships[0] : {
			id: 0
		});

		angular.forEach($scope.ships, function (value, key) {
			value.selected = false;
			if (value.id == $scope.selectedShip.id) {
				value.selected = true;
			}
		});
	}

	$scope.pickShip = function (index) {
		if ($scope.selectedShip.id != $scope.ships[index].id) {
			angular.forEach($scope.ships, function (value, key) {
				value.selected = false;
			});
			$scope.ships[index].selected = true;
			$scope.selectedShip = $scope.ships[index];
		}
	};

	$scope.toWorld = function () {
		if ($scope.selectedShip.id) {
			/*$rootScope.$emit('send', {action:'enterWorld', details:{
				shipId: +$scope.selectedShip.id
			}});*/
			$rootScope.loading = true;
			connection.send('enterWorld', {
				shipId: +$scope.selectedShip.id
			});
		} else {
			$rootScope.$emit('error', '');
		}
	};

	$scope.enterWorld = function (event, details) {
		if (details.success === true) {
			userStorage.setNeighbors(details);
			userStorage.setShip(details);
			$state.go('world');
		}
	};

	$rootScope.$on('enterWorld', $scope.enterWorld);
});
