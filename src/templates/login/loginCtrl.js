angular.module('caribbean-war').controller('loginCtrl', function ($scope, $rootScope, $interval, $state, connection, userStorage) {
	$scope.email = localStorage.email || "";
	$scope.rememberUser = !!localStorage.email;
	$scope.status = -1;

	$rootScope.authorized = false;
	$rootScope.loading = false;


	connection.testConnection();
	var stopConnectionUpdate = $interval(function () {
		connection.testConnection();
	}, 3000);

	if (connection.status()) {
		$rootScope.$broadcast('close', '');
	}

	$scope.submit = function () {
		localStorage.email = $scope.rememberUser ? $scope.email : '';
		$rootScope.loading = true;

		var credits = {
			login: $scope.email,
			password: new jsSHA(($scope.password).toString(), 'TEXT').getHash('SHA-256', 'HEX')
		};

		$rootScope.$emit('open', credits);
	};

	$scope.authorize = function (event, data) {
		if (data) {
			if (data.authorize) {
				userStorage.set(data);
				$interval.cancel(stopConnectionUpdate);
				$state.go('harbor');
			} else {
				if (data.inGame) {
					$rootScope.$emit('error', 'ERRORS_IN_GAME');
				} else {
					$rootScope.$emit('error', 'ERRORS_AUTH');
				}

			}
		}
	};

	$scope.resetPassword = function () {
		$.ajax({
			url: 'http://localhost:1337/caribbean/users',
			type: 'GET',
			crossDomain: true,
			success: function (resp) {
				console.log(resp);
			}
		});
	};

	$scope.setStatus = function (event, value) {
		$scope.status = value;
	}

	$scope.registRequest = function () {

	};

	$scope.close = function (event, message) {
		connection.close();
		userStorage.reset();
		$state.go('login');
	};

	$rootScope.$on('status', $scope.setStatus);
	$rootScope.$on('auth', $scope.authorize);
	$rootScope.$on('close', $scope.close);
});
