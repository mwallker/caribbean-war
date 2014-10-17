angular.module('caribbean-war').controller('worldCtrl', function ($scope, $rootScope, $state, connection, userStorage) {
	console.log("World CTRL");

	$scope.user = userStorage.get();

	$scope.ship = {
		speed:0
	}

	if(!userStorage.status()){
		connection.close();
		userStorage.reset();
		$state.go('login');
	}
});