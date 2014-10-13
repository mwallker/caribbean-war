angular.module('caribbean-war').controller('harborCtrl', function ($scope, $state, connection, events, userStorage) {
	console.log(userStorage.status());

	if(!userStorage.status()){
		$scope.exit();
	}

	$scope.exit = function(){
		userStorage.reset();
		connection.close();
		$state.go('login');
	}
});