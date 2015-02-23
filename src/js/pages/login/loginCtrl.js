angular.module('caribbean-war').controller('loginCtrl', function ($scope, $rootScope, $state, connection, userStorage) {
	$scope.email = localStorage.email || "";
	$scope.rememberUser = !!localStorage.email;
	$rootScope.authorized = false;

	$rootScope.loading = false;

	if (connection.status()) {
		$rootScope.$broadcast('close', "");
	}

	$scope.connect = function () {
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
				$state.go('harbor');
			} else {
				$rootScope.$emit('error', 'ERRORS_AUTH');
			}
		}
	};

	$scope.close = function (event, message) {
		connection.close();
		userStorage.reset();
		$state.go('login');
	};

	$rootScope.$on('auth', $scope.authorize);
	$rootScope.$on('close', $scope.close);
});
