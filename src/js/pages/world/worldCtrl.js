angular.module('caribbean-war').controller('worldCtrl', function ($scope, $rootScope, $state, connection, userStorage) {
	console.log("World CTRL");

	$scope.user = userStorage.get();

	if(!userStorage.status()){
		connection.close();
		userStorage.reset();
		$state.go('login');
	}
});