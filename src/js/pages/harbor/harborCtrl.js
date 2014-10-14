angular.module('caribbean-war').controller('harborCtrl', function ($scope, $state, connection, events, userStorage) {
	console.log(userStorage.status());

	$scope.user = userStorage;

	if(!userStorage.status()) {
		goToLogin();
	}

	$scope.exit = function(){
		goToLogin();
	};

	function goToLogin () {
		userStorage.reset();
		connection.close();
		$state.go('login');
	}
});